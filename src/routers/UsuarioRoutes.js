import { crearUsuario,login,enviarPIN,verificarPIN,cambiarPassword,listaPaises } from '../controllers/UsuarioContolador';
import { Router } from 'express';

const routerUsuario = Router();
routerUsuario.post('/registro',crearUsuario);
routerUsuario.get('/listaPaises',listaPaises)
routerUsuario.post('/login',login)
routerUsuario.post('/enviarPin',enviarPIN)
routerUsuario.post('/verificarPin',verificarPIN)
routerUsuario.post('/cambiarPassword',cambiarPassword)

export default routerUsuario; 
