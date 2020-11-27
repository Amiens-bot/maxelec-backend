require(`express-async-errors`);
const _ = require(`lodash`);

exports.getOverview = (dbConnection) => async (req, res) => {
  const {
    numero_serie: numeroDeSerie,
    numero_factura: numeroDeFactura,
  } = req.query;

  const sqlQuery = `
    SELECT
    producto.nombre as nombre_producto,
    producto.modelo as modelo_producto,
    factura_final.fecha_expedicion as Fecha_Expedicion,
    (current_date > factura_final.fecha_expedicion + producto.meses_garantia * INTERVAL '1 MONTH') AS garantiaExpirada,
    negocio.nombre as negocio_nombre,
    negocio.direccion as negocio_direccion,
    ciudad.nombre as Ciudad,
    ciudad.provincia as Provincia
    FROM ejemplar
    INNER JOIN producto ON ejemplar.producto_id = producto.id
    INNER JOIN factura_final ON ejemplar.numero_factura_final = factura_final.numero_factura
    INNER JOIN distribuidora ON factura_final.cuit = distribuidora.cuit
    INNER JOIN negocio ON distribuidora.cuit = negocio.cuit
    INNER JOIN ciudad ON ciudad.id = negocio.ciudad_id
    WHERE ejemplar.numero_serie = $1 AND factura_final.numero_factura = $2;
    `;

  const payload = await dbConnection.query(sqlQuery, [
    numeroDeSerie,
    numeroDeFactura,
  ]);

  if (_.isEmpty(payload)) {
    return res.status(404).send({
      error: true,
      message: `No se pudo encontrar informacion con los datos proporcionados:\n
      numero_de_factura: ${numeroDeFactura} - numero_de_serie: ${numeroDeSerie}
      `,
    });
  }

  res.status(200).send({
    success: true,
    message: 'Informacion encontrada exitosamente.',
    payload,
  });
};
