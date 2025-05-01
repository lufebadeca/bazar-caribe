import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Hook para navegar programáticamente

export default function SearchBox() {
  // Estado para valor de input
  const [searchTerm, setSearchTerm] = useState('');
  // Hook para poder cambiar de ruta
  const navigate = useNavigate();

  // Actualiza el estado cada vez que el usuario escribe
  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Se ejecuta cuando se envía el formulario (Enter o clic en botón)
  const handleSubmit = (event) => {
    event.preventDefault(); // Evita que la página se recargue
    const trimmedSearchTerm = searchTerm.trim(); // Quita espacios
  
    // Ya NO hay 'if' aquí. Navegamos SIEMPRE.
    // Si trimmedSearchTerm es "", la URL será /items?search=
    navigate(`/items?search=${encodeURIComponent(trimmedSearchTerm)}`);
  
    setSearchTerm(''); // Limpiamos el input después de la búsqueda
  };

  return (
    // Usamos un formulario para semántica y accesibilidad (permite Enter)
    <form
      onSubmit={handleSubmit}
      className="flex items-center w-full max-w-lg shadow-md rounded-md" // Ancho máx, sombra, bordes redondeados
      role="search" // Rol ARIA para accesibilidad
    >
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        placeholder="busca lo que quieras..." // Placeholder como Mercado Libre ;)
        className="flex-grow px-5 py-3 text-lg border border-r-0 border-gray-200 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent" // Input estilizado
        aria-label="Ingresa lo que quieras encontrar" // ARIA label para accesibilidad, también sirve para la prueba
      />
      <button
        type="submit"
        className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-r-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 transition duration-300" // Botón estilizado
        aria-label="Buscar" // ARIA label para accesibilidad, también sirve para la prueba
      >
        {/* Icono de Lupa (opcional) - podrías usar una librería de iconos o un SVG */}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
      </button>

    </form>
  );
}