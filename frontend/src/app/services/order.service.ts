import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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
        // First get the design to calculate total_price (or assume it's passed)
        // For simplicity, let's assume we fetch design first or create order with direct pricing
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
                design:Design(*, user:User(*), template:Template(*)),
                payment:Payment(*)
            `)).pipe(
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
        return from(this.supabaseService.client
            .from(this.TABLE_NAME)
            .delete()
            .eq('id', id)).pipe(
                map(res => {
                    if (res.error) throw res.error;
                    return { success: true, message: 'Order deleted' };
                })
            );
    }
}

import { switchMap } from 'rxjs/operators';

