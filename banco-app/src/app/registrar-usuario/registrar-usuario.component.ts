import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { UsuarioService } from '../services/usuario.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import moment from 'moment';
import { Router } from '@angular/router';
import { EmailService } from '../services/email-validation.service';

@Component({
  selector: 'app-registrar-usuario',
  templateUrl: './registrar-usuario.component.html',
  styleUrls: ['./registrar-usuario.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class RegistrarUsuarioComponent {
  registroForm: FormGroup;

  constructor(private fb: FormBuilder, private usuarioService: UsuarioService, private snackBar: MatSnackBar, private router: Router, private emailService: EmailService) {
    this.registroForm = this.fb.group({
      cedula: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      celular: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      fechaNacimiento: ['', [Validators.required, this.validateAge]],
      provincia: ['', Validators.required],
      ciudad: ['', Validators.required],
      callePrincipal: ['', Validators.required],
      calleSecundaria: ['', Validators.required]
    });
  }

  validateAge(control: FormControl) {
    const today = moment().startOf('day'); // La fecha de hoy a las 00:00
    const inputDate = moment(control.value).startOf('day'); // La fecha de nacimiento a las 00:00

    let age = today.diff(inputDate, 'years'); // Diferencia en años

    return age >= 18 ? null : { ageInvalid: true };
  }


  onSubmit() {
    if (this.registroForm.valid) {
      const correo = this.registroForm.value.correo;
      
      this.usuarioService.registrarUsuario(this.registroForm.value).subscribe(
        response => {
          this.emailService.sendVerificationEmail(correo).subscribe(
            () => {
              this.snackBar.open('Usuario registrado con éxito. Verifique su correo.', 'Cerrar', {
                duration: 3000
              });
              this.router.navigate(['/verificar-codigo'], { queryParams: { correo } });
            },
            error => {
              this.snackBar.open('Error al enviar el correo de verificación', 'Cerrar', {
                duration: 3000
              });
            }
          );
          this.registroForm.reset();
        },
        error => {
          this.snackBar.open(error, 'Cerrar', { // Mostrar mensaje de error específico
            duration: 3000
          });
        }
      );
    } else {
      let mensaje = 'Por favor complete todos los campos correctamente:';
      Object.keys(this.registroForm.controls).forEach(key => {
        const control = this.registroForm.get(key);
        if (control && control.invalid && control.touched) {
          mensaje += `\n- ${key.charAt(0).toUpperCase() + key.slice(1)}`;
        }
      });
      this.snackBar.open(mensaje, 'Cerrar', {
        duration: 3000
      });
    }
  }

  redirectTo(route: string) {
    this.router.navigate([route]);
  }
}
