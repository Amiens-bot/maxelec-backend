const router = require('express').Router();
const { db } = require('../model/db');
const tecnicosExternosController = require('../controllers/tecnicosExternosController');

// endpoint example: /api/tecnicosexternos/{idciudad} - (numerico)
router.route('/:ciudad').get(tecnicosExternosController.getByCiudad(db));

module.exports = router;
