import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="reports">
      <h2 class="page-title">Reportes</h2>

      <div class="date-filters">
        <div class="date-field">
          <label>Desde</label>
          <input type="date" [(ngModel)]="dateFrom" class="date-input" />
        </div>
        <div class="date-field">
          <label>Hasta</label>
          <input type="date" [(ngModel)]="dateTo" class="date-input" />
        </div>
        <button class="filter-btn">Aplicar</button>
      </div>

      <div class="charts-grid">
        <div class="chart-card">
          <h3 class="chart-title">Mascotas Registradas por Mes</h3>
          <div class="chart-placeholder">
            <span class="placeholder-text">Gr&aacute;fico de l&iacute;neas - Mascotas por mes</span>
          </div>
        </div>

        <div class="chart-card">
          <h3 class="chart-title">Top Razas</h3>
          <div class="chart-placeholder">
            <span class="placeholder-text">Gr&aacute;fico de barras horizontales - Top 10 razas</span>
          </div>
        </div>

        <div class="chart-card full-width">
          <h3 class="chart-title">Vacunas M&aacute;s Aplicadas</h3>
          <div class="chart-placeholder">
            <span class="placeholder-text">Gr&aacute;fico de barras - Vacunas m&aacute;s frecuentes</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: `
    .reports { max-width: 1200px; }

    .page-title {
      color: #D6C3A5;
      font-size: 24px;
      font-weight: 700;
      margin: 0 0 24px;
    }

    .date-filters {
      display: flex;
      align-items: flex-end;
      gap: 16px;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }

    .date-field {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .date-field label {
      color: #D6C3A5;
      font-size: 12px;
      font-weight: 600;
    }

    .date-input {
      padding: 10px 14px;
      border-radius: 8px;
      border: 1px solid rgba(214, 195, 165, 0.2);
      background-color: #1A1D3D;
      color: #D6C3A5;
      font-size: 14px;
      outline: none;
    }

    .date-input:focus { border-color: #E3B11C; }

    .filter-btn {
      padding: 10px 20px;
      border: none;
      border-radius: 8px;
      background-color: #E3B11C;
      color: #0D0F2B;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
    }

    .filter-btn:hover { opacity: 0.9; }

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

    .chart-card.full-width { grid-column: 1 / -1; }

    .chart-title {
      color: #D6C3A5;
      font-size: 16px;
      font-weight: 600;
      margin: 0 0 16px;
    }

    .chart-placeholder {
      height: 240px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px dashed rgba(214, 195, 165, 0.2);
      border-radius: 8px;
    }

    .placeholder-text { color: rgba(214, 195, 165, 0.4); font-size: 14px; }

    @media (max-width: 768px) {
      .charts-grid { grid-template-columns: 1fr; }
    }
  `,
})
export class ReportsComponent {
  dateFrom = '';
  dateTo = '';
}
