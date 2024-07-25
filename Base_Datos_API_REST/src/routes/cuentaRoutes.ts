import { Router } from 'express';
import { getCuentas, crearCuenta, verificarNumeroCuenta, actualizarSaldoCuenta, getClienteByNumeroCuenta  } from '../controllers/cuentaController';

const router = Router();

router.get('/cuenta', getCuentas);
router.post('/crear-cuenta', crearCuenta);
router.get('/verificar-numero-cuenta/:numeroCuenta', verificarNumeroCuenta);
router.put('/actualizar-saldo-cuenta', actualizarSaldoCuenta);
router.get('/cuentas/cliente/:numeroCuenta', getClienteByNumeroCuenta);

export default router;
