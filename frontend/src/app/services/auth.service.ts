import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@supabase/supabase-js';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SupabaseService } from './supabase.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    currentUser = signal<User | null>(null);

    constructor(
        private router: Router,
        private supabaseService: SupabaseService
    ) {
        // Check current session
        this.supabaseService.auth.getSession().then(({ data: { session } }) => {
            this.currentUser.set(session?.user ?? null);
        });

        // Listen for auth changes
        this.supabaseService.auth.onAuthStateChange((_event, session) => {
            this.currentUser.set(session?.user ?? null);
            if (!session) {
                this.router.navigate(['/login']);
            }
        });
    }

    register(data: any): Observable<any> {
        return from(this.supabaseService.auth.signUp({
            email: data.email,
            password: data.password,
            options: {
                data: {
                    full_name: data.name,
                    phone: data.phone,
                    role: 'customer'
                }
            }
        })).pipe(
            map(res => {
                if (res.error) throw res.error;
                return res.data;
            })
        );
    }

    login(credentials: any): Observable<any> {
        return from(this.supabaseService.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password
        })).pipe(
            map(res => {
                if (res.error) throw res.error;
                return { success: true, user: res.data.user, token: res.data.session?.access_token };
            })
        );
    }

    logout() {
        this.supabaseService.auth.signOut().then(() => {
            this.currentUser.set(null);
            this.router.navigate(['/login']);
        });
    }

    isLoggedIn() {
        return !!this.currentUser();
    }

    hasRole(roles: string[]) {
        const user = this.currentUser();
        let userRole = (user?.user_metadata as any)?.role || 'customer';

        // Custom Logic: If email is the dev email, grant dev role
        if (user?.email === 'poo2461p@gmail.com') {
            userRole = 'dev';
        }

        return user && roles.includes(userRole);
    }

    getUserName(): string {
        const user = this.currentUser();
        return (user?.user_metadata as any)?.full_name || user?.email?.split('@')[0] || 'User';
    }

    getToken(): Promise<string | null> {
        return this.supabaseService.auth.getSession().then(res => res.data.session?.access_token || null);
    }
}

