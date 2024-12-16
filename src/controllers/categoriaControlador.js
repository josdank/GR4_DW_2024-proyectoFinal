import Categoria from "../models/categoria.js";  // Modelo de Categoría

// Obtener todas las categorías
const obtenerCategorias = async (req, res) => {
    try {
        const categorias = await Categoria.find(); // Obtener todas las categorías
        res.status(200).json(categorias);
    } catch (error) {
        res.status(500).json({ msg: "Error al obtener las categorías", error });
    }
};

// Crear una nueva categoría
const crearCategoria = async (req, res) => {
    const { nombre, descripcion } = req.body;

    if (!nombre || !descripcion) {
        return res.status(400).json({ msg: "Todos los campos son requeridos" });
    }

    try {
        const nuevaCategoria = new Categoria(req.body);
        await nuevaCategoria.save(); // Guardar la nueva categoría
        res.status(201).json(nuevaCategoria);
    } catch (error) {
        res.status(500).json({ msg: "Error al crear la categoría", error });
    }
};

// Eliminar una categoría
const eliminarCategoria = async (req, res) => {
    const { id } = req.params;

    try {
        const categoriaEliminada = await Categoria.findByIdAndDelete(id);
        if (!categoriaEliminada) {
            return res.status(404).json({ msg: "Categoría no encontrada" });
        }
        res.status(200).json({ msg: "Categoría eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ msg: "Error al eliminar la categoría", error });
    }
};

export {
    obtenerCategorias,
    crearCategoria,
    eliminarCategoria
};
