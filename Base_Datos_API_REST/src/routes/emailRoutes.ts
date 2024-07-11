import { Router } from 'express';
import { cambiarPassword, enviarCodigoRecuperacion, enviarCodigoVerificacion, verificarCodigo, verificarCodigoRecuperacion } from '../controllers/emailController';

const router = Router();

router.post('/enviar-verificacion-correo', enviarCodigoVerificacion);
router.post('/verificar-codigo', verificarCodigo);
router.post('/enviar-codigo-recuperacion', enviarCodigoRecuperacion);
router.post('/verificar-codigo-recuperacion', verificarCodigoRecuperacion);
router.post('/cambiar-password', cambiarPassword)

export default router;
