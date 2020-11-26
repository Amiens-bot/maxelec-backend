const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());

app.use(
  express.urlencoded({
    extended: false,
  })
);

app.use(express.json());

// Routers
// ciudades-provincia
const ciudadesRouter = require("./routes/ciudadesRouter");
app.use("/ciudades", ciudadesRouter);

// tecnicos externos
const tecnicosExternosRouter = require("./routes/tecnicosExternosRouter");
app.use("/tecnicosexternos", tecnicosExternosRouter);

app.use("/", (req, res) => {
  res.send("Welcome to My server");
});

app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
