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

  constructor(private usuarioService: UsuarioService,
    private authService: AuthService,
    private router: Router){ }

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

  onAccountChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedNumeroCuenta = selectElement.value;
    const selectedAccountIndex = this.cuentas.findIndex(cuenta => cuenta.numeroCuenta === selectedNumeroCuenta);

    if (selectedAccountIndex !== -1) {
      const selectedAccount = this.cuentas[selectedAccountIndex];
      // Mover la cuenta seleccionada al principio del arreglo
      this.cuentas.splice(selectedAccountIndex, 1); // Eliminar la cuenta de su posición actual
      this.cuentas.unshift(selectedAccount); // Agregar la cuenta al inicio del arreglo
      this.selectedAccount = selectedAccount; // Actualizar la cuenta seleccionada
    }
    this.showAccounts = false; // Ocultar el selector después de cambiar de cuenta
  }

  toggleAccounts(): void {
    this.showAccounts = !this.showAccounts; // Alternar la visibilidad del selector de cuentas
    if (this.showAccounts) {
      setTimeout(() => {
        const selectElement = document.querySelector('select');
        if (selectElement) {
          selectElement.focus();
        }
      }, 0);
    }
  }

  redirectTo(route: string): void {
    this.router.navigate([route], { queryParams: { cedula: this.cedula } });
  }
}
