import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { from, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return from(authService.getToken()).pipe(
        switchMap(token => {
            const cloned = token
                ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
                : req;

            return next(cloned).pipe(
                catchError((error: HttpErrorResponse) => {
                    if (error.status === 401) {
                        authService.logout();
                        router.navigate(['/login']);
                    }
                    return throwError(() => error);
                })
            );
        })
    );
};
