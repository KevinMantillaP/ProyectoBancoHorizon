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
exports.eliminarLoginUsuario = exports.actualizarLoginUsuario = exports.crearLoginUsuario = exports.getLoginUsuarios = void 0;
const LoginUsuario_1 = __importDefault(require("../models/LoginUsuario"));
// Obtener todos los login de usuarios
const getLoginUsuarios = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const loginUsuarios = yield LoginUsuario_1.default.find();
        res.json(loginUsuarios);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.getLoginUsuarios = getLoginUsuarios;
// Crear un nuevo login de usuario
const crearLoginUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const nuevoLoginUsuario = new LoginUsuario_1.default({
        idUsuario: req.body.idUsuario,
        nombreUsuario: req.body.nombreUsuario,
        contraseña: req.body.contraseña,
        cedula: req.body.cedula
    });
    try {
        const loginUsuarioGuardado = yield nuevoLoginUsuario.save();
        res.status(201).json(loginUsuarioGuardado);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
});
exports.crearLoginUsuario = crearLoginUsuario;
const actualizarLoginUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cedula } = req.params;
    const actualizacion = req.body;
    try {
        const loginUsuarioActualizado = yield LoginUsuario_1.default.findOneAndUpdate({ cedula }, actualizacion, { new: true });
        if (!loginUsuarioActualizado) {
            return res.status(404).json({ message: 'No se encontró el usuario' });
        }
        res.json(loginUsuarioActualizado);
    }
    catch (error) {
        console.error('Error al actualizar el usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});
exports.actualizarLoginUsuario = actualizarLoginUsuario;
const eliminarLoginUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cedula } = req.params;
    try {
        const loginUsuarioEliminado = yield LoginUsuario_1.default.findOneAndDelete({ cedula });
        if (!loginUsuarioEliminado) {
            return res.status(404).json({ message: 'No se encontró el usuario' });
        }
        res.json({ message: 'Usuario eliminado correctamente' });
    }
    catch (error) {
        console.error('Error al eliminar el usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});
exports.eliminarLoginUsuario = eliminarLoginUsuario;
