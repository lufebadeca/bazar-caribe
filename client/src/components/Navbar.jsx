import { Link } from 'react-router-dom';
import { FaCartShopping } from "react-icons/fa6";
import { useShoppingCart } from '../hooks/ShoppingCartContext';

export default function Navbar() {
  const {cart} = useShoppingCart();

  return (
    <nav className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white p-4 shadow-lg sticky top-0 z-50">
      {/* Usamos max-w-7xl y px-4 para control similar a 'container' pero con padding */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 flex justify-between items-center">
        {/* Logo/Brand Name */}
        <Link to="/" className="text-xl sm:text-2xl font-bold hover:text-purple-200 transition duration-300 ease-in-out flex-shrink-0 flex flex-col md:flex-row items-center"> {/* Ajuste tamaño fuente y evita que se encoja */}
          <img src="/bazar-logo.png" alt="Logo Bazar Online" className="w-11 h-11 md:w-14 md:h-14 mr-2 "/>
          <span className="text-sm font-bold hover:text-purple-200 transition duration-300 ease-in-out md:text-2xl">Rossy Shop</span>
        </Link>

        {/* Navigation Links */}
        {/* Reducimos espacio y tamaño de fuente en móvil, lo aumentamos en pantallas medianas+ */}
        <div className="space-x-4 md:space-x-8"> {/* Menos espacio en móvil */}
          <Link
            to="/"
            className="text-sm md:text-lg font-medium hover:text-purple-200 transition duration-300 ease-in-out pb-1 border-b-2 border-transparent hover:border-purple-200" // Letra más pequeña en móvil
          >
            Inicio
          </Link>
          <Link
            to="/create"
            className="text-sm md:text-lg font-medium hover:text-purple-200 transition duration-300 ease-in-out pb-1 border-b-2 border-transparent hover:border-purple-200" // Letra más pequeña en móvil
          >
            Crear Producto
          </Link>
        </div>

        {/* Carrito */}
        <div className="flex items-center">
          <Link to="/cart" className="text-sm md:text-lg font-medium hover:text-purple-200 transition duration-300 ease-in-out flex items-center justify-center">
            <FaCartShopping className="w-6 h-6 text-white" />
            <span className="ml-2 text-md">({cart.length})</span>
          </Link>
        </div>

      </div>
    </nav>
  );
}