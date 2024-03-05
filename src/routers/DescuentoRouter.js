import { crearDescuento,eliminarDescuento,modificarDescuento,obtenerDescuentoById,obtenerDescuentos,cambiarEstadoDescuento } from '../controllers/DescuentoControlador';
import { Router } from 'express';

const routerDescuento = Router();
//DESCUENTO CRUD
routerDescuento.post('/descuento',crearDescuento);
routerDescuento.get('/descuento',obtenerDescuentos);
routerDescuento.get('/descuento/:id',obtenerDescuentoById);
routerDescuento.patch('/descuento/:id',modificarDescuento); 
routerDescuento.delete('/descuento/:id',eliminarDescuento);
// Ruta para desactivar y activar descuento
routerDescuento.patch('/descuento/:id/cambiar-estado', cambiarEstadoDescuento);

export default routerDescuento;