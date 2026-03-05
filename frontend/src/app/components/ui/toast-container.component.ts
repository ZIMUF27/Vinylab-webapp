import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';

@Component({
    selector: 'app-toast-container',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="fixed bottom-6 right-6 z-[200] flex flex-col gap-3 pointer-events-none">
      <div *ngFor="let toast of notificationService.toasts()" 
           class="toast-item pointer-events-auto flex items-center gap-4 px-6 py-4 rounded-2xl shadow-2xl border backdrop-blur-xl animate-in slide-in-from-right-10 fade-in duration-300"
           [ngClass]="{
             'bg-emerald-500/10 border-emerald-500/20 text-emerald-400': toast.type === 'success',
             'bg-red-500/10 border-red-500/20 text-red-400': toast.type === 'error',
             'bg-indigo-500/10 border-indigo-500/20 text-indigo-400': toast.type === 'info',
             'bg-amber-500/10 border-amber-500/20 text-amber-400': toast.type === 'warning'
           }">
        
        <!-- Icons -->
        <span *ngIf="toast.type === 'success'">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </span>
        <span *ngIf="toast.type === 'error'">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </span>
        
        <p class="font-bold text-sm tracking-wide">{{ toast.message }}</p>

        <button (click)="notificationService.remove(toast.id)" class="ml-4 opacity-50 hover:opacity-100 transition-opacity">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  `,
    styles: [`
    .toast-item { max-width: 400px; }
  `]
})
export class ToastContainerComponent {
    notificationService = inject(NotificationService);
}
