const express = require("express");
const cors = require("cors");
const morgan = require('morgan');
const ciudadesRouter = require("./routes/ciudadesRouter");
const tecnicosExternosRouter = require("./routes/tecnicosExternosRouter");

const app = express();

app.use(morgan('dev'));

// Utils
app.use(cors());
app.use(express.json());

// Routers
app.use("/api/ciudades", ciudadesRouter);
app.use("/api/tecnicosexternos", tecnicosExternosRouter);

module.exports = app;
