import { useShoppingCart } from "../hooks/ShoppingCartContext"; // Asegúrate que la ruta sea correcta
import { BsFillTrash3Fill } from "react-icons/bs";
import InfoModal from "../components/InfoModal";
import { useState } from "react";
import { Link } from "react-router-dom";

// formatear el precio a pesos colombianos
const formatPriceCOP = (price) => {
    if (typeof price !== 'number') {
      return 'Precio no disponible';
    }
    return price.toLocaleString('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
};

// Asumo que este es tu componente ShoppingCartPage.jsx o Cart.jsx
export default function ShoppingCartPage() { // Renombrado para reflejar que es una página
    const { cart, removeFromCart, clearCart, getCartTotal } = useShoppingCart(); // Asumimos que getCartTotal existe o lo calculamos

    const [isModalOpen, setIsModalOpen] = useState(false);

    // Usa getCartTotal del contexto si existe, sino calcula localmente
    const grandTotal = typeof getCartTotal === 'function' ? getCartTotal() : 0;

    // Esta función ABRIRÁ el modal
    const handleInitiatePurchase = () => {
        if (cart.length === 0) {
            alert("No hay productos en el carrito");
            return;
        }
        setIsModalOpen(true); // Abre el modal
    };

    // Esta función se ejecutará CUANDO el modal se envíe con éxito
    const handleConfirmPurchaseWithInfo = (customerName, customerAddress) => {
        // 1. Construir el mensaje detallado para WhatsApp (AHORA CON NOMBRE Y DIRECCIÓN)
        let messageLines = ["¡Hola! 👋 Quisiera realizar el siguiente pedido desde Bazar Online:"];
        messageLines.push("-----------------------------------");
        messageLines.push(`👤 Cliente: ${customerName}`);
        messageLines.push(`🚚 Dirección: ${customerAddress}`);
        messageLines.push("-----------------------------------");
        messageLines.push("🛒 Pedido:");

        cart.forEach(item => {
            const itemQuantity = item.quantity || 1;
            const unitPriceFormatted = formatPriceCOP(item.price);
            const subtotalFormatted = formatPriceCOP(item.price * itemQuantity);
            messageLines.push(`   🛍️ ${item.title}`);
            messageLines.push(`      Cantidad: ${itemQuantity}`);
            messageLines.push(`      Precio Unitario: ${unitPriceFormatted}`);
            messageLines.push(`      Subtotal: ${subtotalFormatted}`);
            messageLines.push("   --------------------------------");
        });

        const totalFormatted = formatPriceCOP(grandTotal);
        messageLines.push(`TOTAL DEL PEDIDO: *${totalFormatted}*`);
        messageLines.push("-----------------------------------");
        messageLines.push("¡Espero la confirmación y los pasos a seguir! 😊");

        const whatsappMessage = messageLines.join('\n');
        const encodedMessage = encodeURIComponent(whatsappMessage);
        const whatsappUrl = `https://wa.me/573004158815?text=${encodedMessage}`; // REEMPLAZA CON TU NÚMERO

        clearCart();
        setIsModalOpen(false); // Cierra el modal
        window.location.href = whatsappUrl; // Redirige a WhatsApp
    };

    return (
        <div className="container mx-auto p-4 md:p-8 max-w-2xl"> {/* Estilo mejorado para la página */}
            <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">Tu Carrito de Compras</h1>
            {cart.length === 0 ? (
                <p className="text-gray-600 text-center py-10">Tu carrito está vacío. ¡Empieza a añadir productos!</p>
            ) : (
                <>
                    <ul className="space-y-4"> {/* Mejor espaciado entre ítems */}
                        {cart.map(item => {
                            const itemQuantity = item.quantity || 1;
                            return (
                                <li 
                                key={item._id} 
                                className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-2 border border-gray-200 bg-white rounded-lg shadow-sm"
                                >
                                {/* --- Contenedor para Imagen y Título/Precio (Child 1) --- */}
                                {/* En pantallas sm y más, hacemos que este contenedor sea flexible y pueda encogerse */}
                                <div className="flex items-center gap-2 w-full sm:flex-1 sm:min-w-0"> {/* <--- CAMBIO AQUÍ: sm:w-auto -> sm:flex-1 sm:min-w-0 */}
                                    <Link
                                    to={`/items/${item._id}`}
                                    key={item._id}
                                    >
                                        <img
                                        src={item.images?.[0] || 'https://placehold.co/80x80?text=N/A'} // Placeholder mejorado y tamaño consistente
                                        alt={item.title}
                                        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md flex-shrink-0" // flex-shrink-0 es importante para la imagen
                                        />
                                    </Link>
                                    
                                    {/* Este div interno ya está bien para que el truncate funcione */}
                                    <div className="flex-1 min-w-0"> 
                                    <h2 
                                        className="text-base sm:text-lg font-semibold text-gray-800 truncate" // truncate debería funcionar mejor ahora
                                        title={item.title} // title attribute para ver el nombre completo en hover
                                    >
                                        {item.title}
                                    </h2>
                                    <p className="text-sm text-gray-500">{formatPriceCOP(item.price)} c/u</p>
                                    </div>
                                </div>

                                {/* --- Contenedor para Cantidad, Subtotal y Botón Eliminar (Child 2) --- */}
                                <div className="flex items-center gap-2 sm:gap-4 mt-3 sm:mt-0 w-full sm:w-auto justify-between sm:justify-end"> {/* sm:justify-end para alinear a la derecha en vistas más grandes */}
                                    <p className="text-sm sm:text-base text-gray-700 whitespace-nowrap"> {/* whitespace-nowrap para "Cant: X" */}
                                    Cant: {itemQuantity}
                                    </p>
                                    <p className="text-sm sm:text-base font-medium text-indigo-600 w-28 sm:w-24 text-right whitespace-nowrap"> {/* Ancho y no-wrap para el precio */}
                                    {formatPriceCOP(item.price * itemQuantity)}
                                    </p>
                                    <button
                                    onClick={() => removeFromCart(item._id)}
                                    className="text-red-500 hover:text-red-700 p-1 rounded-md transition-colors flex-shrink-0" // flex-shrink-0 para el botón
                                    aria-label={`Quitar ${item.title} del carrito`}
                                    >
                                    <BsFillTrash3Fill size={20} />
                                    </button>
                                </div>
                                </li>
                            );
                        })}
                    </ul>
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <div className="flex justify-end items-center mb-6">
                            <p className="text-xl md:text-2xl font-bold text-gray-800">Total: {formatPriceCOP(grandTotal)}</p>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-end gap-4">
                            <button onClick={() => clearCart()}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-md transition-colors text-center"
                            >
                                Vaciar Carrito
                            </button>
                            <button onClick={handleInitiatePurchase}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3 rounded-md transition-colors text-center text-lg"
                            >
                                Confirmar Pedido por WhatsApp
                            </button>
                        </div>
                    </div>
                </>
            )}
            <InfoModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)} // Función para cerrar el modal
                onSubmit={handleConfirmPurchaseWithInfo} // Función que se llama al confirmar en el modal
            />
        </div>
    );
}
