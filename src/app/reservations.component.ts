import { Component, signal, computed, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ToastService } from './toast.service';

interface Reservation {
  id: string;
  guestName: string;
  guestInitials: string;
  channel: string;
  dates: string;
  startDate: string;
  endDate: string;
  roomId: string;
  nights: number;
  roomType: string;
  guests: number;
  status: 'Confirmed' | 'Pending' | 'Checked Out' | 'Cancelled';
  amount: number;
  paymentStatus: 'Paid' | 'Deposit Due' | 'Unpaid';
}

interface Room {
  id: string;
  number: string;
  type: string;
}

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [MatIconModule, CommonModule],
  template: `
    <div class="space-y-6 max-w-7xl mx-auto">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 class="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">Reservations</h1>
          <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Manage bookings, availability, and channel sync.</p>
        </div>
        <div class="flex items-center gap-3">
          <button (click)="toggleViewMode()" class="flex items-center px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-lg text-sm font-medium transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-950">
            <mat-icon class="mr-2 text-sm" style="font-size: 18px; width: 18px; height: 18px;">{{ viewMode() === 'list' ? 'calendar_month' : 'list' }}</mat-icon>
            {{ viewMode() === 'list' ? 'Calendar View' : 'List View' }}
          </button>
          <button (click)="newReservation()" class="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-950">
            <mat-icon class="mr-2 text-sm" style="font-size: 18px; width: 18px; height: 18px;">add</mat-icon>
            New Reservation
          </button>
        </div>
      </div>

      <!-- Filters & Search -->
      @if (viewMode() === 'list') {
        <div class="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col sm:flex-row gap-4">
          <div class="relative flex-1">
            <mat-icon class="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" style="font-size: 20px; width: 20px; height: 20px;">search</mat-icon>
            <input type="text" [value]="searchQuery()" (input)="updateSearch($event)" placeholder="Search by guest name or booking ID..." class="w-full pl-10 pr-4 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-shadow" />
          </div>
          <div class="flex gap-3">
            <select [value]="statusFilter()" (change)="updateStatusFilter($event)" class="px-4 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none pr-10 relative">
              <option value="All">All Statuses</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Pending">Pending</option>
              <option value="Checked Out">Checked Out</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <select [value]="channelFilter()" (change)="updateChannelFilter($event)" class="px-4 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none pr-10 relative">
              <option value="All">All Channels</option>
              <option value="Direct">Direct</option>
              <option value="Booking.com">Booking.com</option>
              <option value="Expedia">Expedia</option>
            </select>
          </div>
        </div>
      }

      <!-- Main Content Area -->
      @if (viewMode() === 'list') {
        <!-- Reservations Table -->
        <div class="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr class="border-b border-zinc-200 dark:border-zinc-800 text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400 bg-zinc-50/50 dark:bg-zinc-900/50">
                  <th class="px-6 py-4 font-medium">Booking ID</th>
                  <th class="px-6 py-4 font-medium">Guest</th>
                  <th class="px-6 py-4 font-medium">Dates</th>
                  <th class="px-6 py-4 font-medium">Room Type</th>
                  <th class="px-6 py-4 font-medium">Status</th>
                  <th class="px-6 py-4 font-medium">Amount</th>
                  <th class="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-zinc-200 dark:divide-zinc-800">
                @for (res of filteredReservations(); track res.id) {
                  <tr class="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group">
                    <td class="px-6 py-4 text-sm font-mono text-indigo-600 dark:text-indigo-400 font-medium">{{ res.id }}</td>
                    <td class="px-6 py-4">
                      <div class="flex items-center">
                        <div class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mr-3"
                          [class.bg-indigo-100]="res.channel === 'Booking.com'"
                          [class.text-indigo-600]="res.channel === 'Booking.com'"
                          [class.dark:bg-indigo-900]="res.channel === 'Booking.com'"
                          [class.dark:text-indigo-400]="res.channel === 'Booking.com'"
                          [class.bg-amber-100]="res.channel === 'Direct'"
                          [class.text-amber-600]="res.channel === 'Direct'"
                          [class.dark:bg-amber-900]="res.channel === 'Direct'"
                          [class.dark:text-amber-400]="res.channel === 'Direct'"
                          [class.bg-rose-100]="res.channel === 'Expedia'"
                          [class.text-rose-600]="res.channel === 'Expedia'"
                          [class.dark:bg-rose-900]="res.channel === 'Expedia'"
                          [class.dark:text-rose-400]="res.channel === 'Expedia'">
                          {{ res.guestInitials }}
                        </div>
                        <div>
                          <p class="text-sm font-medium text-zinc-900 dark:text-white">{{ res.guestName }}</p>
                          <p class="text-xs text-zinc-500 dark:text-zinc-400">{{ res.channel }}</p>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <p class="text-sm text-zinc-900 dark:text-white">{{ res.dates }}</p>
                      <p class="text-xs text-zinc-500 dark:text-zinc-400">{{ res.nights }} Nights</p>
                    </td>
                    <td class="px-6 py-4">
                      <p class="text-sm text-zinc-900 dark:text-white">{{ res.roomType }}</p>
                      <p class="text-xs text-zinc-500 dark:text-zinc-400">{{ res.guests }} Guests</p>
                    </td>
                    <td class="px-6 py-4">
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"
                        [class.bg-emerald-100]="res.status === 'Confirmed'"
                        [class.text-emerald-800]="res.status === 'Confirmed'"
                        [class.border-emerald-200]="res.status === 'Confirmed'"
                        [class.dark:bg-emerald-500/10]="res.status === 'Confirmed'"
                        [class.dark:text-emerald-400]="res.status === 'Confirmed'"
                        [class.dark:border-emerald-500/20]="res.status === 'Confirmed'"
                        [class.bg-amber-100]="res.status === 'Pending'"
                        [class.text-amber-800]="res.status === 'Pending'"
                        [class.border-amber-200]="res.status === 'Pending'"
                        [class.dark:bg-amber-500/10]="res.status === 'Pending'"
                        [class.dark:text-amber-400]="res.status === 'Pending'"
                        [class.dark:border-amber-500/20]="res.status === 'Pending'"
                        [class.bg-zinc-100]="res.status === 'Checked Out' || res.status === 'Cancelled'"
                        [class.text-zinc-800]="res.status === 'Checked Out' || res.status === 'Cancelled'"
                        [class.border-zinc-200]="res.status === 'Checked Out' || res.status === 'Cancelled'"
                        [class.dark:bg-zinc-500/10]="res.status === 'Checked Out' || res.status === 'Cancelled'"
                        [class.dark:text-zinc-400]="res.status === 'Checked Out' || res.status === 'Cancelled'"
                        [class.dark:border-zinc-500/20]="res.status === 'Checked Out' || res.status === 'Cancelled'">
                        {{ res.status }}
                      </span>
                    </td>
                    <td class="px-6 py-4">
                      <p class="text-sm font-medium text-zinc-900 dark:text-white">\${{ res.amount.toFixed(2) }}</p>
                      <p class="text-xs"
                        [class.text-emerald-600]="res.paymentStatus === 'Paid'"
                        [class.dark:text-emerald-400]="res.paymentStatus === 'Paid'"
                        [class.text-amber-600]="res.paymentStatus === 'Deposit Due'"
                        [class.dark:text-amber-400]="res.paymentStatus === 'Deposit Due'"
                        [class.text-rose-600]="res.paymentStatus === 'Unpaid'"
                        [class.dark:text-rose-400]="res.paymentStatus === 'Unpaid'">
                        {{ res.paymentStatus }}
                      </p>
                    </td>
                    <td class="px-6 py-4 text-right">
                      <button class="p-1.5 text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-500/10">
                        <mat-icon style="font-size: 20px; width: 20px; height: 20px;">edit</mat-icon>
                      </button>
                      <button class="p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 ml-1">
                        <mat-icon style="font-size: 20px; width: 20px; height: 20px;">more_vert</mat-icon>
                      </button>
                    </td>
                  </tr>
                }
                @if (filteredReservations().length === 0) {
                  <tr>
                    <td colspan="7" class="px-6 py-8 text-center text-zinc-500 dark:text-zinc-400 text-sm">
                      No reservations found matching your criteria.
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
          
          <!-- Pagination -->
          <div class="px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <p class="text-sm text-zinc-500 dark:text-zinc-400">Showing <span class="font-medium text-zinc-900 dark:text-white">{{ filteredReservations().length }}</span> results</p>
            <div class="flex gap-2">
              <button class="px-3 py-1 border border-zinc-200 dark:border-zinc-700 rounded-md text-sm font-medium text-zinc-500 dark:text-zinc-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors" disabled>Previous</button>
              <button class="px-3 py-1 border border-zinc-200 dark:border-zinc-700 rounded-md text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors" disabled>Next</button>
            </div>
          </div>
        </div>
      } @else {
        <!-- Calendar View -->
        <div class="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden flex flex-col">
          <!-- Calendar Header (Dates) -->
          <div class="flex border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
            <div class="w-32 flex-shrink-0 p-4 border-r border-zinc-200 dark:border-zinc-800 flex items-center justify-center">
              <span class="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Room</span>
            </div>
            <div class="flex-1 flex">
              @for (date of calendarDates; track date.fullDate) {
                <div class="flex-1 p-3 text-center border-r border-zinc-200 dark:border-zinc-800 last:border-r-0">
                  <p class="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase">{{ date.dayOfWeek }}</p>
                  <p class="text-lg font-bold text-zinc-900 dark:text-white">{{ date.dayOfMonth }}</p>
                </div>
              }
            </div>
          </div>
          
          <!-- Calendar Body (Rooms & Reservations) -->
          <div class="flex-1 overflow-y-auto">
            @for (room of rooms; track room.id) {
              <div class="flex border-b border-zinc-200 dark:border-zinc-800 last:border-b-0 group">
                <!-- Room Info -->
                <div class="w-32 flex-shrink-0 p-4 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 group-hover:bg-zinc-50 dark:group-hover:bg-zinc-800/50 transition-colors">
                  <p class="font-bold text-zinc-900 dark:text-white">{{ room.number }}</p>
                  <p class="text-xs text-zinc-500 dark:text-zinc-400 truncate">{{ room.type }}</p>
                </div>
                
                <!-- Room Timeline -->
                <div class="flex-1 flex relative bg-zinc-50/30 dark:bg-zinc-950/30">
                  <!-- Grid Lines -->
                  <div class="absolute inset-0 flex pointer-events-none">
                    @for (date of calendarDates; track date.fullDate) {
                      <div class="flex-1 border-r border-zinc-200 dark:border-zinc-800 last:border-r-0"></div>
                    }
                  </div>
                  
                  <!-- Drop Zones -->
                  <div class="absolute inset-0 flex">
                    @for (date of calendarDates; track date.fullDate) {
                      <div class="flex-1 h-full"
                           (dragover)="onDragOver($event)"
                           (drop)="onDrop($event, room.id, date.fullDate)">
                      </div>
                    }
                  </div>

                  <!-- Reservations -->
                  @for (res of getReservationsForRoom(room.id); track res.id) {
                    <div class="absolute top-2 bottom-2 rounded-md shadow-sm border p-2 cursor-move overflow-hidden"
                         [style.left]="getReservationLeftPosition(res)"
                         [style.width]="getReservationWidth(res)"
                         draggable="true"
                         (dragstart)="onDragStart($event, res)"
                         [class.bg-indigo-100]="res.status === 'Confirmed'"
                         [class.border-indigo-200]="res.status === 'Confirmed'"
                         [class.dark:bg-indigo-900/50]="res.status === 'Confirmed'"
                         [class.dark:border-indigo-800]="res.status === 'Confirmed'"
                         [class.bg-amber-100]="res.status === 'Pending'"
                         [class.border-amber-200]="res.status === 'Pending'"
                         [class.dark:bg-amber-900/50]="res.status === 'Pending'"
                         [class.dark:border-amber-800]="res.status === 'Pending'"
                         [class.bg-emerald-100]="res.status === 'Checked Out'"
                         [class.border-emerald-200]="res.status === 'Checked Out'"
                         [class.dark:bg-emerald-900/50]="res.status === 'Checked Out'"
                         [class.dark:border-emerald-800]="res.status === 'Checked Out'"
                         [class.opacity-50]="res.status === 'Cancelled'">
                      <div class="flex items-center justify-between mb-1">
                        <p class="text-xs font-bold truncate"
                           [class.text-indigo-900]="res.status === 'Confirmed'"
                           [class.dark:text-indigo-100]="res.status === 'Confirmed'"
                           [class.text-amber-900]="res.status === 'Pending'"
                           [class.dark:text-amber-100]="res.status === 'Pending'"
                           [class.text-emerald-900]="res.status === 'Checked Out'"
                           [class.dark:text-emerald-100]="res.status === 'Checked Out'">
                          {{ res.guestName }}
                        </p>
                      </div>
                      <p class="text-[10px] truncate opacity-80"
                         [class.text-indigo-800]="res.status === 'Confirmed'"
                         [class.dark:text-indigo-200]="res.status === 'Confirmed'"
                         [class.text-amber-800]="res.status === 'Pending'"
                         [class.dark:text-amber-200]="res.status === 'Pending'"
                         [class.text-emerald-800]="res.status === 'Checked Out'"
                         [class.dark:text-emerald-200]="res.status === 'Checked Out'">
                        {{ res.id }} • {{ res.status }}
                      </p>
                    </div>
                  }
                </div>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `
})
export class ReservationsComponent {
  toastService = inject(ToastService);

