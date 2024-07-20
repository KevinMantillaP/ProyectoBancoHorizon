import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/autenticacion.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RecaptchaModule, RecaptchaComponent } from 'ng-recaptcha';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RecaptchaModule]
})
export class LoginComponent {
  @ViewChild('captchaRef') captchaRef!: RecaptchaComponent; 
  loginForm: FormGroup;
  errorMessage: string = '';
  isProcessing: boolean = false;
  reCaptchaSiteKey = '6LfpXQ8qAAAAAPVmaTmsOlb2-LhQtV7GzUCxlyxb'; 

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      nombreUsuario: ['', Validators.required],
      contraseña: ['', Validators.required],
      recaptcha: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isProcessing = true;
      const { nombreUsuario, contraseña, recaptcha } = this.loginForm.value;
  
      this.authService.login(nombreUsuario, contraseña, recaptcha).subscribe(
        response => {
          this.router.navigate(['/visualizacion-saldo']);
        },
        error => {
          if (error.status === 401) {
            this.errorMessage = 'Contraseña incorrecta. Verifica tus datos e intenta nuevamente.';
          } else if (error.status === 404) {
            this.errorMessage = 'Usuario no encontrado';
          } else if (error.status === 403) {
            this.errorMessage = 'Cuenta bloqueada. Intenta de nuevo más tarde.';
          } else {
            this.errorMessage = 'Error en el inicio de sesión';
          }
          console.error('Error en el login:', error);
          this.resetCaptcha(); // Reiniciar captcha en caso de error
          this.loginForm.reset(); // Resetear el formulario
          this.isProcessing = false; // Finalizar el proceso
        }
      );
    } else {
      this.errorMessage = 'Por favor complete todos los campos correctamente.';
    }
  }

  resolved(captchaResponse: string | null) {
    if (captchaResponse) {
      this.loginForm.patchValue({ recaptcha: captchaResponse });
    } else {
      this.loginForm.patchValue({ recaptcha: '' });
    }
  }

  resetCaptcha() {
    this.captchaRef.reset(); // Reiniciar el captcha
  }

  redirectTo(route: string) {
    this.router.navigate([route]);
  }
}