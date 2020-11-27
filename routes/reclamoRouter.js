const router = require('express').Router();
const reclamoController = require('../controllers/reclamoController');
const { db } = require('../model/db');

// example endpoint: /api/reclamos/clienteoverview?numero_serie=123&numero_factura=321
router.route('/clienteoverview').get(reclamoController.getOverview(db));

// example endpoint: /api/reclamos/pendientes/1231233
router
  .route('/pendientes/:cuit')
  .get(reclamoController.getReclamosPendientes(db));

module.exports = router;
