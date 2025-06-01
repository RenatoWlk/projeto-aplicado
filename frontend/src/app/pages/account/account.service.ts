// account.service.ts - Versão corrigida para trabalhar com o backend Spring Boot
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environments';

// === INTERFACES CORRIGIDAS ===

// Address como objeto (não string)
export interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

// BloodType como enum
export enum BloodType {
  A_POSITIVE = 'A_POSITIVE',
  A_NEGATIVE = 'A_NEGATIVE',
  B_POSITIVE = 'B_POSITIVE',
  B_NEGATIVE = 'B_NEGATIVE',
  AB_POSITIVE = 'AB_POSITIVE',
  AB_NEGATIVE = 'AB_NEGATIVE',
  O_POSITIVE = 'O_POSITIVE',
  O_NEGATIVE = 'O_NEGATIVE'
}

// User base
export interface User {
  id?: string;
  name: string;
  email: string;
  password?: string;
  address: Address;
  phone: string;
  cpf: string;
  gender: string;
  bloodType: BloodType;
  timeUntilNextDonation?: string;
  lastDonationDate?: string; 
  photoUrl?: string;
  role?: 'USER' | 'BLOODBANK' | 'PARTNER';
  achievements?: Achievement[];
  lastDonation?: string; 
  nextEligibleDonation?: string; 
}

// Campaign corrigida
export interface Campaign {
  id?: string;
  title: string;
  body: string; 
  startDate: string;
  endDate: string;
  location: Address;
  phone: string;
  description?: string;
  
  active?: boolean;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  targetBloodTypes?: BloodType[];
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Offer {
  id?: string;
  partnerName: string;
  title: string;
  body: string; 
  validUntil: string;
  discountPercentage: number;
  // Campos extras do frontend
  active?: boolean;
  termsAndConditions?: string;
  createdAt?: string;
  updatedAt?: string;
}

// BloodBankUser corrigido
export interface BloodBankUser extends Omit<User, 'bloodType' | 'timeUntilNextDonation' | 'lastDonationDate'> {
  role: 'BLOODBANK';
  cnpj: string;
  campaigns: Campaign[];
  description?: string;
  website?: string;
  bloodInventory?: BloodInventory;
}

// PartnerUser corrigido (era 'partner', agora 'PartnerUser')
export interface PartnerUser extends Omit<User, 'bloodType' | 'timeUntilNextDonation' | 'lastDonationDate'> {
  role: 'PARTNER';
  cnpj: string;
  offers: Offer[]; // Mudou de 'offer' para 'offers' (plural)
  description?: string;
  website?: string;
}

// Outros tipos mantidos
export interface Achievement {
  id: string;
  title: string;
  description: string;
  points: number;
  rarity: 'comum' | 'raro' | 'épico' | 'lendário';
  imageUrl: string;
  unlockedAt?: string;
}

export interface QuestionnaireAnswer {
  question: string;
  answer: 'Sim' | 'Não';
}

export interface Questionnaire {
  id: string;
  date: string;
  answers: QuestionnaireAnswer[];
  eligible: boolean;
}

export interface BloodInventory {
  bloodTypes: Record<string, BloodTypeStock>;
  lastUpdated: string;
}

export interface BloodTypeStock {
  bloodType: BloodType;
  currentStock: number;
  minimumStock: number;
  maximumCapacity: number;
  status: 'CRITICAL' | 'LOW' | 'NORMAL' | 'HIGH';
  lastDonation: string;
}

// === DTOs CORRIGIDOS (mesmos nomes do backend) ===

// UserRequestDTO (não UserUpdateRequest)
export interface UserRequestDTO {
  name: string;
  email: string;
  password: string;
  address: Address;
  phone: string;
  cpf: string;
  gender: string;
  bloodType: BloodType;
  timeUntilNextDonation?: string;
  lastDonationDate?: string;
}

// UserResponseDTO
export interface UserResponseDTO {
  id: string;
  name: string;
  email: string;
  address: Address;
  phone: string;
  cpf: string;
  gender: string;
  bloodType: BloodType;
  timeUntilNextDonation?: string;
  lastDonationDate?: string;
  photoUrl?: string;
}

// UserStatsDTO
export interface UserStatsDTO {
  totalDonations: number;
  lastDonationDate?: string;
  nextDonationDate?: string;
  bloodType: BloodType;
}

// BloodBankRequestDTO (não BloodBankUpdateRequest)
export interface BloodBankRequestDTO {
  name: string;
  email: string;
  password: string;
  address: Address;
  phone: string;
  cnpj: string;
  campaigns?: Campaign[];
}

// PartnerRequestDTO (não PartnerUpdateRequest)
export interface PartnerRequestDTO {
  name: string;
  email: string;
  password: string;
  address: Address;
  phone: string;
  cnpj: string;
  offers?: Offer[];
}

// CampaignDTO (não CampaignRequest)
export interface CampaignDTO {
  title: string;
  body: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  location: Address;
  phone: string;
}

// OfferDTO (não OfferRequest)
export interface OfferDTO {
  active: any;
  partnerName: string;
  title: string;
  body: string;
  validUntil: string; // YYYY-MM-DD
  discountPercentage: number;
}

// === HELPERS ===
export const bloodTypeDisplay: Record<BloodType, string> = {
  [BloodType.A_POSITIVE]: 'A+',
  [BloodType.A_NEGATIVE]: 'A-',
  [BloodType.B_POSITIVE]: 'B+',
  [BloodType.B_NEGATIVE]: 'B-',
  [BloodType.AB_POSITIVE]: 'AB+',
  [BloodType.AB_NEGATIVE]: 'AB-',
  [BloodType.O_POSITIVE]: 'O+',
  [BloodType.O_NEGATIVE]: 'O-'
};

export function getBloodTypeEnum(display: string): BloodType {
  const entry = Object.entries(bloodTypeDisplay).find(([_, value]) => value === display);
  return entry ? entry[0] as BloodType : BloodType.O_POSITIVE;
}

@Injectable({ providedIn: 'root' })
export class AccountService {
  private readonly apiUrl = environment.apiUrl || 'http://localhost:8080/api';
  
