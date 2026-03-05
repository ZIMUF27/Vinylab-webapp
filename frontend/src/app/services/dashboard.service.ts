import { Injectable } from '@angular/core';
import { from, Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { SupabaseService } from './supabase.service';

@Injectable({
    providedIn: 'root'
})
export class DashboardService {
    constructor(private supabaseService: SupabaseService) { }

    getStats(): Observable<any> {
        // Run multiple counts in parallel
        return forkJoin({
            totalOrders: from(this.supabaseService.client.from('Order').select('*', { count: 'exact', head: true })),
            totalRevenue: from(this.supabaseService.client.from('Order').select('total_price')),
            totalDesign: from(this.supabaseService.client.from('Design').select('*', { count: 'exact', head: true })),
            totalTemplates: from(this.supabaseService.client.from('Template').select('*', { count: 'exact', head: true }))
        }).pipe(
            map(res => {
                const revenue = (res.totalRevenue.data || []).reduce((acc: number, curr: any) => acc + curr.total_price, 0);
                return {
                    success: true,
                    data: {
                        totalOrders: res.totalOrders.count || 0,
                        totalRevenue: revenue,
                        totalDesign: res.totalDesign.count || 0,
                        totalTemplates: res.totalTemplates.count || 0
                    }
                };
            })
        );
    }


    getCustomers(): Observable<any> {
        // Supabase doesn't have a direct "distinct" on a column with object retrieval easily without RPC 
        // but we can query designs and group them or query auth users if we have access (usually we don't in client side for all users)
        // Let's query orders with user info via designs
        return from(this.supabaseService.client
            .from('Design')
            .select('user_id, user:User(id, name, email, phone)')
            // This is a bit of a hack to get unique users, in real app you might want a User table
        ).pipe(
            map(res => {
                const uniqueUsers = Array.from(new Map((res.data || []).map((item: any) => [item.user_id, item.user])).values());
                return { success: true, data: uniqueUsers };
            })
        );
    }
}

