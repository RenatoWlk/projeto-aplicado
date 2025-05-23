import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { TokenService } from '../token/token.service';
import { jwtDecode } from 'jwt-decode';

interface AuthRequest {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API = '/api/auth';

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) { }

  /**
   * Send credentials to the backend and, on success,
   * store the token and return the Observable<AuthResponse>.
   */
  login(email: string, password: string): Observable<AuthResponse> {
    const payload: AuthRequest = { email, password };
    return this.http.post<AuthResponse>(`${this.API}/login`, payload)
      .pipe(
        tap(response => this.tokenService.setToken(response.token))
      );
  }

  /** Cleans the token (logout) */
  logout(): void {
    this.tokenService.clearToken();
  }

  /** Returns true if authenticated */
  isAuthenticated(): boolean {
    return this.tokenService.isLogged();
  }

  /** Returns the current user ID from the token */
  getCurrentUserId(): string {
    const token = this.tokenService.getToken();
    if (!token) return '';
    const decoded: any = jwtDecode(token);
    return decoded.sub || decoded.id || '';
  }
}
