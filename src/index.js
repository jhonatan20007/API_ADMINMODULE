const express = require('express');
const cors = require("cors");
const app = express();
const PORT = 8080;
app.use(express.json()); // Middleware para parsear el cuerpo de las solicitudes JSON
app.use(cors());

const resumen = require("./controllers/resumen");
const usuario = require("./controllers/user");

app.use("/resumen", resumen);
app.use("/user", usuario);
// Ruta de prueba
app.get('/', (req, res) => {
  res.send('¡Hola, mundo!');
});

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
