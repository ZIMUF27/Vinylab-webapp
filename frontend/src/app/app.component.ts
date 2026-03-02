import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <app-navbar></app-navbar>

    <div class="page-wrapper">
      <router-outlet></router-outlet>
    </div>

    <footer class="site-footer">
      <p>
        &copy; 2025 <strong style="color:#818cf8;">VinylLab</strong> — Online Sign Design &amp; Printing System
        <span style="margin:0 0.5rem;opacity:0.3;">|</span>
        Built with &#10084; for Bold Brands
      </p>
    </footer>
  `
})
export class AppComponent { }
