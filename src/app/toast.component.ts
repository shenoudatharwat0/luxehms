import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ToastService, ToastType } from './toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      @for (toast of toastService.toasts(); track toast.id) {
        <div 
          class="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border text-sm font-medium min-w-[300px] max-w-md transform transition-all duration-300 translate-y-0 opacity-100"
          [class]="getToastClasses(toast.type)">
          <mat-icon class="!w-5 !h-5 !text-[20px]">{{ getIcon(toast.type) }}</mat-icon>
          <span class="flex-1">{{ toast.message }}</span>
          <button (click)="toastService.remove(toast.id)" class="text-current opacity-70 hover:opacity-100 focus:outline-none">
            <mat-icon class="!w-4 !h-4 !text-[16px]">close</mat-icon>
          </button>
        </div>
      }
    </div>
  `
})
export class ToastComponent {
  toastService = inject(ToastService);

  getToastClasses(type: ToastType): string {
    switch (type) {
      case 'success':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20';
      case 'error':
        return 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20';
      case 'warning':
        return 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20';
      case 'info':
      default:
        return 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20';
    }
  }

  getIcon(type: ToastType): string {
    switch (type) {
      case 'success': return 'check_circle';
      case 'error': return 'error';
      case 'warning': return 'warning';
      case 'info': default: return 'info';
    }
  }
}
