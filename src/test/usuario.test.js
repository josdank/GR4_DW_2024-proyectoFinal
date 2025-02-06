import mongoose from 'mongoose';
import Usuario from '../models/Usuario';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create({
    instance: {
      launchTimeout: 30000, // Aumenta el timeout de inicio a 30 segundos
    },
    binary: {
      version: '4.4.6', // Especifica una versión compatible de MongoDB
    },
  });
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
}, 30000); // Aumenta el timeout a 30 segundos

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
});

describe('Usuario Model Test', () => {
  it('Crear y guardar un usuario correctamente', async () => {
    const usuarioData = { 
      nombre: 'Juan', 
      apellido: 'Perez', 
      email: 'juan.perez@example.com', 
      password: 'password123', 
      celular: '1234567890' 
    };
    const usuario = new Usuario(usuarioData);
    const savedUsuario = await usuario.save();

    expect(savedUsuario._id).toBeDefined();
    expect(savedUsuario.nombre).toBe(usuarioData.nombre);
    expect(savedUsuario.apellido).toBe(usuarioData.apellido);
    expect(savedUsuario.email).toBe(usuarioData.email);
    expect(savedUsuario.celular).toBe(usuarioData.celular);
  }, 30000); // Aumenta el timeout a 30 segundos

  it('Cifrar el password del usuario', async () => {
    const usuario = new Usuario({ 
      nombre: 'Juan', 
      apellido: 'Perez', 
      email: 'juan.perez@example.com', 
      password: 'password123', 
      celular: '1234567890' 
    });
    usuario.password = await usuario.encrypPassword(usuario.password);
    const savedUsuario = await usuario.save();

    expect(savedUsuario.password).not.toBe('password123');
  }, 30000); // Aumenta el timeout a 30 segundos

  it('Autenticar el password del usuario', async () => {
    const usuario = new Usuario({ 
      nombre: 'Juan', 
      apellido: 'Perez', 
      email: 'juan.perez@example.com', 
      password: 'password123', 
      celular: '1234567890' 
    });
    usuario.password = await usuario.encrypPassword(usuario.password);
    await usuario.save();

    const isMatch = await usuario.matchPassword('password123');
    expect(isMatch).toBe(true);

    const isNotMatch = await usuario.matchPassword('wrongpassword');
    expect(isNotMatch).toBe(false);
  }, 30000); // Aumenta el timeout a 30 segundos
});