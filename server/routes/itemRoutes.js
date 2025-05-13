// server/routes/itemRoutes.js
const express = require('express');
const router = express.Router();
const {
  createProduct,
  searchItems,
  getItemById,
} = require('../controllers/itemController'); // Importamos los controladores
const { uploadMultipleImages } = require('../middleware/multerUpload');

// Ruta para crear un producto
router.post('/create', uploadMultipleImages, createProduct);

// Ruta para buscar productos (la query 'q' se lee desde req.query en el controlador)
router.get('/items', searchItems);

// Ruta para obtener un producto específico por ID
router.get('/items/:id', getItemById);

module.exports = router;