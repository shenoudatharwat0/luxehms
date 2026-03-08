import { Component, signal, computed, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ToastService } from './toast.service';

interface Charge {
  id: string;
  date: string;
  description: string;
  dept: string;
  amount: number;
  type: 'charge' | 'payment';
}

interface Folio {
  id: string;
  room: string;
  guestName: string;
  dates: string;
  status: 'Open' | 'Closed';
  charges: Charge[];
}

@Component({
  selector: 'app-billing',
  standalone: true,
  imports: [MatIconModule, CommonModule],
  template: `
    <div class="space-y-6 max-w-7xl mx-auto">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 class="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">Billing & POS</h1>
          <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Manage folios, split billing, POS charges, and invoices.</p>
        </div>
        <div class="flex items-center gap-3">
          <button (click)="postCharge()" class="flex items-center px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-lg text-sm font-medium transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-950">
            <mat-icon class="mr-2 text-sm" style="font-size: 18px; width: 18px; height: 18px;">point_of_sale</mat-icon>
            Post POS Charge
          </button>
          <button (click)="createInvoice()" class="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-950">
            <mat-icon class="mr-2 text-sm" style="font-size: 18px; width: 18px; height: 18px;">receipt_long</mat-icon>
            Create Invoice
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Active Folios List -->
        <div class="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col h-[600px]">
          <div class="p-4 border-b border-zinc-200 dark:border-zinc-800">
            <h3 class="font-semibold text-zinc-900 dark:text-white mb-3">Active Folios</h3>
            <div class="relative">
              <mat-icon class="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" style="font-size: 18px; width: 18px; height: 18px;">search</mat-icon>
              <input type="text" [value]="searchQuery()" (input)="updateSearch($event)" placeholder="Search room or guest..." class="w-full pl-9 pr-4 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>
          <div class="flex-1 overflow-y-auto">
            <ul class="divide-y divide-zinc-100 dark:divide-zinc-800/50">
              @for (folio of filteredFolios(); track folio.id) {
                <li (click)="selectFolio(folio)" (keydown.enter)="selectFolio(folio)" tabindex="0" class="p-4 cursor-pointer transition-colors border-l-4 group relative"
                  [class.bg-indigo-50]="selectedFolio()?.id === folio.id"
                  [class.dark:bg-indigo-500/5]="selectedFolio()?.id === folio.id"
                  [class.border-indigo-500]="selectedFolio()?.id === folio.id"
                  [class.hover:bg-zinc-50]="selectedFolio()?.id !== folio.id"
                  [class.dark:hover:bg-zinc-800/50]="selectedFolio()?.id !== folio.id"
                  [class.border-transparent]="selectedFolio()?.id !== folio.id">
                  <div class="flex justify-between items-start">
                    <div>
                      <p class="font-medium text-zinc-900 dark:text-white">Room {{ folio.room }}</p>
                      <p class="text-sm text-zinc-500 dark:text-zinc-400">{{ folio.guestName }}</p>
                    </div>
                    <div class="text-right">
                      <p class="font-bold" [class.text-indigo-600]="selectedFolio()?.id === folio.id" [class.dark:text-indigo-400]="selectedFolio()?.id === folio.id" [class.text-zinc-900]="selectedFolio()?.id !== folio.id" [class.dark:text-white]="selectedFolio()?.id !== folio.id">
                        \${{ calculateBalance(folio).toFixed(2) }}
                      </p>
                    </div>
                  </div>
                  <!-- Quick Actions -->
                  <div class="absolute right-4 bottom-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-white dark:bg-zinc-900 p-1 rounded-md shadow-sm border border-zinc-200 dark:border-zinc-700">
                    <button (click)="quickAddCharge(folio, $event)" class="p-1 text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" title="Add Charge">
                      <mat-icon style="font-size: 16px; width: 16px; height: 16px;">add_circle</mat-icon>
                    </button>
                    <button (click)="quickAddPayment(folio, $event)" class="p-1 text-zinc-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors" title="Add Payment">
                      <mat-icon style="font-size: 16px; width: 16px; height: 16px;">payments</mat-icon>
                    </button>
                    <button (click)="quickViewDetails(folio, $event)" class="p-1 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors" title="View Details">
                      <mat-icon style="font-size: 16px; width: 16px; height: 16px;">visibility</mat-icon>
                    </button>
                  </div>
                </li>
              }
              @if (filteredFolios().length === 0) {
                <li class="p-4 text-center text-zinc-500 dark:text-zinc-400 text-sm">
                  No folios found.
                </li>
              }
            </ul>
          </div>
        </div>

        <!-- Folio Details -->
        <div class="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col h-[600px]">
          @if (selectedFolio(); as folio) {
            <!-- Folio Header -->
            <div class="p-6 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-start">
              <div>
                <div class="flex items-center gap-3 mb-1">
                  <h2 class="text-xl font-bold text-zinc-900 dark:text-white">Folio #{{ folio.id }}</h2>
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    [class.bg-emerald-100]="folio.status === 'Open'"
                    [class.text-emerald-800]="folio.status === 'Open'"
                    [class.dark:bg-emerald-500/10]="folio.status === 'Open'"
                    [class.dark:text-emerald-400]="folio.status === 'Open'"
                    [class.bg-zinc-100]="folio.status === 'Closed'"
                    [class.text-zinc-800]="folio.status === 'Closed'"
                    [class.dark:bg-zinc-800]="folio.status === 'Closed'"
                    [class.dark:text-zinc-300]="folio.status === 'Closed'">
                    {{ folio.status }}
                  </span>
                </div>
                <p class="text-sm text-zinc-500 dark:text-zinc-400">{{ folio.guestName }} • Room {{ folio.room }} • {{ folio.dates }}</p>
              </div>
              <div class="text-right">
                <p class="text-sm text-zinc-500 dark:text-zinc-400 mb-1">Total Balance</p>
                <p class="text-3xl font-bold text-indigo-600 dark:text-indigo-400 tracking-tight">\${{ calculateBalance(folio).toFixed(2) }}</p>
              </div>
            </div>

            <!-- Folio Actions -->
            <div class="px-6 py-3 border-b border-zinc-100 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-900/50 flex gap-2">
              <button (click)="splitFolio()" class="px-3 py-1.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors flex items-center">
                <mat-icon style="font-size: 16px; width: 16px; height: 16px;" class="mr-1.5">call_split</mat-icon> Split Folio
              </button>
              <button (click)="addPayment()" class="px-3 py-1.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors flex items-center">
                <mat-icon style="font-size: 16px; width: 16px; height: 16px;" class="mr-1.5">credit_card</mat-icon> Add Payment
              </button>
              <button (click)="generatePdf()" class="px-3 py-1.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors flex items-center ml-auto">
                <mat-icon style="font-size: 16px; width: 16px; height: 16px;" class="mr-1.5">picture_as_pdf</mat-icon> Generate PDF
              </button>
            </div>

            <!-- Charges List -->
            <div class="flex-1 overflow-y-auto p-6">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="border-b border-zinc-200 dark:border-zinc-800 text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    <th class="pb-3 font-medium">Date</th>
                    <th class="pb-3 font-medium">Description</th>
                    <th class="pb-3 font-medium">Dept</th>
                    <th class="pb-3 font-medium text-right">Amount</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                  @for (charge of folio.charges; track charge.id) {
                    <tr [class.bg-emerald-50]="charge.type === 'payment'" [class.dark:bg-emerald-500/5]="charge.type === 'payment'">
                      <td class="py-3 text-sm" [class.text-zinc-500]="charge.type === 'charge'" [class.dark:text-zinc-400]="charge.type === 'charge'" [class.text-emerald-600]="charge.type === 'payment'" [class.dark:text-emerald-400]="charge.type === 'payment'">{{ charge.date }}</td>
                      <td class="py-3 text-sm font-medium" [class.text-zinc-900]="charge.type === 'charge'" [class.dark:text-white]="charge.type === 'charge'" [class.text-emerald-700]="charge.type === 'payment'" [class.dark:text-emerald-300]="charge.type === 'payment'">{{ charge.description }}</td>
                      <td class="py-3 text-sm" [class.text-zinc-500]="charge.type === 'charge'" [class.dark:text-zinc-400]="charge.type === 'charge'" [class.text-emerald-600]="charge.type === 'payment'" [class.dark:text-emerald-400]="charge.type === 'payment'">{{ charge.dept }}</td>
                      <td class="py-3 text-sm font-medium text-right" [class.text-zinc-900]="charge.type === 'charge'" [class.dark:text-white]="charge.type === 'charge'" [class.text-emerald-700]="charge.type === 'payment'" [class.dark:text-emerald-300]="charge.type === 'payment'">
                        {{ charge.type === 'payment' ? '-' : '' }}\${{ charge.amount.toFixed(2) }}
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
            
            <!-- Summary Footer -->
            <div class="p-6 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
              <div class="flex justify-between items-center mb-2">
                <span class="text-sm text-zinc-500 dark:text-zinc-400">Subtotal</span>
                <span class="text-sm font-medium text-zinc-900 dark:text-white">\${{ calculateSubtotal(folio).toFixed(2) }}</span>
              </div>
              <div class="flex justify-between items-center mb-2">
                <span class="text-sm text-zinc-500 dark:text-zinc-400">Taxes</span>
                <span class="text-sm font-medium text-zinc-900 dark:text-white">\${{ calculateTaxes(folio).toFixed(2) }}</span>
              </div>
              <div class="flex justify-between items-center mb-4">
                <span class="text-sm text-zinc-500 dark:text-zinc-400">Payments</span>
                <span class="text-sm font-medium text-emerald-600 dark:text-emerald-400">-\${{ calculatePayments(folio).toFixed(2) }}</span>
              </div>
              <div class="flex justify-between items-center pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <span class="text-base font-bold text-zinc-900 dark:text-white">Balance Due</span>
                <span class="text-xl font-bold text-indigo-600 dark:text-indigo-400">\${{ calculateBalance(folio).toFixed(2) }}</span>
              </div>
              @if (folio.status === 'Open') {
                <button (click)="settleFolio(folio)" class="w-full mt-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-950">
                  Settle Folio & Checkout
                </button>
              }
            </div>
          } @else {
            <div class="flex-1 flex flex-col items-center justify-center text-zinc-500 dark:text-zinc-400 p-6 text-center">
              <mat-icon style="font-size: 48px; width: 48px; height: 48px;" class="mb-4 opacity-50">receipt_long</mat-icon>
              <p class="text-lg font-medium text-zinc-900 dark:text-white mb-1">No Folio Selected</p>
              <p class="text-sm">Select a folio from the list to view details and manage charges.</p>
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class BillingComponent {
  toastService = inject(ToastService);

  searchQuery = signal('');
  
  folios = signal<Folio[]>([
    {
      id: 'F-304',
      room: '304',
      guestName: 'John Doe',
      dates: 'Oct 12 - Oct 15',
      status: 'Open',
      charges: [
        { id: 'c1', date: 'Oct 12', description: 'Room Charge (Deluxe King)', dept: 'Room', amount: 150.00, type: 'charge' },
        { id: 'c2', date: 'Oct 12', description: 'City Tax (10%)', dept: 'Tax', amount: 15.00, type: 'charge' },
        { id: 'c3', date: 'Oct 12', description: 'Lobby Bar - Drinks', dept: 'F&B', amount: 45.00, type: 'charge' },
        { id: 'c4', date: 'Oct 13', description: 'Room Charge (Deluxe King)', dept: 'Room', amount: 150.00, type: 'charge' },
        { id: 'c5', date: 'Oct 13', description: 'City Tax (10%)', dept: 'Tax', amount: 15.00, type: 'charge' },
        { id: 'c6', date: 'Oct 13', description: 'Spa Services - Massage', dept: 'Spa', amount: 120.00, type: 'charge' },
        { id: 'c7', date: 'Oct 14', description: 'Room Charge (Deluxe King)', dept: 'Room', amount: 150.00, type: 'charge' },
        { id: 'c8', date: 'Oct 14', description: 'City Tax (10%)', dept: 'Tax', amount: 15.00, type: 'charge' },
        { id: 'p1', date: 'Oct 12', description: 'Advance Deposit (Visa ...4242)', dept: 'Payment', amount: 75.00, type: 'payment' },
      ]
    },
    {
      id: 'F-201',
      room: '201',
      guestName: 'Emma Wilson',
      dates: 'Oct 10 - Oct 15',
      status: 'Open',
      charges: [
        { id: 'c1', date: 'Oct 10', description: 'Room Charge (Suite)', dept: 'Room', amount: 250.00, type: 'charge' },
        { id: 'c2', date: 'Oct 10', description: 'City Tax (10%)', dept: 'Tax', amount: 25.00, type: 'charge' },
        { id: 'c3', date: 'Oct 11', description: 'Room Charge (Suite)', dept: 'Room', amount: 250.00, type: 'charge' },
        { id: 'c4', date: 'Oct 11', description: 'City Tax (10%)', dept: 'Tax', amount: 25.00, type: 'charge' },
        { id: 'c5', date: 'Oct 12', description: 'Room Charge (Suite)', dept: 'Room', amount: 250.00, type: 'charge' },
        { id: 'c6', date: 'Oct 12', description: 'City Tax (10%)', dept: 'Tax', amount: 25.00, type: 'charge' },
        { id: 'c7', date: 'Oct 13', description: 'Room Charge (Suite)', dept: 'Room', amount: 250.00, type: 'charge' },
        { id: 'c8', date: 'Oct 13', description: 'City Tax (10%)', dept: 'Tax', amount: 25.00, type: 'charge' },
        { id: 'c9', date: 'Oct 14', description: 'Room Charge (Suite)', dept: 'Room', amount: 250.00, type: 'charge' },
        { id: 'c10', date: 'Oct 14', description: 'City Tax (10%)', dept: 'Tax', amount: 25.00, type: 'charge' },
        { id: 'c11', date: 'Oct 14', description: 'Room Service', dept: 'F&B', amount: 85.50, type: 'charge' },
        { id: 'p1', date: 'Oct 10', description: 'Advance Deposit (Amex ...1234)', dept: 'Payment', amount: 200.00, type: 'payment' },
      ]
    },
    {
      id: 'F-112',
      room: '112',
      guestName: 'Alice Smith',
      dates: 'Oct 14 - Oct 15',
      status: 'Open',
      charges: [
        { id: 'c1', date: 'Oct 14', description: 'Room Charge (Standard)', dept: 'Room', amount: 100.00, type: 'charge' },
        { id: 'c2', date: 'Oct 14', description: 'City Tax (10%)', dept: 'Tax', amount: 10.00, type: 'charge' },
        { id: 'c3', date: 'Oct 14', description: 'Mini Bar', dept: 'F&B', amount: 15.00, type: 'charge' },
        { id: 'p1', date: 'Oct 14', description: 'Advance Deposit (MC ...9876)', dept: 'Payment', amount: 50.00, type: 'payment' },
      ]
    }
  ]);

  selectedFolio = signal<Folio | null>(this.folios()[0]);

  filteredFolios = computed(() => {
    const search = this.searchQuery().toLowerCase();
    return this.folios().filter(folio => 
      folio.room.toLowerCase().includes(search) || 
      folio.guestName.toLowerCase().includes(search) ||
      folio.id.toLowerCase().includes(search)
    );
  });

  updateSearch(event: Event) {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  selectFolio(folio: Folio) {
    this.selectedFolio.set(folio);
  }

  calculateSubtotal(folio: Folio): number {
    return folio.charges.filter(c => c.type === 'charge' && c.dept !== 'Tax').reduce((sum, c) => sum + c.amount, 0);
  }

  calculateTaxes(folio: Folio): number {
    return folio.charges.filter(c => c.dept === 'Tax').reduce((sum, c) => sum + c.amount, 0);
  }

  calculatePayments(folio: Folio): number {
    return folio.charges.filter(c => c.type === 'payment').reduce((sum, c) => sum + c.amount, 0);
  }

  calculateBalance(folio: Folio): number {
    const totalCharges = folio.charges.filter(c => c.type === 'charge').reduce((sum, c) => sum + c.amount, 0);
    const totalPayments = this.calculatePayments(folio);
    return totalCharges - totalPayments;
  }

  postCharge() {
    this.toastService.info('Opening post charge modal...');
  }

  createInvoice() {
    this.toastService.info('Opening create invoice form...');
  }

  splitFolio() {
    this.toastService.info('Opening split folio interface...');
  }

  addPayment() {
    if (this.selectedFolio()) {
      this.toastService.success(`Payment added to Folio #${this.selectedFolio()?.id}`);
    }
  }

  generatePdf() {
    this.toastService.success('PDF generated and downloading...');
  }

  settleFolio(folio: Folio) {
    this.folios.update(folios => folios.map(f => f.id === folio.id ? { ...f, status: 'Closed' } : f));
    if (this.selectedFolio()?.id === folio.id) {
      this.selectedFolio.set({ ...folio, status: 'Closed' });
    }
    this.toastService.success(`Folio #${folio.id} settled and closed.`);
  }

  quickAddCharge(folio: Folio, event: Event) {
    event.stopPropagation();
    this.toastService.info(`Opening add charge modal for Folio #${folio.id}...`);
  }

  quickAddPayment(folio: Folio, event: Event) {
    event.stopPropagation();
    this.toastService.info(`Opening add payment modal for Folio #${folio.id}...`);
  }

  quickViewDetails(folio: Folio, event: Event) {
    event.stopPropagation();
    this.selectFolio(folio);
  }
}
