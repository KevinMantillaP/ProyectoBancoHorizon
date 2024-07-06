import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
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
    contraseña: await bcrypt.hash(req.body.contraseña, 10), // Encriptar la contraseña antes de guardarla
    cedula: req.body.cedula
  });

  try {
    const loginUsuarioGuardado = await nuevoLoginUsuario.save();
    res.status(201).json(loginUsuarioGuardado);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// Actualizar un login de usuario
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

// Eliminar un login de usuario
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

// Iniciar sesión
export const loginUsuario = async (req: Request, res: Response) => {
  const { nombreUsuario, contraseña } = req.body;

  try {
    console.log('Intento de inicio de sesión para:', nombreUsuario); // Agrega este console.log
    // Buscar el usuario por nombreUsuario
    const usuario = await LoginUsuario.findOne({ nombreUsuario });
    if (!usuario) {
      console.log('Usuario no encontrado para:', nombreUsuario); // Agrega este console.log
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    // if (usuario.contraseña !== contraseña) {
    //   return res.status(401).json({ message: 'Credenciales incorrectas' });
    // }

    // Verificar la contraseña
    const contraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!contraseñaValida) {
      console.log('Contraseña incorrecta para:', nombreUsuario); // Agrega este console.log
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    console.log('Inicio de sesión exitoso para:', nombreUsuario); // Agrega este console.log
    return res.status(200).json({ message: 'Inicio de sesión exitoso', cedula: usuario.cedula });
  } catch (error) {
    console.error('Error al iniciar sesión:', (error as Error).message);
    return res.status(500).json({ message: 'Error al iniciar sesión' });
  }
};
