import { Component, OnInit } from '@angular/core';
import { TransferenciaService } from '../services/transferencia.service';
import { UsuarioService } from '../services/usuario.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmailService } from '../services/email-validation.service';
import { ComparticionParametrosService } from '../services/comparticion-parametros.service';
import moment from 'moment';
import 'moment-timezone';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-transferencias',
  templateUrl: './transferencias.component.html',
  styleUrls: ['./transferencias.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, MatIconModule]
})
export class TransferenciasComponent implements OnInit {
  idTransferencia: string = '';
  cuentas: any[] = [];
  cuentaOrigen: string = '';
  cuentaDestino: string = '';
  monto: number = 0;
  descripcion: string = '';
  cedula: string | null = null;
  saldoCuentaOrigen: number = 0;
  emailUsuario: string = '';
  isProcessing: boolean = false;
  nombreTitular: string = '';
  apellidoTitular: string = '';

  constructor(
    private transferenciaService: TransferenciaService,
    private usuarioService: UsuarioService,
    private emailService: EmailService,
    private router: Router,
    private comparticionParametrosService: ComparticionParametrosService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.cedula = this.comparticionParametrosService.getCedula();
    if (this.cedula) {
      this.usuarioService.getCuentasByCedula(this.cedula).subscribe(
        (response) => {
          this.cuentas = response.cuentas;
          if (this.cuentas.length > 0) {
            this.cuentaOrigen = this.cuentas[0].numeroCuenta; // Selección inicial de cuenta origen
            this.cuentaDestino = this.cuentas[0].numeroCuenta; // Selección inicial de cuenta destino
            this.actualizarSaldoCuentaOrigen();
          }
        },
        (error) => {
          console.error('Error al obtener cuentas:', error);
        }
      );
      // Obtener email por cédula
      this.usuarioService.obtenerEmailPorCedula(this.cedula).subscribe(
        (response) => {
          this.emailUsuario = response.email;
        },
        (error) => {
          console.error('Error al obtener email:', error);
        }
      );
    }
  }

  actualizarSaldoCuentaOrigen(): void {
    const cuenta = this.cuentas.find(c => c.numeroCuenta === this.cuentaOrigen);
    this.saldoCuentaOrigen = cuenta ? cuenta.saldo : 0;
  }

  onCuentaOrigenChange(): void {
    this.actualizarSaldoCuentaOrigen();
  }

  buscarTitularCuentaDestino(): void {
    if (this.cuentaDestino) {
      // Obtén el cliente usando el número de cuenta destino
      this.usuarioService.getClienteByNumeroCuenta(this.cuentaDestino).subscribe(
        (response) => {
          this.nombreTitular = response.nombreCliente || 'No disponible';
          this.apellidoTitular = response.apellidosCliente || 'No disponible';
        },
        (error) => {
          console.error('Error al buscar el cliente:', error);
          this.nombreTitular = 'Error al buscar';
          this.apellidoTitular = '';
        }
      );
    }
  }

  realizarTransferencia(): void {
    if (this.monto <= 0) {
      console.error('El monto debe ser un número positivo');
      return;
    }

    this.isProcessing = true;

    const saldoActual = this.cuentas.find(cuenta => cuenta.numeroCuenta === this.cuentaOrigen)?.saldo || 0;
    const saldoRestante = saldoActual - this.monto;
    this.usuarioService.realizarTransferencia(this.cuentaOrigen, this.cuentaDestino, this.monto).subscribe(
      () => {
        const fecha = moment().tz('America/Guayaquil').format();
        const descripcion = this.descripcion.trim() === '' ? '' : this.descripcion;
        const transferenciaData = {
          idTransferencia: this.generarIdTransferencia(),
          monto: this.monto,
          fecha: fecha,
          cuentaDestino: this.cuentaDestino,
          numeroCuenta: this.cuentaOrigen,
          saldoRestante: saldoRestante,
          descripcion: descripcion
        };
        console.log(transferenciaData);
        this.transferenciaService.realizarTransferencia(transferenciaData).subscribe(
          (response) => {
            console.log('Transferencia realizada con éxito', response);
            // Enviar la notificación de transferencia por correo electrónico
            this.emailService.sendTransferNotification(this.emailUsuario, this.monto, this.cuentaOrigen, this.cuentaDestino, fecha).subscribe(
              (response) => {
                console.log('Notificación de transferencia enviada con éxito', response);
                this.snackBar.open('Transferencia realizada con éxito', 'Cerrar', {
                  duration: 3000, // Duración de la notificación
                });
                this.redirectToVisualizarSaldo();
              },
              (error) => {
                this.isProcessing = false;
                console.error('Error al enviar la notificación de transferencia', error);
                this.snackBar.open('Error al enviar la notificación de transferencia', 'Cerrar', {
                  duration: 3000, // Duración de la notificación
                });
              }
            );
          },
          (error) => {
            this.isProcessing = false;
            console.error('Error al realizar la transferencia', error);
          }
        );
      },
      (error) => {
        console.error('Error en la transferencia:', error);
        this.isProcessing = false;
      }
    );
  }

  generarIdTransferencia(): string {
    return 'TRF-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  }

  redirectToVisualizarSaldo(): void {
    this.router.navigate(['/visualizacion-saldo']);
  }
}
