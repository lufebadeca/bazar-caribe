// src/components/Navbar.jsx
import { Link } from 'react-router-dom'; // Importa Link para la navegación

export default function Navbar() {
  return (
    <nav className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white p-4 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Main logo / de la Tienda - Enlaza a la Home */}
        <Link to="/" className="text-2xl font-bold hover:text-purple-200 transition duration-300 ease-in-out">
          Bazar del mar
        </Link>

        {/* Enlaces de Navegación */}
        <div className="space-x-8"> {/* Espacio entre enlaces */}
          <Link
            to="/"
            className="text-lg font-medium hover:text-purple-200 transition duration-300 ease-in-out pb-1 border-b-2 border-transparent hover:border-purple-200"
          >
            Inicio
          </Link>
          <Link
            to="/create"
            className="text-lg font-medium hover:text-purple-200 transition duration-300 ease-in-out pb-1 border-b-2 border-transparent hover:border-purple-200"
          >
            Crear Producto
          </Link>
          <Link
            to="/help"
            className="text-lg font-medium hover:text-purple-200 transition duration-300 ease-in-out pb-1 border-b-2 border-transparent hover:border-purple-200"
          >
            Ayuda y soporte
          </Link>
        </div>
      </div>
    </nav>
  );
}