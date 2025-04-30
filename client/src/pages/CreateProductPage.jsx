// src/pages/CreateProductPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProduct } from '../services/api'; // Importa la función API

export default function CreateProductPage() {
  // Estado para todos los campos del formulario
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '', // Empezamos como string, convertiremos a número al enviar
    brand: '',
    stock: '', // Empezamos como string, convertiremos a número al enviar
    category: '',
    imageUrl: '', // Para la URL de la primera imagen
  });

  // Estados para manejar el proceso de envío
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const navigate = useNavigate(); // Hook para redirigir

  // Manejador genérico para cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
    // Limpiamos mensajes al empezar a editar de nuevo
    setError(null);
    setSuccessMessage(null);
  };

  // Manejador para el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); // Previene recarga de página
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    // Validación básica (campos requeridos)
    const requiredFields = ['title', 'description', 'price', 'stock', 'category'];
    const missingField = requiredFields.find(field => !formData[field]);
    if (missingField) {
      setError(`El campo '${missingField}' es obligatorio.`);
      setIsSubmitting(false);
      return;
    }

    // Preparar datos para la API
    const productData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      // Convertir precio y stock a números
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock, 10),
      category: formData.category.trim(),
      brand: formData.brand.trim() || undefined, // Enviar undefined si está vacío
      // Crear el array de imágenes desde imageUrl
      images: formData.imageUrl.trim() ? [formData.imageUrl.trim()] : [],
      // Rating se establece por defecto en el backend
    };

    // Validar que precio y stock sean números válidos
     if (isNaN(productData.price) || productData.price < 0) {
        setError('El precio debe ser un número positivo.');
        setIsSubmitting(false);
        return;
     }
     if (isNaN(productData.stock) || productData.stock < 0) {
        setError('El stock debe ser un número entero positivo o cero.');
        setIsSubmitting(false);
        return;
     }


    console.log("Enviando datos a la API:", productData);

    try {
      const createdProduct = await createProduct(productData);
      console.log("Producto creado:", createdProduct);
      setSuccessMessage('¡Producto creado con éxito!');
      // Limpiar formulario
      setFormData({ title: '', description: '', price: '', brand: '', stock: '', category: '', imageUrl: '' });
      // Redirigir a la home después de 2 segundos (opcional)
      setTimeout(() => {
        navigate('/');
        // O redirigir a la página del nuevo producto:
        // if(createdProduct?._id) navigate(`/items/${createdProduct._id}`);
      }, 2000);

    } catch (err) {
      console.error("Error al crear producto:", err);
      // Intenta obtener un mensaje más específico del error de la API si existe
      const apiErrorMessage = err.response?.data?.message || err.message;
      setError(`Error al crear el producto: ${apiErrorMessage}`);
    } finally {
      setIsSubmitting(false); // Habilita el botón de nuevo
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-2xl"> {/* Max width para el form */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Crear Nuevo Producto</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-md">
        {/* Campo Título */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Título <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Campo Descripción */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Descripción <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          ></textarea>
        </div>

        {/* Campos Precio y Stock (en línea) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Precio (COP) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0" // Precio no puede ser negativo
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
              Stock <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              required
              min="0" // Stock no puede ser negativo
              step="1" // Solo enteros
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Campos Categoría y Marca (en línea) */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Categoría <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
              Marca (Opcional)
            </label>
            <input
              type="text"
              id="brand"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Campo URL Imagen Principal */}
        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
            URL Imagen Principal (Opcional)
          </label>
          <input
            type="text" // Podría ser 'url', pero 'text' es más flexible
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="https://ejemplo.com/imagen.jpg"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
           <p className="mt-1 text-xs text-gray-500">Pega aquí la URL de la imagen principal del producto.</p>
        </div>

         {/* Mensajes de Éxito o Error */}
         {successMessage && (
           <div className="p-4 text-sm text-green-700 bg-green-100 rounded-md" role="alert">
             {successMessage}
           </div>
         )}
         {error && (
           <div className="p-4 text-sm text-red-700 bg-red-100 rounded-md" role="alert">
             {error}
           </div>
         )}

        {/* Botón submit */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting} // Deshabilitado mientras se envía
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              isSubmitting
                ? 'bg-indigo-300 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {isSubmitting ? 'Creando Producto...' : 'Crear Producto'}
          </button>
        </div>
      </form>
    </div>
  );
}