import jwt from "jsonwebtoken";
import Veterinario from "../models/veterinario.js";

const generarJWT = (id,rol)=>{
    return jwt.sign({id,rol},process.env.JWT_SECRET,{expiresIn:"1d"})
}

const verificarAutentificacion = async (req, res, next) => {
    if(!req.headers.authorization) return res.status(404).json({msg:"Lo sentimos, debes proprocionar un token"}) 
    
        const {authorization} = req.headers
        try {
            const {id,rol} = jwt.verify(authorization.split(' ')[1],process.env.JWT_SECRET)
            if (rol==="veterinario"){
                req.veterinarioBDD = await Veterinario.findById(id).lean().select("-password")
                next()
            }
        } catch (error) {
            const e = new Error("Formato del token no válido")
            return res.status(404).json({msg:e.message})
        }
}


export  {generarJWT, verificarAutentificacion}