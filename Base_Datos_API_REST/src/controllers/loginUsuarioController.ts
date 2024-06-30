// controllers/loginUsuarioController.ts
import { Request, Response } from 'express';
import LoginUsuario, { ILoginUsuario } from '../models/LoginUsuario';

// Obtener todos los login de usuarios
export const getLoginUsuarios = async (req: Request, res: Response) => {
  try {
    const loginUsuarios = await LoginUsuario.find();
    res.json(loginUsuarios);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Crear un nuevo login de usuario
export const crearLoginUsuario = async (req: Request, res: Response) => {
  const nuevoLoginUsuario: ILoginUsuario = new LoginUsuario({
    idUsuario: req.body.idUsuario,
    nombreUsuario: req.body.nombreUsuario,
    contraseña: req.body.contraseña,
    cedula: req.body.cedula
  });

  try {
    const loginUsuarioGuardado = await nuevoLoginUsuario.save();
    res.status(201).json(loginUsuarioGuardado);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const actualizarLoginUsuario = async (req: Request, res: Response) => {
  const { cedula } = req.params;
  const actualizacion = req.body;

  try {
      const loginUsuarioActualizado = await LoginUsuario.findOneAndUpdate({ cedula }, actualizacion, { new: true });

      if (!loginUsuarioActualizado) {
          return res.status(404).json({ message: 'No se encontró el usuario' });
      }

      res.json(loginUsuarioActualizado);
  } catch (error) {
      console.error('Error al actualizar el usuario:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const eliminarLoginUsuario = async (req: Request, res: Response) => {
  const { cedula } = req.params;

  try {
      const loginUsuarioEliminado = await LoginUsuario.findOneAndDelete({ cedula });

      if (!loginUsuarioEliminado) {
          return res.status(404).json({ message: 'No se encontró el usuario' });
      }

      res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
      console.error('Error al eliminar el usuario:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
  }
};
