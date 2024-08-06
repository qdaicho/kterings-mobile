import { View, Text, StyleSheet, FlatList, Image, ImageSourcePropType, Pressable } from 'react-native';
import React, { SetStateAction, useEffect, useState } from 'react';
import BackButton from '@/components/common/BackButton';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import KButton from '@/components/common/KButton';
import { Food, Order } from '@/hooks/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebView } from 'react-native-webview';
import * as SecureStore from 'expo-secure-store';

export default function index() {
    const [cart, setCart] = useState<any[]>([]);
    const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
    const [webViewVisible, setWebViewVisible] = useState(false);
    const [webViewUrl, setWebViewUrl] = useState<string | null>(null);
    const [selectedAddress, setSelectedAddress] = useState<string | null>(null);

    const fetchFoodImage = async (foodId: string) => {
        try {
            const accessToken = await SecureStore.getItemAsync("token");
            const apiURL = process.env.EXPO_PUBLIC_API_URL;
            const response = await fetch(`${apiURL}/food/${foodId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const data = await response.json();
            if (response.ok && data.data.images.length > 0) {
                return data.data.images[0].image_url;
            } else {
                console.error("Failed to fetch food image");
                return null;
            }
        } catch (error) {
            console.error("Failed to fetch food image", error);
            return null;
        }
    };

    const getStoredAddress = async (): Promise<SetStateAction<string | null>> => {
        try {
            const storedAddress = await SecureStore.getItemAsync('selectedAddress');
            if (storedAddress) {
                return JSON.parse(storedAddress).address;
            }
            return null;
        } catch (error) {
            console.error('Error getting stored address:', error);
            return null;
        }
    };

    useEffect(() => {
        const loadCurrentOrder = async () => {
            try {
                setSelectedAddress(await getStoredAddress());

                const storedOrder = await AsyncStorage.getItem('current_order');
                if (storedOrder) {
                    const parsedOrder = JSON.parse(storedOrder);
                    setCurrentOrder(parsedOrder);

                    // Fetch images for each item in the order
                    const cartWithImages = await Promise.all(parsedOrder.items.map(async (item: any) => {
                        const imageUrl = await fetchFoodImage(item.food_id);
                        return { ...item, image: imageUrl ? { uri: imageUrl } : require('@assets/images/products/lasagna.jpg') };
                    }));
                    setCart(cartWithImages);
                }
            } catch (error) {
                console.error('Failed to load current order', error);
            }
        };
        loadCurrentOrder();

    }, []);

    const openWebView = (url: string) => {
        setWebViewUrl(url);
        setWebViewVisible(true);
    };

    const closeWebView = () => {
        setWebViewVisible(false);
        setWebViewUrl(null);
    };

    if (!currentOrder) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading Order...</Text>
            </View>
        );
    }

    return (
        <>
            <BackButton
                onPress={() => router.navigate('/homepage/orders/')}
                buttonStyle={styles.backButton}
            />
            {webViewVisible && webViewUrl ? (
                <View style={{ flex: 1 }}>
                    <WebView source={{ uri: webViewUrl }} style={{ marginTop: 50, marginHorizontal: 30, marginBottom: 20 }} />
                    <Pressable style={styles.closeButton} onPress={closeWebView}>
                        <Text style={styles.closeButtonText}>Close</Text>
                    </Pressable>
                </View>
            ) : (
                <View style={{ flex: 1, marginHorizontal: 30, flexDirection: 'column', marginTop: 60 }}>
                    <Text style={{ fontSize: 16, fontFamily: 'TT Chocolates Trial Medium', color: '#BF1E2E', alignSelf: 'flex-end' }}>Help</Text>
                    <View style={{ marginTop: 30, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <Text style={{ fontSize: 16, fontFamily: 'TT Chocolates Trial Bold', color: '#000000' }}>Order No.: {currentOrder.id}</Text>
                        <Text style={{ fontSize: 14, fontFamily: 'TT Chocolates Trial Regular', color: '#000000' }}>Receipt #{currentOrder.id}</Text>
                    </View>

                    <FlatList
                        style={{ maxHeight: 200, marginTop: 20 }}
                        data={cart}
                        keyExtractor={(item) => item.order_id.toString()}
                        renderItem={({ item }) => (
                            <View style={{}}>
                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', marginBottom: 20, alignItems: 'center' }}>
                                    <Text style={{ fontSize: 14, fontFamily: 'TT Chocolates Trial Medium', color: '#000000', marginRight: 20 }}>x{item.quantity}</Text>
                                    <Image source={item.image} style={{ width: 50, height: 50, borderRadius: 10, marginRight: 10, resizeMode: 'cover' }} />
                                    <View style={{ flex: 1, flexDirection: "column", justifyContent: 'flex-start' }}>
                                        <Text style={{ fontSize: 14, fontFamily: 'TT Chocolates Trial Medium', color: '#D00024' }}>{item.name}</Text>
                                    </View>
                                    <Text style={{ fontSize: 14, fontFamily: 'TT Chocolates Trial Medium', color: '#000000' }}>${item.price}</Text>
                                </View>
                            </View>
                        )}
                    />

                    <Text style={{ fontSize: 16, fontFamily: 'TT Chocolates Trial Bold', color: '#000000', alignItems: 'flex-start', marginTop: 20 }}>Delivered to</Text>

                    <View style={{ marginTop: 10 }}>
                        <Text style={{ fontSize: 13, fontFamily: 'TT Chocolates Trial Bold', color: '#000000' }}>Home</Text>
                        <Text style={{ fontSize: 12, fontFamily: 'TT Chocolates Trial Medium', color: '#000000' }}>{selectedAddress}</Text>
                        <Text style={{ fontSize: 11, fontFamily: 'TT Chocolates Trial Medium', color: '#969696' }}>Instructions: N/A</Text>
                    </View>

                    <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <Text style={{ fontSize: 10, fontFamily: 'TT Chocolates Trial Medium', color: '#969696', alignItems: 'flex-start' }}>GST (5%)</Text>
                        <Text style={{ fontSize: 10, fontFamily: 'TT Chocolates Trial Medium', color: '#969696', alignItems: 'flex-start' }}>${(currentOrder.total_price * 0.05).toFixed(2)}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 10 }}>
                        <Text style={{ fontSize: 10, fontFamily: 'TT Chocolates Trial Medium', color: '#969696', alignItems: 'flex-start' }}>Discount (from voucher)</Text>
                        <Text style={{ fontSize: 10, fontFamily: 'TT Chocolates Trial Medium', color: '#969696', alignItems: 'flex-start' }}>-$0</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 10 }}>
                        <Text style={{ fontSize: 10, fontFamily: 'TT Chocolates Trial Medium', color: '#969696', alignItems: 'flex-start' }}>Delivery fee</Text>
                        <Text style={{ fontSize: 10, fontFamily: 'TT Chocolates Trial Medium', color: '#969696', alignItems: 'flex-start' }}>FREE</Text>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 20 }}>
                        <Text style={{ fontSize: 14, fontFamily: 'TT Chocolates Trial Medium', color: '#000000', alignItems: 'flex-start' }}>Total (incl. GST)</Text>
                        <Text style={{ fontSize: 14, fontFamily: 'TT Chocolates Trial Medium', color: '#000000', alignItems: 'flex-start' }}>${currentOrder.total_price.toFixed(2)}</Text>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginTop: 30 }}>
                        <KButton
                            onPress={() => openWebView(currentOrder.track_url)}
                            title="Track Order"
                            buttonStyle={styles.button}
                            textStyle={{ fontSize: 14 }}
                        />
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 20 }}>
                        <KButton
                            onPress={() => openWebView(currentOrder.receipt_url)}
                            title="View Receipt"
                            buttonStyle={styles.button}
                            textStyle={{ fontSize: 14 }}
                        />
                        <KButton
                            onPress={() => router.navigate('/rateorder/')}
                            title="Rate Order"
                            buttonStyle={styles.button}
                            textStyle={{ fontSize: 14 }}
                        />
                    </View>
                </View>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    backButton: {
        position: 'absolute',
        top: 50,
        left: 30,
        zIndex: 2,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 20,
        fontFamily: 'TT Chocolates Trial Bold',
        color: '#000000',
    },
    closeButton: {
        position: 'absolute',
        bottom: 50,
        right: 15,
        backgroundColor: '#BF1E2E',
        padding: 10,
        borderRadius: 10,
        zIndex: 2,
    },
    closeButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontFamily: 'TT Chocolates Trial Bold',
    },
    button: {
        width: '45%',
        paddingHorizontal: 20,
        height: 50,
    },
});
