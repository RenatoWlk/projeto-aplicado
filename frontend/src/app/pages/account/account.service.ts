// account.service.ts - Versão completa e corrigida
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environments';

// === INTERFACES ===
export interface User {
  id: string;
  name: string;
  email: string;
  bloodType: string;
  photoUrl: string;
  lastDonation: string;
  nextEligibleDonation: string;
  achievements?: Achievement[];
  role?: string;
  address?: string;
  phone?: string;
  cpf?: string;
  gender?: string;
}

export interface Campaign {
  id: string;
  title: string;
  description: string;
  active: boolean;
  startDate?: string;
  endDate?: string;
  targetBloodTypes?: string[];
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BloodBankUser extends User {
  role: 'BLOODBANK';
  address: string;
  phone: string;
  cnpj: string;
  campaigns: Campaign[];
  description?: string;
  website?: string;
  bloodInventory?: BloodInventory;
}

export interface partner extends User {
  role: 'partner';
  address: string;
  phone: string;
  cnpj: string;
  offer: Offer[];
  description?: string;
  website?: string;
}

export interface Achievement {
  title: string;
  description: string;
  points: number;
  rarity: string;
  imageUrl: string;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  active: boolean;
  validUntil?: string;
  discount?: string;
  termsAndConditions?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Questionnaire {
  date: string;
  answers: { question: string; answer: string }[];
}

export interface BloodInventory {
  bloodTypes: Record<string, BloodTypeStock>;
  lastUpdated: string;
}

export interface BloodTypeStock {
  bloodType: string;
  currentStock: number;
  minimumStock: number;
  maximumCapacity: number;
  status: 'CRITICAL' | 'LOW' | 'NORMAL' | 'HIGH';
  lastDonation: string;
}

// === REQUEST DTOs ===
export interface UserUpdateRequest {
  name: string;
  email: string;
  address: string;
  phone: string;
  cpf: string;
  gender: string;
}

export interface BloodBankUpdateRequest {
  name: string;
  email: string;
  address: string;
  phone: string;
  cnpj: string;
  description?: string;
  website?: string;
}

export interface PartnerUpdateRequest {
  name: string;
  email: string;
  address: string;
  phone: string;
  cnpj: string;
  description?: string;
  website?: string;
}

export interface OfferRequest {
  title: string;
  description: string;
  active: boolean;
  validUntil?: string;
  discount?: string;
  termsAndConditions?: string;
}

export interface CampaignRequest {
  title: string;
  description: string;
  active: boolean;
  startDate?: string;
  endDate?: string;
  targetBloodTypes?: string[];
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
}

@Injectable({ providedIn: 'root' })
export class AccountService {
  private readonly apiUrl = environment.apiUrl || 'http://localhost:8080/api';
  
  // Estados globais
  private currentUserSubject = new BehaviorSubject<User | BloodBankUser | partner | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  // === USER METHODS ===
  getUser(userId: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${userId}`)
      .pipe(catchError(this.handleError));
  }

  updateProfile(userId: string, data: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/${userId}`, data)
      .pipe(
        tap(user => this.currentUserSubject.next(user)),
        catchError(this.handleError)
      );
  }

  changePassword(userId: string, newPassword: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/users/${userId}/password`, { newPassword })
      .pipe(catchError(this.handleError));
  }

  uploadPhoto(userId: string, file: File): Observable<{photoUrl: string}> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{photoUrl: string}>(`${this.apiUrl}/users/${userId}/photo`, formData)
      .pipe(catchError(this.handleError));
  }

  getLastQuestionnaire(userId: string): Observable<Questionnaire> {
    return this.http.get<Questionnaire>(`${this.apiUrl}/users/${userId}/last-questionnaire`)
      .pipe(catchError(this.handleError));
  }

  // === BLOOD BANK METHODS ===
  getBloodBank(id: string): Observable<BloodBankUser> {
    return this.http.get<BloodBankUser>(`${this.apiUrl}/bloodbanks/${id}`)
      .pipe(catchError(this.handleError));
  }

  updateBloodBank(id: string, data: BloodBankUpdateRequest): Observable<BloodBankUser> {
    return this.http.put<BloodBankUser>(`${this.apiUrl}/bloodbanks/${id}`, data)
      .pipe(
        tap(user => this.currentUserSubject.next(user)),
        catchError(this.handleError)
      );
  }

  uploadBloodBankPhoto(id: string, file: File): Observable<{photoUrl: string}> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{photoUrl: string}>(`${this.apiUrl}/bloodbanks/${id}/photo`, formData)
      .pipe(catchError(this.handleError));
  }

  // === CAMPAIGN METHODS ===
  getCampaigns(bloodBankId: string): Observable<Campaign[]> {
    return this.http.get<Campaign[]>(`${this.apiUrl}/bloodbanks/${bloodBankId}/campaigns`)
      .pipe(catchError(this.handleError));
  }

  createCampaign(bloodBankId: string, campaign: CampaignRequest): Observable<Campaign> {
    return this.http.post<Campaign>(`${this.apiUrl}/bloodbanks/${bloodBankId}/campaigns`, campaign)
      .pipe(catchError(this.handleError));
  }

  updateCampaign(bloodBankId: string, campaignId: string, campaign: CampaignRequest): Observable<Campaign> {
    return this.http.put<Campaign>(`${this.apiUrl}/bloodbanks/${bloodBankId}/campaigns/${campaignId}`, campaign)
      .pipe(catchError(this.handleError));
  }

  deleteCampaign(bloodBankId: string, campaignId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/bloodbanks/${bloodBankId}/campaigns/${campaignId}`)
      .pipe(catchError(this.handleError));
  }

