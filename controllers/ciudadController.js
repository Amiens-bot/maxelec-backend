require('express-async-errors');
const _ = require('lodash');

exports.getOneProvincia = (dbConnection) => async (req, res) => {
  const { provincia: nombreProvincia } = req.params;
  const sqlQuery = "SELECT * FROM ciudad WHERE ciudad.provincia ILIKE $1";
  const ciudades = await dbConnection.any(sqlQuery, nombreProvincia);

  if (_.isEmpty(ciudades)) {
    return res.status(400).json({
      message: "No se pudo encontrar la provincia solicitada.",
      error: true,
    })
  }

  res.status(200).json({
    payload: ciudades,
    success: true,
    message: "Exito, devolviendo provincia solicitada."
  })
};
