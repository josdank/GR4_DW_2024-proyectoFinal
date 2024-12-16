import mongoose from "mongoose";

const dispositivoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    categoria: {
        type: String,
        required: true
    },
    precio: {
        type: Number,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    }
});

const Dispositivo = mongoose.model("Dispositivo", dispositivoSchema);
export default Dispositivo;
