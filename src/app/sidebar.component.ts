import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { LayoutService } from './layout.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [MatIconModule, RouterModule],
  template: `
    <aside class="w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col transition-colors duration-300 h-full shadow-xl md:shadow-none">
      <div class="h-16 flex items-center justify-between px-6 border-b border-zinc-200 dark:border-zinc-800">
        <div class="flex items-center">
          <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-3 shadow-sm">
            <mat-icon class="text-white" style="font-size: 20px; width: 20px; height: 20px;">hotel</mat-icon>
          </div>
          <span class="text-lg font-bold tracking-tight text-zinc-900 dark:text-white">LuxeHMS</span>
        </div>
        <button (click)="layoutService.closeSidebar()" class="md:hidden text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
          <mat-icon>close</mat-icon>
        </button>
      </div>
      <nav class="flex-1 overflow-y-auto py-6">
        <div class="px-4 mb-2 text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Main Menu</div>
        <ul class="space-y-1 px-3 mb-8">
          <li>
            <a routerLink="/" (click)="layoutService.closeSidebar()" routerLinkActive="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400" [routerLinkActiveOptions]="{exact: true}" class="flex items-center px-3 py-2.5 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-lg group font-medium text-sm transition-colors">
              <mat-icon class="mr-3" style="font-size: 20px; width: 20px; height: 20px;">dashboard</mat-icon>
              Dashboard
            </a>
          </li>
          <li>
            <a routerLink="/reservations" (click)="layoutService.closeSidebar()" routerLinkActive="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400" class="flex items-center px-3 py-2.5 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-lg group font-medium text-sm transition-colors">
              <mat-icon class="mr-3" style="font-size: 20px; width: 20px; height: 20px;">calendar_month</mat-icon>
              Reservations
            </a>
          </li>
          <li>
            <a routerLink="/front-desk" (click)="layoutService.closeSidebar()" routerLinkActive="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400" class="flex items-center px-3 py-2.5 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-lg group font-medium text-sm transition-colors">
              <mat-icon class="mr-3" style="font-size: 20px; width: 20px; height: 20px;">front_hand</mat-icon>
              Front Desk
            </a>
          </li>
        </ul>

        <div class="px-4 mb-2 text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Operations</div>
        <ul class="space-y-1 px-3">
          <li>
            <a routerLink="/housekeeping" (click)="layoutService.closeSidebar()" routerLinkActive="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400" class="flex items-center px-3 py-2.5 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-lg group font-medium text-sm transition-colors">
              <mat-icon class="mr-3" style="font-size: 20px; width: 20px; height: 20px;">cleaning_services</mat-icon>
              Housekeeping
            </a>
          </li>
          <li>
            <a routerLink="/guests" (click)="layoutService.closeSidebar()" routerLinkActive="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400" class="flex items-center px-3 py-2.5 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-lg group font-medium text-sm transition-colors">
              <mat-icon class="mr-3" style="font-size: 20px; width: 20px; height: 20px;">people</mat-icon>
              Guests (CRM)
            </a>
          </li>
          <li>
            <a routerLink="/billing" (click)="layoutService.closeSidebar()" routerLinkActive="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400" class="flex items-center px-3 py-2.5 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-lg group font-medium text-sm transition-colors">
              <mat-icon class="mr-3" style="font-size: 20px; width: 20px; height: 20px;">receipt_long</mat-icon>
              Billing & POS
            </a>
          </li>
          <li>
            <a routerLink="/reports" (click)="layoutService.closeSidebar()" routerLinkActive="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400" class="flex items-center px-3 py-2.5 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-lg group font-medium text-sm transition-colors">
              <mat-icon class="mr-3" style="font-size: 20px; width: 20px; height: 20px;">bar_chart</mat-icon>
              Reports
            </a>
          </li>
        </ul>
      </nav>
      <div class="p-4 border-t border-zinc-200 dark:border-zinc-800">
        <a routerLink="/settings" (click)="layoutService.closeSidebar()" routerLinkActive="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400" class="flex items-center px-3 py-2.5 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-lg group font-medium text-sm transition-colors">
          <mat-icon class="mr-3" style="font-size: 20px; width: 20px; height: 20px;">settings</mat-icon>
          Settings
        </a>
      </div>
    </aside>
  `
})
export class SidebarComponent {
  layoutService = inject(LayoutService);
}
