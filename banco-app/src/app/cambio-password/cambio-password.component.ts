import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../services/autenticacion.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cambio-password',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './cambio-password.component.html',
  styleUrl: './cambio-password.component.css',
})
export class CambioPasswordComponent implements OnInit{
  form: FormGroup;
  errorMessage: string = '';
  passwordCriteria = {
    length: false,
    uppercase: false,
    number: false,
    specialChar: false
  };

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private authService: AuthService,
  )  {
    this.form = this.fb.group({
      passwordActual: ['', Validators.required],
      passwordNueva: ['', [Validators.required, this.passwordValidator.bind(this)]],
      passwordConf: ['', Validators.required]
    }, {
      validator: this.passwordMatchValidator
    });
  }
  
  passwordValidator(control: any) {
    const value = control.value;
    if (!value) return null;

    const lengthValid = value.length >= 6;
    const uppercaseValid = /[A-Z]/.test(value);
    const numberValid = /[0-9]/.test(value);
    const specialCharValid = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    if (lengthValid && uppercaseValid && numberValid && specialCharValid) {
      return null;
    } else {
      return { passwordInvalid: true };
    }
  }
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('passwordNueva');
    const confirmPassword = form.get('passwordConf');
    return password && confirmPassword && password.value === confirmPassword.value
      ? null : { 'mismatch': true };
  }

  ngOnInit() {
    this.form.get('passwordNueva')?.valueChanges.subscribe(value => {
      this.passwordCriteria = {
        length: value.length >= 6,
        uppercase: /[A-Z]/.test(value),
        number: /[0-9]/.test(value),
        specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value)
      };
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const { passwordActual} = this.form.value;
      this.authService.verificarPassword(passwordActual).subscribe(
        response => {
          if (this.form && this.form.get('passwordNueva') && this.form.valid) {
            const formData = {
              nombreUsuario: this.authService.getUserNombre(),
              nuevaPassword: this.form.get('passwordNueva')!.value
            };
            this.usuarioService.actualizarPassword(formData).subscribe({
              next: (response) => {
                this.snackBar.open('Contraseña restablecida con éxito', 'Cerrar', {
                  duration: 3000
                });
                this.router.navigate(['/login']);
              },
              error: (error) => {
                this.snackBar.open('Error al cambiar contraseña', 'Cerrar', {
                  duration: 3000
                });
              }
            });
          } else {
            console.error('Formulario no válido o control no encontrado.');
          }
        },
        error => {
          if (error.status === 401) {
            this.snackBar.open('Contraseña Incorrecta', 'Cerrar', {
              duration: 3000
            });
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
      this.snackBar.open('Error al cambiar contraseña', 'Cerrar', {
        duration: 3000
      });
    }
  }

  redirectTo(route: string): void {
    this.router.navigate([route]);
  }

}
