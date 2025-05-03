import { createContext, useContext, useState, useEffect } from "react";

const ShoppingCartContext = createContext(undefined);

export const ShoppingCartProvider = ({children}) => {
    
    const [cart, setCart] = useState(() => {
        // Al iniciar: leer del localStorage
        const storedCart = localStorage.getItem("shoppingCart");
        return storedCart ? JSON.parse(storedCart) : [];
    });

    // Cuando el carrito cambia: guardar en localStorage
    useEffect(() => {
        localStorage.setItem("shoppingCart", JSON.stringify(cart));
    }, [cart]);

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