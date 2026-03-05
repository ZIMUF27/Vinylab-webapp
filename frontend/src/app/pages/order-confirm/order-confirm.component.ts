import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DesignService } from '../../services/design.service';
import { OrderService } from '../../services/order.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-order-confirm',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="max-w-3xl mx-auto px-6 py-12 animate-in fade-in duration-700" *ngIf="design">
      <!-- Breadcrumbs -->
      <nav class="flex mb-8 text-sm text-v-muted dark:text-slate-500 font-black italic uppercase tracking-wider">
        <span>Template</span>
        <span class="mx-3">→</span>
        <span>Design</span>
        <span class="mx-3">→</span>
        <span class="text-indigo-600 dark:text-indigo-400">Order Confirmation</span>
      </nav>

      <div class="glass-card !p-0 overflow-hidden">
        <!-- Header -->
        <div class="bg-gradient-to-r from-indigo-600 to-indigo-800 p-10 text-white">
          <h1 class="text-3xl font-black mb-2">Order Review</h1>
          <p class="opacity-80">Please check your configuration before proceeding to payment.</p>
        </div>

        <div class="p-10 space-y-10">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
            <!-- Left Side: Design Preview -->
            <div class="space-y-6">
                <p class="text-[10px] uppercase font-black tracking-[0.2em] text-v-muted">Design Summary</p>
                <div 
                  class="w-full aspect-video rounded-xl flex items-center justify-center p-4 border border-white/5 shadow-inner relative overflow-hidden"
                  [style.backgroundColor]="design.color"
                >
                  <!-- Uploaded Image Preview -->
                  <img *ngIf="design.design_file" 
                       [src]="getFullUrl(design.design_file)"
                       class="absolute inset-0 w-full h-full object-cover">

                  <span *ngIf="design.text_content" class="relative z-10 text-white text-xl font-bold text-center break-words drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                    {{ design.text_content }}
                  </span>
                </div>
                <div class="flex justify-between text-xs italic text-v-muted dark:text-slate-400 font-black uppercase tracking-tight">
                  <span>Size: <span class="text-v-secondary">{{ design.width }}cm x {{ design.height }}cm</span></span>
                  <span>Color: <span class="text-v-secondary">{{ design.color }}</span></span>
                </div>
            </div>

            <!-- Right Side: Order Items -->
            <div class="space-y-6">
              <p class="text-[10px] uppercase font-black tracking-[0.2em] text-v-muted">Item Details</p>
              
              <div class="space-y-4">
                <div class="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-800">
                  <span class="text-v-muted dark:text-slate-300 font-black">Base Template</span>
                  <span class="font-black text-v-secondary">{{ design.template.name }}</span>
                </div>
                <div class="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-800">
                  <span class="text-v-muted dark:text-slate-300 font-black">Material</span>
                  <span class="text-indigo-700 dark:text-indigo-400 font-black">{{ design.template.material_type }}</span>
                </div>
                <div class="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-800">
                   <span class="text-v-muted dark:text-slate-300 font-black">Total Area</span>
                   <span class="font-black text-v-secondary">{{ design.width * design.height }} cm²</span>
                </div>
               
                <div class="flex justify-between items-center pt-6">
                  <span class="text-2xl font-black text-v-dark">Total Price</span>
                  <span class="text-3xl font-black text-amount-neutral">฿{{ design.price_calculated | number:'1.2-2' }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex flex-col sm:flex-row gap-4 pt-6">
            <button 
              class="btn btn-primary flex-grow py-5 text-lg font-black group"
              (click)="placeOrder()" 
              [disabled]="loading"
            >
              <span>Confirm & Proceed to Payment</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
            <a [routerLink]="['/design', design.template.id]" class="btn btn-outline py-5">
              Change Design
            </a>
            <a [routerLink]="['/templates']" class="btn btn-ghost py-5 text-red-500 font-bold">
              Cancel & Exit
            </a>
          </div>

          <div class="text-center p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500" *ngIf="error">
            {{ error }}
          </div>
        </div>
      </div>
      
      <p class="text-center mt-8 text-v-muted text-sm italic font-black">
        * Orders are final once payment is completed. Printing takes 1-3 business days.
      </p>
    </div>
  `
})
export class OrderConfirmComponent implements OnInit {
  design: any;
  loading = false;
  error = '';

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private designService = inject(DesignService);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.designService.getById(id).subscribe(res => {
        if (res.success) this.design = res.data;
      });
    }
  }

  getFullUrl(path: string): string {
    if (!path) return '';
    if (path.startsWith('/uploads')) {
      return `${environment.apiUrl.replace('/api', '')}${path}`;
    }
    return path;
  }

  placeOrder() {
    this.router.navigate(['/payment', this.design.id], { queryParams: { type: 'design' } });
  }
}
