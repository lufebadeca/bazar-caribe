import { Link } from 'react-router-dom'; // Para que la tarjeta sea un enlace

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
          {rating > 0 ? (
            <div className="flex items-center text-sm text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-yellow-500 mr-1">
                <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.39-3.423 3.352a.75.75 0 0 0 .426 1.285l4.753.39 1.83 4.401c.321.772 1.415.772 1.736 0l1.83-4.401 4.753-.39 3.423-3.352a.75.75 0 0 0-.426-1.285l-4.753-.39-1.83-4.401Z" clipRule="evenodd" />
              </svg>
              {rating.toFixed(1)}
            </div>
          ) : (
            <div className="text-sm text-gray-400">Sin calificar</div> // Mensaje si no hay rating
          )}
          <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
            {category || 'Sin categoría'}
          </span>
        </div>
      </div>
    </Link>
  );
}