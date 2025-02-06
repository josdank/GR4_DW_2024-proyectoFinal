// Importar el Schema y el modelo de mongoose
import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';

const AdminSchema = new Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    apellido: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    permisos: {
        type: [String],
        default: ['manage-users', 'manage-peripherals'],  // Permisos por defecto
    },
    status: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Método para cifrar el password del administrador
AdminSchema.methods.encrypPassword = async function(password) {
    const salt = await bcrypt.genSalt(10);
    const passwordEncryp = await bcrypt.hash(password, salt);
    return passwordEncryp;
};

// Método para verificar si el password ingresado es el mismo de la BDD
AdminSchema.methods.matchPassword = async function(password) {
    const response = await bcrypt.compare(password, this.password);
    return response;
};

// Método para crear un token 
AdminSchema.methods.crearToken = function(){
    const tokenGenerado = this.token = Math.random().toString(36).slice(2)
    return tokenGenerado
}
export default model('Admin', AdminSchema);

//Subersivo