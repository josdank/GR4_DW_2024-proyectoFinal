import { Router } from "express";
import {
    obtenerDispositivosAdmin,
    agregarDispositivoAdmin,
    eliminarDispositivoAdmin
} from "../controllers/admin.js";

const router = Router();

// Rutas para obtener dispositivos
router.get("/dispositivos", obtenerDispositivosAdmin);

// Ruta para agregar un dispositivo
router.post("/dispositivos", agregarDispositivoAdmin);

// Ruta para eliminar un dispositivo
router.delete("/dispositivos/:id/:tipo", eliminarDispositivoAdmin);

export default router;
