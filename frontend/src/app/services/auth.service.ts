import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { from, Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private supabase: SupabaseClient;
    currentUser = signal<User | null>(null);

    constructor(private router: Router) {
        this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);

        // Check current session
        this.supabase.auth.getSession().then(({ data: { session } }) => {
            this.currentUser.set(session?.user ?? null);
        });

        // Listen for auth changes
        this.supabase.auth.onAuthStateChange((_event, session) => {
            this.currentUser.set(session?.user ?? null);
            if (!session) {
                this.router.navigate(['/login']);
            }
        });
    }

    register(data: any): Observable<any> {
        return from(this.supabase.auth.signUp({
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
        return from(this.supabase.auth.signInWithPassword({
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
        this.supabase.auth.signOut().then(() => {
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
        return this.supabase.auth.getSession().then(res => res.data.session?.access_token || null);
    }
}
