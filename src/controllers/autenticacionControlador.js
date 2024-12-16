import Usuario from "../models/usuarioModelo.js"; // Cambié el nombre de "veterinario" por "usuario" para adaptarlo a tu proyecto
import { sendMailToUser, sendMailToRecoveryPassword } from "../config/nodemailer.js";
import { generarJWT } from "../helpers/crearJWT.js";

// Registro de un nuevo usuario
const registro = async (req, res) => {
    const { email, password } = req.body;
    
    if (Object.values(req.body).includes("")) {
        return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" });
    }
    
    const verificarEmail = await Usuario.findOne({ email });
    if (verificarEmail) {
        return res.status(400).json({ msg: "Lo sentimos, este email ya está registrado" });
    }

    // Crear un nuevo usuario
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

    // Crear el JWT
    const token = generarJWT(usuarioBDD._id);

    res.status(200).json({ msg: "Bienvenido", token });
};

// Recuperación de contraseña
const recuperarPassword = async (req, res) => {
    const { email } = req.body;
    
    if (Object.values(req.body).includes("")) {
        return res.status(404).json({ msg: "Lo sentimos, debes llenar todos los campos" });
    }
    
    const usuarioBDD = await Usuario.findOne({ email });
    if (!usuarioBDD) {
        return res.status(404).json({ msg: "Lo sentimos, el usuario no se encuentra registrado" });
    }
    
    const token = usuarioBDD.crearToken();
    usuarioBDD.token = token;
    await sendMailToRecoveryPassword(email, token);
    await usuarioBDD.save();
    res.status(200).json({ msg: "Revisa tu correo electrónico para restablecer tu cuenta" });
};

// Confirmar el token de recuperación de contraseña
const tokenPassRecover = async (req, res) => {
    const { token } = req.params;
    
    if (!token) {
        return res.status(400).json({ msg: "Lo sentimos, no se puede validar su cuenta" });
    }
    
    const usuarioBDD = await Usuario.findOne({ token });
    if (usuarioBDD?.token !== token) {
        return res.status(400).json({ msg: "Lo sentimos, no se puede validar su token" });
    }
    
    res.status(200).json({ msg: "Token confirmado, ya puedes crear tu nuevo password" });
};

// Crear una nueva contraseña
const newPassword = async (req, res) => {
    const { password, confirmPassword } = req.body;

    if (Object.values(req.body).includes("")) {
        return res.status(404).json({ msg: "Lo sentimos, debes llenar todos los campos" });
    }
    
    if (password !== confirmPassword) {
        return res.status(404).json({ msg: "Las contraseñas no coinciden" });
    }

    const usuarioBDD = await Usuario.findOne({ token: req.params.token });
    if (usuarioBDD?.token !== req.params.token) {
        return res.status(404).json({ msg: "Lo sentimos, no se puede validar la cuenta" });
    }

    usuarioBDD.token = null;
    usuarioBDD.password = await usuarioBDD.encrypPassword(password);
    await usuarioBDD.save();
    res.status(200).json({ msg: "Contraseña cambiada exitosamente" });
};

// Perfil de usuario
const perfilUser = (req, res) => {
    res.status(200).json({ msg: "Perfil del usuario" });
};

// Actualizar perfil del usuario
const actualizarPerfil = (req, res) => {
    // Aquí agregarías la lógica para actualizar el perfil del usuario
    res.status(200).json({ msg: "Perfil actualizado correctamente" });
};

// Actualizar contraseña del usuario
const actualizarPassword = async (req, res) => {
    const { password, confirmPassword } = req.body;

    if (Object.values(req.body).includes("")) {
        return res.status(404).json({ msg: "Lo sentimos, debes llenar todos los campos" });
    }
    
    if (password !== confirmPassword) {
        return res.status(404).json({ msg: "Las contraseñas no coinciden" });
    }

    const usuarioBDD = await Usuario.findOne({ token: req.params.token });
    usuarioBDD.password = await usuarioBDD.encrypPassword(password);
    await usuarioBDD.save();
    res.status(200).json({ msg: "Contraseña cambiada exitosamente" });
};

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
