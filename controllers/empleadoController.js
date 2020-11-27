require('express-async-errors');
const _ = require('lodash');

exports.empleadoAtencioPublico = (dbConnection) => async (req, res) => {
  const { dni } = req.params;

  const sqlQuery = `
    SELECT * FROM persona
        INNER JOIN empleado ON persona.dni = empleado.dni
            WHERE persona.dni = $1`;

  const payload = await dbConnection.query(sqlQuery, dni);

  if (_.isEmpty(payload)) {
    return res.status(404).json({
      error: true,
      message:
        'Error al intentar buscar por el DNI determinado. Datos no encontrados.',
    });
  }

  res.status(200).json({
    success: true,
    message: 'Datos de Empleado recuperados exitosamente.',
    payload: payload,
  });
};