  // === PARTNER METHODS ===
  getPartner(id: string): Observable<partner> {
    return this.http.get<partner>(`${this.apiUrl}/partners/${id}`)
      .pipe(catchError(this.handleError));
  }

  updatePartner(id: string, data: Partial<partner>): Observable<partner> {
    return this.http.put<partner>(`${this.apiUrl}/partners/${id}`, data)
      .pipe(
        tap(user => this.currentUserSubject.next(user)),
        catchError(this.handleError)
      );
  }

  addOffer(partnerId: string, offer: Partial<Offer>): Observable<Offer> {
    return this.http.post<Offer>(`${this.apiUrl}/partners/${partnerId}/offers`, offer)
      .pipe(catchError(this.handleError));
  }

  updateOffer(partnerId: string, offerId: string, offer: Partial<Offer>): Observable<Offer> {
    return this.http.put<Offer>(`${this.apiUrl}/partners/${partnerId}/offers/${offerId}`, offer)
      .pipe(catchError(this.handleError));
  }

  deleteOffer(partnerId: string, offerId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/partners/${partnerId}/offers/${offerId}`)
      .pipe(catchError(this.handleError));
  }

  // === ERROR HANDLING ===
  private handleError = (error: HttpErrorResponse): Observable<never> => {
    let errorMessage = 'Erro desconhecido';
    
    if (error.error instanceof ErrorEvent) {
      // Erro do lado do cliente
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      // Erro do lado do servidor
      switch (error.status) {
        case 400:
          errorMessage = 'Dados inválidos';
          break;
        case 401:
          errorMessage = 'Não autorizado';
          break;
        case 403:
          errorMessage = 'Acesso negado';
          break;
        case 404:
          errorMessage = 'Recurso não encontrado';
          break;
        case 409:
          errorMessage = 'Conflito - dados já existem';
          break;
        case 500:
          errorMessage = 'Erro interno do servidor';
          break;
        default:
          errorMessage = `Erro ${error.status}: ${error.message}`;
      }
    }
    
    console.error('Erro na API:', error);
    return throwError(() => new Error(errorMessage));
  };

  // === MOCK DATA METHODS (para desenvolvimento) ===
  getMockUser(): User {
    return {
      id: '1',
      name: 'Pedro Silva',
      email: 'pedro@email.com',
      bloodType: 'O+',
      photoUrl: 'assets/profile2.png',
      lastDonation: '2024-05-01',
      nextEligibleDonation: '2024-08-01',
      achievements: [
        {
          title: 'Primeira Doação',
          description: 'Parabéns pela sua primeira doação!',
          imageUrl: 'assets/achievements.png',
          points: 10,
          rarity: 'comum'
        }
      ],
      role: 'USER',
      address: 'Rua das Flores, 123',
      phone: '(11) 91234-5678',
      cpf: '123.456.789-00',
      gender: 'Masculino'
    };
  }

  getMockBloodBankUser(): BloodBankUser {
    return {
      id: '2',
      name: 'Banco de Sangue Vida',
      email: 'contato@bancovida.com',
      bloodType: '',
      lastDonation: '',
      nextEligibleDonation: '',
      photoUrl: 'assets/profile2.png',
      role: 'BLOODBANK',
      address: 'Rua Central, 123',
      phone: '(11) 99999-9999',
      cnpj: '12.345.678/0001-99',
      campaigns: [
        { 
          id: '1', 
          title: 'Doe Sangue, Salve Vidas', 
          description: 'Campanha de inverno', 
          active: true,
          priority: 'HIGH'
        },
        { 
          id: '2', 
          title: 'Natal Solidário', 
          description: 'Doe antes do Natal!', 
          active: false,
          priority: 'MEDIUM'
        }
      ],
      description: 'Banco de sangue especializado em atendimento de emergência',
      website: 'https://bancovida.com'
    };
  }

  getMockPartner(): partner {
    return {
      id: '3',
      name: 'Farmácia Popular',
      email: 'contato@farmaciapopular.com',
      photoUrl: 'assets/partner.png',
      address: 'Avenida Central, 456',
      phone: '(11) 98888-7777',
      cnpj: '98.765.432/0001-11',
      role: 'partner',
      bloodType: '',
      lastDonation: '',
      nextEligibleDonation: '',
      offer: [
        { 
          id: '1', 
          title: 'Desconto em Medicamentos', 
          description: '10% de desconto para doadores', 
          active: true 
        },
        { 
          id: '2', 
          title: 'Brinde Especial', 
          description: 'Ganhe um brinde nas compras acima de R$50', 
          active: false 
        }
      ]
    };
  }

  // === UTILITY METHODS ===
  setCurrentUser(user: User | BloodBankUser | partner): void {
    this.currentUserSubject.next(user);
  }

  getCurrentUser(): User | BloodBankUser | partner | null {
    return this.currentUserSubject.value;
  }

  clearCurrentUser(): void {
    this.currentUserSubject.next(null);
  }

  isBloodBank(user: any): user is BloodBankUser {
    return user?.role === 'BLOODBANK';
  }

  isPartner(user: any): user is partner {
    return user?.role === 'partner';
  }

  isRegularUser(user: any): user is User {
    return user?.role === 'USER';
  }
}