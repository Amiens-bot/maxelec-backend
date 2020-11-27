const router = require('express').Router();
const empleadoController = require('../controllers/empleadoController');
const { db } = require('../model/db');

router.route('/:dni').get(empleadoController.empleadoAtencioPublico(db));

module.exports = router;
