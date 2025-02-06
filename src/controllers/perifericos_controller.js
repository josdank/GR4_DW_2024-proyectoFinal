
import mongoose from "mongoose";
import Periferico from "../models/Perifericos.js"


// Método para ver el detalle de los Periféricos
const detallePeriferico = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(404).json({ msg: `Lo sentimos, no existe ese periférico` });

    const periferico = await Periferico.findById(id);
    if (!periferico) return res.status(404).json({ msg: "Periférico no encontrado" });

    res.status(200).json(periferico);
};



// Método para registrar un periférico
const registrarPeriferico = async (req, res) => {
    const { nombre, categoria, precio, calidad, especificaciones, descripcion, switchs, marca } = req.body;

    // Validación para asegurarse de que los campos necesarios están presentes
    if (!nombre || !categoria || !precio || !calidad || !descripcion || !switchs || !marca)
        return res.status(400).json({ msg: "Todos los campos son necesarios" });

    try {
        const periferico = new Periferico({
            nombre,
            categoria,
            precio,
            calidad,
            especificaciones,
            descripcion,
            switchs,
            marca
        });
        await periferico.save();
        res.status(200).json({ msg: `Registro exitoso del periférico ${periferico._id}, periferico`});
    } catch (error) {
        res.status(400).json({ msg: "Error al registrar el periférico", error });
    }
};


// Método para actualizar un Periférico
const actualizarPeriferico = async (req, res) => {
    const { id } = req.params;

    // Validación de campos vacíos
    if (Object.values(req.body).includes(""))
        return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" });

    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(404).json({ msg: `Lo sentimos, no existe el periférico ${id}` });

    const perifericoActualizado = await Periferico.findByIdAndUpdate(id, req.body, { new: true });
    if (!perifericoActualizado)
        return res.status(404).json({ msg: "Periférico no encontrado" });

    res.status(200).json({ msg: "Actualización exitosa del periférico", periferico: perifericoActualizado });
};


// Método para eliminar un Periférico
const eliminarPeriferico = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(404).json({ msg: `Lo sentimos, no existe el periférico ${id}` });

    const perifericoEliminado = await Periferico.findByIdAndDelete(id);
    if (!perifericoEliminado)
        return res.status(404).json({ msg: "Periférico no encontrado" });

    res.status(200).json({ msg: "Periférico eliminado exitosamente" });
};


export {
    detallePeriferico,
    registrarPeriferico,
    actualizarPeriferico,
    eliminarPeriferico,
};