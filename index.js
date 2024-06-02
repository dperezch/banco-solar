const express = require("express");
const {
  ingresarUsuario,
  consultarUsuarios,
  editarUsuario,
  eliminarUsuario,
} = require("./db/usuarios");
const {
  transferencia,
  consultarTransferencias,
} = require("./db/transferencias");
const app = express();
const port = 3000;

app.listen(port, () => {
  console.log(`Escuchando el puerto ${port}`);
});

//MIDDLEWARE
app.use(express.json());

//RUTA PRINCIPAL
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

//RUTAS USUARIOS
app.post("/usuario", async (req, res) => {
  const payload = req.body;
  try {
    const result = await ingresarUsuario(payload);
    res.status(201).send(result);
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
  }
});

app.get("/usuarios", async (req, res) => {
  try {
    const result = await consultarUsuarios();
    res.status(200).send(result.rows);
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
  }
});

app.put("/usuario", async (req, res) => {
  const { name, balance } = req.body;
  const { id } = req.query;
  const payload = {
    id,
    nombre: name,
    balance,
  };
  try {
    const result = await editarUsuario(payload);
    res.status(201).send(result);
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
  }
});

app.delete("/usuario", async (req, res) => {
  const { id } = req.query;
  try {
    const result = await eliminarUsuario(id);
    res.status(200).send(result);
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
  }
});

//RUTAS TRANSFERENCIAS
app.post("/transferencia", async (req, res) => {
  const { emisor, receptor, monto } = req.body;
  const fecha = new Date();
  const payload = {
    emisor,
    receptor,
    monto,
    fecha,
  };
  try {
    const result = await transferencia(payload);
    //console.log("desde servidor: ", result.rows);
    res.status(201).json(result.rows);
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
  }
});

app.get("/transferencias", async (req, res) => {
  try {
    const result = await consultarTransferencias();
    //console.log(result.rows);
    res.status(200).send(result.rows);
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
  }
});
