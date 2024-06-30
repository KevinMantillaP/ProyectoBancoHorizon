"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cuentaController_1 = require("../controllers/cuentaController");
const router = (0, express_1.Router)();
router.get('/cuenta', cuentaController_1.getCuentas);
router.post('/cuenta', cuentaController_1.crearCuenta);
exports.default = router;
