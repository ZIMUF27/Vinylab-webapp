import { Injectable, signal, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'dark' | 'light';

@Injectable({ providedIn: 'root' })
export class ThemeService {
    private platformId = inject(PLATFORM_ID);
    theme = signal<Theme>('dark');

    constructor() {
        if (isPlatformBrowser(this.platformId)) {
            const saved = localStorage.getItem('vl-theme') as Theme | null;
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            this.theme.set(saved ?? (prefersDark ? 'dark' : 'light'));
        }

        effect(() => {
            const t = this.theme();
            if (isPlatformBrowser(this.platformId)) {
                document.documentElement.setAttribute('data-theme', t);
                document.documentElement.classList.toggle('dark', t === 'dark');
                localStorage.setItem('vl-theme', t);
            }
        });
    }

    toggle() {
        this.theme.update(t => (t === 'dark' ? 'light' : 'dark'));
    }

    isDark() {
        return this.theme() === 'dark';
    }
}
