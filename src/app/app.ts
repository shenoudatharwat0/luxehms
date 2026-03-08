import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {SidebarComponent} from './sidebar.component';
import {HeaderComponent} from './header.component';
import {LayoutService} from './layout.service';
import {ToastComponent} from './toast.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  imports: [RouterOutlet, SidebarComponent, HeaderComponent, ToastComponent],
  template: `
    <div class="flex h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans transition-colors duration-300 overflow-hidden relative">
      
      <!-- Mobile Sidebar Overlay -->
      @if (layoutService.isSidebarOpen()) {
        <div 
          class="fixed inset-0 bg-zinc-900/50 dark:bg-black/50 z-20 md:hidden backdrop-blur-sm transition-opacity"
          (click)="layoutService.closeSidebar()"
          (keydown.enter)="layoutService.closeSidebar()"
          tabindex="0">
        </div>
      }

      <!-- Sidebar -->
      <div 
        class="fixed inset-y-0 left-0 z-30 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0"
        [class.-translate-x-full]="!layoutService.isSidebarOpen()">
        <app-sidebar />
      </div>

      <!-- Main Content -->
      <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
        <app-header />
        <main class="flex-1 overflow-x-hidden overflow-y-auto bg-zinc-50 dark:bg-zinc-950 p-4 md:p-6">
          <router-outlet />
        </main>
      </div>
      
      <app-toast />
    </div>
  `,
})
export class App {
  layoutService = inject(LayoutService);
}
