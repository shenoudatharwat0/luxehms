import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts = signal<Toast[]>([]);

  show(message: string, type: ToastType = 'info') {
    const id = Math.random().toString(36).substring(2, 9);
    this.toasts.update(t => [...t, { id, message, type }]);
    
    setTimeout(() => {
      this.remove(id);
    }, 3000);
  }

  success(message: string) {
    this.show(message, 'success');
  }

  error(message: string) {
    this.show(message, 'error');
  }

  info(message: string) {
    this.show(message, 'info');
  }

  remove(id: string) {
    this.toasts.update(t => t.filter(toast => toast.id !== id));
  }
}
