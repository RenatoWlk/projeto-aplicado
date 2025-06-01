import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  private baseUrl = 'http://localhost:8080';

  private apiUrlPartner = `${this.baseUrl}/api/partners`;
  private apiUrlDonator = `${this.baseUrl}/api/users`;
  private apiUrlBloodBank = `${this.baseUrl}/api/bloodbanks`;

  constructor(private http: HttpClient) {}

  registerPartner(payload: any): Observable<any> {
    return this.http.post(this.apiUrlPartner, payload);
  }

  registerBloodBank(payload: any): Observable<any> {
    return this.http.post(this.apiUrlBloodBank, payload);
  }

  registerDonator(payload: any): Observable<any> {
    return this.http.post(this.apiUrlDonator, payload);
  }
}
