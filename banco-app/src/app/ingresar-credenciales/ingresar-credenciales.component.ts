import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-ingresar-credenciales',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './ingresar-credenciales.component.html',
  styleUrl: './ingresar-credenciales.component.css'
})
export class IngresarCredencialesComponent implements OnInit{
  loginForm: FormGroup;
  cedula: string = '';

  // constructor(private fb: FormBuilder, private route: ActivatedRoute, private usuarioService: UsuarioService, private snackBar: MatSnackBar, private router: Router) {
  //   this.loginForm = this.fb.group({
  //     nombreUsuario: ['', Validators.required],
  //     contraseña: ['', [Validators.required, Validators.minLength(6)]]
  //   });
  // }
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private usuarioService: UsuarioService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      nombreUsuario: ['', Validators.required],
      contraseña: ['', [Validators.required, Validators.minLength(6)]],
      confirmarContraseña: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.cedula = params['cedula'];
    });
  }
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('contraseña');
    const confirmPassword = form.get('confirmarContraseña');
    return password && confirmPassword && password.value === confirmPassword.value
      ? null : { 'mismatch': true };
  }
  onSubmit() {
    if (this.loginForm.valid) {
      const idUsuario = Math.floor(Math.random() * 1000000000).toString();   // Generar ID aleatorio
      const loginData = {
        idUsuario,
        nombreUsuario: this.loginForm.value.nombreUsuario,
        cedula: this.cedula,
        contraseña: this.loginForm.value.contraseña
      };
      

      this.usuarioService.crearLoginUsuario(loginData).subscribe(
        response => {
          this.snackBar.open('Login de usuario creado con éxito.', 'Cerrar', {
            duration: 3000
          });
          this.router.navigate(['/']); // Redirigir a la página de inicio o donde desees
        },
        error => {
          this.snackBar.open('Error al crear el login del usuario', 'Cerrar', {
            duration: 3000
          });
        }
      );
    } else {
      this.snackBar.open('Por favor complete todos los campos correctamente.', 'Cerrar', {
        duration: 3000
      });
    }
  }
  
  redirectTo(route: string) {
    this.router.navigate([route]);
  }
}
