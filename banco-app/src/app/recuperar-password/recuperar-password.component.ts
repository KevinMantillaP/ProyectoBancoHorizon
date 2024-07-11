import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsuarioService } from '../services/usuario.service';

@Component({
  selector: 'app-recuperar-password',
  templateUrl: './recuperar-password.component.html',
  styleUrls: ['./recuperar-password.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule]
})
export class RecuperarPasswordComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      correo: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const correo = this.form.value.correo;
      this.usuarioService.enviarCodigoRecuperacion({ correo }).subscribe({
        next: (response) => {
          this.snackBar.open('Código de recuperación enviado al correo', 'Cerrar', {
            duration: 3000
          });
          this.router.navigate(['/verificar-codigo-recuperacion', { correo }]);
        }, 
        error: (error) => {
          this.snackBar.open('Error al enviar el correo de recuperación', 'Cerrar', {
            duration: 3000
          });
        }
      });
    }
  }

  redirectTo(route: string) {
    this.router.navigate([route]);
  }
}
