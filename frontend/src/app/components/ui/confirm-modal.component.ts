import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';

@Component({
    selector: 'app-confirm-modal',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div *ngIf="notificationService.confirmState().open" 
         class="fixed inset-0 z-[250] flex items-center justify-center p-6 animate-in fade-in duration-300">
      
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-slate-950/60 backdrop-blur-md" (click)="notificationService.handleConfirm(false)"></div>

      <!-- Modal Card -->
      <div class="glass-card relative z-10 w-full max-w-md !p-0 overflow-hidden animate-in zoom-in-95 duration-300 shadow-2xl border-white/10">
        
        <!-- Top Bar Decor -->
        <div class="h-1.5 w-full bg-gradient-to-r" 
             [ngClass]="{
               'from-red-500 to-pink-500': notificationService.confirmState().options?.type === 'danger',
               'from-indigo-500 to-purple-500': notificationService.confirmState().options?.type === 'info' || !notificationService.confirmState().options?.type,
               'from-amber-500 to-orange-500': notificationService.confirmState().options?.type === 'warning'
             }"></div>

        <div class="p-8">
          <div class="flex items-center gap-4 mb-4">
            <div class="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                 [ngClass]="{
                   'bg-red-500/10 text-red-500': notificationService.confirmState().options?.type === 'danger',
                   'bg-indigo-500/10 text-indigo-500': notificationService.confirmState().options?.type === 'info' || !notificationService.confirmState().options?.type,
                   'bg-amber-500/10 text-amber-500': notificationService.confirmState().options?.type === 'warning'
                 }">
               <svg *ngIf="notificationService.confirmState().options?.type === 'danger'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
               </svg>
               <svg *ngIf="notificationService.confirmState().options?.type !== 'danger'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
            </div>
            <h3 class="text-xl font-black text-v-dark">{{ notificationService.confirmState().options?.title }}</h3>
          </div>

          <p class="text-v-secondary dark:text-slate-400 font-bold mb-8 leading-relaxed">
            {{ notificationService.confirmState().options?.message }}
          </p>

          <div class="flex gap-3">
            <button (click)="notificationService.handleConfirm(false)" 
                    class="btn btn-outline flex-1 py-4 text-xs font-black uppercase tracking-widest border-slate-200">
              {{ notificationService.confirmState().options?.cancelText || 'Cancel' }}
            </button>
            <button (click)="notificationService.handleConfirm(true)" 
                    class="btn flex-1 py-4 text-xs font-black uppercase tracking-widest shadow-xl"
                    [ngClass]="{
                      'bg-red-600 hover:bg-red-700 text-white': notificationService.confirmState().options?.type === 'danger',
                      'bg-indigo-600 hover:bg-indigo-700 text-white': notificationService.confirmState().options?.type === 'info' || !notificationService.confirmState().options?.type,
                      'bg-amber-600 hover:bg-amber-700 text-white': notificationService.confirmState().options?.type === 'warning'
                    }">
              {{ notificationService.confirmState().options?.confirmText || 'Confirm' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ConfirmModalComponent {
    notificationService = inject(NotificationService);
}
