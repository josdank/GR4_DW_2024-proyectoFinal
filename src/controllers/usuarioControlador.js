import Usuario from "../models/usuarioModelo.js"; // Cambio de "veterinario" a "usuario"
import { sendMailToUser, sendMailToRecoveryPassword } from "../config/nodemailer.js";
import { generarJWT } from "../helpers/crearJWT.js";

// Función para registrar un nuevo usuario
const registro = async (req, res) => {
    const { email, password } = req.body;
    if (Object.values(req.body).includes("")) {
        return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" });
    }

    const verificarEmail = await Usuario.findOne({ email });
    if (verificarEmail) {
        return res.status(400).json({ msg: "Lo sentimos, este email ya está registrado" });
    }

    const nuevoUsuario = new Usuario(req.body);
    nuevoUsuario.password = await nuevoUsuario.encrypPassword(password);
    const token = nuevoUsuario.crearToken();
    await sendMailToUser(email, token);
    await nuevoUsuario.save();
    res.status(200).json({ msg: "Revisa tu correo para confirmar tu cuenta" });
};

// Confirmación del email del usuario
const confirmEmail = async (req, res) => {
    const { token } = req.params;

    if (!token) {
        return res.status(400).json({ msg: "Lo sentimos, no se puede validar la cuenta" });
    }

    const usuarioBDD = await Usuario.findOne({ token });
    if (!usuarioBDD?.token) {
        return res.status(404).json({ msg: "La cuenta ya ha sido confirmada" });
    }

    usuarioBDD.token = null;
    usuarioBDD.confirmEmail = true;
    await usuarioBDD.save();
    res.status(200).json({ msg: "Token confirmado, ya puedes iniciar sesión" });
};

// Login del usuario
const login = async (req, res) => {
    const { email, password } = req.body;

    if (Object.values(req.body).includes("")) {
        return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" });
    }

    const usuarioBDD = await Usuario.findOne({ email });
    if (usuarioBDD?.confirmEmail === false) {
        return res.status(400).json({ msg: "Lo sentimos, debes validar tu cuenta" });
    }

    if (!usuarioBDD) {
        return res.status(400).json({ msg: "Lo sentimos, el email no se encuentra registrado" });
    }

    const verificarPassword = await usuarioBDD.matchPassword(password);
    if (!verificarPassword) {
        return res.status(400).json({ msg: "Lo sentimos, el password no es el correcto" });
    }

    const token = generarJWT(usuarioBDD._id);

    res.status(200).json({ msg: "Bienvenido", token });
};

// Funciones de recuperación de contraseña, perfil, actualización, etc.

export {
    registro,
    login,
    confirmEmail,
    recuperarPassword,
    tokenPassRecover,
    newPassword,
    perfilUser,
    actualizarPerfil,
    actualizarPassword
};
