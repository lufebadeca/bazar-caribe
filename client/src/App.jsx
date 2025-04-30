// src/App.jsx
import { Routes, Route } from 'react-router-dom';
// Verifica estas 4 líneas CUIDADOSAMENTE:
import HomePage from './pages/HomePage';
import SearchResultsPage from './pages/SearchResultsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CreateProductPage from './pages/CreateProductPage';
import HelpPage from './pages/HelpPage';
import Navbar from './components/Navbar';

function App() {
  return (
    <div>
      {/* Opcional: Aquí podrías poner un Navbar/Header que sea visible en todas las páginas */}
      <Navbar />

      <main className="p-4"> {/* Un padding general para el contenido */}
        <Routes> {/* Define el área donde cambiarán las páginas */}
          <Route path="/" element={<HomePage />} />
          <Route path="/items" element={<SearchResultsPage />} />
          {/* La ruta dinámica con el parámetro 'id' */}
          <Route path="/items/:id" element={<ProductDetailPage />} />
          <Route path="/create" element={<CreateProductPage />} />
          <Route path="/help" element={<HelpPage />} />
          {/* Opcional: Podrías añadir una ruta catch-all para páginas no encontradas */}
          {/* <Route path="*" element={<h1>404 Not Found</h1>} /> */}
        </Routes>
      </main>

      {/* Opcional: Aquí podrías poner un Footer */}
    </div>
  );
}

export default App;