import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `

    <!-- ===== HERO ===== -->
    <section style="
      position:relative;
      overflow:hidden;
      padding: 6rem 0 8rem;
      background: linear-gradient(180deg, rgba(99,102,241,0.06) 0%, transparent 60%);
    ">
      <!-- Glow orbs -->
      <div style="
        position:absolute;top:-100px;right:-100px;
        width:600px;height:600px;border-radius:9999px;
        background:radial-gradient(circle,rgba(99,102,241,0.18) 0%,transparent 70%);
        filter:blur(40px);pointer-events:none;
      "></div>
      <div style="
        position:absolute;bottom:-100px;left:-100px;
        width:500px;height:500px;border-radius:9999px;
        background:radial-gradient(circle,rgba(236,72,153,0.10) 0%,transparent 70%);
        filter:blur(40px);pointer-events:none;
      "></div>

      <div class="page-container" style="position:relative;z-index:1;">
        <div style="display:flex;flex-direction:column;align-items:center;gap:3rem;">

          <!-- Badge -->
          <div class="animate-fade-up">
            <span class="badge badge-indigo" style="font-size:0.75rem;gap:0.5rem;">
              <span style="width:6px;height:6px;border-radius:9999px;background:#818cf8;display:inline-block;"></span>
              Professional Vinyl Sign Platform
            </span>
          </div>

          <!-- Headline -->
          <div class="animate-fade-up delay-100" style="text-align:center;max-width:820px;">
            <h1 class="text-v-dark" style="font-size:clamp(2.75rem,8vw,5.5rem);font-weight:900;line-height:1.05;letter-spacing:-0.03em;margin-bottom:1.5rem;">
              Design
              <span class="gradient-text-primary"> Signs</span><br>
              <span class="gradient-text-pink" style="font-style:italic;">That Speak.</span>
            </h1>
            <p class="text-v-secondary dark:text-slate-400 font-bold" style="font-size:1.2rem;line-height:1.7;max-width:560px;margin:0 auto 2.5rem;">
              Premium custom banners, decals, and signage for bold brands.
              Start your design in seconds with our real-time editor.
            </p>

            <!-- CTAs -->
            <div style="display:flex;flex-wrap:wrap;gap:1rem;justify-content:center;">
              <a routerLink="/templates" class="btn btn-primary" style="padding:0.875rem 2.25rem;font-size:1rem;">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                Start First Project
              </a>
              <a routerLink="/register" class="btn btn-outline" style="padding:0.875rem 2.25rem;font-size:1rem;">
                Create Business Account
              </a>
            </div>
          </div>

          <!-- Stats Row -->
          <div class="animate-fade-up delay-200" style="display:flex;flex-wrap:wrap;gap:1.5rem;justify-content:center;margin-top:1rem;">
            <div style="text-align:center;padding:1rem 2rem;border-right:1px solid var(--border-subtle);">
              <div class="gradient-text-primary" style="font-size:1.75rem;font-weight:900;">500+</div>
              <div class="text-v-muted dark:text-slate-500" style="font-size:0.8rem;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;">Templates</div>
            </div>
            <div style="text-align:center;padding:1rem 2rem;border-right:1px solid var(--border-subtle);">
              <div class="gradient-text-primary" style="font-size:1.75rem;font-weight:900;">10k+</div>
              <div class="text-v-muted dark:text-slate-500" style="font-size:0.8rem;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;">Orders Fulfilled</div>
            </div>
            <div style="text-align:center;padding:1rem 2rem;">
              <div class="gradient-text-primary" style="font-size:1.75rem;font-weight:900;">99%</div>
              <div class="text-v-muted dark:text-slate-500" style="font-size:0.8rem;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;">Satisfaction</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== FEATURES ===== -->
    <section style="padding:6rem 0;">
      <div class="page-container">
        <div style="text-align:center;margin-bottom:4rem;">
          <h2 class="section-title text-v-dark" style="margin-bottom:1rem;">The VinylLab Standard</h2>
          <p class="text-v-muted dark:text-slate-500" style="max-width:560px;margin:0 auto;line-height:1.7;font-weight:800;text-transform:uppercase;letter-spacing:0.05em;">
            Premium Printing. Simplified Workflow. Professional Results.
          </p>
        </div>

        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.5rem;">

          <!-- Feature 1 -->
          <div class="glass-card animate-fade-up" style="padding:2.5rem;">
            <div style="
              width:3.25rem;height:3.25rem;border-radius:1rem;
              background:rgba(99,102,241,0.12);
              border:1px solid rgba(99,102,241,0.2);
              display:flex;align-items:center;justify-content:center;
              margin-bottom:1.5rem;
            ">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#818cf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
              </svg>
            </div>
            <h3 class="text-v-dark dark:text-slate-100" style="font-size:1.15rem;font-weight:900;margin-bottom:0.75rem;">Real-time Customizer</h3>
            <p class="text-v-secondary dark:text-slate-400 font-bold" style="font-size:0.9rem;line-height:1.7;">
              Adjust dimensions, colors, and text while instantly seeing your final product and dynamic pricing.
            </p>
          </div>

          <!-- Feature 2 -->
          <div class="glass-card animate-fade-up delay-100" style="padding:2.5rem;">
            <div style="
              width:3.25rem;height:3.25rem;border-radius:1rem;
              background:rgba(236,72,153,0.12);
              border:1px solid rgba(236,72,153,0.2);
              display:flex;align-items:center;justify-content:center;
              margin-bottom:1.5rem;
            ">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f472b6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <h3 class="text-v-dark dark:text-slate-100" style="font-size:1.15rem;font-weight:900;margin-bottom:0.75rem;">Enterprise Security</h3>
            <p class="text-v-secondary dark:text-slate-400 font-bold" style="font-size:0.9rem;line-height:1.7;">
              Full JWT authentication and role-based access control. Your designs and data are always protected.
            </p>
          </div>

          <!-- Feature 3 -->
          <div class="glass-card animate-fade-up delay-200" style="padding:2.5rem;">
            <div style="
              width:3.25rem;height:3.25rem;border-radius:1rem;
              background:rgba(34,211,238,0.12);
              border:1px solid rgba(34,211,238,0.2);
              display:flex;align-items:center;justify-content:center;
              margin-bottom:1.5rem;
            ">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#67e8f9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
            </div>
            <h3 class="text-v-dark dark:text-slate-100" style="font-size:1.15rem;font-weight:900;margin-bottom:0.75rem;">Extreme Performance</h3>
            <p class="text-v-secondary dark:text-slate-400 font-bold" style="font-size:0.9rem;line-height:1.7;">
              Optimized printing queue and fulfillment system designed for high-concurrency order management.
            </p>
          </div>

        </div>
      </div>
    </section>

    <!-- ===== MATERIALS / CTA ===== -->
    <section style="padding:4rem 0 7rem;">
      <div class="page-container">
        <div class="glass-card" style="
          padding:4rem 3rem;
          text-align:center;
          background: linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(236,72,153,0.08) 100%);
          border-color: rgba(99,102,241,0.2);
          position:relative;overflow:hidden;
        ">
          <div style="
            position:absolute;top:-60px;right:-60px;
            width:300px;height:300px;border-radius:9999px;
            background:radial-gradient(circle,rgba(99,102,241,0.15) 0%,transparent 70%);
            filter:blur(30px);pointer-events:none;
          "></div>

          <div class="badge badge-pink" style="margin-bottom:1.5rem;">
            ✦ New Material Available
          </div>
          <h2 class="text-v-dark" style="font-size:clamp(1.75rem,4vw,2.75rem);font-weight:900;letter-spacing:-0.02em;margin-bottom:1rem;">
            Now printing on Premium <span class="gradient-text-primary">PVC Vinyl</span>
          </h2>
          <p class="text-v-secondary dark:text-slate-400 font-black" style="max-width:520px;margin:0 auto 2.5rem;line-height:1.7;">
            Weather-resistant, vibrant colours, and long-lasting adhesive. Perfect for outdoor signs, vehicle wraps, and storefronts.
          </p>
          <a routerLink="/templates" class="btn btn-primary" style="padding:1rem 3rem;font-size:1rem;">
            Browse Templates →
          </a>
        </div>
      </div>
    </section>
  `
})
export class HomeComponent { }
