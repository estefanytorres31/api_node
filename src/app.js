import express from "express";
import cors from "cors";
import routerUsuario from "./routers/UsuarioRoutes";
import routerDescuento from "./routers/DescuentoRouter"
import morgan from "morgan";

const app= express(); 

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use(routerUsuario)
app.use(routerDescuento)


export default app
