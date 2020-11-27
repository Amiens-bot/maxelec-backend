const express = require("express");
const router = express.Router();

// conexion a db
const { db } = require("../model/db");

// Endpoint -> para conseguir todos los tecnicos que atienden a la ciudad elegida
router.get("/:ciudad", (req, res) => {
  //console.log(req.params.provincia);
  db.any(
    `SELECT et.cuit, et.id, n.nombre, n.direccion, c.nombre AS "Ciudad", c.provincia
          FROM negocio AS n
          INNER JOIN ciudad AS c
          ON n.ciudad_id = c.id
          INNER JOIN empresa_tecnico AS et
          ON et.cuit = n.cuit
          INNER JOIN empresa_tecnico_atiende_ciudad as etac
          ON etac.cuit = et.cuit
          WHERE etac.ciudad_id = $1`,
    req.params.ciudad
  )
    .then((rows) => {
      res.json({
        payload: rows,
        message: "Success. Retrieved all the tecnicos externos",
      });
    })
    .catch((error) => {
      res.status(500);
      res.json({
        message: "Error. Something went wrong!",
      });
      console.log(error);
    });
});

module.exports = router;
