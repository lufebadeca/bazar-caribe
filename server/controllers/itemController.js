const mongoose = require('mongoose');
// server/controllers/itemController.js
const Product = require('../models/Product'); // Importamos el modelo
const cloudinary = require('../config/cloudinary');

// @desc    Crear un nuevo producto
// @route   POST /api/create
// @access  Public (por ahora)
const createProduct = async (req, res) => {
  console.log('--- Controlador createProduct INVOCADO ---');
  console.log('req.body (datos de texto):', JSON.stringify(req.body, null, 2));
  console.log('req.files (archivos de Multer):', req.files);
    try {
      // 1. Recoger datos del body. campos coinciden con nuestro Schema.
      const productDataFromForm = req.body;
      let imageUrls = [];
  
      if (req.files && req.files.length > 0) {
        console.log(`RECIBIDOS ${req.files.length} archivos de Multer. Intentando subir a Cloudinary con upload_stream...`);
  
        // Usamos Promise.all para esperar que todas las subidas terminen
        const uploadPromises = req.files.map(file => {
          console.log(`Procesando archivo para stream: ${file.originalname}`);
          return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              {
                folder: 'bazar_online_products', // Opcional: tu carpeta en Cloudinary
                resource_type: 'auto' // Permite a Cloudinary detectar el tipo de archivo
              },
              (error, result) => {
                if (error) {
                  console.error(`Error en Cloudinary upload_stream para ${file.originalname}:`, error);
                  return reject(error);
                }
                if (!result || !result.secure_url) {
                  console.error(`Respuesta inválida de Cloudinary para ${file.originalname}:`, result);
                  return reject(new Error('Respuesta inválida de Cloudinary después de la subida.'));
                }
                console.log(`Imagen subida a Cloudinary (stream): ${result.secure_url}`);
                resolve(result.secure_url);
              }
            );
            // Enviamos el buffer del archivo al stream
            uploadStream.end(file.buffer);
          });
        });
  
        // Esperamos que todas las promesas de subida se resuelvan
        imageUrls = await Promise.all(uploadPromises);
        console.log('Todas las imágenes subidas. URLs:', imageUrls);
  
      } else {
        console.log('No se recibieron archivos de Multer en req.files.');
        // ... (tu lógica de fallback para imageUrls de texto si la tienes) ...
      }
  
      console.log('URLs de imágenes finales a guardar:', imageUrls);
  
      const finalProductData = {
        title: productDataFromForm.title,
        description: productDataFromForm.description,
        price: parseFloat(productDataFromForm.price),
        brand: productDataFromForm.brand,
        stock: parseInt(productDataFromForm.stock, 10),
        category: productDataFromForm.category,
        images: imageUrls,
      };
  
      // ... (tus validaciones y guardado en MongoDB como antes) ...
      const requiredFields = ['title', 'description', 'price', 'stock', 'category'];
      const missingField = requiredFields.find(field => !finalProductData[field]);
      if (missingField) {
            return res.status(400).json({ message: `El campo '${missingField}' es obligatorio.` });
      }
      if (isNaN(finalProductData.price) || finalProductData.price < 0) {
          return res.status(400).json({ message: 'El precio debe ser un número positivo.' });
      }
      if (isNaN(finalProductData.stock) || finalProductData.stock < 0) {
          return res.status(400).json({ message: 'El stock debe ser un número entero positivo o cero.' });
      }
  
      const newProduct = new Product(finalProductData);
      const savedProduct = await newProduct.save();
      console.log('Producto guardado en MongoDB:', savedProduct);
      res.status(201).json(savedProduct);
    
    } catch (error) {
      // 7. Manejar errores
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
        products = await Product.find({
          $text: {
              $search: searchQuery,
              $language: "spanish", // Asegurar idioma
              $diacriticSensitive: false // Forzar insensibilidad
          }
      });
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