  searchQuery = signal('');
  statusFilter = signal('All');
  channelFilter = signal('All');
  viewMode = signal<'list' | 'calendar'>('list');

  rooms: Room[] = [
    { id: 'r1', number: '101', type: 'Standard Queen' },
    { id: 'r2', number: '102', type: 'Deluxe King' },
    { id: 'r3', number: '103', type: 'Standard Queen' },
    { id: 'r4', number: '104', type: 'Executive Suite' },
    { id: 'r5', number: '201', type: 'Standard Queen' },
    { id: 'r6', number: '202', type: 'Deluxe King' },
  ];

  calendarDates = [
    { fullDate: '2023-10-12', dayOfWeek: 'Thu', dayOfMonth: '12' },
    { fullDate: '2023-10-13', dayOfWeek: 'Fri', dayOfMonth: '13' },
    { fullDate: '2023-10-14', dayOfWeek: 'Sat', dayOfMonth: '14' },
    { fullDate: '2023-10-15', dayOfWeek: 'Sun', dayOfMonth: '15' },
    { fullDate: '2023-10-16', dayOfWeek: 'Mon', dayOfMonth: '16' },
    { fullDate: '2023-10-17', dayOfWeek: 'Tue', dayOfMonth: '17' },
    { fullDate: '2023-10-18', dayOfWeek: 'Wed', dayOfMonth: '18' },
  ];

