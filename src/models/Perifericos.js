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

    // Comparar especificaciones
    comparaciones.especificaciones = {};
    this.especificaciones.forEach((value, key) => {
        comparaciones.especificaciones[key] = value === otroPeriferico.especificaciones.get(key);
    });

    comparaciones.marca = this.marca === otroPeriferico.marca;

    return comparaciones;
};

export default model('Perifericos', perifericosSchema);