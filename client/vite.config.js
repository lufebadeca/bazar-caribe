import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss() ],

  test: {
    globals: true, // Permite usar API de vitest (describe, it, expect) sin importar explícitamente
    environment: 'jsdom', // Simula un entorno de navegador
    setupFiles: './src/test/setup.js', // Archivo para configuración inicial (como jest-dom)
    // Opcional: para que las pruebas se ejecuten al guardar cambios
    // watch: false,
  },
})
