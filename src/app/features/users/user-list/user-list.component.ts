import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface UserRecord {
  id: string;
  name: string;
  cedula: string;
  role: string;
  status: 'active' | 'inactive';
}

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="user-list">
      <h2 class="page-title">Usuarios</h2>

      <div class="toolbar">
        <input
          type="text"
          class="search-input"
          placeholder="Buscar usuario..."
          [(ngModel)]="searchTerm"
        />

        <select class="role-filter" [(ngModel)]="roleFilter" (ngModelChange)="onFilterChange()">
          <option value="all">Todos los roles</option>
          <option value="owner">Due&ntilde;o</option>
          <option value="vet">Veterinario</option>
          <option value="assistant">Asistente</option>
        </select>
      </div>

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
            @for (user of filteredUsers(); track user.id) {
              <tr>
                <td>{{ user.name }}</td>
                <td>{{ user.cedula }}</td>
                <td>
                  <span class="role-badge">{{ user.role }}</span>
                </td>
                <td>
                  <span class="status-dot" [class]="user.status === 'active' ? 'dot-active' : 'dot-inactive'"></span>
                  {{ user.status === 'active' ? 'Activo' : 'Inactivo' }}
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="4" class="empty-row">No se encontraron usuarios</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: `
    .user-list { max-width: 1200px; }

    .page-title {
      color: #D6C3A5;
      font-size: 24px;
      font-weight: 700;
      margin: 0 0 24px;
    }

    .toolbar {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }

    .search-input {
      flex: 1;
      min-width: 200px;
      padding: 10px 14px;
      border-radius: 8px;
      border: 1px solid rgba(214, 195, 165, 0.2);
      background-color: #1A1D3D;
      color: #D6C3A5;
      font-size: 14px;
      outline: none;
    }

    .search-input:focus { border-color: #E3B11C; }
    .search-input::placeholder { color: rgba(214, 195, 165, 0.4); }

    .role-filter {
      padding: 10px 14px;
      border-radius: 8px;
      border: 1px solid rgba(214, 195, 165, 0.2);
      background-color: #1A1D3D;
      color: #D6C3A5;
      font-size: 14px;
      outline: none;
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
      letter-spacing: 0.5px;
      border-bottom: 1px solid rgba(122, 82, 56, 0.15);
    }

    .data-table td {
      padding: 12px 16px;
      font-size: 14px;
      color: #0D0F2B;
      border-bottom: 1px solid rgba(122, 82, 56, 0.1);
    }

    .role-badge {
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      background-color: rgba(13, 15, 43, 0.1);
      color: #0D0F2B;
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

    .empty-row { text-align: center; color: #7A5238; padding: 32px 16px !important; }
  `,
})
export class UserListComponent {
  searchTerm = '';
  roleFilter = 'all';

  readonly users = signal<UserRecord[]>([
    { id: '1', name: 'Juan P\u00e9rez', cedula: '1712345678', role: 'Due\u00f1o', status: 'active' },
    { id: '2', name: 'Dr. Mar\u00eda L\u00f3pez', cedula: '1798765432', role: 'Veterinario', status: 'active' },
    { id: '3', name: 'Carlos Mendoza', cedula: '1756781234', role: 'Asistente', status: 'inactive' },
    { id: '4', name: 'Laura Garc\u00eda', cedula: '1734567890', role: 'Due\u00f1o', status: 'active' },
    { id: '5', name: 'Pedro Morales', cedula: '1723456789', role: 'Veterinario', status: 'active' },
  ]);

  readonly filteredUsers = computed(() => this.users());

  onFilterChange(): void {
    // In real app, would filter via API
  }
}
