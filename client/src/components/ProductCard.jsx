import { Link } from 'react-router-dom'; // Para que la tarjeta sea un enlace
import { useShoppingCart } from '../hooks/ShoppingCartContext';
import { FaCartShopping } from "react-icons/fa6";
import { useState, useEffect } from 'react';

// formatear el precio a pesos colombianos
const formatPriceCOP = (price) => {
  if (typeof price !== 'number') {
    return 'Precio no disponible';
  }
  return price.toLocaleString('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0, // Sin centavos
    maximumFractionDigits: 0, // Sin centavos
  });
};

// El componente recibe un objeto 'product' como prop
export default function ProductCard({ product }) {
    const {cart, addToCart, removeFromCart  } = useShoppingCart();

    const [inCart, setInCart] = useState(false);

    //effect para actualizar estado del carrito
    useEffect(() => {
      const isProductInCart = cart.some(item => item._id === product._id);
      setInCart(isProductInCart);
    }, [cart, product]);

    const ratingAverage=()=>{
      const totalRatings = product.rating.length || 0;
      const sumRatings = product.rating.reduce((acc, rating) => acc + rating, 0) || 0;
      return totalRatings > 0 ? Math.round((sumRatings / totalRatings) * 100) / 100 : 0;
    }

  // si 'product' no llega o no tiene _id
  if (!product?._id) {
    return null; // O mostrar un esqueleto/placeholder de tarjeta
  }

  // Destructure properties for easier use
  const { _id, title, description, price, category, images, rating } = product;

  // Usamos la primera imagen o una imagen placeholder si no hay ninguna
  const imageUrl = images?.[0] || 'https://via.placeholder.com/300x200.png?text=Imagen+no+disponible';

  return (
    // Toda la tarjeta es un enlace a la página de detalle del producto
    <Link
      to={`/items/${_id}`}
      className="group flex flex-col bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg"
      aria-label={`Ver detalles de ${title}`}
    >
      {/* Sección de la Imagen */}
      <div className="relative w-full h-48 sm:h-56 overflow-hidden">

        <div className="z-10 w-12 h-12 rounded-full bg-gray-300/50 top-2 right-2 flex items-center justify-center cursor-pointer absolute" 
          onClick={(event)=>{
            event.stopPropagation(); // Stop the event from bubbling up to the Link
            event.preventDefault();
            if(inCart){
              removeFromCart(_id);
            }else{
              addToCart(product);
            }
            setInCart(!inCart)
          }}>
            <FaCartShopping className={`w-6 h-6 ${inCart  ? "like text-red-500": "text-gray-500" }`} />
        </div>

        <img
          src={imageUrl}
          alt={`Imagen de ${title}`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" // Efecto zoom suave al pasar el mouse
        />
      </div>
          

      {/* Sección del Contenido */}
      <div className="p-4 flex flex-col flex-grow"> {/* flex-grow para que ocupe espacio */}
        {/* Precio */}
        <p className="text-2xl font-semibold text-gray-800 mb-2">
          {formatPriceCOP(price)}
        </p>

        {/* Título */}
        <h3 className="text-base font-medium text-gray-700 mb-1 group-hover:text-indigo-600 transition-colors duration-300 min-h-[2.5rem] line-clamp-2" title={title}>
          {/* line-clamp-2 limita a 2 líneas con '...' */}
          {title || 'Título no disponible'}
        </h3>

        {/* Descripción Corta (quitar si la tarjeta queda muy llena) */}
        { <p className="text-sm text-gray-500 mb-3 line-clamp-2 min-h-[2.5rem]">
          {description?.substring(0, 60) || 'Descripción breve...'}...
        </p> }

        {/* Espaciador para empujar rating/categoría abajo (si es necesario) */}
        <div className="flex-grow"></div>

        {/* Rating y Categoría (al final) */}
        <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
          {rating.length > 0 ? (
            <div className="flex items-center text-sm text-gray-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4 text-yellow-500 mr-1"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.39 2.463a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.54 1.118l-3.39-2.463a1 1 0 00-1.175 0l-3.39 2.463c-.784.57-1.838-.197-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.045 9.393c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.966z" />
              </svg>
              {ratingAverage()}
            </div>
          ) : (
            <div className="text-sm text-gray-400">Sin calificar</div>
          )}
          <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
            {category || 'Sin categoría'}
          </span>
        </div>
      </div>
    </Link>
  );
}