import { Router } from 'express';
import { enviarCodigoVerificacion, verificarCodigo } from '../controllers/emailController';

const router = Router();

router.post('/enviar-verificacion-correo', enviarCodigoVerificacion);
router.post('/verificar-codigo', verificarCodigo);

export default router;
