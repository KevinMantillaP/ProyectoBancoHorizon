import { Request, Response } from 'express';
import Cuenta from '../models/Cuenta';

export const getCuentas = async (req: Request, res: Response) => {
    try {
        const cuentas = await Cuenta.find();
        res.json(cuentas);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

export const crearCuenta = async (req: Request, res: Response) => {
    try {
      const { numeroCuenta, cedula, saldo, tipo } = req.body;
      const nuevaCuenta = new Cuenta({
        numeroCuenta,
        cedula,
        saldo,
        tipo
      });
  
      await nuevaCuenta.save();
      res.status(201).json({ message: 'Cuenta creada con éxito', cuenta: nuevaCuenta });
    } catch (error) {
      res.status(500).json({ message: 'Error al crear la cuenta', error });
    }
};

export const verificarNumeroCuenta = async (req: Request, res: Response) => {
    try {
      const { numeroCuenta } = req.params;
      const cuentaExistente = await Cuenta.findOne({ numeroCuenta });
      res.json({ exists: !!cuentaExistente });
    } catch (error) {
      console.error('Error al verificar el número de cuenta:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
};



