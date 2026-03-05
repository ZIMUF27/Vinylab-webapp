import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SupabaseService } from './supabase.service';

@Injectable({
    providedIn: 'root'
})
export class TemplateService {
    private readonly TABLE_NAME = 'Template';

    constructor(private supabaseService: SupabaseService) { }

    getAll(): Observable<any> {
        return from(this.supabaseService.client
            .from(this.TABLE_NAME)
            .select('*')).pipe(
                map(res => {
                    if (res.error) throw res.error;
                    return { success: true, data: res.data };
                })
            );
    }

    getById(id: string): Observable<any> {
        return from(this.supabaseService.client
            .from(this.TABLE_NAME)
            .select('*')
            .eq('id', id)
            .single()).pipe(
                map(res => {
                    if (res.error) throw res.error;
                    return { success: true, data: res.data };
                })
            );
    }

    create(data: any): Observable<any> {
        return from(this.supabaseService.client
            .from(this.TABLE_NAME)
            .insert(data)
            .select()
            .single()).pipe(
                map(res => {
                    if (res.error) throw res.error;
                    return { success: true, data: res.data };
                })
            );
    }
}

