// Importar el Schema y el modelo de mongoose
import { Schema, model } from 'mongoose';

const usuarioAdminSchema = new Schema({
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
usuarioAdminSchema.methods.encrypPassword = async function(password) {
    const salt = await bcrypt.genSalt(10);
    const passwordEncryp = await bcrypt.hash(password, salt);
    return passwordEncryp;
};

// Método para verificar si el password ingresado es el mismo de la BDD
usuarioAdminSchema.methods.matchPassword = async function(password) {
    const response = await bcrypt.compare(password, this.password);
    return response;
};

export default model('UsuarioAdmin', usuarioAdminSchema);

//Subersivo