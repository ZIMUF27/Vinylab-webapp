import { Component, inject, signal, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  template: `
    <nav class="navbar">
      <div class="navbar-inner">

        <!-- Logo -->
        <a routerLink="/" class="navbar-logo">
          Vinyl<span class="text-v-muted dark:text-slate-400" style="font-weight:300;">Lab</span>
        </a>

        <!-- Desktop Links -->
        <ul class="navbar-links hidden md:flex">
          <li>
            <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}" class="navbar-link">
              Home
            </a>
          </li>
          <li>
            <a routerLink="/templates" routerLinkActive="active" class="navbar-link">
              Templates
            </a>
          </li>
          <ng-container *ngIf="authService.isLoggedIn()">
            <li>
              <a routerLink="/my-orders" routerLinkActive="active" class="navbar-link">
                My Orders
              </a>
            </li>
            <ng-container *ngIf="authService.hasRole(['admin','staff','dev'])">
              <li>
                <a routerLink="/backoffice" routerLinkActive="active" class="navbar-link navbar-link--admin">
                  Backoffice
                </a>
              </li>
            </ng-container>
          </ng-container>
        </ul>

        <!-- Desktop Actions -->
        <div class="navbar-actions hidden md:flex">

          <!-- ── Theme Toggle Button ── -->
          <button
            id="theme-toggle-btn"
            class="theme-toggle-btn"
            (click)="themeService.toggle()"
            [attr.aria-label]="themeService.isDark() ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
            [title]="themeService.isDark() ? 'Switch to Light Mode' : 'Switch to Dark Mode'">

            <!-- Sun Icon (show when dark mode → switch to light) -->
            <svg *ngIf="themeService.isDark()"
              class="theme-icon theme-icon--sun"
              viewBox="0 0 24 24" fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="4.5" stroke="currentColor" stroke-width="1.8"/>
              <line x1="12" y1="2"  x2="12" y2="5"  stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              <line x1="12" y1="19" x2="12" y2="22" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              <line x1="2"  y1="12" x2="5"  y2="12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              <line x1="19" y1="12" x2="22" y2="12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              <line x1="4.22"  y1="4.22"  x2="6.34"  y2="6.34"  stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              <line x1="4.22"  y1="19.78" x2="6.34"  y2="17.66" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              <line x1="17.66" y1="6.34"  x2="19.78" y2="4.22"  stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            </svg>

            <!-- Moon Icon (show when light mode → switch to dark) -->
            <svg *ngIf="!themeService.isDark()"
              class="theme-icon theme-icon--moon"
              viewBox="0 0 24 24" fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"
                stroke="currentColor" stroke-width="1.8"
                stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="17" cy="5"  r="0.75" fill="currentColor"/>
              <circle cx="20" cy="9"  r="0.5"  fill="currentColor"/>
              <circle cx="19" cy="3"  r="0.5"  fill="currentColor"/>
            </svg>
          </button>

          <ng-container *ngIf="authService.isLoggedIn(); else guestButtons">
            <span class="text-sm italic hidden lg:block text-v-secondary dark:text-slate-300">
              Hi, {{ authService.getUserName() }}
            </span>
            <div style="width:1px;height:24px;background:var(--nav-divider);" class="hidden lg:block"></div>
            <button (click)="showLogoutConfirm.set(true)" class="btn btn-outline" style="padding:0.5rem 1.25rem;font-size:0.8125rem;">
              Logout
            </button>
          </ng-container>

          <ng-template #guestButtons>
            <a routerLink="/login" class="btn btn-ghost" style="padding:0.5rem 1.25rem;font-size:0.875rem;">
              Login
            </a>
            <a routerLink="/register" class="btn btn-primary" style="padding:0.5rem 1.25rem;font-size:0.875rem;">
              Get Started
            </a>
          </ng-template>
        </div>

        <!-- Mobile Row: theme toggle + hamburger -->
        <div class="md:hidden flex items-center gap-2">
          <!-- Mobile Theme Toggle -->
          <button
            id="theme-toggle-btn-mobile"
            class="theme-toggle-btn"
            (click)="themeService.toggle()"
            [attr.aria-label]="themeService.isDark() ? 'Switch to Light Mode' : 'Switch to Dark Mode'">
            <svg *ngIf="themeService.isDark()"
              class="theme-icon theme-icon--sun"
              viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="4.5" stroke="currentColor" stroke-width="1.8"/>
              <line x1="12" y1="2"  x2="12" y2="5"  stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              <line x1="12" y1="19" x2="12" y2="22" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              <line x1="2"  y1="12" x2="5"  y2="12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              <line x1="19" y1="12" x2="22" y2="12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              <line x1="4.22"  y1="4.22"  x2="6.34"  y2="6.34"  stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              <line x1="4.22"  y1="19.78" x2="6.34"  y2="17.66" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              <line x1="17.66" y1="6.34"  x2="19.78" y2="4.22"  stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            </svg>
            <svg *ngIf="!themeService.isDark()"
              class="theme-icon theme-icon--moon"
              viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"
                stroke="currentColor" stroke-width="1.8"
                stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="17" cy="5"  r="0.75" fill="currentColor"/>
              <circle cx="20" cy="9"  r="0.5"  fill="currentColor"/>
              <circle cx="19" cy="3"  r="0.5"  fill="currentColor"/>
            </svg>
          </button>

          <!-- Hamburger -->
          <button class="flex flex-col gap-1.5 p-2 rounded-lg transition-colors bg-slate-100 dark:bg-white/5"
                  (click)="mobileOpen.set(!mobileOpen())">
            <span class="block w-5 h-0.5 bg-v-secondary transition-all" [class.rotate-45]="mobileOpen()" [class.translate-y-2]="mobileOpen()"></span>
            <span class="block w-5 h-0.5 bg-v-secondary transition-all" [class.opacity-0]="mobileOpen()"></span>
            <span class="block w-5 h-0.5 bg-v-secondary transition-all" [class.-rotate-45]="mobileOpen()" [class.-translate-y-2]="mobileOpen()"></span>
          </button>
        </div>
      </div>

      <!-- Mobile Drawer -->
      <div *ngIf="mobileOpen()" class="md:hidden px-4 pb-4 pt-2 flex flex-col gap-1"
           style="border-top:1px solid var(--nav-divider);margin-top:0.75rem;">
        <a routerLink="/" (click)="mobileOpen.set(false)" class="navbar-link block">Home</a>
        <a routerLink="/templates" (click)="mobileOpen.set(false)" class="navbar-link block">Templates</a>
        <ng-container *ngIf="authService.isLoggedIn()">
          <a routerLink="/my-orders" (click)="mobileOpen.set(false)" class="navbar-link block">My Orders</a>
          <ng-container *ngIf="authService.hasRole(['admin','staff','dev'])">
            <a routerLink="/backoffice" (click)="mobileOpen.set(false)" class="navbar-link block navbar-link--admin">Backoffice</a>
          </ng-container>
          <div class="divider"></div>
          <button (click)="showLogoutConfirm.set(true); mobileOpen.set(false)" class="btn btn-outline w-full mt-1">Logout</button>
        </ng-container>
        <ng-container *ngIf="!authService.isLoggedIn()">
          <div class="divider"></div>
          <a routerLink="/login" (click)="mobileOpen.set(false)" class="btn btn-outline w-full">Login</a>
          <a routerLink="/register" (click)="mobileOpen.set(false)" class="btn btn-primary w-full">Get Started</a>
        </ng-container>
      </div>
    </nav>

    <!-- LOGOUT CONFIRMATION MODAL -->
    <div *ngIf="showLogoutConfirm()" class="fixed inset-0 z-[200] flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div class="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" (click)="showLogoutConfirm.set(false)"></div>
      <div class="glass-card w-full max-w-sm relative z-10 animate-in zoom-in-95 duration-300 text-center space-y-6">
        <div class="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </div>
        <div>
          <h3 class="text-xl font-black text-v-dark dark:text-white mb-2">Logout Confirmation</h3>
          <p class="text-v-secondary dark:text-slate-400 text-sm font-bold">Are you sure you want to exit your safe session?</p>
        </div>
        <div class="flex gap-3">
          <button (click)="showLogoutConfirm.set(false)" class="btn btn-outline flex-grow">Cancel</button>
          <button (click)="authService.logout(); showLogoutConfirm.set(false)" class="btn btn-primary bg-red-500 hover:bg-red-600 border-none flex-grow">Logout</button>
        </div>
      </div>
    </div>
  `
})
export class NavbarComponent {
  authService = inject(AuthService);
  themeService = inject(ThemeService);
  mobileOpen = signal(false);
  showLogoutConfirm = signal(false);
}

