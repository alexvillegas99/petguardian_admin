import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="logo-section">
          <span class="logo-icon">&#128062;</span>
          <h1 class="app-name">PetGuardian</h1>
          <p class="subtitle">Panel Administrativo</p>
        </div>

        @if (errorMessage()) {
          <div class="error-message">
            {{ errorMessage() }}
          </div>
        }

        <form (ngSubmit)="onLogin()" class="login-form">
          <div class="field">
            <label for="email">Correo electr&oacute;nico</label>
            <input
              id="email"
              type="email"
              [(ngModel)]="email"
              name="email"
              placeholder="admin@petguardian.com"
              required
            />
          </div>

          <div class="field">
            <label for="password">Contrase&ntilde;a</label>
            <input
              id="password"
              type="password"
              [(ngModel)]="password"
              name="password"
              placeholder="********"
              required
            />
          </div>

          <button type="submit" class="login-btn" [disabled]="loading()">
            {{ loading() ? 'Ingresando...' : 'Ingresar' }}
          </button>
        </form>
      </div>
    </div>
  `,
  styles: `
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #0D0F2B;
    }

    .login-card {
      width: 100%;
      max-width: 400px;
      background-color: #1A1D3D;
      border-radius: 12px;
      padding: 40px 32px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    }

    .logo-section {
      text-align: center;
      margin-bottom: 32px;
    }

    .logo-icon {
      font-size: 48px;
      display: block;
      margin-bottom: 12px;
    }

    .app-name {
      color: #E3B11C;
      font-size: 28px;
      font-weight: 700;
      margin: 0 0 4px;
    }

    .subtitle {
      color: #D6C3A5;
      font-size: 14px;
      margin: 0;
      opacity: 0.8;
    }

    .error-message {
      background-color: rgba(196, 0, 0, 0.15);
      border: 1px solid #C40000;
      color: #C40000;
      padding: 10px 14px;
      border-radius: 6px;
      font-size: 13px;
      margin-bottom: 20px;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .field {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .field label {
      color: #D6C3A5;
      font-size: 13px;
      font-weight: 500;
    }

    .field input {
      padding: 12px 14px;
      border-radius: 8px;
      border: 1px solid rgba(214, 195, 165, 0.2);
      background-color: #0D0F2B;
      color: #D6C3A5;
      font-size: 14px;
      outline: none;
      transition: border-color 0.2s;
    }

    .field input:focus {
      border-color: #E3B11C;
    }

    .field input::placeholder {
      color: rgba(214, 195, 165, 0.4);
    }

    .login-btn {
      padding: 14px;
      border: none;
      border-radius: 8px;
      background-color: #E3B11C;
      color: #0D0F2B;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: opacity 0.2s;
      margin-top: 8px;
    }

    .login-btn:hover:not(:disabled) {
      opacity: 0.9;
    }

    .login-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `,
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  email = '';
  password = '';
  loading = signal(false);
  errorMessage = signal('');

  async onLogin(): Promise<void> {
    if (!this.email || !this.password) {
      this.errorMessage.set('Por favor ingrese correo y contrase\u00f1a.');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    try {
      await this.authService.login(this.email, this.password);
      const isAdmin = this.authService.isAdmin();
      if (!isAdmin) {
        this.errorMessage.set('No tiene permisos de administrador.');
        await this.authService.logout();
      } else {
        this.router.navigate(['/admin/dashboard']);
      }
    } catch (error: unknown) {
      this.errorMessage.set('Credenciales inv\u00e1lidas. Intente nuevamente.');
    } finally {
      this.loading.set(false);
    }
  }
}
