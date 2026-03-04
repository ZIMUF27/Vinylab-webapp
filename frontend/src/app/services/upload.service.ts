import { environment } from "../../environments/environment";
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UploadService {
    private apiUrl = `${environment.apiUrl}/upload`;

    constructor(private http: HttpClient) { }

    upload(file: File): Observable<{ success: boolean, filePath: string }> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post<{ success: boolean, filePath: string }>(this.apiUrl, formData);
    }
}
