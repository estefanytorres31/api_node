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
// Middleware para verificar token de sesión
export const verificarSesion = async (req, res, next) => {
  const token = req.headers.authorization; // Obtiene el token de autorización del encabezado de la solicitud

  if (!token) {
    // Si no hay token proporcionado en el encabezado
    return res.status(401).json({ error: "Token no proporcionado" }); // Devuelve un error de "Token no proporcionado"
  }

  try {
    const decoded = jwt.verify(token, "secreto_del_token"); // Verifica y decodifica el token usando el secreto "secreto_del_token"
    req.usuarioId = decoded.id; // Asigna el ID del usuario decodificado a req.usuarioId
    next(); // Llama a la siguiente función en la cadena de middleware
  } catch (error) {
    return res.status(401).json({ error: "Token inválido" }); // Si hay un error en la verificación del token, devuelve un error de "Token inválido"
  }
};

// Función para autenticar a un usuario
export const login = async (req, res) => {
  try {
    // Conexión a la base de datos
    const connection = await connect(); // Establece una conexión a la base de datos

    // Búsqueda del usuario por su correo electrónico en la base de datos
    const [results] = await connection.execute(
      "SELECT * FROM usuarios WHERE email = ?", // Consulta SQL para buscar un usuario por su correo electrónico
      [req.body.email] // Valor del correo electrónico a buscar en la consulta SQL
    );

    // Verificación de la existencia del usuario
    if (results.length === 0) {
      // Si no se encuentra ningún usuario con el correo electrónico proporcionado
      return res
        .status(401)
        .json({ error: "Nombre de usuario o contraseña incorrectos" }); // Devuelve un error de "Nombre de usuario o contraseña incorrectos"
    }

    // Obtención de los datos del usuario
    const usuario = results[0]; // Obtiene el primer resultado de la consulta como el usuario encontrado

    // Verificación de la contraseña
    const match = await bcrypt.compare(req.body.password, usuario.password); // Compara la contraseña proporcionada con la contraseña hasheada almacenada en la base de datos
    if (!match) {
      // Si las contraseñas no coinciden
      return res
        .status(401)
        .json({ error: "Nombre de usuario o contraseña incorrectos" }); // Devuelve un error de "Nombre de usuario o contraseña incorrectos"
    }

    // Verificar si el usuario ya tiene una sesión activa
    const [existingSessions] = await connection.execute(
      "SELECT * FROM sesiones WHERE usuario_id = ?", // Consulta SQL para verificar si hay sesiones activas para el usuario
      [usuario.id] // ID del usuario a buscar en la consulta SQL
    );

    if (existingSessions.length > 0) {
      // Si ya existe al menos una sesión activa para el usuario
      return res
        .status(400)
        .json({ error: "Ya hay una sesión activa para este usuario" }); // Devuelve un error de "Ya hay una sesión activa para este usuario"
    }

    // Generación de token de sesión utilizando JWT con tiempo de expiración de 24 horas
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      "secreto_del_token",
      { expiresIn: "24h" }
    ); 

    // Almacenamiento del token en la base de datos
    await connection.execute(
      "INSERT INTO sesiones (usuario_id, token, expiracion) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 24 HOUR))", // Consulta SQL para insertar el token de sesión en la base de datos con el tiempo de expiración
      [usuario.id, token] // Valores a insertar en la consulta SQL
    );

    // Respuesta con el token de sesión
    return res.json({ token }); // Devuelve el token de sesión en la respuesta
  } catch (error) {
    console.error(error); // Manejo de errores
    return res.status(500).json({ error: "Error del servidor" }); // Devuelve un error de "Error del servidor" en caso de error
  }
};


