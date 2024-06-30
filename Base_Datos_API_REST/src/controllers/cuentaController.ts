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
    const nuevaCuenta = new Cuenta({
        numeroCuenta: req.body.numeroCuenta,
        tipoCuenta: req.body.tipoCuenta,
        saldo: req.body.saldo,
        idCliente: req.body.idCliente
    });

    try {
        const cuentaGuardada = await nuevaCuenta.save();
        res.status(201).json(cuentaGuardada);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
};
