# Bazar Caribe Online - Prueba Técnica Full Stack Jr

Aplicación web simple tipo "bazar" o marketplace desarrollada como parte de una prueba técnica para perfil Full Stack Junior con INFX Solution. Permite buscar productos, ver detalles, y añadirlos a través de un formulario.

## Live Demo (Frontend)

Puedes probar la aplicación desplegada aquí:

[https://bazar-caribe.vercel.app/](https://bazar-caribe.vercel.app/)  *(Nota: El backend está en un plan gratuito de Render y puede tener un "cold start" inicial de ~30-50 segundos si ha estado inactivo. Por favor, ten paciencia en la primera carga de datos).*

## Funcionalidades Principales

* **Búsqueda de Productos:** Busca productos por coincidencias de palabras completas en título, descripción y categoría.
* **Listado Completo:** Al realizar una búsqueda con el campo vacío, se muestran todos los productos existentes.
* **Vista de Resultados:** Presenta los productos encontrados en formato de tarjetas responsivas.
* **Detalle de Producto:** Muestra información completa del producto seleccionado, incluyendo todas sus imágenes.
* **Creación de Productos:** Formulario para añadir nuevos productos a la base de datos.
* **Navegación:** Interfaz de página única (SPA) con enrutamiento en el lado del cliente.
* **Diseño Responsivo:** Enfoque Mobile-First usando Tailwind CSS.

## Tecnologías Utilizadas

**Backend:**
* Node.js
* Express.js
* MongoDB (Base de Datos NoSQL)
* Mongoose (ODM para MongoDB)
* MongoDB Atlas (Hosting de Base de Datos)
* CORS (Middleware para habilitar peticiones Cross-Origin)
* Dotenv (Manejo de variables de entorno)

**Frontend:**
* React (v18+)
* Vite (Bundler y Servidor de Desarrollo)
* React Router DOM (v7) (Enrutamiento)
* Tailwind CSS (v4) (Framework CSS Utility-First)
* Axios (Cliente HTTP para llamadas API)

**Pruebas:**
* Vitest (Corredor de pruebas para Vite)
* React Testing Library (`@testing-library/react`, `user-event`, `jest-dom`) (Pruebas de componentes React)

**Despliegue:**
* Backend API: Render.com
* Frontend App: Vercel
* Control de Versiones: Git & GitHub

## Arquitectura

El proyecto sigue una arquitectura Cliente-Servidor desacoplada:

* **Backend:** Una API RESTful construida con Node.js y Express, encargada de la lógica de negocio y la interacción con la base de datos MongoDB a través de Mongoose.
* **Frontend:** Una Single Page Application (SPA) construida con React y Vite, que consume la API del backend para mostrar y manipular los datos.
* **Monorepo:** El código fuente del cliente (`client/`) y del servidor (`server/`) residen en el mismo repositorio Git para facilitar la gestión.

## Backend Detallado

### API Endpoints

* `POST /api/create`: Crea un nuevo producto. Recibe los datos del producto en el cuerpo de la petición y devuelve el producto creado.
* `GET /api/items?q=<query>`: Busca productos. Recibe un término de búsqueda (`query`) como parámetro URL. Devuelve un array de productos que coincidan (o todos si `q` está vacío).
* `GET /api/items/:id`: Obtiene los detalles de un producto específico por su `_id`. Devuelve el objeto del producto encontrado o un error 404.

### Base de Datos (MongoDB)

* Se utiliza Mongoose para modelar los datos de la aplicación.
* **Schema `Product`:**
    * `title`: String, Requerido
    * `description`: String, Requerido
    * `price`: Number, Requerido
    * `brand`: String
    * `stock`: Number, Requerido, Default: 0
    * `category`: String, Requerido
    * `images`: [String] (Array de URLs de imágenes)
    * `rating`: [Number] (Array de calificaciones numéricas), Default: []
    * `createdAt`, `updatedAt`: Timestamps automáticos añadidos por Mongoose.

### Funcionalidad de Búsqueda

* Utiliza el índice de texto de MongoDB sobre los campos `title`, `description` y `category`.
* Realiza búsquedas basadas en **palabras completas** (tokens) proporcionadas en el parámetro `q`.
* Si el parámetro `q` está vacío, devuelve todos los productos de la colección.
* *(Limitación actual: No soporta coincidencias parciales o de subcadenas, ver sección de Mejoras)*.

## Frontend Detallado

### Estructura de Rutas (React Router)

* `/`: `HomePage` (Muestra `SearchBox`)
* `/items`: `SearchResultsPage` (Muestra `ProductCard`s según `?search=...`)
* `/items/:id`: `ProductDetailPage` (Muestra detalles del producto con ese `id`)
* `/create`: `CreateProductPage` (Muestra formulario de creación)

### Componentes Principales Reutilizables

* `Navbar`: Barra de navegación superior.
* `SearchBox`: Componente de entrada de búsqueda.
* `ProductCard`: Tarjeta para mostrar resumen de producto en listas.

### Manejo de Estado

* Principalmente `useState` para el estado local de los componentes (formularios, datos de API, estado de carga/error).
* No se implementó un manejador de estado global complejo (como Context API o Redux) para esta versión.

### Llamadas API

* Se utiliza `axios` centralizado en un módulo de servicio (`src/services/api.js`).
* La URL base de la API se configura mediante la variable de entorno `VITE_API_URL`.

## Pruebas (Testing)

* Se incluye una suite de pruebas para el componente `SearchBox` (`client/src/components/SearchBox.test.jsx`) utilizando Vitest y React Testing Library.
* Las pruebas verifican:
    * Que el valor del input se actualiza correctamente al escribir.
    * Que se llama a la función de navegación (`Maps`) con los parámetros correctos al enviar una búsqueda válida.
    * Que SÍ se llama a la función de navegación con query vacía.*
* Esto cumple con el requisito mínimo de incluir al menos una prueba.

## Despliegue (Deployment)

* **Backend API:** Desplegado en Render.
    * URL: `https://bazar-caribe-api.onrender.com/`
* **Frontend App:** Desplegado en Vercel.
    * URL: `https://bazar-caribe.vercel.app/`
    * Ambos servicios se despliegan desde el mismo monorepo configurando el `Root Directory` adecuado en cada plataforma (`server/` para Render, `client/` para Vercel) y las variables de entorno necesarias (`MONGODB_URI` en Render, `VITE_API_URL` en Vercel apuntando a la URL de Render).

## Cómo Ejecutar Localmente

1.  **Clonar el Repositorio:**
    ```bash
    git clone <URL_DEL_REPOSITORIO> cd <NOMBRE_CARPETA_PROYECTO>
    ```
2.  **Configurar y Ejecutar Backend:**
    ```bash
    cd server
    cp .env.example .env  # Si tienes un .env.example, si no, crea .env
    # Edita .env y añade tu MONGODB_URI de Atlas
    npm install
    npm run dev
    ```
    * El servidor backend debería estar corriendo en `http://localhost:5000`.

3.  **Configurar y Ejecutar Frontend (en otra terminal):**
    ```bash
    cd client
    # Crea el archivo .env en la raíz de client/
    # Añade la línea: VITE_API_URL=http://localhost:5000/api
    npm install
    npm run dev
    ```
    * La aplicación React debería abrirse en tu navegador (normalmente en `http://localhost:5173` o un puerto similar).

## Limitaciones y Oportunidades de Mejora

* **Paginación:** La lista de resultados de búsqueda no tiene paginación. Si hay muchos productos, la carga podría ser lenta y la lista muy larga.
* **Autenticación:** No hay sistema de usuarios ni autenticación. Cualquiera puede crear productos.
* **Búsqueda:** La búsqueda actual (utilizando índice de texto de MongoDB) requiere coincidencias de palabras completas y no soporta búsquedas parciales (ej: buscar "lap" no encontrará "Laptop"). Se podría mejorar usando expresiones regulares (con impacto en rendimiento) o implementando Atlas Search (más complejo).
* **Imágenes:** Se almacenan solo URLs de imágenes. No hay funcionalidad para subir archivos de imagen al servidor/almacenamiento externo.
* **Carrito de Compras:** Funcionalidad de carrito no implementada.
* **Manejo de Errores / UX:** Se podría mejorar la retroalimentación al usuario en caso de errores de API y añadir indicadores de carga más sofisticados (skeletons).
* **Validaciones:** Se podrían añadir validaciones más robustas tanto en el frontend como en el backend.
* **Rating:** Actualmente `rating` es un array pensado para recibir nuevos registros y promediar, pero no hay funcionalidad implementada para que los usuarios añadan calificaciones.

---

*Desarrollado por Luis Fernando Balldovino - 30 de abril de 2025* ```