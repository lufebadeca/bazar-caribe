// src/pages/ProductDetailPage.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Hook para leer parámetros de la URL (:id)
import { getItemById } from '../services/api'; // Importa la función para obtener detalles
import { useShoppingCart } from '../hooks/ShoppingCartContext';
import RatingStars from '../components/RatingStars';

// Reutilizamos la función de formato de ProductCard (o la importas si la moviste)
const formatPriceCOP = (price) => {
  if (typeof price !== 'number') return 'Precio no disponible';
  return price.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0 });
};

// Componente simple para mostrar estrellas (opcional)
// const RatingStarsStd = ({ rating }) => {
//   if (typeof rating !== 'number' || rating <= 0) return null;
//   const fullStars = Math.floor(rating);
//   const halfStar = rating % 1 >= 0.5;
//   const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
//   return (
//     <div className="flex items-center">
//       {[...Array(fullStars)].map((_, i) => (
//         <svg key={`full-${i}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-yellow-500">
//           <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.39-3.423 3.352a.75.75 0 0 0 .426 1.285l4.753.39 1.83 4.401c.321.772 1.415.772 1.736 0l1.83-4.401 4.753-.39 3.423-3.352a.75.75 0 0 0-.426-1.285l-4.753-.39-1.83-4.401Z" clipRule="evenodd" />
//         </svg>
//       ))}
//       {halfStar && (
//          <svg key="half" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-yellow-500">
//            <path fillRule="evenodd" d="M10 1.344l1.83 4.401 4.753.39-3.423 3.352.95 4.691L10 11.837V1.344z" clipRule="evenodd" />
//          </svg>
//       )}
//       {[...Array(emptyStars)].map((_, i) => (
//         <svg key={`empty-${i}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-300">
//           <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.31h5.418a.563.563 0 0 1 .372.959l-4.386 3.176a.563.563 0 0 0-.22.57l1.634 5.401a.563.563 0 0 1-.813.625l-4.38-3.175a.563.563 0 0 0-.653 0l-4.38 3.175a.563.563 0 0 1-.813-.625l1.634-5.4a.563.563 0 0 0-.22-.57L1.634 9.88a.563.563 0 0 1 .372-.96h5.418a.563.563 0 0 0 .475-.31L9.48 3.5Z" />
//        </svg>
//       ))}
//        <span className="ml-2 text-sm text-gray-600">({rating.toFixed(1)})</span>
//     </div>
//   );
// };


