import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const conectarDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Base de datos conectada");
    } catch (error) {
        console.log("Error al conectar a la base de datos", error);
        process.exit(1);
    }
};

export default conectarDB;
