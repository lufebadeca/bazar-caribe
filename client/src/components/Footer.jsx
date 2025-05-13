import React from 'react';
import { FaFacebookSquare } from "react-icons/fa";
import { FaInstagramSquare } from "react-icons/fa";
import {FaWhatsappSquare} from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear(); // Para obtener el año actual dinámicamente

  return (
    <footer className="bg-slate-800 text-slate-400 dark:bg-gray-950 dark:text-slate-500 py-8 border-t border-slate-700 dark:border-gray-800 position-sticky bottom-0">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm mb-1">
          &copy; {currentYear} Tienda Online. Todos los derechos reservados.
        </p>
        <p className="text-xs">
          Todo lo que buscas, sin complicaciones. </p>
        
        <div className="mt-4 flex justify-center space-x-4">
          <a href="https://www.instagram.com/rossyshoppers/" className="hover:text-slate-200 dark:hover:text-white"><FaInstagramSquare /></a>
          <a href="https://wa.me/573004158815" className="hover:text-slate-200 dark:hover:text-white"><FaWhatsappSquare /></a>
        </div>

      </div>
    </footer>
  );
}