const { Pool } = require("pg");
const config = require("./config");
const pool = new Pool(config);

const transferencia = async ({ emisor, receptor, monto, fecha }) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    //obtener id de emisor y receptor
    const textIdemisor = "SELECT id FROM usuarios WHERE nombre = $1";
    const valuesIdemisor = [emisor];
    const queryObjectIdemisor = {
      text: textIdemisor,
      values: valuesIdemisor,
    };
    const resultIdEmisor = await client.query(queryObjectIdemisor);
    const idEmisor = resultIdEmisor.rows[0].id;
    //console.log("id emisor: ", idEmisor);

    const textIdreceptor = "SELECT id FROM usuarios WHERE nombre = $1";
    const valuesIdreceptor = [receptor];
    const queryObjectIdreceptor = {
      text: textIdreceptor,
      values: valuesIdreceptor,
    };
    const resultIdReceptor = await client.query(queryObjectIdreceptor);
    const idReceptor = resultIdReceptor.rows[0].id;
    //console.log("id receptor: ", idReceptor);

    //Insertar registro en la tabla de transferencias
    const text =
      "INSERT INTO transferencias (emisor, receptor, monto, fecha) VALUES ($1,$2,$3,$4) RETURNING *";
    const values = [idEmisor, idReceptor, monto, fecha];
    const queryObject = {
      text,
      values,
    };
    const result = await client.query(queryObject);

    //Actualizar saldos de los usuarios
    const textEmisor =
      "UPDATE usuarios SET balance = balance - $1 WHERE id = $2";
    const valuesEmisor = [monto, idEmisor];
    const queryObjectEmisor = {
      text: textEmisor,
      values: valuesEmisor,
    };
    const resultEmisor = await client.query(queryObjectEmisor);

    const textReceptor =
      "UPDATE usuarios SET balance = balance + $1 WHERE id = $2";
    const valuesReceptor = [monto, idReceptor];
    const queryObjectReceptor = {
      text: textReceptor,
      values: valuesReceptor,
    };
    const resultReceptor = await client.query(queryObjectReceptor);

    //finalizar transaccion
    await client.query("COMMIT");
    console.log("Transaccion realizada");
    return result;
  } catch (error) {
    console.log(error);
    await client.query("ROLLBACK");
  } finally {
    client.release();
    console.log("Operacion finalizada");
  }
};

const consultarTransferencias = async () => {
  try {
    //Query para consultar transferencias, obteniendo nombre de emisor y receptor desde tabla usuarios mediante JOIN
    const text = `SELECT transferencias.id, e.nombre AS emisor, r.nombre AS receptor, 
      transferencias.monto, transferencias.fecha 
      FROM transferencias JOIN usuarios e ON transferencias.emisor = e.id 
      JOIN usuarios r ON transferencias.receptor = r.id 
      ORDER BY transferencias.id DESC`;
    const queryObject = {
      text,
      rowMode: "array",
    };
    const result = await pool.query(queryObject);
    return result;
  } catch ({ code }) {
    console.error(`Error: ${code}`);
  }
};

module.exports = {
  transferencia,
  consultarTransferencias,
};
