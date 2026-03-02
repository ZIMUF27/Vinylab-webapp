import { environment } from "../../environments/environment";
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class DashboardService {
    private apiUrl = `${environment.apiUrl}/dashboard`;

    constructor(private http: HttpClient) { }

    getStats() {
        return this.http.get<any>(`${this.apiUrl}/stats`);
    }

    getCustomers() {
        return this.http.get<any>(`${this.apiUrl}/customers`);
    }
}
