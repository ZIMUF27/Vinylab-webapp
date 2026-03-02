import { environment } from "../../environments/environment";
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class DesignService {
    private apiUrl = `${environment.apiUrl}/designs`;

    constructor(private http: HttpClient) { }

    create(data: any) {
        return this.http.post<any>(this.apiUrl, data);
    }

    getMyDesigns() {
        return this.http.get<any>(`${this.apiUrl}/my`);
    }

    getById(id: string) {
        return this.http.get<any>(`${this.apiUrl}/${id}`);
    }
}
