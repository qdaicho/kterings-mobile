import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ImageSourcePropType, Image, Pressable } from 'react-native';
import BackButton from '@/components/common/BackButton';
import { router } from 'expo-router';
import { FlatList } from 'react-native-gesture-handler';
import CartSvg from '@assets/images/cart.svg';
import KButton from '@/components/common/KButton';

// Sample JSON data for Cart
const sampleCart: any[] = [
  { id: 1, title: "Fluffy Pancakes", "notes": "Extra maple syrup", "price": 12.99, "quantity": 2, "image": require("@assets/images/products/pancakes.jpeg") },
  { id: 2, title: "Chicken Biryani", "notes": "Extra onion", "price": 5.99, "quantity": 1, "image": require("@assets/images/products/chicken_biryani.jpg") },
  { id: 3, title: "Roasted Chicken", "notes": "Extra cheese", "price": 8.99, "quantity": 3, "image": require("@assets/images/products/chicken_biryani.jpg") },
  { id: 4, title: "Fried Rice", "notes": "Extra chicken", "price": 7.99, "quantity": 1 },
];

export default function Cart() {

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

  // Function to handle cart click
  const handleCartClick = (id: number) => {
    const updatedCart = cart.map(cart =>
      cart.id === id ? { ...cart, read: true } : cart
    );
    setCart(updatedCart);
  };

  return (
    <View style={styles.container}>
      <BackButton onPress={() => router.back()} buttonStyle={styles.backButton} />
      <Text style={{ fontSize: 18, fontFamily: 'TT Chocolates Trial Bold', color: '#000000', marginTop: 120, marginBottom: 20, marginHorizontal: 30 }}>Your Cart</Text>

      {cart.length > 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-around' }}>
          <View style={{ flex: 1, justifyContent: 'flex-start', marginHorizontal: 30 }}>
            <FlatList
              style={{ height: 300 }}
              data={cart}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View>
                  <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginBottom: 20, alignItems: 'center' }}>
                    <Text style={{ fontSize: 14, fontFamily: 'TT Chocolates Trial Medium', color: '#000000', marginRight: 20 }}>x1</Text>
                    <Image source={item.image} style={{ width: 50, height: 50, borderRadius: 10, marginRight: 10, resizeMode: 'cover' }} />
                    <View style={{ flex: 1, flexDirection: "column", justifyContent: 'flex-start' }}>
                      <Text style={{ fontSize: 14, fontFamily: 'TT Chocolates Trial Medium', color: '#D00024' }}>{item.title}</Text>
                      <Text style={{ fontSize: 11, fontFamily: 'TT Chocolates Trial Medium', color: '#969696' }}>{item.notes}</Text>
                    </View>
                    <Text style={{ fontSize: 14, fontFamily: 'TT Chocolates Trial Medium', color: '#000000' }}>${item.price}</Text>
                  </View>
                  <View style={{ height: 1, backgroundColor: '#E9E9E9', width: "auto", marginBottom: 20 }} />

                </View>
              )}

            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <Text style={{ fontSize: 12, fontFamily: 'TT Chocolates Trial Medium', color: '#000000' }}>Subtotal</Text>
              <Text style={{ fontSize: 12, fontFamily: 'TT Chocolates Trial Medium', color: '#000000' }}>${cart.reduce((total, item) => total + item.price * item.quantity, 0)}</Text>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <Text style={{ fontSize: 12, fontFamily: 'TT Chocolates Trial Medium', color: '#000000' }}>Delivery Fee</Text>
              <Text style={{ fontSize: 12, fontFamily: 'TT Chocolates Trial Medium', color: '#000000' }}>Free</Text>
            </View>

            <View style={{ height: 1, backgroundColor: '#E9E9E9', width: "auto", marginBottom: 20 }} />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <Text style={{ fontSize: 14, fontFamily: 'TT Chocolates Trial Bold', color: '#000000' }}>Address</Text>
              <Text style={{ fontSize: 12, fontFamily: 'TT Chocolates Trial Medium', color: '#D00024' }}>Edit</Text>
            </View>

            <View style={styles.cardContainer}>
              <Text style={{ fontSize: 13, fontFamily: 'TT Chocolates Trial Bold', color: '#000000' }}>Home</Text>
              <Text style={{ fontSize: 12, fontFamily: 'TT Chocolates Trial Medium', color: '#000000' }}>123 Main St</Text>
              <Text style={{ fontSize: 11, fontFamily: 'TT Chocolates Trial Medium', color: '#969696' }}>Instructions: please leave the order at the front door</Text>
            </View>

          </View>
          <Pressable>
            <View style={{
              backgroundColor: '#D00024',
              height: 60,
              width: Dimensions.get('window').width,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 100
            }}>
              <Text style={{
                color: '#FFFFFF',
                fontFamily: 'TT Chocolates Trial Bold',
                fontSize: 20,
                fontWeight: '800',
                letterSpacing: 0,
                lineHeight: 38,
                textAlign: 'center',
              }}>Proceed to Payment</Text>
            </View>
          </Pressable>
        </View>
      ) : (
        <View style={{ flex: 1, alignItems: 'center', marginTop: 60 }}>
          <CartSvg />
          <Text style={{ fontSize: 20, fontFamily: 'TT Chocolates Trial Bold', color: '#000000', marginTop: 20 }}>Hungry?</Text>
          <Text style={{ fontSize: 16, fontFamily: 'TT Chocolates Trial Medium', color: '#969696', marginTop: 10, textAlign: 'center', width: '60%' }}>Add something  from one of our
            amazing Kterers!</Text>
          <KButton title="Browse" onPress={() => router.navigate('/homepage/')} textStyle={{ fontSize: 16, fontFamily: 'TT Chocolates Trial Bold', color: '#FFFFFF' }} buttonStyle={{ marginTop: 30, height: 50, width: 150 }} />
        </View>
      )}


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    // marginHorizontal: 30,
    justifyContent: 'space-around',

  },
  backButton: {
    position: 'absolute',
    top: 50,
    marginHorizontal: 30
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4.65,
    elevation: 6,
  },
});
