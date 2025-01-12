import { Router } from 'express';
const router = Router();

import {
    detallePeriferico,
    registrarPeriferico,
    actualizarPeriferico,
    eliminarPeriferico,
    cambiarEstado
} from "../controllers/perifericos_controller.js";

import verificarAutenticacion from "../middlewares/autenticacion.js";

// Ruta para registrar un periférico
router.post('/perifericos/registro', verificarAutenticacion, registrarPeriferico);

// Ruta para ver el detalle de un periférico
router.get('/perifericos/:id', verificarAutenticacion, detallePeriferico);

// Ruta para actualizar un periférico
router.put('/perifericos/:id', verificarAutenticacion, actualizarPeriferico);

// Ruta para eliminar un periférico
router.delete('/perifericos/:id', verificarAutenticacion, eliminarPeriferico);

// Ruta para cambiar el estado de un periférico (por ejemplo, disponibilidad)
router.patch('/perifericos/estado/:id', verificarAutenticacion, cambiarEstado);

export default router;
