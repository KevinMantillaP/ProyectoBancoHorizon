import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-nueva-password',
  templateUrl: './nueva-password.component.html',
  styleUrls: ['./nueva-password.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule]
})
export class NuevaPasswordComponent implements OnInit {
  form: FormGroup;
  correo: string = '';

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: this.mustMatch('password', 'confirmPassword')
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.correo = params['correo'] || '';
      console.log('Correo obtenido de la URL:', this.correo);
    });
  }

  mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  onSubmit() {
    if (this.form && this.form.get('password') && this.form.valid) {
      const formData = {
        correo: this.correo,
        nuevaPassword: this.form.get('password')!.value
      };
  
      console.log('Datos enviados para cambiar contraseña:', formData);
  
      this.usuarioService.cambiarPassword(formData).subscribe({
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
  }  

  redirectTo(route: string) {
    this.router.navigate([route]);
  }
}
