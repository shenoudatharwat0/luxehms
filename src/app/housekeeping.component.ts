import { Component, signal, computed, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ToastService } from './toast.service';

interface Task {
  id: string;
  description: string;
  assignee: string;
  status: 'Pending' | 'In Progress' | 'Completed';
}

interface Room {
  id: string;
  number: string;
  type: string;
  status: 'Clean' | 'Dirty' | 'Inspected' | 'Maintenance';
  occupancy: 'Vacant' | 'Occupied' | 'Blocked';
  notes: string;
  floor: string;
  amenities: string[];
  recentPreferences: string[];
  maintenanceHistory: string[];
  tasks: Task[];
}

@Component({
  selector: 'app-housekeeping',
  standalone: true,
  imports: [MatIconModule, CommonModule],
  template: `
    <div class="space-y-6 max-w-7xl mx-auto">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 class="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">Housekeeping</h1>
          <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Manage room statuses, cleaning schedules, and maintenance.</p>
        </div>
        <div class="flex items-center gap-3">
          <button class="flex items-center px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-lg text-sm font-medium transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-950">
            <mat-icon class="mr-2 text-sm" style="font-size: 18px; width: 18px; height: 18px;">build</mat-icon>
            Log Maintenance
          </button>
          <button class="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-950">
            <mat-icon class="mr-2 text-sm" style="font-size: 18px; width: 18px; height: 18px;">assignment</mat-icon>
            Assign Tasks
          </button>
        </div>
      </div>

      <!-- Filters -->
      <div class="flex flex-wrap gap-3 items-center">
        <select class="px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none pr-10 relative shadow-sm">
          <option>All Floors</option>
          <option>Floor 1</option>
          <option>Floor 2</option>
          <option>Floor 3</option>
        </select>
        <div class="flex bg-zinc-100 dark:bg-zinc-800/50 p-1 rounded-lg">
          <button class="px-4 py-1.5 bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white text-sm font-medium rounded-md shadow-sm">All</button>
          <button class="px-4 py-1.5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white text-sm font-medium rounded-md transition-colors">Dirty</button>
          <button class="px-4 py-1.5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white text-sm font-medium rounded-md transition-colors">Clean</button>
          <button class="px-4 py-1.5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white text-sm font-medium rounded-md transition-colors">Maintenance</button>
        </div>
      </div>

      <!-- Main Content -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Rooms Grid -->
        <div class="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 content-start">
          @for (room of filteredRooms(); track room.id) {
            <div (click)="selectRoom(room)" (keydown.enter)="selectRoom(room)" tabindex="0" class="bg-white dark:bg-zinc-900 rounded-xl border shadow-sm overflow-hidden flex flex-col relative cursor-pointer transition-all hover:shadow-md"
              [class.ring-2]="selectedRoom()?.id === room.id"
              [class.ring-indigo-500]="selectedRoom()?.id === room.id"
              [class.border-rose-200]="room.status === 'Dirty' && selectedRoom()?.id !== room.id"
              [class.dark:border-rose-900]="room.status === 'Dirty' && selectedRoom()?.id !== room.id"
              [class.border-emerald-200]="room.status === 'Clean' && selectedRoom()?.id !== room.id"
              [class.dark:border-emerald-900]="room.status === 'Clean' && selectedRoom()?.id !== room.id"
              [class.border-indigo-200]="room.status === 'Inspected' && selectedRoom()?.id !== room.id"
              [class.dark:border-indigo-900]="room.status === 'Inspected' && selectedRoom()?.id !== room.id"
              [class.border-amber-200]="room.status === 'Maintenance' && selectedRoom()?.id !== room.id"
              [class.dark:border-amber-900]="room.status === 'Maintenance' && selectedRoom()?.id !== room.id">
              
              <div class="absolute top-0 left-0 w-1 h-full"
                [class.bg-rose-500]="room.status === 'Dirty'"
                [class.bg-emerald-500]="room.status === 'Clean'"
                [class.bg-indigo-500]="room.status === 'Inspected'"
                [class.bg-amber-500]="room.status === 'Maintenance'"></div>
              
              <div class="p-4 flex-1">
                <div class="flex justify-between items-start mb-2">
                  <h3 class="text-xl font-bold text-zinc-900 dark:text-white font-mono">{{ room.number }}</h3>
                  <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                    [class.bg-rose-100]="room.status === 'Dirty'"
                    [class.text-rose-800]="room.status === 'Dirty'"
                    [class.dark:bg-rose-500/10]="room.status === 'Dirty'"
                    [class.dark:text-rose-400]="room.status === 'Dirty'"
                    [class.bg-emerald-100]="room.status === 'Clean'"
                    [class.text-emerald-800]="room.status === 'Clean'"
                    [class.dark:bg-emerald-500/10]="room.status === 'Clean'"
                    [class.dark:text-emerald-400]="room.status === 'Clean'"
                    [class.bg-indigo-100]="room.status === 'Inspected'"
                    [class.text-indigo-800]="room.status === 'Inspected'"
                    [class.dark:bg-indigo-500/10]="room.status === 'Inspected'"
                    [class.dark:text-indigo-400]="room.status === 'Inspected'"
                    [class.bg-amber-100]="room.status === 'Maintenance'"
                    [class.text-amber-800]="room.status === 'Maintenance'"
                    [class.dark:bg-amber-500/10]="room.status === 'Maintenance'"
                    [class.dark:text-amber-400]="room.status === 'Maintenance'">
                    {{ room.status }}
                  </span>
                </div>
                <p class="text-sm text-zinc-500 dark:text-zinc-400 mb-4">{{ room.type }} • <span [class.text-indigo-600]="room.occupancy === 'Occupied'" [class.dark:text-indigo-400]="room.occupancy === 'Occupied'" [class.font-medium]="room.occupancy === 'Occupied'">{{ room.occupancy }}</span></p>
                <div class="flex items-center text-xs"
                  [class.text-zinc-500]="room.status !== 'Maintenance'"
                  [class.dark:text-zinc-400]="room.status !== 'Maintenance'"
                  [class.text-amber-600]="room.status === 'Maintenance'"
                  [class.dark:text-amber-400]="room.status === 'Maintenance'"
                  [class.font-medium]="room.status === 'Maintenance'">
                  <mat-icon style="font-size: 14px; width: 14px; height: 14px;" class="mr-1">
                    {{ room.status === 'Dirty' ? 'schedule' : room.status === 'Clean' ? 'person' : room.status === 'Inspected' ? 'check_circle' : 'build' }}
                  </mat-icon>
                  {{ room.notes }}
                </div>
              </div>
              <div class="bg-zinc-50 dark:bg-zinc-800/30 px-4 py-3 border-t border-zinc-100 dark:border-zinc-800 flex justify-between gap-2">
                @if (room.status === 'Dirty') {
                  <button (click)="markClean(room, $event)" class="flex-1 py-1.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors">
                    Mark Clean
                  </button>
                } @else if (room.status === 'Clean') {
                  <button (click)="inspect(room, $event)" class="flex-1 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded text-xs font-medium text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors">
                    Inspect
                  </button>
                } @else if (room.status === 'Inspected') {
                  <button class="flex-1 py-1.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors opacity-50 cursor-not-allowed" disabled>
                    Mark Dirty
                  </button>
                } @else if (room.status === 'Maintenance') {
                  <button (click)="resolveMaintenance(room, $event)" class="flex-1 py-1.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors">
                    Resolve Ticket
                  </button>
                }
              </div>
            </div>
          }
          @if (filteredRooms().length === 0) {
            <div class="col-span-full py-8 text-center text-zinc-500 dark:text-zinc-400 text-sm">
              No rooms found matching your criteria.
            </div>
          }
        </div>

        <!-- Room Details Panel -->
        <div class="lg:col-span-1">
          @if (selectedRoom(); as room) {
            <div class="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col sticky top-6">
              <div class="p-5 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-zinc-50 dark:bg-zinc-800/50 rounded-t-xl">
                <h3 class="font-bold text-lg text-zinc-900 dark:text-white">Room {{ room.number }} Details</h3>
                <button (click)="closeRoomDetails()" class="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
                  <mat-icon style="font-size: 20px; width: 20px; height: 20px;">close</mat-icon>
                </button>
              </div>
              <div class="p-5 space-y-6 overflow-y-auto max-h-[calc(100vh-200px)]">
                
                <!-- Amenities -->
                <div>
                  <h4 class="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Amenities</h4>
                  <div class="flex flex-wrap gap-2">
                    @for (amenity of room.amenities; track amenity) {
                      <span class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">{{ amenity }}</span>
                    }
                  </div>
                </div>

                <!-- Guest Preferences -->
                <div>
                  <h4 class="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Recent Guest Preferences</h4>
                  @if (room.recentPreferences.length > 0) {
                    <ul class="list-disc list-inside text-sm text-zinc-700 dark:text-zinc-300 space-y-1">
                      @for (pref of room.recentPreferences; track pref) {
                        <li>{{ pref }}</li>
                      }
                    </ul>
                  } @else {
                    <p class="text-sm text-zinc-500 dark:text-zinc-400 italic">No recent preferences recorded.</p>
                  }
                </div>

                <!-- Maintenance History -->
                <div>
                  <h4 class="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Maintenance History</h4>
                  @if (room.maintenanceHistory.length > 0) {
                    <ul class="space-y-2">
                      @for (history of room.maintenanceHistory; track history) {
                        <li class="text-sm text-zinc-700 dark:text-zinc-300 flex items-start">
                          <mat-icon style="font-size: 16px; width: 16px; height: 16px;" class="mr-2 text-zinc-400 mt-0.5">history</mat-icon>
                          <span>{{ history }}</span>
                        </li>
                      }
                    </ul>
                  } @else {
                    <p class="text-sm text-zinc-500 dark:text-zinc-400 italic">No recent maintenance history.</p>
                  }
                </div>

                <!-- Task Assignment -->
                <div class="pt-4 border-t border-zinc-200 dark:border-zinc-800">
                  <div class="flex justify-between items-center mb-3">
                    <h4 class="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Assigned Tasks</h4>
                    <button (click)="addTask(room)" class="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium">Add Task</button>
                  </div>
                  @if (room.tasks.length > 0) {
                    <div class="space-y-2">
                      @for (task of room.tasks; track task.id) {
                        <div class="bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-lg border border-zinc-200 dark:border-zinc-700">
                          <div class="flex justify-between items-start mb-1">
                            <p class="text-sm font-medium text-zinc-900 dark:text-white">{{ task.description }}</p>
                            <span class="text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wider font-bold"
                              [class.bg-amber-100]="task.status === 'Pending'"
                              [class.text-amber-800]="task.status === 'Pending'"
                              [class.dark:bg-amber-900/50]="task.status === 'Pending'"
                              [class.dark:text-amber-300]="task.status === 'Pending'"
                              [class.bg-blue-100]="task.status === 'In Progress'"
                              [class.text-blue-800]="task.status === 'In Progress'"
                              [class.dark:bg-blue-900/50]="task.status === 'In Progress'"
                              [class.dark:text-blue-300]="task.status === 'In Progress'"
                              [class.bg-emerald-100]="task.status === 'Completed'"
                              [class.text-emerald-800]="task.status === 'Completed'"
                              [class.dark:bg-emerald-900/50]="task.status === 'Completed'"
                              [class.dark:text-emerald-300]="task.status === 'Completed'">
                              {{ task.status }}
                            </span>
                          </div>
                          <div class="flex justify-between items-center mt-2">
                            <p class="text-xs text-zinc-500 dark:text-zinc-400">Assignee: <span class="font-medium text-zinc-700 dark:text-zinc-300">{{ task.assignee }}</span></p>
                            @if (task.status !== 'Completed') {
                              <button (click)="completeTask(room, task)" class="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-medium">Mark Done</button>
                            }
                          </div>
                        </div>
                      }
                    </div>
                  } @else {
                    <p class="text-sm text-zinc-500 dark:text-zinc-400 italic">No tasks assigned.</p>
                  }
                </div>

              </div>
            </div>
          } @else {
            <div class="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col items-center justify-center p-8 h-full text-center sticky top-6">
              <mat-icon style="font-size: 48px; width: 48px; height: 48px;" class="mb-4 text-zinc-300 dark:text-zinc-700">meeting_room</mat-icon>
              <p class="text-lg font-medium text-zinc-900 dark:text-white mb-1">No Room Selected</p>
              <p class="text-sm text-zinc-500 dark:text-zinc-400">Select a room from the grid to view details and manage tasks.</p>
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class HousekeepingComponent {
  toastService = inject(ToastService);

  floorFilter = signal('All');
  statusFilter = signal('All');
  selectedRoom = signal<Room | null>(null);

  rooms = signal<Room[]>([
    { id: '1', number: '101', type: 'Standard Queen', status: 'Dirty', occupancy: 'Vacant', notes: 'Checked out 2h ago', floor: '1', amenities: ['Wi-Fi', 'Mini Fridge', 'Coffee Maker'], recentPreferences: ['Extra Pillows', 'Late Check-out'], maintenanceHistory: ['Fixed leaky faucet (Oct 10)'], tasks: [{ id: 't1', description: 'Deep Clean Bathroom', assignee: 'Maria', status: 'Pending' }] },
    { id: '2', number: '102', type: 'Deluxe King', status: 'Clean', occupancy: 'Vacant', notes: 'Cleaned by Maria', floor: '1', amenities: ['Wi-Fi', 'Mini Fridge', 'Coffee Maker', 'Balcony'], recentPreferences: ['Feather Pillows'], maintenanceHistory: [], tasks: [] },
    { id: '3', number: '103', type: 'Standard Queen', status: 'Inspected', occupancy: 'Vacant', notes: 'Ready for Check-in', floor: '1', amenities: ['Wi-Fi', 'Mini Fridge', 'Coffee Maker'], recentPreferences: [], maintenanceHistory: [], tasks: [] },
    { id: '4', number: '104', type: 'Executive Suite', status: 'Maintenance', occupancy: 'Blocked', notes: 'Broken AC (#TKT-892)', floor: '1', amenities: ['Wi-Fi', 'Mini Fridge', 'Coffee Maker', 'Balcony', 'Jacuzzi'], recentPreferences: ['Wine on Arrival'], maintenanceHistory: ['AC Unit Replacement Pending'], tasks: [{ id: 't2', description: 'Replace AC Filter', assignee: 'John (Maint)', status: 'In Progress' }] },
    { id: '5', number: '201', type: 'Standard Queen', status: 'Dirty', occupancy: 'Occupied', notes: 'Requires daily service', floor: '2', amenities: ['Wi-Fi', 'Mini Fridge', 'Coffee Maker'], recentPreferences: ['Extra Towels'], maintenanceHistory: [], tasks: [] },
    { id: '6', number: '202', type: 'Deluxe King', status: 'Clean', occupancy: 'Occupied', notes: 'Cleaned by John', floor: '2', amenities: ['Wi-Fi', 'Mini Fridge', 'Coffee Maker', 'Balcony'], recentPreferences: [], maintenanceHistory: [], tasks: [] },
    { id: '7', number: '301', type: 'Ocean View', status: 'Dirty', occupancy: 'Vacant', notes: 'Checked out 1h ago', floor: '3', amenities: ['Wi-Fi', 'Mini Fridge', 'Coffee Maker', 'Ocean View'], recentPreferences: ['High Floor'], maintenanceHistory: [], tasks: [] },
    { id: '8', number: '302', type: 'Ocean View', status: 'Inspected', occupancy: 'Vacant', notes: 'Ready for Check-in', floor: '3', amenities: ['Wi-Fi', 'Mini Fridge', 'Coffee Maker', 'Ocean View'], recentPreferences: [], maintenanceHistory: [], tasks: [] },
  ]);

  filteredRooms = computed(() => {
    const floor = this.floorFilter();
    const status = this.statusFilter();

    return this.rooms().filter(room => {
      const matchesFloor = floor === 'All' || room.floor === floor;
      const matchesStatus = status === 'All' || room.status === status;
      return matchesFloor && matchesStatus;
    });
  });

  updateFloorFilter(event: Event) {
    this.floorFilter.set((event.target as HTMLSelectElement).value);
  }

  selectRoom(room: Room) {
    this.selectedRoom.set(room);
  }

  closeRoomDetails() {
    this.selectedRoom.set(null);
  }

  markClean(room: Room, event: Event) {
    event.stopPropagation();
    this.rooms.update(rooms => rooms.map(r => r.id === room.id ? { ...r, status: 'Clean', notes: 'Cleaned just now' } : r));
    if (this.selectedRoom()?.id === room.id) {
      this.selectedRoom.set(this.rooms().find(r => r.id === room.id) || null);
    }
    this.toastService.success(`Room ${room.number} marked as clean.`);
  }

  inspect(room: Room, event: Event) {
    event.stopPropagation();
    this.rooms.update(rooms => rooms.map(r => r.id === room.id ? { ...r, status: 'Inspected', notes: 'Ready for Check-in' } : r));
    if (this.selectedRoom()?.id === room.id) {
      this.selectedRoom.set(this.rooms().find(r => r.id === room.id) || null);
    }
    this.toastService.success(`Room ${room.number} inspected and ready.`);
  }

  resolveMaintenance(room: Room, event: Event) {
    event.stopPropagation();
    this.rooms.update(rooms => rooms.map(r => r.id === room.id ? { ...r, status: 'Dirty', occupancy: 'Vacant', notes: 'Maintenance resolved, needs cleaning' } : r));
    if (this.selectedRoom()?.id === room.id) {
      this.selectedRoom.set(this.rooms().find(r => r.id === room.id) || null);
    }
    this.toastService.success(`Maintenance resolved for Room ${room.number}.`);
  }

  logMaintenance() {
    this.toastService.info('Opening maintenance log form...');
  }

  assignTasks() {
    this.toastService.info('Opening task assignment modal...');
  }

  addTask(room: Room) {
    this.toastService.info(`Opening add task form for Room ${room.number}...`);
  }

  completeTask(room: Room, task: Task) {
    this.rooms.update(rooms => rooms.map(r => {
      if (r.id === room.id) {
        return {
          ...r,
          tasks: r.tasks.map(t => t.id === task.id ? { ...t, status: 'Completed' } : t)
        };
      }
      return r;
    }));
    if (this.selectedRoom()?.id === room.id) {
      this.selectedRoom.set(this.rooms().find(r => r.id === room.id) || null);
    }
    this.toastService.success(`Task "${task.description}" marked as completed.`);
  }
}
