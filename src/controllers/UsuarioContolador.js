import {connect} from "../database";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import nodemailer from "nodemailer"
//Importacion de la libreria i18n-iso-countries
const paises = require("i18n-iso-countries");

//Solicitud del archivo que contiene los paises en español
paises.registerLocale(require("i18n-iso-countries/langs/es.json"))

//Lista de los nombres de todos los paises del mundo en español
export const listaPaises=async(req,res)=>{
    const listaPaises=Object.values(paises.getNames('es', {select: "official"}))
    res.json(listaPaises)
}

//Validacion si el pais existe segun a la lista
function validarNombrePais(pais) {
    const lista = paises.getNames('es');
    return Object.values(lista).includes(pais);
  }

  //Creacion de usuario con sus requerimientos o validaciones
export const crearUsuario=async (req, res)=>{
    try {
        const connection = await connect();
        //Contraseña debe tener minimo numero de caracteres
        if (req.body.password.length < 8) {
          return res.status(400).json({ error: "La contraseña debe tener al menos 8 caracteres" });
      }
      //Encriptado de contraseña
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const pais=req.body.pais
        //Validacion con el pais ingresado
        if(!validarNombrePais(pais)){
            return res.status(400).json({ error: "Pais inválido" });
        }
        const [results] = await connection.execute(
          "INSERT INTO usuarios(nombre, email, password, pais) VALUES (?, ?,?,?)",
          [req.body.nombre, req.body.email, hashedPassword, pais]
        );
          
        // Construcción del objeto de nuevo usuario
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

// Función para autenticar a un usuario
export const login = async (req, res) => {
  try {
    // Conexión a la base de datos
    const connection = await connect();

    // Búsqueda del usuario por su correo electrónico en la base de datos
    const [results] = await connection.execute(
      "SELECT * FROM usuarios WHERE email = ?",
      [req.body.email]
    );

    // Verificación de la existencia del usuario
    if (results.length === 0) {
      return res.status(401).json({ error: "Nombre de usuario o contraseña incorrectos" });
    }

    // Obtención de los datos del usuario
    const usuario = results[0];

    // Verificación de la contraseña
    const match = await bcrypt.compare(req.body.password, usuario.password);
    if (!match) {
      return res.status(401).json({ error: "Nombre de usuario o contraseña incorrectos" });
    }

    // Generación de token de sesión utilizando JWT
    const token = jwt.sign({ id: usuario.id, email: usuario.email }, "secreto_del_token");

    // Almacenamiento del token en la base de datos
    await connection.execute(
      "INSERT INTO sesiones (usuario_id, token) VALUES (?, ?)",
      [usuario.id, token]
    );

    // Respuesta con el token de sesión
    return res.json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error del servidor" });
  }
};

// Función para cerrar sesión
export const logout = async (req, res) => {
  try {
    // Extracción del token de autorización del encabezado de la solicitud
    const token = req.headers.authorization.split(" ")[1];

    // Decodificación del token para obtener el ID de usuario
    const decodedToken = jwt.verify(token, "secreto_del_token");

    // Conexión a la base de datos
    const connection = await connect();

    // Eliminación del token de sesión de la base de datos
    await connection.execute(
      "DELETE FROM sesiones WHERE usuario_id = ? AND token = ?",
      [decodedToken.id, token]
    );

    // Respuesta con mensaje de éxito
    return res.json({ message: "Sesión cerrada exitosamente" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error del servidor" });
  }
};

// Función para enviar un PIN de verificación por correo electrónico
export const enviarPIN = async (req, res) => {
  try {
    // Generación de un PIN aleatorio
    temporaryPIN = Math.floor(1000 + Math.random() * 9000);

    // Configuración del transporte de correo utilizando nodemailer
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "dominickportella1470@gmail.com",
        pass: "kkewgsmxliotyndk"
      }
    });

    // Configuración del correo electrónico a enviar
    const mailOptions = {
      from: "lucaspa04@gmail.com",
      to: req.body.email,
      subject: "PIN de Verificación",
      html: getVerificationEmailTemplate(temporaryPIN) // Obtener plantilla de correo electrónico con PIN
    };

    // Envío del correo electrónico
    await transporter.sendMail(mailOptions);

    // Almacenamiento temporal del correo electrónico para la verificación
    temporaryEmail = req.body.email;

    // Respuesta con mensaje de éxito
    return res.status(200).json({ message: "PIN de verificación enviado correctamente" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al enviar el PIN de verificación por correo electrónico" });
  }
};

// Función para verificar el PIN de verificación
export const verificarPIN = async (req, res) => {
  try {
    const { pin } = req.body;

    // Verificación del PIN
    if (!temporaryEmail || pin !== temporaryPIN) {
      return res.status(400).json({ error: "PIN incorrecto o no se ha solicitado un PIN previamente" });
    }

    // Establecimiento de estado para indicar que el PIN se ha verificado correctamente
    PINVerificado = true;

    // Respuesta con mensaje de éxito
    return res.status(200).json({ message: "PIN verificado correctamente" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al verificar el PIN" });
  }
};

// Función para cambiar la contraseña del usuario
export const cambiarPassword = async (req, res) => {
  try {
    // Verificación de si el PIN se ha verificado correctamente
    if (!PINVerificado) {
      return res.status(400).json({ error: "Debes verificar el PIN primero" });
    }

    // Conexión a la base de datos
    const connection = await connect();

    // Búsqueda del usuario por su correo electrónico en la base de datos
    const [results] = await connection.execute(
      "SELECT * FROM usuarios WHERE email = ?",
      [temporaryEmail]
    );

    // Verificación de la existencia del usuario
    if (results.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const usuario = results[0];

    // Hashing de la nueva contraseña
    const hashedNewPassword = await bcrypt.hash(req.body.newPassword, 10);

    // Actualización de la contraseña en la base de datos
    await connection.execute(
      "UPDATE usuarios SET password = ? WHERE email = ?",
      [hashedNewPassword, temporaryEmail]
    );

    // Reinicio de las variables temporales después de cambiar la contraseña exitosamente
    temporaryEmail = undefined;
    PINVerificado = false;

    // Respuesta con mensaje de éxito
    return res.status(200).json({ message: "Contraseña actualizada exitosamente" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error del servidor" });
  }
};

// Función para obtener la plantilla de correo electrónico de verificación con el PIN
const getVerificationEmailTemplate = (pin) => {
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>PIN de Verificación</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f8f9fa;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          padding: 20px;
          background-color: #ffffff;
          border-radius: 10px;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 20px;
        }
        .header img {
          width: 150px; /* Tamaño deseado para el logo */
        }
        .header h1 {
          color: #007bff;
          font-size: 24px;
          margin: 0;
        }
        .pin-container {
          background-color: #f8f9fa;
          padding: 20px;
          border-radius: 5px;
          text-align: center;
          margin-bottom: 20px;
        }
        .pin {
          font-size: 36px;
          font-weight: bold;
          color: #007bff;
          margin: 0;
          padding: 0;
          cursor: pointer;
          border: 2px solid #007bff;
          border-radius: 5px;
          padding: 10px 20px;
          transition: transform 0.3s ease, background-color 0.3s ease, color 0.3s ease;
        }
        .pin:hover {
          transform: scale(1.05);
          background-color: #007bff;
          color: #ffffff;
        }
        .footer {
          margin-top: 20px;
          color: #6c757d;
          font-size: 14px;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="https://res.cloudinary.com/dnwzliif9/image/upload/c_fill,w_350,h_350,g_auto,e_improve,e_sharpen/v1709059272/logo_ehpejv.png"> <!-- Reemplaza "URL_DEL_LOGO" con la URL de tu logo -->
          <h1>PIN de Verificación</h1>
        </div>
        <p>Estimado/a,</p>
        <p>Has solicitado un PIN de verificación para completar un proceso de autenticación. A continuación, encontrarás tu PIN de verificación:</p>
        <div class="pin-container">
          <div class="pin">${pin}</div>
        </div>
        <p>Por favor, utiliza este PIN para continuar con el proceso de verificación. Este PIN es válido por un tiempo limitado.</p>
        <p>Gracias,</p>
        <p>Tu Equipo de Soporte</p>
        <p class="footer">Este es un correo electrónico automático. Por favor, no respondas a este mensaje.</p>
      </div>
    </body>
    </html>  
  `;
};