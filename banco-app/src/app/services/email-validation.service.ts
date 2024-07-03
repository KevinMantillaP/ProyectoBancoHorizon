import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  private baseUrl = 'http://localhost:4000/api/email';

  constructor(private http: HttpClient) { }

  sendVerificationEmail(correo: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/enviar-verificacion-correo`, { correo });
  }

  verifyCode(correo: string, verificationCode: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/verificar-codigo`, { correo, verificationCode });
  }
}
