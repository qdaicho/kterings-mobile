import { View, Text, StyleSheet, ImageSourcePropType, Image, FlatList, VirtualizedList, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import BackButton from "@/components/common/BackButton";
import { router } from 'expo-router';
import PaymentImage from "@/assets/images/payment_img.svg";
import Motorcycle from "@assets/images/motorcycle_small.svg";
import { FontAwesome } from '@expo/vector-icons';
import KBottomButton from '@/components/common/KBottomButton';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import KButton from '@/components/common/KButton';
import { Ionicons } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
const sampleCart: any[] = [
    { id: 1, title: "Fluffy Pancakes", "notes": "Extra maple syrup", "price": 12.99, "quantity": 2, "image": require("@assets/images/products/pancakes.jpeg") },
    { id: 2, title: "Chicken Biryani", "notes": "Extra onion", "price": 5.99, "quantity": 1, "image": require("@assets/images/products/chicken_biryani.jpg") },
    { id: 3, title: "Roasted Chicken", "notes": "Extra cheese", "price": 8.99, "quantity": 3, "image": require("@assets/images/products/chicken_biryani.jpg") },
    { id: 4, title: "Fried Rice", "notes": "Extra chicken", "price": 7.99, "quantity": 1 },
];

export default function index() {

    const [cart, setCart] = useState<{
        read: boolean;
        id: number;
        title: string;
        price: number;
        quantity: number;
        notes: string;
        image: ImageSourcePropType;
    }[]>([]);

    useEffect(() => {
        // Simulate loading Cart from JSON data initially
        setCart(sampleCart.map(cart => ({ ...cart, read: false })));
        // Later, you can replace this with an API call
        // fetchCartFromAPI();
    }, []);
    const handleQuantityChange = (action: string, itemId: number) => {
        let updatedCart = cart.map(item => {
            if (item.id === itemId) {
                if (action === 'increase') {
                    return { ...item, quantity: item.quantity + 1 };
                } else if (action === 'decrease' && item.quantity >= 1) {
                    return { ...item, quantity: item.quantity - 1 };
                }
            }
            return item;
        });

        // Remove items with quantity 0
        updatedCart = updatedCart.filter(item => item.quantity > 0);

        setCart(updatedCart);
    };


    return (
        <>
            <BackButton
                onPress={() => router.navigate("/cart/")}
                buttonStyle={styles.backButton}
            />
            <View style={styles.container}>



                <FlatList
                    style={{ height: 300, }}
                    data={cart}
                    showsVerticalScrollIndicator={false}
                    // getItem={(data, index) => data[index]}
                    // getItemCount={() => cart.length}
                    keyExtractor={(item: any) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View>
                            <View key={item.id}>
                                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginBottom: 20, alignItems: 'center' }}>
                                    <Pressable onPress={() => handleQuantityChange('decrease', item.id)}>
                                        <Text style={{ fontSize: 14, fontFamily: 'TT Chocolates Trial Bold', color: '#D00024', marginRight: 10 }}>-</Text>
                                    </Pressable>
                                    <Text style={{ fontSize: 14, fontFamily: 'TT Chocolates Trial Medium', color: '#000000', marginRight: 10 }}>{item.quantity}</Text>
                                    <Pressable onPress={() => handleQuantityChange('increase', item.id)}>
                                        <Text style={{ fontSize: 14, fontFamily: 'TT Chocolates Trial Bold', color: '#D00024', marginRight: 20 }}>+</Text>
                                    </Pressable>
                                    <Image source={item.image} style={{ width: 50, height: 50, borderRadius: 10, marginRight: 10, resizeMode: 'cover' }} />
                                    <View style={{ flex: 1, flexDirection: "column", justifyContent: 'flex-start' }}>
                                        <Text style={{ fontSize: 14, fontFamily: 'TT Chocolates Trial Medium', color: '#D00024' }}>{item.title}</Text>
                                        <Text style={{ fontSize: 11, fontFamily: 'TT Chocolates Trial Medium', color: '#969696' }}>{item.notes}</Text>
                                    </View>
                                    <Text style={{ fontSize: 14, fontFamily: 'TT Chocolates Trial Medium', color: '#000000' }}>${item.price * item.quantity}</Text>
                                </View>
                                <View style={{ height: 1, backgroundColor: '#E9E9E9', width: "auto", marginBottom: 20 }} />
                            </View>
                        </View>

                    )}



                    ListHeaderComponent={() =>
                        <View style={styles.paymentContainer}>
                            <PaymentImage />
                            <View style={styles.motorcycleContainer}>
                                <Motorcycle />
                                <View style={styles.deliveryInfo}>
                                    <Text style={styles.deliveryText}>Estimated Delivery</Text>
                                    <Text style={styles.deliveryTime}>20 minutes</Text>
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
                                    ${cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}
                                </Text>
                            </View>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                                <Text style={{ fontSize: 12, fontFamily: 'TT Chocolates Trial Medium', color: '#000000' }}>Delivery Fee</Text>
                                <Text style={{ fontSize: 12, fontFamily: 'TT Chocolates Trial Medium', color: '#000000' }}>Free</Text>
                            </View>

                            <View style={{ height: 1, backgroundColor: '#E9E9E9', width: "auto", marginBottom: 20 }} />


                            <Text style={{ fontSize: 10, fontFamily: 'TT Chocolates Trial Medium', color: '#969696' }}>
                                By completing this order, I agree to all
                                <Text style={{ fontSize: 10, fontFamily: 'TT Chocolates Trial Medium', color: '#F90000' }}> terms & conditions.</Text>
                            </Text>

                            <Text style={{ fontSize: 14, fontFamily: 'TT Chocolates Trial Bold', color: '#000000', marginTop: 20 }}>
                                Use a voucher
                            </Text>

                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, justifyContent: 'space-between', gap: 20 }}>
                                <TextInput
                                    style={{
                                        height: 50, backgroundColor: '#EBEBEB', borderRadius: 5,
                                        fontSize: 14, fontFamily: 'TT Chocolates Trial Medium',
                                        paddingHorizontal: 10, width: 'auto', flex: 0.8,
                                    }}
                                    placeholder="Enter a voucher code"
                                    placeholderTextColor={'#B2B2B2'}
                                />
                                <KButton onPress={() => { }} title="Apply" buttonStyle={{ width: 'auto', paddingHorizontal: 20, flex: 0.2 }} textStyle={{ fontSize: 12 }} />
                            </View>

                            <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }} >
                                <Ionicons name="ticket-outline" size={20} color="#BF1E2E" />
                                <Text style={{ fontSize: 12, fontFamily: 'TT Chocolates Trial Bold', color: '#BF1E2E' }}>
                                    KTERSFEB14
                                </Text>
                            </View>

                            <View style={{ marginTop: 20 }}>
                                <Text style={{ fontSize: 14, fontFamily: 'TT Chocolates Trial Bold', color: '#000000' }}>Payment Details</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                                <FontAwesome name="cc-stripe" size={25} color="#5433FF" />
                                <Text style={{ fontSize: 13, fontFamily: 'TT Chocolates Trial Medium', color: '#969696', marginLeft: 20, fontStyle: 'italic' }}>Stripe Connected</Text>
                            </View>

                            <View style={{ marginTop: 50, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                <Text style={{ fontSize: 10, fontFamily: 'TT Chocolates Trial Medium', color: '#969696', alignItems: 'flex-start' }}>GST (5%)</Text>
                                <Text style={{ fontSize: 10, fontFamily: 'TT Chocolates Trial Medium', color: '#969696', alignItems: 'flex-start' }}>$1.80</Text>
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
                                <Text style={{ fontSize: 14, fontFamily: 'TT Chocolates Trial Medium', color: '#000000', alignItems: 'flex-start' }}>$37.76</Text>
                            </View>
                        </>
                    }

                />


            </View >

            <KBottomButton onPress={() => console.log('hello')} title='Place Order' />
        </>
    )
}

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
        marginBottom: 30
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
        marginTop: 10
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
});
