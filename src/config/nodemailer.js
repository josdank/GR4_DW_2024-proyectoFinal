import nodemailer from "nodemailer"
import dotenv from 'dotenv'
dotenv.config()

let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: process.env.HOST_MAILTRAP,
    port: process.env.PORT_MAILTRAP,
    auth: {
        user: process.env.USER_MAILTRAP,
        pass: process.env.PASS_MAILTRAP,
    }
});

// Enviar correo de confirmación para usuario
const sendMailToUsuario = (userMail, token) => {
    let mailOptions = {
        from: process.env.USER_MAILTRAP,
        to: userMail,
        subject: "Verifica tu cuenta",
        html: `<p>Hola, haz clic <a href="${process.env.URL_FRONTEND}confirmar/${encodeURIComponent(token)}">aquí</a> para confirmar tu cuenta.</p>`
    };
    
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Correo enviado: ' + info.response);
        }
    });
};

// Enviar correo para recuperación de contraseña
const sendMailToRecoveryPassword = async(userMail, token) => {
    let info = await transporter.sendMail({
        from: 'admin@tec.com',
        to: userMail,
        subject: "Correo para reestablecer tu contraseña",
        html: `
        <h1>Sistema de gestión (ADJOS 🎮 😎)</h1>
        <hr>
        <a href="${process.env.URL_FRONTEND}recuperar-password/${token}">Clic para reestablecer tu contraseña</a>
        <hr>
        <footer>ADJOS technologies te da la Bienvenida!</footer>
        `
    });
    console.log("Mensaje enviado satisfactoriamente: ", info.messageId);
};

// Enviar correo de bienvenida al usuario con la contraseña asignada
const sendMailToUsuarioBienvenida = async(userMail, password) => {
    let info = await transporter.sendMail({
        from: 'admin@vet.com',
        to: userMail,
        subject: "Correo de bienvenida",
        html: `
        <h1>Sistema de gestión 😎🎮</h1>
        <hr>
        <p>Contraseña de acceso: ${password}</p>
        <a href="${process.env.URL_BACKEND}User/login">Clic para iniciar sesión</a>
        <hr>
        <footer>Te damos la Bienvenida!</footer>
        `
    });
    console.log("Mensaje enviado satisfactoriamente: ", info.messageId);
}

export {
    sendMailToUsuario,
    sendMailToRecoveryPassword,
    sendMailToUsuarioBienvenida
}
