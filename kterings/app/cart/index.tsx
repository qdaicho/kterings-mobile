import React, { useState, useEffect, SetStateAction } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ImageSourcePropType, Image, Alert, Modal, TextInput, Pressable, RefreshControl } from 'react-native';
import BackButton from '@/components/common/BackButton';
import { router } from 'expo-router';
import { FlatList } from 'react-native-gesture-handler';
import CartSvg from '@/assets/images/cart.svg';
import KButton from '@/components/common/KButton';
import KBottomButton from '@/components/common/KBottomButton';
import useCart, { CartItem } from "@/hooks/useCart";
import { useCartCount } from "@/hooks/CartContext";
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Address } from '@/hooks/types';



export default function Cart() {
  const { cartItems, removeItemFromCart, getCartLength, updateItemQuantity } = useCart();
  const { cartCount } = useCartCount();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [storedAddress, setStoredAddress] = useState<Address | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [deliveryInstructions, setDeliveryInstructions] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getStoredAddress = async (): Promise<SetStateAction<Address | null>> => {
    try {
      const storedAddress = await SecureStore.getItemAsync('selectedAddress');
      if (storedAddress) {
        return JSON.parse(storedAddress);
      }
      return null;
    } catch (error) {
      console.error('Error getting stored address:', error);
      return null;
    }
  };

  const loadCart = async () => {
    setCart(cartItems);
  };

  useEffect(() => {
    loadCart();
    getStoredAddress().then((address) => {
      setStoredAddress(address);
    });
  }, [cartItems]);

  const handleCartClick = (id: string) => {
    Alert.alert("Cart Item Clicked", `Item ID: ${id}`);
  };

  const incrementQuantity = async (id: string, size: string, quantity: number) => {
    await updateItemQuantity(id, size, quantity + 1);
  };

  const decrementQuantity = async (id: string, size: string, quantity: number) => {
    if (quantity > 1) {
      await updateItemQuantity(id, size, quantity - 1);
    }
  };

  const handleRemoveItem = async (id: string, size: string) => {
    await removeItemFromCart(id, size);
    const length = await getCartLength();
    if (length === 0) {
      await loadCart();
    }
  };

  const handleSaveInstructions = async () => {
    try {
      await SecureStore.setItemAsync('deliveryInstructions', deliveryInstructions);
      setModalVisible(false);
    } catch (error) {
      console.error('Error saving delivery instructions:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCart();
    setRefreshing(false);
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      Alert.alert("Your cart is empty.");
      return;
    }

    if (!storedAddress) {
      Alert.alert("In the option Saved Address you must add your address");
      return;
    }

    setIsLoading(true);

    const cartForBackend = cartItems.map((item) => {
      const lastIndex = item.id.lastIndexOf("-");
      const realFoodId = item.id.substring(0, lastIndex);
      return {
        food_id: realFoodId,
        quantity: item.quantity,
        size: item.size,
        price: item.price,
      };
    });

    const cartWithAddress = {
      cartItems: cartForBackend,
      addressUser: storedAddress.address,
    };

    try {
      const accessToken = await SecureStore.getItemAsync("token");
      const apiURL = process.env.EXPO_PUBLIC_API_URL;

      const response = await fetch(`${apiURL}/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ cart: cartWithAddress }),
      });

      const data = await response.json();
      const { url, product_stored, session_data, stripe, doordash, ephemeralKey, customer, publishableKey } = data;


      // await SecureStore.deleteItemAsync("myData");
      await AsyncStorage.removeItem('sessionData');
      await AsyncStorage.removeItem('productStored');
      await AsyncStorage.removeItem('paymentIntent');
      await AsyncStorage.removeItem('doordash');

      // const { url, product_stored, session_data, customer,ephemeralKey, paymentIntent, doordash } = await response.json();
      // const { paymentIntent, ephemeralKey, customer, publishableKey, doordash } = await response.json();

      if (url && url.message) {
      } else {
          await AsyncStorage.setItem("sessionData", JSON.stringify(session_data));
          await AsyncStorage.setItem("productStored", JSON.stringify(product_stored));
          await AsyncStorage.setItem("paymentIntent", JSON.stringify(stripe));
          await AsyncStorage.setItem("doordash", JSON.stringify(doordash));

          await AsyncStorage.setItem("customer", JSON.stringify(customer));
          await AsyncStorage.setItem("ephemeralKey", JSON.stringify(ephemeralKey));
          await AsyncStorage.setItem("publishableKey", JSON.stringify(publishableKey));

          console.log(JSON.stringify(ephemeralKey, null, 2));
        router.push('/payment');
      }
    } catch (error) {
      console.error("Checkout error:", error);
      Alert.alert("There was an error processing your checkout.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <BackButton onPress={() => router.navigate("/homepage/")} buttonStyle={styles.backButton} />
      <Text style={styles.title}>Your Cart</Text>

      {cart.length > 0 ? (
        <View style={styles.cartContainer}>
          <View style={styles.cartList}>
            <FlatList
              data={cart}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View>
                  <View style={styles.cartItem}>
                    <Image source={require("@assets/images/products/lasagna.jpg")} style={styles.cartItemImage} />
                    <View style={styles.cartItemDetails}>
                      <Text style={styles.cartItemName}>{item.name}</Text>
                      <Text style={styles.cartItemSize}>{item.size}</Text>
                    </View>
                    <Text style={styles.cartItemPrice}>${item.price}</Text>
                  </View>
                  <View style={styles.cartItemActions}>
                    <TouchableOpacity style={styles.iconButton} onPress={() => decrementQuantity(item.id, item.size, item.quantity)}>
                      <Text style={styles.iconButtonText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.cartItemQuantity}>{item.quantity}</Text>
                    <TouchableOpacity style={styles.iconButton} onPress={() => incrementQuantity(item.id, item.size, item.quantity)}>
                      <Text style={styles.iconButtonText}>+</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.removeButton} onPress={() => handleRemoveItem(item.id, item.size)}>
                      <Text style={styles.removeButtonText}>Remove</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.separator} />
                </View>
              )}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            />
            <View style={styles.subtotalContainer}>
              <Text style={styles.subtotalText}>Subtotal</Text>
              <Text style={styles.subtotalAmount}>
                ${cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}
              </Text>
            </View>

            <View style={styles.separator} />

            <View style={styles.deliveryDetailsContainer}>
              <Text style={styles.deliveryDetailsText}>Delivery Details</Text>
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Text style={styles.editText}>Edit</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.cardContainer}>
              <Text style={styles.addressTypeText}>{storedAddress?.type}</Text>
              <Text style={styles.addressText}>{storedAddress?.address}</Text>
              <Text style={styles.instructionsText}>Instructions: {deliveryInstructions || 'N/A'}</Text>
            </View>
          </View>
          <KBottomButton
            title="Proceed to Payment"
            onPress={handleCheckout}
            buttonStyle={[styles.proceedButton, isLoading && styles.disabledButton]}
            disabled={isLoading}
          />
        </View>
      ) : (
        <View style={styles.emptyCartContainer}>
          <CartSvg />
          <Text style={styles.emptyCartText}>Hungry?</Text>
          <Text style={styles.emptyCartDescription}>Add something from one of our amazing Kterers!</Text>
          <KButton title="Browse" onPress={() => router.navigate('/homepage/')} textStyle={styles.browseButtonText} buttonStyle={styles.browseButton} />
        </View>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Edit Delivery Instructions</Text>
            <View style={styles.modalInputContainer}>
              <TextInput
                style={styles.modalInput}
                placeholder="Enter delivery instructions"
                value={deliveryInstructions}
                onChangeText={setDeliveryInstructions}
              />
            </View>
            <View style={styles.modalButtonContainer}>
              <KButton title="Save" onPress={handleSaveInstructions} textStyle={styles.modalButtonText} buttonStyle={styles.modalButton} />
              <KButton title="Cancel" onPress={() => setModalVisible(false)} textStyle={styles.modalButtonText} buttonStyle={styles.modalButton} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-around',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    marginHorizontal: 30,
  },
  title: {
    fontSize: 18,
    fontFamily: 'TT Chocolates Trial Bold',
    color: '#000000',
    marginTop: 120,
    marginBottom: 20,
    marginHorizontal: 30,
  },
  cartContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  cartList: {
    flex: 1,
    justifyContent: 'flex-start',
    marginHorizontal: 30,
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
  cartItemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  iconButton: {
    paddingHorizontal: 20,
    paddingVertical: 3,
    borderRadius: 5,
    backgroundColor: 'rgba(208, 0, 36, 0.1)',
  },
  iconButtonText: {
    fontSize: 20,
    fontFamily: 'TT Chocolates Trial Medium',
    color: '#D00024',
  },
  cartItemQuantity: {
    fontSize: 14,
    fontFamily: 'TT Chocolates Trial Medium',
    color: '#000000',
  },
  removeButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 5,
    backgroundColor: 'rgba(208, 0, 36, 0.1)',
  },
  removeButtonText: {
    fontSize: 14,
    fontFamily: 'TT Chocolates Trial Medium',
    color: '#D00024',
  },
  separator: {
    height: 1,
    backgroundColor: '#E9E9E9',
    width: "auto",
    marginBottom: 20,
  },
  subtotalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  subtotalText: {
    fontSize: 12,
    fontFamily: 'TT Chocolates Trial Medium',
    color: '#000000',
  },
  subtotalAmount: {
    fontSize: 12,
    fontFamily: 'TT Chocolates Trial Medium',
    color: '#000000',
  },
  deliveryDetailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  deliveryDetailsText: {
    fontSize: 14,
    fontFamily: 'TT Chocolates Trial Bold',
    color: '#000000',
  },
  editText: {
    fontSize: 12,
    fontFamily: 'TT Chocolates Trial Medium',
    color: '#D00024',
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
  addressTypeText: {
    fontSize: 13,
    fontFamily: 'TT Chocolates Trial Bold',
    color: '#000000',
  },
  addressText: {
    fontSize: 12,
    fontFamily: 'TT Chocolates Trial Medium',
    color: '#000000',
  },
  instructionsText: {
    fontSize: 11,
    fontFamily: 'TT Chocolates Trial Medium',
    color: '#969696',
  },
  proceedButton: {
    marginTop: 30,
  },
  disabledButton: {
    backgroundColor: 'gray',
  },
  emptyCartContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: 60,
  },
  emptyCartText: {
    fontSize: 20,
    fontFamily: 'TT Chocolates Trial Bold',
    color: '#000000',
    marginTop: 20,
  },
  emptyCartDescription: {
    fontSize: 16,
    fontFamily: 'TT Chocolates Trial Medium',
    color: '#969696',
    marginTop: 10,
    textAlign: 'center',
    width: '60%',
  },
  browseButtonText: {
    fontSize: 16,
    fontFamily: 'TT Chocolates Trial Bold',
    color: '#FFFFFF',
  },
  browseButton: {
    marginTop: 30,
    height: 50,
    width: 150,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'TT Chocolates Trial Medium',
    marginBottom: 10,
    color: '#000',
  },
  modalInputContainer: {
    height: 40,
    width: 'auto',
    borderRadius: 10,
    backgroundColor: "#EBEBEB",
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 10,
  },
  modalInput: {
    color: "#969696",
    fontFamily: "TT Chocolates Trial Medium",
    fontSize: 13,
    letterSpacing: 0,
    textAlign: "left",
    marginLeft: 10,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButtonText: {
    fontSize: 12,
    fontFamily: 'TT Chocolates Trial Bold',
    color: '#FFFFFF',
  },
  modalButton: {
    width: 80,
    height: 50,
  },
});