  reservations = signal<Reservation[]>([
    { id: '#RES-7829', guestName: 'John Doe', guestInitials: 'JD', channel: 'Booking.com', dates: 'Oct 12 - Oct 15', startDate: '2023-10-12', endDate: '2023-10-15', roomId: 'r1', nights: 3, roomType: 'Deluxe King', guests: 2, status: 'Confirmed', amount: 450.00, paymentStatus: 'Paid' },
    { id: '#RES-7830', guestName: 'Alice Smith', guestInitials: 'AS', channel: 'Direct', dates: 'Oct 14 - Oct 16', startDate: '2023-10-14', endDate: '2023-10-16', roomId: 'r3', nights: 2, roomType: 'Standard Queen', guests: 1, status: 'Pending', amount: 220.00, paymentStatus: 'Deposit Due' },
    { id: '#RES-7831', guestName: 'Robert Johnson', guestInitials: 'RJ', channel: 'Expedia', dates: 'Oct 10 - Oct 12', startDate: '2023-10-10', endDate: '2023-10-12', roomId: 'r4', nights: 2, roomType: 'Executive Suite', guests: 2, status: 'Checked Out', amount: 890.00, paymentStatus: 'Paid' },
    { id: '#RES-7832', guestName: 'Emma Wilson', guestInitials: 'EW', channel: 'Direct', dates: 'Oct 18 - Oct 20', startDate: '2023-10-18', endDate: '2023-10-20', roomId: 'r2', nights: 2, roomType: 'Ocean View', guests: 2, status: 'Confirmed', amount: 550.00, paymentStatus: 'Paid' },
    { id: '#RES-7833', guestName: 'Michael Brown', guestInitials: 'MB', channel: 'Booking.com', dates: 'Oct 13 - Oct 16', startDate: '2023-10-13', endDate: '2023-10-16', roomId: 'r6', nights: 3, roomType: 'Standard Queen', guests: 2, status: 'Cancelled', amount: 330.00, paymentStatus: 'Unpaid' },
  ]);

