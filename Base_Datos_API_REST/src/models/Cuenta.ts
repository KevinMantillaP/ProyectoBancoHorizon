import mongoose, { Schema, Document } from 'mongoose';

export interface ICuenta extends Document {
    numeroCuenta: string;
    tipoCuenta: string;
    saldo: number;
    idCliente: string;
}

const CuentaSchema: Schema = new Schema({
    numeroCuenta: { type: String, required: true, unique: true },
    tipoCuenta: { type: String, required: true },
    saldo: { type: Number, required: true },
    cedula: { type: String, required: true, ref: 'Cliente' }
}, { collection: 'Cuenta' });

const Cuenta = mongoose.model<ICuenta>('Cuenta', CuentaSchema);

export default Cuenta;
