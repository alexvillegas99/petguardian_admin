import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface AuditEntry {
  date: string;
  clinic: string;
  employee: string;
  action: string;
}

@Component({
  selector: 'app-audit-log',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="audit-log">
      <h2 class="page-title">Auditor&iacute;a</h2>

      <div class="filters">
        <div class="filter-field">
          <label>Desde</label>
          <input type="date" [(ngModel)]="dateFrom" class="filter-input" />
        </div>
        <div class="filter-field">
          <label>Hasta</label>
          <input type="date" [(ngModel)]="dateTo" class="filter-input" />
        </div>
        <div class="filter-field">
          <label>Cl&iacute;nica</label>
          <select [(ngModel)]="clinicFilter" class="filter-input">
            <option value="">Todas</option>
            <option value="petcare">PetCare</option>
            <option value="happypaws">Happy Paws</option>
            <option value="sanfrancisco">San Francisco</option>
          </select>
        </div>
        <button class="filter-btn" (click)="applyFilters()">Filtrar</button>
      </div>

      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Cl&iacute;nica</th>
              <th>Empleado</th>
              <th>Acci&oacute;n</th>
            </tr>
          </thead>
          <tbody>
            @for (entry of entries(); track $index) {
              <tr>
                <td>{{ entry.date }}</td>
                <td>{{ entry.clinic }}</td>
                <td>{{ entry.employee }}</td>
                <td>{{ entry.action }}</td>
              </tr>
            } @empty {
              <tr>
                <td colspan="4" class="empty-row">No se encontraron registros</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: `
    .audit-log { max-width: 1200px; }

    .page-title {
      color: #D6C3A5;
      font-size: 24px;
      font-weight: 700;
      margin: 0 0 24px;
    }

    .filters {
      display: flex;
      align-items: flex-end;
      gap: 16px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }

    .filter-field {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .filter-field label {
      color: #D6C3A5;
      font-size: 12px;
      font-weight: 600;
    }

    .filter-input {
      padding: 10px 14px;
      border-radius: 8px;
      border: 1px solid rgba(214, 195, 165, 0.2);
      background-color: #1A1D3D;
      color: #D6C3A5;
      font-size: 14px;
      outline: none;
    }

    .filter-input:focus { border-color: #E3B11C; }

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

    .table-container {
      background-color: #D6C3A5;
      border-radius: 10px;
      overflow: hidden;
    }

    .data-table { width: 100%; border-collapse: collapse; }

    .data-table th {
      text-align: left;
      padding: 14px 16px;
      font-size: 12px;
      font-weight: 600;
      color: #7A5238;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 1px solid rgba(122, 82, 56, 0.15);
    }

    .data-table td {
      padding: 12px 16px;
      font-size: 14px;
      color: #0D0F2B;
      border-bottom: 1px solid rgba(122, 82, 56, 0.1);
    }

    .empty-row { text-align: center; color: #7A5238; padding: 32px 16px !important; }
  `,
})
export class AuditLogComponent {
  dateFrom = '';
  dateTo = '';
  clinicFilter = '';

  readonly entries = signal<AuditEntry[]>([
    { date: '2026-04-01 14:30', clinic: 'PetCare', employee: 'Dr. Mar\u00eda L\u00f3pez', action: 'Cre\u00f3 historial cl\u00ednico para mascota "Luna"' },
    { date: '2026-04-01 11:15', clinic: 'Happy Paws', employee: 'Carlos Mendoza', action: 'Actualiz\u00f3 datos de mascota "Rex"' },
    { date: '2026-03-31 16:45', clinic: 'San Francisco', employee: 'Ana Torres', action: 'Registr\u00f3 nueva cita' },
    { date: '2026-03-31 09:00', clinic: 'PetCare', employee: 'Dr. Mar\u00eda L\u00f3pez', action: 'Aplic\u00f3 vacuna antirrábica a "Max"' },
    { date: '2026-03-30 15:20', clinic: 'Happy Paws', employee: 'Pedro Morales', action: 'Modific\u00f3 horario de atenci\u00f3n' },
  ]);

  applyFilters(): void {
    // In real app, would call API with filter params
  }
}
