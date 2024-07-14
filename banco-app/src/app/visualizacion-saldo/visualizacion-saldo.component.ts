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
  nombreCliente: string = '';
  cuentas: any[] = [];
  cedula: string | null = null;
  selectedAccount: any = null;
  showAccounts: boolean = false;

  constructor(
    private usuarioService: UsuarioService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    const cedula = this.authService.getUserCedula();
    if (cedula) {
      this.cedula = cedula;
      this.usuarioService.getCuentasByCedula(cedula).subscribe(
        (response) => {
          this.nombreCliente = response.nombreCliente;
          this.cuentas = response.cuentas;
          this.selectedAccount = this.cuentas[0]; // Selección inicial de cuenta
        },
        (error) => {
          console.error('Error al obtener cuentas:', error);
        }
      );
    } else {
      console.error('No se pudo obtener la cédula del usuario autenticado');
    }
  }

  selectAccount(cuenta: any): void {
    this.selectedAccount = cuenta;
    this.showAccounts = false;
  }

  toggleAccounts(): void {
    this.showAccounts = !this.showAccounts;
  }

  redirectTo(route: string): void {
    this.router.navigate([route], { queryParams: { cedula: this.cedula } });
  }
}
