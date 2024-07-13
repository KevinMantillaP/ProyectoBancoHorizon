import { Router } from 'express';
import { getCuentas, crearCuenta, verificarNumeroCuenta, actualizarSaldoCuenta} from '../controllers/cuentaController';

const router = Router();

router.get('/cuenta', getCuentas);
router.post('/crear-cuenta', crearCuenta);
router.get('/verificar-numero-cuenta/:numeroCuenta', verificarNumeroCuenta);
router.put('/actualizar-saldo-cuenta', actualizarSaldoCuenta);

export default router;
