import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface Clinic {
  id: string;
  name: string;
  address: string;
  status: 'verified' | 'pending' | 'suspended';
}

@Component({
  selector: 'app-clinic-list',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="clinic-list">
      <div class="page-header">
        <h2 class="page-title">Cl&iacute;nicas</h2>
      </div>

      <div class="toolbar">
        <input
          type="text"
          class="search-input"
          placeholder="Buscar cl&iacute;nica..."
          [(ngModel)]="searchTerm"
          (ngModelChange)="onSearch()"
        />

        <div class="filter-tabs">
          @for (tab of tabs; track tab.value) {
            <button
              class="tab"
              [class.active]="activeTab() === tab.value"
              (click)="activeTab.set(tab.value)"
            >
              {{ tab.label }}
            </button>
          }
        </div>
      </div>

      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Direcci&oacute;n</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            @for (clinic of filteredClinics(); track clinic.id) {
              <tr>
                <td>{{ clinic.name }}</td>
                <td>{{ clinic.address }}</td>
                <td>
                  <span class="status-badge" [class]="'status-' + clinic.status">
                    {{ getStatusLabel(clinic.status) }}
                  </span>
                </td>
                <td>
                  <a [routerLink]="['/admin/clinics', clinic.id]" class="action-btn">Ver</a>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="4" class="empty-row">No se encontraron cl&iacute;nicas</td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <div class="pagination">
        <button class="page-btn" (click)="prevPage()" [disabled]="currentPage() === 1">Anterior</button>
        <span class="page-info">P&aacute;gina {{ currentPage() }} de {{ totalPages() }}</span>
        <button class="page-btn" (click)="nextPage()" [disabled]="currentPage() === totalPages()">Siguiente</button>
      </div>
    </div>
  `,
  styles: `
    .clinic-list { max-width: 1200px; }

    .page-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 24px;
    }

    .page-title {
      color: #D6C3A5;
      font-size: 24px;
      font-weight: 700;
      margin: 0;
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

    .filter-tabs { display: flex; gap: 4px; }

    .tab {
      padding: 8px 16px;
      border: none;
      border-radius: 6px;
      background-color: transparent;
      color: #D6C3A5;
      font-size: 13px;
      cursor: pointer;
      font-weight: 500;
    }

    .tab.active {
      background-color: #E3B11C;
      color: #0D0F2B;
    }

    .table-container {
      background-color: #D6C3A5;
      border-radius: 10px;
      overflow: hidden;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
    }

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

    .status-badge {
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
    }

    .status-verified { background-color: rgba(34, 139, 34, 0.15); color: #228B22; }
    .status-pending { background-color: rgba(227, 177, 28, 0.2); color: #B8941A; }
    .status-suspended { background-color: rgba(196, 0, 0, 0.15); color: #C40000; }

    .action-btn {
      color: #E3B11C;
      text-decoration: none;
      font-weight: 600;
      font-size: 13px;
    }

    .action-btn:hover { text-decoration: underline; }

    .empty-row {
      text-align: center;
      color: #7A5238;
      padding: 32px 16px !important;
    }

    .pagination {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      margin-top: 20px;
    }

    .page-btn {
      padding: 8px 16px;
      border: 1px solid rgba(214, 195, 165, 0.2);
      border-radius: 6px;
      background-color: transparent;
      color: #D6C3A5;
      font-size: 13px;
      cursor: pointer;
    }

    .page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
    .page-btn:hover:not(:disabled) { border-color: #E3B11C; color: #E3B11C; }
    .page-info { color: #D6C3A5; font-size: 13px; }
  `,
})
export class ClinicListComponent {
  searchTerm = '';
  activeTab = signal<'all' | 'pending' | 'verified'>('all');
  currentPage = signal(1);
  pageSize = 10;

  readonly tabs = [
    { label: 'Todas', value: 'all' as const },
    { label: 'Pendientes', value: 'pending' as const },
    { label: 'Verificadas', value: 'verified' as const },
  ];

  // Mock data
  readonly clinics = signal<Clinic[]>([
    { id: '1', name: 'Cl\u00ednica Veterinaria PetCare', address: 'Av. Principal 123, Quito', status: 'verified' },
    { id: '2', name: 'Hospital Animal Happy Paws', address: 'Calle 10 de Agosto 456, Guayaquil', status: 'pending' },
    { id: '3', name: 'Veterinaria San Francisco', address: 'Sucre 789, Cuenca', status: 'verified' },
    { id: '4', name: 'Centro Veterinario El Arca', address: 'Bol\u00edvar 321, Ambato', status: 'suspended' },
    { id: '5', name: 'Cl\u00ednica Animal Planet', address: 'Col\u00f3n 654, Loja', status: 'pending' },
  ]);

  readonly filteredClinics = computed(() => {
    let result = this.clinics();
    const tab = this.activeTab();
    if (tab !== 'all') {
      result = result.filter((c) => c.status === tab);
    }
    return result;
  });

  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.filteredClinics().length / this.pageSize)));

  onSearch(): void {
    const term = this.searchTerm.toLowerCase();
    // In real app, this would call the API
    this.currentPage.set(1);
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      verified: 'Verificada',
      pending: 'Pendiente',
      suspended: 'Suspendida',
    };
    return labels[status] ?? status;
  }

  prevPage(): void {
    this.currentPage.update((p) => Math.max(1, p - 1));
  }

  nextPage(): void {
    this.currentPage.update((p) => Math.min(this.totalPages(), p + 1));
  }
}
