import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { UsuarioService } from '../services/usuario.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registrar-usuario',
  templateUrl: './registrar-usuario.component.html',
  styleUrls: ['./registrar-usuario.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class RegistrarUsuarioComponent {
  registroForm: FormGroup;

  constructor(private fb: FormBuilder, private usuarioService: UsuarioService, private snackBar: MatSnackBar) {
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
    const date = new Date(control.value);
    const age = new Date().getFullYear() - date.getFullYear();
    return age >= 18 ? null : { ageInvalid: true };
  }

  onSubmit() {
    if (this.registroForm.valid) {
      this.usuarioService.registrarUsuario(this.registroForm.value).subscribe(
        response => {
          this.snackBar.open('Usuario registrado con éxito', 'Cerrar', {
            duration: 3000
          });
          this.registroForm.reset();
        },
        error => {
          this.snackBar.open('Error al registrar usuario', 'Cerrar', {
            duration: 3000
          });
        }
      );
    } else {
      this.snackBar.open('Por favor complete todos los campos correctamente', 'Cerrar', {
        duration: 3000
      });
    }
  }
}
