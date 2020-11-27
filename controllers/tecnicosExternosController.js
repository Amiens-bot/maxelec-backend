require('express-async-errors');
const _ = require('lodash');

exports.getByCiudad = (dbConnection) => async (req, res) => {
  const { ciudad: ciudadId } = req.params;
  const sqlQuery =
    `
    SELECT et.cuit, et.id, n.nombre, n.direccion, c.nombre AS "Ciudad", c.provincia
    FROM negocio AS n
    INNER JOIN ciudad AS c
    ON n.ciudad_id = c.id
    INNER JOIN empresa_tecnico as et
    ON et.cuit = n.cuit
    INNER JOIN empresa_tecnico_atiende_ciudad as etac
    ON etac.cuit = et.cuit
    WHERE etac.ciudad_id = $1
    `;

  const payload = await dbConnection.query(sqlQuery, ciudadId);

  if (_.isEmpty(payload)) {
    return res.status(404).json({
      error: true,
      message: "Error, no se pudo encontrar ningun tecnico externo. en la base de datos."
    });
  }

  res.status(200).json({
    payload,
    success: true,
    msg: "Tecnicos externos encontrados..."
  })
};
