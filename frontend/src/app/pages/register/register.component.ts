import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center p-6 bg-transparent">
      <div class="glass-card w-full max-w-lg shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div class="text-center mb-10">
          <h2 class="section-title text-v-dark dark:text-white mb-2">Create Account</h2>
          <p class="text-v-secondary dark:text-slate-400 font-bold">Join VinylLab ecosystem today</p>
        </div>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-5">
          <div class="space-y-2">
            <label class="text-sm font-black text-v-muted dark:text-slate-300">Full Name</label>
            <input type="text" formControlName="name" class="form-input text-v-secondary dark:text-white" placeholder="John Doe">
            <div *ngIf="f['name'].touched && f['name'].invalid" class="text-red-500 dark:text-red-400 text-xs italic font-bold pl-1">Name is required</div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div class="space-y-2">
              <label class="text-sm font-black text-v-muted dark:text-slate-300">Email Address</label>
              <input type="email" formControlName="email" class="form-input text-v-secondary dark:text-white" placeholder="john@example.com">
              <div *ngIf="f['email'].touched && f['email'].invalid" class="text-red-500 dark:text-red-400 text-xs italic font-bold pl-1">Valid email is required</div>
            </div>
            <div class="space-y-2">
              <label class="text-sm font-black text-v-muted dark:text-slate-300">Phone (Optional)</label>
              <input type="text" formControlName="phone" class="form-input text-v-secondary dark:text-white" placeholder="081XXXXXXX">
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-black text-v-muted dark:text-slate-300">Password</label>
            <input type="password" formControlName="password" class="form-input text-v-secondary dark:text-white" placeholder="••••••••">
            <div *ngIf="f['password'].touched && f['password'].invalid" class="text-red-500 dark:text-red-400 text-xs italic font-bold pl-1">Min 6 characters required</div>
          </div>

          <button type="submit" class="btn btn-primary w-full py-4 mt-4" [disabled]="registerForm.invalid || loading">
            <span *ngIf="!loading">Create Account</span>
            <span *ngIf="loading">Creating...</span>
          </button>
          
          <div class="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center" *ngIf="error">
            {{ error }}
          </div>
          
          <p class="text-center text-v-muted dark:text-slate-400 text-sm font-bold">
            Already have an account? 
            <a routerLink="/login" class="text-indigo-700 dark:text-indigo-400 font-black hover:underline">Log in</a>
          </p>
        </form>
      </div>
    </div>
  `
})
export class RegisterComponent {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);

  loading = false;
  error = '';

  registerForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  get f() { return this.registerForm.controls; }

  onSubmit() {
    if (this.registerForm.invalid) return;
    this.loading = true;
    this.error = '';

    this.authService.register(this.registerForm.value).subscribe({
      next: () => this.router.navigate(['/login']),
      error: (err) => {
        this.error = err.message || 'Registration failed';
        this.loading = false;
      }
    });
  }
}
