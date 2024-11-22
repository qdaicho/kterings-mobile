import { CartProvider } from '@/hooks/CartContext';
import { NotificationProvider } from '@/hooks/NotificationContext';
import { Slot } from 'expo-router';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function Layout() {
    return (
        <CartProvider>
            <NotificationProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <Slot />
            </GestureHandlerRootView>
            </NotificationProvider>
        </CartProvider>
    );
}
