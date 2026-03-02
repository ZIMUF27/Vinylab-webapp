import { environment } from "../../environments/environment";
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class PaymentService {
    private apiUrl = `${environment.apiUrl}/payments`;

    constructor(private http: HttpClient) { }

    create(data: any) {
        return this.http.post<any>(this.apiUrl, data);
    }

    getByOrderId(orderId: string) {
        return this.http.get<any>(`${this.apiUrl}/order/${orderId}`);
    }
}
