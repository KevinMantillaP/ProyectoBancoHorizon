import { Router } from 'express';
import { getCuentas, crearCuenta, verificarNumeroCuenta } from '../controllers/cuentaController';

const router = Router();

router.get('/cuenta', getCuentas);
router.post('/crear-cuenta', crearCuenta);
router.get('/verificar-numero-cuenta/:numeroCuenta', verificarNumeroCuenta);

export default router;
