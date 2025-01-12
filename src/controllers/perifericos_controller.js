
import mongoose from "mongoose";
import Perifericos from "../models/Perifericos.js"





// Método para ver el detalle de los Periféricos
const detallePeriferico = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(404).json({ msg: `Lo sentimos, no existe ese periférico` });

    const periferico = await Perifericos.findById(id);
    if (!periferico) return res.status(404).json({ msg: "Periférico no encontrado" });

    res.status(200).json(periferico);
};



// Método para registrar un periferico
const registrarPeriferico = async (req, res) => {
    const { nombre, categoria, precio, calidad } = req.body;
    
    // Validación para asegurarse de que los campos necesarios están presentes
    if (!nombre || !categoria || !precio || !calidad)
        return res.status(400).json({ msg: "Todos los campos son necesarios" });

    const periferico = new Perifericos(req.body);
    await periferico.save();

    res.status(200).json({ msg: `Registro exitoso del periférico ${periferico._id}`, periferico });
};




// Método para actualizar un Periférico
const actualizarPeriferico = async (req, res) => {
    const { id } = req.params;

    // Validación de campos vacíos
    if (Object.values(req.body).includes(""))
        return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" });

    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(404).json({ msg: `Lo sentimos, no existe el periférico ${id}` });

    const perifericoActualizado = await Perifericos.findByIdAndUpdate(id, req.body, { new: true });
    if (!perifericoActualizado)
        return res.status(404).json({ msg: "Periférico no encontrado" });

    res.status(200).json({ msg: "Actualización exitosa del periférico", periferico: perifericoActualizado });
};


// Método para eliminar un Periférico
const eliminarPeriferico = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(404).json({ msg: `Lo sentimos, no existe el periférico ${id}` });

    const perifericoEliminado = await Perifericos.findByIdAndDelete(id);
    if (!perifericoEliminado)
        return res.status(404).json({ msg: "Periférico no encontrado" });

    res.status(200).json({ msg: "Periférico eliminado exitosamente" });
};


// Método para cambiar el estado de un periférico (por ejemplo, si está disponible o no)
const cambiarEstado = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(404).json({ msg: `Lo sentimos, no existe el periférico ${id}` });

    const periferico = await Perifericos.findById(id);
    if (!periferico)
        return res.status(404).json({ msg: "Periférico no encontrado" });

    // Suponiendo que existe un campo "estado" para cambiar su disponibilidad
    periferico.estado = !periferico.estado;
    await periferico.save();

    res.status(200).json({ msg: "Estado del periférico modificado exitosamente", periferico });
};


export {
    detallePeriferico,
    registrarPeriferico,
    actualizarPeriferico,
    eliminarPeriferico,
    cambiarEstado,
};