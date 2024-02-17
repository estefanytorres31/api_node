import { crearUsuario,login } from '../controllers/UsuarioContolador';
import { Router } from 'express';

const routerUsuario = Router();
routerUsuario.post('/registro',crearUsuario);
routerUsuario.post('/login',login)
export default routerUsuario;