  // Estados globais
  private currentUserSubject = new BehaviorSubject<User | BloodBankUser | PartnerUser | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  // === USER METHODS (baseados no UserController real) ===
  
  // Criar usuário
  createUser(data: UserRequestDTO): Observable<UserResponseDTO> {
    return this.http.post<UserResponseDTO>(`${this.apiUrl}/users`, data)
      .pipe(catchError(this.handleError));
  }

  // Buscar todos os usuários
  getAllUsers(): Observable<UserResponseDTO[]> {
    return this.http.get<UserResponseDTO[]>(`${this.apiUrl}/users`)
      .pipe(catchError(this.handleError));
  }

  // Buscar usuário por ID
  getUserById(userId: string): Observable<UserResponseDTO> {
    return this.http.get<UserResponseDTO>(`${this.apiUrl}/users/${userId}`)
      .pipe(catchError(this.handleError));
  }

  // Buscar estatísticas
  getUserStats(userId: string): Observable<UserStatsDTO> {
    return this.http.get<UserStatsDTO>(`${this.apiUrl}/users/${userId}/stats`)
      .pipe(catchError(this.handleError));
  }

  // Esqueceu a senha
  forgotPassword(email: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/users/forgot-password`, { email })
      .pipe(catchError(this.handleError));
  }

  // MÉTODOS QUE PRECISAM SER IMPLEMENTADOS NO BACKEND:
  
  // Atualizar perfil (PUT não existe no controller ainda)
  updateProfile(userId: string, data: Partial<UserRequestDTO>): Observable<UserResponseDTO> {
    // TODO: Implementar no backend
    console.warn('PUT /api/users/{id} não implementado no backend');
    return throwError(() => new Error('Endpoint não implementado'));
  }

  // Alterar senha (não existe no controller ainda)
  changePassword(userId: string, currentPassword: string, newPassword: string): Observable<void> {
    // TODO: Implementar no backend
    console.warn('PUT /api/users/{id}/password não implementado no backend');
    return throwError(() => new Error('Endpoint não implementado'));
  }

  // Upload de foto (não existe no controller ainda)
  uploadPhoto(userId: string, file: File): Observable<{photoUrl: string}> {
    // TODO: Implementar no backend
    console.warn('POST /api/users/{id}/photo não implementado no backend');
    return throwError(() => new Error('Endpoint não implementado'));
  }

  // === BLOOD BANK METHODS ===
  getBloodBank(id: string): Observable<BloodBankUser> {
    return this.http.get<BloodBankUser>(`${this.apiUrl}/bloodbanks/${id}`)
      .pipe(catchError(this.handleError));
  }

  createBloodBank(data: BloodBankRequestDTO): Observable<BloodBankUser> {
    return this.http.post<BloodBankUser>(`${this.apiUrl}/bloodbanks`, data)
      .pipe(catchError(this.handleError));
  }

  // === CAMPAIGN METHODS ===
  createCampaign(bloodBankId: string, campaign: CampaignDTO): Observable<Campaign> {
    return this.http.post<Campaign>(`${this.apiUrl}/bloodbanks/${bloodBankId}/campaigns`, campaign)
      .pipe(catchError(this.handleError));
  }

  // === PARTNER METHODS ===
  getPartner(id: string): Observable<PartnerUser> {
    return this.http.get<PartnerUser>(`${this.apiUrl}/partners/${id}`)
      .pipe(catchError(this.handleError));
  }

  createPartner(data: PartnerRequestDTO): Observable<PartnerUser> {
    return this.http.post<PartnerUser>(`${this.apiUrl}/partners`, data)
      .pipe(catchError(this.handleError));
  }

  // === OFFER METHODS ===
  createOffer(partnerId: string, offer: OfferDTO): Observable<Offer> {
    return this.http.post<Offer>(`${this.apiUrl}/partners/${partnerId}/offers`, offer)
      .pipe(catchError(this.handleError));
  }

  // === ERROR HANDLING ===
  private handleError = (error: HttpErrorResponse): Observable<never> => {
    let errorMessage = 'Erro desconhecido';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erro: ${error.error.message}`;
    } else {
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

  // === MOCK DATA (para desenvolvimento) ===
  getMockUser(): User {
    return {
      id: '1',
      name: 'Pedro Silva',
      email: 'pedro@email.com',
      bloodType: BloodType.O_POSITIVE,
      photoUrl: 'assets/profile2.png',
      lastDonationDate: '2024-05-01',
      address: {
        street: 'Rua das Flores',
        number: '123',
        neighborhood: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01234-567'
      },
      phone: '(11) 91234-5678',
      cpf: '123.456.789-00',
      gender: 'Masculino',
      role: 'USER',
      achievements: [
        {
          id: '1',
          title: 'Primeira Doação',
          description: 'Parabéns pela sua primeira doação!',
          imageUrl: 'assets/achievements.png',
          points: 10,
          rarity: 'comum'
        }
      ]
    };
  }

  getMockBloodBankUser(): BloodBankUser {
    return {
      id: '2',
      name: 'Banco de Sangue Vida',
      email: 'contato@bancovida.com',
      photoUrl: 'assets/profile2.png',
      role: 'BLOODBANK',
      address: {
        street: 'Rua Central',
        number: '123',
        neighborhood: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01234-567'
      },
      phone: '(11) 99999-9999',
      cnpj: '12.345.678/0001-99',
      cpf: '000.000.000-00',
      gender: 'Outro',
      campaigns: [
        { 
          id: '1',
          title: 'Doe Sangue, Salve Vidas',
          body: 'Campanha de inverno para aumentar os estoques',
          startDate: '2024-06-01',
          endDate: '2024-08-31',
          location: {
            street: 'Rua Central',
            number: '123',
            neighborhood: 'Centro',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '01234-567'
          },
          phone: '(11) 99999-9999',
          active: true,
          priority: 'HIGH'
        }
      ],
      description: 'Banco de sangue especializado em atendimento de emergência',
      website: 'https://bancovida.com'
    };
  }

  getMockPartner(): PartnerUser {
    return {
      id: '3',
      name: 'Farmácia Popular',
      email: 'contato@farmaciapopular.com',
      photoUrl: 'assets/partner.png',
      address: {
        street: 'Avenida Central',
        number: '456',
        neighborhood: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01234-567'
      },
      phone: '(11) 98888-7777',
      cnpj: '98.765.432/0001-11',
      role: 'PARTNER',
      cpf: '000.000.000-00',
      gender: 'Outro',
      offers: [
        { 
          id: '1',
          partnerName: 'Farmácia Popular',
          title: 'Desconto em Medicamentos',
          body: '10% de desconto para doadores em todos os medicamentos',
          validUntil: '2024-12-31',
          discountPercentage: 10,
          active: true
        }
      ]
    };
  }

  // === UTILITY METHODS ===
  setCurrentUser(user: User | BloodBankUser | PartnerUser): void {
    this.currentUserSubject.next(user);
  }

  getCurrentUser(): User | BloodBankUser | PartnerUser | null {
    return this.currentUserSubject.value;
  }

  clearCurrentUser(): void {
    this.currentUserSubject.next(null);
  }

  isBloodBank(user: any): user is BloodBankUser {
    return user?.role === 'BLOODBANK';
  }

  isPartner(user: any): user is PartnerUser {
    return user?.role === 'PARTNER';
  }

  isRegularUser(user: any): user is User {
    return user?.role === 'USER';
  }
}