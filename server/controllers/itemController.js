const mongoose = require('mongoose');
// server/controllers/itemController.js
const Product = require('../models/Product'); // Importamos el modelo

// @desc    Crear un nuevo producto
// @route   POST /api/create
// @access  Public (por ahora)
const createProduct = async (req, res) => {
    try {
      // 1. Recoger datos del body. campos coinciden con nuestro Schema.
      const productData = req.body;
  
      // validations?
  
      // 2. Crear nueva instancia del modelo Product
      //    Mongoose aplicará los valores por defecto (stock: 0, rating: 0) si no vienen.
      const newProduct = new Product(productData);
  
      // 3. Guardar en la base de datos
      //    Mongoose también ejecutará las validaciones del Schema aquí (required, min, etc.)
      const savedProduct = await newProduct.save();
  
      // 4. Responder con éxito (201 Creado) y el producto guardado
      console.log('Producto creado:', savedProduct); // Log para el servidor
      res.status(201).json(savedProduct);
  
    } catch (error) {
      // 5. Manejar errores
      console.error('Error en createProduct:', error);
  
      // Si es un error de validación de Mongoose (común si faltan campos requeridos)
      if (error.name === 'ValidationError') {
        res.status(400).json({
           message: 'Error de validación al crear el producto',
           errors: error.errors // Contiene detalles sobre qué campos fallaron
          });
      } else {
        // Otros errores (ej: problema de conexión temporal, error inesperado)
        res.status(500).json({
           message: 'Error interno del servidor al crear el producto',
           error: error.message
          });
      }
    }
  };

// @desc    Buscar productos por query
// @route   GET /api/items?q=:query
// @access  Public
const searchItems = async (req, res) => {
    try {
      // 1. Obtener el término de búsqueda de req.query.q
      //    Si no se proporciona 'q', searchQuery será undefined o ''.
      const searchQuery = req.query.q;
  
      let products;
  
      if (searchQuery) {
        // 3. Si hay término de búsqueda, usar el índice de texto ($text)
        console.log('Realizando búsqueda de texto para:', searchQuery);
        products = await Product.find(
          { $text: { $search: searchQuery } },
          // Opcional: Añadir puntuación de relevancia si se desea ordenar por ella
          // { score: { $meta: "textScore" } }
        )
        // Opcional: Ordenar por relevancia (requiere añadir el campo 'score' arriba)
        // .sort({ score: { $meta: "textScore" } });
  
      } else {
        // 2. Si no hay término de búsqueda, devolver todos los productos
        console.log('No hay término de búsqueda, devolviendo todos los productos.');
        products = await Product.find({}); // {} como filtro significa "sin filtro" -> todos
      }
  
      // 4. Responder con los productos encontrados (puede ser un array vacío)
      res.status(200).json(products);
  
    } catch (error) {
      // 5. Manejar errores
      console.error('Error en searchItems:', error);
      res.status(500).json({ message: 'Error al buscar productos', error: error.message });
    }
  };

// @desc    Obtener detalles de un producto por ID
// @route   GET /api/items/:id
// @access  Public
const getItemById = async (req, res) => {
    try {
      // 1. Obtener el ID de req.params
      const { id } = req.params;
  
      // 2. Validar si el ID tiene un formato válido de MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        // Si no es un formato válido, ni siquiera intentamos buscar.
        return res.status(404).json({ message: 'Producto no encontrado (ID inválido)' });
      }
  
      // 3. Buscar el producto por ID en la base de datos
      const product = await Product.findById(id);
  
      // 4. Verificar si se encontró el producto
      if (!product) {
        // Si findById devuelve null, el producto con ese ID no existe
        return res.status(404).json({ message: 'Producto no encontrado' });
      }
  
      // 5. Si se encontró, responder con el producto
      res.status(200).json(product);
  
    } catch (error) {
      // 6. Manejar otros errores (ej. problemas de conexión)
      console.error('Error en getItemById:', error);
      res.status(500).json({ message: 'Error al obtener el producto', error: error.message });
    }
  };

module.exports = {
  createProduct,
  searchItems,
  getItemById,
};