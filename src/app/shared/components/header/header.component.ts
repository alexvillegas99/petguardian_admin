import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  template: `
    <header class="header-bar">
      <h1 class="app-title">PetGuardian Admin</h1>
      <div class="header-actions">
        <button class="notification-btn" title="Notificaciones">
          <span class="bell-icon">&#128276;</span>
          <span class="badge">3</span>
        </button>
        <div class="user-info">
          <div class="avatar">
            {{ userInitial }}
          </div>
          <span class="user-name">Admin</span>
        </div>
      </div>
    </header>
  `,
  styles: `
    .header-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 32px;
      height: 64px;
      background-color: #0D0F2B;
      border-bottom: 1px solid rgba(214, 195, 165, 0.15);
    }

    .app-title {
      font-size: 18px;
      font-weight: 600;
      color: #D6C3A5;
      margin: 0;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .notification-btn {
      position: relative;
      background: none;
      border: none;
      cursor: pointer;
      padding: 8px;
    }

    .bell-icon {
      font-size: 22px;
      color: #D6C3A5;
    }

    .badge {
      position: absolute;
      top: 2px;
      right: 2px;
      background-color: #C40000;
      color: #fff;
      font-size: 10px;
      font-weight: 700;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background-color: #E3B11C;
      color: #0D0F2B;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 14px;
    }

    .user-name {
      color: #D6C3A5;
      font-size: 14px;
      font-weight: 500;
    }
  `,
})
export class HeaderComponent {
  private readonly authService = inject(AuthService);

  get userInitial(): string {
    const user = this.authService.currentUser();
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'A';
  }
}
