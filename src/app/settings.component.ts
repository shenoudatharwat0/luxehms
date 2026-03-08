import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ThemeService } from './theme.service';
import { ToastService } from './toast.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [MatIconModule, CommonModule],
  template: `
    <div class="space-y-6 max-w-5xl mx-auto">
      <!-- Header -->
      <div>
        <h1 class="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">Settings</h1>
        <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Manage your hotel preferences, integrations, and user accounts.</p>
      </div>

      <div class="flex flex-col md:flex-row gap-8">
        <!-- Settings Sidebar -->
        <div class="w-full md:w-64 flex-shrink-0">
          <nav class="space-y-1">
            <a href="#" class="flex items-center px-3 py-2.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg font-medium text-sm transition-colors">
              <mat-icon class="mr-3" style="font-size: 20px; width: 20px; height: 20px;">business</mat-icon>
              Property Details
            </a>
            <a href="#" class="flex items-center px-3 py-2.5 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-lg font-medium text-sm transition-colors">
              <mat-icon class="mr-3" style="font-size: 20px; width: 20px; height: 20px;">manage_accounts</mat-icon>
              User Management
            </a>
            <a href="#" class="flex items-center px-3 py-2.5 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-lg font-medium text-sm transition-colors">
              <mat-icon class="mr-3" style="font-size: 20px; width: 20px; height: 20px;">sync_alt</mat-icon>
              Channel Manager
            </a>
            <a href="#" class="flex items-center px-3 py-2.5 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-lg font-medium text-sm transition-colors">
              <mat-icon class="mr-3" style="font-size: 20px; width: 20px; height: 20px;">credit_card</mat-icon>
              Payment Gateways
            </a>
            <a href="#" class="flex items-center px-3 py-2.5 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-lg font-medium text-sm transition-colors">
              <mat-icon class="mr-3" style="font-size: 20px; width: 20px; height: 20px;">palette</mat-icon>
              Appearance
            </a>
          </nav>
        </div>

        <!-- Settings Content -->
        <div class="flex-1 space-y-6">
          
          <!-- Property Details Form -->
          <div class="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <div class="p-6 border-b border-zinc-200 dark:border-zinc-800">
              <h2 class="text-lg font-semibold text-zinc-900 dark:text-white">Property Details</h2>
              <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Update your hotel's basic information and contact details.</p>
            </div>
            <div class="p-6 space-y-6">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label for="hotelName" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Hotel Name</label>
                  <input id="hotelName" type="text" value="Luxe Hotel Downtown" class="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow" />
                </div>
                <div class="space-y-2">
                  <label for="propertyType" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Property Type</label>
                  <select id="propertyType" class="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow appearance-none">
                    <option>Boutique Hotel</option>
                    <option>Resort</option>
                    <option>Business Hotel</option>
                    <option>Motel</option>
                  </select>
                </div>
                <div class="space-y-2">
                  <label for="emailAddress" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Email Address</label>
                  <input id="emailAddress" type="email" value="contact@luxehotel.com" class="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow" />
                </div>
                <div class="space-y-2">
                  <label for="phoneNumber" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Phone Number</label>
                  <input id="phoneNumber" type="tel" value="+1 (555) 123-4567" class="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow" />
                </div>
                <div class="sm:col-span-2 space-y-2">
                  <label for="address" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Address</label>
                  <input id="address" type="text" value="123 Luxury Avenue, Suite 100, Metropolis, NY 10001" class="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow" />
                </div>
              </div>
            </div>
            <div class="px-6 py-4 bg-zinc-50/50 dark:bg-zinc-900/50 border-t border-zinc-200 dark:border-zinc-800 flex justify-end">
              <button (click)="saveSettings()" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-950">
                Save Changes
              </button>
            </div>
          </div>

          <!-- Integrations Preview -->
          <div class="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <div class="p-6 border-b border-zinc-200 dark:border-zinc-800">
              <h2 class="text-lg font-semibold text-zinc-900 dark:text-white">Active Integrations</h2>
              <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Manage connections to third-party services.</p>
            </div>
            <div class="p-6 space-y-4">
              <div class="flex items-center justify-between p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg">
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <mat-icon>payment</mat-icon>
                  </div>
                  <div>
                    <h4 class="text-sm font-medium text-zinc-900 dark:text-white">Stripe Payment Gateway</h4>
                    <p class="text-xs text-zinc-500 dark:text-zinc-400">Connected on Oct 1, 2023</p>
                  </div>
                </div>
                <button class="px-3 py-1.5 border border-zinc-200 dark:border-zinc-700 rounded-md text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                  Configure
                </button>
              </div>
              
              <div class="flex items-center justify-between p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg">
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <mat-icon>sync</mat-icon>
                  </div>
                  <div>
                    <h4 class="text-sm font-medium text-zinc-900 dark:text-white">SiteMinder Channel Manager</h4>
                    <p class="text-xs text-zinc-500 dark:text-zinc-400">Syncing 3 OTAs (Booking.com, Expedia, Agoda)</p>
                  </div>
                </div>
                <button class="px-3 py-1.5 border border-zinc-200 dark:border-zinc-700 rounded-md text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                  Configure
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  `
})
export class SettingsComponent {
  toastService = inject(ToastService);
  themeService = inject(ThemeService);

  saveSettings() {
    this.toastService.success('Property details saved successfully.');
  }
}
