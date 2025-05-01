// src/components/SearchBox.test.jsx

// Importaciones de Vitest y Testing Library
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest'; // Funciones de prueba de Vitest

// Importa el componente a probar
import SearchBox from './SearchBox';

// Necesitamos MemoryRouter porque SearchBox usa 'useNavigate' internamente
import { MemoryRouter } from 'react-router-dom';

// Mock (simulación) del hook useNavigate porque no necesitamos probar la navegación real aquí
// Le decimos a Vitest: "Cuando SearchBox pida 'useNavigate', dale esta función mock en su lugar"
const mockedUsedNavigate = vi.fn(); // Crea una función mock
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal(); // Importa el módulo real
  return {
    ...actual, // Mantén todo lo demás del módulo real
    useNavigate: () => mockedUsedNavigate, // Pero sobrescribe useNavigate con nuestro mock
  };
});

// Describe agrupa pruebas relacionadas con el componente SearchBox
describe('SearchBox Component', () => {

  // 'it' define un caso de prueba específico
  it('should update input value correctly when user types', async () => {
    // 1. Prepara el entorno de usuario simulado
    const user = userEvent.setup();

    // 2. Renderiza el componente DENTRO de MemoryRouter
    render(
      <MemoryRouter>    //entorno de prueba (con un router simulado)
        <SearchBox />
      </MemoryRouter>
    );

    // 3. Encuentra el input (usando su label de accesibilidad que definimos antes)
    const inputElement = screen.getByLabelText('Ingresa lo que quieras encontrar');

    // 4. Simula al usuario escribiendo en el input
    await user.type(inputElement, 'test query');

    // 5. Verifica (Assert) que el valor del input ahora es lo que se escribió
    expect(inputElement).toHaveValue('test query');
  });

  // Verificar que al hacer submit se llama a navigate
  it('should call navigate on submit with non-empty value', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <SearchBox />
      </MemoryRouter>
    );
    const inputElement = screen.getByLabelText('Ingresa lo que quieras encontrar');
    const submitButton = screen.getByRole('button', { name: 'Buscar' }); // Busca por nombre accesible
    const testValue = 'bicicleta';

    // Escribir en el input
    await user.type(inputElement, testValue);
    expect(inputElement).toHaveValue(testValue); // Verifica que se escribió

    // Simular clic en el botón
    await user.click(submitButton);

    // Verificar que la función navigate (nuestro mock) fue llamada
    // con la ruta correcta (y el término codificado)
    expect(mockedUsedNavigate).toHaveBeenCalledWith(`/items?search=${encodeURIComponent(testValue)}`);
   });

   it('should call navigate with empty search param on submit with empty value', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <SearchBox />
      </MemoryRouter>
    );
    const submitButton = screen.getByRole('button', { name: 'Buscar' });

    mockedUsedNavigate.mockClear(); // Reinicia el mock antes de la acción

    // Simular clic en el botón con el input vacío
    await user.click(submitButton);

    // Verificar que la función navigate FUE llamada con la ruta y query vacío
    expect(mockedUsedNavigate).toHaveBeenCalledWith('/items?search='); // <-- ESTA ES LA LÍNEA CAMBIADA
  });

});