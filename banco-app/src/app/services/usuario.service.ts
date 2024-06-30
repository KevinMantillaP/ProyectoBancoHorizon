import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private baseUrl = 'http://localhost:4000/api/cliente'; // Cambia esto según la URL de tu backend

  constructor(private http: HttpClient) { }

  registrarUsuario(usuario: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, usuario);
  }

  // eliminarUsuario(cedula: string): Observable<any> {
  //   return this.http.delete(`${this.baseUrl}/${cedula}`);
  // }

  // actualizarUsuario(cedula: string, usuario: any): Observable<any> {
  //   return this.http.put(`${this.baseUrl}/${cedula}`, usuario);
  // }
}
