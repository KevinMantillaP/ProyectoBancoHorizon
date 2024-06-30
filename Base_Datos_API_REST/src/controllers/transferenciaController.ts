// controllers/transferenciaController.ts
import { Request, Response } from 'express';
import Transferencia, { ITransferencia } from '../models/Transferencia';

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
