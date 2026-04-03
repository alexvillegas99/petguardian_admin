import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

interface Employee {
  name: string;
  cedula: string;
  role: string;
  status: string;
}

@Component({
  selector: 'app-clinic-detail',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="clinic-detail">
      <a routerLink="/admin/clinics" class="back-link">&larr; Volver a Cl&iacute;nicas</a>

      <div class="info-card">
        <div class="card-header">
          <h2 class="clinic-name">{{ clinicName() }}</h2>
          <span class="status-badge" [class]="'status-' + clinicStatus()">
            {{ clinicStatus() === 'verified' ? 'Verificada' : clinicStatus() === 'pending' ? 'Pendiente' : 'Suspendida' }}
          </span>
        </div>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">Direcci&oacute;n</span>
            <span class="info-value">Av. Principal 123, Quito</span>
          </div>
          <div class="info-item">
            <span class="info-label">Tel&eacute;fono</span>
            <span class="info-value">+593 2 234 5678</span>
          </div>
          <div class="info-item">
            <span class="info-label">Email</span>
            <span class="info-value">contacto&#64;clinicapetcare.com</span>
          </div>
          <div class="info-item">
            <span class="info-label">Registro</span>
            <span class="info-value">15/03/2025</span>
          </div>
        </div>
      </div>

      <div class="stats-row">
        @for (stat of stats(); track stat.label) {
          <div class="mini-stat">
            <span class="mini-value">{{ stat.value }}</span>
            <span class="mini-label">{{ stat.label }}</span>
          </div>
        }
      </div>

      <div class="section">
        <h3 class="section-title">Empleados</h3>
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>C&eacute;dula</th>
                <th>Rol</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              @for (emp of employees(); track emp.cedula) {
                <tr>
                  <td>{{ emp.name }}</td>
                  <td>{{ emp.cedula }}</td>
                  <td>{{ emp.role }}</td>
                  <td>
                    <span class="status-dot" [class]="emp.status === 'Activo' ? 'dot-active' : 'dot-inactive'"></span>
                    {{ emp.status }}
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <div class="action-bar">
        <button class="btn btn-suspend">Suspender Cl&iacute;nica</button>
        <button class="btn btn-delete">Eliminar Cl&iacute;nica</button>
      </div>
    </div>
  `,
  styles: `
    .clinic-detail { max-width: 1000px; }

    .back-link {
      color: #E3B11C;
      text-decoration: none;
      font-size: 14px;
      display: inline-block;
      margin-bottom: 20px;
    }

    .back-link:hover { text-decoration: underline; }

    .info-card {
      background-color: #D6C3A5;
      border-radius: 10px;
      padding: 24px;
      margin-bottom: 20px;
    }

    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
    }

    .clinic-name {
      color: #0D0F2B;
      font-size: 22px;
      font-weight: 700;
      margin: 0;
    }

    .status-badge {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
    }

    .status-verified { background-color: rgba(34, 139, 34, 0.15); color: #228B22; }
    .status-pending { background-color: rgba(227, 177, 28, 0.2); color: #B8941A; }
    .status-suspended { background-color: rgba(196, 0, 0, 0.15); color: #C40000; }

    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .info-item { display: flex; flex-direction: column; gap: 4px; }
    .info-label { font-size: 12px; color: #7A5238; font-weight: 600; text-transform: uppercase; }
    .info-value { font-size: 14px; color: #0D0F2B; }

    .stats-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 24px;
    }

    .mini-stat {
      background-color: #1A1D3D;
      border-radius: 8px;
      padding: 16px;
      text-align: center;
    }

    .mini-value { display: block; font-size: 24px; font-weight: 700; color: #E3B11C; }
    .mini-label { display: block; font-size: 12px; color: #D6C3A5; margin-top: 4px; }

    .section-title {
      color: #D6C3A5;
      font-size: 18px;
      font-weight: 600;
      margin: 0 0 16px;
    }

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
      border-bottom: 1px solid rgba(122, 82, 56, 0.15);
    }

    .data-table td {
      padding: 12px 16px;
      font-size: 14px;
      color: #0D0F2B;
      border-bottom: 1px solid rgba(122, 82, 56, 0.1);
    }

    .status-dot {
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      margin-right: 6px;
    }

    .dot-active { background-color: #228B22; }
    .dot-inactive { background-color: #C40000; }

    .action-bar {
      display: flex;
      gap: 12px;
      margin-top: 24px;
    }

    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
    }

    .btn-suspend { background-color: #E3B11C; color: #0D0F2B; }
    .btn-delete { background-color: #C40000; color: #fff; }
    .btn:hover { opacity: 0.9; }
  `,
})
export class ClinicDetailComponent {
  private readonly route = inject(ActivatedRoute);

  clinicName = signal('Cl\u00ednica Veterinaria PetCare');
  clinicStatus = signal<'verified' | 'pending' | 'suspended'>('verified');

  stats = signal([
    { value: '3', label: 'Empleados' },
    { value: '142', label: 'Mascotas' },
    { value: '56', label: 'Citas/mes' },
    { value: '4.8', label: 'Rating' },
  ]);

  employees = signal<Employee[]>([
    { name: 'Dr. Mar\u00eda L\u00f3pez', cedula: '1712345678', role: 'Veterinario', status: 'Activo' },
    { name: 'Carlos Mendoza', cedula: '1798765432', role: 'Asistente', status: 'Activo' },
    { name: 'Ana Torres', cedula: '1756781234', role: 'Recepcionista', status: 'Inactivo' },
  ]);
}
