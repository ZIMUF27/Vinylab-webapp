import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class TemplateService {
    private apiUrl = 'http://localhost:3000/api/templates';

    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<any>(this.apiUrl);
    }

    getById(id: string) {
        return this.http.get<any>(`${this.apiUrl}/${id}`);
    }

    create(data: any) {
        return this.http.post<any>(this.apiUrl, data);
    }
}
