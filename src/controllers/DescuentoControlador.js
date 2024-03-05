import {connect} from "../database";
//Creacion de un nuevo descuento
export const crearDescuento = async (req, res) => {
    try {
        
        //Opciones de tipos de descuento que se deben ingresar
        const tiposValidos = ['%', '$'];
        //En el caso se ingrese otro tipo
        if (!tiposValidos.includes(req.body.tipo_descuento)) {
            return res.status(400).json({ message: 'Tipo de descuento no válido' });
        }

        //Variables
        let valor = req.body.valor;
        let valor_calculado

        // En el caso que se ingrese porcentaje(%)
        if (req.body.tipo_descuento === '%') {
            //Verifica si se ingreso un valor numerico
            if (isNaN(valor)) {
                return res.status(400).json({ message: 'El valor debe ser numérico' });
            }
            // Convierte el valor a un porcentaje decimal
            valor_calculado = parseFloat(valor) / 100;
        }
        
        // En el caso que se ingrese un monto($)
        else if (req.body.tipo_descuento === '$') {
            //Verifica si se ingreso un valor numerico
            if (isNaN(valor)) {
                return res.status(400).json({ message: 'El valor debe ser numérico' });
            }
            //Se mantiene el valor tal y como se ingreso
            valor_calculado = parseFloat(valor);
        } 

        // Insertar el descuento en la base de datos
        const connection = await connect();
        const [results] = await connection.execute(
            "INSERT INTO descuento(nombre, tipo_descuento, valor,valor_calculado, estado) VALUES(?,?,?,?,?)",
            [req.body.nombre, req.body.tipo_descuento, valor,valor_calculado, true]
        );

        // Devolver el descuento creado con su estado
        const newDescuento = {
            id: results.insertId,
            nombre: req.body.nombre,
            tipo_descuento: req.body.tipo_descuento,
            valor: valor,
            valor_calculado: valor_calculado,
            estado: true
        };

        res.status(201).json(newDescuento);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//Eliminar descuento
export const eliminarDescuento=async (req, res)=>{
    const connection =  await connect();
  const result = await connection.execute("DELETE FROM descuento WHERE id = ?", [
    req.params.id,
  ]);
  console.log(result);

  res.sendStatus(204);
};

//Obtener descuento por id
export const obtenerDescuentoById=async (req, res)=>{
    const connection = await connect();
    const rows = await connection.execute("SELECT * FROM descuento WHERE id = ?", [
      req.params.id,
  ]);
  res.json(rows[0][0]);
};

//Modificar un descuento
export const modificarDescuento = async (req, res) => {
    try {
        const connection = await connect();

        // Opciones de tipos de descuento que se deben ingresar
        const tiposValidos = ['%', '$'];
        // En el caso se ingrese otro tipo
        if (!tiposValidos.includes(req.body.tipo_descuento)) {
            return res.status(400).json({ message: 'Tipo de descuento no válido' });
        }

        // Variables
        let nuevoValor = req.body.valor;
        let nuevoValorCalculado = nuevoValor; 

        // En el caso se ingrese porcentaje(%)
        if (req.body.tipo_descuento === '%') {
            // Verifica si se ingresó un valor numérico
            if (isNaN(nuevoValor)) {
                return res.status(400).json({ message: 'El nuevo valor debe ser numérico' });
            }
            // Convierte el nuevo valor a un porcentaje decimal
            nuevoValorCalculado = parseFloat(nuevoValor) / 100;
        }
        // En el caso que se ingrese un monto($)
        else if (req.body.tipo_descuento === '$') {
            // Verifica si se ingresó un valor numérico
            if (isNaN(nuevoValor)) {
                return res.status(400).json({ message: 'El nuevo valor debe ser numérico' });
            }
            // Se mantiene el valor tal y como se ingresó
            nuevoValorCalculado = parseFloat(nuevoValor);
        }

        // Verificar si se proporciona el estado
        let estado;
        if (req.body.estado !== undefined) {
            estado = req.body.estado;
        } else {
            // Si no se proporciona, mantener el estado existente
            const [existingResult] = await connection.query("SELECT estado FROM descuento WHERE id = ?", [req.params.id]);
            if (existingResult.length === 0) {
                return res.status(404).json({ message: 'Descuento no encontrado' });
            }
            estado = existingResult[0].estado;
        }

        // Actualizar el descuento en la base de datos
        const [result] = await connection.query("UPDATE descuento SET nombre = ?, tipo_descuento = ?, valor = ?, valor_calculado = ?, estado = ? WHERE id = ?", [
            req.body.nombre,
            req.body.tipo_descuento,
            nuevoValor,
            nuevoValorCalculado,
            estado,
            req.params.id
        ]);

        res.sendStatus(204);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//Obtener todos los descuentos
export const obtenerDescuentos = async (req, res) => {
    const connection = await connect();
    const [rows] = await connection.execute("SELECT * FROM descuento");
    res.json(rows);
  };
  
  export const cambiarEstadoDescuento = async (req, res) => {
    try {
        const connection = await connect();

        const nuevoEstado = req.body.estado;

        const [result] = await connection.query("UPDATE descuento SET estado = ? WHERE id = ?", [
            nuevoEstado,
            req.params.id
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Descuento no encontrado' });
        }

        res.sendStatus(204);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};