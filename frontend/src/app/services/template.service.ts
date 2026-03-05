import { environment } from "../../environments/environment";
import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class TemplateService {
    private supabase: SupabaseClient;

    constructor() {
        this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    }

    getAll(): Observable<any> {
        return from(this.supabase.from('Template').select('*')).pipe(
            map(res => {
                if (res.error) throw res.error;
                return { success: true, data: res.data };
            })
        );
    }

    getById(id: string): Observable<any> {
        return from(
            this.supabase
                .from('Template')
                .select('*')
                .eq('id', id)
                .single()
        ).pipe(
            map(res => {
                if (res.error) throw res.error;
                return { success: true, data: res.data };
            })
        );
    }

    create(data: any): Observable<any> {
        return from(this.supabase.from('Template').insert(data).select().single()).pipe(
            map(res => {
                if (res.error) throw res.error;
                return { success: true, data: res.data };
            })
        );
    }
}
