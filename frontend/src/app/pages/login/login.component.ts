import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center p-6 bg-transparent">
      <div class="glass-card w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700 shadow-2xl">
        <div class="text-center mb-10">
          <h2 class="section-title text-v-dark dark:text-white mb-2">Welcome Back</h2>
          <p class="text-v-secondary dark:text-slate-400 font-bold">Login to manage your sign designs</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <div class="space-y-2">
            <label class="text-sm font-black text-v-muted dark:text-slate-300">Email Address</label>
            <input type="email" formControlName="email" class="form-input text-v-secondary dark:text-white" placeholder="name@company.com">
            <div *ngIf="f['email'].touched && f['email'].invalid" class="text-red-500 dark:text-red-400 text-xs font-bold">
              Please enter a valid email
            </div>
          </div>

          <div class="space-y-2">
            <div class="flex justify-between">
              <label class="text-sm font-black text-v-muted dark:text-slate-300">Password</label>
              <a href="#" class="text-xs text-indigo-700 dark:text-indigo-400 hover:text-indigo-300 font-bold">Forgot password?</a>
            </div>
            <input type="password" formControlName="password" class="form-input text-v-secondary dark:text-white" placeholder="••••••••">
          </div>

          <button type="submit" class="btn btn-primary w-full py-4 mt-4" [disabled]="loginForm.invalid || loading">
            <span *ngIf="!loading">Sign In</span>
            <span *ngIf="loading" class="flex items-center gap-2">
              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              Authenticating...
            </span>
          </button>
          
          <div class="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center" *ngIf="error">
            {{ error }}
          </div>
          
          <p class="text-center text-v-muted dark:text-slate-400 text-sm font-bold">
            Don't have an account? 
            <a routerLink="/register" [style.color]="'#ec4899'" class="font-black hover:underline transition-colors">Create one here</a>
          </p>
        </form>
      </div>
    </div>
  `
})
export class LoginComponent {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);

  loading = false;
  error = '';

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  get f() { return this.loginForm.controls; }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.error = '';

    // Simulate network delay for premium feel
    setTimeout(() => {
      this.authService.login(this.loginForm.value).subscribe({
        next: () => this.router.navigate(['/']),
        error: (err) => {
          this.error = err.message || 'Login failed. Please check your credentials.';
          this.loading = false;
        }
      });
    }, 1500);
  }
}
