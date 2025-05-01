const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const itemRoutes = require('./routes/itemRoutes');

// Cargar variables de entorno (si es necesario aquí, aunque es mejor en server.js)
dotenv.config();

// Crear la aplicación Express
const app = express();

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Rutas de la API ---
app.use('/api', itemRoutes);

// Ruta de prueba básica (opcional)
app.get('/', (req, res) => {
  res.send('API del Bazar Online funcionando!');
});

// --- Exportar la app ---
module.exports = app; // <-- OJO