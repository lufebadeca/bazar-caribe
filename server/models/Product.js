// server/models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'El título es obligatorio'], // Mensaje de error 
      trim: true, // Quita espacios al inicio y final
    },
    description: {
      type: String,
      required: [true, 'La descripción es obligatoria'],
    },
    price: {
      type: Number,
      required: [true, 'El precio es obligatorio'],
      min: [0, 'El precio no puede ser negativo'], // Validación mínima
    },
    brand: {
      type: String,
      trim: true,
    },
    stock: {
      type: Number,
      required: [true, 'El stock es obligatorio'],
      min: [0, 'El stock no puede ser negativo'],
      default: 0,
    },
    category: {
      type: String,
      required: [true, 'La categoría es obligatoria'],
      trim: true,
    },
    images: {
      type: [String], // Un array de strings (URLs)
      default: [], // Por defecto, un array vacío
    },
    rating: {
      type: [Number],
      min: [0, 'La calificación no puede ser negativa'],
      max: [5, 'La calificación máxima es 5'], // Asumiendo una escala de 0-5
      default: [0],
    },
    // No necesitas definir createdAt, timestamps: true lo hará por ti
    // Igualmente añadirá updatedAt
  },
  {
    timestamps: true, // Añade automáticamente createdAt y updatedAt
  }
);

// Creamos un índice de texto para facilitar la búsqueda por título y descripción
productSchema.index({ title: 'text', description: 'text' });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;