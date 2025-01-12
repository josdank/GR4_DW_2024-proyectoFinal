import { Router } from 'express';
const router = Router();

import {
    actualizarUsuario,
    detalleUsuario,
    eliminarUsuario,
    listarUsuarios,
    registrarUsuario,
    loginUsuario,
    perfilUsuario
} from "../controllers/usuario_controller.js";

import verificarAutenticacion from "../middlewares/autenticacion.js";

// Ruta para el login del usuario
router.post('/usuario/login', loginUsuario);

// Ruta para ver el perfil del usuario
router.get('/usuario/perfil', verificarAutenticacion, perfilUsuario);

// Ruta para listar todos los usuarios
router.get("/usuarios", verificarAutenticacion, listarUsuarios);

// Ruta para ver el detalle de un usuario en particular
router.get("/usuario/:id", verificarAutenticacion, detalleUsuario);

// Ruta para registrar un nuevo usuario
router.post("/usuario/registro", verificarAutenticacion, registrarUsuario);

// Ruta para actualizar los datos de un usuario
router.put("/usuario/actualizar/:id", verificarAutenticacion, actualizarUsuario);

// Ruta para eliminar un usuario
router.delete("/usuario/eliminar/:id", verificarAutenticacion, eliminarUsuario);

export default router;
