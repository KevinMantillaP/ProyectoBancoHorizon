// models/LoginUsuario.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface ILoginUsuario extends Document {
  idUsuario: string;
  nombreUsuario: string;
  contraseña: string;
  cedula: string;
  intentosFallidos: number;
  bloqueoExpiracion: Date | null;
}

const LoginUsuarioSchema: Schema = new Schema({
  idUsuario: { type: String, required: true, unique: true },
  nombreUsuario: { type: String, required: true },
  contraseña: { type: String, required: true },
  cedula: { type: String, required: true, ref: 'Cliente' },
  intentosFallidos: { type: Number, default: 0 },
  bloqueoExpiracion: { type: Date, default: null }
}, { collection: 'LoginUsuario' });

const LoginUsuario = mongoose.model<ILoginUsuario>('LoginUsuario', LoginUsuarioSchema);

export default LoginUsuario;
