import { Router } from 'express';
const router = Router();

import {
    detallePeriferico,
    registrarPeriferico,
    actualizarPeriferico,
    eliminarPeriferico,

} from "../controllers/perifericos_controller.js";

import verificarAutenticacion from "../middlewares/autenticacion.js";

// Ruta para registrar un periférico
router.post('/registro', verificarAutenticacion, registrarPeriferico);

// Ruta para ver el detalle de un periférico
router.get('/:id', verificarAutenticacion, detallePeriferico);

// Ruta para actualizar un periférico
router.put('/:id', verificarAutenticacion, actualizarPeriferico);

// Ruta para eliminar un periférico
router.delete('/:id', verificarAutenticacion, eliminarPeriferico);


export default router;
