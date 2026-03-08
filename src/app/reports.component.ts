import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ToastService } from './toast.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [MatIconModule, CommonModule],
  template: `
    <div class="space-y-6 max-w-7xl mx-auto">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 class="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">Reporting & Analytics</h1>
          <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Generate Night Audit, financial reports, and occupancy forecasts.</p>
        </div>
        <div class="flex items-center gap-3">
          <button (click)="changeDateRange()" class="flex items-center px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-lg text-sm font-medium transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-950">
            <mat-icon class="mr-2 text-sm" style="font-size: 18px; width: 18px; height: 18px;">date_range</mat-icon>
            Last 30 Days
          </button>
          <button (click)="runNightAudit()" class="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-950">
            <mat-icon class="mr-2 text-sm" style="font-size: 18px; width: 18px; height: 18px;">nightlight_round</mat-icon>
            Run Night Audit
          </button>
        </div>
      </div>

      <!-- Advanced Filters -->
      <div class="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 shadow-sm">
        <div class="flex flex-wrap gap-4 items-end">
          <div class="flex-1 min-w-[200px]">
            <label for="dateRange" class="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">Date Range</label>
            <select id="dateRange" class="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white">
              <option>Today</option>
              <option>Yesterday</option>
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>This Month</option>
              <option>Custom Range...</option>
            </select>
          </div>
          <div class="flex-1 min-w-[150px]">
            <label for="department" class="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">Department</label>
            <select id="department" class="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white">
              <option>All Departments</option>
              <option>Rooms</option>
              <option>Food & Beverage</option>
              <option>Spa</option>
              <option>Other</option>
            </select>
          </div>
          <div class="flex-1 min-w-[150px]">
            <label for="roomType" class="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">Room Type</label>
            <select id="roomType" class="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white">
              <option>All Types</option>
              <option>Standard</option>
              <option>Deluxe</option>
              <option>Suite</option>
            </select>
          </div>
          <div class="flex-1 min-w-[150px]">
            <label for="guestStatus" class="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">Guest Status</label>
            <select id="guestStatus" class="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white">
              <option>All Statuses</option>
              <option>In-House</option>
              <option>Checked Out</option>
              <option>No Show</option>
            </select>
          </div>
          <div>
            <button (click)="applyFilters()" class="px-4 py-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 rounded-lg text-sm font-medium hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors">
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      <!-- Key Metrics -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
          <p class="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Revenue (MTD)</p>
          <div class="mt-2 flex items-baseline gap-2">
            <h3 class="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">$42,500</h3>
            <span class="text-sm font-medium text-emerald-600 dark:text-emerald-400 flex items-center">
              <mat-icon style="font-size: 16px; width: 16px; height: 16px;">arrow_upward</mat-icon> 12.5%
            </span>
          </div>
        </div>
        <div class="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
          <p class="text-sm font-medium text-zinc-500 dark:text-zinc-400">Average Occupancy (MTD)</p>
          <div class="mt-2 flex items-baseline gap-2">
            <h3 class="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">82.4%</h3>
            <span class="text-sm font-medium text-emerald-600 dark:text-emerald-400 flex items-center">
              <mat-icon style="font-size: 16px; width: 16px; height: 16px;">arrow_upward</mat-icon> 4.1%
            </span>
          </div>
        </div>
        <div class="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
          <p class="text-sm font-medium text-zinc-500 dark:text-zinc-400">RevPAR (MTD)</p>
          <div class="mt-2 flex items-baseline gap-2">
            <h3 class="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">$118.50</h3>
            <span class="text-sm font-medium text-rose-600 dark:text-rose-400 flex items-center">
              <mat-icon style="font-size: 16px; width: 16px; height: 16px;">arrow_downward</mat-icon> 1.2%
            </span>
          </div>
        </div>
      </div>

      <!-- Reports List & Chart Placeholder -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Standard Reports -->
        <div class="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col">
          <div class="p-5 border-b border-zinc-200 dark:border-zinc-800">
            <h3 class="font-semibold text-zinc-900 dark:text-white">Standard Reports</h3>
          </div>
          <div class="flex-1 p-2">
            <ul class="space-y-1">
              <li>
                <button (click)="generateReport('Night Audit Report')" class="w-full flex items-center justify-between p-3 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors text-left group">
                  <div class="flex items-center">
                    <div class="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mr-3">
                      <mat-icon style="font-size: 18px; width: 18px; height: 18px;">nightlight_round</mat-icon>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-zinc-900 dark:text-white">Night Audit Report</p>
                      <p class="text-xs text-zinc-500 dark:text-zinc-400">Daily financial reconciliation</p>
                    </div>
                  </div>
                  <mat-icon class="text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity" style="font-size: 20px; width: 20px; height: 20px;">chevron_right</mat-icon>
                </button>
              </li>
              <li>
                <button (click)="generateReport('Revenue by Department')" class="w-full flex items-center justify-between p-3 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors text-left group">
                  <div class="flex items-center">
                    <div class="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mr-3">
                      <mat-icon style="font-size: 18px; width: 18px; height: 18px;">payments</mat-icon>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-zinc-900 dark:text-white">Revenue by Department</p>
                      <p class="text-xs text-zinc-500 dark:text-zinc-400">Room, F&B, Spa breakdown</p>
                    </div>
                  </div>
                  <mat-icon class="text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity" style="font-size: 20px; width: 20px; height: 20px;">chevron_right</mat-icon>
                </button>
              </li>
              <li>
                <button (click)="generateReport('Occupancy Forecast')" class="w-full flex items-center justify-between p-3 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors text-left group">
                  <div class="flex items-center">
                    <div class="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mr-3">
                      <mat-icon style="font-size: 18px; width: 18px; height: 18px;">hotel</mat-icon>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-zinc-900 dark:text-white">Occupancy Forecast</p>
                      <p class="text-xs text-zinc-500 dark:text-zinc-400">30-day forward looking</p>
                    </div>
                  </div>
                  <mat-icon class="text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity" style="font-size: 20px; width: 20px; height: 20px;">chevron_right</mat-icon>
                </button>
              </li>
              <li>
                <button (click)="generateReport('Cancellation Report')" class="w-full flex items-center justify-between p-3 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors text-left group">
                  <div class="flex items-center">
                    <div class="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center mr-3">
                      <mat-icon style="font-size: 18px; width: 18px; height: 18px;">cancel</mat-icon>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-zinc-900 dark:text-white">Cancellation Report</p>
                      <p class="text-xs text-zinc-500 dark:text-zinc-400">Lost revenue analysis</p>
                    </div>
                  </div>
                  <mat-icon class="text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity" style="font-size: 20px; width: 20px; height: 20px;">chevron_right</mat-icon>
                </button>
              </li>
            </ul>
          </div>
        </div>

        <!-- Chart Area (Simulated) -->
        <div class="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col">
          <div class="p-5 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
            <h3 class="font-semibold text-zinc-900 dark:text-white">Revenue Trend (Last 30 Days)</h3>
            <button class="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
              <mat-icon style="font-size: 20px; width: 20px; height: 20px;">more_vert</mat-icon>
            </button>
          </div>
          <div class="p-6 flex-1 flex flex-col items-center justify-center min-h-[300px] border-b border-zinc-100 dark:border-zinc-800/50">
            <!-- Simulated Chart using CSS grid/flex -->
            <div class="w-full h-48 flex items-end gap-2 px-4">
              <div class="flex-1 bg-indigo-100 dark:bg-indigo-900/40 rounded-t-sm h-[40%] relative group">
                <div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">$1,200</div>
              </div>
              <div class="flex-1 bg-indigo-200 dark:bg-indigo-800/60 rounded-t-sm h-[60%] relative group">
                <div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">$1,800</div>
              </div>
              <div class="flex-1 bg-indigo-300 dark:bg-indigo-700/80 rounded-t-sm h-[50%] relative group">
                <div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">$1,500</div>
              </div>
              <div class="flex-1 bg-indigo-400 dark:bg-indigo-600 rounded-t-sm h-[80%] relative group">
                <div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">$2,400</div>
              </div>
              <div class="flex-1 bg-indigo-500 dark:bg-indigo-500 rounded-t-sm h-[90%] relative group">
                <div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">$2,700</div>
              </div>
              <div class="flex-1 bg-indigo-600 dark:bg-indigo-400 rounded-t-sm h-[100%] relative group">
                <div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">$3,000</div>
              </div>
              <div class="flex-1 bg-indigo-500 dark:bg-indigo-500 rounded-t-sm h-[85%] relative group">
                <div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">$2,550</div>
              </div>
            </div>
            <div class="w-full flex justify-between px-4 mt-2 text-xs text-zinc-500 dark:text-zinc-400">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </div>
          <div class="p-4 bg-zinc-50/50 dark:bg-zinc-900/50 flex justify-end gap-3 rounded-b-xl">
            <button (click)="exportCsv()" class="px-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors flex items-center">
              <mat-icon style="font-size: 16px; width: 16px; height: 16px;" class="mr-1.5">file_download</mat-icon> Export CSV
            </button>
            <button (click)="exportPdf()" class="px-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors flex items-center">
              <mat-icon style="font-size: 16px; width: 16px; height: 16px;" class="mr-1.5">picture_as_pdf</mat-icon> Export PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ReportsComponent {
  toastService = inject(ToastService);

  changeDateRange() {
    this.toastService.info('Opening date range picker...');
  }

  runNightAudit() {
    this.toastService.success('Night Audit started successfully.');
  }

  generateReport(reportName: string) {
    this.toastService.info(`Generating ${reportName}...`);
  }

  exportCsv() {
    this.toastService.success('CSV export started.');
  }

  exportPdf() {
    this.toastService.success('PDF export started.');
  }

  applyFilters() {
    this.toastService.success('Filters applied to all reports.');
  }
}
