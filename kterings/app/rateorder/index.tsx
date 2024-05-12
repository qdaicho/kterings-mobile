import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, TouchableWithoutFeedback, Keyboard, Dimensions } from 'react-native';
import { Feather, FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import BackButton from '@/components/common/BackButton';
import { router } from 'expo-router';
import { Entypo } from '@expo/vector-icons';
import KBottomButton from '@/components/common/KBottomButton';

export default function Index() {
    // Sample cart data
    const sampleCart: any[] = [
        {
            id: 1,
            title: 'Fluffy Pancakes',
            notes: 'Extra maple syrup',
            price: 12.99,
            quantity: 2,
            image: require('@assets/images/products/pancakes.jpeg'),
        },
        {
            id: 2,
            title: 'Chicken Biryani',
            notes: 'Extra onion',
            price: 5.99,
            quantity: 1,
            image: require('@assets/images/products/chicken_biryani.jpg'),
        },
        {
            id: 3,
            title: 'Roasted Chicken',
            notes: 'Extra cheese',
            price: 8.99,
            quantity: 3,
            image: require('@assets/images/products/chicken_biryani.jpg'),
        },
        {
            id: 4,
            title: 'Fried Rice',
            notes: 'Extra chicken',
            price: 7.99,
            quantity: 1,
        },
    ];

    // Initializing the cart with a 'rating' field for each item
    const [cart, setCart] = useState(
        sampleCart.map((item) => ({
            ...item,
            rating: 0, // Default rating for each item
        }))
    );

    const setStarRating = (itemId: number, index: number) => {
        // Update the rating for the specific item
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.id === itemId ? { ...item, rating: index + 1 } : item // Add 1 because index is 0-based
            )
        );
    };
    const [isPostPressed, setIsPostPressed] = useState(false); // State to track if the button is pressed

    return (
        <>


            <BackButton
                onPress={() => router.back()}
                buttonStyle={styles.backButton}
            />
            <View style={{ flex: 1, marginHorizontal: 30, flexDirection: 'column', marginTop: 60 }}>
                <Text style={{ fontSize: 16, fontFamily: 'TT Chocolates Trial Medium', color: '#BF1E2E', alignSelf: 'flex-end' }}>
                    Help
                </Text>
                <ScrollView style={{ maxHeight: 400 }}>
                    {cart.map((item) => (
                        <View key={item.id}>
                            <Text style={{ fontSize: 14, fontFamily: 'TT Chocolates Trial Bold', color: '#000000', marginTop: 30 }}>
                                {item.title}
                            </Text>
                            <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                <Text style={{ fontSize: 14, fontFamily: 'TT Chocolates Trial Medium', color: '#000000' }}>Give a Rating</Text>
                                <View style={styles.starContainer}>
                                    {Array.from({ length: 5 }, (_, index) => (
                                        <Pressable key={index} onPress={() => setStarRating(item.id, index)}>
                                            <FontAwesome
                                                name={index < item.rating ? 'star' : 'star-o'} // If the star is before or at the rating, fill it
                                                size={20}
                                                color="#FFBF00" // Yellow color for filled stars
                                                style={styles.star}
                                            />
                                        </Pressable>
                                    ))}
                                </View>
                            </View>
                            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                                <TextInput
                                    style={[styles.rectangle, { marginTop: 20, height: 100, alignItems: 'flex-start', padding: 10, textAlign: 'justify', fontFamily: 'TT Chocolates Trial Regular' }]}
                                    // onChangeText={onChangeText}
                                    // value={text}
                                    placeholder="How was the food and service? Let us know!"
                                    multiline={true}
                                    placeholderTextColor={'#DFDFDF'}

                                />
                            </TouchableWithoutFeedback>
                        </View>
                    ))}
                </ScrollView>

                <View style={{ marginTop: 10, flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Text style={{ fontSize: 14, fontFamily: 'TT Chocolates Trial Bold', color: '#000000' }}>Upload Photos</Text>
                    <Text style={{ fontSize: 12, fontFamily: 'TT Chocolates Trial Regular', color: '#000000', marginTop: 10 }}>You may choose up to 3 photos.</Text>
                </View>

                <View style={styles.container}>
                    <Pressable
                        style={({ pressed }) => [
                            styles.rectangle2,
                            pressed && styles.pressed, // Apply style when pressed
                        ]}
                    >
                        <FontAwesome name="image" size={24} color="black" />
                        <Text style={styles.text}>From Photos</Text>
                    </Pressable>

                    <Pressable
                        style={({ pressed }) => [
                            styles.rectangle2,
                            pressed && styles.pressed, // Apply style when pressed
                        ]}
                    >
                        <Feather name="camera" size={24} color="black" />
                        <Text style={styles.text}>From Camera</Text>
                    </Pressable>
                </View>

                <View style={{ marginTop: 50, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-start' }}>
                    <Entypo name="plus" size={40} color="#969696" />
                    <Entypo name="plus" size={40} color="#969696" />
                    <Entypo name="plus" size={40} color="#969696" />
                </View>


            </View>
            <KBottomButton title="Post Review" onPress={() => { console.log("proceed to payment"); }}  />

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
    starContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    star: {
        marginHorizontal: 4, // Space between stars
    },
    rectangle: {
        borderWidth: 1, // Equivalent to 'border: 1px solid #DFDFDF'
        borderColor: '#DFDFDF', // Border color
        borderRadius: 3, // Border radius in pixels
    },
    rectangle2: {
        borderWidth: 1, // Equivalent to 'border: 1px solid #EEEEEE'
        borderColor: '#EEEEEE', // Border color
        borderRadius: 6, // Border radius in pixels
        backgroundColor: '#FFFFFF', // Background color
        // Box-shadow properties for iOS
        shadowColor: 'rgba(216, 216, 216, 0.5)', // Shadow color
        shadowOffset: { width: 0, height: 2 }, // Shadow offset for horizontal and vertical
        // shadowOpacity: 1, // Shadow opacity
        // shadowRadius: 4, // Shadow radius
        // Elevation property for Android
        elevation: 3, // Provides shadow on Android,
        flexDirection: 'row',
        padding: 10,
        alignItems: 'flex-start',

    },
    container: {
        marginTop: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    pressed: {
        backgroundColor: '#EFEFF0', // Change color on press
    },
    text: {
        fontSize: 12,
        fontFamily: 'TT Chocolates Trial Medium',
        color: '#000000',
        marginTop: 10,
        marginLeft: 10,
    },
    buttonPressed: {
        backgroundColor: '#EFEFF0', // Color when pressed
    },
    textPressed: {
        color: '#969696', // Text color when pressed
    },
});
