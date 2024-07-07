import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:4000/api';
  private userCedula: string | null = null; // Variable para almacenar la cédula

  constructor(private http: HttpClient) { }

//   login(nombreUsuario: string, contraseña: string): Observable<any> {
//     return this.http.post<any>(`${this.apiUrl}/login`, { nombreUsuario, contraseña });
//   }
// }
login(nombreUsuario: string, contraseña: string): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/login`, { nombreUsuario, contraseña }).pipe(
    tap((response: any) => {
      this.userCedula = response.cedula; // Almacenar la cédula en la variable
    })
  );
}

getUserCedula(): string | null {
  return this.userCedula; // Método para obtener la cédula del usuario
}
}