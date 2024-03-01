import {connect} from "../database";
export const crearDescuento = async (req, res) => {
    try {
        const tiposValidos = ['porcentaje', 'monto'];
        if (!tiposValidos.includes(req.body.tipo_descuento)) {
            return res.status(400).json({ message: 'Tipo de descuento no válido' });
        }
        
        // Validar y transformar el valor del descuento si es porcentaje
        let valor = req.body.valor;
        let valor_calculado
        if (req.body.tipo_descuento === 'porcentaje') {
            // Valida si el valor es numérico
            if (isNaN(valor)) {
                return res.status(400).json({ message: 'El valor debe ser numérico' });
            }
            // Convierte el valor a un porcentaje decimal
            valor_calculado = parseFloat(valor) / 100;
        } else if (req.body.tipo_descuento === 'monto') {
            // Si el tipo de descuento es monto, usa el valor proporcionado directamente
            if (isNaN(valor)) {
                return res.status(400).json({ message: 'El valor debe ser numérico' });
            }
            valor_calculado = parseFloat(valor);
        } else {
            return res.status(400).json({ message: 'Tipo de descuento no válido' });
        }

        // Insertar el descuento en la base de datos
        const connection = await connect();
        const [results] = await connection.execute(
            "INSERT INTO descuento(nombre, tipo_descuento, valor,valor_calculado, estado) VALUES(?,?,?,?,?)",
            [req.body.nombre, req.body.tipo_descuento, valor,valor_calculado, req.body.estado]
        );

        // Devolver el descuento creado con su estado
        const newDescuento = {
            id: results.insertId,
            nombre: req.body.nombre,
            tipo_descuento: req.body.tipo_descuento,
            valor: valor,
            valor_calculado: valor_calculado,
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
export const modificarDescuento = async (req, res) => {
    try {
        const connection = await connect();

        // Validar y transformar el nuevo valor del descuento si es porcentaje
        let nuevoValor = req.body.valor;
        let nuevoValorCalculado = nuevoValor; // El valor calculado predeterminado es el mismo que el nuevo valor

        if (req.body.tipo_descuento === 'porcentaje') {
            // Valida si el nuevo valor es numérico
            if (isNaN(nuevoValor)) {
                return res.status(400).json({ message: 'El nuevo valor debe ser numérico' });
            }
            // Convierte el nuevo valor a un porcentaje decimal
            nuevoValorCalculado = parseFloat(nuevoValor) / 100;
        } else if (req.body.tipo_descuento === 'monto') {
            // Si el tipo de descuento es monto, usa el nuevo valor proporcionado directamente
            if (isNaN(nuevoValor)) {
                return res.status(400).json({ message: 'El nuevo valor debe ser numérico' });
            }
            nuevoValorCalculado = parseFloat(nuevoValor);
        }

        // Actualizar el descuento en la base de datos
        const [result] = await connection.query("UPDATE descuento SET nombre = ?, tipo_descuento = ?, valor = ?, valor_calculado = ?, estado = ? WHERE id = ?", [
            req.body.nombre,
            req.body.tipo_descuento,
            nuevoValor,
            nuevoValorCalculado,
            req.body.estado,
            req.params.id
        ]);

        res.sendStatus(204);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const obtenerDescuentos = async (req, res) => {
    const connection = await connect();
    const [rows] = await connection.execute("SELECT * FROM descuento");
    res.json(rows);
  };
