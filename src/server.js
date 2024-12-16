const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const puerto = process.env.PUERTO || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Conectar a la base de datos usando la URI de .env
const conectarBaseDeDatos = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Conexión a la base de datos exitosa');
    } catch (error) {
        console.error('Error al conectar a la base de datos', error);
    }
};

conectarBaseDeDatos();

// Rutas
const tecladosRutas = require('./src/rutas/tecladosRutas');
const audifonosRutas = require('./src/rutas/audifonosRutas');
const perifericosRutas = require('./src/rutas/perifericosRutas');
const dispositivosRutas = require('./src/rutas/dispositivosRutas');

app.use('/api/teclados', tecladosRutas);
app.use('/api/audifonos', audifonosRutas);
app.use('/api/perifericos', perifericosRutas);
app.use('/api/dispositivos', dispositivosRutas);

// Iniciar servidor
app.listen(puerto, () => {
    console.log(`Servidor escuchando en el puerto ${puerto}`);
});
