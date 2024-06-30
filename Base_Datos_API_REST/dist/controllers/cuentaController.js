"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.crearCuenta = exports.getCuentas = void 0;
const Cuenta_1 = __importDefault(require("../models/Cuenta"));
const getCuentas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cuentas = yield Cuenta_1.default.find();
        res.json(cuentas);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.getCuentas = getCuentas;
const crearCuenta = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const nuevaCuenta = new Cuenta_1.default({
        numeroCuenta: req.body.numeroCuenta,
        tipoCuenta: req.body.tipoCuenta,
        saldo: req.body.saldo,
        idCliente: req.body.idCliente
    });
    try {
        const cuentaGuardada = yield nuevaCuenta.save();
        res.status(201).json(cuentaGuardada);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
});
exports.crearCuenta = crearCuenta;
