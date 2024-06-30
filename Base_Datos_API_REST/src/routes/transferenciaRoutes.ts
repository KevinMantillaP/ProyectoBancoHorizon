// routes/transferenciaRoutes.ts
import { Router } from 'express';
import { getTransferencias, crearTransferencia } from '../controllers/transferenciaController';

const router = Router();

// Definimos las rutas usando las funciones importadas
router.get('/transferencia', getTransferencias);
router.post('/transferencia', crearTransferencia);

export default router;
