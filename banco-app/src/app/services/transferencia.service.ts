// transferencia.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransferenciaService {
  private baseUrl = 'http://localhost:4000/api'; // URL base del backend

  constructor(private http: HttpClient) {}

  realizarTransferencia(transferenciaData: any): Observable<any> {
    const url = `${this.baseUrl}/transferencia`;
    return this.http.post<any>(url, transferenciaData);
  }
}
