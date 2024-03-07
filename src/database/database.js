require('dotenv').config(); // Asegúrate de requerir dotenv si aún no lo has hecho en otro lugar
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

// Función para conectar a la base de datos
async function connectDB() {
  try {
    await client.connect();
    console.log('Conectado a MongoDB');
    return client; // Devuelve el cliente para realizar operaciones en la base de datos
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error);
    process.exit(1); // Sale del proceso si no puede conectar
  }
}

module.exports = connectDB;
