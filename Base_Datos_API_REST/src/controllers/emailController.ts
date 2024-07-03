import { Request, Response } from 'express';
import sgMail from '@sendgrid/mail';
import Cliente from '../models/Cliente';

const SENDGRID_API_KEY = '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';
sgMail.setApiKey(SENDGRID_API_KEY);

const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Genera un código de 6 dígitos
};


// const verifyEmailAddress = async (email: string): Promise<boolean> => {
//   const request = {
//     method: 'POST' as const,
//     url: '/v3/validations/email',
//     body: {
//       email
//     }
//   };
//   try {
//     const [response, body] = await sgClient.request(request);
//     if (body.result.verdict === 'Valid') {
//       return true;
//     } else {
//       return false;
//     }
//   } catch (error) {
//     console.error('Error al verificar email:', error);
//     return false;
//   }
// };

export const enviarCodigoVerificacion = async (req: Request, res: Response) => {
  const { correo } = req.body;

  // Verificar si el correo electrónico es válido
  // const isEmailValid = await verifyEmailAddress(correo);
  // if (!isEmailValid) {
  //   return res.status(400).json({ message: 'Correo electrónico no válido' });
  // }
  
  const verificationCode = generateVerificationCode();
  try {
    // Guarda el código de verificación en el documento del cliente
    const cliente = await Cliente.findOneAndUpdate(
      { correo },
      { verificationCode, isVerified: false },
      { new: true, upsert: true }
    );

    // Configuración del correo
    const mailData = {
      to: correo,
      from: 'angela.bedon@epn.edu.ec', // Asegúrate de que este correo esté verificado en SendGrid
      subject: 'Código de Verificación',
      text: `Tu código de verificación es: ${verificationCode}`
    };

    // Envía el correo usando SendGrid
    await sgMail.send(mailData);

    return res.status(200).json({ message: 'Correo de verificación enviado' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al enviar el correo de verificación' });
  }
};

export const verificarCodigo = async (req: Request, res: Response) => {
  const { correo, verificationCode } = req.body;

  console.log('Correo recibido:', correo);
  console.log('Código de verificación recibido:', verificationCode);

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
    console.error(error);
    return res.status(500).json({ message: 'Error al verificar el código' });
  }
};