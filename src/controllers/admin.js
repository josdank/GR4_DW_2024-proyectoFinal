import Teclado from "../models/tecladoModelo.js";
import Audifono from "../models/categoriaModelo.js";
import Periferico from "../models/productoModelo.js";
import Dispositivo from "../models/pedidoModelo.js";
import { generarJWT } from "../helpers/crearJWT.js";

// Obtener todos los dispositivos (teclados, audífonos, periféricos y dispositivos)
const obtenerDispositivosAdmin = async (req, res) => {
    try {
        const teclados = await Teclado.find();
        const audifonos = await Audifono.find();
        const perifericos = await Periferico.find();
        const dispositivos = await Dispositivo.find();

        res.status(200).json({
            teclados,
            audifonos,
            perifericos,
            dispositivos
        });
    } catch (error) {
        res.status(500).json({ msg: "Error al obtener los dispositivos", error });
    }
};

// Agregar un nuevo dispositivo
const agregarDispositivoAdmin = async (req, res) => {
    const { tipo, datos } = req.body;

    try {
        let nuevoDispositivo;
        switch (tipo) {
            case 'teclado':
                nuevoDispositivo = new Teclado(datos);
                break;
            case 'audifono':
                nuevoDispositivo = new Audifono(datos);
                break;
            case 'periferico':
                nuevoDispositivo = new Periferico(datos);
                break;
            case 'dispositivo':
                nuevoDispositivo = new Dispositivo(datos);
                break;
            default:
                return res.status(400).json({ msg: "Tipo de dispositivo no válido" });
        }

        await nuevoDispositivo.save();
        res.status(201).json({ msg: "Dispositivo agregado correctamente", nuevoDispositivo });
    } catch (error) {
        res.status(500).json({ msg: "Error al agregar el dispositivo", error });
    }
};

// Eliminar un dispositivo
const eliminarDispositivoAdmin = async (req, res) => {
    const { id, tipo } = req.params;

    try {
        let dispositivoEliminado;
        switch (tipo) {
            case 'teclado':
                dispositivoEliminado = await Teclado.findByIdAndDelete(id);
                break;
            case 'audifono':
                dispositivoEliminado = await Audifono.findByIdAndDelete(id);
                break;
            case 'periferico':
                dispositivoEliminado = await Periferico.findByIdAndDelete(id);
                break;
            case 'dispositivo':
                dispositivoEliminado = await Dispositivo.findByIdAndDelete(id);
                break;
            default:
                return res.status(400).json({ msg: "Tipo de dispositivo no válido" });
        }

        if (!dispositivoEliminado) {
            return res.status(404).json({ msg: "Dispositivo no encontrado" });
        }

        res.status(200).json({ msg: "Dispositivo eliminado correctamente", dispositivoEliminado });
    } catch (error) {
        res.status(500).json({ msg: "Error al eliminar el dispositivo", error });
    }
};

// Obtener todos los usuarios
const obtenerUsuarios = async (req, res) => {
    const usuarios = await Usuario.find();
    res.status(200).json({ usuarios });
};

// Eliminar un usuario
const eliminarUsuario = async (req, res) => {
    const { id } = req.params;
    const usuario = await Usuario.findByIdAndDelete(id);
    if (!usuario) {
        return res.status(404).json({ msg: "Usuario no encontrado" });
    }
    res.status(200).json({ msg: "Usuario eliminado correctamente" });
};

// Asignar un nuevo rol a un usuario
const asignarRol = async (req, res) => {
    const { id, rol } = req.body;
    const usuario = await Usuario.findById(id);
    if (!usuario) {
        return res.status(404).json({ msg: "Usuario no encontrado" });
    }
    usuario.rol = rol;
    await usuario.save();
    res.status(200).json({ msg: "Rol asignado correctamente", usuario });
};

export {
    obtenerDispositivosAdmin,
    agregarDispositivoAdmin,
    eliminarDispositivoAdmin,
    obtenerUsuarios,
    eliminarUsuario,
    asignarRol
};
