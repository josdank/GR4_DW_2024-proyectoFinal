import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const usuarioSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    token: { type: String, default: null },
    confirmEmail: { type: Boolean, default: false }
});

// Encriptar la contraseña
usuarioSchema.methods.encrypPassword = async function (password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

// Comparar la contraseña
usuarioSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Crear un token
usuarioSchema.methods.crearToken = function () {
    const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token;
};

const Usuario = mongoose.model("Usuario", usuarioSchema);

export default Usuario;
