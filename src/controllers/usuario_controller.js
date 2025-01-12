// IMPORTAR EL MODELO
import Usuario from "../models/Usuario.js"

// IMPORTAR EL MÉTODO sendMailToPaciente
import { sendMailToUsuario } from "../config/nodemailer.js"

import mongoose from "mongoose"
import generarJWT from "../helpers/crearJWT.js"

// Método para el proceso de login
const loginUsuario = async(req,res)=>{
    const {email, password} = req.body

    if (Object.values(req.body).includes("")) return res.status(404).json({msg:"Lo sentimos, debes llenar todos los campos"})

    const usuarioBDD = await Usuario.findOne({email})

    if(!usuarioBDD) return res.status(404).json({msg:"Lo sentimos, el usuario no se encuentra registrado"})

    const verificarPassword = await usuarioBDD.matchPassword(password)

    if(!verificarPassword) return res.status(404).json({msg:"Lo sentimos, el password no es el correcto"})

    const token = generarJWT(usuarioBDD._id, "usuario")

	const {nombre, apellido, email: emailP, celular, _id} = usuarioBDD

    res.status(200).json({
        token,
        nombre,
        apellido,
        emailP,
        celular,
        _id
    })
}

// Método para ver el perfil del usuario
const perfilUsuario = (req,res)=>{
    delete req.usuarioBDD.password
    delete req.usuarioBDD.createdAt
    delete req.usuarioBDD.updatedAt
    delete req.usuarioBDD.__v
    res.status(200).json(req.usuarioBDD)
}

// Método para listar todos los usuarios
const listarUsuarios = async (req,res)=>{
    const usuarios = await Usuario.find({estado:true}).select("-password -createdAt -updatedAt -__v")
    res.status(200).json(usuarios)
}

// Método para ver el detalle de un usuario en particular
const detalleUsuario = async(req,res)=>{
    const {id} = req.params
    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg:`Lo sentimos, no existe el usuario ${id}`});
    const usuario = await Usuario.findById(id).select("-createdAt -updatedAt -__v")
    res.status(200).json(usuario)
}

// Método para registrar un usuario
const registrarUsuario = async(req,res)=>{

    const {email} = req.body

    // Validar todos los campos
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
    
    // Obtener el usuario en base al email
    const verificarEmailBDD = await Usuario.findOne({email})

    // Verificar si el usuario ya se encuentra registrado
    if(verificarEmailBDD) return res.status(400).json({msg:"Lo sentimos, el email ya se encuentra registrado"})

    // Crear una instancia del Usuario
    const nuevoUsuario = new Usuario(req.body)

    // Crear un password
    const password = Math.random().toString(36).slice(2)

    // Encriptar el password
    nuevoUsuario.password = await nuevoUsuario.encrypPassword("user"+password)

    // Enviar el correo electrónico
    await sendMailToUsuario(email, "user"+password)

    // Guardar en la base de datos
    await nuevoUsuario.save()

    // Presentar resultados
    res.status(200).json({msg:"Registro exitoso del usuario y correo enviado"})
}

// Método para actualizar un usuario
const actualizarUsuario = async(req,res)=>{
    const {id} = req.params

    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})

    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg:`Lo sentimos, no existe el usuario ${id}`});

    await Usuario.findByIdAndUpdate(req.params.id, req.body)

    res.status(200).json({msg:"Actualización exitosa del usuario"})
}

// Método para eliminar (dar de baja) un usuario
const eliminarUsuario = async (req,res)=>{
    const {id} = req.params

    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})

    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg:`Lo sentimos, no existe el usuario ${id}`})

    await Usuario.findByIdAndUpdate(req.params.id, {estado: false})

    res.status(200).json({msg:"Usuario dado de baja exitosamente"})
}

export {
    loginUsuario,
    perfilUsuario,
    listarUsuarios,
    detalleUsuario,
    registrarUsuario,
    actualizarUsuario,
    eliminarUsuario
}