  filteredReservations = computed(() => {
    const search = this.searchQuery().toLowerCase();
    const status = this.statusFilter();
    const channel = this.channelFilter();

    return this.reservations().filter(res => {
      const matchesSearch = res.guestName.toLowerCase().includes(search) || res.id.toLowerCase().includes(search);
      const matchesStatus = status === 'All' || res.status === status;
      const matchesChannel = channel === 'All' || res.channel === channel;
      return matchesSearch && matchesStatus && matchesChannel;
    });
  });

  updateSearch(event: Event) {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  updateStatusFilter(event: Event) {
    this.statusFilter.set((event.target as HTMLSelectElement).value);
  }

  updateChannelFilter(event: Event) {
    this.channelFilter.set((event.target as HTMLSelectElement).value);
  }

  newReservation() {
    this.toastService.info('Opening new reservation form...');
  }

  toggleViewMode() {
    this.viewMode.set(this.viewMode() === 'list' ? 'calendar' : 'list');
  }

  getReservationsForRoom(roomId: string): Reservation[] {
    return this.reservations().filter(res => res.roomId === roomId);
  }

  getReservationLeftPosition(res: Reservation): string {
    const startIndex = this.calendarDates.findIndex(d => d.fullDate === res.startDate);
    if (startIndex === -1) {
      // If start date is before our calendar view, start at 0
      return '0%';
    }
    return `${(startIndex / this.calendarDates.length) * 100}%`;
  }

  getReservationWidth(res: Reservation): string {
    let startIndex = this.calendarDates.findIndex(d => d.fullDate === res.startDate);
    let endIndex = this.calendarDates.findIndex(d => d.fullDate === res.endDate);
    
    if (startIndex === -1 && endIndex === -1) return '0%';
    
    if (startIndex === -1) startIndex = 0;
    if (endIndex === -1) endIndex = this.calendarDates.length;
    
    const duration = endIndex - startIndex;
    return `${(duration / this.calendarDates.length) * 100}%`;
  }

  onDragStart(event: DragEvent, res: Reservation) {
    if (event.dataTransfer) {
      event.dataTransfer.setData('text/plain', res.id);
      event.dataTransfer.effectAllowed = 'move';
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  }

  onDrop(event: DragEvent, roomId: string, date: string) {
    event.preventDefault();
    if (event.dataTransfer) {
      const resId = event.dataTransfer.getData('text/plain');
      const reservation = this.reservations().find(r => r.id === resId);
      
      if (reservation) {
        // Calculate new end date based on original duration
        const startDateObj = new Date(reservation.startDate);
        const endDateObj = new Date(reservation.endDate);
        const durationMs = endDateObj.getTime() - startDateObj.getTime();
        
        const newStartDateObj = new Date(date);
        const newEndDateObj = new Date(newStartDateObj.getTime() + durationMs);
        
        const newEndDateStr = newEndDateObj.toISOString().split('T')[0];

        this.reservations.update(reservations => 
          reservations.map(r => 
            r.id === resId 
              ? { ...r, roomId, startDate: date, endDate: newEndDateStr, dates: `Updated to ${date}` } 
              : r
          )
        );
        this.toastService.success(`Reservation ${resId} moved to Room ${this.rooms.find(r => r.id === roomId)?.number} on ${date}.`);
      }
    }
  }
}
