import mongoose from "mongoose";

const perifericoSchema = new mongoose.Schema({
    tipo: {
        type: String,
        required: true
    },
    marca: {
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

const Periferico = mongoose.model("Periferico", perifericoSchema);
export default Periferico;
