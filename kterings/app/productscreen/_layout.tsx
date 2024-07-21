import { Slot } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { CartProvider } from '@/hooks/CartContext';
import React from 'react';
export default function Layout() {
    return (
        <CartProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <Slot />
            </GestureHandlerRootView>
        </CartProvider>
    );
}
