import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  Auth,
  signInWithEmailAndPassword,
  signOut,
  user,
  idToken,
  User,
} from '@angular/fire/auth';
import { Observable, from, switchMap, of, firstValueFrom } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { environment } from '../../../environments/environment';

interface AdminCheckResponse {
  isAdmin: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly auth = inject(Auth);
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  private readonly user$ = user(this.auth);
  private readonly idToken$ = idToken(this.auth);

  readonly currentUser = toSignal(this.user$, { initialValue: null });
  readonly currentIdToken = toSignal(this.idToken$, { initialValue: null });
  readonly isAuthenticated = computed(() => !!this.currentUser());

  private readonly _isAdmin = signal(false);
  readonly isAdmin = this._isAdmin.asReadonly();

  async login(email: string, password: string): Promise<User> {
    const credential = await signInWithEmailAndPassword(this.auth, email, password);
    await this.checkAdminRole();
    return credential.user;
  }

  async logout(): Promise<void> {
    this._isAdmin.set(false);
    await signOut(this.auth);
  }

  async getIdToken(): Promise<string | null> {
    const currentUser = this.auth.currentUser;
    if (!currentUser) return null;
    return currentUser.getIdToken();
  }

  async checkAdminRole(): Promise<boolean> {
    const currentUser = this.auth.currentUser;
    if (!currentUser) {
      this._isAdmin.set(false);
      return false;
    }

    const tokenResult = await currentUser.getIdTokenResult();
    const isAdmin = tokenResult.claims['admin'] === true;
    this._isAdmin.set(isAdmin);
    return isAdmin;
  }

  /** Call the NestJS backend API with the current auth token */
  apiGet<T>(path: string): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}${path}`);
  }

  apiPost<T>(path: string, body: unknown): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}${path}`, body);
  }

  apiPut<T>(path: string, body: unknown): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}${path}`, body);
  }

  apiDelete<T>(path: string): Observable<T> {
    return this.http.delete<T>(`${this.apiUrl}${path}`);
  }
}
