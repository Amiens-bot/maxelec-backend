const express = require("express");
const router = express.Router();

// conexion a db
const { db } = require("../model/db");

// Endpoint -> para conseguir todas las ciudades.
router.get("/", (req, res) => {
  // for ES6 put async before (req, res)

  // ES5 Method of dealing with promises
  db.any("SELECT * FROM ciudad") // db.any brings all the rows, db.one bring one row, db.none brings no row.
    .then((rows) => {
      //console.log(rows);
      //res.json(rows);

      // estructured response
      res.json({
        payload: rows,
        message: "Success. Retrieved all the cities",
      });
    })
    .catch((error) => {
      res.status(500);
      res.json({
        message: "Error. Something went wrong!",
      });
      console.log(error);
    });

  // ES6 Method async-await with try-catch
  // try {
  // let rows = await db.any("SELECT * FROM Ciudad")
  // res.json(rows);
  // }catch(error){
  //   console.log(error);
  // }
});

// Endpoint -> para conseguir todas las ciudades en una provincia determinada.
router.get("/:provincia", (req, res) => {
  //console.log(req.params.provincia);
  db.any(
    "SELECT * FROM ciudad WHERE ciudad.provincia = $1",
    req.params.provincia
  )
    .then((rows) => {
      res.json({
        payload: rows,
        message: "Success. Retrieved all the cities",
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
