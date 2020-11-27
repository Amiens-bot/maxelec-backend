require(`express-async-errors`);
const _ = require(`lodash`);
const moment = require('moment');

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

exports.getReclamosPendientes = (dbConnection) => async (req, res) => {
  const { cuit } = req.params;

  const sqlQuery = `
        SELECT p.dni, p.nombre, p.apellido, p.telefono, p.direccion, c.nombre AS "ciudad", c.provincia, t.id AS "ticket_id",
        t.fecha_ingreso AS "fecha_reclamo", t.razon, prod.nombre AS "nombre_producto", prod.modelo, ejem.numero_serie,
        ff.cuit AS "cuit_dist", negocio.nombre AS "casa",ff.fecha_expedicion, ff.numero_factura, (t.fecha_ingreso > ff.fecha_expedicion + prod.meses_garantia * INTERVAL '1 MONTH') as garantiaExpirada
        FROM persona AS p
        INNER JOIN ciudad AS c
        ON p.ciudad_id = c.id
        INNER JOIN cliente_final AS cf
        ON p.dni = cf.dni
        INNER JOIN ticket AS t
        ON t.dni_cliente_final = cf.dni
        INNER JOIN reclamo AS r
        ON r.ticket_id = t.id
        INNER JOIN ejemplar AS ejem
        ON ejem.numero_serie = t.numero_serie
        INNER JOIN producto AS prod
        ON prod.id = ejem.producto_id
        INNER JOIN factura_final AS ff
        ON ff.numero_factura = ejem.numero_factura_final
        INNER JOIN distribuidora as dist
        ON dist.cuit = ff.cuit
        INNER JOIN negocio
        ON dist.cuit = negocio.cuit
        INNER JOIN empresa_tecnico AS et
        ON r.cuit_empresa_tecnico = et.cuit
        WHERE t.estado = 'DERIVADOTE' AND et.cuit=$1
    `;

  const payload = await dbConnection.any(sqlQuery, cuit);
  const { fecha_expedicion, fecha_reclamo } = payload;

  if (_.isEmpty(payload)) {
    return res.status(404).send({
      error: true,
      message: 'No se encontro informacion con el cuit proporcionado.',
    });
  }

  const newPayload = payload.map((reclamo) => {
    return {
      ...reclamo,
      fecha_expedicion: moment(reclamo.fecha_expedicion).format('YYYY-MM-DD'),
      fecha_reclamo: moment(reclamo.fecha_reclamo).format('YYYY-MM-DD'),
    };
  });

  res.status(200).send({
    success: true,
    message: 'Datos encontdados con el cuit proporcionado!.',
    payload: newPayload,
  });
};

exports.getReclamosEnGestion = (dbConnection) => async (req, res) => {
  const { cuit } = req.params;

  const sqlQuery = `
        SELECT p.dni, p.nombre, p.apellido, p.telefono, p.direccion, c.nombre AS "ciudad", c.provincia, t.id AS "ticket_id",
        t.fecha_ingreso AS "fecha_reclamo", t.razon, prod.nombre AS "nombre_producto", prod.modelo, ejem.numero_serie,
        ff.cuit AS "cuit_dist", negocio.nombre AS "casa",ff.fecha_expedicion, ff.numero_factura,
        (t.fecha_ingreso > ff.fecha_expedicion + prod.meses_garantia * INTERVAL '1 MONTH') as garantiaExpirada, r.descripcion_recibido,
        te.id AS "tecnico_id"
        FROM persona AS p
        INNER JOIN ciudad AS c
        ON p.ciudad_id = c.id
        INNER JOIN cliente_final AS cf
        ON p.dni = cf.dni
        INNER JOIN ticket AS t
        ON t.dni_cliente_final = cf.dni
        INNER JOIN reclamo AS r
        ON r.ticket_id = t.id
        INNER JOIN ejemplar AS ejem
        ON ejem.numero_serie = t.numero_serie
        INNER JOIN producto AS prod
        ON prod.id = ejem.producto_id
        INNER JOIN factura_final AS ff
        ON ff.numero_factura = ejem.numero_factura_final
        INNER JOIN distribuidora as dist
        ON dist.cuit = ff.cuit
        INNER JOIN negocio
        ON dist.cuit = negocio.cuit
        INNER JOIN empresa_tecnico AS et
        ON r.cuit_empresa_tecnico = et.cuit
        INNER JOIN tecnico_externo as te
        ON r.dni_tecnico_externo = te.dni
        WHERE t.estado = 'GESTIONTE' AND et.cuit=$1
    `;

  const payload = await dbConnection.any(sqlQuery, cuit);

  if (_.isEmpty(payload)) {
    return res.status(404).json({
      error: true,
      message:
        'Error al intentar buscar por el cuit determinado. Datos no encontrados.',
    });
  }

  const newPayload = payload.map((reclamo) => {
    return {
      ...reclamo,
      fecha_expedicion: moment(reclamo.fecha_expedicion).format('YYYY-MM-DD'),
      fecha_reclamo: moment(reclamo.fecha_reclamo).format('YYYY-MM-DD'),
    };
  });

  res.status(200).send({
    success: true,
    message: 'Datos encontdados con el cuit proporcionado!.',
    payload: newPayload,
  });
};

