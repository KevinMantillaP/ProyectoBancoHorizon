import { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import Cliente from '../models/Cliente';

// Configuración de OAuth2
const OAuth2 = google.auth.OAuth2;
const oauth2Client = new OAuth2(
  '850188523706-4akhplehsaunvesc3e4neksb8rjjhnu0.apps.googleusercontent.com', // Coloca aquí tu Client ID
  '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', // Coloca aquí tu Client Secret
  'https://developers.google.com/oauthplayground' // URL de redirección de OAuth2
);

oauth2Client.setCredentials({
  refresh_token: '1//04RFWi1oJd4pqCgYIARAAGAQSNwF-L9IrSuiDqif8-aiM-d1A3zRX_OhqFFSgDp73X6vH3dvH74zOZ7JeCuLvkkvb8fSBfp_f24w' // Coloca aquí tu Refresh Token
});

const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Genera un código de 6 dígitos
};

export const enviarCodigoVerificacion = async (req: Request, res: Response) => {
  const { correo } = req.body;

  const verificationCode = generateVerificationCode();

  try {
    // Guarda el código de verificación en el documento del cliente
    const cliente = await Cliente.findOneAndUpdate(
      { correo },
      { verificationCode, isVerified: false },
      { new: true, upsert: true }
    );

    // Obtener el access token
    const accessToken = await oauth2Client.getAccessToken();

    if (typeof accessToken.token !== 'string') {
      throw new Error('No se pudo obtener el Access Token');
    }

    // Configuración del transporte de correo
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'estefaniabedon7@gmail.com', // Coloca aquí tu dirección de correo Gmail
        clientId: '850188523706-4akhplehsaunvesc3e4neksb8rjjhnu0.apps.googleusercontent.com', // Coloca aquí tu Client ID
        clientSecret: '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', // Coloca aquí tu Client Secret
        refreshToken: '1//04RFWi1oJd4pqCgYIARAAGAQSNwF-L9IrSuiDqif8-aiM-d1A3zRX_OhqFFSgDp73X6vH3dvH74zOZ7JeCuLvkkvb8fSBfp_f24w', // Coloca aquí tu Refresh Token
        accessToken: accessToken.token, // El token de acceso obtenido
      },
    });

    // Configuración del correo
    const mailOptions = {
      from: 'Horizon Bank <sebaswow12@gmail.com>', // Nombre y dirección de correo remitente
      to: correo, // Dirección de correo destinatario
      subject: 'Código de Verificación',
      html: `<strong>Tu código de verificación es: ${verificationCode}</strong>`,
    };

    // Envía el correo usando nodemailer
    const result = await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: 'Correo de verificación enviado' });
  } catch (error) {
    return res.status(500).json({ message: 'Error al enviar el correo de verificación' });
  }
};

export const verificarCodigo = async (req: Request, res: Response) => {
  const { correo, verificationCode } = req.body;

  try {
    const cliente = await Cliente.findOne({ correo });

    if (!cliente) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    if (cliente.verificationCode === verificationCode) {
      cliente.isVerified = true;
      cliente.verificationCode = undefined;

      await cliente.save();

    
      return res.status(200).json({ message: 'Código verificado con éxito' });
    } else {
      return res.status(400).json({ message: 'Código de verificación incorrecto' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Error al verificar el código' });
  }
};
