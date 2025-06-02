import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../core/services/auth/auth.service';

export interface QuestionnaireData {
  userId: string;
  sexo: string;
  idade: string;
  doacaoAntesDos60: string;
  peso: string;
  saudavel: string;
  gravida: string;
  partoRecente: string;
  sintomas: string;
  doencas: string;
  medicamentos: string;
  procedimentos: string;
  drogas: string;
  parceiros: string;
  tatuagem: string;
  homemUltimaDoacao: string;
  mulherUltimaDoacao: string;
  vacinaCovid: string;
  vacinaFebre: string;
  viagemRisco: string;
  isEligible: boolean;
  resultMessage: string;
}


@Injectable({
  providedIn: 'root',
})
export class QuestionnaireService {
  private apiUrl = '/api/questionnaire'; // ajuste conforme necessário

  constructor(private http: HttpClient,private authService: AuthService) {}

    submitQuestionnaire(data: QuestionnaireData): Observable<any> {
    const id = this.authService.getCurrentUserId();
    data.userId = id;
    return this.http.post(`${this.apiUrl}`, data);
  }

  getUserQuestionnaires(): Observable<any[]> {
    const id = this.authService.getCurrentUserId();
    return this.http.get<any[]>(`${this.apiUrl}/${id}`);
  }
}
