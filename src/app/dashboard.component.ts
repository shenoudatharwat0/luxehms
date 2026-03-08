import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ToastService } from './toast.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div class="space-y-6 max-w-7xl mx-auto">
      <!-- Quick Actions -->
      <div class="flex flex-wrap gap-3">
        <button (click)="newReservation()" class="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-950">
          <mat-icon class="mr-2 text-sm" style="font-size: 18px; width: 18px; height: 18px;">add</mat-icon>
          New Reservation
        </button>
        <button (click)="checkIn()" class="flex items-center px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-lg text-sm font-medium transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-950">
          <mat-icon class="mr-2 text-sm" style="font-size: 18px; width: 18px; height: 18px;">login</mat-icon>
          Check-In
        </button>
        <button (click)="checkOut()" class="flex items-center px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-lg text-sm font-medium transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-950">
          <mat-icon class="mr-2 text-sm" style="font-size: 18px; width: 18px; height: 18px;">logout</mat-icon>
          Check-Out
        </button>
      </div>

      <!-- KPIs -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Occupancy -->
        <div class="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-sm transition-colors duration-300">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-sm font-medium text-zinc-500 dark:text-zinc-400">Occupancy Rate</p>
              <h3 class="text-2xl font-bold text-zinc-900 dark:text-white mt-1 tracking-tight">78.5%</h3>
            </div>
            <div class="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg">
              <mat-icon class="text-emerald-600 dark:text-emerald-400">trending_up</mat-icon>
            </div>
          </div>
          <div class="mt-4 flex items-center text-sm">
            <span class="text-emerald-600 dark:text-emerald-400 font-medium flex items-center">
              <mat-icon style="font-size: 16px; width: 16px; height: 16px;">arrow_upward</mat-icon>
              4.2%
            </span>
            <span class="text-zinc-500 dark:text-zinc-400 ml-2">vs last week</span>
          </div>
        </div>

        <!-- ADR -->
        <div class="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-sm transition-colors duration-300">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-sm font-medium text-zinc-500 dark:text-zinc-400">ADR</p>
              <h3 class="text-2xl font-bold text-zinc-900 dark:text-white mt-1 tracking-tight">$145.00</h3>
            </div>
            <div class="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg">
              <mat-icon class="text-indigo-600 dark:text-indigo-400">payments</mat-icon>
            </div>
          </div>
          <div class="mt-4 flex items-center text-sm">
            <span class="text-emerald-600 dark:text-emerald-400 font-medium flex items-center">
              <mat-icon style="font-size: 16px; width: 16px; height: 16px;">arrow_upward</mat-icon>
              1.5%
            </span>
            <span class="text-zinc-500 dark:text-zinc-400 ml-2">vs last week</span>
          </div>
        </div>

        <!-- RevPAR -->
        <div class="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-sm transition-colors duration-300">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-sm font-medium text-zinc-500 dark:text-zinc-400">RevPAR</p>
              <h3 class="text-2xl font-bold text-zinc-900 dark:text-white mt-1 tracking-tight">$113.82</h3>
            </div>
            <div class="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg">
              <mat-icon class="text-indigo-600 dark:text-indigo-400">account_balance_wallet</mat-icon>
            </div>
          </div>
          <div class="mt-4 flex items-center text-sm">
            <span class="text-emerald-600 dark:text-emerald-400 font-medium flex items-center">
              <mat-icon style="font-size: 16px; width: 16px; height: 16px;">arrow_upward</mat-icon>
              5.8%
            </span>
            <span class="text-zinc-500 dark:text-zinc-400 ml-2">vs last week</span>
          </div>
        </div>

        <!-- Arrivals -->
        <div class="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-sm transition-colors duration-300">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-sm font-medium text-zinc-500 dark:text-zinc-400">Today's Arrivals</p>
              <h3 class="text-2xl font-bold text-zinc-900 dark:text-white mt-1 tracking-tight">24</h3>
            </div>
            <div class="p-2 bg-amber-50 dark:bg-amber-500/10 rounded-lg">
              <mat-icon class="text-amber-600 dark:text-amber-400">flight_land</mat-icon>
            </div>
          </div>
          <div class="mt-4 flex items-center text-sm">
            <span class="text-zinc-600 dark:text-zinc-300 font-medium">12 Pending</span>
            <span class="text-zinc-400 dark:text-zinc-500 mx-2">•</span>
            <span class="text-zinc-600 dark:text-zinc-300 font-medium">12 Checked-in</span>
          </div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Room Status -->
        <div class="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm transition-colors duration-300 flex flex-col">
          <div class="p-5 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
            <h3 class="font-semibold text-zinc-900 dark:text-white">Room Status</h3>
            <button class="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
              <mat-icon style="font-size: 20px; width: 20px; height: 20px;">more_vert</mat-icon>
            </button>
          </div>
          <div class="p-5 flex-1 flex flex-col justify-center">
            <!-- Visual representation -->
            <div class="flex h-4 rounded-full overflow-hidden mb-6">
              <div class="bg-emerald-500 w-[65%]"></div>
              <div class="bg-rose-500 w-[25%]"></div>
              <div class="bg-amber-500 w-[10%]"></div>
            </div>
            
            <div class="space-y-4">
              <div class="flex justify-between items-center">
                <div class="flex items-center">
                  <div class="w-3 h-3 rounded-full bg-emerald-500 mr-3"></div>
                  <span class="text-sm font-medium text-zinc-700 dark:text-zinc-300">Clean & Inspected</span>
                </div>
                <span class="text-sm font-bold text-zinc-900 dark:text-white font-mono">65</span>
              </div>
              <div class="flex justify-between items-center">
                <div class="flex items-center">
                  <div class="w-3 h-3 rounded-full bg-rose-500 mr-3"></div>
                  <span class="text-sm font-medium text-zinc-700 dark:text-zinc-300">Dirty / Occupied</span>
                </div>
                <span class="text-sm font-bold text-zinc-900 dark:text-white font-mono">25</span>
              </div>
              <div class="flex justify-between items-center">
                <div class="flex items-center">
                  <div class="w-3 h-3 rounded-full bg-amber-500 mr-3"></div>
                  <span class="text-sm font-medium text-zinc-700 dark:text-zinc-300">Maintenance</span>
                </div>
                <span class="text-sm font-bold text-zinc-900 dark:text-white font-mono">10</span>
              </div>
            </div>
            
            <button class="mt-6 w-full py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
              View Housekeeping
            </button>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm transition-colors duration-300">
          <div class="p-5 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
            <h3 class="font-semibold text-zinc-900 dark:text-white">Front Desk Activity</h3>
            <a href="#" class="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline">View All</a>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="border-b border-zinc-200 dark:border-zinc-800 text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400 bg-zinc-50/50 dark:bg-zinc-900/50">
                  <th class="px-5 py-3 font-medium">Guest</th>
                  <th class="px-5 py-3 font-medium">Room</th>
                  <th class="px-5 py-3 font-medium">Status</th>
                  <th class="px-5 py-3 font-medium">Time</th>
                  <th class="px-5 py-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-zinc-200 dark:divide-zinc-800">
                <tr class="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group">
                  <td class="px-5 py-4">
                    <div class="flex items-center">
                      <div class="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs mr-3">
                        JD
                      </div>
                      <div>
                        <p class="text-sm font-medium text-zinc-900 dark:text-white">John Doe</p>
                        <p class="text-xs text-zinc-500 dark:text-zinc-400">Booking.com</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-5 py-4 text-sm text-zinc-700 dark:text-zinc-300 font-mono">304</td>
                  <td class="px-5 py-4">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                      Checked In
                    </span>
                  </td>
                  <td class="px-5 py-4 text-sm text-zinc-500 dark:text-zinc-400">10:42 AM</td>
                  <td class="px-5 py-4 text-right">
                    <button class="text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors opacity-0 group-hover:opacity-100">
                      <mat-icon style="font-size: 20px; width: 20px; height: 20px;">chevron_right</mat-icon>
                    </button>
                  </td>
                </tr>
                <tr class="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group">
                  <td class="px-5 py-4">
                    <div class="flex items-center">
                      <div class="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xs mr-3">
                        AS
                      </div>
                      <div>
                        <p class="text-sm font-medium text-zinc-900 dark:text-white">Alice Smith</p>
                        <p class="text-xs text-zinc-500 dark:text-zinc-400">Direct Booking</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-5 py-4 text-sm text-zinc-700 dark:text-zinc-300 font-mono">112</td>
                  <td class="px-5 py-4">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20">
                      Pending Arrival
                    </span>
                  </td>
                  <td class="px-5 py-4 text-sm text-zinc-500 dark:text-zinc-400">ETA 2:00 PM</td>
                  <td class="px-5 py-4 text-right">
                    <button class="text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors opacity-0 group-hover:opacity-100">
                      <mat-icon style="font-size: 20px; width: 20px; height: 20px;">chevron_right</mat-icon>
                    </button>
                  </td>
                </tr>
                <tr class="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group">
                  <td class="px-5 py-4">
                    <div class="flex items-center">
                      <div class="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold text-xs mr-3">
                        RJ
                      </div>
                      <div>
                        <p class="text-sm font-medium text-zinc-900 dark:text-white">Robert Johnson</p>
                        <p class="text-xs text-zinc-500 dark:text-zinc-400">Expedia</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-5 py-4 text-sm text-zinc-700 dark:text-zinc-300 font-mono">405</td>
                  <td class="px-5 py-4">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-100 text-zinc-800 dark:bg-zinc-500/10 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-500/20">
                      Checked Out
                    </span>
                  </td>
                  <td class="px-5 py-4 text-sm text-zinc-500 dark:text-zinc-400">09:15 AM</td>
                  <td class="px-5 py-4 text-right">
                    <button class="text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors opacity-0 group-hover:opacity-100">
                      <mat-icon style="font-size: 20px; width: 20px; height: 20px;">chevron_right</mat-icon>
                    </button>
                  </td>
                </tr>
                <tr class="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group">
                  <td class="px-5 py-4">
                    <div class="flex items-center">
                      <div class="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs mr-3">
                        EW
                      </div>
                      <div>
                        <p class="text-sm font-medium text-zinc-900 dark:text-white flex items-center">
                          Emma Wilson 
                          <span class="ml-2 text-[10px] bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 px-1.5 py-0.5 rounded uppercase tracking-wider font-bold">VIP</span>
                        </p>
                        <p class="text-xs text-zinc-500 dark:text-zinc-400">Direct Booking</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-5 py-4 text-sm text-zinc-700 dark:text-zinc-300 font-mono">201</td>
                  <td class="px-5 py-4">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-500/10 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20">
                      Stay Over
                    </span>
                  </td>
                  <td class="px-5 py-4 text-sm text-zinc-500 dark:text-zinc-400">-</td>
                  <td class="px-5 py-4 text-right">
                    <button class="text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors opacity-0 group-hover:opacity-100">
                      <mat-icon style="font-size: 20px; width: 20px; height: 20px;">chevron_right</mat-icon>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent {
  toastService = inject(ToastService);

  newReservation() {
    this.toastService.info('Opening new reservation form...');
  }

  checkIn() {
    this.toastService.info('Opening check-in modal...');
  }

  checkOut() {
    this.toastService.info('Opening check-out modal...');
  }
}
