import { useShoppingCart } from "../hooks/ShoppingCartContext";
import { FaCartShopping } from "react-icons/fa6";

export default function Cart() {
    const {cart, removeFromCart} = useShoppingCart();
    return (
        <div>
            <h1>Carrito</h1>
            <ul>
                {cart.map(item => (
                    <li key={item._id}>
                        <img src={item.imageUrl} alt={item.title} />
                        <h2>{item.title}</h2>
                        <p>{item.price}</p>
                        <p>{item.quantity}</p>
                        <button onClick={() => removeFromCart(item._id)}>Eliminar</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
