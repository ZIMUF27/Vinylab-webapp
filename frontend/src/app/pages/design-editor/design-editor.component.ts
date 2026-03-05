import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TemplateService } from '../../services/template.service';
import { DesignService } from '../../services/design.service';
import { UploadService } from '../../services/upload.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-design-editor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen px-4 py-6 md:px-6 md:py-10 animate-in fade-in duration-500" *ngIf="template">

      <!-- Mobile: Header + Sidebar Toggle -->
      <div class="flex items-center justify-between mb-4 lg:hidden">
        <div>
          <h1 class="text-lg font-black text-v-dark dark:text-white">{{ template.name }}</h1>
          <p class="text-xs text-v-muted dark:text-slate-400 font-bold">{{ template.material_type }}</p>
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
              class="relative flex flex-col items-center justify-center p-6 transition-all duration-300 shadow-2xl rounded overflow-hidden"
              [style.backgroundColor]="designForm.get('color')?.value"
              [style.width]="previewWidth + 'px'"
              [style.height]="previewHeight + 'px'"
              [style.maxWidth]="'90%'"
              [style.maxHeight]="'80%'"
            >
              <!-- Uploaded Image Preview -->
              <img *ngIf="designForm.get('design_file')?.value" 
                   [src]="getFullUrl(designForm.get('design_file')?.value)"
                   class="absolute inset-0 w-full h-full object-cover">

              <span *ngIf="showText" class="relative z-10 text-white font-bold text-center break-words drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                    [style.fontSize]="previewFontSize + 'px'">
                {{ designForm.get('text_content')?.value || 'YOUR TEXT' }}
              </span>

              <!-- Width indicator -->
              <div class="absolute -bottom-8 left-0 right-0 text-center text-v-muted dark:text-indigo-400 text-xs font-black">
                &#8596; {{ designForm.get('width')?.value }}cm
              </div>
              <!-- Height indicator -->
              <div class="absolute -right-10 top-0 bottom-0 flex items-center">
                <span class="text-v-muted dark:text-indigo-400 text-xs font-black" style="writing-mode: vertical-rl; transform: rotate(180deg);">
                  &#8597; {{ designForm.get('height')?.value }}cm
                </span>
              </div>
            </div>
          </div>

          <!-- Price Bar -->
          <div class="glass-card !py-5 !px-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <p class="text-v-muted dark:text-slate-400 text-xs font-black uppercase tracking-widest mb-1">Estimated Price</p>
              <p class="text-3xl md:text-4xl font-black text-amount-green">฿{{ calculatePrice() | number:'1.2-2' }}</p>
            </div>
            <div class="text-left sm:text-right space-y-1">
              <p class="text-v-muted dark:text-slate-500 text-xs font-bold">Base rate: <span class="text-v-secondary dark:text-slate-300">{{ template.base_price }}/cm²</span></p>
              <p class="text-v-muted dark:text-slate-500 text-xs font-bold">Material: <span class="text-v-secondary dark:text-slate-300">{{ template.material_type }}</span></p>
              <p class="text-v-muted dark:text-slate-500 text-xs font-bold">Area: <span class="text-v-secondary dark:text-slate-300">{{ designForm.get('width')?.value }} × {{ designForm.get('height')?.value }} cm</span></p>
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
            <div class="hidden lg:block mb-6 text-v-dark dark:text-white">
              <h2 class="text-xl font-black">Personalize Sign</h2>
              <p class="text-v-muted dark:text-slate-400 text-xs mt-1 font-bold">{{ template.name }}</p>
            </div>

            <form [formGroup]="designForm" class="space-y-5">

              <!-- Width -->
              <div class="space-y-2">
                <label class="text-sm font-black text-v-muted dark:text-slate-300 flex justify-between items-center">
                  <span>Width (cm)</span>
                  <span class="text-v-secondary dark:text-indigo-400 text-xs bg-indigo-500/10 px-2 py-0.5 rounded-full font-black">
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
                <label class="text-sm font-black text-v-muted dark:text-slate-300 flex justify-between items-center">
                  <span>Height (cm)</span>
                  <span class="text-v-secondary dark:text-indigo-400 text-xs bg-indigo-500/10 px-2 py-0.5 rounded-full font-black">
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
                <label class="text-sm font-black text-v-muted dark:text-slate-300">Background Color</label>
                <div class="flex gap-3 items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/50 text-v-secondary dark:text-white">
                  <input type="color" formControlName="color"
                         class="w-14 h-14 bg-transparent border-0 cursor-pointer p-0 rounded-lg">
                  <div>
                    <p class="text-xs font-black font-mono text-v-secondary dark:text-slate-300">{{ designForm.get('color')?.value }}</p>
                    <p class="text-xs text-v-muted dark:text-slate-500 mt-1 font-bold">Click to pick color</p>
                  </div>
                </div>
              </div>

              <!-- Image Upload -->
              <div class="space-y-2">
                <label class="text-sm font-black text-v-muted dark:text-slate-300">Background Image (Optional)</label>
                <div class="flex flex-col gap-3">
                  <input type="file" (change)="onFileSelected($event)" accept="image/*" class="hidden" #fileInput>
                  <button type="button" (click)="fileInput.click()" class="btn btn-outline py-3 text-xs w-full flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    {{ designForm.get('design_file')?.value ? 'Change Image' : 'Upload Image (PNG/JPG)' }}
                  </button>
                  <div *ngIf="uploading" class="text-xs text-indigo-500 font-bold animate-pulse">Uploading image...</div>
                  <div *ngIf="designForm.get('design_file')?.value" class="flex items-center justify-between p-2 bg-indigo-500/10 rounded-lg">
                    <span class="text-[10px] text-indigo-400 font-bold truncate max-w-[150px]">Image Uploaded</span>
                    <button type="button" (click)="removeImage()" class="text-red-400 hover:text-red-500">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Text Content -->
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <label class="text-sm font-black text-v-muted dark:text-slate-300">Sign Text</label>
                  <button type="button" 
                          (click)="toggleText()"
                          class="flex items-center gap-2 px-3 py-1 rounded-lg text-[10px] font-black uppercase transition-all"
                          [class.bg-indigo-500/20]="showText"
                          [class.text-indigo-400]="showText"
                          [class.bg-slate-500/20]="!showText"
                          [class.text-slate-400]="!showText">
                    <div class="w-2 h-2 rounded-full" [class.bg-indigo-500]="showText" [class.bg-slate-500]="!showText"></div>
                    {{ showText ? 'Text Enabled' : 'Text Disabled' }}
                  </button>
                </div>
                
                <textarea *ngIf="showText"
                          formControlName="text_content"
                          class="form-input !h-28 resize-none text-v-secondary dark:text-white animate-in slide-in-from-top-2"
                          placeholder="Type your sign text..."></textarea>
                
                <div *ngIf="!showText" class="p-4 bg-slate-100 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-center">
                  <p class="text-[10px] text-v-muted font-bold uppercase italic">No text will be printed on this sign</p>
                </div>
              </div>

              <!-- Submit -->
              <div class="pt-2">
                <button
                  type="button"
                  (click)="saveDesign()"
                  class="btn btn-primary w-full py-4 text-base font-bold"
                  [disabled]="designForm.invalid || loading"
                >
                  <span *ngIf="!loading && !uploading" class="flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Finish &amp; Order
                  </span>
                  <span *ngIf="loading || uploading" class="flex items-center justify-center gap-2">
                    <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {{ uploading ? 'Uploading...' : 'Processing...' }}
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
  uploadService = inject(UploadService);

  template: any;
  loading = false;
  uploading = false;
  showText = true;
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
      text_content: ['Your Content Here'],
      design_file: [null]
    });
  }

  toggleText() {
    this.showText = !this.showText;
    if (!this.showText) {
      this.designForm.patchValue({ text_content: '' });
    } else {
      this.designForm.patchValue({ text_content: 'Your Content Here' });
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.uploading = true;
    this.error = '';

    this.uploadService.upload(file).subscribe({
      next: (res) => {
        if (res.success) {
          this.designForm.patchValue({ design_file: res.filePath });
        }
        this.uploading = false;
      },
      error: (err) => {
        console.error('Upload error:', err);
        this.error = err.message || 'Failed to upload image. Please check Supabase Storage settings.';
        this.uploading = false;
      }
    });
  }

  removeImage() {
    this.designForm.patchValue({ design_file: null });
  }

  getFullUrl(path: string): string {
    if (!path) return '';
    // If it's already a full URL (Supabase Public URL), return it
    if (path.startsWith('http')) return path;

    // Legacy support for local uploads (if any)
    if (path.startsWith('/uploads')) {
      return `${environment.apiUrl.replace('/api', '')}${path}`;
    }
    return path;
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
      ...this.designForm.value,
      price_calculated: this.calculatePrice() // Important: Supabase needs this field
    };

    // Simulate network delay for premium feel
    setTimeout(() => {
      this.designService.create(payload).subscribe({
        next: (res) => {
          if (res.success) {
            this.router.navigate(['/order-confirm', res.data.id]);
          }
        },
        error: (err) => {
          console.error('Save design error:', err);
          if (err.status === 401) {
            this.error = 'Session expired. Please login again.';
          } else if (err.status === 403) {
            this.error = 'Access denied. Please check RLS Policies in Supabase.';
          } else {
            this.error = err.message || err.error?.message || 'Failed to save design. Please double check if "Design" table exists.';
          }
          this.loading = false;
        }
      });
    }, 1500);
  }
}
