import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../services/usuario.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComparticionParametrosService } from '../services/comparticion-parametros.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import moment from 'moment';
import 'moment-timezone';

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
  filtroTipo: string = 'todos';
  fechaInicio: string = ''; // Modificado a string para manejar fechas en formato ISO
  fechaFin: string = ''; // Modificado a string para manejar fechas en formato ISO

  constructor(
    private usuarioService: UsuarioService,
    private route: ActivatedRoute,
    private router: Router,
    private comparticionParametrosService: ComparticionParametrosService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.numeroCuenta = this.comparticionParametrosService.getNumeroCuenta();
    this.cedula = this.comparticionParametrosService.getCedula();
    if (this.numeroCuenta) {
      this.obtenerTransferencias();
    } else {
      console.error('Número de cuenta no proporcionado');
    }

    // Inicializa las fechas por defecto usando moment
    const ahora = moment().tz('America/Guayaquil');
    this.fechaFin = ahora.format('YYYY-MM-DD');
    this.fechaInicio = ahora.subtract(30, 'days').format('YYYY-MM-DD');
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

  filtrarPorFechas(): void {
    if (this.fechaInicio && this.fechaFin) {
      const fechaInicio = moment(this.fechaInicio).startOf('day').toDate();
      const fechaFin = moment(this.fechaFin).endOf('day').toDate();

      if (fechaInicio > fechaFin) {
        this.snackBar.open('La fecha de inicio no puede ser mayor que la fecha de fin.', 'Cerrar', {
          duration: 5000,
        });
        this.transferenciasFiltradas = [];
      } else if (fechaInicio > new Date()) {
        this.snackBar.open('La fecha de inicio es futura. No se pueden mostrar registros.', 'Cerrar', {
          duration: 5000,
        });
        this.transferenciasFiltradas = [];
      } else if (fechaFin > new Date()) {
        this.snackBar.open('La fecha de fin es futura. No se pueden mostrar registros.', 'Cerrar', {
          duration: 5000,
        });
        this.transferenciasFiltradas = [];
      } else {
        this.transferenciasFiltradas = this.transferencias.filter(transferencia => {
          const transferenciaFecha = new Date(transferencia.fecha);
          return transferenciaFecha >= fechaInicio && transferenciaFecha <= fechaFin;
        });

        if (this.transferenciasFiltradas.length === 0) {
          this.snackBar.open('No se encontraron registros para el rango de fechas seleccionado.', 'Cerrar', {
            duration: 5000,
          });
        }
      }
    } else {
      this.transferenciasFiltradas = [...this.transferencias];
    }
  }

  regresar(): void {
    this.router.navigate(['/visualizacion-saldo']);
  }
}
