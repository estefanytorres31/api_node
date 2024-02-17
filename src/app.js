import express from "express";
import cors from "cors";
import routerUsuario from "./routers/UsuarioRoutes";
import morgan from "morgan";

const app= express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use(routerUsuario)


export default app
