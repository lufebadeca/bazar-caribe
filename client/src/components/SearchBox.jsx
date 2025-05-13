import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchBox() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmedSearchTerm = searchTerm.trim();
    navigate(`/items?search=${encodeURIComponent(trimmedSearchTerm)}`);
    setSearchTerm('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      className="relative w-full max-w-xl mx-auto"
    >
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        placeholder="Buscar..."
        aria-label="Ingresa lo que quieras encontrar"
        className="w-full pl-12 pr-4 py-3 text-lg bg-white/80 backdrop-blur-sm rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-rose-300 transition duration-200"
      />
      <button
        type="submit"
        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-rose-500"
        aria-label="Buscar"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
      </button>
    </form>
  );
}
