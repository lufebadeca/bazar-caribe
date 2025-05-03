import { useShoppingCart } from "../hooks/ShoppingCartContext";
import { BsFillTrash3Fill } from "react-icons/bs";

// formatear el precio a pesos colombianos
const formatPriceCOP = (price) => {
    if (typeof price !== 'number') {
      return 'Precio no disponible';
    }
    return price.toLocaleString('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0, // Sin centavos
      maximumFractionDigits: 0, // Sin centavos
    });
  };

export default function Cart() {
    const {cart, removeFromCart, clearCart} = useShoppingCart();

    const handleBuy = ()=>{
        alert("Compra realizada. Ahora me debes "+ formatPriceCOP(total) );
        clearCart();
    }

    let total = 0;
    cart.forEach(item => {
        total += item.price;
    });

    return (
        <div>
            <h1 className="text-xl font-bold p-4">Carrito</h1>
            <ul className="flex flex-col gap-4 p-4 border border-gray-200 bg-gray-100">
                {cart.map(item => (
                    <li key={item._id} className="flex justify-between items-center gap-4 ">
                        <img 
                            src={item.images[0]}
                            alt={item.title}
                            className="w-12 h-12 md:w-18 md:h-18 object-cover rounded-2xl flex-shrink-0"
                        />
                        <h2 className="flex-1 text-sm md:text-xl flex-truncate">{item.title}</h2>
                        <p className="text-sm md:text-xl flex-right">{formatPriceCOP(item.price)}</p>
                        <p className="text-sm md:text-xl">({item.quantity || 1})</p>
                        <button 
                            onClick={() => removeFromCart(item._id)}
                            className="text-sm md:text-xl text-red-300 hover:text-red-600 px-2 py-1 rounded"
                        >
                            <BsFillTrash3Fill />
                        </button>
                    </li>
                ))}
            </ul>
            
            <p className="text-xl font-bold p-4">Total: {formatPriceCOP(total)}</p>
            
            <div className="flex justify-start gap-8">
                <button onClick={handleBuy}
                    className="bg-indigo-500 hover:bg-purple-600 text-white font-bold px-2 py-1 rounded"
                >
                    Comprar
                </button>
                <button onClick={() => clearCart()}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold px-2 py-1 rounded"
                >
                    Vaciar carrito
                </button>
            </div>

        </div>
    );
}
