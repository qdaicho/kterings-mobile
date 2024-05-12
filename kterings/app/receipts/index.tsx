import { View, Text, StyleSheet, FlatList, Image, ImageSourcePropType } from 'react-native'
import React, { useEffect, useState } from 'react'
import BackButton from '@/components/common/BackButton'
import { router } from 'expo-router'
import { FontAwesome } from '@expo/vector-icons';
import KButton from '@/components/common/KButton';
export default function index() {

    const sampleCart: any[] = [
        { id: 1, title: "Fluffy Pancakes", "notes": "Extra maple syrup", "price": 12.99, "quantity": 2, "image": require("@assets/images/products/pancakes.jpeg") },
        { id: 2, title: "Chicken Biryani", "notes": "Extra onion", "price": 5.99, "quantity": 1, "image": require("@assets/images/products/chicken_biryani.jpg") },
        { id: 3, title: "Roasted Chicken", "notes": "Extra cheese", "price": 8.99, "quantity": 3, "image": require("@assets/images/products/chicken_biryani.jpg") },
        { id: 4, title: "Fried Rice", "notes": "Extra chicken", "price": 7.99, "quantity": 1 },
    ];

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

    return (
        <>
            <BackButton
                onPress={() => router.navigate('/homepage/orders/')}
                buttonStyle={styles.backButton}
            />
            <View style={{ flex: 1, marginHorizontal: 30, flexDirection: 'column', marginTop: 60 }}>
                <Text style={{ fontSize: 16, fontFamily: 'TT Chocolates Trial Medium', color: '#BF1E2E', alignSelf: 'flex-end' }}>Help</Text>
                <View style={{ marginTop: 30, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <Text style={{ fontSize: 16, fontFamily: 'TT Chocolates Trial Bold', color: '#000000' }}>Order No.: 1367</Text>
                    <Text style={{ fontSize: 14, fontFamily: 'TT Chocolates Trial Regular', color: '#000000' }}>Receipt #1289-2213</Text>
                </View>

                <FlatList
                    style={{ maxHeight: 200, marginTop: 20 }}
                    data={cart}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={{}}>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', marginBottom: 20, alignItems: 'center' }}>
                                <Text style={{ fontSize: 14, fontFamily: 'TT Chocolates Trial Medium', color: '#000000', marginRight: 20 }}>x1</Text>
                                <Image source={item.image} style={{ width: 50, height: 50, borderRadius: 10, marginRight: 10, resizeMode: 'cover' }} />
                                <View style={{ flex: 1, flexDirection: "column", justifyContent: 'flex-start' }}>
                                    <Text style={{ fontSize: 14, fontFamily: 'TT Chocolates Trial Medium', color: '#D00024' }}>{item.title}</Text>
                                    <Text style={{ fontSize: 11, fontFamily: 'TT Chocolates Trial Medium', color: '#969696' }}>{item.notes}</Text>
                                </View>
                                <Text style={{ fontSize: 14, fontFamily: 'TT Chocolates Trial Medium', color: '#000000' }}>${item.price}</Text>
                            </View>

                        </View>
                    )}

                />

                <Text style={{ fontSize: 16, fontFamily: 'TT Chocolates Trial Bold', color: '#000000', alignItems: 'flex-start', marginTop: 20 }}>Delivered to</Text>

                <View style={{ marginTop: 10 }}>
                    <Text style={{ fontSize: 13, fontFamily: 'TT Chocolates Trial Bold', color: '#000000' }}>Home</Text>
                    <Text style={{ fontSize: 12, fontFamily: 'TT Chocolates Trial Medium', color: '#000000' }}>1234 Kterings Lane Home Address St., Windsor</Text>
                    <Text style={{ fontSize: 11, fontFamily: 'TT Chocolates Trial Medium', color: '#969696' }}>Instructions: please leave the order at the front door</Text>
                </View>

                <Text style={{ fontSize: 16, fontFamily: 'TT Chocolates Trial Bold', color: '#000000', alignItems: 'flex-start', marginTop: 20 }}>Payment Method</Text>

                <View style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center', marginLeft: 20 }}>
                    <FontAwesome name="cc-visa" size={24} color="navy" />
                    <View style={{ marginTop: 10, flexDirection: 'column', alignItems: 'center', marginLeft: 20 }}>
                        <Text style={{ fontSize: 13, fontFamily: 'TT Chocolates Trial Medium', color: '#000000' }}>Visa Credit Card</Text>
                        <Text style={{ fontSize: 12, fontFamily: 'TT Chocolates Trial Medium', color: '#969696' }}>************1043</Text>
                    </View>
                </View>

                <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
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

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 30 }}>
                    <KButton
                        onPress={() => router.navigate('/')}
                        title="Track your order"
                        buttonStyle={{ width: 'auto', paddingHorizontal: 20, height: 50 }}
                        textStyle={{fontSize:14}}
                    />
                    <KButton
                        onPress={() => router.navigate('/rateorder/')}
                        title="Rate your order"
                        buttonStyle={{ width: 'auto', paddingHorizontal: 20, height: 50 }}
                        textStyle={{fontSize:14}}
                    />
                </View>

            </View>
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
})