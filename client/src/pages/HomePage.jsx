// src/pages/HomePage.jsx
import SearchBox from '../components/SearchBox'; // <-- 1. Importa el componente

export default function HomePage() {
  return (
    // Centra el contenido verticalmente (aproximado) y horizontalmente
    <div className="flex flex-col items-center justify-center pt-12 md:pt-10">

         <img src="/Logo2.png" alt="Logo Bazar Online" className="w-50 h-auto mb-10 md:w-70 md:h-70"/> {/* Ejemplo de logo */}

        <SearchBox />

        <p className="mt-6 text-gray-500 text-center px-4">
           Busca millones de productos entre nuestras categorías.
        </p>
    
    </div>
  );
}