import { Component, OnInit } from '@angular/core';
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
export class VerificarCodigoComponent implements OnInit {
  verifyForm: FormGroup;
  correo: string = '';
  cedula: string = '';

  constructor(
    private fb: FormBuilder,
    private emailService: EmailService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.verifyForm = this.fb.group({
      code1: ['', [Validators.required, Validators.maxLength(1)]],
      code2: ['', [Validators.required, Validators.maxLength(1)]],
      code3: ['', [Validators.required, Validators.maxLength(1)]],
      code4: ['', [Validators.required, Validators.maxLength(1)]],
      code5: ['', [Validators.required, Validators.maxLength(1)]],
      code6: ['', [Validators.required, Validators.maxLength(1)]]
    });
  }

  ngOnInit(): void {
    this.correo = this.route.snapshot.queryParamMap.get('correo') || '';
    this.cedula = this.route.snapshot.queryParamMap.get('cedula') || '';
  }

  onSubmit() {
    if (this.verifyForm.valid) {
      const verificationCode = this.verifyForm.value.code1 +
                               this.verifyForm.value.code2 +
                               this.verifyForm.value.code3 +
                               this.verifyForm.value.code4 +
                               this.verifyForm.value.code5 +
                               this.verifyForm.value.code6;
      console.log('Código de verificación ingresado:', verificationCode);

      this.emailService.verifyCode(this.correo, verificationCode).subscribe(
        () => {
          this.snackBar.open('Código verificado con éxito', 'Cerrar', {
            duration: 3000
          });
          this.router.navigate(['/ingresar-credenciales'], { queryParams: { cedula: this.cedula } });
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