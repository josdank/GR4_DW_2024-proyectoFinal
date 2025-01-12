// Importar Router de Express
import { Router } from 'express';

// Crear una instancia de Router()
const router = Router();

// Importar los métodos del controlador
import {
    login,
    perfil,
    registro,
    confirmEmail,
    listarAdmins,
    detalleAdmin,
    actualizarPerfil,
    actualizarPassword,
    recuperarPassword,
    comprobarTokenPasword,
    nuevoPassword
} from "../controllers/admin_controller.js";
import verificarAutenticacion from '../middlewares/autenticacion.js';
import { actualizarPeriferico, detallePeriferico, registrarPeriferico, cambiarEstado, eliminarPeriferico } from '../controllers/perifericos_controller.js';
import { actualizarUsuario, detalleUsuario, eliminarUsuario, listarUsuarios } from '../controllers/usuario_controller.js';

// Rutas públicas
router.post("/login", login);  // Iniciar sesión como admin
router.post("/registro", registro);  // Registro de nuevo admin
router.get("/confirmar/:token", confirmEmail);  // Confirmar cuenta de admin
router.post("/recuperar-password", recuperarPassword);  // Recuperar contraseña
router.get("/recuperar-password/:token", comprobarTokenPasword);  // Comprobar token para recuperación de contraseña
router.post("/nuevo-password/:token", nuevoPassword);  // Nuevo password después de la recuperación

// Rutas privadas para admin (requieren autenticación)
router.get("/perfil", verificarAutenticacion, perfil);  // Ver perfil del admin
router.put("/admin/actualizarpassword", verificarAutenticacion, actualizarPassword);  // Actualizar contraseña del admin
router.put("/admin/:id", verificarAutenticacion, actualizarPerfil);  // Actualizar perfil del admin

// Rutas para gestión de usuarios (solo para admin)
router.get("/usuarios", verificarAutenticacion, listarUsuarios);  // Listar todos los usuarios
router.put("/usuario/:id", verificarAutenticacion, actualizarUsuario);  // Modificar usuario
router.delete("/usuario/:id", verificarAutenticacion, eliminarUsuario);  // Eliminar un usuario
router.get("/usuario/:id", verificarAutenticacion, detalleUsuario);

// Rutas para gestión de periféricos (solo para admin)
router.get("/perifericos", verificarAutenticacion, detallePeriferico);  // Listar todos los periféricos
router.post("/periferico", verificarAutenticacion, registrarPeriferico);  // Añadir un nuevo periférico
router.put("/periferico/:id", verificarAutenticacion, actualizarPeriferico);  // Modificar un periférico
router.delete("/periferico/:id", verificarAutenticacion, eliminarPeriferico);  // Eliminar un periférico
router.put("/periferico/:id", verificarAutenticacion, cambiarEstado);

// Rutas solo para admin: gestionar a otros admins
router.get("/admins", verificarAutenticacion, listarAdmins);  // Listar todos los admins
router.get("/admin/:id", verificarAutenticacion, detalleAdmin);  // Ver detalles de un admin en particular
router.delete("/admin/:id", verificarAutenticacion, async (req, res) => {
    try {
        const { id } = req.params;
        // Lógica para eliminar al admin
        const adminBDD = await Admin.findById(id);
        if (!adminBDD) {
            return res.status(404).json({ msg: `El admin con ID ${id} no existe` });
        }
        await adminBDD.remove();
        res.status(200).json({ msg: `Admin con ID ${id} eliminado correctamente` });
    } catch (error) {
        res.status(500).json({ msg: "Error al eliminar el admin", error: error.message });
    }
});

// Exportar la variable router
export default router;
