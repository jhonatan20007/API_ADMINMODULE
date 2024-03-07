const connectDB = require("../database/database");

async function getUsuarios(credencial) {
    // console.log(credencial);
  client = await connectDB();
  var result;
  try {
    const database = client.db("Gateway");
    const cliente = database.collection("Usuarios");
    result = await cliente.findOne(credencial);
  } catch (error) {
    return error;
  } finally {
    if (client) {
      console.log("Cerrando cliente");
      await client.close();
    }
    return result;
  }
}

async function getConfigEmpresa(idcliente) {
  client = await connectDB();
  var result;
  try {
    const database = client.db("Gateway");
    const cliente = database.collection("cliente");
    result = await cliente.findOne(idcliente);
  } catch (error) {
    console.log(error);
    return error;
  } finally {
    if (client) {
      console.log("Cerrando cliente");
      await client.close();
    }
    return result;
  }
}

module.exports = { getUsuarios, getConfigEmpresa };
