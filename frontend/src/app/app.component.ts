import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ToastContainerComponent } from './components/ui/toast-container.component';
import { ConfirmModalComponent } from './components/ui/confirm-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, ToastContainerComponent, ConfirmModalComponent],
  template: `
    <app-navbar></app-navbar>

    <div class="page-wrapper">
      <router-outlet></router-outlet>
    </div>

    <app-toast-container></app-toast-container>
    <app-confirm-modal></app-confirm-modal>

    <footer class="site-footer">
      <p class="text-slate-800 dark:text-slate-400 font-bold">
        &copy; 2025 <strong class="text-indigo-700 dark:text-indigo-400">VinylLab</strong> — Online Sign Design &amp; Printing System
        <span class="mx-2 opacity-30 dark:opacity-10">|</span>
        Built with <span class="text-pink-600 dark:text-pink-400">&#10084;</span> for Bold Brands
      </p>
    </footer>
  `
})
export class AppComponent { }
