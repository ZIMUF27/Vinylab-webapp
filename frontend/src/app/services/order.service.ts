import { environment } from "../../environments/environment";
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private apiUrl = `${environment.apiUrl}/orders`;

    constructor(private http: HttpClient) { }

    create(designId: string) {
        return this.http.post<any>(this.apiUrl, { design_id: designId });
    }

    getMyOrders() {
        return this.http.get<any>(`${this.apiUrl}/my`);
    }

    getAll() {
        return this.http.get<any>(this.apiUrl);
    }

    updateStatus(id: string, status: string) {
        return this.http.patch<any>(`${this.apiUrl}/${id}/status`, { status });
    }

    delete(id: string) {
        return this.http.delete<any>(`${this.apiUrl}/${id}`);
    }
}
