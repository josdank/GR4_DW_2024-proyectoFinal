import mongoose from "mongoose";

const tecladoSchema = new mongoose.Schema({
    marca: {
        type: String,
        required: true
    },
    modelo: {
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

const Teclado = mongoose.model("Teclado", tecladoSchema);
export default Teclado;
