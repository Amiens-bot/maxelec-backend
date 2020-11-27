const router = require('express').Router();
const { db } = require('../model/db');
const ciudadController = require('../controllers/ciudadController');

// /api/ciudades/:provincia ej: /api/ciudades/chaco
router.route('/:provincia').get(ciudadController.getOneProvincia(db));

module.exports = router;
