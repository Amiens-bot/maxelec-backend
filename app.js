const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const ciudadesRouter = require('./routes/ciudadesRouter');
const tecnicosExternosRouter = require('./routes/tecnicosExternosRouter');
const reclamoRouter = require('./routes/reclamoRouter');
const empleadoRouter = require('./routes/empleadoRouter');

const app = express();

app.use(morgan('dev'));

// Utils
app.use(cors());
app.use(express.json());

// Routers
app.use('/api/ciudades', ciudadesRouter);
app.use('/api/tecnicosexternos', tecnicosExternosRouter);
app.use('/api/reclamos', reclamoRouter);
app.use('/api/empleados', empleadoRouter);

module.exports = app;
