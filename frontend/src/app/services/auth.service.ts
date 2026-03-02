import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = `${environment.apiUrl}/auth`;
    currentUser = signal<any>(null);

    constructor(private http: HttpClient, private router: Router) {
        try {
            const user = localStorage.getItem('user');
            if (user) {
                this.currentUser.set(JSON.parse(user));
            }
        } catch (e) {
            console.error('Error parsing user from localStorage', e);
            localStorage.removeItem('user');
        }
    }

    register(data: any) {
        return this.http.post(`${this.apiUrl}/register`, data);
    }

    login(credentials: any) {
        return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
            tap(res => {
                if (res.success) {
                    localStorage.setItem('token', res.token);
                    localStorage.setItem('user', JSON.stringify(res.user));
                    this.currentUser.set(res.user);
                }
            })
        );
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.currentUser.set(null);
        this.router.navigate(['/login']);
    }

    isLoggedIn() {
        return !!this.currentUser();
    }

    hasRole(roles: string[]) {
        const user = this.currentUser();
        return user && roles.includes(user.role);
    }
}
