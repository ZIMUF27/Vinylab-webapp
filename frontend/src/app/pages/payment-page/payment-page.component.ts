import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from '../../services/payment.service';
import { DesignService } from '../../services/design.service';
import { OrderService } from '../../services/order.service';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-payment-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="max-w-2xl mx-auto px-6 py-12 animate-in slide-in-from-top-4 duration-700">
      <div class="glass-card !p-10">
        <div class="flex items-center justify-between mb-10">
          <div class="flex items-center gap-4">
             <div class="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-xl">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
               </svg>
             </div>
             <h2 class="text-3xl font-black text-v-dark">Secure Payment</h2>
          </div>
          <div *ngIf="price" class="text-right">
            <p class="text-[10px] uppercase font-black tracking-widest text-v-muted">Amount to Pay</p>
            <p class="text-2xl font-black text-indigo-600">฿{{ price | number:'1.2-2' }}</p>
          </div>
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
              [class.bg-indigo-600/10]="paymentForm.get('payment_method')?.value === 'qr_code'"
              [class.border-indigo-600]="paymentForm.get('payment_method')?.value === 'qr_code'"
              [class.border-slate-200]="paymentForm.get('payment_method')?.value !== 'qr_code'"
              [class.dark:border-slate-800]="paymentForm.get('payment_method')?.value !== 'qr_code'"
            >
              <input type="radio" formControlName="payment_method" value="qr_code" class="hidden">
              <span class="text-xs font-black uppercase tracking-widest text-v-muted dark:text-slate-500 mb-2">Method 02</span>
              <span class="text-lg font-black text-v-secondary">QR Code</span>
            </label>
          </div>

          <!-- Payment Details -->
          <div class="space-y-8">
            <!-- Bank Transfer Details -->
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

            <!-- QR Code Details -->
            <div class="flex flex-col items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 space-y-4 animate-in fade-in zoom-in-95" *ngIf="paymentForm.get('payment_method')?.value === 'qr_code'">
              <p class="text-sm font-black text-v-muted uppercase tracking-widest">Scan to Pay with PromptPay</p>
              <div class="bg-white p-4 rounded-xl shadow-lg border-4 border-indigo-600">
                <img src="assets/qr-payment.jpg" alt="PromptPay QR" class="max-w-[250px] w-full h-auto">
              </div>
              <p class="text-lg font-black text-v-secondary">Account: นาย อัคคภาคย์ ภูสดแสง</p>
            </div>

            <!-- Slip Upload Section -->
            <div class="space-y-4">
              <label class="text-sm font-black text-v-muted dark:text-slate-400 uppercase tracking-widest">Upload Payment Slip</label>
              <div 
                class="relative border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-10 flex flex-col items-center justify-center hover:border-indigo-600 transition-colors cursor-pointer"
                [class.border-indigo-600]="selectedFile"
              >
                <input type="file" (change)="onFileSelected($event)" class="absolute inset-0 opacity-0 cursor-pointer" accept="image/*">
                
                <div *ngIf="!selectedFile" class="text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-slate-400 mb-4 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p class="font-black text-v-secondary">Click or drag to upload slip</p>
                  <p class="text-xs text-v-muted mt-1">PNG, JPG up to 5MB</p>
                </div>

                <div *ngIf="selectedFile" class="flex items-center gap-4">
                  <div class="w-16 h-16 bg-green-500/10 rounded-lg flex items-center justify-center text-green-500">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div class="flex-grow min-w-0">
                    <p class="font-black text-v-secondary truncate">{{ selectedFile.name }}</p>
                    <p class="text-xs text-v-muted">{{ (selectedFile.size / 1024).toFixed(0) }} KB</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-4">
            <button 
              type="submit" 
              class="btn btn-primary w-full py-5 text-xl font-black group" 
              [disabled]="loading || !selectedFile"
            >
              <span *ngIf="!loading">Submit Payment Slip</span>
              <span *ngIf="loading" class="flex items-center justify-center gap-3">
                <svg class="animate-spin h-6 w-6 text-white" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" class="opacity-25"></circle><path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" class="opacity-75"></path></svg>
                Verifying Transaction...
              </span>
            </button>

            <button 
              type="button"
              (click)="router.navigate(['/templates'])"
              class="btn btn-ghost w-full py-4 text-slate-500 font-bold"
              [disabled]="loading"
            >
              Cancel & Exit
            </button>
          </div>
          
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
  private designService = inject(DesignService);
  private orderService = inject(OrderService);
  private notificationService = inject(NotificationService);

  orderId: string | null = null;
  type: string = 'order';
  price: number = 0;
  loading = false;
  error = '';
  selectedFile: File | null = null;

  paymentForm = this.fb.group({
    payment_method: ['transfer', Validators.required]
  });

  ngOnInit() {
    this.orderId = this.route.snapshot.paramMap.get('id');
    this.type = this.route.snapshot.queryParamMap.get('type') || 'order';

    if (this.orderId) {
      if (this.type === 'design') {
        this.designService.getById(this.orderId).subscribe((res: any) => {
          if (res.success) this.price = res.data.price_calculated;
        });
      }
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  processPayment() {
    if (!this.orderId || !this.selectedFile) return;
    this.loading = true;
    this.error = '';

    const formData = new FormData();
    formData.append('payment_method', this.paymentForm.get('payment_method')?.value || '');
    formData.append('slip', this.selectedFile);

    if (this.type === 'design') {
      formData.append('design_id', this.orderId);
    } else {
      formData.append('order_id', this.orderId);
    }

    this.paymentService.create(formData).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.notificationService.success('Payment slip submitted successfully! We will verify it shortly.');
          this.router.navigate(['/my-orders']);
        }
      },
      error: (err: any) => {
        this.error = err.error?.message || 'Payment failed';
        this.loading = false;
      }
    });
  }
}
