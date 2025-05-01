// src/pages/SearchResultsPage.jsx
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom'; // Hook para leer query params
import { searchItems } from '../services/api'; // Importa la función de búsqueda API
import ProductCard from '../components/ProductCard';

export default function SearchResultsPage() {
  // Hook para acceder a los parámetros de búsqueda de la URL
  const [searchParams] = useSearchParams();
  // Obtenemos el valor del parámetro 'search'
  const query = searchParams.get('search');

  // Estados del componente
  const [results, setResults] = useState([]); // Para guardar los productos encontrados
  const [isLoading, setIsLoading] = useState(false); // Para mostrar un indicador de carga
  const [error, setError] = useState(null); // Para mostrar mensajes de error

  // useEffect hookeado a la query para buscar datos on mount o cuando 'query' cambia
  useEffect(() => {
    // Función async para obtener los datos
    const fetchResults = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Usamos el 'query' obtenido de la URL. Si es null o undefined, lo pasamos como "" a la API.
        // Nuestra API backend ya sabe que un query vacío significa "traer todos".
        const currentQuery = query || "";
        console.log(`SearchResultsPage: Fetching results for query: "${currentQuery}"`);
        const data = await searchItems(currentQuery); // Llama a la API con el query (o "" si no hay)
        setResults(data);
      } catch (err) {
        console.error("SearchResultsPage: Error fetching results", err);
        setError('Hubo un error al cargar los productos.');
        setResults([]); // Limpia resultados en caso de error
      } finally {
        setIsLoading(false);
      }
    };
  
    // Ejecutamos la función SIEMPRE que el componente se monte o 'query' cambie
    // (incluso si 'query' cambia a null o "").
    fetchResults();
  
  }, [query]); //El efecto se re-ejecuta si 'query' cambia

  // --- Renderizado Condicional ---

  // 1. Estado de Carga
  if (isLoading) {
    return <div className="text-center p-10">Cargando resultados...</div>;
  }

  // 2. Estado de Error
  if (error) {
    return <div className="text-center p-10 text-red-600">{error}</div>;
  }

  // 3. Sin Resultados (no cargando, no error)
  if (results.length === 0 && query) {
    return (
      <div className="text-center p-10">
        <h2 className="text-xl font-semibold mb-2">No se encontraron resultados para "{query}"</h2>
        <p className="text-gray-600">Intenta con otras palabras clave.</p>
      </div>
    );
  }

  // 4. Mostrar Resultados si todo OK
  return (
    <div className="container mx-auto p-4 md:p-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Resultados para: <span className="font-bold">{query}</span> ({results.length})
      </h2>
      {/* grid para mostrar las tarjetas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {results.map((product) => (
          
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}