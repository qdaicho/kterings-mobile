import React, { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import SideDrawer from '@/components/screens/SideDrawer';

import Order from '@assets/images/orders_icon.svg';
import Account from '@assets/images/account_icon.svg';
import Heart from '@assets/images/heart_icon.svg';
import Support from '@assets/images/support_icon.svg';
import Star from '@assets/images/star_icon.svg';
import { AntDesign } from '@expo/vector-icons';

import { User } from '@/hooks/types';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Drawer = createDrawerNavigator();

export default function Layout() {
    const [userDetails, setUserDetails] = useState<User | null>(null);
    const [loadCount, setLoadCount] = useState<number>(0);

    const fetchUserDetails = async (forceRefresh = false) => {
        try {
            const token = await SecureStore.getItemAsync("token");
            if (!token) throw new Error("Token not found");

            const cachedUserDetails = await AsyncStorage.getItem('userDetails');
            const cachedLoadCount = await AsyncStorage.getItem('loadCount');

            const newLoadCount = cachedLoadCount ? parseInt(cachedLoadCount) + 1 : 1;
            setLoadCount(newLoadCount);
            await AsyncStorage.setItem('loadCount', newLoadCount.toString());

            if (cachedUserDetails && !forceRefresh && newLoadCount <= 10) {
                setUserDetails(JSON.parse(cachedUserDetails));
                return;
            }

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

            await AsyncStorage.setItem('userDetails', JSON.stringify(data.user));
            console.log(data.user);

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
            <NavigationContainer>
                <Drawer.Navigator
                    screenOptions={{
                        drawerStyle: { width: Dimensions.get('window').width },
                        drawerLabelStyle: {
                            color: 'black',
                            fontSize: 14,
                            fontFamily: 'TT Chocolates Trial Medium'
                        },
                        drawerActiveTintColor: '#BF1E2E',
                        drawerActiveBackgroundColor: '#FFFFFF',
                        drawerInactiveTintColor: '#000000',
                        drawerInactiveBackgroundColor: '#FFFFFF',
                        headerShown: false,
                    }}
                    drawerContent={(props) => <SideDrawer {...props} />}
                >
                    <Drawer.Screen
                        name="Home"
                        // Replace require(...) with your actual screen component imports as needed
                        component={require('./index').default}
                        options={{
                            drawerLabel: 'Home',
                            title: 'Home',
                            drawerIcon: () => <AntDesign name="home" size={24} color="black" />
                        }}
                    />
                    <Drawer.Screen
                        name="Orders"
                        component={require('./orders/index').default}
                        options={{
                            drawerLabel: 'Orders',
                            title: 'Orders',
                            drawerIcon: ({ focused }) => (
                                <Order color={focused ? '#BF1E2E' : '#000000'} />
                            ),
                        }}
                    />
                    <Drawer.Screen
                        name="Account"
                        component={require('./account/index').default}
                        options={{
                            drawerLabel: 'Account',
                            title: 'Account',
                            drawerIcon: () => <Account />
                        }}
                    />
                    <Drawer.Screen
                        name="Favorites"
                        component={require('./favorites/index').default}
                        options={{
                            drawerLabel: 'Saved Kterers',
                            title: 'Saved Kterers',
                            drawerIcon: () => <Heart />
                        }}
                    />
                    <Drawer.Screen
                        name="Support"
                        component={require('./support/index').default}
                        options={{
                            drawerLabel: 'Help and Support',
                            title: 'Help and Support',
                            drawerIcon: () => <Support />
                        }}
                    />
                    <Drawer.Screen
                        name="BecomeKterer"
                        component={require('./becomekterer/index').default}
                        options={{
                            drawerLabel: userDetails?.user_type === 'kterer'
                                ? 'Kterer Dashboard'
                                : 'I want to become a Kterer',
                            title: userDetails?.user_type === 'kterer'
                                ? 'Kterer Dashboard'
                                : 'I want to become a Kterer',
                            drawerIcon: () => <Star />
                        }}
                    />
                </Drawer.Navigator>
            </NavigationContainer>
        </GestureHandlerRootView>
    );
}
