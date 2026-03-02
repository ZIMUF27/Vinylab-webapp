import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../services/dashboard.service';
import { OrderService } from '../../services/order.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-backoffice',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto px-6 py-12 animate-in fade-in duration-500">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 class="section-title mb-2">Management Center</h1>
          <p class="text-slate-400">Overview of business performance and order fulfillment</p>
        </div>
        <div class="flex h-12 gap-2 bg-slate-900 p-1.5 rounded-2xl border border-white/5 shadow-inner">
           <button 
             class="px-6 rounded-xl transition-all duration-300 text-sm font-bold"
             [class.bg-indigo-600]="activeTab === 'dashboard'"
             [class.text-white]="activeTab === 'dashboard'"
             [class.text-slate-500]="activeTab !== 'dashboard'"
             (click)="activeTab = 'dashboard'"
           >Dashboard</button>
            <button 
              class="px-6 rounded-xl transition-all duration-300 text-sm font-bold"
              [class.bg-indigo-600]="activeTab === 'customers'"
              [class.text-white]="activeTab === 'customers'"
              [class.text-slate-500]="activeTab !== 'customers'"
              (click)="activeTab = 'customers'"
            >CRM & Sales</button>
           <button 
             class="px-6 rounded-xl transition-all duration-300 text-sm font-bold"
             [class.bg-indigo-600]="activeTab === 'orders'"
             [class.text-white]="activeTab === 'orders'"
             [class.text-slate-500]="activeTab !== 'orders'"
             (click)="activeTab = 'orders'"
           >Fulfillment</button>
        </div>
      </div>
      
      <!-- DASHBOARD TAB -->
      <div *ngIf="activeTab === 'dashboard'" class="space-y-12 animate-in zoom-in-95 duration-500">
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" *ngIf="stats()">
          <div class="glass-card flex flex-col justify-between !p-8 border-l-4 border-indigo-500">
            <span class="text-xs font-bold uppercase tracking-widest text-slate-500">Daily Revenue</span>
            <div class="mt-4 flex items-end justify-between">
              <span class="text-3xl font-black text-indigo-400">฿{{ stats().dailyRevenue | number:'1.0-0' }}</span>
              <span class="text-xs text-slate-500 italic">Today</span>
            </div>
          </div>
          <div class="glass-card flex flex-col justify-between !p-8 border-l-4 border-emerald-500">
            <span class="text-xs font-bold uppercase tracking-widest text-slate-500">Monthly Revenue</span>
            <div class="mt-4 flex items-end justify-between">
              <span class="text-3xl font-black text-emerald-400">฿{{ stats().monthlyRevenue | number:'1.0-0' }}</span>
              <span class="text-xs text-slate-500 italic">This Month</span>
            </div>
          </div>
          <div class="glass-card flex flex-col justify-between !p-8 border-l-4 border-amber-500">
            <span class="text-xs font-bold uppercase tracking-widest text-slate-500">Yearly Revenue</span>
            <div class="mt-4 flex items-end justify-between">
              <span class="text-3xl font-black text-amber-500">฿{{ stats().yearlyRevenue | number:'1.0-0' }}</span>
              <span class="text-xs text-slate-500 italic">This Year</span>
            </div>
          </div>
          <div class="glass-card flex flex-col justify-between !p-8 border-l-4 border-pink-500">
            <span class="text-xs font-bold uppercase tracking-widest text-slate-500">Total Revenue</span>
            <div class="mt-4 flex items-end justify-between">
              <span class="text-3xl font-black text-pink-500">฿{{ stats().totalRevenue | number:'1.0-0' }}</span>
              <span class="text-xs text-slate-500 italic">Grand Total</span>
            </div>
          </div>
        </div>

        <!-- Secondary Stats -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6" *ngIf="stats()">
           <div class="glass-card !p-8 flex items-center justify-between">
              <div>
                <p class="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Total Orders</p>
                <p class="text-3xl font-black text-white">{{ stats().totalOrders }}</p>
              </div>
              <div class="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
           </div>
           <div class="glass-card !p-8 flex items-center justify-between">
              <div>
                <p class="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Total Customers</p>
                <p class="text-3xl font-black text-white">{{ stats().totalCustomers }}</p>
              </div>
              <div class="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
           </div>
        </div>

        <!-- System Message -->
        <div class="glass-card bg-indigo-600/5 !p-10 border-indigo-500/20">
           <div class="flex items-center gap-6">
             <div class="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
             </div>
             <div>
               <h3 class="text-xl font-bold mb-1">System Health Excellent</h3>
               <p class="text-slate-400 text-sm">All order processing nodes are operational. Database latency is within normal parameters (12ms).</p>
             </div>
           </div>
        </div>
      </div>

      <!-- FULFILLMENT TAB -->
      <div *ngIf="activeTab === 'orders'" class="glass-card !p-0 overflow-hidden animate-in zoom-in-95 duration-500">
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead class="bg-white/5 text-xs uppercase font-bold tracking-widest text-slate-400 border-b border-white/5">
              <tr>
                <th class="px-8 py-5">Order Context</th>
                <th class="px-8 py-5">Client Name</th>
                <th class="px-8 py-5">Live Status</th>
                <th class="px-8 py-5">Amount</th>
                <th class="px-8 py-5">Management</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5">
              <tr *ngFor="let order of orders()" class="hover:bg-white/5 transition-colors">
                <td class="px-8 py-6">
                  <div class="font-mono text-xs text-indigo-400 mb-1">REF: {{ order.id.slice(0, 8) }}</div>
                  <div class="text-sm font-bold">{{ order.design.template.name }}</div>
                </td>
                <td class="px-8 py-6">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
                      {{ (order.design.user.name || 'U').charAt(0) }}
                    </div>
                    <div>
                      <div class="text-sm font-bold text-slate-200">{{ order.design.user.name }}</div>
                      <div class="text-[10px] text-slate-500 italic">{{ order.design.user.email }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-8 py-6">
                  <span class="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase ring-1 ring-inset" [ngClass]="getStatusClass(order.status)">
                    {{ order.status.replace('_', ' ') }}
                  </span>
                </td>
                <td class="px-8 py-6 font-black text-slate-200">฿{{ order.total_price | number:'1.2-2' }}</td>
                <td class="px-8 py-6">
                  <select 
                    [ngModel]="order.status" 
                    (ngModelChange)="updateStatus(order.id, $event)"
                    class="bg-slate-900 border border-slate-700 text-xs rounded-lg px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="pending_payment">PENDING PAYMENT</option>
                    <option value="paid">PAID & VERIFIED</option>
                    <option value="printing">PRINTING IN PROGRESS</option>
                    <option value="completed">COMPLETED</option>
                    <option value="shipped">SHIPPED OUT</option>
                  </select>
                </td>
              </tr>
              <tr *ngIf="orders().length === 0">
                <td colspan="5" class="px-8 py-12 text-center text-slate-500 italic">No orders found.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- CUSTOMERS TAB -->
      <div *ngIf="activeTab === 'customers'" class="glass-card !p-0 overflow-hidden animate-in zoom-in-95 duration-500">
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead class="bg-white/5 text-xs uppercase font-bold tracking-widest text-slate-400 border-b border-white/5">
              <tr>
                <th class="px-8 py-5">Customer info</th>
                <th class="px-8 py-5">Phone</th>
                <th class="px-8 py-5">Registered</th>
                <th class="px-8 py-5">Activity</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5">
              <tr *ngFor="let customer of customers()" class="hover:bg-white/5 transition-colors">
                <td class="px-8 py-6">
                  <div class="text-sm font-bold text-slate-200">{{ customer.name }}</div>
                  <div class="text-[10px] text-slate-500 italic">{{ customer.email }}</div>
                </td>
                <td class="px-8 py-6 text-sm text-slate-300">{{ customer.phone || 'N/A' }}</td>
                <td class="px-8 py-6 text-sm text-slate-500">{{ customer.created_at | date:'mediumDate' }}</td>
                <td class="px-8 py-6">
                  <span class="text-xs font-bold text-slate-300">{{ customer._count?.designs }} Designs Created</span>
                </td>
              </tr>
              <tr *ngIf="customers().length === 0">
                <td colspan="4" class="px-8 py-12 text-center text-slate-500 italic">No customers found.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    select { appearance: none; background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%2364748b' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E"); background-position: right 0.5rem center; background-repeat: no-repeat; background-size: 1.5em 1.5em; padding-right: 2.5rem; }
  `]
})
export class BackofficeComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  private orderService = inject(OrderService);
  authService = inject(AuthService);

  activeTab = 'dashboard';
  stats = signal<any>(null);
  orders = signal<any[]>([]);
  customers = signal<any[]>([]);

  ngOnInit() {
    this.dashboardService.getStats().subscribe(res => {
      if (res.success) this.stats.set(res.data);
    });
    this.orderService.getAll().subscribe(res => {
      if (res.success) this.orders.set(res.data);
    });
    this.dashboardService.getCustomers().subscribe(res => {
      if (res.success) this.customers.set(res.data);
    });
  }

  updateStatus(id: string, newStatus: string) {
    this.orderService.updateStatus(id, newStatus).subscribe(res => {
      if (res.success) {
        // Optimistic update locally
        const currentOrders = this.orders();
        const index = currentOrders.findIndex(o => o.id === id);
        if (index !== -1) {
          currentOrders[index].status = newStatus;
          this.orders.set([...currentOrders]);
        }
      }
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
}
