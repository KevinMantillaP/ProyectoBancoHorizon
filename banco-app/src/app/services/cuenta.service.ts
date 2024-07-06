import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CuentaService {
  private apiUrl = 'http://localhost:4000/api'; // Ajusta esta URL según tu configuración

  constructor(private http: HttpClient) { }

  crearCuenta(cuentaData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/crear-cuenta`, cuentaData);
  }
}
