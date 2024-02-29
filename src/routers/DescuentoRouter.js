import { crearDescuento,eliminarDescuento,modificarDescuento,obtenerDescuentoById,obtenerDescuentos } from '../controllers/DescuentoControlador';
import { Router } from 'express';

const routerDescuento = Router();
routerDescuento.post('/descuento',crearDescuento);
routerDescuento.get('/descuento',obtenerDescuentos);
routerDescuento.get('/descuento/:id',obtenerDescuentoById);
routerDescuento.put('/descuento/:id',modificarDescuento); 
routerDescuento.delete('/descuento/:id',eliminarDescuento);




export default routerDescuento;