export default function ProductDetailPage() {
  const { id } = useParams(); // Obtiene el 'id' de la URL (ej: /items/ESTE_ID)
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Empezamos cargando
  const [error, setError] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  //estado para saber si el producto esta en el carrito
  const [inCart, setInCart] = useState(false);
  // Hook para acceder al carrito (context)
  const {cart, addToCart, removeFromCart, incrementQuantity, decrementQuantity  } = useShoppingCart();
  
  // Efecto para sincronizar 'inCart' y 'selectedQuantity' con el carrito global
  useEffect(() => {
    if (!product || !cart) return; // Si no hay producto cargado o carrito, no hacer nada

    const itemInCart = cart.find(item => item._id === product._id);

    if (itemInCart) {
      setInCart(true);
      setSelectedQuantity(itemInCart.quantity); // Establece la cantidad desde el carrito
    } else {
      setInCart(false);
      setSelectedQuantity(1); // Si no está en el carrito, la cantidad seleccionable por defecto es 1
    }
  }, [product, cart]); // Dependencias: producto cargado y el carrito global
  
  useEffect(() => {
    const fetchProductDetails = async () => {
      // Reiniciamos estados al empezar la carga
      setIsLoading(true);
      setError(null);
      setProduct(null);
      console.log(`ProductDetailPage: Buscando producto con ID: ${id}`);
      
      try {
        const data = await getItemById(id); // Llama a la func que accede a
        setProduct(data);
        console.log(`ProductDetailPage: Producto recibido`, data);
      } catch (err) {
        console.error(`ProductDetailPage: Error fetching product ${id}`, err);
        if (err.response && (err.response.status === 404 || err.message.includes('inválido'))) {
          setError('Producto no encontrado o ID inválido.');
        } else {
             setError('Error al cargar los detalles del producto.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]); // Se ejecuta cada vez que el 'id' en la URL cambie
  
    const handleIncrementQuantity = () => {
      setSelectedQuantity(prev => Math.min(prev + 1, product.stock));
    };
  
    const handleDecrementQuantity = () => {
      setSelectedQuantity(prev => Math.max(1, prev - 1));
    };

  // --- Renderizado Condicional para dif estados ---
  if (isLoading) {
    return <div className="text-center p-10">Cargando detalles del producto...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-600">{error}</div>;
  }

  if (!product) {
    //por si acaso
    return <div className="text-center p-10">No se pudo cargar el producto.</div>;
  }

  // --- Renderizado de Detalles del Producto ---
  const { title, description, price, category, images, rating, brand, stock } = product;
  const availableImages = images?.length > 0 ? images : ['https://via.placeholder.com/600x400.png?text=Imagen+no+disponible'];

  const handleImageClick = (index) => {
    setActiveImageIndex(index);
  };

  const ratingAverage=()=>{
    const totalRatings = product.rating.length || 0;
    const sumRatings = product.rating.reduce((acc, rating) => acc + rating, 0) || 0;
    return totalRatings > 0 ? sumRatings / totalRatings : 0;
  }

  const handleAddToCart = (product) => {
    if (selectedQuantity <= 0 || selectedQuantity > stock) {
      alert('Por favor, selecciona una cantidad válida.');
      return; 
    }
    addToCart({ ...product, quantity: selectedQuantity });
    setInCart(true);
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Columna de Imágenes */}
        <div className="flex flex-col items-center">
           {/* Imagen Principal (o primera) */}
           <img
             src={availableImages[activeImageIndex]}
             alt={`Imagen principal de ${title}`}
             className="w-full max-w-md h-auto object-contain rounded-lg shadow-md mb-4 border border-gray-200" // object-contain para ver toda la imagen
           />
           {/* Miniaturas (si hay más de una) */}
           {availableImages.length > 1 && (
             <div className="flex space-x-2 overflow-x-auto p-2 justify-center">
               {availableImages.map((imgUrl, index) => (
                 <img
                   key={index}
                   src={imgUrl}
                   alt={`Imagen ${index + 1} de ${title}`}
                   className="w-16 h-16 object-cover rounded border border-gray-300 cursor-pointer hover:opacity-75"
                   onClick={() => handleImageClick(index)}
                 />
               ))}
             </div>
           )}
        </div>

        {/* Columna de Detalles */}
        <div>
          {/* Categoría y Marca */}
          <div className="text-sm text-gray-500 mb-2">
            {category} {brand && `| ${brand}`}
          </div>
          {/* Título */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{title}</h1>
          {/* Rating */}
          {rating.length > 0 && <div className="mb-4"><RatingStars rating={ratingAverage()} /></div>}
          {/* Precio */}
          <p className="text-4xl font-bold text-indigo-700 mb-6">{formatPriceCOP(price)}</p>
          {/* Stock */}
          <div className="mb-6">
            {stock > 0 ? (
              <span className="bg-green-100 text-green-800 text-sm font-medium me-2 px-3 py-1 rounded">
                {stock > 10 ? 'Disponible' : `¡Últimas ${stock} unidades!`}
              </span>
            ) : (
              <span className="bg-red-100 text-red-800 text-sm font-medium me-2 px-3 py-1 rounded">
                Agotado
              </span>
            )}
          </div>

          {stock > 0 && ( // Solo mostrar si hay stock
            <div className="mb-6">
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                Cantidad:
              </label>
              <div className="flex items-center border border-gray-300 rounded-md max-w-xs shadow-sm">
                <button
                  type="button"
                  onClick={handleDecrementQuantity}
                  disabled={selectedQuantity <= 1}
                  className="px-4 py-2 text-lg font-medium text-gray-600 hover:bg-gray-100 focus:outline-none rounded-l-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Disminuir cantidad"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                  </svg>
                </button>
                <span
                  id="quantity-display"
                  className="px-5 py-2 text-lg font-medium text-gray-900 border-l border-r border-gray-300 w-16 text-center bg-white"
                  aria-live="polite"
                >
                  {selectedQuantity}
                </span>
                <button
                  type="button"
                  onClick={handleIncrementQuantity}
                  disabled={selectedQuantity >= stock}
                  className="px-4 py-2 text-lg font-medium text-gray-600 hover:bg-gray-100 focus:outline-none rounded-r-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Aumentar cantidad"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          
          {/* Botón Comprar en carrito */}
          <button
            type="button"
            disabled={stock <= 0} // Deshabilitado si no hay stock
            className={`w-full py-3 px-6 rounded-lg text-white font-semibold text-lg transition duration-300 ${
              stock > 0 && !inCart
                ? 'bg-blue-600 hover:bg-blue-700 font-bold'
                : stock > 0 && inCart ? 'bg-green-600 hover:bg-green-700 font-bold' 
                : 'bg-gray-400 cursor-not-allowed'
            }`}
            onClick={(event)=>{
              if(inCart){
                removeFromCart(product._id);
              }else{
                handleAddToCart(product);
              }
              setInCart(!inCart);
            }}
          >
            {stock > 0 && !inCart  ? 'Comprar Ahora' : stock > 0 && inCart ? 'En el carrito' : 'Sin Stock'}
          </button>
          {/* Descripción */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Descripción</h2>
            {/* Usamos whitespace-pre-wrap para respetar saltos de línea si los hubiera */}
            <p className="text-gray-600 whitespace-pre-wrap">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}