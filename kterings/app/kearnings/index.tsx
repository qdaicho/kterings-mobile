import { View, Text, Pressable, FlatList, RefreshControl } from 'react-native';
import React, { useEffect, useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import BackButton from "@/components/common/BackButton";
import KDashboardComponent from "@components/common/KDashboardComponent";
import * as SecureStore from 'expo-secure-store';
import { User, EarningsResponse, KOrder } from '@/hooks/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Index() {
    const [totalEarnings, setTotalEarnings] = useState<number>(0);
    const [inProgressOrders, setInProgressOrders] = useState<KOrder[]>([]);
    const [openOrders, setOpenOrders] = useState<KOrder[]>([]);
    const [completedOrders, setCompletedOrders] = useState<KOrder[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    const fetchEarningsAndOrders = async () => {
        try {
            const token = await SecureStore.getItemAsync("token");
            if (!token) throw new Error("Token not found");

            // Fetch user details
            const userResponse = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/user`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!userResponse.ok) throw new Error(`Error fetching user: ${userResponse.statusText}`);

            const { user }: { user: User } = await userResponse.json();
            const clientId = user.client_id;

            // Fetch earnings data
            const earningsResponse = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/stripe/earnings?client_id=${clientId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!earningsResponse.ok) throw new Error(`Error fetching earnings: ${earningsResponse.statusText}`);

            const earningsData: EarningsResponse = await earningsResponse.json();
            const available = earningsData.balance.available.reduce((sum, entry) => sum + entry.amount, 0);
            const pending = earningsData.balance.pending.reduce((sum, entry) => sum + entry.amount, 0);
            const total = (available + pending) / 100;
            setTotalEarnings(total);

            // Fetch orders of Kterer
            const ordersResponse = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/kterer/orders`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!ordersResponse.ok) throw new Error(`Error fetching orders: ${ordersResponse.statusText}`);

            const ordersData = await ordersResponse.json();
            const inProgress = ordersData.orders.filter((order: KOrder) => order.status === 'progress');
            const open = ordersData.orders.filter((order: KOrder) => order.status === 'created');
            const completed = ordersData.orders.filter((order: KOrder) => order.status === 'delivered' || order.status === 'cancelled');


            setInProgressOrders(inProgress);
            setOpenOrders(open);
            setCompletedOrders(completed);

            // Cache data
            await AsyncStorage.setItem('earnings', JSON.stringify(total));
            await AsyncStorage.setItem('inProgressOrders', JSON.stringify(inProgress));
            await AsyncStorage.setItem('openOrders', JSON.stringify(open));
            await AsyncStorage.setItem('completedOrders', JSON.stringify(completed));

        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const loadCachedData = async () => {
        try {
            const cachedEarnings = await AsyncStorage.getItem('earnings');
            const cachedInProgressOrders = await AsyncStorage.getItem('inProgressOrders');
            const cachedOpenOrders = await AsyncStorage.getItem('openOrders');
            const cachedCompletedOrders = await AsyncStorage.getItem('completedOrders');

            if (cachedEarnings) setTotalEarnings(JSON.parse(cachedEarnings));
            if (cachedInProgressOrders) setInProgressOrders(JSON.parse(cachedInProgressOrders));
            if (cachedOpenOrders) setOpenOrders(JSON.parse(cachedOpenOrders));
            if (cachedCompletedOrders) setCompletedOrders(JSON.parse(cachedCompletedOrders));
        } catch (error) {
            console.error("Error loading cached data:", error);
        }
    };

    useEffect(() => {
        loadCachedData().then(() => fetchEarningsAndOrders());
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchEarningsAndOrders();
        setRefreshing(false);
    };

    const renderSectionHeader = (title: string) => (
        <Text style={{
            fontSize: 15,
            fontFamily: 'TT Chocolates Trial Bold',
            color: '#000000',
            width: '80%',
            alignSelf: 'flex-start',
            // marginLeft: 40,
            // marginTop: 40,
        }}>{title}</Text>
    );

    return (
        <View style={{ flex: 1, backgroundColor: '#BF1E2E' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 70, marginHorizontal: 10 }}>
                <BackButton onPress={() => router.navigate('/homepage/becomekterer')} textStyle={{ color: '#FFFFFF' }} color={'#FFFFFF'} />
                <Text style={{ fontSize: 15, fontFamily: 'TT Chocolates Trial Bold', color: '#FFFFFF' }}>Kterer Dashboard</Text>
                <Pressable onPress={() => console.log('Pressed')}>
                    <MaterialCommunityIcons name="bell-outline" size={24} color="#FFFFFF" style={{ marginRight: 20 }} />
                </Pressable>
            </View>

            <View style={{ flexDirection: 'column', justifyContent: 'center', marginTop: 30, alignItems: 'center' }}>
                <Text style={{ fontSize: 28, fontFamily: 'TT Chocolates Trial Bold', color: '#FFFFFF' }}>${totalEarnings.toFixed(2)}</Text>
                <Text style={{ fontSize: 12, fontFamily: 'TT Chocolates Trial Medium', color: '#FFFFFF', marginLeft: 10, marginRight: 10 }}>Today’s Total</Text>
            </View>

            <View style={{
                backgroundColor: '#FFFFFF',
                marginTop: 30,
                alignItems: 'flex-start',
                flex: 1,
                borderTopLeftRadius: 50,
                borderTopRightRadius: 50,
            }}>
                <FlatList
                    data={[
                        { title: 'In Progress', data: inProgressOrders },
                        { title: 'Open', data: openOrders },
                        { title: 'Completed', data: completedOrders }
                    ]}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View style={{ marginTop: 20, marginHorizontal: 20 }}>
                            <View>{renderSectionHeader(item.title)}</View>
                            {item.data.map((order) => (
                                <KDashboardComponent key={order.id} order={order} />
                            ))}
                        </View>
                    )}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    // ListHeaderComponent={() => (
                    //     <>
                    //         {renderSectionHeader('In Progress')}
                    //         {inProgressOrders.length === 0 && (
                    //             <Text style={{ marginLeft: 40, marginTop: 10 }}>No In Progress Orders</Text>
                    //         )}
                    //         {renderSectionHeader('Open')}
                    //         {openOrders.length === 0 && (
                    //             <Text style={{ marginLeft: 40, marginTop: 10 }}>No Open Orders</Text>
                    //         )}
                    //         {renderSectionHeader('Completed')}
                    //         {completedOrders.length === 0 && (
                    //             <Text style={{ marginLeft: 40, marginTop: 10 }}>No Completed Orders</Text>
                    //         )}
                    //     </>
                    // )}
                />
            </View>
        </View>
    );
}
