import React, { createContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';

interface CartContextType {
    cartCount: number;
    updateCartCount: (newCount: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
    children: ReactNode;
}

export const useCartCount = () => {
    const context = React.useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
    const [cartCount, setCartCount] = useState<number>(0);

    useEffect(() => {
        const getCartCount = async () => {
            try {
                const cart = await SecureStore.getItemAsync('cart');
                if (cart) {
                    setCartCount(JSON.parse(cart).length);
                }
            } catch (error) {
                console.error('Failed to load cart count from Secure Store', error);
            }
        };

        getCartCount();
    }, []);

    const updateCartCount = async (newCount: number) => {
        setCartCount(newCount);
        try {
            const cart = await SecureStore.getItemAsync('cart');
            const cartItems = cart ? JSON.parse(cart) : [];
            // Assuming you want to update the length of the cart here, adjust this part according to your cart structure.
            cartItems.length = newCount;
            await SecureStore.setItemAsync('cart', JSON.stringify(cartItems));
        } catch (error) {
            console.error('Failed to update cart count in Secure Store', error);
        }
    };

    return (
        <CartContext.Provider value={{ cartCount, updateCartCount }}>
            {children}
        </CartContext.Provider>
    );
};
