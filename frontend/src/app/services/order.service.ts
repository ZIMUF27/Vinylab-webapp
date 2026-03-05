import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { SupabaseService } from './supabase.service';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private readonly TABLE_NAME = 'Order';

    constructor(
        private supabaseService: SupabaseService,
        private authService: AuthService
    ) { }

    create(designId: string): Observable<any> {
        return from(this.supabaseService.client
            .from('Design')
            .select('price_calculated')
            .eq('id', designId)
            .single()).pipe(
                switchMap(res => {
                    if (res.error) throw res.error;
                    const price = res.data.price_calculated;
                    return from(this.supabaseService.client
                        .from(this.TABLE_NAME)
                        .insert({ design_id: designId, total_price: price })
                        .select()
                        .single());
                }),
                map(res => {
                    if (res.error) throw res.error;
                    return { success: true, data: res.data };
                })
            );
    }

    getMyOrders(): Observable<any> {
        const userId = this.authService.currentUser()?.id;
        if (!userId) throw new Error('User not logged in');

        return from(this.supabaseService.client
            .from(this.TABLE_NAME)
            .select(`
                *,
                design:Design!inner(*, template:Template(*)),
                payment:Payment(*)
            `)
            .eq('design.user_id', userId)).pipe(
                map(res => {
                    if (res.error) throw res.error;
                    return { success: true, data: res.data };
                })
            );
    }

    getAll(): Observable<any> {
        return from(this.supabaseService.client
            .from(this.TABLE_NAME)
            .select(`
                *,
                design:Design(*, template:Template(*)),
                payment:Payment(*)
            `)
            .order('created_at', { ascending: false })).pipe(
                map(res => {
                    if (res.error) throw res.error;
                    return { success: true, data: res.data };
                })
            );
    }

    updateStatus(id: string, status: string): Observable<any> {
        return from(this.supabaseService.client
            .from(this.TABLE_NAME)
            .update({ status })
            .eq('id', id)
            .select()
            .single()).pipe(
                map(res => {
                    if (res.error) throw res.error;
                    return { success: true, data: res.data };
                })
            );
    }

    delete(id: string): Observable<any> {
        // First delete related Payment records, then delete the Order
        return from(this.supabaseService.client
            .from('Payment')
            .delete()
            .eq('order_id', id)).pipe(
                switchMap(() => {
                    return from(this.supabaseService.client
                        .from(this.TABLE_NAME)
                        .delete()
                        .eq('id', id));
                }),
                map(res => {
                    if (res.error) throw res.error;
                    return { success: true, message: 'Order deleted' };
                })
            );
    }
}

