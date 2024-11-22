import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { Dimensions } from 'react-native';
import SideDrawer from '@/components/screens/SideDrawer';
import Order from '@assets/images/orders_icon.svg';
import Account from '@assets/images/account_icon.svg';
import Heart from '@assets/images/heart_icon.svg';
import Support from '@assets/images/support_icon.svg';
import Star from '@assets/images/star_icon.svg';
import { AntDesign } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { User } from '@/hooks/types';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Layout() {
    const [userDetails, setUserDetails] = useState<User | null>(null);
    const [loadCount, setLoadCount] = useState<number>(0);

    const fetchUserDetails = async (forceRefresh = false) => {
        try {
            const token = await SecureStore.getItemAsync("token");
            if (!token) throw new Error("Token not found");

            // Check if data is in cache
            const cachedUserDetails = await AsyncStorage.getItem('userDetails');
            const cachedLoadCount = await AsyncStorage.getItem('loadCount');

            // Increment load count and update AsyncStorage
            const newLoadCount = cachedLoadCount ? parseInt(cachedLoadCount) + 1 : 1;
            setLoadCount(newLoadCount);
            await AsyncStorage.setItem('loadCount', newLoadCount.toString());

            // If cached data exists and refresh is not forced, use cached data
            if (cachedUserDetails && !forceRefresh && newLoadCount <= 10) {
                setUserDetails(JSON.parse(cachedUserDetails));
                return;
            }

            // Otherwise, fetch data from the API
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/user`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error(response.statusText);

            const data = await response.json();
            setUserDetails(data.user);

            // Cache the fetched data
            await AsyncStorage.setItem('userDetails', JSON.stringify(data.user));
            console.log(data.user);

            // Reset the load count after refetch
            if (newLoadCount > 10) {
                await AsyncStorage.setItem('loadCount', '1');
            }
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    useEffect(() => {
        fetchUserDetails();
    }, []);

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <StatusBar style="dark" />

            <Drawer
                screenOptions={{
                    drawerStyle: { width: Dimensions.get('window').width },
                    drawerLabelStyle: { color: 'black', fontSize: 14, fontFamily: 'TT Chocolates Trial Medium' },
                    drawerActiveTintColor: '#BF1E2E',
                    drawerActiveBackgroundColor: '#FFFFFF',
                    drawerInactiveTintColor: '#000000',
                    drawerInactiveBackgroundColor: '#FFFFFF',
                    headerShown: false,
                }}
                drawerContent={SideDrawer}
            >
                <Drawer.Screen
                    name="index"
                    options={{
                        drawerLabel: 'Home',
                        title: 'Home',
                        drawerIcon: () => <AntDesign name="home" size={24} color="black" />
                    }}
                />
                <Drawer.Screen
                    name="orders/index"
                    options={{
                        drawerLabel: 'Orders',
                        title: 'Orders',
                        drawerIcon: ({ focused, color, size }) => <Order color={focused ? '#BF1E2E' : '#000000'} />,
                    }}
                />
                <Drawer.Screen
                    name="account/index"
                    options={{
                        drawerLabel: 'Account',
                        title: 'Account',
                        drawerIcon: () => <Account />
                    }}
                />
                <Drawer.Screen
                    name="favorites/index"
                    options={{
                        drawerLabel: 'Saved Kterers',
                        title: 'Saved Kterers',
                        drawerIcon: () => <Heart />
                    }}
                />
                <Drawer.Screen
                    name="support/index"
                    options={{
                        drawerLabel: 'Help and Support',
                        title: 'Help and Support',
                        drawerIcon: () => <Support />
                    }}
                />
                <Drawer.Screen
                    name="becomekterer/index"
                    options={{
                        drawerLabel: userDetails?.user_type === 'kterer' ? 'Kterer Dashboard' : 'I want to become a Kterer',
                        title: userDetails?.user_type === 'kterer' ? 'Kterer Dashboard' : 'I want to become a Kterer',
                        drawerIcon: () => <Star />
                    }}
                />
            </Drawer>
        </GestureHandlerRootView>
    );
}
