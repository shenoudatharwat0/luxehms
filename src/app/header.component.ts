import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ThemeService } from './theme.service';
import { LayoutService } from './layout.service';
import { ToastService } from './toast.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <header class="flex items-center justify-between px-4 md:px-6 py-4 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 transition-colors duration-300">
      <div class="flex items-center">
        <button (click)="layoutService.toggleSidebar()" class="md:hidden mr-3 p-2 -ml-2 rounded-md text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <mat-icon>menu</mat-icon>
        </button>
        <h2 class="text-xl font-semibold text-zinc-800 dark:text-zinc-100 tracking-tight hidden sm:block">Dashboard Overview</h2>
      </div>
      <div class="flex items-center space-x-2 md:space-x-4">
        <button (click)="themeService.toggle()" class="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-600 dark:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <mat-icon>{{ themeService.isDark() ? 'light_mode' : 'dark_mode' }}</mat-icon>
        </button>
        <button (click)="showNotifications()" class="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-600 dark:text-zinc-400 relative focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <mat-icon>notifications</mat-icon>
          <span class="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 border-2 border-white dark:border-zinc-900 rounded-full"></span>
        </button>
        <div class="flex items-center space-x-3 pl-2 md:pl-4 border-l border-zinc-200 dark:border-zinc-800">
          <img src="https://picsum.photos/seed/avatar/32/32" alt="User Avatar" class="w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-700" referrerpolicy="no-referrer" />
          <div class="hidden md:block text-sm">
            <p class="font-medium text-zinc-800 dark:text-zinc-100 leading-none">Admin User</p>
            <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-1">System Administrator</p>
          </div>
        </div>
      </div>
    </header>
  `
})
export class HeaderComponent {
  themeService = inject(ThemeService);
  layoutService = inject(LayoutService);
  toastService = inject(ToastService);

  showNotifications() {
    this.toastService.info('You have 3 new notifications.');
  }
}
