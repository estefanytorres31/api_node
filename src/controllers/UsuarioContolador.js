import {connect} from "../database";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import nodemailer from "nodemailer"

const paises = require("i18n-iso-countries");

paises.registerLocale(require("i18n-iso-countries/langs/es.json"))

export const listaPaises=async(req,res)=>{
    const listaPaises=Object.values(paises.getNames('es', {select: "official"}))
    res.json(listaPaises)
}

function validarNombrePais(pais) {
    const lista = paises.getNames('es');
    return Object.values(lista).includes(pais);
  }

export const crearUsuario=async (req, res)=>{
    try {
        const connection = await connect();
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const pais=req.body.pais
        if(!validarNombrePais(pais)){
            return res.status(400).json({ error: "Pais inválido" });
        }
        const [results] = await connection.execute(
          "INSERT INTO usuarios(nombre, email, password, pais) VALUES (?, ?,?,?)",
          [req.body.nombre, req.body.email, hashedPassword, pais]
        );
    
        const newUsuario = {
            id: results.insertId, 
            nombre: req.body.nombre,
            email: req.body.email,
            pais: pais,
            password: hashedPassword 
      };
        res.json(newUsuario);
      } catch (error) {
        console.error(error);
      }
};
export const login = async (req, res) => {
  try {
    const connection = await connect();

    // Buscar al usuario por nombre de usuario
    const [results] = await connection.execute(
      "SELECT * FROM usuarios WHERE email = ?",
      [req.body.email]
    );

    // Verificar si el usuario existe
    if (results.length === 0) {
      return res
        .status(401)
        .json({ error: "Nombre de usuario o contraseña incorrectos" });
    }

    // Verificar la contraseña
    const usuario = results[0];
    const match = await bcrypt.compare(req.body.password, usuario.password);
    if (!match) {
      return res
        .status(401)
        .json({ error: "Nombre de usuario o contraseña incorrectos" });
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      "secreto_del_token"
    );

    await connection.execute(
      "INSERT INTO sesiones (usuario_id, token) VALUES (?, ?)",
      [usuario.id, token]
    );

    return res.json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error del servidor" });
  }
};

export const logout = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // Obtener el token de los headers

    const decodedToken = jwt.verify(token, "secreto_del_token"); // Decodificar el token

    const connection = await connect();

    await connection.execute(
      "DELETE FROM sesiones WHERE usuario_id = ? AND token = ?",
      [decodedToken.id, token]
    );

    return res.json({ message: "Sesión cerrada exitosamente" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error del servidor" });
  }
};

// Variables globales para almacenar temporalmente el PIN y el correo electrónico
let temporaryPIN = "";
let temporaryEmail = "";
let pinExpirationTimer

// Función para enviar PIN de verificación por correo electrónico
export const enviarPIN = async (req, res) => {
  try {
    // Generar un PIN de verificación aleatorio
    temporaryPIN = Math.floor(100000 + Math.random() * 900000); // Genera un PIN de 6 dígitos
    temporaryEmail = req.body.email; // Almacena temporalmente el correo electrónico

    // Configurar el servicio de correo electrónico (aquí se utiliza Gmail como ejemplo, debes configurar tus propias credenciales y servicio SMTP)
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "estefanyt3101@gmail.com", // Coloca aquí tu dirección de correo electrónico
        pass: "xbeuqemvchirwqrk"
      },
    });

    // Definir el correo electrónico que se enviará
    const mailOptions = {
      from: "estefanyt3101@gmail.com", // Remitente
      to: req.body.email, // Destinatario (correo electrónico proporcionado por el usuario)
      subject: "PIN de Verificación", // Asunto del correo electrónico
      html: `
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f9f9f9;
          }

      .container {
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        padding: 40px;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }

      .header {
        text-align: center;
        margin-bottom: 30px;
      }

      .header img {
        width: 150px;
      }

      .pin {
        background-color: #CD6155;
        color: #ffffff;
        padding: 15px 30px;
        font-size: 36px;
        border-radius: 10px;
        text-align: center;
        margin: 0 auto;
        max-width: 200px;
        margin-bottom: 30px;
      }

        .footer {
          color: #777777;
          font-size: 14px;
          text-align: center;
          margin-top: 30px;
        }
      </style>
    </head>

      <body>
        <div class="container">
          <div class="header">
            <img src="https://res.cloudinary.com/dnwzliif9/image/upload/c_fill,w_350,h_350,g_auto,e_improve,e_sharpen/v1709059272/logo_ehpejv.png">
          </div>
          <h2 style="color: #CD6155; text-align: center;">PIN de Verificación</h2>
          <p style="text-align: center;">Estimado/a,</p>
          <p style="text-align: center;">Has solicitado un PIN de verificación para completar un proceso de autenticación. A continuación, encontrarás tu PIN de verificación:</p>
          <div class="pin">${temporaryPIN}</div>
          <p style="text-align: center;">Por favor, utiliza este PIN para continuar con el proceso de verificación. Este PIN es válido por un tiempo limitado.</p>
          <p style="text-align: center;">Gracias,</p>
          <p style="text-align: center;">Tu Equipo de Soporte</p>
          <p class="footer">Este es un correo electrónico automático. Por favor, no respondas a este mensaje.</p>
        </div>
        </body>

        </html>
    `,
    };

  // Enviar el correo electrónico
  await transporter.sendMail(mailOptions);

  // Establecer un temporizador para la expiración del PIN
  pinExpirationTimer = setTimeout(() => {
    temporaryPIN = ""; // Limpiar el PIN después de que expire
  }, 30 * 60 * 1000); // 30 minutos en milisegundos

  // Devolver respuesta exitosa
  return res.status(200).json({ message: "PIN de verificación enviado correctamente" });
} catch (error) {
  console.error(error);
  return res.status(500).json({ error: "Error al enviar el PIN de verificación por correo electrónico" });
}
};

// Función para verificar el PIN
export const verificarPIN = async (req, res) => {
  try {
    const { pin } = req.body;

    // Verificar si el PIN ingresado coincide con el PIN enviado por correo electrónico
    if (pin !== temporaryPIN) {
      return res.status(400).json({ error: "PIN incorrecto" });
    }


    // Devolver respuesta exitosa
    return res.status(200).json({ message: "PIN verificado correctamente" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al verificar el PIN" });
  }
};

// Función para cambiar la contraseña de un usuario
export const cambiarPassword = async (req, res) => {
  try {
    // Verificar si el PIN ha sido verificado
    if (!temporaryEmail) {
      return res.status(400).json({ error: "Debes verificar el PIN primero" });
    }

    const connection = await connect();

    // Obtener el usuario por su correo electrónico
    const [results] = await connection.execute(
      "SELECT * FROM usuarios WHERE email = ?",
      [temporaryEmail]
    );

    if (results.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const usuario = results[0];

    // Hash de la nueva contraseña
    const hashedNewPassword = await bcrypt.hash(req.body.newPassword, 10);

    // Actualizar la contraseña en la base de datos
    await connection.execute(
      "UPDATE usuarios SET password = ? WHERE email = ?",
      [hashedNewPassword, temporaryEmail]
    );

    // Limpiar variables temporales
    temporaryEmail = "";

    // Devolver respuesta exitosa
    return res
      .status(200)
      .json({ message: "Contraseña actualizada exitosamente" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error del servidor" });
  }
};
