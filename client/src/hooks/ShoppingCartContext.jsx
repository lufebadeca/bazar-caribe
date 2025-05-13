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

    const incrementQuantity = (productId) => {
        setCart(cart.map((product) =>
            product._id === productId ? { ...product, quantity: product.quantity + 1 } : product
        ));
    };

    const decrementQuantity = (productId) => {
        setCart(cart.map((product) =>
            product._id === productId ? { ...product, quantity: Math.max(1, product.quantity - 1) } : product
        ));
    };

    const getCartTotal = () => {
        return cart.reduce((acc, item) => {
            const itemQuantity = item.quantity || 1; // Si no hay cantidad, asume 1
            return acc + (item.price * itemQuantity);
        }, 0);
    };

    const clearCart = () => {
        setCart([]);
    }

    return (
      <ShoppingCartContext.Provider
        value={{
          cart,
          addToCart,
          removeFromCart,
          clearCart,
          getCartTotal,
          incrementQuantity,
          decrementQuantity,
        }}
      >
        {children}
      </ShoppingCartContext.Provider>
    );
}

export const useShoppingCart = () => useContext(ShoppingCartContext);