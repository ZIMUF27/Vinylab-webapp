import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplateService } from '../../services/template.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-templates',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="max-w-7xl mx-auto px-6 py-12">
      <div class="mb-12">
        <h1 class="section-title mb-4">Design Templates</h1>
        <p class="text-v-secondary dark:text-slate-400 max-w-2xl font-bold">Select a base template for your custom sign. Every template specifies width/height constraints and material quality.</p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" *ngIf="!loading(); else skeleton">
        <ng-container *ngIf="templates().length > 0">
          <div *ngFor="let template of templates()" class="glass-card group hover:border-indigo-500/50 transition-all duration-300 flex flex-col h-full">
            <!-- Card Header & Body -->
            <div class="flex-grow">
              <div class="flex justify-between items-start mb-6">
                <span class="px-3 py-1 bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 text-xs font-bold rounded-full uppercase tracking-wider">
                  {{ template.material_type }}
                </span>
                <div class="text-indigo-400">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                </div>
              </div>

              <h3 class="text-xl font-black mb-3 text-v-dark dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{{ template.name }}</h3>
              
              <div class="space-y-3 mb-8">
                <div class="flex items-center text-sm">
                  <span class="w-32 font-black text-v-muted dark:text-slate-400">Width Range:</span>
                  <span class="text-v-secondary dark:text-slate-200 font-black">{{ template.min_width }}cm - {{ template.max_width }}cm</span>
                </div>
                <div class="flex items-center text-sm">
                  <span class="w-32 font-black text-v-muted dark:text-slate-400">Height Range:</span>
                  <span class="text-v-secondary dark:text-slate-200 font-black">{{ template.min_height }}cm - {{ template.max_height }}cm</span>
                </div>
              </div>
            </div>

            <!-- Price & CTA -->
            <div class="pt-6 border-t border-slate-700/50">
              <div class="flex justify-between items-center mb-6">
                   <div>
                    <p class="text-xs text-v-muted dark:text-slate-500 uppercase font-black tracking-widest mb-1">Base Price</p>
                    <p class="text-2xl font-black text-amount-green font-mono">฿{{ template.base_price }}<span class="text-sm font-normal text-v-muted dark:text-slate-500">/sq.unit</span></p>
                  </div>
              </div>
              <a [routerLink]="['/design', template.id]" class="btn btn-primary w-full py-4 group-hover:scale-[1.02]">
                Select & Design
              </a>
            </div>
          </div>
        </ng-container>
      </div>

      <ng-template #skeleton>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div *ngFor="let i of [1,2,3]" class="glass-card h-[400px] animate-pulse bg-slate-800/30"></div>
        </div>
      </ng-template>
    </div>
  `
})
export class TemplatesComponent implements OnInit {
  private templateService = inject(TemplateService);
  templates = signal<any[]>([]);
  loading = signal(true);

  ngOnInit() {
    this.templateService.getAll().subscribe({
      next: (res) => {
        if (res.success) this.templates.set(res.data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error fetching templates:', err);
        this.loading.set(false);
      }
    });
  }
}
