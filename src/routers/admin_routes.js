// Importar Router de Express
import { Router } from 'express';
import Admin from '../models/Admin.js';

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
router.post("/login", login);  
router.post("/registro", registro);  
router.get("/confirmar/:token", confirmEmail);  
router.post("/recuperar-password", recuperarPassword);  
router.get("/recuperar-password/:token", comprobarTokenPasword);  
router.post("/nuevo-password/:token", nuevoPassword); 

// Rutas privadas para admin (requieren autenticación)
router.get("/perfil", verificarAutenticacion, perfil);  
router.put("/admin/actualizarpassword", verificarAutenticacion, actualizarPassword); 
router.put("/admin/:id", verificarAutenticacion, actualizarPerfil); 

// Rutas para gestión de usuarios (solo para admin)
router.get("/usuarios", verificarAutenticacion, listarUsuarios);  
router.put("/usuario/:id", verificarAutenticacion, actualizarUsuario);  
router.delete("/usuario/:id", verificarAutenticacion, eliminarUsuario);  
router.get("/usuario/:id", verificarAutenticacion, detalleUsuario);

// Rutas para gestión de periféricos (solo para admin)
router.get("/perifericos", verificarAutenticacion, detallePeriferico);  
router.post("/periferico", verificarAutenticacion, registrarPeriferico);  
router.put("/periferico/:id", verificarAutenticacion, actualizarPeriferico);  
router.delete("/periferico/:id", verificarAutenticacion, eliminarPeriferico);  
router.put("/periferico/:id", verificarAutenticacion, cambiarEstado);

// Rutas solo para admin: gestionar a otros admins
router.get("/admins", verificarAutenticacion, listarAdmins);  
router.get("/admin/:id", verificarAutenticacion, detalleAdmin);  // Ver detalles de un admin en particular
router.delete("/admin/:id", verificarAutenticacion, async (req, res) => {
    try {
        const { id } = req.params;
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
