import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../services/usuario.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/autenticacion.service';

@Component({
  selector: 'app-visualizacion-saldo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './visualizacion-saldo.component.html',
  styleUrls: ['./visualizacion-saldo.component.css']
})
export class VisualizacionSaldoComponent implements OnInit {
  usuario: any = {};
  cuentas: any[] = [];
  cedula: string | null = null;

  constructor(private usuarioService: UsuarioService, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.cedula = this.authService.getUserCedula(); // Obtener la cédula del AuthService
    if (this.cedula) {
      this.obtenerCuentas(this.cedula);
    } else {
      console.error('No se pudo obtener la cédula del usuario autenticado');
    }
  }
  obtenerCuentas(cedula: string): void {
    this.usuarioService.getCuentasByCedula(cedula).subscribe(
      (response) => {
        this.cuentas = response;
      },
      (error) => {
        console.error('Error al obtener cuentas:', error);
      }
    );
  }
  redirectTo(route: string): void {
    this.router.navigate([route]);
  }
}