import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { UsuarioResponse } from '../models/usuario.model';

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface UsuarioCadastroRequest {
  nome: string;
  email: string;
  senha: string;
  telefone: string;
  role: 'ROLE_CLIENTE' | 'ROLE_BARBEIRO' | 'ROLE_ADMIN';
}

export interface LoginResponse {
  token: string;
  tipo: string;
  usuario: UsuarioResponse;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/auth';
  private readonly TOKEN_KEY = 'barbershop_auth_token';
  private readonly USER_KEY = 'barbershop_auth_user';

  // Signals para reatividade pura do Angular 18
  readonly token = signal<string | null>(this.getStoredToken());
  readonly currentUser = signal<UsuarioResponse | null>(this.getStoredUser());
  readonly isAuthenticated = computed(() => !!this.token());
  readonly isBarbeiro = computed(() => this.currentUser()?.role === 'ROLE_BARBEIRO');
  readonly isAdmin = computed(() => this.currentUser()?.role === 'ROLE_ADMIN');

  login(dados: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, dados).pipe(
      tap((res) => {
        this.salvarSessao(res.token, res.usuario);
      }),
      catchError((err) => throwError(() => err))
    );
  }

  cadastrar(dados: UsuarioCadastroRequest): Observable<UsuarioResponse> {
    return this.http.post<UsuarioResponse>(`${this.apiUrl}/register`, dados).pipe(
      catchError((err) => throwError(() => err))
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.token.set(null);
    this.currentUser.set(null);
  }

  private salvarSessao(token: string, usuario: UsuarioResponse): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(usuario));
    this.token.set(token);
    this.currentUser.set(usuario);
  }

  private getStoredToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private getStoredUser(): UsuarioResponse | null {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(this.USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
}
