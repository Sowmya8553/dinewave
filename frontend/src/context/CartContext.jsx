import React, { createContext, useContext, useState, useCallback } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [cartRestaurant, setCartRestaurant] = useState(null); // { id, name }

    // Add item — enforces single-restaurant rule
    const addToCart = useCallback((item, restaurant) => {
        // If cart has items from a different restaurant, ask to clear
        if (cartRestaurant && cartRestaurant.id !== restaurant.id) {
            const ok = window.confirm(
                `Your cart has items from "${cartRestaurant.name}". Clear cart and add from "${restaurant.name}"?`
            );
            if (!ok) return;
            setCartItems([]);
        }
        setCartRestaurant(restaurant);
        setCartItems(prev => {
            const exists = prev.find(i => i._id === item._id);
            if (exists) {
                return prev.map(i => i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prev, { ...item, quantity: 1 }];
        });
    }, [cartRestaurant]);

    // Update quantity
    const updateQuantity = useCallback((itemId, delta) => {
        setCartItems(prev => {
            const updated = prev.map(i => i._id === itemId ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i);
            return updated;
        });
    }, []);

    // Remove item
    const removeFromCart = useCallback((itemId) => {
        setCartItems(prev => {
            const next = prev.filter(i => i._id !== itemId);
            if (next.length === 0) setCartRestaurant(null);
            return next;
        });
    }, []);

    // Clear cart
    const clearCart = useCallback(() => {
        setCartItems([]);
        setCartRestaurant(null);
    }, []);

    const totalItems = cartItems.reduce((s, i) => s + i.quantity, 0);
    const totalAmount = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);

    return (
        <CartContext.Provider value={{
            cartItems, cartRestaurant,
            addToCart, updateQuantity, removeFromCart, clearCart,
            totalItems, totalAmount
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used within CartProvider');
    return ctx;
};
