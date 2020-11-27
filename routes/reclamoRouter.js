const router = require('express').Router();
const reclamoController = require('../controllers/reclamoController');
const { db } = require('../model/db');

// example query: /api/reclamo/clienteoverview?numero_serie=123&numero_factura=321
router.route('/clienteoverview').get(reclamoController.getOverview(db));

module.exports = router;
