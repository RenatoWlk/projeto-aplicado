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

export interface Achievement {
  title: string;
  description: string;
  iconUrl: string;
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
}