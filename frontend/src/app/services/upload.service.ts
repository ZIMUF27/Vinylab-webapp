import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SupabaseService } from './supabase.service';

@Injectable({
    providedIn: 'root'
})
export class UploadService {
    private readonly BUCKET_NAME = 'designs';

    constructor(private supabaseService: SupabaseService) { }

    upload(file: File): Observable<{ success: boolean, filePath: string }> {
        const filePath = `design_${Date.now()}_${file.name}`;

        return from(this.supabaseService.storage
            .from(this.BUCKET_NAME)
            .upload(filePath, file)).pipe(
                map(res => {
                    if (res.error) throw res.error;

                    const publicUrl = this.supabaseService.storage
                        .from(this.BUCKET_NAME)
                        .getPublicUrl(filePath).data.publicUrl;

                    return { success: true, filePath: publicUrl };
                })
            );
    }
}

