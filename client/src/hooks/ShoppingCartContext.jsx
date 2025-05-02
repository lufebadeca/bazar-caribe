import { createContext, useContext, useState } from "react";

const ShoppingCartContext = createContext(undefined);

export const ShoppingCartProvider = ({children}) => {
    const [cart, setCart] = useState([]);

    const addToCart = (product) => {
        console.log(product)
        setCart(prevCart => [...prevCart, product]);
    }

    const removeFromCart = (productId) => {
        setCart(cart.filter((product) => product._id !== productId));
    }

    const clearCart = () => {
        setCart([]);
    }

    return (
        <ShoppingCartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
            {children}
        </ShoppingCartContext.Provider>
    )
}

export const useShoppingCart = () => useContext(ShoppingCartContext);