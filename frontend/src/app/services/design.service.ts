import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { SupabaseService } from './supabase.service';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class DesignService {
    private readonly TABLE_NAME = 'Design';

    constructor(
        private supabaseService: SupabaseService,
        private authService: AuthService
    ) { }

    create(data: any): Observable<any> {
        const userId = this.authService.currentUser()?.id;
        if (!userId) throw new Error('User not logged in');

        return from(this.supabaseService.client
            .from(this.TABLE_NAME)
            .insert({ ...data, user_id: userId })
            .select()
            .single()).pipe(
                map(res => {
                    if (res.error) throw res.error;
                    return { success: true, data: res.data };
                })
            );
    }

    getMyDesigns(): Observable<any> {
        const userId = this.authService.currentUser()?.id;
        if (!userId) throw new Error('User not logged in');

        return from(this.supabaseService.client
            .from(this.TABLE_NAME)
            .select('*, template:Template(*)')
            .eq('user_id', userId)).pipe(
                map(res => {
                    if (res.error) throw res.error;
                    return { success: true, data: res.data };
                })
            );
    }

    getById(id: string): Observable<any> {
        return from(this.supabaseService.client
            .from(this.TABLE_NAME)
            .select('*, template:Template(*)')
            .eq('id', id)
            .single()).pipe(
                map(res => {
                    if (res.error) throw res.error;
                    return { success: true, data: res.data };
                })
            );
    }
}

