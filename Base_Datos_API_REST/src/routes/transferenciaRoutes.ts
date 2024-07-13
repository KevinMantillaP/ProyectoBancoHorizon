// routes/transferenciaRoutes.ts
import { Router } from 'express';
import { getTransferencias, crearTransferencia, realizarTransferencia } from '../controllers/transferenciaController';

const router = Router();

// Definimos las rutas usando las funciones importadas
router.get('/transferencia', getTransferencias);
router.post('/transferencia', crearTransferencia);
router.post('/realizar-transferencia', realizarTransferencia);

export default router;
