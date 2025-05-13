// src/pages/CreateProductPage.jsx
// client/src/pages/CreateProductPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProduct } from '../services/api';

export default function CreateProductPage() {
  // Mantén estados individuales para campos de texto para simplicidad de manejo
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [brand, setBrand] = useState('');
  const [stock, setStock] = useState('');
  const [category, setCategory] = useState('');

  // Nuevo estado para los archivos de imagen
  const [imageFiles, setImageFiles] = useState([]); // Array para múltiples archivos

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();

  // Manejador para el input de archivos
  const handleImageChange = (e) => {
    // e.target.files es un FileList, lo convertimos a Array
    setImageFiles(Array.from(e.target.files));
    setError(null); // Limpiar errores/mensajes al cambiar archivos
    setSuccessMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    // Validación básica de campos de texto
    if (!title.trim() || !description.trim() || !price || !stock.trim() || !category.trim()) {
      setError('Los campos marcados con * son obligatorios.');
      setIsSubmitting(false);
      return;
    }
    if (isNaN(parseFloat(price)) || parseFloat(price) < 0) {
        setError('El precio debe ser un número positivo.');
        setIsSubmitting(false);
        return;
    }
    if (isNaN(parseInt(stock, 10)) || parseInt(stock, 10) < 0) {
        setError('El stock debe ser un número entero positivo o cero.');
        setIsSubmitting(false);
        return;
    }

    // Crear objeto FormData
    const formDataPayload = new FormData();
    formDataPayload.append('title', title.trim());
    formDataPayload.append('description', description.trim());
    formDataPayload.append('price', price); // El backend los convertirá a Number
    formDataPayload.append('stock', stock); // El backend los convertirá a Number
    formDataPayload.append('category', category.trim());
    if (brand.trim()) {
      formDataPayload.append('brand', brand.trim());
    }

    // Adjuntar archivos de imagen
    // El nombre 'productImages' DEBE COINCIDIR con el usado en el middleware de Multer en el backend
    if (imageFiles.length > 0) {
      for (let i = 0; i < imageFiles.length; i++) {
        formDataPayload.append('productImages', imageFiles[i]);
      }
    }
    // Si no se seleccionan archivos, el backend simplemente guardará un array 'images' vacío.

    console.log("Enviando FormData a la API...");
    // Para depurar FormData:
    // for (let pair of formDataPayload.entries()) {
    //   console.log(pair[0]+ ', ' + pair[1]);
    // }

    try {
      const createdProduct = await createProduct(formDataPayload); // Envía FormData
      console.log("Producto creado:", createdProduct);
      setSuccessMessage('¡Producto creado con éxito!');
      // Limpiar formulario
      setTitle(''); setDescription(''); setPrice(''); setBrand(''); setStock(''); setCategory('');
      setImageFiles([]); // Limpiar los archivos seleccionados

      setTimeout(() => {
        // navigate('/'); // O redirigir a la página del nuevo producto
        if(createdProduct?._id) navigate(`/items/${createdProduct._id}`);
        else navigate('/');
      }, 2000);

    } catch (err) {
      console.error("Error al crear producto (frontend):", err);
      const apiErrorMessage = err.response?.data?.message || err.message || 'Error desconocido al contactar el servidor.';
      setError(`Error al crear el producto: ${apiErrorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reutiliza las clases de Tailwind para los inputs o define unas globales
  const inputStyle = "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500";
  const buttonStyle = `w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
    isSubmitting
      ? 'bg-indigo-300 cursor-not-allowed'
      : 'bg-indigo-600 hover:bg-indigo-700'
  }`;


  return (
    <div className="container mx-auto p-4 md:p-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Crear Nuevo Producto</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-md">
        {/* Campos de Texto */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Título <span className="text-red-500">*</span></label>
          <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className={inputStyle} />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Descripción <span className="text-red-500">*</span></label>
          <textarea id="description" rows="4" value={description} onChange={(e) => setDescription(e.target.value)} required className={inputStyle}></textarea>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Precio (COP) <span className="text-red-500">*</span></label>
            <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} required min="0" className={inputStyle} />
          </div>
          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">Stock <span className="text-red-500">*</span></label>
            <input type="number" id="stock" value={stock} onChange={(e) => setStock(e.target.value)} required min="0" step="1" className={inputStyle} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Categoría <span className="text-red-500">*</span></label>
            <input type="text" id="category" value={category} onChange={(e) => setCategory(e.target.value)} required className={inputStyle} />
          </div>
          <div>
            <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">Marca (Opcional)</label>
            <input type="text" id="brand" value={brand} onChange={(e) => setBrand(e.target.value)} className={inputStyle} />
          </div>
        </div>

        {/* --- Campo de Subida de Imágenes --- */}
        <div>
          <label htmlFor="productImages" className="block text-sm font-medium text-gray-700 mb-1">
            Imágenes del Producto (hasta 5, máx 5MB c/u)
          </label>
          <input
            type="file" // Tipo file
            id="productImages"
            name="productImages" // Coincide con Multer
            multiple // Permite seleccionar múltiples archivos
            accept="image/png, image/jpeg, image/webp, image/gif" // Tipos de imagen aceptados
            onChange={handleImageChange} // Nuevo manejador
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
          />
          {/* Muestra los nombres de los archivos seleccionados */}
          {imageFiles.length > 0 && (
            <div className="mt-2 text-xs text-gray-500">
              {imageFiles.length} archivo(s) seleccionado(s): {imageFiles.map(f => f.name).join(', ')}
            </div>
          )}
        </div>
        {/* --- Fin Campo de Subida de Imágenes --- */}

        {successMessage && (<div className="p-3 text-sm text-green-700 bg-green-100 rounded-md" role="alert">{successMessage}</div>)}
        {error && (<div className="p-3 text-sm text-red-700 bg-red-100 rounded-md" role="alert">{error}</div> )}

        <div className="pt-2">
          <button type="submit" disabled={isSubmitting} className={buttonStyle}>
            {isSubmitting ? 'Creando Producto...' : 'Crear Producto'}
          </button>
        </div>
      </form>
    </div>
  );
}