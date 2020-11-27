const express = require("express");
const cors = require("cors");
const { APP_PORT: PORT } = require('./utils/config');
const ciudadesRouter = require("./routes/ciudadesRouter");
const tecnicosExternosRouter = require("./routes/tecnicosExternosRouter");

const app = express();

// Utils
app.use(cors());
app.use(express.json());

// Routers
app.use("/api/ciudades", ciudadesRouter);
app.use("/api/tecnicosexternos", tecnicosExternosRouter);

app.listen(PORT, () => {
  console.debug(`Server running on ${PORT}`);
});
