import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, TouchableWithoutFeedback, Keyboard, Image, Alert } from 'react-native';
import { FontAwesome, Feather } from '@expo/vector-icons';
import BackButton from '@/components/common/BackButton';
import { router } from 'expo-router';
import KBottomButton from '@/components/common/KBottomButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';

export default function Index() {
    const [cart, setCart] = useState<any[]>([]);
    const [currentOrder, setCurrentOrder] = useState<any | null>(null);
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [rating, setRating] = useState<number>(0);
    const [reviewText, setReviewText] = useState<string>('');

    useEffect(() => {
        const loadCurrentOrder = async () => {
            try {
                const storedOrder = await AsyncStorage.getItem('current_order');
                if (storedOrder) {
                    const parsedOrder = JSON.parse(storedOrder);
                    setCurrentOrder(parsedOrder);

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

    const setStarRating = (itemId: number, index: number) => {
        setRating(index + 1);
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.id === itemId ? { ...item, rating: index + 1 } : item
            )
        );
    };

    const askPermissionsAsync = async () => {
        const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
        const { status: cameraRollStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (cameraStatus !== 'granted' || cameraRollStatus !== 'granted') {
            Alert.alert('Permission to access camera and photos is required!');
            return false;
        }
        return true;
    };

    const pickImage = async () => {
        const hasPermission = await askPermissionsAsync();
        if (!hasPermission) return;

        if (selectedImages.length >= 3) {
            Alert.alert('You can only select up to 3 images');
            return;
        }
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.2,
        });
        if (!result.canceled && result.assets && result.assets.length > 0) {
            setSelectedImages([...selectedImages, result.assets[0].uri]);
        }
    };

    const takePhoto = async () => {
        const hasPermission = await askPermissionsAsync();
        if (!hasPermission) return;

        if (selectedImages.length >= 3) {
            Alert.alert('You can only select up to 3 images');
            return;
        }
        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            quality: 1,
        });
        if (!result.canceled && result.assets && result.assets.length > 0) {
            setSelectedImages([...selectedImages, result.assets[0].uri]);
        }
    };

    const removeImage = (uri: string) => {
        setSelectedImages(selectedImages.filter(imageUri => imageUri !== uri));
    };

    const postReview = async (foodItemId: string) => {
        try {
            const accessToken = await SecureStore.getItemAsync("token");
            if (!accessToken) {
                Alert.alert("Authorization Error", "Access token is missing.");
                return;
            }
    
            const formData = new FormData();
    
            // Append rating and review text to FormData
            formData.append('rating', rating.toString());
            formData.append('review', reviewText);
    
            // Process and append each selected image to FormData
            for (const [index, uri] of selectedImages.entries()) {
                try {
                    // Get file info from the local file system
                    const fileInfo = await FileSystem.getInfoAsync(uri);
    
                    // Ensure the file exists and has a size greater than 0
                    if (fileInfo.exists && fileInfo.size > 0) {
                        // Get the blob and additional image metadata
                        const response = await fetch(uri);
                        const blob = await response.blob();
    
                        // Extract filename and type (if available)
                        const fileName = uri.split('/').pop() || `photo_${index + 1}.jpg`;
                        const fileType = blob.type || 'image/jpeg';
    
                        // Log for debugging
                        console.log(`Uploading image: ${fileName}, type: ${fileType}, size: ${fileInfo.size}`);
    
                        // Append the image metadata to FormData
                        formData.append(`image_${index + 1}`, {
                            uri,
                            type: fileType,
                            name: fileName,
                        });
                    } else {
                        console.error(`File not found or empty: ${uri}`);
                        Alert.alert('Error', `One of the images could not be found or is empty.`);
                        return;
                    }
                } catch (error) {
                    console.error('Error processing file:', error);
                    Alert.alert('Error', 'Failed to process one of the images.');
                    return;
                }
            }
    
            // Append the "_method" field for the form submission
            formData.append("_method", "POST");
    
            // Send the review with the images to the server using fetch API
            const response = await fetch(
                `${process.env.EXPO_PUBLIC_API_URL}/review/food/${foodItemId}`,
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: formData,
                }
            );
    
            // Handle the response
            if (response.ok) {
                Alert.alert('Review posted successfully!');
                setReviewText('');
                setSelectedImages([]);
                setRating(0);
            } else {
                const errorData = await response.json();
                console.error(`Error ${response.status}: ${errorData.message}`);
                Alert.alert('Failed to post review', errorData.message);
            }
        } catch (error) {
            console.error('Failed to post review:', error);
            Alert.alert('Failed to post review. Please try again.');
        }
    };
    









    const handlePostReview = () => {
        if (!currentOrder) return;

        const uniqueFoodIds = new Set();

        cart.forEach((item) => {
            if (!uniqueFoodIds.has(item.food_id)) {
                uniqueFoodIds.add(item.food_id);
                postReview(item.food_id);
            }
        });
    };

    return (
        <>
            <BackButton
                onPress={() => router.navigate("/receipts/")}
                buttonStyle={styles.backButton}
            />
            <View style={{ flex: 1, marginHorizontal: 30, flexDirection: 'column', marginTop: 60 }}>
                <Text style={{ fontSize: 16, fontFamily: 'TT Chocolates Trial Medium', color: '#BF1E2E', alignSelf: 'flex-end' }}>
                    Help
                </Text>
                <ScrollView style={{ maxHeight: 400 }}>
                    {Array.from(new Set(cart.map(item => item.food_id)))
                        .map(uniqueFoodId => cart.find(item => item.food_id === uniqueFoodId))
                        .map((item, index) => (
                            <View key={`${item.food_id}_${index}`}>
                                <Text style={{ fontSize: 14, fontFamily: 'TT Chocolates Trial Bold', color: '#000000', marginTop: 30 }}>
                                    {item.name}
                                </Text>
                                <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                    <Text style={{ fontSize: 14, fontFamily: 'TT Chocolates Trial Medium', color: '#000000' }}>Give a Rating</Text>
                                    <View style={styles.starContainer}>
                                        {Array.from({ length: 5 }, (_, index) => (
                                            <Pressable key={index} onPress={() => setStarRating(item.id, index)}>
                                                <FontAwesome
                                                    name={index < item.rating ? 'star' : 'star-o'}
                                                    size={20}
                                                    color="#FFBF00"
                                                    style={styles.star}
                                                />
                                            </Pressable>
                                        ))}
                                    </View>
                                </View>
                                <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                                    <TextInput
                                        style={[styles.rectangle, { marginTop: 20, height: 100, alignItems: 'flex-start', padding: 10, textAlign: 'justify', fontFamily: 'TT Chocolates Trial Regular' }]}
                                        placeholder="How was the food and service? Let us know!"
                                        multiline={true}
                                        placeholderTextColor={'#DFDFDF'}
                                        value={reviewText}
                                        onChangeText={setReviewText}
                                    />
                                </TouchableWithoutFeedback>
                            </View>
                        ))
                    }
                </ScrollView>
                <View style={{ marginTop: 10, flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Text style={{ fontSize: 14, fontFamily: 'TT Chocolates Trial Bold', color: '#000000' }}>Upload Photos</Text>
                    <Text style={{ fontSize: 12, fontFamily: 'TT Chocolates Trial Regular', color: '#000000', marginTop: 10 }}>You may choose up to 3 photos. Long press Image to remove.</Text>
                </View>
                <View style={styles.container}>
                    <Pressable
                        style={({ pressed }) => [
                            styles.rectangle2,
                            pressed && styles.pressed,
                        ]}
                        onPress={pickImage}
                    >
                        <FontAwesome name="image" size={24} color="black" />
                        <Text style={styles.text}>From Photos</Text>
                    </Pressable>
                    <Pressable
                        style={({ pressed }) => [
                            styles.rectangle2,
                            pressed && styles.pressed,
                        ]}
                        onPress={takePhoto}
                    >
                        <Feather name="camera" size={24} color="black" />
                        <Text style={styles.text}>From Camera</Text>
                    </Pressable>
                </View>
                <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'space-between', }}>
                    {selectedImages.map((uri, index) => (
                        <Pressable key={index} onLongPress={() => removeImage(uri)}>
                            <Image source={{ uri }} style={styles.image} />
                        </Pressable>
                    ))}
                </View>
            </View>
            <KBottomButton title="Post Review" onPress={handlePostReview} />
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
        marginHorizontal: 4,
    },
    rectangle: {
        borderWidth: 1,
        borderColor: '#DFDFDF',
        borderRadius: 3,
    },
    rectangle2: {
        borderWidth: 1,
        borderColor: '#EEEEEE',
        borderRadius: 6,
        backgroundColor: '#FFFFFF',
        shadowColor: 'rgba(216, 216, 216, 0.5)',
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
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
        backgroundColor: '#EFEFF0',
    },
    text: {
        fontSize: 12,
        fontFamily: 'TT Chocolates Trial Medium',
        color: '#000000',
        marginTop: 10,
        marginLeft: 10,
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 10,
        marginRight: 10,
    },
});
