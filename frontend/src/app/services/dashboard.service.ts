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
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        const startOfYear = new Date(now.getFullYear(), 0, 1).toISOString();

        return forkJoin({
            totalOrders: from(this.supabaseService.client.from('Order').select('*', { count: 'exact', head: true })),
            allOrders: from(this.supabaseService.client.from('Order').select('total_price, created_at')),
            totalCustomers: from(this.supabaseService.client.from('Design').select('user_id')),
            totalTemplates: from(this.supabaseService.client.from('Template').select('*', { count: 'exact', head: true }))
        }).pipe(
            map(res => {
                const orders = res.allOrders.data || [];
                const totalRevenue = orders.reduce((acc: number, curr: any) => acc + curr.total_price, 0);
                const dailyRevenue = orders
                    .filter((o: any) => o.created_at >= startOfDay)
                    .reduce((acc: number, curr: any) => acc + curr.total_price, 0);
                const monthlyRevenue = orders
                    .filter((o: any) => o.created_at >= startOfMonth)
                    .reduce((acc: number, curr: any) => acc + curr.total_price, 0);
                const yearlyRevenue = orders
                    .filter((o: any) => o.created_at >= startOfYear)
                    .reduce((acc: number, curr: any) => acc + curr.total_price, 0);

                // Count unique customers from designs
                const uniqueUserIds = new Set((res.totalCustomers.data || []).map((d: any) => d.user_id));

                return {
                    success: true,
                    data: {
                        totalOrders: res.totalOrders.count || 0,
                        totalRevenue,
                        dailyRevenue,
                        monthlyRevenue,
                        yearlyRevenue,
                        totalCustomers: uniqueUserIds.size,
                        totalTemplates: res.totalTemplates.count || 0
                    }
                };
            })
        );
    }


    getCustomers(): Observable<any> {
        // Query designs to get unique user_ids - no User table exists,
        // so we just return user_id info from Design table
        return from(this.supabaseService.client
            .from('Design')
            .select('user_id, created_at')
        ).pipe(
            map(res => {
                // Group by user_id and count designs
                const userMap = new Map<string, any>();
                (res.data || []).forEach((item: any) => {
                    if (!userMap.has(item.user_id)) {
                        userMap.set(item.user_id, {
                            id: item.user_id,
                            name: 'Customer',
                            email: item.user_id.slice(0, 8) + '...',
                            phone: null,
                            created_at: item.created_at,
                            _count: { designs: 1 }
                        });
                    } else {
                        userMap.get(item.user_id)._count.designs++;
                    }
                });
                return { success: true, data: Array.from(userMap.values()) };
            })
        );
    }
}


