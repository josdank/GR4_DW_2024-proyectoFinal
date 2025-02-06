import verificarAutenticacion from "../middlewares/autenticacion.js";
import { Router } from 'express';
import { registrarUsuario, loginUsuario, listarUsuarios, actualizarUsuario, detalleUsuario, eliminarUsuario, perfilUsuario } from "../controllers/usuario_controller.js";

const router = Router();

// Rutas públicas
// Ruta para registrar un nuevo usuario
router.post("/registro", registrarUsuario);

// Ruta para el login del usuario
router.post('/login', loginUsuario);

// Rutas Protegidas
// Ruta para ver el perfil del usuario
router.get('/perfil', verificarAutenticacion, perfilUsuario);

// Ruta para ver el detalle de un usuario en particular
router.get("/:id", verificarAutenticacion, detalleUsuario);

// Ruta para actualizar los datos de un usuario
router.put("/actualizar/:id", verificarAutenticacion, actualizarUsuario);

// Ruta para eliminar un usuario
router.delete("/eliminar/:id", verificarAutenticacion, eliminarUsuario);

// Rutas protegidas para administradores
router.get("/", verificarAutenticacion, listarUsuarios);

export default router;