// req.body: {
//   persona: {
//     dni: 37666666,
//     nombre: 'mauricio',
//     apellido: 'benitez',
//     telefono: '5493423123',
//     direccion: 'xd'
//   },
//   reclamo: {
//      razon: 'una razon',
//      solucion: 'una solucion',
//      fecha_ingreso: '1995-08-12',
//      fecha_solucion: '1995-08-13',
//      estado: 'SOLUCIONADO',
//      dni_empleado: 1231231232
//   }
// }

exports.crearReclamoDerivado = (dbConnection) => async (req, res) => {
  const { persona, reclamo } = req.body;

  const personasDni = await dbConnection.any(
    `
    SELECT dni FROM persona WHERE true
  `
  );

  dbConnection
    .tx((t) => {
      // crea persona y devulve el dni creado

      let queryPersona;
      if (!personasDni.includes(persona.dni)) {
        queryPersona = t.one(
          `
        INSERT INTO persona(dni, nombre, apellido, direccion, telefono)
        VALUES ($<dni>, $<nombre>, $<apellido>, $<direccion>, $<telefono>)
        RETURNING dni
      `,
          { ...persona }
        );
      } else {
        queryPersona = t.one(
          `SELECT dni FROM persona WHERE persona.dni = $1`,
          persona.dni
        );
      }

      const crearClienteFinal = t.none(
        `INSERT INTO cliente_final(dni) VALUES ($1)`,
        persona.dni
      );

      const crearTicket = t.none(
        `
        INSERT INTO ticket(razon, descripcion_solucion, fecha_ingreso, fecha_solucion, estado, dni_empleado)
        VALUES($<razon>, $<solucion>, $<fecha_ingreso>, $<fecha_solucion>, 'SOLUCIONADO', $<dni_empleado>)
      `,
        { ...reclamo }
      );

      // const crearReclamo = t.none(
      //   `
      //   INSERT INTO reclamo()
      //   VALUES()
      //   `,
      //   reclamo,
      // );

      return t.batch([queryPersona, crearClienteFinal, crearTicket]);
    })
    .then((success) => {
      res.status(201).send({
        success: true,
        message: `Reclamo creado exitosamente.`,
      });
    })
    .catch((err) => {
      res.status(400).send({
        error: true,
        message: `Failed execution: ${err.message}`,
      });
    });
};
//gaston estuvo aqui
exports.reparar = (dbConnection) => async (req, res) => {
  const {
    ticket_id: id,
    dni_tecnico_externo: dniTecEx,
    descripcion_recibo: descRecibo,
  } = req.query;

  const sqlQueryTicketUpdate = `
    UPDATE ticket
        SET estado = 'GESTIONTE'
            WHERE id = $1`;

  const sqlQueryReclamoUpdate = `
    UPDATE reclamo
        SET dni_tecnico_externo = $1, descripcion_recibido = $2
            WHERE ticket_id = $3`;

  const updateTicket = await dbConnection.query(sqlQueryTicketUpdate, id);
  const updateReclamo = await dbConnection.query(sqlQueryReclamoUpdate, [
    dniTecEx,
    descRecibo,
    id,
  ]);

  res.status(200).json({
    success: true,
    message: 'Actualizacion con exito, Reparar',
  });
};
