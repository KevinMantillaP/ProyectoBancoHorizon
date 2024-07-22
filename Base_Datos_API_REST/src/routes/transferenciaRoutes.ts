// routes/transferenciaRoutes.ts
import { Router } from 'express';
import { getTransferencias, crearTransferencia, realizarTransferencia, getTransferenciasByCuenta } from '../controllers/transferenciaController';

const router = Router();

// Definimos las rutas usando las funciones importadas
router.get('/transferencia', getTransferencias);
router.post('/transferencia', crearTransferencia);
router.post('/realizar-transferencia', realizarTransferencia);
router.get('/transferencia/:numeroCuenta', getTransferenciasByCuenta);

export default router;
