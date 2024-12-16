import mongoose from "mongoose";

const audifonoSchema = new mongoose.Schema({
    marca: {
        type: String,
        required: true
    },
    tipo: {
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

const Audifono = mongoose.model("Audifono", audifonoSchema);
export default Audifono;
