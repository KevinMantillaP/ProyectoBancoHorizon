import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private baseUrl = 'http://localhost:4000/api'; // Base URL del backend

  constructor(private http: HttpClient) { }

  registrarUsuario(usuario: any): Observable<any> {
    const url = `${this.baseUrl}/cliente`;
    return this.http.post<any>(url, usuario).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 409) { // Error 409: Conflict (usuario ya existe)
          return throwError('La cédula ingresada ya está registrada.');
        }
        return throwError('Error desconocido al registrar usuario.');
      })
    );
  }

  crearLoginUsuario(loginData: any): Observable<any> {
    const url = `${this.baseUrl}/loginUsuario`;
    return this.http.post<any>(url, loginData).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError('Error al crear el login del usuario.');
      })
    );
  }

  loginUsuario(credentials: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, credentials);
  }
  getCuentasByCedula(cedula: string): Observable<any> {
    const url = `${this.baseUrl}/cuenta?cedula=${cedula}`;
    return this.http.get<any>(url).pipe(
      catchError(this.handleError)
    );
  }
  getCurrentUser(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/usuario`); // Ajusta la ruta según tu backend
  }
  sendVerificationEmail(correo: string): Observable<any> {
    const url = `${this.baseUrl}/email/enviar-verificacion-correo`; // Endpoint para enviar correo de verificación
    return this.http.post(url, { correo });
  }

  verifyCode(correo: string, verificationCode: string): Observable<any> {
    const url = `${this.baseUrl}/email/verificar-codigo`; // Endpoint para verificar código de verificación
    return this.http.post(url, { correo, verificationCode });
  }

  enviarCodigoRecuperacion(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/email/enviar-codigo-recuperacion`, data);
  }

  verificarCodigoRecuperacion(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/email/verificar-codigo-recuperacion`, data);
  }

  cambiarPassword(formData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/email/cambiar-password`, formData);
  }

  actualizarSaldoCuenta(numeroCuenta: string, nuevoSaldo: number): Observable<any> {
    const url = `${this.baseUrl}/actualizar-saldo-cuenta`;
    const body = { numeroCuenta, nuevoSaldo };
    return this.http.put<any>(url, body).pipe(
      catchError(this.handleError)
    );
  }
  realizarTransferencia(cuentaOrigen: string, cuentaDestino: string, monto: number): Observable<any> {
    const url = `${this.baseUrl}/realizar-transferencia`;
    const body = { cuentaOrigen, cuentaDestino, monto };
    return this.http.post<any>(url, body).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Error desconocido!';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Error: ${error.error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}