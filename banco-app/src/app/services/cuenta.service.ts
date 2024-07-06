import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CuentaService {
  private apiUrl = 'http://localhost:4000/api'; // Ajusta esta URL según tu configuración

  constructor(private http: HttpClient) { }

  crearCuenta(cuentaData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/crear-cuenta`, cuentaData);
  }

  verificarNumeroCuenta(numeroCuenta: string): Observable<boolean> {
    return this.http.get<{ exists: boolean }>(`${this.apiUrl}/verificar-numero-cuenta/${numeroCuenta}`)
      .pipe(
        map(response => response.exists)
      );
  }
}
