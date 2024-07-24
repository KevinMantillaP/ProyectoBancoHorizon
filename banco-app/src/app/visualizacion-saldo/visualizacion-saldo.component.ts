import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../services/usuario.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/autenticacion.service';
import { ComparticionParametrosService } from '../services/comparticion-parametros.service';

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
    private router: Router,
    private comparticionParametrosService: ComparticionParametrosService
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    const cedula = this.authService.getUserCedula();
    console.log('Cédula obtenida:', cedula); // Verifica el valor de la cédula
    if (cedula) {
      this.cedula = cedula;
      this.usuarioService.getCuentasByCedula(cedula).subscribe(
        (response) => {
          this.nombreCliente = response.nombreCliente;
          this.cuentas = response.cuentas;
          this.selectedAccount = this.cuentas[0]; // Selección inicial de cuenta
          console.log('Cuentas obtenidas:', this.cuentas); // Verifica las cuentas obtenidas
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
    console.log('Mostrar cuentas:', this.showAccounts); // Verifica el estado de showAccounts
  }
  

  viewTransferHistory(numeroCuenta: string, cedula: string | null): void {
    if (cedula) {
      this.comparticionParametrosService.setNumeroCuenta(numeroCuenta);
      this.comparticionParametrosService.setCedula(cedula);
      this.router.navigate(['/historial-transferencias']);
    } else {
      console.error('Cedula no proporcionada');
    }
  }  
  
  onAccountClick(cuenta: any): void {
    console.log('Cuenta clickeada:', cuenta);
    console.log('Cuenta seleccionada:', this.selectedAccount);
  
    if (this.selectedAccount === cuenta) {
      if (this.cedula) {
        this.viewTransferHistory(cuenta.numeroCuenta, this.cedula);
      } else {
        console.error('Cedula no proporcionada');
      }
    } else {
      this.selectAccount(cuenta);
    }
  }
  
  redirectTo(route: string): void {
    if (this.cedula) {
      this.comparticionParametrosService.setCedula(this.cedula);
      this.router.navigate([route]);
    } else {
      console.error('Cedula no proporcionada');
    }
  }

  redirectToHistorialTransferencias(): void {
    if (this.selectedAccount && this.cedula) {
      this.comparticionParametrosService.setNumeroCuenta(this.selectedAccount.numeroCuenta);
      this.comparticionParametrosService.setCedula(this.cedula);
      this.router.navigate(['/historial-transferencias']);
    } else {
      console.error('No se pudo redirigir al historial de transferencias. Verifica que la cuenta seleccionada y la cédula estén disponibles.');
    }
  }
}