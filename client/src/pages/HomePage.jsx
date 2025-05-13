import SearchBox from '../components/SearchBox';
// Si quieres usar una imagen de fondo local, la importarías así:
// import heroBackgroundImage from '../assets/tu-imagen-de-fondo.jpg'; // Asegúrate de crear la carpeta assets y poner la imagen

export default function HomePage() {
  // Altura estimada de tu Navbar. Si tu Navbar tiene 'p-4' (1rem arriba, 1rem abajo) y texto grande,
  // podría ser alrededor de 64px-80px. Ajusta este valor si es necesario.
  // Por ejemplo, 4rem (64px) o 5rem (80px). Usaremos '80px' como una estimación.
  const navbarHeight = '80px'; // O '5rem' si prefieres unidades relativas

  return (
    // Contenedor principal de la Hero Section
    <div
      className="flex flex-col items-center justify-center text-center h-full"
      // Calculamos la altura mínima para que ocupe la pantalla menos la navbar
      style={{ minHeight: `calc(100vh - ${2*navbarHeight})` }}
    >

      {/* Contenedor del contenido, con z-index para estar sobre el overlay si se usa */}
      <div className="relative z-10 flex flex-col items-center py-12 sm:py-16 md:py-20">
        {/* Logo */}
        <img
          src="/bazar-logo.png" // Asegúrate que Logo3.png esté en tu carpeta `public/`
          alt="Logo Bazar Online"
          className="sm:w-64 md:w-42 w-42 h-auto mb-6 sm:mb-8 drop-shadow-md"
        />

        {/* Título Principal */}
        <h1 className="text-xl sm:text-2xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4 leading-tight">
          Tu Mercado <span className="text-purple-600 dark:text-purple-400">Ideal</span>, a un Clic.
        </h1>

        {/* Lema/Tagline */}
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 sm:mb-10 max-w-xl mx-auto">
          Explora todos mis productos únicos.
        </p>

        {/* Caja de Búsqueda (envuelta para controlar su ancho) */}
        <div className="w-full max-w-xl mx-auto shadow-xl rounded-md">
          <SearchBox />
        </div>

        {/* Sugerencias de búsqueda (opcional) */}
        <p className="mt-8 text-sm text-gray-500 dark:text-gray-400">
          Ej: <span className="font-semibold text-purple-500">Sandalias</span>, <span className="font-semibold text-purple-500">Ropa de dama</span>, <span className="font-semibold text-purple-500">Sábanas</span>
        </p>
      </div>
    </div>
  );
}