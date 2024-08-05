import { View, Text, StyleSheet, Image, FlatList } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import BackButton from "@/components/common/BackButton";
import { router } from 'expo-router';
import PaymentImage from "@/assets/images/payment_img.svg";
import Motorcycle from "@assets/images/motorcycle_small.svg";
import KBottomButton from '@/components/common/KBottomButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StripeProvider, usePaymentSheet } from '@stripe/stripe-react-native';
import useCart from "@/hooks/useCart";
import { DoorDashResponse, PaymentIntent, ProductStored, SessionData } from '@/hooks/types';
import * as SecureStore from 'expo-secure-store';
import { useNotifications } from '@/hooks/NotificationContext';

const Payment = () => {
    const { cartItems, updateItemQuantity } = useCart();
    const [deliveryFee, setDeliveryFee] = useState<number>(0);
    const [estimatedDeliveryTime, setEstimatedDeliveryTime] = useState<number | null>(null);
    const [sessionData, setSessionData] = useState<SessionData | null>(null);
    const [productStored, setProductStored] = useState<ProductStored[]>([]);
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [tax, setTax] = useState<number>(0);
    const [paymentIntent, setPaymentIntent] = useState<PaymentIntent>({} as PaymentIntent);
    const [ephemeralKey, setEphemeralKey] = useState<string>('');
    const [customerId, setCustomerId] = useState<string>('');
    const [orders, setOrders] = useState<any[]>([]);

    const { updateNotifications } = useNotifications();

    const getUserOrders = async () => {
        const accessToken = await SecureStore.getItemAsync("token");
        const apiURL = process.env.EXPO_PUBLIC_API_URL;

        try {
            const response = await fetch(`${apiURL}/api/orders`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (!response.ok) {
                console.error(`Error: ${response.statusText}`);
                return;
            }

            const data = await response.json();

            setOrders(data.orders);
            console.log(data.orders);
        } catch (error) {
            console.error(`Error: ${error}`);
        }
    };

    const getNotifications = async () => {
        const accessToken = await SecureStore.getItemAsync("token");
        const apiURL = process.env.EXPO_PUBLIC_API_URL;

        try {
            const response = await fetch(`${apiURL}/api/notifications`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (!response.ok) {
                console.error(`Error: ${response.statusText}`);
                return;
            }

            const data = await response.json();

            updateNotifications(
                data.map((not: any) => ({
                    id: not.id,
                    message: not.data.message,
                    created_at: new Date(not.created_at),
                    read_at: not.read_at ? new Date(not.read_at) : null,
                }))
            );
        } catch (error) {
            console.error(`Error: ${error}`);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [doordashData, sessionData, productStoredData, ephemeralKey, customer, paymentIntent] = await Promise.all([
                    AsyncStorage.getItem('doordash'),
                    AsyncStorage.getItem('sessionData'),
                    AsyncStorage.getItem('productStored'),
                    AsyncStorage.getItem('ephemeralKey'),
                    AsyncStorage.getItem('customer'),
                    AsyncStorage.getItem('paymentIntent')
                ]);

                if (doordashData) {
                    const parsedData: DoorDashResponse = JSON.parse(doordashData);
                    setDeliveryFee(parseFloat((parsedData.data.fee / 100).toFixed(2)));
                    const dropoffTime = new Date(parsedData.data.dropoff_time_estimated);
                    const currentTime = new Date();
                    const diffTime = Math.ceil((dropoffTime.getTime() - currentTime.getTime()) / 60000);
                    setEstimatedDeliveryTime(diffTime);

                    console.log(JSON.stringify(doordashData, null, 2));
                }

                if (sessionData) {
                    setSessionData(JSON.parse(sessionData));
                }

                if (productStoredData) {
                    setProductStored(JSON.parse(productStoredData));
                }

                if (ephemeralKey) {
                    setEphemeralKey(ephemeralKey);
                }

                if (customer) {
                    setCustomerId(customer);
                }

                if (paymentIntent) {
                    setPaymentIntent(JSON.parse(paymentIntent));
                }
            } catch (e) {
                console.error("Failed to load data from AsyncStorage", e);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const calculatedTax = parseFloat((cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0) * 0.13).toFixed(2));
        setTax(calculatedTax);
        const calculatedTotalPrice = parseFloat((cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0) + deliveryFee + calculatedTax).toFixed(2));
        setTotalPrice(calculatedTotalPrice);
    }, [cartItems, deliveryFee]);

    const { initPaymentSheet, presentPaymentSheet, confirmPaymentSheetPayment } = usePaymentSheet();

    const initializePaymentSheet = useCallback(async () => {
        const { error } = await initPaymentSheet({
            merchantDisplayName: "Kterings",
            customerId,
            paymentIntentClientSecret: paymentIntent.client_secret,
            allowsDelayedPaymentMethods: true,
            style: 'alwaysLight',
            returnURL: 'example://stripe-redirect',
        });
        if (error) {
            console.log('Error', JSON.stringify(error, null, 4));
        }
    }, [customerId, paymentIntent.client_secret]);

    useEffect(() => {
        initializePaymentSheet();
    }, [initializePaymentSheet]);

    const didTapCheckoutButton = async () => {
        const { paymentOption, error } = await presentPaymentSheet();

        if (error) {
            console.log('Error', error);
        } else {
            // Payment was confirmed
            if (sessionData?.id) {
                try {
                    const accessToken = await SecureStore.getItemAsync("token");
                    const apiURL = process.env.EXPO_PUBLIC_API_URL;

                    // Update sessionData to include paymentIntent inside the payment_intent field
                    const updatedSessionData = {
                        ...sessionData,
                        payment_intent: paymentIntent,
                    };

                    console.log(JSON.stringify(updatedSessionData, null, 2));

                    // console.log('storedData', updatedSessionData);

                    // console.log('productData', productStored);

                    const response = await fetch(`${apiURL}/checkoutorder`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${accessToken}`,
                        },
                        body: JSON.stringify({
                            storedData: updatedSessionData,
                            productData: productStored,
                        }),
                    });

                    if (!response.ok) {
                        console.error(`Error not okay: ${response.statusText} ${response.status} ${response.body}`);
                        return;
                    }

                    getUserOrders();
                    getNotifications();
                    router.navigate("/homepage");
                } catch (error: any) {
                    console.error(`Error: ${error.message}`);
                }
            } else {
                getUserOrders();
                getNotifications();
            }
        }
    };

    const handleQuantityChange = async (action: 'increase' | 'decrease', itemId: string, size: string) => {
        const currentItem = cartItems.find(item => item.id === itemId && item.size === size);
        if (!currentItem) return;

        const newQuantity = action === 'increase' ? currentItem.quantity + 1 : Math.max(1, currentItem.quantity - 1);
        await updateItemQuantity(itemId, size, newQuantity);
    };

    const formatCurrency = (amount: number): string => (amount / 100).toFixed(2);

    return (
        <StripeProvider publishableKey={'pk_test_51O1AQjGFtYheM9I3s9jtNKzoAqI2smtkxaGykmidKAiqrzwO7YTSKOL4JkgRqt25QUwPs7sR70iyfAKLu7PTQeoT00GAzX2IdJ'}>
            <BackButton onPress={() => router.navigate("/cart/")} buttonStyle={styles.backButton} />
            <View style={styles.container}>
                <FlatList
                    style={{ height: 300 }}
                    data={productStored}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item) => item.price_data.product_data.metadata.food_id}
                    renderItem={({ item }) => (
                        <View key={item.price_data.product_data.metadata.food_id}>
                            <View style={styles.cartItem}>
                                <Text style={styles.cartItemQuantity}>x{item.quantity}</Text>
                                <Image source={{ uri: item.price_data.product_data.images[0] }} style={styles.cartItemImage} />
                                <View style={styles.cartItemDetails}>
                                    <Text style={styles.cartItemName}>{item.price_data.product_data.name}</Text>
                                    <Text style={styles.cartItemSize}>{item.price_data.product_data.metadata.size}</Text>
                                </View>
                                <Text style={styles.cartItemPrice}>${formatCurrency(item.price_data.unit_amount * item.quantity)}</Text>
                            </View>
                            <View style={styles.separator} />
                        </View>
                    )}
                    ListHeaderComponent={() =>
                        <View style={styles.paymentContainer}>
                            <PaymentImage />
                            <View style={styles.motorcycleContainer}>
                                <Motorcycle />
                                <View style={styles.deliveryInfo}>
                                    <Text style={styles.deliveryText}>Estimated Delivery</Text>
                                    <Text style={styles.deliveryTime}>{estimatedDeliveryTime !== null ? `${estimatedDeliveryTime} minutes` : 'Loading...'}</Text>
                                </View>
                            </View>
                        </View>
                    }
                    ListFooterComponent={() =>
                        <>
                            <Text style={styles.orderSummary}>Order Summary</Text>
                            <View style={styles.summaryItem}>
                                <Text style={styles.summaryLabel}>Subtotal</Text>
                                <Text style={styles.summaryValue}>
                                    ${cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}
                                </Text>
                            </View>
                            <View style={styles.deliveryFeeContainer}>
                                <Text style={styles.deliveryFeeLabel}>Delivery Fee</Text>
                                <Text style={styles.deliveryFeeValue}>${deliveryFee}</Text>
                            </View>
                            <View style={styles.separator} />
                            <Text style={styles.termsText}>
                                By completing this order, I agree to all
                                <Text style={styles.termsLink}> terms & conditions.</Text>
                            </Text>
                            <View style={styles.taxContainer}>
                                <Text style={styles.taxLabel}>HST (13%)</Text>
                                <Text style={styles.taxValue}>${tax}</Text>
                            </View>
                            <View style={styles.deliveryFeeSummaryContainer}>
                                <Text style={styles.deliveryFeeSummaryLabel}>Delivery fee</Text>
                                <Text style={styles.deliveryFeeSummaryValue}>${deliveryFee}</Text>
                            </View>
                            <View style={styles.totalContainer}>
                                <Text style={styles.totalLabel}>Total (incl. HST)</Text>
                                <Text style={styles.totalValue}>${totalPrice}</Text>
                            </View>
                        </>
                    }
                />
            </View>
            <KBottomButton onPress={didTapCheckoutButton} title='Place Order' />
        </StripeProvider>
    );
};

const styles = StyleSheet.create({
    backButton: {
        position: 'absolute',
        top: 50,
        left: 30,
        zIndex: 2,
    },
    container: {
        flex: 1,
        marginHorizontal: 30,
    },
    paymentContainer: {
        position: 'relative',
        marginTop: 110,
        justifyContent: 'center',
        marginBottom: 30,
    },
    motorcycleContainer: {
        flexDirection: 'row',
        position: 'absolute',
        alignSelf: 'flex-start',
        marginLeft: 20,
    },
    deliveryInfo: {
        flexDirection: 'column',
    },
    deliveryText: {
        fontSize: 14,
        fontFamily: 'TT Chocolates Trial Bold',
        color: '#000000',
        marginLeft: 20,
    },
    deliveryTime: {
        fontSize: 12,
        fontFamily: 'TT Chocolates Trial Medium',
        color: '#000000',
        marginLeft: 20,
    },
    orderSummary: {
        fontSize: 18,
        fontFamily: 'TT Chocolates Trial Bold',
        color: '#000000',
        marginTop: 20,
    },
    summaryItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 10,
    },
    summaryLabel: {
        fontSize: 12,
        fontFamily: 'TT Chocolates Trial Medium',
        color: '#000000',
    },
    summaryValue: {
        fontSize: 12,
        fontFamily: 'TT Chocolates Trial Medium',
        color: '#000000',
    },
    deliveryFeeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    deliveryFeeLabel: {
        fontSize: 12,
        fontFamily: 'TT Chocolates Trial Medium',
        color: '#000000',
    },
    deliveryFeeValue: {
        fontSize: 12,
        fontFamily: 'TT Chocolates Trial Medium',
        color: '#000000',
    },
    separator: {
        height: 1,
        backgroundColor: '#E9E9E9',
        width: "auto",
        marginBottom: 20,
    },
    termsText: {
        fontSize: 10,
        fontFamily: 'TT Chocolates Trial Medium',
        color: '#969696',
    },
    termsLink: {
        fontSize: 10,
        fontFamily: 'TT Chocolates Trial Medium',
        color: '#F90000',
    },
    taxContainer: {
        marginTop: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    taxLabel: {
        fontSize: 10,
        fontFamily: 'TT Chocolates Trial Medium',
        color: '#969696',
    },
    taxValue: {
        fontSize: 10,
        fontFamily: 'TT Chocolates Trial Medium',
        color: '#969696',
    },
    deliveryFeeSummaryContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginTop: 10,
    },
    deliveryFeeSummaryLabel: {
        fontSize: 10,
        fontFamily: 'TT Chocolates Trial Medium',
        color: '#969696',
    },
    deliveryFeeSummaryValue: {
        fontSize: 10,
        fontFamily: 'TT Chocolates Trial Medium',
        color: '#969696',
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginTop: 20,
    },
    totalLabel: {
        fontSize: 14,
        fontFamily: 'TT Chocolates Trial Medium',
        color: '#000000',
    },
    totalValue: {
        fontSize: 14,
        fontFamily: 'TT Chocolates Trial Medium',
        color: '#000000',
    },
    cartItem: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginBottom: 20,
        alignItems: 'center',
    },
    cartItemImage: {
        width: 50,
        height: 50,
        borderRadius: 10,
        marginRight: 10,
        resizeMode: 'cover',
    },
    cartItemDetails: {
        flex: 1,
        flexDirection: "column",
        justifyContent: 'flex-start',
    },
    cartItemName: {
        fontSize: 14,
        fontFamily: 'TT Chocolates Trial Medium',
        color: '#D00024',
    },
    cartItemSize: {
        fontSize: 11,
        fontFamily: 'TT Chocolates Trial Medium',
        color: '#969696',
    },
    cartItemPrice: {
        fontSize: 14,
        fontFamily: 'TT Chocolates Trial Medium',
        color: '#000000',
    },
    cartItemQuantity: {
        fontSize: 14,
        fontFamily: 'TT Chocolates Trial Medium',
        color: '#000000',
        marginRight: 20,
    },
});

export default Payment;
