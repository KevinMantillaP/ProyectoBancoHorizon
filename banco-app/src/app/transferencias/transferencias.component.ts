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
  mostrarConfirmacion: boolean = false;

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
            this.cuentaOrigen = this.cuentas[0].numeroCuenta;
            this.cuentaDestino = this.cuentas[0].numeroCuenta;
            this.actualizarSaldoCuentaOrigen();
          }
        },
        (error) => {
          console.error('Error al obtener cuentas:', error);
          this.snackBar.open('Error al obtener cuentas', 'Cerrar', {
            duration: 3000,
          });
        }
      );

      this.usuarioService.obtenerEmailPorCedula(this.cedula).subscribe(
        (response) => {
          this.emailUsuario = response.email;
        },
        (error) => {
          console.error('Error al obtener email:', error);
          this.snackBar.open('Error al obtener email', 'Cerrar', {
            duration: 3000,
          });
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
      this.usuarioService.getClienteByNumeroCuenta(this.cuentaDestino).subscribe(
        (response) => {
          if (response) {
            this.nombreTitular = response.nombreCliente || 'No disponible';
            this.apellidoTitular = response.apellidosCliente || 'No disponible';
          } else {
            this.nombreTitular = 'Cuenta no encontrada';
            this.apellidoTitular = '';
            this.snackBar.open('La cuenta destino no existe', 'Cerrar', {
              duration: 3000,
            });
          }
        },
        (error) => {
          console.error('Error al buscar el cliente:', error);
          this.nombreTitular = 'Error al buscar';
          this.apellidoTitular = '';
          this.snackBar.open('No existe la cuenta destino', 'Cerrar', {
            duration: 3000,
          });
        }
      );
    }
  }

  confirmarTransferencia(): void {
    this.buscarTitularCuentaDestino();
    this.mostrarConfirmacion = true;
  }

  cancelarConfirmacion(): void {
    this.mostrarConfirmacion = false;
  }

  realizarTransferencia(): void {
    if (this.monto <= 0) {
      this.snackBar.open('El monto debe ser un número positivo', 'Cerrar', {
        duration: 3000,
      });
      return;
    }

    const saldoActual = this.cuentas.find(cuenta => cuenta.numeroCuenta === this.cuentaOrigen)?.saldo || 0;
    if (this.monto > saldoActual) {
      this.snackBar.open('Monto excede el saldo disponible', 'Cerrar', {
        duration: 3000,
      });
      this.isProcessing = false;
      return;
    }

    this.isProcessing = true;

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
        this.transferenciaService.realizarTransferencia(transferenciaData).subscribe(
          (response) => {
            console.log('Transferencia realizada con éxito', response);
            this.emailService.sendTransferNotification(this.emailUsuario, this.monto, this.cuentaOrigen, this.cuentaDestino, fecha).subscribe(
              (response) => {
                console.log('Notificación de transferencia enviada con éxito', response);
                this.snackBar.open('Transferencia realizada con éxito', 'Cerrar', {
                  duration: 3000,
                });
                this.redirectToVisualizarSaldo();
              },
              (error) => {
                this.isProcessing = false;
                console.error('Error al enviar la notificación de transferencia', error);
                this.snackBar.open('Error al enviar la notificación de transferencia', 'Cerrar', {
                  duration: 3000,
                });
              }
            );
          },
          (error) => {
            this.isProcessing = false;
            console.error('Error al realizar la transferencia', error);
            this.snackBar.open('Error al realizar la transferencia', 'Cerrar', {
              duration: 3000,
            });
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