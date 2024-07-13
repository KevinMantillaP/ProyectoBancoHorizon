import { Component, OnInit  } from '@angular/core';
import { TransferenciaService } from '../services/transferencia.service';
import { UsuarioService } from '../services/usuario.service';
import { Router,ActivatedRoute  } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-transferencias',
  templateUrl: './transferencias.component.html',
  styleUrls: ['./transferencias.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule]
  
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


  constructor(
    private transferenciaService: TransferenciaService,
    private usuarioService: UsuarioService,
    private router: Router,
    private route: ActivatedRoute 
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.cedula = params['cedula'] || null;
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
      }
    });
  }

  actualizarSaldoCuentaOrigen(): void {
    const cuenta = this.cuentas.find(c => c.numeroCuenta === this.cuentaOrigen);
    this.saldoCuentaOrigen = cuenta ? cuenta.saldo : 0;
  }
  
  onCuentaOrigenChange(): void {
    this.actualizarSaldoCuentaOrigen();
  }
  
  realizarTransferencia(): void {
    const saldoActual = this.cuentas.find(cuenta => cuenta.numeroCuenta === this.cuentaOrigen)?.saldo || 0;
    const saldoRestante = saldoActual - this.monto;
    this.usuarioService.realizarTransferencia(this.cuentaOrigen, this.cuentaDestino, this.monto).subscribe(
      () => {
        console.log('Saldo de cuenta actualizado correctamente en el backend');
        const descripcion = this.descripcion.trim() === ' ' ? ' ' : this.descripcion;
        const transferenciaData = {
          idTransferencia: this.generarIdTransferencia(),
          monto: this.monto,
          fecha: new Date(),
          cuentaDestino: this.cuentaDestino,
          numeroCuenta: this.cuentaOrigen,
          saldoRestante: saldoRestante,
          descripcion: descripcion
        };
        this.transferenciaService.realizarTransferencia(transferenciaData).subscribe(
          (response) => {
            console.log('Transferencia realizada con éxito', response);
            this.redirectToVisualizarSaldo();
          },
          (error) => {
            console.error('Error al realizar la transferencia', error);
          }
        );
      },
      (error) => {
        console.error('Error al actualizar saldo de cuenta en el backend:', error);
      }
    );
  }

  private generarIdTransferencia(): string {
    const caracteres = '0123456789';
    let idTransferencia = '';
    for (let i = 0; i < 10; i++) {
      idTransferencia += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return idTransferencia;
  }

  redirectTo(route: string): void {
    this.router.navigate(['/visualizacion-saldo'], { queryParams: { cedula: this.cedula } });
  }

  private redirectToVisualizarSaldo(): void {
    this.router.navigate(['/visualizacion-saldo'], { queryParams: { cedula: this.cedula } });
  }
}