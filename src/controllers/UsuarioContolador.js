import {connect} from "../database";
import bcrypt from "bcrypt"
import jwt from"jsonwebtoken"
export const crearUsuario=async (req, res)=>{
    try {
        const connection = await connect();
        const hashedPassword = await bcrypt.hash(req.body.password, 10); 
        const [results] = await connection.execute(
          "INSERT INTO usuarios(nombre, email, password, pais) VALUES (?, ?,?,?)",
          [req.body.nombre, req.body.email, hashedPassword, req.body.pais]
        );
    
        const newUsuario = {
            id: results.insertId, 
            nombre: req.body.nombre,
            email: req.body.email,
            pais: req.body.pais,
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
            return res.status(401).json({ error: 'Nombre de usuario o contraseña incorrectos' });
        }

        // Verificar la contraseña
        const usuario = results[0];
        const match = await bcrypt.compare(req.body.password, usuario.password);
        if (!match) {
            return res.status(401).json({ error: 'Nombre de usuario o contraseña incorrectos' });
        }
        const [sesionResults] = await connection.execute(
            "SELECT token FROM sesiones WHERE usuario_id = ? AND fecha_expiracion > NOW()",
            [usuario.id]
        );

        // Si hay una sesión activa, devolver el token existente
        if (sesionResults.length > 0) {
            const token = sesionResults[0].token;
            return res.json({ token });
        }

        // Generar token JWT
        const token = jwt.sign({ id: usuario.id, email: usuario.email }, 'secreto_del_token', { expiresIn: '1h' });

        await connection.execute(
            "INSERT INTO sesiones (usuario_id, token, fecha_expiracion) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 1 HOUR))",
            [usuario.id, token]
        );

        return res.json({ token });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error del servidor' });
    }
};