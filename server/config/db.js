// server/config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Intentamos conectar usando la variable de entorno
    // Las opciones { useNewUrlParser: true, useUnifiedTopology: true } ya no suelen ser necesarias
    // en versiones recientes de Mongoose, pero no hacen daño si se incluyen.
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`MongoDB Conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error conectando a MongoDB: ${error.message}`);
    // Salimos del proceso con error si no podemos conectar a la DB
    process.exit(1);
  }
};

module.exports = connectDB;