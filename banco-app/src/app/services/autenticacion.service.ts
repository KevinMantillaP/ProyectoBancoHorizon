import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:4000/api';

  constructor(private http: HttpClient) { }

  login(nombreUsuario: string, contraseña: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { nombreUsuario, contraseña });
  }
}
