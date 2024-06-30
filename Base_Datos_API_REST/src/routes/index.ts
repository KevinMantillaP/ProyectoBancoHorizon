import { Router } from 'express';
import clienteRoutes from './clienteRoutes';
import cuentaRoutes from './cuentaRoutes';
import transferenciaRoutes from './transferenciaRoutes';
import loginUsuarioRoutes from './loginUsuarioRoutes';
import administradorRoutes from './administradorRoutes';
import loginAdministradorRoutes from './loginAdministradorRoutes';
import auditoriaRoutes from './auditoriaRoutes';

const router = Router();

router.use(clienteRoutes);
router.use(cuentaRoutes);
router.use(transferenciaRoutes);
router.use(loginUsuarioRoutes);
router.use(administradorRoutes);
router.use(loginAdministradorRoutes);
router.use(auditoriaRoutes);

export default router;
