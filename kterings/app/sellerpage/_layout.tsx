import { Slot } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React from 'react';

export default function Layout() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
                  <StatusBar style="dark" />

            <Slot />
        </GestureHandlerRootView>
    );
}
