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
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './cambio-password.component.html',
  styleUrls: ['./cambio-password.component.css'],
})
export class CambioPasswordComponent implements OnInit {
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
  ) {
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
      const { passwordActual } = this.form.value;
      console.log('Datos de inicio de sesión:', passwordActual); // Agrega este console.log

      // Verificar la contraseña actual
      const nombreUsuario = this.authService.getUserNombre();
      if (nombreUsuario) {
        this.authService.verificarPassword(nombreUsuario, passwordActual).subscribe(
          response => {
            console.log('Verificación de contraseña exitosa:', response);
            if (this.form && this.form.get('passwordNueva') && this.form.valid) {
              const formData = {
                nombreUsuario,
                nuevaPassword: this.form.get('passwordNueva')!.value
              };

              console.log('Datos enviados para cambiar contraseña:', formData);

              // Actualizar la contraseña
              this.usuarioService.actualizarPassword(formData).subscribe({
                next: (response) => {
                  this.snackBar.open('Contraseña restablecida con éxito', 'Cerrar', {
                    duration: 3000
                  });
                  this.router.navigate(['/visualizacion-saldo']);
                },
                error: (error) => {
                  this.snackBar.open('Error al cambiar contraseña', 'Cerrar', {
                    duration: 3000
                  });
                  console.error('Error al cambiar contraseña:', error);
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
              this.errorMessage = 'Error en la verificación de la contraseña';
            }
            console.error('Error en la verificación de la contraseña:', error);
          }
        );
      } else {
        this.snackBar.open('Usuario no encontrado', 'Cerrar', {
          duration: 3000
        });
        console.error('Usuario no encontrado.');
      }
    } else {
      this.snackBar.open('Por favor complete todos los campos correctamente.', 'Cerrar', {
        duration: 3000
      });
    }
  }

  redirectTo(route: string): void {
    this.router.navigate([route]);
  }
}
