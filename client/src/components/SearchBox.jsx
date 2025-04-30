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
    event.preventDefault(); // Evita que la página se recargue (comportamiento por defecto del form)
    const trimmedSearchTerm = searchTerm.trim(); // Quita espacios al inicio/final

    // Solo navega si hay algo escrito (después de quitar espacios)
    if (trimmedSearchTerm) {
      // Usa navigate para ir a /items?search=TERMINO_BUSCADO
      // encodeURIComponent asegura que caracteres como espacios o "?" se manejen bien en la URL
      navigate(`/items?search=${encodeURIComponent(trimmedSearchTerm)}`);
      setSearchTerm(''); // Opcional: Limpiar el input después de buscar
    } else {
      console.log("Intento de búsqueda con término vacío.");
      // Podrías mostrar una alerta o simplemente no hacer nada
    }
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
      />
      <button
        type="submit"
        className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-r-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 transition duration-300" // Botón estilizado
      >
        {/* Icono de Lupa (opcional) - podrías usar una librería de iconos o un SVG */}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
      </button>

    </form>
  );
}