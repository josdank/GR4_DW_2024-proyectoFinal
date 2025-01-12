import mongoose, {Schema,model} from 'mongoose'



const perifericosSchema = new Schema({
    nombre:{
        type:String,
        require:true,
        trim:true
    },
    descripcion:{
        type:String,
        require:true,
        trim:true
    },
    switchs:{
        type:String,
        require:true,
        trim:true
    },
    calidad:{
        type:String,
        require:true,
        enum:['Baja','Media','Alta']
    },
    categoria: {
        type: String,
        enum: ['Teclado', 'Ratón', 'Audífono', 'Monitor', 'Otro'],
        required: true
    },
    precio: {
        type: Number,
        required: true
    },
    especificaciones: {
        type: Map,
        of: String
    },
    marca: {
        type: String,
        required: true
    },
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    }
},{
    timestamps:true
})
// Función de comparación extendida
perifericosSchema.methods.comparar = function (otroPeriferico) {
    const comparaciones = {};

    // Comparar calidad
    comparaciones.calidad = this.calidad === otroPeriferico.calidad;

    // Comparar precio
    comparaciones.precio = this.precio === otroPeriferico.precio;

    // Comparar categoría
    comparaciones.categoria = this.categoria === otroPeriferico.categoria;

    // Comparar especificaciones (por ejemplo, sensibilidad para ratones, tamaño para monitores, etc.)
    comparaciones.especificaciones = {};
    for (let [key, value] of this.especificaciones) {
        comparaciones.especificaciones[key] = value === otroPeriferico.especificaciones.get(key);
    }

    // Comparar marcas
    comparaciones.marca = this.marca === otroPeriferico.marca;

    return comparaciones;
};

export default model('Perifericos', perifericosSchema);