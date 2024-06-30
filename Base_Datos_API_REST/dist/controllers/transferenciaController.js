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
exports.crearTransferencia = exports.getTransferencias = void 0;
const Transferencia_1 = __importDefault(require("../models/Transferencia"));
// Obtener todas las transferencias
const getTransferencias = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transferencias = yield Transferencia_1.default.find();
        res.json(transferencias);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.getTransferencias = getTransferencias;
// Crear una nueva transferencia
const crearTransferencia = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const nuevaTransferencia = new Transferencia_1.default({
        idTransferencia: req.body.idTransferencia,
        monto: req.body.monto,
        fecha: req.body.fecha,
        cuentaDestino: req.body.cuentaDestino,
        numeroCuenta: req.body.numeroCuenta,
        saldoRestante: req.body.saldoRestante,
        descripcion: req.body.descripcion
    });
    try {
        const transferenciaGuardada = yield nuevaTransferencia.save();
        res.status(201).json(transferenciaGuardada);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
});
exports.crearTransferencia = crearTransferencia;
