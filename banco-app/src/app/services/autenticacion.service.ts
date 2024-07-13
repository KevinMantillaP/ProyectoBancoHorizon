import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({

  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:4000/api';
  private userCedula: string | null = null; // Variable para almacenar la cédula
  private userNombre: string | null = null; // Variable para almacenar el nombre de usuario

  constructor(private http: HttpClient) { }

//   login(nombreUsuario: string, contraseña: string): Observable<any> {
//     return this.http.post<any>(`${this.apiUrl}/login`, { nombreUsuario, contraseña });
//   }
// }
login(nombreUsuario: string, contraseña: string): Observable<any> {
  this.userNombre = nombreUsuario;//Almacena el nombre de usuario
  console.log('Usuario :',this.userNombre);
  return this.http.post<any>(`${this.apiUrl}/login`, { nombreUsuario, contraseña }).pipe(
    tap((response: any) => {
      this.userCedula = response.cedula; // Almacenar la cédula en la variable
    })
  );
}

getUserCedula(): string | null {
  return this.userCedula; // Método para obtener la cédula del usuario
}

getUserNombre(): string | null {
  console.log('Usuario :',this.userNombre);
  return this.userNombre; //metodo para obtener el usuario
}

verificarPassword(contraseña: string): Observable <any> {
  if (this.userNombre === null) {
    console.error('Usuario nulo',)
    return throwError(() => new Error('El nombre de usuario es nulo'));
  }
  return this.login(this.userNombre, contraseña).pipe(
    catchError((error) => {
      console.error('Error en verificarContraseña:', error);
      return throwError(error);
    })
  );
}
}