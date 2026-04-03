import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="sidebar">
      <div class="logo-section">
        <span class="logo-icon">&#128062;</span>
        <span class="logo-text">PetGuardian</span>
      </div>

      <ul class="nav-list">
        @for (item of menuItems; track item.route) {
          <li>
            <a
              class="nav-item"
              [routerLink]="item.route"
              routerLinkActive="active"
              [routerLinkActiveOptions]="{ exact: item.exact ?? false }"
            >
              <span class="nav-icon">{{ item.icon }}</span>
              <span class="nav-label">{{ item.label }}</span>
            </a>
          </li>
        }
      </ul>

      <div class="sidebar-footer">
        <button class="nav-item logout-btn" (click)="onLogout()">
          <span class="nav-icon">&#9211;</span>
          <span class="nav-label">Cerrar sesi&oacute;n</span>
        </button>
      </div>
    </nav>
  `,
  styles: `
    .sidebar {
      width: 260px;
      min-height: 100vh;
      background-color: #0D0F2B;
      display: flex;
      flex-direction: column;
      padding: 0;
      position: fixed;
      left: 0;
      top: 0;
      z-index: 100;
    }

    .logo-section {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 24px 20px;
      border-bottom: 1px solid rgba(214, 195, 165, 0.15);
    }

    .logo-icon {
      font-size: 28px;
    }

    .logo-text {
      font-size: 20px;
      font-weight: 700;
      color: #E3B11C;
    }

    .nav-list {
      list-style: none;
      margin: 0;
      padding: 16px 0;
      flex: 1;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 20px;
      color: #D6C3A5;
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      border-left: 3px solid transparent;
      transition: all 0.2s ease;
      cursor: pointer;
    }

    .nav-item:hover {
      background-color: rgba(227, 177, 28, 0.08);
      color: #E3B11C;
    }

    .nav-item.active {
      border-left-color: #E3B11C;
      color: #E3B11C;
      background-color: rgba(227, 177, 28, 0.12);
    }

    .nav-icon {
      font-size: 18px;
      width: 24px;
      text-align: center;
    }

    .sidebar-footer {
      padding: 16px 0;
      border-top: 1px solid rgba(214, 195, 165, 0.15);
    }

    .logout-btn {
      width: 100%;
      background: none;
      border: none;
      border-left: 3px solid transparent;
      font-family: inherit;
    }

    .logout-btn:hover {
      color: #C40000;
      background-color: rgba(196, 0, 0, 0.08);
    }
  `,
})
export class SidebarComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly menuItems = [
    { route: '/admin/dashboard', label: 'Dashboard', icon: '\u2302', exact: true },
    { route: '/admin/clinics', label: 'Cl\u00ednicas', icon: '\u2695', exact: false },
    { route: '/admin/users', label: 'Usuarios', icon: '\u263A', exact: false },
    { route: '/admin/reports', label: 'Reportes', icon: '\u2637', exact: false },
    { route: '/admin/audit', label: 'Auditor\u00eda', icon: '\u2630', exact: false },
  ];

  async onLogout(): Promise<void> {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
}
