// src/components/InfoModal.jsx
import React, { useState } from 'react';

export default function InfoModal({ isOpen, onClose, onSubmit }) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [inputError, setInputError] = useState('');

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !address.trim()) {
      setInputError('Por favor, completa todos los campos.');
      return;
    }
    setInputError('');
    onSubmit(name, address); // Pasa los datos a la función del padre
  };

  return (
    // Overlay oscuro de fondo
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-in-out">
      {/* Contenedor del Modal */}
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-md transform transition-all duration-300 ease-in-out scale-100">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Completa tu Información</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre Completo <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="customerName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label htmlFor="customerAddress" className="block text-sm font-medium text-gray-700 mb-1">
              Dirección de Envío <span className="text-red-500">*</span>
            </label>
            <textarea
              id="customerAddress"
              rows="3"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            ></textarea>
          </div>

          {inputError && (
            <p className="text-sm text-red-600">{inputError}</p>
          )}

          {/* Botones de Acción */}
          <div className="flex flex-col sm:flex-row-reverse gap-3 pt-4">
            <button
              type="submit"
              className="w-full sm:w-auto justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
            >
              Confirmar Pedido
            </button>
            <button
              type="button"
              onClick={onClose} // Llama a la función onClose pasada por props
              className="w-full sm:w-auto justify-center rounded-md border border-gray-300 bg-white px-6 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}