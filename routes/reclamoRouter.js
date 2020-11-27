const router = require('express').Router();
const reclamoController = require('../controllers/reclamoController');
const { db } = require('../model/db');

// example endpoint: /api/reclamos/clienteoverview?numero_serie=123&numero_factura=321

router.route('/clienteoverview').get(reclamoController.getOverview(db));

// example endpoint: /api/reclamos/pendientes/{numerodecuit}
router
  .route('/pendientes/:cuit')
  .get(reclamoController.getReclamosPendientes(db));

// example endpoint: /api/reclamos/engestion/{numerodecuit}
router
  .route('/engestion/:cuit')
  .get(reclamoController.getReclamosEnGestion(db));

// example endpoint: /api/reclamos/derivados
router.route('/derivados').post(reclamoController.crearReclamoDerivado(db));

router.route('/reparar').post(reclamoController.reparar(db));

module.exports = router;
