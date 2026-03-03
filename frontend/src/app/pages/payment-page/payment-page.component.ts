import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from '../../services/payment.service';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-payment-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="max-w-2xl mx-auto px-6 py-12 animate-in slide-in-from-top-4 duration-700">
      <div class="glass-card !p-10">
        <div class="flex items-center gap-4 mb-10">
           <div class="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-xl">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
             </svg>
           </div>
           <h2 class="text-3xl font-black text-v-dark">Secure Payment</h2>
        </div>
        
        <form [formGroup]="paymentForm" (ngSubmit)="processPayment()" class="space-y-10">
          <!-- Method Selection -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label 
              class="relative flex flex-col p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300"
              [class.bg-indigo-600/10]="paymentForm.get('payment_method')?.value === 'transfer'"
              [class.border-indigo-600]="paymentForm.get('payment_method')?.value === 'transfer'"
              [class.border-slate-200]="paymentForm.get('payment_method')?.value !== 'transfer'"
              [class.dark:border-slate-800]="paymentForm.get('payment_method')?.value !== 'transfer'"
            >
              <input type="radio" formControlName="payment_method" value="transfer" class="hidden">
              <span class="text-xs font-black uppercase tracking-widest text-v-muted dark:text-slate-500 mb-2">Method 01</span>
              <span class="text-lg font-black text-v-secondary">Bank Transfer</span>
            </label>

            <label 
              class="relative flex flex-col p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300"
              [class.bg-indigo-600/10]="paymentForm.get('payment_method')?.value === 'credit_card'"
              [class.border-indigo-600]="paymentForm.get('payment_method')?.value === 'credit_card'"
              [class.border-slate-200]="paymentForm.get('payment_method')?.value !== 'credit_card'"
              [class.dark:border-slate-800]="paymentForm.get('payment_method')?.value !== 'credit_card'"
            >
              <input type="radio" formControlName="payment_method" value="credit_card" class="hidden">
              <span class="text-xs font-black uppercase tracking-widest text-v-muted dark:text-slate-500 mb-2">Method 02</span>
              <span class="text-lg font-black text-v-secondary">Credit Card</span>
            </label>
          </div>

          <!-- Bank Info (Conditional) -->
          <div class="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 space-y-4 animate-in fade-in zoom-in-95" *ngIf="paymentForm.get('payment_method')?.value === 'transfer'">
            <div class="flex justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <span class="text-v-muted dark:text-slate-500 font-black">Bank Name</span>
              <span class="font-black text-v-secondary">VinylBank (VBK)</span>
            </div>
            <div class="flex justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <span class="text-v-muted dark:text-slate-500 font-black">Account Name</span>
              <span class="font-black text-v-secondary uppercase">VinylLab Co., Ltd.</span>
            </div>
            <div class="flex justify-between">
              <span class="text-v-muted dark:text-slate-500 font-black">Account No.</span>
              <span class="font-mono text-xl text-indigo-700 dark:text-indigo-400 font-black">123-4-56789-0</span>
            </div>
          </div>

          <!-- Credit Card Placeholder (Conditional) -->
          <div class="space-y-6 animate-in fade-in transition-all" *ngIf="paymentForm.get('payment_method')?.value === 'credit_card'">
            <div class="space-y-2">
              <label class="text-sm font-black text-v-muted dark:text-slate-400">Card Number</label>
              <input type="text" class="form-input text-v-secondary dark:text-white" placeholder="XXXX XXXX XXXX XXXX">
            </div>
            <div class="grid grid-cols-2 gap-4">
               <div class="space-y-2">
                 <label class="text-sm font-black text-v-muted dark:text-slate-400">Expiry</label>
                 <input type="text" class="form-input text-v-secondary dark:text-white" placeholder="MM/YY">
               </div>
               <div class="space-y-2">
                 <label class="text-sm font-black text-v-muted dark:text-slate-400">CVC</label>
                 <input type="text" class="form-input text-v-secondary dark:text-white" placeholder="123">
               </div>
            </div>
          </div>

          <button 
            type="submit" 
            class="btn btn-primary w-full py-5 text-xl font-black group" 
            [disabled]="loading"
          >
            <span *ngIf="!loading">Pay Securely Now</span>
            <span *ngIf="loading" class="flex items-center justify-center gap-3">
              <svg class="animate-spin h-6 w-6 text-white" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" class="opacity-25"></circle><path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" class="opacity-75"></path></svg>
              Processing Transaction...
            </span>
          </button>
          
          <div class="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-center" *ngIf="error">
            {{ error }}
          </div>
        </form>
      </div>

      <div class="mt-8 flex items-center justify-center gap-6 opacity-30">
        <img src="https://img.icons8.com/color/48/000000/visa.png" class="h-8 grayscale">
        <img src="https://img.icons8.com/color/48/000000/mastercard.png" class="h-8 grayscale">
        <img src="https://img.icons8.com/color/48/000000/amex.png" class="h-8 grayscale">
      </div>
    </div>
  `
})
export class PaymentPageComponent implements OnInit {
  fb = inject(FormBuilder);
  route = inject(ActivatedRoute);
  router = inject(Router);
  paymentService = inject(PaymentService);

  orderId: string | null = null;
  loading = false;
  error = '';

  paymentForm = this.fb.group({
    payment_method: ['transfer', Validators.required]
  });

  ngOnInit() {
    this.orderId = this.route.snapshot.paramMap.get('id');
  }

  processPayment() {
    if (!this.orderId) return;
    this.loading = true;
    this.error = '';

    this.paymentService.create({
      order_id: this.orderId,
      ...this.paymentForm.value
    }).subscribe({
      next: (res) => {
        if (res.success) {
          this.router.navigate(['/my-orders']);
        }
      },
      error: (err) => {
        this.error = err.error?.message || 'Payment failed';
        this.loading = false;
      }
    });
  }
}
