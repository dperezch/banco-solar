const { Pool } = require("pg");
const config = require("./config");
const pool = new Pool(config);

const ingresarUsuario = async ({ nombre, balance }) => {
  try {
    const text =
      "INSERT INTO usuarios (nombre, balance) VALUES ($1,$2) RETURNING *";
    const values = [nombre, balance];
    const queryObject = {
      text,
      values,
    };
    const result = await pool.query(queryObject);
    return result;
  } catch ({ code }) {
    console.error(`Error: ${code}`);
  }
};

const consultarUsuarios = async () => {
  try {
    const text = "SELECT * FROM usuarios ORDER BY id";
    const result = await pool.query(text);
    return result;
  } catch ({ code }) {
    console.error(`Error: ${code}`);
  }
};

const editarUsuario = async ({ id, nombre, balance }) => {
  try {
    const text = "UPDATE usuarios SET nombre = $2, balance = $3 WHERE id = $1";
    const values = [id, nombre, balance];
    const queryObject = {
      text,
      values,
    };
    const result = await pool.query(queryObject);
    return result;
  } catch ({ code }) {
    console.error(`Error: ${code}`);
  }
};

const eliminarUsuario = async (id) => {
  try {
    const text = "DELETE FROM usuarios WHERE id = $1 RETURNING *";
    const values = [id];
    const queryObject = {
      text,
      values,
    };
    const result = await pool.query(queryObject);
    return result;
  } catch ({ code }) {
    console.error(`Error: ${code}`);
  }
};

module.exports = {
  ingresarUsuario,
  consultarUsuarios,
  editarUsuario,
  eliminarUsuario,
};
