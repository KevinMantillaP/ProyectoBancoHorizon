import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/autenticacion.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      nombreUsuario: ['', Validators.required],
      contraseña: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { nombreUsuario, contraseña } = this.loginForm.value;
      this.authService.login(nombreUsuario, contraseña).subscribe(
        response => {
          this.router.navigate(['/visualizacion-saldo']); // Ajusta la ruta según tus necesidades
        },
        error => {
          if (error.status === 401) {
            this.errorMessage = 'Contraseña incorrecta';
          } else if (error.status == 404) {
            this.errorMessage = 'Usuario incorrecto';
          } else {
            this.errorMessage = 'Error en el inicio de sesión';
          }
          console.error('Error en el login:', error);
        }
      );
    } else {
      this.errorMessage = 'Por favor complete todos los campos correctamente.';
    }
  }

  redirectTo(route: string) {
    this.router.navigate([route]);
  }
}
