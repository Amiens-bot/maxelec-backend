const router = require('express').Router();
const { db } = require("../model/db");
const ciudadController = require('../controllers/ciudadController');

router
  .route('/:provincia')
  .get(ciudadController.getOneProvincia(db));

module.exports = router;
