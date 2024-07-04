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

  sendVerificationEmail(correo: string): Observable<any> {
    const url = `${this.baseUrl}/email/enviar-verificacion-correo`; // Endpoint para enviar correo de verificación
    return this.http.post(url, { correo });
  }

  verifyCode(correo: string, verificationCode: string): Observable<any> {
    const url = `${this.baseUrl}/email/verificar-codigo`; // Endpoint para verificar código de verificación
    return this.http.post(url, { correo, verificationCode });
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
