import {connect} from "../database";
export const crearDescuento = async (req, res) => {
    try {
        const tiposValidos = ['porcentaje', 'monto'];
        if (!tiposValidos.includes(req.body.tipo_descuento)) {
            return res.status(400).json({ message: 'Tipo de descuento no válido' });
        }

        // Validar y transformar el valor del descuento si es porcentaje
        let valor = req.body.valor;
        if (req.body.tipo_descuento === 'porcentaje') {
            // Verificar si el valor incluye el signo de porcentaje
            if (!valor.includes('%')) {
                return res.status(400).json({ message: 'El valor debe incluir el signo de porcentaje (%)' });
            }
            // Eliminar el signo de porcentaje y convertir el valor a un número
            valor = parseFloat(valor.replace('%', ''));
            if (isNaN(valor) || valor < 0 || valor > 100) {
                return res.status(400).json({ message: 'Valor de porcentaje no válido' });
            }
        }

        // Insertar el descuento en la base de datos
        const connection = await connect();
        const [results] = await connection.execute(
            "INSERT INTO descuento(nombre, tipo_descuento, valor, estado) VALUES(?,?,?,?)",
            [req.body.nombre, req.body.tipo_descuento, valor, req.body.estado]
        );

        // Devolver el descuento creado con su estado
        const newDescuento = {
            id: results.insertId,
            nombre: req.body.nombre,
            tipo_descuento: req.body.tipo_descuento,
            valor: valor,
            estado: req.body.estado
        };

        res.status(201).json(newDescuento);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const eliminarDescuento=async (req, res)=>{
    const connection =  await connect();
  const result = await connection.execute("DELETE FROM descuento WHERE id = ?", [
    req.params.id,
  ]);
  console.log(result);

  res.sendStatus(204);
};
export const obtenerDescuentoById=async (req, res)=>{
    const connection = await connect();
    const rows = await connection.execute("SELECT * FROM descuento WHERE id = ?", [
      req.params.id,
  ]);
  res.json(rows[0][0]);
};
export const modificarDescuento=async (req, res)=>{
    const connection =  await connect();
     await connection.query("UPDATE descuento SET ? WHERE id = ?", [
        req.body,
        req.params.id,
    ]);
    res.sendStatus(204);
};
export const obtenerDescuentos = async (req, res) => {
    const connection = await connect();
    const [rows] = await connection.execute("SELECT * FROM descuento");
    res.json(rows);
  };
