import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { firstValueFrom } from 'rxjs';

interface Species {
  id: string;
  name: string;
  isActive: boolean;
}

interface Breed {
  id: string;
  name: string;
  speciesId: string;
  speciesName?: string;
  isActive: boolean;
}

interface Vaccine {
  id: string;
  name: string;
  species: string[];
  defaultIntervalDays?: number;
  description?: string;
  isActive: boolean;
}

interface Deworming {
  id: string;
  name: string;
  type: string;
  species: string[];
  defaultIntervalDays?: number;
  description?: string;
  isActive: boolean;
}

@Component({
  selector: 'app-catalogs',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="catalogs-page">
      <div class="page-header">
        <h2 class="page-title">Cat&aacute;logos</h2>
        @if (showSeedButton()) {
          <button class="btn btn-seed" (click)="seedData()" [disabled]="seeding()">
            {{ seeding() ? 'Sembrando...' : 'Sembrar datos' }}
          </button>
        }
      </div>

      <div class="tabs">
        @for (tab of tabs; track tab.key) {
          <button
            class="tab-btn"
            [class.active]="activeTab() === tab.key"
            (click)="activeTab.set(tab.key)"
          >
            {{ tab.label }}
          </button>
        }
      </div>

      <!-- ESPECIES TAB -->
      @if (activeTab() === 'species') {
        <div class="tab-content">
          <div class="form-card">
            <h3>Agregar especie</h3>
            <div class="inline-form">
              <input
                type="text"
                placeholder="Nombre de la especie"
                [(ngModel)]="newSpeciesName"
                class="form-input"
              />
              <button class="btn btn-add" (click)="addSpecies()" [disabled]="!newSpeciesName()">
                Agregar
              </button>
            </div>
          </div>

          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                @for (item of speciesList(); track item.id) {
                  <tr>
                    <td>
                      @if (editingSpeciesId() === item.id) {
                        <input
                          type="text"
                          [(ngModel)]="editSpeciesName"
                          class="form-input form-input-sm"
                        />
                      } @else {
                        {{ item.name }}
                      }
                    </td>
                    <td>
                      <span class="status-dot" [class.active]="item.isActive !== false"></span>
                      {{ item.isActive !== false ? 'Activo' : 'Inactivo' }}
                    </td>
                    <td class="actions-cell">
                      @if (editingSpeciesId() === item.id) {
                        <button class="btn btn-add btn-sm" (click)="saveSpecies(item)">Guardar</button>
                        <button class="btn btn-cancel btn-sm" (click)="editingSpeciesId.set(null)">Cancelar</button>
                      } @else {
                        <button class="btn btn-edit btn-sm" (click)="startEditSpecies(item)">Editar</button>
                        <button class="btn btn-delete btn-sm" (click)="deleteSpecies(item)">Eliminar</button>
                      }
                    </td>
                  </tr>
                } @empty {
                  <tr><td colspan="3" class="empty-row">No hay especies registradas</td></tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }

      <!-- RAZAS TAB -->
      @if (activeTab() === 'breeds') {
        <div class="tab-content">
          <div class="form-card">
            <h3>Agregar raza</h3>
            <div class="inline-form">
              <select [(ngModel)]="newBreedSpeciesId" class="form-input">
                <option value="">Seleccionar especie</option>
                @for (sp of speciesList(); track sp.id) {
                  <option [value]="sp.id">{{ sp.name }}</option>
                }
              </select>
              <input
                type="text"
                placeholder="Nombre de la raza"
                [(ngModel)]="newBreedName"
                class="form-input"
              />
              <button
                class="btn btn-add"
                (click)="addBreed()"
                [disabled]="!newBreedName() || !newBreedSpeciesId()"
              >
                Agregar
              </button>
            </div>
          </div>

          <div class="filter-bar">
            <label>Filtrar por especie:</label>
            <select [(ngModel)]="breedFilterSpeciesId" class="form-input" (ngModelChange)="loadBreeds()">
              <option value="">Todas</option>
              @for (sp of speciesList(); track sp.id) {
                <option [value]="sp.id">{{ sp.name }}</option>
              }
            </select>
          </div>

          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Especie</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                @for (item of breedList(); track item.id) {
                  <tr>
                    <td>
                      @if (editingBreedId() === item.id) {
                        <input
                          type="text"
                          [(ngModel)]="editBreedName"
                          class="form-input form-input-sm"
                        />
                      } @else {
                        {{ item.name }}
                      }
                    </td>
                    <td>{{ item.speciesName || item.speciesId }}</td>
                    <td>
                      <span class="status-dot" [class.active]="item.isActive !== false"></span>
                      {{ item.isActive !== false ? 'Activo' : 'Inactivo' }}
                    </td>
                    <td class="actions-cell">
                      @if (editingBreedId() === item.id) {
                        <button class="btn btn-add btn-sm" (click)="saveBreed(item)">Guardar</button>
                        <button class="btn btn-cancel btn-sm" (click)="editingBreedId.set(null)">Cancelar</button>
                      } @else {
                        <button class="btn btn-edit btn-sm" (click)="startEditBreed(item)">Editar</button>
                        <button class="btn btn-delete btn-sm" (click)="deleteBreed(item)">Eliminar</button>
                      }
                    </td>
                  </tr>
                } @empty {
                  <tr><td colspan="4" class="empty-row">No hay razas registradas</td></tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }

      <!-- VACUNAS TAB -->
      @if (activeTab() === 'vaccines') {
        <div class="tab-content">
          <div class="form-card">
            <h3>Agregar vacuna</h3>
            <div class="form-grid">
              <div class="form-field">
                <label>Nombre</label>
                <input type="text" placeholder="Nombre de la vacuna" [(ngModel)]="newVaccineName" class="form-input" />
              </div>
              <div class="form-field">
                <label>Intervalo (d&iacute;as)</label>
                <input type="number" placeholder="D&iacute;as" [(ngModel)]="newVaccineInterval" class="form-input" />
              </div>
              <div class="form-field full-width">
                <label>Descripci&oacute;n</label>
                <input type="text" placeholder="Descripci&oacute;n" [(ngModel)]="newVaccineDescription" class="form-input" />
              </div>
              <div class="form-field full-width">
                <label>Especies aplicables</label>
                <div class="checkbox-group">
                  @for (sp of speciesList(); track sp.id) {
                    <label class="checkbox-label">
                      <input
                        type="checkbox"
                        [checked]="newVaccineSpecies().includes(sp.id)"
                        (change)="toggleVaccineSpecies(sp.id)"
                      />
                      {{ sp.name }}
                    </label>
                  }
                </div>
              </div>
              <div class="form-field">
                <button
                  class="btn btn-add"
                  (click)="addVaccine()"
                  [disabled]="!newVaccineName() || newVaccineSpecies().length === 0"
                >
                  Agregar
                </button>
              </div>
            </div>
          </div>

          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Especies</th>
                  <th>Intervalo (d&iacute;as)</th>
                  <th>Descripci&oacute;n</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                @for (item of vaccineList(); track item.id) {
                  <tr>
                    <td>{{ item.name }}</td>
                    <td>
                      <div class="chips">
                        @for (spId of item.species; track spId) {
                          <span class="chip">{{ getSpeciesName(spId) }}</span>
                        }
                      </div>
                    </td>
                    <td>{{ item.defaultIntervalDays || '-' }}</td>
                    <td>{{ item.description || '-' }}</td>
                    <td class="actions-cell">
                      <button class="btn btn-delete btn-sm" (click)="deleteVaccine(item)">Eliminar</button>
                    </td>
                  </tr>
                } @empty {
                  <tr><td colspan="5" class="empty-row">No hay vacunas registradas</td></tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }

      <!-- DESPARASITANTES TAB -->
      @if (activeTab() === 'dewormings') {
        <div class="tab-content">
          <div class="form-card">
            <h3>Agregar desparasitante</h3>
            <div class="form-grid">
              <div class="form-field">
                <label>Nombre</label>
                <input type="text" placeholder="Nombre" [(ngModel)]="newDewormingName" class="form-input" />
              </div>
              <div class="form-field">
                <label>Tipo</label>
                <select [(ngModel)]="newDewormingType" class="form-input">
                  <option value="">Seleccionar tipo</option>
                  <option value="interno">Interno</option>
                  <option value="externo">Externo</option>
                  <option value="ambos">Ambos</option>
                </select>
              </div>
              <div class="form-field">
                <label>Intervalo (d&iacute;as)</label>
                <input type="number" placeholder="D&iacute;as" [(ngModel)]="newDewormingInterval" class="form-input" />
              </div>
              <div class="form-field full-width">
                <label>Descripci&oacute;n</label>
                <input type="text" placeholder="Descripci&oacute;n" [(ngModel)]="newDewormingDescription" class="form-input" />
              </div>
              <div class="form-field full-width">
                <label>Especies aplicables</label>
                <div class="checkbox-group">
                  @for (sp of speciesList(); track sp.id) {
                    <label class="checkbox-label">
                      <input
                        type="checkbox"
                        [checked]="newDewormingSpecies().includes(sp.id)"
                        (change)="toggleDewormingSpecies(sp.id)"
                      />
                      {{ sp.name }}
                    </label>
                  }
                </div>
              </div>
              <div class="form-field">
                <button
                  class="btn btn-add"
                  (click)="addDeworming()"
                  [disabled]="!newDewormingName() || !newDewormingType() || newDewormingSpecies().length === 0"
                >
                  Agregar
                </button>
              </div>
            </div>
          </div>

          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Tipo</th>
                  <th>Especies</th>
                  <th>Intervalo (d&iacute;as)</th>
                  <th>Descripci&oacute;n</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                @for (item of dewormingList(); track item.id) {
                  <tr>
                    <td>{{ item.name }}</td>
                    <td class="capitalize">{{ item.type }}</td>
                    <td>
                      <div class="chips">
                        @for (spId of item.species; track spId) {
                          <span class="chip">{{ getSpeciesName(spId) }}</span>
                        }
                      </div>
                    </td>
                    <td>{{ item.defaultIntervalDays || '-' }}</td>
                    <td>{{ item.description || '-' }}</td>
                    <td class="actions-cell">
                      <button class="btn btn-delete btn-sm" (click)="deleteDeworming(item)">Eliminar</button>
                    </td>
                  </tr>
                } @empty {
                  <tr><td colspan="6" class="empty-row">No hay desparasitantes registrados</td></tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }
    </div>
  `,
  styles: `
    .catalogs-page {
      padding: 24px;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .page-title {
      font-size: 22px;
      font-weight: 700;
      color: #0F4C5C;
      margin: 0;
    }

    .tabs {
      display: flex;
      gap: 0;
      border-bottom: 2px solid #dee2e6;
      margin-bottom: 24px;
    }

    .tab-btn {
      padding: 10px 24px;
      background: none;
      border: none;
      border-bottom: 3px solid transparent;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      color: #6C757D;
      transition: all 0.2s ease;
      margin-bottom: -2px;
    }

    .tab-btn:hover {
      color: #00B4D8;
    }

    .tab-btn.active {
      color: #00B4D8;
      border-bottom-color: #00B4D8;
    }

    .tab-content {
      animation: fadeIn 0.2s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(4px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .form-card {
      background: #F8F9FA;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 20px;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
    }

    .form-card h3 {
      margin: 0 0 14px;
      font-size: 15px;
      font-weight: 600;
      color: #0F4C5C;
    }

    .inline-form {
      display: flex;
      gap: 12px;
      align-items: center;
      flex-wrap: wrap;
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
    }

    .form-field {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .form-field.full-width {
      grid-column: 1 / -1;
    }

    .form-field label {
      font-size: 12px;
      font-weight: 600;
      color: #6C757D;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .form-input {
      padding: 8px 12px;
      border: 1px solid #dee2e6;
      border-radius: 6px;
      font-size: 14px;
      font-family: inherit;
      background: #fff;
      transition: border-color 0.2s;
    }

    .form-input:focus {
      outline: none;
      border-color: #00B4D8;
      box-shadow: 0 0 0 2px rgba(0, 180, 216, 0.15);
    }

    .form-input-sm {
      padding: 4px 8px;
      font-size: 13px;
    }

    .checkbox-group {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 14px;
      color: #333;
      cursor: pointer;
    }

    .checkbox-label input[type="checkbox"] {
      accent-color: #00B4D8;
    }

    .filter-bar {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
      font-size: 14px;
      color: #6C757D;
    }

    .filter-bar .form-input {
      max-width: 240px;
    }

    .table-container {
      background: #F8F9FA;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
    }

    .data-table thead tr {
      background-color: #0F4C5C;
    }

    .data-table th {
      color: #fff;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 12px 16px;
      text-align: left;
    }

    .data-table td {
      padding: 10px 16px;
      font-size: 14px;
      border-bottom: 1px solid #e9ecef;
      color: #333;
    }

    .data-table tbody tr:hover {
      background-color: rgba(0, 180, 216, 0.04);
    }

    .empty-row {
      text-align: center;
      color: #6C757D;
      padding: 32px 16px !important;
      font-style: italic;
    }

    .actions-cell {
      display: flex;
      gap: 6px;
    }

    .status-dot {
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: #adb5bd;
      margin-right: 6px;
      vertical-align: middle;
    }

    .status-dot.active {
      background-color: #2ecc71;
    }

    .chips {
      display: flex;
      gap: 4px;
      flex-wrap: wrap;
    }

    .chip {
      display: inline-block;
      padding: 2px 10px;
      border-radius: 12px;
      background-color: #00B4D8;
      color: #fff;
      font-size: 12px;
      font-weight: 500;
    }

    .capitalize {
      text-transform: capitalize;
    }

    .btn {
      padding: 8px 16px;
      border: none;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: opacity 0.2s;
      font-family: inherit;
    }

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn:hover:not(:disabled) {
      opacity: 0.85;
    }

    .btn-sm {
      padding: 4px 10px;
      font-size: 12px;
    }

    .btn-add {
      background-color: #00B4D8;
      color: #fff;
    }

    .btn-edit {
      background-color: #6C757D;
      color: #fff;
    }

    .btn-cancel {
      background-color: #adb5bd;
      color: #fff;
    }

    .btn-delete {
      background-color: #E63946;
      color: #fff;
    }

    .btn-seed {
      background-color: #0F4C5C;
      color: #fff;
      padding: 8px 20px;
    }
  `,
})
export class CatalogsComponent implements OnInit {
  private readonly auth = inject(AuthService);

  readonly tabs = [
    { key: 'species', label: 'Especies' },
    { key: 'breeds', label: 'Razas' },
    { key: 'vaccines', label: 'Vacunas' },
    { key: 'dewormings', label: 'Desparasitantes' },
  ];

  activeTab = signal<string>('species');

  // Species
  speciesList = signal<Species[]>([]);
  newSpeciesName = signal('');
  editingSpeciesId = signal<string | null>(null);
  editSpeciesName = '';

  // Breeds
  breedList = signal<Breed[]>([]);
  newBreedName = signal('');
  newBreedSpeciesId = signal('');
  breedFilterSpeciesId = signal('');
  editingBreedId = signal<string | null>(null);
  editBreedName = '';

  // Vaccines
  vaccineList = signal<Vaccine[]>([]);
  newVaccineName = signal('');
  newVaccineSpecies = signal<string[]>([]);
  newVaccineInterval = signal<number | null>(null);
  newVaccineDescription = signal('');

  // Dewormings
  dewormingList = signal<Deworming[]>([]);
  newDewormingName = signal('');
  newDewormingType = signal('');
  newDewormingSpecies = signal<string[]>([]);
  newDewormingInterval = signal<number | null>(null);
  newDewormingDescription = signal('');

  // Seed
  seeding = signal(false);

  showSeedButton = computed(() => {
    return (
      this.speciesList().length === 0 &&
      this.vaccineList().length === 0 &&
      this.dewormingList().length === 0
    );
  });

  ngOnInit(): void {
    this.loadSpecies();
    this.loadBreeds();
    this.loadVaccines();
    this.loadDewormings();
  }

  // --- Species ---

  loadSpecies(): void {
    this.auth.apiGet<Species[]>('/api/catalogs/species').subscribe({
      next: (data) => this.speciesList.set(data ?? []),
      error: () => this.speciesList.set([]),
    });
  }

  addSpecies(): void {
    const name = this.newSpeciesName().trim();
    if (!name) return;
    this.auth.apiPost('/api/catalogs/species', { name }).subscribe({
      next: () => {
        this.newSpeciesName.set('');
        this.loadSpecies();
      },
    });
  }

  startEditSpecies(item: Species): void {
    this.editingSpeciesId.set(item.id);
    this.editSpeciesName = item.name;
  }

  saveSpecies(item: Species): void {
    const name = this.editSpeciesName.trim();
    if (!name) return;
    this.auth.apiPut(`/api/catalogs/species/${item.id}`, { name }).subscribe({
      next: () => {
        this.editingSpeciesId.set(null);
        this.loadSpecies();
      },
    });
  }

  deleteSpecies(item: Species): void {
    if (!confirm(`Eliminar especie "${item.name}"?`)) return;
    this.auth.apiDelete(`/api/catalogs/species/${item.id}`).subscribe({
      next: () => this.loadSpecies(),
    });
  }

  // --- Breeds ---

  loadBreeds(): void {
    const speciesId = this.breedFilterSpeciesId();
    const query = speciesId ? `?speciesId=${speciesId}` : '';
    this.auth.apiGet<Breed[]>(`/api/catalogs/breeds${query}`).subscribe({
      next: (data) => {
        const breeds = (data ?? []).map((b) => ({
          ...b,
          speciesName: this.getSpeciesName(b.speciesId),
        }));
        this.breedList.set(breeds);
      },
      error: () => this.breedList.set([]),
    });
  }

  addBreed(): void {
    const name = this.newBreedName().trim();
    const speciesId = this.newBreedSpeciesId();
    if (!name || !speciesId) return;
    this.auth.apiPost('/api/catalogs/breeds', { name, speciesId }).subscribe({
      next: () => {
        this.newBreedName.set('');
        this.newBreedSpeciesId.set('');
        this.loadBreeds();
      },
    });
  }

  startEditBreed(item: Breed): void {
    this.editingBreedId.set(item.id);
    this.editBreedName = item.name;
  }

  saveBreed(item: Breed): void {
    const name = this.editBreedName.trim();
    if (!name) return;
    this.auth.apiPut(`/api/catalogs/breeds/${item.id}`, { name }).subscribe({
      next: () => {
        this.editingBreedId.set(null);
        this.loadBreeds();
      },
    });
  }

  deleteBreed(item: Breed): void {
    if (!confirm(`Eliminar raza "${item.name}"?`)) return;
    this.auth.apiDelete(`/api/catalogs/breeds/${item.id}`).subscribe({
      next: () => this.loadBreeds(),
    });
  }

  // --- Vaccines ---

  loadVaccines(): void {
    this.auth.apiGet<Vaccine[]>('/api/catalogs/vaccines').subscribe({
      next: (data) => this.vaccineList.set(data ?? []),
      error: () => this.vaccineList.set([]),
    });
  }

  toggleVaccineSpecies(speciesId: string): void {
    const current = this.newVaccineSpecies();
    if (current.includes(speciesId)) {
      this.newVaccineSpecies.set(current.filter((id) => id !== speciesId));
    } else {
      this.newVaccineSpecies.set([...current, speciesId]);
    }
  }

  addVaccine(): void {
    const name = this.newVaccineName().trim();
    const species = this.newVaccineSpecies();
    if (!name || species.length === 0) return;
    const body: Record<string, unknown> = { name, species };
    const interval = this.newVaccineInterval();
    if (interval) body['defaultIntervalDays'] = interval;
    const desc = this.newVaccineDescription().trim();
    if (desc) body['description'] = desc;
    this.auth.apiPost('/api/catalogs/vaccines', body).subscribe({
      next: () => {
        this.newVaccineName.set('');
        this.newVaccineSpecies.set([]);
        this.newVaccineInterval.set(null);
        this.newVaccineDescription.set('');
        this.loadVaccines();
      },
    });
  }

  deleteVaccine(item: Vaccine): void {
    if (!confirm(`Eliminar vacuna "${item.name}"?`)) return;
    this.auth.apiDelete(`/api/catalogs/vaccines/${item.id}`).subscribe({
      next: () => this.loadVaccines(),
    });
  }

  // --- Dewormings ---

  loadDewormings(): void {
    this.auth.apiGet<Deworming[]>('/api/catalogs/dewormings').subscribe({
      next: (data) => this.dewormingList.set(data ?? []),
      error: () => this.dewormingList.set([]),
    });
  }

  toggleDewormingSpecies(speciesId: string): void {
    const current = this.newDewormingSpecies();
    if (current.includes(speciesId)) {
      this.newDewormingSpecies.set(current.filter((id) => id !== speciesId));
    } else {
      this.newDewormingSpecies.set([...current, speciesId]);
    }
  }

  addDeworming(): void {
    const name = this.newDewormingName().trim();
    const type = this.newDewormingType();
    const species = this.newDewormingSpecies();
    if (!name || !type || species.length === 0) return;
    const body: Record<string, unknown> = { name, type, species };
    const interval = this.newDewormingInterval();
    if (interval) body['defaultIntervalDays'] = interval;
    const desc = this.newDewormingDescription().trim();
    if (desc) body['description'] = desc;
    this.auth.apiPost('/api/catalogs/dewormings', body).subscribe({
      next: () => {
        this.newDewormingName.set('');
        this.newDewormingType.set('');
        this.newDewormingSpecies.set([]);
        this.newDewormingInterval.set(null);
        this.newDewormingDescription.set('');
        this.loadDewormings();
      },
    });
  }

  deleteDeworming(item: Deworming): void {
    if (!confirm(`Eliminar desparasitante "${item.name}"?`)) return;
    this.auth.apiDelete(`/api/catalogs/dewormings/${item.id}`).subscribe({
      next: () => this.loadDewormings(),
    });
  }

  // --- Seed ---

  seedData(): void {
    this.seeding.set(true);
    this.auth.apiPost('/api/catalogs/seed', {}).subscribe({
      next: () => {
        this.seeding.set(false);
        this.loadSpecies();
        this.loadBreeds();
        this.loadVaccines();
        this.loadDewormings();
      },
      error: () => this.seeding.set(false),
    });
  }

  // --- Helpers ---

  getSpeciesName(speciesId: string): string {
    const sp = this.speciesList().find((s) => s.id === speciesId);
    return sp?.name ?? speciesId;
  }
}
