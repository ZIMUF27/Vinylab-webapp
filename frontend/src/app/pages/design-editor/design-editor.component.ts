import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TemplateService } from '../../services/template.service';
import { DesignService } from '../../services/design.service';

@Component({
  selector: 'app-design-editor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen px-4 py-6 md:px-6 md:py-10 animate-in fade-in duration-500" *ngIf="template">

      <!-- Mobile: Header + Sidebar Toggle -->
      <div class="flex items-center justify-between mb-4 lg:hidden">
        <div>
          <h1 class="text-lg font-bold text-white">{{ template.name }}</h1>
          <p class="text-xs text-slate-400">{{ template.material_type }}</p>
        </div>
        <button
          (click)="sidebarOpen = !sidebarOpen"
          class="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600/80 hover:bg-indigo-500 text-white text-sm font-semibold transition-all duration-200 shadow-lg"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          {{ sidebarOpen ? 'Hide Settings' : 'Customize' }}
        </button>
      </div>

      <!-- Main Layout: 70% Content + 30% Sidebar -->
      <div class="flex flex-col lg:flex-row gap-6">

        <!-- ===== LEFT: Content Panel 70% ===== -->
        <div class="w-full lg:w-[70%] flex flex-col gap-6">

          <!-- Preview Canvas -->
          <div class="glass-card flex-grow min-h-[300px] md:min-h-[460px] flex items-center justify-center relative overflow-hidden bg-slate-900 border-2 border-slate-700/50">
            <!-- Grid background -->
            <div class="absolute inset-0 opacity-10 pointer-events-none"
                 style="background-image: radial-gradient(#fff 1px, transparent 1px); background-size: 20px 20px;"></div>

            <!-- Real-time Preview Sign -->
            <div
              class="relative flex items-center justify-center p-6 transition-all duration-300 shadow-2xl rounded"
              [style.backgroundColor]="designForm.get('color')?.value"
              [style.width]="previewWidth + 'px'"
              [style.height]="previewHeight + 'px'"
              [style.maxWidth]="'90%'"
              [style.maxHeight]="'80%'"
            >
              <span class="text-white font-bold text-center break-words mix-blend-difference"
                    [style.fontSize]="previewFontSize + 'px'">
                {{ designForm.get('text_content')?.value || 'YOUR TEXT' }}
              </span>

              <!-- Width indicator -->
              <div class="absolute -bottom-8 left-0 right-0 text-center text-indigo-400 text-xs font-mono">
                &#8596; {{ designForm.get('width')?.value }}cm
              </div>
              <!-- Height indicator -->
              <div class="absolute -right-10 top-0 bottom-0 flex items-center">
                <span class="text-indigo-400 text-xs font-mono" style="writing-mode: vertical-rl; transform: rotate(180deg);">
                  &#8597; {{ designForm.get('height')?.value }}cm
                </span>
              </div>
            </div>
          </div>

          <!-- Price Bar -->
          <div class="glass-card !py-5 !px-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <p class="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Estimated Price</p>
              <p class="text-3xl md:text-4xl font-black text-indigo-400">฿{{ calculatePrice() | number:'1.2-2' }}</p>
            </div>
            <div class="text-left sm:text-right space-y-1">
              <p class="text-slate-500 text-xs">Base rate: <span class="text-slate-300">{{ template.base_price }}/cm²</span></p>
              <p class="text-slate-500 text-xs">Material: <span class="text-slate-300">{{ template.material_type }}</span></p>
              <p class="text-slate-500 text-xs">Area: <span class="text-slate-300">{{ designForm.get('width')?.value }} × {{ designForm.get('height')?.value }} cm</span></p>
            </div>
          </div>
        </div>

        <!-- ===== RIGHT: Sidebar 30% ===== -->
        <!-- Desktop: always visible | Mobile: toggleable -->
        <div class="w-full lg:w-[30%] lg:shrink-0"
             [class.hidden]="!sidebarOpen"
             [class.lg:block]="true">
          <div class="glass-card !p-6 lg:sticky lg:top-6">

            <!-- Sidebar Header (desktop only) -->
            <div class="hidden lg:block mb-6">
              <h2 class="text-xl font-bold">Personalize Sign</h2>
              <p class="text-slate-400 text-xs mt-1">{{ template.name }}</p>
            </div>

            <form [formGroup]="designForm" class="space-y-5">

              <!-- Width -->
              <div class="space-y-2">
                <label class="text-sm font-medium text-slate-300 flex justify-between items-center">
                  <span>Width (cm)</span>
                  <span class="text-indigo-400 text-xs bg-indigo-500/10 px-2 py-0.5 rounded-full">
                    {{ template.min_width }}–{{ template.max_width }}
                  </span>
                </label>
                <input type="number" formControlName="width" class="form-input"
                       [min]="template.min_width" [max]="template.max_width">
                <input type="range" formControlName="width"
                       [min]="template.min_width" [max]="template.max_width" step="1"
                       class="w-full accent-indigo-500 cursor-pointer">
              </div>

              <!-- Height -->
              <div class="space-y-2">
                <label class="text-sm font-medium text-slate-300 flex justify-between items-center">
                  <span>Height (cm)</span>
                  <span class="text-indigo-400 text-xs bg-indigo-500/10 px-2 py-0.5 rounded-full">
                    {{ template.min_height }}–{{ template.max_height }}
                  </span>
                </label>
                <input type="number" formControlName="height" class="form-input"
                       [min]="template.min_height" [max]="template.max_height">
                <input type="range" formControlName="height"
                       [min]="template.min_height" [max]="template.max_height" step="1"
                       class="w-full accent-indigo-500 cursor-pointer">
              </div>

              <!-- Color -->
              <div class="space-y-2">
                <label class="text-sm font-medium text-slate-300">Background Color</label>
                <div class="flex gap-3 items-center p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <input type="color" formControlName="color"
                         class="w-14 h-14 bg-transparent border-0 cursor-pointer p-0 rounded-lg">
                  <div>
                    <p class="text-xs font-mono text-slate-300">{{ designForm.get('color')?.value }}</p>
                    <p class="text-xs text-slate-500 mt-1">Click to pick color</p>
                  </div>
                </div>
              </div>

              <!-- Text Content -->
              <div class="space-y-2">
                <label class="text-sm font-medium text-slate-300">Sign Text</label>
                <textarea formControlName="text_content"
                          class="form-input !h-28 resize-none"
                          placeholder="Type your sign text..."></textarea>
              </div>

              <!-- Submit -->
              <div class="pt-2">
                <button
                  type="button"
                  (click)="saveDesign()"
                  class="btn btn-primary w-full py-4 text-base font-bold"
                  [disabled]="designForm.invalid || loading"
                >
                  <span *ngIf="!loading" class="flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Finish &amp; Order
                  </span>
                  <span *ngIf="loading" class="flex items-center justify-center gap-2">
                    <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                </button>
              </div>

              <div class="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs" *ngIf="error">
                {{ error }}
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>

    <!-- Loading state -->
    <div *ngIf="!template" class="max-w-7xl mx-auto px-6 py-20 flex items-center justify-center">
      <div class="text-center">
        <svg class="animate-spin h-10 w-10 text-indigo-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-slate-400">Loading template...</p>
      </div>
    </div>
  `
})
export class DesignEditorComponent implements OnInit {
  fb = inject(FormBuilder);
  route = inject(ActivatedRoute);
  router = inject(Router);
  templateService = inject(TemplateService);
  designService = inject(DesignService);

  template: any;
  loading = false;
  error = '';
  sidebarOpen = true;
  designForm!: FormGroup;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.templateService.getById(id).subscribe(res => {
        if (res.success) {
          this.template = res.data;
          this.initForm();
        }
      });
    }
  }

  initForm() {
    this.designForm = this.fb.group({
      width: [this.template.min_width, [Validators.required, Validators.min(this.template.min_width), Validators.max(this.template.max_width)]],
      height: [this.template.min_height, [Validators.required, Validators.min(this.template.min_height), Validators.max(this.template.max_height)]],
      color: ['#6366f1'],
      text_content: ['Your Content Here', Validators.required]
    });
  }

  /** Scale preview box proportionally to fit canvas */
  get previewWidth(): number {
    const w = this.designForm?.get('width')?.value || 1;
    const h = this.designForm?.get('height')?.value || 1;
    const maxPx = 360;
    return w >= h ? maxPx : maxPx * (w / h);
  }

  get previewHeight(): number {
    const w = this.designForm?.get('width')?.value || 1;
    const h = this.designForm?.get('height')?.value || 1;
    const maxPx = 360;
    return h >= w ? maxPx : maxPx * (h / w);
  }

  get previewFontSize(): number {
    return Math.max(12, Math.min(this.previewWidth, this.previewHeight) * 0.15);
  }

  calculatePrice() {
    if (!this.template || !this.designForm) return 0;
    const { width, height } = this.designForm.value;
    return (width || 0) * (height || 0) * this.template.base_price;
  }

  saveDesign() {
    if (this.designForm.invalid) return;
    this.loading = true;
    this.error = '';

    const payload = {
      template_id: this.template.id,
      ...this.designForm.value
    };

    this.designService.create(payload).subscribe({
      next: (res) => {
        if (res.success) {
          this.router.navigate(['/order-confirm', res.data.id]);
        }
      },
      error: (err) => {
        if (err.status === 401) {
          this.error = 'Session expired. Please login again.';
        } else if (err.status === 403) {
          this.error = 'Access denied. Invalid credentials.';
        } else {
          this.error = err.error?.message || 'Failed to save design. Please try again.';
        }
        this.loading = false;
      }
    });
  }
}
