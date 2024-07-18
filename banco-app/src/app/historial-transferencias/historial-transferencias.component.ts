import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../services/usuario.service';
import { ActivatedRoute, Router  } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComparticionParametrosService } from '../services/comparticion-parametros.service';

@Component({
  selector: 'app-historial-transferencias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './historial-transferencias.component.html',
  styleUrls: ['./historial-transferencias.component.css']
})
export class HistorialTransferenciasComponent implements OnInit {
  transferencias: any[] = [];
  transferenciasFiltradas: any[] = [];
  numeroCuenta: string | null = null;
  cedula: string | null = null;
  filtroTipo: string = 'todos'; // por defecto, mostrar todas las transacciones
  fechaFiltro: Date | null = null; // fecha seleccionada para filtrar

  constructor(
    private usuarioService: UsuarioService,
    private route: ActivatedRoute,
    private router: Router,
    private comparticionParametrosService: ComparticionParametrosService
  ) {}

  ngOnInit(): void {
    this.numeroCuenta = this.comparticionParametrosService.getNumeroCuenta();
    this.cedula = this.comparticionParametrosService.getCedula();
    if (this.numeroCuenta) {
      this.obtenerTransferencias();
    } else {
      console.error('Número de cuenta no proporcionado');
    }
  }

  obtenerTransferencias(): void {
    if (this.numeroCuenta) {
      this.usuarioService.getTransferenciasByNumeroCuenta(this.numeroCuenta).subscribe(data => {
        this.transferencias = data.map(transferencia => ({
          ...transferencia,
          tipo: transferencia.cuentaDestino === this.numeroCuenta ? 'ingreso' : 'egreso'
        })).sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

        this.transferenciasFiltradas = [...this.transferencias];
      });
    }
  }

  filtrarPorTipo(tipo: string): void {
    if (tipo === 'todos') {
      this.transferenciasFiltradas = [...this.transferencias];
    } else {
      this.transferenciasFiltradas = this.transferencias.filter(transferencia =>
        (tipo === 'ingreso' && transferencia.tipo === 'ingreso') ||
        (tipo === 'egreso' && transferencia.tipo === 'egreso')
      );
    }
  }

  filtrarPorFecha(fecha: Date | null): void {
    this.fechaFiltro = fecha;
    if (fecha) {
      this.transferenciasFiltradas = this.transferencias.filter(transferencia =>
        new Date(transferencia.fecha).toDateString() === fecha.toDateString()
      );
    } else {
      this.transferenciasFiltradas = [...this.transferencias];
    }
  }

  regresar(): void {
    this.router.navigate(['/visualizacion-saldo']);
  }
}