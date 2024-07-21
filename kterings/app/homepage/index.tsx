import React, { useState, useEffect, useRef, SetStateAction } from 'react';
import { View, StyleSheet, Text, TextInput, Dimensions, Pressable, Image, ListRenderItem, SafeAreaView } from 'react-native';
import * as Font from 'expo-font';
import Constants from 'expo-constants';
import { SignedIn, SignedOut } from '@clerk/clerk-expo';
import BackButton from '@components/common/BackButton';

import { createDrawerNavigator } from '@react-navigation/drawer';
import { DrawerActions, NavigationContainer, useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { FlatList, ScrollView } from 'react-native-gesture-handler';

import Product from '@/components/common/Product';
import { products } from '@/assets/products';
import { categories } from '@/assets/categories';
import ProductLarge from '@/components/common/ProductLarge';
import { router, useLocalSearchParams } from 'expo-router';

import DropDownPicker from 'react-native-dropdown-picker';
import RBSheet from 'react-native-raw-bottom-sheet';
import KButton from '@/components/common/KButton';
import OnboardingComponent from '@/components/screens/Onboarding';
import * as SecureStore from 'expo-secure-store';
import {Food, Quantity, qImage} from '@/hooks/types';



export default function App() {


    const Drawer = createDrawerNavigator();
    const navigation = useNavigation();

    const [prod, setProd] = useState<Food[]>([]);
    const [allItemsProd, setAllItemsProd] = useState<Food[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [closestProd, setClosestProd] = useState<Food[]>([]);

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(1.0);
    const [items, setItems] = useState([
        {
            label: "Ratings 1.0+",
            value: 1.0
        },
        {
            label: "Ratings 2.0+",
            value: 2.0
        },
        {
            label: "Ratings 3.0+",
            value: 3.0
        },
        {
            label: "Ratings 4.0+",
            value: 4.0
        }
    ]);

    const refRBSheet = useRef<RBSheet>(null);
    const { orders } = useLocalSearchParams<{
        orders?: string[];
    }>();

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
        if (orders) {
            refRBSheet.current && refRBSheet.current.open();
        }
    }, [orders]);

    const [contentChanged, setContentChanged] = useState(false);

    const [selectedAddress, setSelectedAddress] = useState<string | null>(null);

    const getClosestProducts = (products: any[], maxDistance = 5) => {
        const sortedProducts = products.sort((a, b) => a.auto_delivery_time - b.auto_delivery_time);
        const closestCluster = [];
        let deviation = 0;

        for (let i = 0; i < sortedProducts.length; i++) {
            if (i === 0) {
                closestCluster.push(sortedProducts[i]);
            } else {
                const currentDeviation = Math.abs(sortedProducts[i].auto_delivery_time - sortedProducts[i - 1].auto_delivery_time);
                if (currentDeviation <= maxDistance) {
                    closestCluster.push(sortedProducts[i]);
                    deviation += currentDeviation;
                } else {
                    break;
                }
            }
        }
        return closestCluster;
    };


    useEffect(() => {
        const fetchData = async () => {
            // if (refRBSheet.current) {
            //     refRBSheet.current.open();
            //     const timeout = setTimeout(() => {
            //         setContentChanged(true);
            //     }, 5000); // Change content after 5 seconds
            //     return () => clearTimeout(timeout);
            // }

            // Asynchronous request to get all the food from the database upon load
            try {
                const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/food`, {
                    method: 'GET',
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const products = await response.json();
                // Handle the fetched products here
                // console.log(products.data);
                setProd(products.data);

                const filteredProducts = products.data.filter((product: { rating: number; ethnic_type: string; }) =>
                    product.rating >= (value || 4.0) && (selectedCategory ? product.ethnic_type === selectedCategory : true)
                );
                setAllItemsProd(filteredProducts);
                setClosestProd(getClosestProducts(filteredProducts));
                setSelectedAddress(await getStoredAddress());
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [value, selectedCategory]); // Empty dependency array to run the effect only once on mount


    return (
        <View style={styles.container}>

            <SignedIn>
                <RBSheet
                    ref={refRBSheet}
                    animationType="slide"
                    closeOnDragDown={true}
                    closeOnPressMask={true}
                    customStyles={{
                        container: {
                            borderWidth: 1,
                            borderColor: "#E9E9E9",
                            borderTopLeftRadius: 45,
                            borderTopRightRadius: 45,
                            height: 200,
                        },
                        wrapper: {
                            backgroundColor: "transparent",
                        },
                        draggableIcon: {
                            width: 100,
                            backgroundColor: "#E9E9E9",
                        },
                    }}
                >
                    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between' }}>
                        <View style={{
                            marginLeft: 40,
                            marginRight: 40,
                        }}>
                            {contentChanged ? (
                                <>
                                    <Text style={{
                                        color: '#000000',
                                        fontFamily: 'TT Chocolates Trial Bold',
                                        fontSize: 16,
                                        marginTop: 20,
                                        textAlign: 'left',
                                    }}>Your order has been delivered!</Text>
                                    <Text style={{
                                        color: '#000000',
                                        fontFamily: 'TT Chocolates Trial Medium',
                                        fontSize: 13,
                                        marginTop: 20,
                                    }}>Enjoy your food! Let us know what you think by leaving a review from the Orders screen!</Text>
                                </>
                            ) : (
                                <>
                                    <Text style={{
                                        color: '#000000',
                                        fontFamily: 'TT Chocolates Trial Bold',
                                        fontSize: 16,
                                        letterSpacing: 0,
                                        lineHeight: 29,
                                        textAlign: 'left',
                                    }}>Preparing your order…</Text>
                                    <Text style={{
                                        color: '#000000',
                                        fontFamily: 'TT Chocolates Trial Medium',
                                        fontSize: 13,
                                        letterSpacing: 0,
                                        lineHeight: 21,
                                    }}>The Kterer is preparing your order. Sit tight!</Text>
                                    <KButton
                                        title="Track your order"
                                        onPress={() => {
                                            refRBSheet.current && refRBSheet.current.close();
                                            // signOut();
                                            router.push("/trackorder/");
                                        }}
                                        buttonStyle={{
                                            marginTop: 20,
                                            alignSelf: 'center'
                                        }}
                                        textStyle={{
                                            fontSize: 16,
                                        }}
                                    />
                                </>
                            )}
                        </View>
                    </View>
                </RBSheet>

                <View style={{ marginTop: Constants.statusBarHeight + 10, flex: 1, justifyContent: 'flex-start', backgroundColor: '#FFFFFF' }}>

                    <View style={{ alignItems: 'center', marginBottom: 15 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '90%', alignItems: 'center', marginBottom: 10 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                                <Entypo name="menu" size={40} color="#BF1E2E" onPress={() => navigation.dispatch(DrawerActions.openDrawer())} />

                                <View style={{ marginLeft: 20, width: '65%' }}>
                                    <Text style={{ fontSize: 15, fontFamily: 'TT Chocolates Trial Bold', color: '#000000' }}>Delivering to</Text>
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                        <Text style={{ fontSize: 12, fontFamily: 'TT Chocolates Trial Regular', color: '#969696' }}>
                                            {selectedAddress}
                                        </Text>
                                    </ScrollView>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>

                                <MaterialCommunityIcons name="bell-outline" size={24} color="#BF1E2E" style={{ marginRight: 20 }} onPress={() => router.navigate('/notifications')} />

                                <MaterialCommunityIcons name="shopping-outline" size={24} color="#BF1E2E" onPress={() => router.navigate('/cart')} />

                            </View>
                        </View>
                        <View style={styles.inputContainer}>
                            <Ionicons name="search-outline" size={24} color="#969696" style={{ marginLeft: 10 }} />
                            <TextInput
                                placeholder="Search for food names & cuisines"
                                placeholderTextColor="#B2B2B2"
                                style={[styles.input]}
                                secureTextEntry={false}
                                autoCorrect={false}
                                // textContentType="password"
                                onFocus={() => router.navigate('/search/')}
                            />
                        </View>
                    </View>
                    <View style={{ height: 2, backgroundColor: '#E9E9E9', width: Dimensions.get('window').width }} />

                    <FlatList

                        data={['categories', 'nearYou', 'allItems']}
                        keyExtractor={(item) => item}
                        renderItem={({ item }) => (
                            <View style={{ marginHorizontal: 30, marginBottom: 20 }}>
                                {item === 'categories' && (
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, marginTop: 20 }}>
                                        <Text style={{ fontSize: 15, fontFamily: 'TT Chocolates Trial Bold', color: '#000000' }}>Categories</Text>
                                    </View>
                                )}
                                {item === 'categories' && (
                                    <FlatList
                                        data={categories}
                                        keyExtractor={(_, index) => index.toString()}
                                        renderItem={({ item }) => (
                                            <Pressable onPress={() => setSelectedCategory(selectedCategory === item.name ? null : item.name)}>
                                                <View style={{ flexDirection: 'column', alignItems: 'center', marginBottom: 10, justifyContent: 'center', marginRight: 20 }}>
                                                    <Image source={item.image} style={{ width: 50, height: 50, marginBottom: 10 }} />
                                                    <Text style={{
                                                        fontSize: 10,
                                                        fontFamily: selectedCategory === item.name ? 'TT Chocolates Trial Bold' : 'TT Chocolates Trial Medium',
                                                        color: selectedCategory === item.name ? '#BF1E2E' : '#000000'
                                                    }}>{item.name}</Text>
                                                </View>
                                            </Pressable>
                                        )}
                                        horizontal
                                    />
                                )}
                                {item === 'nearYou' && (
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                                        <Text style={{ fontSize: 15, fontFamily: 'TT Chocolates Trial Bold', color: '#000000' }}>Near You</Text>
                                        <Pressable onPress={() => router.navigate('/nearyou/')}>
                                            <Text style={{ fontSize: 12, fontFamily: 'TT Chocolates Trial Medium', color: '#BF1E2E' }}>See All</Text>
                                        </Pressable>
                                    </View>
                                )}
                                {item === 'nearYou' && (
                                    <FlatList
                                        data={closestProd}
                                        keyExtractor={(_, index) => index.toString()}
                                        renderItem={({ item }) => (
                                            <Product image={item.images[0].image_url} name={item.name} category={item.ethnic_type} distance={`${item.auto_delivery_time} min away`} rating={item.rating} id={item.id} />
                                        )}
                                        horizontal
                                        style={{ marginTop: 10 }}
                                    />
                                )}
                                {item === 'allItems' && (
                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                                        <Text style={{ fontSize: 15, fontFamily: 'TT Chocolates Trial Bold', color: '#000000' }}>All Items</Text>
                                        <DropDownPicker
                                            open={open}
                                            value={value}
                                            items={items}
                                            setOpen={setOpen}
                                            setValue={setValue}
                                            setItems={setItems}
                                            placeholder='Ratings 4.0+'
                                            showArrowIcon={false}
                                            showTickIcon={false}
                                            dropDownDirection="TOP"
                                            style={{
                                                backgroundColor: '#BF1E2E',
                                                width: 100,
                                                borderColor: '#EEEEEE',
                                                borderRadius: 35,
                                                borderStartEndRadius: 35,
                                                borderStartStartRadius: 35,
                                                minHeight: 35,
                                            }}
                                            textStyle={{
                                                fontSize: 12,
                                                fontFamily: 'TT Chocolates Trial Medium',
                                                color: '#FFFFFF',
                                                textAlign: 'center',
                                            }}
                                            containerStyle={{ width: 'auto' }}
                                            dropDownContainerStyle={{
                                                width: 100,
                                                borderColor: '#EEEEEE',
                                                borderRadius: 20,
                                                marginBottom: 10,
                                                borderEndEndRadius: 20,
                                                borderEndStartRadius: 20,
                                            }}
                                            listItemLabelStyle={{
                                                fontSize: 12,
                                                fontFamily: 'TT Chocolates Trial Medium',
                                                color: '#000000',
                                                textAlign: 'center',
                                            }}
                                            itemSeparator={true}
                                            itemSeparatorStyle={{ height: 1, backgroundColor: '#EEEEEE', marginHorizontal: 10 }}
                                        />

                                    </View>
                                )}
                                {item === 'allItems' && (
                                    <FlatList
                                        data={allItemsProd}
                                        keyExtractor={(_, index) => index.toString()}
                                        renderItem={({ item }) => (
                                            <ProductLarge image={item.images[0].image_url} name={item.name} category={item.ethnic_type} distance={`${item.auto_delivery_time} min away`} rating={item.rating} id={item.id} />
                                        )}
                                        style={{ marginTop: 10 }}
                                    />
                                )}
                            </View>
                        )}
                    />





                </View>


            </SignedIn>

            <SignedOut>
                <OnboardingComponent />
            </SignedOut>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    inputContainer: {
        height: 40,
        width: Dimensions.get('window').width - 50,
        borderRadius: 10,
        backgroundColor: "#EBEBEB",
        justifyContent: "flex-start",
        alignItems: "center",
        flexDirection: "row"
    },
    input: {
        color: "#969696",
        fontFamily: "TT Chocolates Trial Medium",
        fontSize: 13,
        letterSpacing: 0,
        textAlign: "left",
        marginLeft: 10
    },
});