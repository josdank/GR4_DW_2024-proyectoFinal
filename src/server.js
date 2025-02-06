// Requerir los módulos
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors';

// importación de rutas
import admin from './routers/admin_routes.js'
import usuario from './routers/usuario_routes.js'
import perifericos from './routers/periferico_routes.js'


// Inicializaciones
dotenv.config()
const app = express()

// Configuraciones 
app.set('port',process.env.PORT || 3000)
app.use(cors())

// Middlewares 
app.use(express.json())
app.use(express.urlencoded({ extended: true }));


// Ruta para mostrar "Servidor en línea"
app.get('/', (req, res) => {
    res.send('Servidor en línea');
});

// Rutas 
app.use('/api/admin',admin)
app.use('/api/usuario',usuario)
app.use('/api/periferico',perifericos)



// Manejo de una ruta que no sea encontrada
app.use((req, res) => res.status(404).json({ error: "Endpoint no encontrado - 404" }));


// Exportar la instancia de express por medio de app
export default  app