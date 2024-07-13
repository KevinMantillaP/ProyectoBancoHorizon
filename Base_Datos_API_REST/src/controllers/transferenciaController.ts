import { Request, Response } from 'express';
import Transferencia, { ITransferencia } from '../models/Transferencia';
import Cuenta from '../models/Cuenta';

// Obtener todas las transferencias
export const getTransferencias = async (req: Request, res: Response) => {
  try {
    const transferencias = await Transferencia.find();
    res.json(transferencias);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Crear una nueva transferencia
export const crearTransferencia = async (req: Request, res: Response) => {
  const nuevaTransferencia: ITransferencia = new Transferencia({
    idTransferencia: req.body.idTransferencia,
    monto: req.body.monto,
    fecha: req.body.fecha,
    cuentaDestino: req.body.cuentaDestino,
    numeroCuenta: req.body.numeroCuenta,
    saldoRestante: req.body.saldoRestante,
    descripcion: req.body.descripcion
  });

  try {
    const transferenciaGuardada = await nuevaTransferencia.save();
    res.status(201).json(transferenciaGuardada);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
export const realizarTransferencia = async (req: Request, res: Response) => {
  const { cuentaOrigen, cuentaDestino, monto } = req.body;

  try {
    // Obtener las cuentas origen y destino
    const cuentaOrigenDB = await Cuenta.findOne({ numeroCuenta: cuentaOrigen });
    const cuentaDestinoDB = await Cuenta.findOne({ numeroCuenta: cuentaDestino });

    if (!cuentaOrigenDB || !cuentaDestinoDB) {
      return res.status(404).json({ message: 'Cuenta origen o destino no encontrada' });
    }

    // Verificar si hay suficiente saldo en la cuenta origen
    if (cuentaOrigenDB.saldo < monto) {
      return res.status(400).json({ message: 'Saldo insuficiente en la cuenta origen' });
    }

    // Actualizar los saldos de las cuentas
    cuentaOrigenDB.saldo -= monto;
    cuentaDestinoDB.saldo += monto;

    // Guardar los cambios en la base de datos
    await cuentaOrigenDB.save();
    await cuentaDestinoDB.save();

    res.json({ message: 'Transferencia realizada con éxito' });
  } catch (error) {
    console.error('Error al realizar transferencia:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
