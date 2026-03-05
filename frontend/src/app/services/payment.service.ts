import { Injectable } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { SupabaseService } from './supabase.service';

@Injectable({
    providedIn: 'root'
})
export class PaymentService {
    private readonly TABLE_NAME = 'Payment';
    private readonly BUCKET_NAME = 'slips';

    constructor(private supabaseService: SupabaseService) { }

    create(data: any): Observable<any> {
        // If data is FormData, handle file upload first
        if (data instanceof FormData) {
            const file = data.get('payment_slip') as File;
            const orderId = data.get('order_id') as string;
            const amount = parseFloat(data.get('amount') as string);
            const method = data.get('payment_method') as string;

            const filePath = `slip_${Date.now()}_${file.name}`;

            return from(this.supabaseService.storage
                .from(this.BUCKET_NAME)
                .upload(filePath, file)).pipe(
                    switchMap(uploadRes => {
                        if (uploadRes.error) throw uploadRes.error;

                        const publicUrl = this.supabaseService.storage
                            .from(this.BUCKET_NAME)
                            .getPublicUrl(filePath).data.publicUrl;

                        return from(this.supabaseService.client
                            .from(this.TABLE_NAME)
                            .insert({
                                order_id: orderId,
                                amount: amount,
                                payment_method: method,
                                payment_slip: publicUrl,
                                payment_status: 'completed' // Assuming it's completed on upload for now, or match your logic
                            })
                            .select()
                            .single());
                    }),
                    map(res => {
                        if (res.error) throw res.error;
                        return { success: true, data: res.data };
                    })
                );
        }

        // Handle JSON data (fallback)
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

    getByOrderId(orderId: string): Observable<any> {
        return from(this.supabaseService.client
            .from(this.TABLE_NAME)
            .select('*')
            .eq('order_id', orderId)
            .single()).pipe(
                map(res => {
                    if (res.error) throw res.error;
                    return { success: true, data: res.data };
                })
            );
    }
}

