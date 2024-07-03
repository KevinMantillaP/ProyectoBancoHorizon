import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../services/usuario.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { EmailService } from '../services/email-validation.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-verificar-codigo',
  templateUrl: './validar-codigo.component.html',
  styleUrls: ['./validar-codigo.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class VerificarCodigoComponent {
  verifyForm: FormGroup;
  correo: string= '';

  constructor(
    private fb: FormBuilder,
    private emailService: EmailService,
    private usuarioService: UsuarioService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.verifyForm = this.fb.group({
      verificationCode: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.correo = params['correo'];
    });
  }

  onSubmit() {
    if (this.verifyForm.valid) {
      const verificationCode = this.verifyForm.value.verificationCode;
      this.emailService.verifyCode(this.correo, verificationCode).subscribe(
        () => {
          this.snackBar.open('Código verificado con éxito', 'Cerrar', {
            duration: 3000
          });
          this.router.navigate(['/']); // Redirigir a la página de inicio u otra página relevante
        },
        error => {
          this.snackBar.open('Código de verificación incorrecto', 'Cerrar', {
            duration: 3000
          });
        }
      );
    } else {
      this.snackBar.open('Por favor, ingrese el código de verificación', 'Cerrar', {
        duration: 3000
      });
    }
  }
}
