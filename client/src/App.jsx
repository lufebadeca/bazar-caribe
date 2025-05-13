// src/App.jsx
import { Routes, Route } from 'react-router-dom';
// Verifica estas 4 líneas CUIDADOSAMENTE:
import HomePage from './pages/HomePage';
import SearchResultsPage from './pages/SearchResultsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CreateProductPage from './pages/CreateProductPage';
import HelpPage from './pages/HelpPage';
import Navbar from './components/Navbar';
import { ShoppingCartProvider } from './hooks/ShoppingCartContext';
import Cart from './pages/Cart';
import Footer from './components/Footer';

function App() {
  return (
    <ShoppingCartProvider>
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-slate-900">
      {/* Opcional: Aquí podrías poner un Navbar/Header que sea visible en todas las páginas */}
      <Navbar />

      <main className="flex-grow container mx-auto p-4 md:p-6 flex flex-col"> {/* Un padding general para el contenido */}
        <Routes> {/* Define el área donde cambiarán las páginas */}
          <Route path="/" element={<HomePage />} />
          <Route path="/items" element={<SearchResultsPage />} />
          {/* La ruta dinámica con el parámetro 'id' */}
          <Route path="/items/:id" element={<ProductDetailPage />} />
          <Route path="/create" element={<CreateProductPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/help" element={<HelpPage />} />
          {/* ruta catch-all para páginas no encontradas */}
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
      </main>

      <Footer />
    </div>
    </ShoppingCartProvider>

  );
}

export default App;