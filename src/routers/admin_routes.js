// Importar Router de Express
import { Router } from 'express';
import Admin from '../models/Admin.js';

// Crear una instancia de Router()
const router = Router();

// Importar los métodos del controlador
import {
    registro,
    login,
    perfil,
    confirmEmail,
    listarAdmins,
    detalleAdmin,
    actualizarPerfil,
    eliminarAdmin,
    recuperarPassword,
    comprobarTokenPasword,
    nuevoPassword
} from "../controllers/admin_controller.js";
import Autenticacion from '../middlewares/autenticacion.js';
import { actualizarPeriferico, detallePeriferico, registrarPeriferico, eliminarPeriferico } from '../controllers/perifericos_controller.js';
import { actualizarUsuario, detalleUsuario, eliminarUsuario, listarUsuarios } from '../controllers/usuario_controller.js';

// Rutas públicas
router.post("/registro", registro);  
router.post("/login", login);  
router.get("/confirmar/:token", confirmEmail);  
router.post("/recuperar-password", recuperarPassword);  
router.get("/recuperar-password/:token", comprobarTokenPasword);  
router.post("/nuevo-password/:token", nuevoPassword); 

// Rutas privadas para admin (requieren autenticación)
router.get("/perfil", Autenticacion, perfil);  
router.put("/a/:id", actualizarPerfil); 

// Rutas para gestión de usuarios (solo para admin)
router.get("/usuarios", Autenticacion, listarUsuarios);  
router.put("/usuario/:id", Autenticacion, actualizarUsuario);  
router.delete("/usuario/:id", Autenticacion, eliminarUsuario);  
router.get("/usuario/:id", Autenticacion, detalleUsuario);

// Rutas para gestión de periféricos (solo para admin)
router.get("/perifericos", Autenticacion, detallePeriferico);  
router.post("/registro", Autenticacion, registrarPeriferico);  
router.put("/:id", Autenticacion, actualizarPeriferico);  
router.delete("/:id", Autenticacion, eliminarPeriferico);  

// Rutas solo para admin: gestionar a otros admins
router.get("/admins", Autenticacion, listarAdmins);  
router.get("/d/:id", Autenticacion, detalleAdmin);  
router.delete("/e/:id", Autenticacion, eliminarAdmin);

// Exportar la variable router
export default router;
