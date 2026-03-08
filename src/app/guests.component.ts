import { Component, signal, computed, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ToastService } from './toast.service';

interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  loyaltyId?: string;
  status: 'VIP' | 'Return' | 'New' | 'Corporate';
  totalStays: number;
  lifetimeValue: number;
  preferences: string[];
}

@Component({
  selector: 'app-guests',
  standalone: true,
  imports: [MatIconModule, CommonModule],
  template: `
    <div class="space-y-6 max-w-7xl mx-auto">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 class="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">Guest Management (CRM)</h1>
          <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Manage guest profiles, preferences, and visit history.</p>
        </div>
        <div class="flex items-center gap-3">
          <input type="file" #fileInput class="hidden" accept=".csv" (change)="importData($event)" />
          <button (click)="fileInput.click()" class="flex items-center px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-lg text-sm font-medium transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-950">
            <mat-icon class="mr-2 text-sm" style="font-size: 18px; width: 18px; height: 18px;">upload</mat-icon>
            Import CSV
          </button>
          <button (click)="exportData()" class="flex items-center px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-lg text-sm font-medium transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-950">
            <mat-icon class="mr-2 text-sm" style="font-size: 18px; width: 18px; height: 18px;">download</mat-icon>
            Export Data
          </button>
          <button (click)="addGuest()" class="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-950">
            <mat-icon class="mr-2 text-sm" style="font-size: 18px; width: 18px; height: 18px;">person_add</mat-icon>
            Add Guest
          </button>
        </div>
      </div>

      <!-- Search & Filters -->
      <div class="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col sm:flex-row gap-4">
        <div class="relative flex-1">
          <mat-icon class="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" style="font-size: 20px; width: 20px; height: 20px;">search</mat-icon>
          <input type="text" [value]="searchQuery()" (input)="updateSearch($event)" placeholder="Search by name, email, phone, or loyalty ID..." class="w-full pl-10 pr-4 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-shadow" />
        </div>
        <div class="flex gap-3">
          <select [value]="statusFilter()" (change)="updateStatusFilter($event)" class="px-4 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none pr-10 relative">
            <option value="All">All Guests</option>
            <option value="VIP">VIP Only</option>
            <option value="Return">Returning Guests</option>
            <option value="Corporate">Corporate</option>
          </select>
        </div>
      </div>

      <!-- Guest Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (guest of filteredGuests(); track guest.id) {
          <div class="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden flex flex-col hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors">
            <div class="p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-start justify-between">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg"
                  [class.bg-indigo-100]="guest.status === 'VIP'"
                  [class.text-indigo-600]="guest.status === 'VIP'"
                  [class.dark:bg-indigo-900/30]="guest.status === 'VIP'"
                  [class.dark:text-indigo-400]="guest.status === 'VIP'"
                  [class.bg-emerald-100]="guest.status === 'Return'"
                  [class.text-emerald-600]="guest.status === 'Return'"
                  [class.dark:bg-emerald-900/30]="guest.status === 'Return'"
                  [class.dark:text-emerald-400]="guest.status === 'Return'"
                  [class.bg-zinc-100]="guest.status === 'New'"
                  [class.text-zinc-600]="guest.status === 'New'"
                  [class.dark:bg-zinc-800]="guest.status === 'New'"
                  [class.dark:text-zinc-400]="guest.status === 'New'"
                  [class.bg-blue-100]="guest.status === 'Corporate'"
                  [class.text-blue-600]="guest.status === 'Corporate'"
                  [class.dark:bg-blue-900/30]="guest.status === 'Corporate'"
                  [class.dark:text-blue-400]="guest.status === 'Corporate'">
                  {{ guest.firstName[0] }}{{ guest.lastName[0] }}
                </div>
                <div>
                  <h3 class="font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                    {{ guest.firstName }} {{ guest.lastName }}
                    <span class="text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wider font-bold"
                      [class.bg-amber-100]="guest.status === 'VIP'"
                      [class.text-amber-800]="guest.status === 'VIP'"
                      [class.dark:bg-amber-900/50]="guest.status === 'VIP'"
                      [class.dark:text-amber-300]="guest.status === 'VIP'"
                      [class.bg-emerald-100]="guest.status === 'Return'"
                      [class.text-emerald-800]="guest.status === 'Return'"
                      [class.dark:bg-emerald-900/50]="guest.status === 'Return'"
                      [class.dark:text-emerald-300]="guest.status === 'Return'"
                      [class.bg-zinc-100]="guest.status === 'New'"
                      [class.text-zinc-600]="guest.status === 'New'"
                      [class.dark:bg-zinc-800]="guest.status === 'New'"
                      [class.dark:text-zinc-400]="guest.status === 'New'"
                      [class.bg-blue-100]="guest.status === 'Corporate'"
                      [class.text-blue-800]="guest.status === 'Corporate'"
                      [class.dark:bg-blue-900/50]="guest.status === 'Corporate'"
                      [class.dark:text-blue-300]="guest.status === 'Corporate'">
                      {{ guest.status }}
                    </span>
                  </h3>
                  <p class="text-sm text-zinc-500 dark:text-zinc-400">{{ guest.email }}</p>
                </div>
              </div>
              <button class="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
                <mat-icon style="font-size: 20px; width: 20px; height: 20px;">more_vert</mat-icon>
              </button>
            </div>
            <div class="p-5 flex-1 space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-semibold">Total Stays</p>
                  <p class="text-lg font-medium text-zinc-900 dark:text-white">{{ guest.totalStays }}</p>
                </div>
                <div>
                  <p class="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-semibold">Lifetime Value</p>
                  <p class="text-lg font-medium text-zinc-900 dark:text-white">\${{ guest.lifetimeValue.toLocaleString() }}</p>
                </div>
              </div>
              <div>
                <p class="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-semibold mb-2">Preferences</p>
                <div class="flex flex-wrap gap-2">
                  @if (guest.preferences.length > 0) {
                    @for (pref of guest.preferences; track pref) {
                      <span class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">{{ pref }}</span>
                    }
                  } @else {
                    <span class="text-sm text-zinc-500 dark:text-zinc-400 italic">No preferences recorded yet.</span>
                  }
                </div>
              </div>
            </div>
            <div class="bg-zinc-50 dark:bg-zinc-800/30 px-5 py-3 border-t border-zinc-100 dark:border-zinc-800">
              <button (click)="viewProfile(guest)" class="w-full py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors">
                View Full Profile
              </button>
            </div>
          </div>
        }
        @if (filteredGuests().length === 0) {
          <div class="col-span-full py-12 text-center text-zinc-500 dark:text-zinc-400">
            <mat-icon style="font-size: 48px; width: 48px; height: 48px;" class="mb-4 opacity-50">person_off</mat-icon>
            <p class="text-lg font-medium text-zinc-900 dark:text-white mb-1">No Guests Found</p>
            <p class="text-sm">Try adjusting your search or filters.</p>
          </div>
        }
      </div>
      
      <!-- Guest Profile Modal -->
      @if (selectedGuest(); as guest) {
        <div class="fixed inset-0 bg-zinc-900/50 dark:bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div class="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <!-- Modal Header -->
            <div class="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
              <h2 class="text-xl font-bold text-zinc-900 dark:text-white">Guest Profile</h2>
              <button (click)="closeProfile()" class="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200">
                <mat-icon>close</mat-icon>
              </button>
            </div>
            <!-- Modal Body -->
            <div class="p-6 overflow-y-auto flex-1 space-y-6">
              <div class="flex items-center gap-4">
                <div class="w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                  {{ guest.firstName[0] }}{{ guest.lastName[0] }}
                </div>
                <div>
                  <h3 class="text-2xl font-bold text-zinc-900 dark:text-white">{{ guest.firstName }} {{ guest.lastName }}</h3>
                  <p class="text-zinc-500 dark:text-zinc-400">{{ guest.email }}</p>
                </div>
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <div class="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800">
                  <p class="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-semibold">Phone</p>
                  <p class="font-medium text-zinc-900 dark:text-white">{{ guest.phone || 'N/A' }}</p>
                </div>
                <div class="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800">
                  <p class="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-semibold">Loyalty ID</p>
                  <p class="font-medium text-zinc-900 dark:text-white">{{ guest.loyaltyId || 'N/A' }}</p>
                </div>
                <div class="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800">
                  <p class="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-semibold">Total Stays</p>
                  <p class="font-medium text-zinc-900 dark:text-white">{{ guest.totalStays }}</p>
                </div>
                <div class="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800">
                  <p class="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-semibold">Lifetime Value</p>
                  <p class="font-medium text-zinc-900 dark:text-white">\${{ guest.lifetimeValue.toLocaleString() }}</p>
                </div>
              </div>

              <div>
                <h4 class="text-sm font-bold text-zinc-900 dark:text-white mb-3">Preferences</h4>
                <div class="flex flex-wrap gap-2 mb-4">
                  @for (pref of guest.preferences; track pref) {
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20">
                      {{ pref }}
                      <button (click)="removePreference(guest, pref)" class="ml-2 hover:text-indigo-900 dark:hover:text-indigo-200 focus:outline-none flex items-center justify-center">
                        <mat-icon style="font-size: 14px; width: 14px; height: 14px;">close</mat-icon>
                      </button>
                    </span>
                  }
                  @if (guest.preferences.length === 0) {
                    <span class="text-sm text-zinc-500 dark:text-zinc-400 italic">No preferences recorded.</span>
                  }
                </div>
                <div class="flex gap-2">
                  <input #newPref type="text" placeholder="Add a preference (e.g., High Floor)" class="flex-1 px-3 py-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" (keydown.enter)="addPreference(guest, newPref.value); newPref.value = ''" />
                  <button (click)="addPreference(guest, newPref.value); newPref.value = ''" class="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white rounded-lg text-sm font-medium transition-colors">Add</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class GuestsComponent {
  toastService = inject(ToastService);

  searchQuery = signal('');
  statusFilter = signal('All');
  selectedGuest = signal<Guest | null>(null);

  guests = signal<Guest[]>([
    { id: '1', firstName: 'Emma', lastName: 'Wilson', email: 'emma.w@example.com', phone: '+1 555-0101', loyaltyId: 'L-98234', status: 'VIP', totalStays: 14, lifetimeValue: 8450, preferences: ['High Floor', 'Feather Pillows', 'Late Check-out'] },
    { id: '2', firstName: 'Robert', lastName: 'Johnson', email: 'robert.j@company.com', phone: '+1 555-0102', loyaltyId: 'L-12345', status: 'Return', totalStays: 4, lifetimeValue: 1250, preferences: ['Quiet Room', 'Morning Paper'] },
    { id: '3', firstName: 'Alice', lastName: 'Smith', email: 'alice.smith@email.com', phone: '+1 555-0103', loyaltyId: 'L-88321', status: 'New', totalStays: 1, lifetimeValue: 220, preferences: [] },
    { id: '4', firstName: 'Michael', lastName: 'Brown', email: 'mbrown@corp.com', phone: '+1 555-0104', loyaltyId: 'L-44592', status: 'Corporate', totalStays: 8, lifetimeValue: 4500, preferences: ['Early Check-in', 'Gym Access'] },
    { id: '5', firstName: 'Sarah', lastName: 'Davis', email: 'sarah.d@email.com', phone: '+1 555-0105', loyaltyId: 'L-99102', status: 'Return', totalStays: 3, lifetimeValue: 980, preferences: ['Extra Towels'] },
    { id: '6', firstName: 'David', lastName: 'Miller', email: 'dmiller@example.com', phone: '+1 555-0106', loyaltyId: 'L-77210', status: 'VIP', totalStays: 22, lifetimeValue: 15600, preferences: ['Suite Upgrade', 'Wine on Arrival', 'Late Check-out'] },
  ]);

  filteredGuests = computed(() => {
    const search = this.searchQuery().toLowerCase();
    const status = this.statusFilter();

    return this.guests().filter(guest => {
      const matchesSearch = guest.firstName.toLowerCase().includes(search) || 
                            guest.lastName.toLowerCase().includes(search) || 
                            guest.email.toLowerCase().includes(search) ||
                            (guest.phone && guest.phone.toLowerCase().includes(search)) ||
                            (guest.loyaltyId && guest.loyaltyId.toLowerCase().includes(search));
      const matchesStatus = status === 'All' || guest.status === status;
      return matchesSearch && matchesStatus;
    });
  });

  updateSearch(event: Event) {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  updateStatusFilter(event: Event) {
    this.statusFilter.set((event.target as HTMLSelectElement).value);
  }

  importData(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (text) {
        const lines = text.split('\n').filter(line => line.trim() !== '');
        if (lines.length <= 1) {
          this.toastService.error('CSV file is empty or invalid.');
          return;
        }
        
        const newGuests: Guest[] = [];
        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(',').map(c => c.replace(/^"|"$/g, '').trim());
          if (cols.length >= 4) {
             newGuests.push({
               id: cols[0] || Math.random().toString(36).substring(2, 9),
               firstName: cols[1] || 'Unknown',
               lastName: cols[2] || 'Unknown',
               email: cols[3] || '',
               phone: cols[4] || '',
               loyaltyId: cols[5] || '',
               status: (cols[6] as Guest['status']) || 'New',
               totalStays: parseInt(cols[7]) || 0,
               lifetimeValue: parseFloat(cols[8]) || 0,
               preferences: cols[9] ? cols[9].split(';').map(p => p.trim()).filter(p => p) : []
             });
          }
        }
        
        this.guests.update(g => [...g, ...newGuests]);
        this.toastService.success(`${newGuests.length} guests imported successfully.`);
      }
    };
    reader.readAsText(file);
    input.value = '';
  }

  exportData() {
    const data = this.filteredGuests();
    if (data.length === 0) {
      this.toastService.error('No data to export.');
      return;
    }
    
    const headers = ['ID', 'First Name', 'Last Name', 'Email', 'Phone', 'Loyalty ID', 'Status', 'Total Stays', 'Lifetime Value', 'Preferences'];
    const csvRows = [headers.join(',')];
    
    for (const guest of data) {
      const row = [
        guest.id,
        `"${guest.firstName}"`,
        `"${guest.lastName}"`,
        `"${guest.email}"`,
        `"${guest.phone || ''}"`,
        `"${guest.loyaltyId || ''}"`,
        guest.status,
        guest.totalStays,
        guest.lifetimeValue,
        `"${guest.preferences.join('; ')}"`
      ];
      csvRows.push(row.join(','));
    }
    
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'guests_export.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    this.toastService.success('Guest data exported successfully.');
  }

  addGuest() {
    this.toastService.info('Opening add guest form...');
  }

  viewProfile(guest: Guest) {
    this.selectedGuest.set(guest);
  }

  closeProfile() {
    this.selectedGuest.set(null);
  }

  addPreference(guest: Guest, pref: string) {
    const trimmed = pref.trim();
    if (!trimmed) return;
    
    if (guest.preferences.includes(trimmed)) {
      this.toastService.error('Preference already exists.');
      return;
    }
    
    this.guests.update(guests => guests.map(g => {
      if (g.id === guest.id) {
        return { ...g, preferences: [...g.preferences, trimmed] };
      }
      return g;
    }));
    
    this.selectedGuest.update(g => {
      if (g && g.id === guest.id) {
        return { ...g, preferences: [...g.preferences, trimmed] };
      }
      return g;
    });
    
    this.toastService.success('Preference added.');
  }

  removePreference(guest: Guest, pref: string) {
    this.guests.update(guests => guests.map(g => {
      if (g.id === guest.id) {
        return { ...g, preferences: g.preferences.filter(p => p !== pref) };
      }
      return g;
    }));
    
    this.selectedGuest.update(g => {
      if (g && g.id === guest.id) {
        return { ...g, preferences: g.preferences.filter(p => p !== pref) };
      }
      return g;
    });
    
    this.toastService.success('Preference removed.');
  }
}
