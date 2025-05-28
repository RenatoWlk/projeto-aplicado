import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
}

export interface BloodBankUser extends User {
  role: 'BLOODBANK';
  address: string;
  phone: string;
  cnpj: string;
  campaigns: Campaign[];
}

export interface partner extends User {
  role: 'partner';
  address: string;
  phone: string;
  cnpj: string;
  offer: Offer[]; // ou offers: Offer[] se preferir plural
  bloodType: string;
  lastDonation: string;
  nextEligibleDonation: string;
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
}

export interface Questionnaire {
  date: string;
  answers: { question: string; answer: string }[];
}

@Injectable({ providedIn: 'root' })
export class AccountService {
  constructor(private http: HttpClient) {}

  getUser(userId: string): Observable<User> {
    return this.http.get<User>(`/api/users/${userId}`);
  }

  getLastQuestionnaire(userId: string): Observable<Questionnaire> {
    return this.http.get<Questionnaire>(`/api/users/${userId}/last-questionnaire`);
  }

  updateProfile(userId: string, data: Partial<User>) {
    return this.http.put<User>(`/api/users/${userId}`, data);
  }

  changePassword(userId: string, newPassword: string) {
    return this.http.put(`/api/users/${userId}/password`, { newPassword });
  }

  uploadPhoto(userId: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<User>(`/api/users/${userId}/photo`, formData);
  }

  getPartner(id: string) {
    return this.http.get<partner>(`/api/partners/${id}`);
  }

  updatePartner(id: string, data: Partial<partner>) {
    return this.http.put<partner>(`/api/partners/${id}`, data);
  }

  addOffer(partnerId: string, offer: any) {
    return this.http.post(`/api/partners/${partnerId}/offers`, offer);
  }

  updateOffer(partnerId: string, offerId: string, offer: any) {
    return this.http.put(`/api/partners/${partnerId}/offers/${offerId}`, offer);
  }

  deleteOffer(partnerId: string, offerId: string) {
    return this.http.delete(`/api/partners/${partnerId}/offers/${offerId}`);
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
        { id: '1', title: 'Desconto em Medicamentos', description: '10% de desconto para doadores', active: true },
        { id: '2', title: 'Brinde Especial', description: 'Ganhe um brinde nas compras acima de R$50', active: false }
      ]
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
        { id: '1', title: 'Doe Sangue, Salve Vidas', description: 'Campanha de inverno', active: true },
        { id: '2', title: 'Natal Solidário', description: 'Doe antes do Natal!', active: false }
      ]
    };
  }
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
}