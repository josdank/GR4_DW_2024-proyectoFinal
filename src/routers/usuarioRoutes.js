import express from "express";
import { registro, login, confirmEmail, recuperarPassword, newPassword, perfilUser, actualizarPassword } from "../controllers/usuarioControlador.js";

const router = express.Router();

router.post("/registro", registro);
router.post("/login", login);
router.get("/confirmar-email/:token", confirmEmail);
router.post("/recuperar-password", recuperarPassword);
router.post("/nuevo-password/:token", newPassword);
router.get("/perfil", perfilUser);
router.put("/actualizar-password", actualizarPassword);

export default router;
