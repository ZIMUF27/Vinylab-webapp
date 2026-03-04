import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { environment } from '../../../environments/environment';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="max-w-7xl mx-auto px-6 py-12 animate-in fade-in duration-500">
      <div class="flex justify-between items-end mb-12">
        <div>
          <h1 class="section-title mb-2 text-v-dark">Order History</h1>
          <p class="text-v-secondary dark:text-slate-400 font-bold">Track and manage your custom sign orders</p>
        </div>
        <div class="text-xs font-black text-v-muted dark:text-slate-500 italic uppercase tracking-wider">Showing all orders</div>
      </div>
      
      <div class="glass-card !p-0 overflow-hidden" *ngIf="orders().length > 0; else empty">
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead class="bg-slate-50 dark:bg-white/5 text-xs uppercase font-black tracking-widest text-v-dark dark:text-slate-400 border-b border-slate-200 dark:border-white/5">
              <tr>
                <th class="px-8 py-5">Order Reference</th>
                <th class="px-8 py-5">Product Details</th>
                <th class="px-8 py-5">Status</th>
                <th class="px-8 py-5">Total Price</th>
                <th class="px-8 py-5">Purchased Date</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-white/5">
              <tr *ngFor="let order of orders()" class="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors group">
                <td class="px-8 py-6">
                  <div class="font-mono text-xs text-indigo-700 dark:text-indigo-400 font-black">#{{ order.id.slice(0, 8) }}</div>
                  <button (click)="selectedOrder.set(order)" class="mt-2 flex items-center gap-1.5 text-[10px] font-black uppercase text-indigo-500 hover:text-indigo-400 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View Design
                  </button>
                </td>
                <td class="px-8 py-6">
                  <div class="font-black text-v-dark dark:text-slate-200">{{ order.design.template.name }}</div>
                  <div class="text-xs text-v-muted dark:text-slate-400 mt-1 italic font-black uppercase tracking-tight">{{ order.design.width }} x {{ order.design.height }} cm • {{ order.design.template.material_type }}</div>
                </td>
                <td class="px-8 py-6">
                  <span class="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-black ring-1 ring-inset" [ngClass]="getStatusClass(order.status)">
                    <span class="w-2 h-2 rounded-full mr-2" [ngClass]="getStatusDotClass(order.status)"></span>
                    {{ order.status.replace('_', ' ') | uppercase }}
                  </span>
                </td>
                <td class="px-8 py-6 font-black text-amount-green text-lg">฿{{ order.total_price | number:'1.2-2' }}</td>
                <td class="px-8 py-6 text-v-muted dark:text-slate-400 text-sm italic font-black">{{ order.created_at | date:'MMM d, y, h:mm a' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <ng-template #empty>
        <div class="glass-card !p-20 text-center flex flex-col items-center gap-6">
          <div class="w-20 h-20 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center text-slate-400 dark:text-slate-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <div>
            <h3 class="text-xl font-black text-v-dark dark:text-white mb-2">No orders found</h3>
            <p class="text-v-secondary dark:text-slate-500 font-bold">You haven't designed or ordered any signs yet.</p>
          </div>
          <a routerLink="/templates" class="btn btn-primary">Start First Design</a>
        </div>
      </ng-template>

      <!-- PREVIEW MODAL -->
      <div *ngIf="selectedOrder()" class="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300">
        <div class="absolute inset-0 bg-slate-950/80 backdrop-blur-md" (click)="selectedOrder.set(null)"></div>
        
        <div class="glass-card !p-0 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col relative z-10 animate-in zoom-in-95 duration-300 shadow-2xl border-indigo-500/20">
          <!-- Modal Header -->
          <div class="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-v-dark/50" *ngIf="selectedOrder()">
            <div>
              <h3 class="text-lg font-black text-white flex items-center gap-2">
                <span class="text-indigo-400">Design Preview</span>
                <span class="text-v-muted text-xs font-mono">#{{ selectedOrder().id.slice(0, 8) }}</span>
              </h3>
              <p class="text-[10px] font-black text-v-muted uppercase tracking-widest">Ordered Design Summary</p>
            </div>
            <button (click)="selectedOrder.set(null)" class="p-2 hover:bg-white/5 rounded-xl transition-colors text-v-muted hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Modal Content -->
          <div class="flex-grow overflow-y-auto p-8 md:p-12 scrollbar-none" *ngIf="selectedOrder()">
            <div class="grid grid-cols-1 lg:grid-cols-5 gap-10">
              <!-- Canvas Preview -->
              <div class="lg:col-span-3 flex flex-col items-center justify-center min-h-[300px] rounded-2xl bg-slate-900 border border-white/5 relative overflow-hidden shadow-inner">
                <!-- Design Box -->
                <div class="relative flex items-center justify-center p-6 transition-all duration-300 shadow-2xl rounded overflow-hidden"
                      [style.backgroundColor]="selectedOrder().design.color"
                      [style.width]="(selectedOrder().design.width > selectedOrder().design.height ? 100 : 100 * (selectedOrder().design.width / selectedOrder().design.height)) + '%'"
                      [style.maxWidth]="'360px'"
                      [style.aspectRatio]="selectedOrder().design.width + '/' + selectedOrder().design.height">
                  
                  <!-- Uploaded Image -->
                  <img *ngIf="selectedOrder().design.design_file" 
                        [src]="getFullUrl(selectedOrder().design.design_file)"
                        class="absolute inset-0 w-full h-full object-cover">

                  <!-- Text Content -->
                  <span *ngIf="selectedOrder().design.text_content" 
                        class="relative z-10 text-white font-bold text-center break-words drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                        [style.fontSize]="'clamp(10px, 4vw, 24px)'">
                    {{ selectedOrder().design.text_content }}
                  </span>
                </div>
              </div>

              <!-- Design Info -->
              <div class="lg:col-span-2 space-y-8">
                <div class="space-y-4">
                  <p class="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400/60">Technical Specifications</p>
                  <div class="space-y-3">
                    <div class="flex justify-between items-center py-2 border-b border-white/5">
                      <span class="text-xs font-bold text-v-muted">Dimensions</span>
                      <span class="text-sm font-black text-white">{{ selectedOrder().design.width }} W × {{ selectedOrder().design.height }} H cm</span>
                    </div>
                    <div class="flex justify-between items-center py-2 border-b border-white/5">
                      <span class="text-xs font-bold text-v-muted">Material</span>
                      <span class="text-sm font-black text-white">{{ selectedOrder().design.template.material_type }}</span>
                    </div>
                  </div>
                </div>

                <div class="space-y-4">
                  <p class="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400/60">Payment Summary</p>
                  <div class="p-4 rounded-xl bg-white/5 border border-white/5 flex justify-between items-center">
                    <span class="text-xs font-bold text-v-muted">Total Paid</span>
                    <span class="text-xl font-black text-amount-green">฿{{ selectedOrder().total_price | number:'1.2-2' }}</span>
                  </div>
                </div>

                <div class="pt-4 space-y-3">
                  <a [routerLink]="['/design', selectedOrder().design.template.id]" class="btn btn-primary w-full text-xs font-black uppercase tracking-widest">
                    Order Again
                  </a>
                  <button (click)="selectedOrder.set(null)" class="btn btn-outline w-full text-xs font-black uppercase tracking-widest">
                    Close Preview
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class MyOrdersComponent implements OnInit {
  private orderService = inject(OrderService);
  orders = signal<any[]>([]);
  selectedOrder = signal<any>(null);

  ngOnInit() {
    this.orderService.getMyOrders().subscribe(res => {
      if (res.success) this.orders.set(res.data);
    });
  }

  getFullUrl(path: string): string {
    if (!path) return '';
    if (path.startsWith('/uploads')) {
      return `${environment.apiUrl.replace('/api', '')}${path}`;
    }
    return path;
  }

  getStatusClass(status: string) {
    const map: any = {
      'pending_payment': 'bg-amber-500/10 text-amber-500 ring-amber-500/30',
      'paid': 'bg-emerald-500/10 text-emerald-500 ring-emerald-500/30',
      'printing': 'bg-indigo-500/10 text-indigo-400 ring-indigo-500/30',
      'completed': 'bg-fuchsia-500/10 text-fuchsia-400 ring-fuchsia-500/30',
      'shipped': 'bg-sky-500/10 text-sky-400 ring-sky-500/30'
    };
    return map[status] || 'bg-slate-500/10 text-slate-500 ring-slate-500/30';
  }

  getStatusDotClass(status: string) {
    const map: any = {
      'pending_payment': 'bg-amber-500',
      'paid': 'bg-emerald-500',
      'printing': 'bg-indigo-500',
      'completed': 'bg-fuchsia-500',
      'shipped': 'bg-sky-500'
    };
    return map[status] || 'bg-slate-500';
  }
}
