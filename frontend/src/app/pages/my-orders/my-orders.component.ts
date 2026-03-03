import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule],
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
                <td class="px-8 py-6 font-mono text-xs text-indigo-700 dark:text-indigo-400 font-black">#{{ order.id.slice(0, 8) }}</td>
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
    </div>
  `
})
export class MyOrdersComponent implements OnInit {
  private orderService = inject(OrderService);
  orders = signal<any[]>([]);

  ngOnInit() {
    this.orderService.getMyOrders().subscribe(res => {
      if (res.success) this.orders.set(res.data);
    });
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
