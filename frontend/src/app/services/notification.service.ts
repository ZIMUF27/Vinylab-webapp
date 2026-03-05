import { Injectable, signal } from '@angular/core';

export interface Toast {
    id: number;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    duration?: number;
}

export interface ConfirmOptions {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'info' | 'warning';
}

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    toasts = signal<Toast[]>([]);
    private counter = 0;

    // Confirmation state
    confirmState = signal<{
        open: boolean;
        options: ConfirmOptions | null;
        resolve: ((value: boolean) => void) | null;
    }>({
        open: false,
        options: null,
        resolve: null
    });

    show(message: string, type: Toast['type'] = 'info', duration: number = 4000) {
        const id = this.counter++;
        const toast: Toast = { id, message, type, duration };
        this.toasts.update(t => [...t, toast]);

        if (duration > 0) {
            setTimeout(() => this.remove(id), duration);
        }
    }

    success(message: string) { this.show(message, 'success'); }
    error(message: string) { this.show(message, 'error'); }
    info(message: string) { this.show(message, 'info'); }
    warning(message: string) { this.show(message, 'warning'); }

    remove(id: number) {
        this.toasts.update(t => t.filter(toast => toast.id !== id));
    }

    confirm(options: ConfirmOptions): Promise<boolean> {
        return new Promise((resolve) => {
            this.confirmState.set({
                open: true,
                options,
                resolve
            });
        });
    }

    handleConfirm(value: boolean) {
        const state = this.confirmState();
        if (state.resolve) {
            state.resolve(value);
        }
        this.confirmState.set({ open: false, options: null, resolve: null });
    }
}
