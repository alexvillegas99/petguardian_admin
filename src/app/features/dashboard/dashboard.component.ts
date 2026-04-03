import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  template: `
    <div class="dashboard">
      <h2 class="page-title">Dashboard</h2>

      <div class="stats-grid">
        @for (stat of stats(); track stat.label) {
          <div class="stat-card">
            <div class="stat-icon">{{ stat.icon }}</div>
            <div class="stat-info">
              <span class="stat-value">{{ stat.value }}</span>
              <span class="stat-label">{{ stat.label }}</span>
            </div>
          </div>
        }
      </div>

      <div class="charts-grid">
        <div class="chart-card">
          <h3 class="chart-title">Registros por Mes</h3>
          <div class="chart-placeholder">
            <span class="placeholder-text">Gr&aacute;fico de l&iacute;neas - Registros mensuales</span>
          </div>
        </div>

        <div class="chart-card">
          <h3 class="chart-title">Especies</h3>
          <div class="chart-placeholder">
            <span class="placeholder-text">Gr&aacute;fico de torta - Distribuci&oacute;n de especies</span>
          </div>
        </div>

        <div class="chart-card full-width">
          <h3 class="chart-title">Cl&iacute;nicas Activas</h3>
          <div class="chart-placeholder">
            <span class="placeholder-text">Gr&aacute;fico de barras - Cl&iacute;nicas activas por regi&oacute;n</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: `
    .dashboard {
      max-width: 1200px;
    }

    .page-title {
      color: #D6C3A5;
      font-size: 24px;
      font-weight: 700;
      margin: 0 0 24px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      margin-bottom: 32px;
    }

    .stat-card {
      background-color: #D6C3A5;
      border-radius: 10px;
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 16px;
      border-left: 4px solid #E3B11C;
    }

    .stat-icon {
      font-size: 32px;
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: rgba(227, 177, 28, 0.15);
      border-radius: 10px;
    }

    .stat-info {
      display: flex;
      flex-direction: column;
    }

    .stat-value {
      font-size: 28px;
      font-weight: 700;
      color: #0D0F2B;
    }

    .stat-label {
      font-size: 13px;
      color: #7A5238;
      font-weight: 500;
    }

    .charts-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .chart-card {
      background-color: #1A1D3D;
      border-radius: 10px;
      padding: 20px;
    }

    .chart-card.full-width {
      grid-column: 1 / -1;
    }

    .chart-title {
      color: #D6C3A5;
      font-size: 16px;
      font-weight: 600;
      margin: 0 0 16px;
    }

    .chart-placeholder {
      height: 220px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px dashed rgba(214, 195, 165, 0.2);
      border-radius: 8px;
    }

    .placeholder-text {
      color: rgba(214, 195, 165, 0.4);
      font-size: 14px;
    }

    @media (max-width: 1024px) {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 640px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }
      .charts-grid {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class DashboardComponent {
  readonly stats = signal([
    { icon: '\u2695', value: '24', label: 'Cl\u00ednicas' },
    { icon: '\u23F3', value: '8', label: 'Pendientes' },
    { icon: '\uD83D\uDC3E', value: '1,247', label: 'Mascotas' },
    { icon: '\uD83D\uDCC5', value: '156', label: 'Citas' },
  ]);
}