// Función para cerrar sesión manualmente
export const logout = async (req, res) => {
  try {
    // Extracción del token de autorización del encabezado de la solicitud
    const token = req.headers.authorization.split(" ")[1]; // Obtiene el token de autorización del encabezado y lo divide para obtener solo el token

    // Decodificación del token para obtener el ID de usuario
    const decodedToken = jwt.verify(token, "secreto_del_token"); // Decodifica el token para obtener el ID de usuario

    // Conexión a la base de datos
    const connection = await connect(); // Establece una conexión a la base de datos

    // Eliminación del token de sesión del usuario
    await connection.execute(
      "DELETE FROM sesiones WHERE usuario_id = ? AND token = ?", // Consulta SQL para eliminar el token de sesión de la base de datos
      [decodedToken.id, token] // Valores a utilizar en la consulta SQL
    );

    // Respuesta con mensaje de éxito
    return res.json({ message: "Sesión cerrada exitosamente" }); // Devuelve un mensaje de éxito en la respuesta
  } catch (error) {
    console.error(error); // Manejo de errores
    return res.status(500).json({ error: "Error del servidor" }); // Devuelve un error de "Error del servidor" en caso de error
  }
};

// Función para enviar un PIN de verificación por correo electrónico
let temporaryPIN = "";
let temporaryEmail = "";

export const enviarPIN = async (req, res) => {
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
      return res.status(404).json({ error: "¡Email no encontrado!" });
    }
    // Generación de un PIN aleatorio de 6 dígitos
    temporaryPIN = Math.floor(100000 + Math.random() * 900000);

    // Almacenar temporalmente el correo electrónico
    temporaryEmail = req.body.email;

    // Configuración del transporte de correo utilizando nodemailer
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "dominickportella1470@gmail.com",
        pass: "kkewgsmxliotyndk",
      },
    });

    // Configuración del correo electrónico a enviar
    const mailOptions = {
      from: "dominickportella1470@gmail.com",
      to: req.body.email,
      subject: "PIN de Verificación",
      html: getVerificationEmailTemplate(temporaryPIN),
    };

    // Envío del correo electrónico
    await transporter.sendMail(mailOptions);

    // Respuesta con mensaje de éxito
    return res
      .status(200)
      .json({ message: "PIN de verificación enviado correctamente" });
  } catch (error) {
    console.error(error);
    // Restablecer las variables temporales en caso de error
    temporaryPIN = "";
    temporaryEmail = "";
    return res
      .status(500)
      .json({
        error: "Error al enviar el PIN de verificación por correo electrónico",
      });
  }
};


let PINVerificado
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
    //Valida que la nueva contraseña tenga minimo 8 caracteres
    if (req.body.newPassword.length < 8) {
      return res.status(400).json({ error: "La nueva contraseña debe tener al menos 8 caracteres" });
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

    // Eliminar todos los tokens de sesión asociados con el usuario
    await connection.execute(
      "DELETE FROM sesiones WHERE usuario_id = ?",
      [usuario.id]
    );

    // Reinicio de las variables temporales después de cambiar la contraseña exitosamente
    temporaryEmail = undefined;
    PINVerificado = false;

    // Respuesta con mensaje de éxito
    return res.status(200).json({ message: "¡Contraseña actualizada exitosamente! Se ha cerrado la sesión." });
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
// Función para eliminar tokens de sesión expirados de la base de datos
const eliminarTokensExpirados = async () => {
  try {
    const connection = await connect(); // Establece una conexión a la base de datos
    const result=await connection.execute("DELETE FROM sesiones WHERE expiracion < NOW()"); // Elimina los tokens de sesión expirados de la base de datos
    if (result[0].affectedRows > 0) {
      console.log("Tokens expirados eliminados correctamente.");
    } else {
      console.log("No se encontraron tokens expirados para eliminar.");
    }
  } catch (error) {
    console.error("Error al eliminar tokens expirados:", error);
  }
};

// Llamada inicial para eliminar tokens de sesión expirados
eliminarTokensExpirados();

// Programación de la ejecución periódica para eliminar tokens de sesión expirados cada 24 horas
const horasEnMilisegundos = 24 * 60 * 60 * 1000; // 24 horas en milisegundos
setInterval(eliminarTokensExpirados, horasEnMilisegundos); // Ejecuta la función eliminarTokensExpirados cada 24 horas