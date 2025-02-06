import mongoose, { Schema, model } from 'mongoose';
import bcrypt from "bcryptjs";

// Definición del esquema para el Usuario
const usuarioSchema = new Schema({
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
        unique: true, 
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    celular: {
        type: String,
        required: true,
        trim: true
    },
    fechaRegistro: {
        type: Date,
        required: true,
        trim:true,
        default: Date.now()
    },
    estado: {
        type: Boolean,
        default: true
    },
    // Este campo puede ser relacionado a periféricos si el usuario está asociado con algún grupo de periféricos
    periféricosFavoritos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Perifericos'
    }],
    // Este campo puede ser útil si el usuario tiene roles específicos
    rol: {
        type: String,
        enum: ['admin', 'usuario'], // Roles como ejemplo
        default: 'usuario'
    }
}, {
    timestamps: true
});

// Método para cifrar el password del Usuario
usuarioSchema.methods.encrypPassword = async function (password) {
    const salt = await bcrypt.genSalt(10)
    const passwordEncryp = await bcrypt.hash(password,salt)
    return passwordEncryp
}

// Método para verificar si el password ingresado es el mismo que el de la BDD
usuarioSchema.methods.matchPassword = async function(password){
    const response = await bcrypt.compare(password,this.password)
    return response
}


// Método para agregar un periférico a los favoritos del usuario
usuarioSchema.methods.agregarFavorito = async function (perifericoId) {
    if (!this.periféricosFavoritos.includes(perifericoId)) {
        this.periféricosFavoritos.push(perifericoId);
        await this.save();
    }
};

// Método para eliminar un periférico de los favoritos del usuario
usuarioSchema.methods.eliminarFavorito = async function (perifericoId) {
    if (this.periféricosFavoritos.includes(perifericoId)) {
        this.periféricosFavoritos.pull(perifericoId);
        await this.save();
    }
};

export default model('Usuario', usuarioSchema);
