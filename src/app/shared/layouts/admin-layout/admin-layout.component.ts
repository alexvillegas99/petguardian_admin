import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, HeaderComponent],
  template: `
    <div class="admin-layout">
      <app-sidebar />
      <div class="main-area">
        <app-header />
        <main class="content">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  styles: `
    .admin-layout {
      display: flex;
      min-height: 100vh;
    }

    .main-area {
      flex: 1;
      margin-left: 260px;
      display: flex;
      flex-direction: column;
    }

    .content {
      flex: 1;
      padding: 24px 32px;
      background-color: #121433;
      overflow-y: auto;
    }
  `,
})
export class AdminLayoutComponent {}
