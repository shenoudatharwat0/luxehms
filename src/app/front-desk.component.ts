import { Component, signal, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ToastService } from './toast.service';

interface ArrivalDeparture {
  id: string;
  guestName: string;
  roomType: string;
  roomNumber?: string;
  time: string;
  status: 'Pending' | 'Checked In' | 'Checked Out';
  type: 'Arrival' | 'Departure';
}

@Component({
  selector: 'app-front-desk',
  standalone: true,
  imports: [MatIconModule, CommonModule],
  template: `
    <div class="max-w-7xl mx-auto space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">Front Desk</h1>
          <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Manage today's arrivals and departures.</p>
        </div>
        <div class="flex items-center gap-3">
          <div class="relative">
            <mat-icon class="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 !w-5 !h-5 !text-[20px]">search</mat-icon>
            <input type="text" placeholder="Search guests..." class="pl-10 pr-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white w-full sm:w-64 transition-shadow">
          </div>
          <button class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm flex items-center gap-2 whitespace-nowrap">
            <mat-icon class="!w-5 !h-5 !text-[20px]">add</mat-icon>
            Walk-in
          </button>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div class="flex items-center justify-between">
            <p class="text-sm font-medium text-zinc-500 dark:text-zinc-400">Pending Arrivals</p>
            <div class="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
              <mat-icon class="text-blue-600 dark:text-blue-400 !w-5 !h-5 !text-[20px]">flight_land</mat-icon>
            </div>
          </div>
          <p class="text-2xl font-bold text-zinc-900 dark:text-white mt-2">12</p>
        </div>
        <div class="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div class="flex items-center justify-between">
            <p class="text-sm font-medium text-zinc-500 dark:text-zinc-400">Pending Departures</p>
            <div class="w-8 h-8 rounded-full bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center">
              <mat-icon class="text-amber-600 dark:text-amber-400 !w-5 !h-5 !text-[20px]">flight_takeoff</mat-icon>
            </div>
          </div>
          <p class="text-2xl font-bold text-zinc-900 dark:text-white mt-2">5</p>
        </div>
        <div class="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div class="flex items-center justify-between">
            <p class="text-sm font-medium text-zinc-500 dark:text-zinc-400">Checked In Today</p>
            <div class="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
              <mat-icon class="text-emerald-600 dark:text-emerald-400 !w-5 !h-5 !text-[20px]">how_to_reg</mat-icon>
            </div>
          </div>
          <p class="text-2xl font-bold text-zinc-900 dark:text-white mt-2">8</p>
        </div>
        <div class="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div class="flex items-center justify-between">
            <p class="text-sm font-medium text-zinc-500 dark:text-zinc-400">Checked Out Today</p>
            <div class="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
              <mat-icon class="text-zinc-600 dark:text-zinc-400 !w-5 !h-5 !text-[20px]">logout</mat-icon>
            </div>
          </div>
          <p class="text-2xl font-bold text-zinc-900 dark:text-white mt-2">14</p>
        </div>
      </div>

      <!-- Tabs -->
      <div class="flex border-b border-zinc-200 dark:border-zinc-800">
        <button 
          (click)="activeTab.set('arrivals')"
          class="px-4 py-3 text-sm font-medium border-b-2 transition-colors"
          [class.border-indigo-600]="activeTab() === 'arrivals'"
          [class.text-indigo-600]="activeTab() === 'arrivals'"
          [class.dark:text-indigo-400]="activeTab() === 'arrivals'"
          [class.border-transparent]="activeTab() !== 'arrivals'"
          [class.text-zinc-500]="activeTab() !== 'arrivals'"
          [class.hover:text-zinc-700]="activeTab() !== 'arrivals'"
          [class.dark:hover:text-zinc-300]="activeTab() !== 'arrivals'">
          Arrivals
        </button>
        <button 
          (click)="activeTab.set('departures')"
          class="px-4 py-3 text-sm font-medium border-b-2 transition-colors"
          [class.border-indigo-600]="activeTab() === 'departures'"
          [class.text-indigo-600]="activeTab() === 'departures'"
          [class.dark:text-indigo-400]="activeTab() === 'departures'"
          [class.border-transparent]="activeTab() !== 'departures'"
          [class.text-zinc-500]="activeTab() !== 'departures'"
          [class.hover:text-zinc-700]="activeTab() !== 'departures'"
          [class.dark:hover:text-zinc-300]="activeTab() !== 'departures'">
          Departures
        </button>
      </div>

      <!-- List -->
      <div class="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800">
                <th class="px-6 py-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Guest</th>
                <th class="px-6 py-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Room</th>
                <th class="px-6 py-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">ETA / ETD</th>
                <th class="px-6 py-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-zinc-200 dark:divide-zinc-800">
              @for (item of filteredItems(); track item.id) {
                <tr class="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td class="px-6 py-4">
                    <div class="font-medium text-zinc-900 dark:text-white">{{ item.guestName }}</div>
                    <div class="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">ID: {{ item.id }}</div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="text-sm text-zinc-900 dark:text-white">{{ item.roomType }}</div>
                    <div class="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{{ item.roomNumber || 'Unassigned' }}</div>
                  </td>
                  <td class="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-300">
                    {{ item.time }}
                  </td>
                  <td class="px-6 py-4">
                    <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
                      [class.bg-amber-100]="item.status === 'Pending'"
                      [class.text-amber-800]="item.status === 'Pending'"
                      [class.dark:bg-amber-500/20]="item.status === 'Pending'"
                      [class.dark:text-amber-400]="item.status === 'Pending'"
                      [class.bg-emerald-100]="item.status === 'Checked In'"
                      [class.text-emerald-800]="item.status === 'Checked In'"
                      [class.dark:bg-emerald-500/20]="item.status === 'Checked In'"
                      [class.dark:text-emerald-400]="item.status === 'Checked In'"
                      [class.bg-zinc-100]="item.status === 'Checked Out'"
                      [class.text-zinc-800]="item.status === 'Checked Out'"
                      [class.dark:bg-zinc-800]="item.status === 'Checked Out'"
                      [class.dark:text-zinc-300]="item.status === 'Checked Out'">
                      {{ item.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-right">
                    @if (item.type === 'Arrival' && item.status === 'Pending') {
                      <button (click)="checkIn(item)" class="px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 dark:hover:bg-indigo-500/20 text-sm font-medium rounded-md transition-colors">
                        Check In
                      </button>
                    } @else if (item.type === 'Departure' && item.status === 'Pending') {
                      <button (click)="checkOut(item)" class="px-3 py-1.5 bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 text-sm font-medium rounded-md transition-colors">
                        Check Out
                      </button>
                    } @else {
                      <button class="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800">
                        <mat-icon class="!w-5 !h-5 !text-[20px]">more_vert</mat-icon>
                      </button>
                    }
                  </td>
                </tr>
              }
              @if (filteredItems().length === 0) {
                <tr>
                  <td colspan="5" class="px-6 py-8 text-center text-zinc-500 dark:text-zinc-400 text-sm">
                    No {{ activeTab() }} found for today.
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class FrontDeskComponent {
  toastService = inject(ToastService);
  activeTab = signal<'arrivals' | 'departures'>('arrivals');

  items = signal<ArrivalDeparture[]>([
    { id: 'RES-101', guestName: 'Alice Smith', roomType: 'Deluxe Suite', roomNumber: '401', time: '14:00', status: 'Pending', type: 'Arrival' },
    { id: 'RES-102', guestName: 'Bob Johnson', roomType: 'Standard Room', roomNumber: '215', time: '15:30', status: 'Pending', type: 'Arrival' },
    { id: 'RES-103', guestName: 'Charlie Brown', roomType: 'Ocean View', roomNumber: '305', time: '12:00', status: 'Checked In', type: 'Arrival' },
    { id: 'RES-098', guestName: 'Diana Prince', roomType: 'Standard Room', roomNumber: '210', time: '11:00', status: 'Pending', type: 'Departure' },
    { id: 'RES-099', guestName: 'Evan Wright', roomType: 'Deluxe Suite', roomNumber: '405', time: '10:30', status: 'Checked Out', type: 'Departure' },
  ]);

  get filteredItems() {
    return () => this.items().filter(item => 
      this.activeTab() === 'arrivals' ? item.type === 'Arrival' : item.type === 'Departure'
    );
  }

  checkIn(item: ArrivalDeparture) {
    this.items.update(items => items.map(i => i.id === item.id ? { ...i, status: 'Checked In' } : i));
    this.toastService.success(`Successfully checked in ${item.guestName} to room ${item.roomNumber}`);
  }

  checkOut(item: ArrivalDeparture) {
    this.items.update(items => items.map(i => i.id === item.id ? { ...i, status: 'Checked Out' } : i));
    this.toastService.success(`Successfully checked out ${item.guestName}`);
  }
}
