import React, { useState, useEffect, useRef } from 'react';
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
import { router } from 'expo-router';

import DropDownPicker from 'react-native-dropdown-picker';
import RBSheet from 'react-native-raw-bottom-sheet';




export default function App() {

    const Drawer = createDrawerNavigator();
    const navigation = useNavigation();

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
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

    return (
        <View style={styles.container}>

            <SignedIn>
                <View style={{ marginTop: Constants.statusBarHeight + 10, flex: 1, justifyContent: 'flex-start', backgroundColor: '#FFFFFF' }}>

                    <View style={{ alignItems: 'center', marginBottom: 15 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '90%', alignItems: 'center', marginBottom: 10 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                                <Entypo name="menu" size={40} color="#BF1E2E" onPress={() => navigation.dispatch(DrawerActions.openDrawer())} />
                                <View style={{ marginLeft: 20 }}>
                                    <Text style={{ fontSize: 15, fontFamily: 'TT Chocolates Trial Bold', color: '#000000' }}>Delivering to</Text>
                                    <Text style={{ fontSize: 12, fontFamily: 'TT Chocolates Trial Regular', color: '#969696' }}>address</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Pressable onPress={() => router.navigate('/notifications')}>
                                    <MaterialCommunityIcons name="bell-outline" size={24} color="#BF1E2E" style={{ marginRight: 20 }} />

                                </Pressable>
                                <Pressable onPress={() => router.navigate('/cart')}>
                                    <MaterialCommunityIcons name="shopping-outline" size={24} color="#BF1E2E" />
                                </Pressable>
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
                                            <View style={{ flexDirection: 'column', alignItems: 'center', marginBottom: 10, justifyContent: 'center', marginRight: 20, }}>
                                                <Image source={item.image} style={{ width: 50, height: 50, marginBottom: 10 }} />
                                                <Text style={{ fontSize: 10, fontFamily: 'TT Chocolates Trial Medium', color: '#000000' }}>{item.name}</Text>
                                            </View>
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
                                        data={products}
                                        keyExtractor={(_, index) => index.toString()}
                                        renderItem={({ item }) => (
                                            <Product image={item.image} name={item.name} category={item.category} distance={item.distance} rating={item.rating} />
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
                                        data={products}
                                        keyExtractor={(_, index) => index.toString()}
                                        renderItem={({ item }) => (
                                            <ProductLarge image={item.image} name={item.name} category={item.category} distance={item.distance} rating={item.rating} />
                                        )}
                                        style={{ marginTop: 10 }}
                                    />
                                )}
                            </View>
                        )}
                    />





                </View>

                
            </SignedIn>

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