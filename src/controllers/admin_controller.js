// Importar el modelo 
import { sendMailToUsuario, sendMailToRecoveryPassword } from "../config/nodemailer.js"
import generarJWT from "../helpers/crearJWT.js"
import Admin from "../models/Admin.js"
import mongoose from "mongoose";

// Método para el login
const login = async(req,res)=>{
    const {email,password} = req.body

    if (Object.values(req.body).includes("")) return res.status(404).json({msg:"Lo sentimos, debes llenar todos los campos"})
    
    const adminBDD = await Admin.findOne({email}).select("-status -__v -token -updatedAt -createdAt")
    
    if(adminBDD?.confirmEmail===false) return res.status(403).json({msg:"Lo sentimos, debe verificar su cuenta"})
    
    if(!adminBDD) return res.status(404).json({msg:"Lo sentimos, el usuario no se encuentra registrado"})
    
    const verificarPassword = await adminBDD.matchPassword(password)
    
    if(!verificarPassword) return res.status(404).json({msg:"Lo sentimos, el password no es el correcto"})
    
    const token = generarJWT(adminBDD._id,"admin")

    const {nombre,apellido,direccion,telefono,_id} = adminBDD
    
    res.status(200).json({
        token,
        nombre,
        apellido,
        direccion,
        telefono,
        _id,
        email:adminBDD.email,
        rol:"admin"
    })
}

// Método para mostrar el perfil 
const perfil =(req,res)=>{
    delete req.adminBDD.token
    delete req.adminBDD.confirmEmail
    delete req.adminBDD.createdAt
    delete req.adminBDD.updatedAt
    delete req.adminBDD.__v
    req.adminBDD.rol = "admin"
    res.status(200).json(req.adminBDD)
}

// Método para el registro
const registro = async (req,res)=>{
    // Desestructurar los campos 
    const {email,password} = req.body
    // Validar todos los campos llenos
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
    // Obtener el usuario de la BDD en base al email
    const verificarEmailBDD = await Admin.findOne({email})
    // Validar que el email sea nuevo
    if(verificarEmailBDD) return res.status(400).json({msg:"Lo sentimos, el email ya se encuentra registrado"})

    // Crear la instancia del admin
    const nuevoAdmin = new Admin(req.body)
    // Encriptar el password
    nuevoAdmin.password = await nuevoAdmin.encrypPassword(password)
    //Crear el token 
    const token = nuevoAdmin.crearToken()
    // Invocar la función para el envío de correo 
    await sendMailToUsuario(email,token)
    // Guardar en BDD
    await nuevoAdmin.save()
    // Imprimir el mensaje
    res.status(200).json({msg:"Revisa tu correo electrónico para confirmar tu cuenta"})
}

// Método para confirmar el token
const confirmEmail = async(req,res)=>{

    if(!(req.params.token)) return res.status(400).json({msg:"Lo sentimos, no se puede validar la cuenta"})

    const adminBDD = await Admin.findOne({token:req.params.token})

    if(!adminBDD?.token) return res.status(404).json({msg:"La cuenta ya ha sido confirmada"})
     
    adminBDD.token = null

    adminBDD.confirmEmail=true

    await adminBDD.save()

    res.status(200).json({msg:"Token confirmado, ya puedes iniciar sesión"}) 
}

// Método para listar admins
const listarAdmins = (req,res)=>{
    res.status(200).json({res:'lista de admins registrados'})
}

// Método para mostrar el detalle de un admin en particular
const detalleAdmin = async(req,res)=>{
    const {id} = req.params
    const adminBDD = await Admin.findById(id)
    res.status(200).json(adminBDD)
}

// Método para actualizar el perfil
const actualizarPerfil = async (req,res)=>{
    const {id} = req.params
    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg:"Lo sentimos, debe ser un id válido"});
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
    const adminBDD = await Admin.findById(id)
    if(!adminBDD) return res.status(404).json({msg:`Lo sentimos, no existe el admin ${id}`})
    if (adminBDD.email !=  req.body.email)
    {
        const adminBDDMail = await Admin.findOne({email:req.body.email})
        if (adminBDDMail)
        {
            return res.status(404).json({msg:"Lo sentimos, el email ya se encuentra registrado"})  
        }
    }
	
    adminBDD.nombre = req.body.nombre || adminBDD?.nombre
    adminBDD.apellido = req.body.apellido  || adminBDD?.apellido
    adminBDD.direccion = req.body.direccion ||  adminBDD?.direccion
    adminBDD.telefono = req.body.telefono || adminBDD?.telefono
    adminBDD.email = req.body.email || adminBDD?.email
    await adminBDD.save()
    res.status(200).json({msg:"Perfil actualizado correctamente"})
}

// Método para actualizar el password
const actualizarPassword = async (req,res)=>{
    const adminBDD = await Admin.findById(req.adminBDD._id)
    if(!adminBDD) return res.status(404).json({msg:`Lo sentimos, no existe el admin ${id}`})
    const verificarPassword = await adminBDD.matchPassword(req.body.passwordactual)
    if(!verificarPassword) return res.status(404).json({msg:"Lo sentimos, el password actual no es el correcto"})
    adminBDD.password = await adminBDD.encrypPassword(req.body.passwordnuevo)
    await adminBDD.save()
    res.status(200).json({msg:"Password actualizado correctamente"})
}

// Método para recuperar el password
const recuperarPassword = async(req,res)=>{
    const {email} = req.body
    if (Object.values(req.body).includes("")) return res.status(404).json({msg:"Lo sentimos, debes llenar todos los campos"})
    const adminBDD = await Admin.findOne({email})
    if(!adminBDD) return res.status(404).json({msg:"Lo sentimos, el usuario no se encuentra registrado"})
    const token = adminBDD.crearToken()
    adminBDD.token=token
    await sendMailToRecoveryPassword(email,token)
    await adminBDD.save()
    res.status(200).json({msg:"Revisa tu correo electrónico para reestablecer tu cuenta"})
}

// Método para comprobar el token
const comprobarTokenPasword = async (req,res)=>{
    if(!(req.params.token)) return res.status(404).json({msg:"Lo sentimos, no se puede validar la cuenta"})
    const adminBDD = await Admin.findOne({token:req.params.token})
    if(adminBDD?.token !== req.params.token) return res.status(404).json({msg:"Lo sentimos, no se puede validar la cuenta"})
    await adminBDD.save()
    res.status(200).json({msg:"Token confirmado, ya puedes crear tu nuevo password"}) 
}

// Método para crear el nuevo password
const nuevoPassword = async (req,res)=>{
    const{password,confirmpassword} = req.body
    if (Object.values(req.body).includes("")) return res.status(404).json({msg:"Lo sentimos, debes llenar todos los campos"})
    if(password != confirmpassword) return res.status(404).json({msg:"Lo sentimos, los passwords no coinciden"})
    const adminBDD = await Admin.findOne({token:req.params.token})
    if(adminBDD?.token !== req.params.token) return res.status(404).json({msg:"Lo sentimos, no se puede validar la cuenta"})
    adminBDD.token = null
    adminBDD.password = await adminBDD.encrypPassword(password)
    await adminBDD.save()
    res.status(200).json({msg:"Felicitaciones, ya puedes iniciar sesión con tu nuevo password"}) 
}


// Exportar cada uno de los métodos
export {
    login,
    perfil,
    registro,
    confirmEmail,
    listarAdmins,
    detalleAdmin,
    actualizarPerfil,
    actualizarPassword,
    recuperarPassword,
    comprobarTokenPasword,
    nuevoPassword
}
