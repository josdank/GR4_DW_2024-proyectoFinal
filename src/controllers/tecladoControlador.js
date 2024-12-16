import Teclado from "../models/teclado.js"; // Modelo de Teclado

// Obtener todos los teclados
const obtenerTeclados = async (req, res) => {
    try {
        const teclados = await Teclado.find(); // Buscar todos los teclados
        res.status(200).json(teclados);
    } catch (error) {
        res.status(500).json({ msg: "Error al obtener los teclados", error });
    }
};

// Obtener un teclado específico
const obtenerTeclado = async (req, res) => {
    const { id } = req.params;
    
    try {
        const teclado = await Teclado.findById(id); // Buscar el teclado por su ID
        if (!teclado) {
            return res.status(404).json({ msg: "Teclado no encontrado" });
        }
        res.status(200).json(teclado);
    } catch (error) {
        res.status(500).json({ msg: "Error al obtener el teclado", error });
    }
};

// Agregar un nuevo teclado
const agregarTeclado = async (req, res) => {
    try {
        const nuevoTeclado = new Teclado(req.body);
        await nuevoTeclado.save(); // Guardar el nuevo teclado en la base de datos
        res.status(201).json(nuevoTeclado);
    } catch (error) {
        res.status(500).json({ msg: "Error al agregar el teclado", error });
    }
};

// Actualizar un teclado existente
const actualizarTeclado = async (req, res) => {
    const { id } = req.params;
    
    try {
        const tecladoActualizado = await Teclado.findByIdAndUpdate(id, req.body, { new: true });
        if (!tecladoActualizado) {
            return res.status(404).json({ msg: "Teclado no encontrado" });
        }
        res.status(200).json(tecladoActualizado);
    } catch (error) {
        res.status(500).json({ msg: "Error al actualizar el teclado", error });
    }
};

// Eliminar un teclado
const eliminarTeclado = async (req, res) => {
    const { id } = req.params;
    
    try {
        const tecladoEliminado = await Teclado.findByIdAndDelete(id);
        if (!tecladoEliminado) {
            return res.status(404).json({ msg: "Teclado no encontrado" });
        }
        res.status(200).json({ msg: "Teclado eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ msg: "Error al eliminar el teclado", error });
    }
};

export {
    obtenerTeclados,
    obtenerTeclado,
    agregarTeclado,
    actualizarTeclado,
    eliminarTeclado
};
