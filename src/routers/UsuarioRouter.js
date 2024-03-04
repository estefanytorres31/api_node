import { crearUsuario,login,enviarPIN,verificarPIN,cambiarPassword,listaPaises,logout } from '../controllers/UsuarioControlador';
import { Router } from 'express';

const routerUsuario = Router();
//REGISTRO DE USUARIO
routerUsuario.post('/registro',crearUsuario);
routerUsuario.get('/listaPaises',listaPaises)
//SISTEMA DE ACCESO AL USUARIO
routerUsuario.post('/login',login)
routerUsuario.post('/logout',logout)
routerUsuario.post('/enviarPin',enviarPIN)
routerUsuario.post('/verificarPin',verificarPIN)
routerUsuario.post('/cambiarPassword',cambiarPassword)

export default routerUsuario;  
