import { Router } from 'express';
import { getCuentas, crearCuenta } from '../controllers/cuentaController';

const router = Router();

router.get('/cuenta', getCuentas);
router.post('/crear-cuenta', crearCuenta);

export default router;
