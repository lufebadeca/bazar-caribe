const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db'); // Importar función de conexión a DB
const itemRoutes = require('./routes/itemRoutes'); // Importar las rutas de items

// Cargar variables de entorno desde .env ANTES que nada
dotenv.config();

// Conectar a la base de datos MongoDB
connectDB();

// Crear la aplicación Express
const app = express();

// --- Middleware ---
// Habilitar CORS para permitir peticiones desde otros orígenes (ej: tu frontend)
app.use(cors()); // Puedes configurarlo más estrictamente si es necesario

// Habilitar el parseo de JSON en el cuerpo de las solicitudes
// Esto permite acceder a req.body en las rutas POST/PUT
app.use(express.json());

// --- Rutas de la API ---
// Montamos las rutas definidas en itemRoutes bajo el prefijo /api
app.use('/api', itemRoutes);

// Ruta de prueba básica para verificar que el servidor funciona
app.get('/', (req, res) => {
  res.send('API del Bazar Online funcionando!');
});

// --- Configuración del Puerto ---
const PORT = process.env.PORT || 5000; // Usa el puerto del .env o 5000 por defecto

// --- Iniciar el Servidor ---
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});