import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, TextInput, FlatList, Image, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { MaterialCommunityIcons, FontAwesome, Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
import BackButton from "@/components/common/BackButton";
import KBottomButton from "@/components/common/KBottomButton";
import DropDownPicker, { ItemType } from 'react-native-dropdown-picker';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const Index = () => {
    const navigation = useNavigation();

    // Form states
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [halalValue, setHalalValue] = useState<string | null>(null);
    const [kosherValue, setKosherValue] = useState<boolean>(false);
    const [vegetarianValue, setVegetarianValue] = useState<string | null>(null);
    const [dessertsValue, setDessertsValue] = useState<string | null>(null);
    const [containsNuts, setContainsNuts] = useState<boolean>(false);
    const [meatValue, setMeatValue] = useState<string | null>(null);
    const [ethnicityValue, setEthnicityValue] = useState<string | null>(null);
    const [timeValue, setTimeValue] = useState<string | null>(null);
    const [selectedImages, setSelectedImages] = useState<string[]>([]);

    // States for size options
    const [smallActive, setSmallActive] = useState(false);
    const [mediumActive, setMediumActive] = useState(false);
    const [largeActive, setLargeActive] = useState(false);

    const [smallPrice, setSmallPrice] = useState('');
    const [smallAmount, setSmallAmount] = useState('');
    const [mediumPrice, setMediumPrice] = useState('');
    const [mediumAmount, setMediumAmount] = useState('');
    const [largePrice, setLargePrice] = useState('');
    const [largeAmount, setLargeAmount] = useState('');

    // Stateless variables for TextInput handling
    let nameInput = '';
    let descriptionInput = '';
    let ingredientsInput = '';
    let smallPriceInput = '';
    let smallAmountInput = '';
    let mediumPriceInput = '';
    let mediumAmountInput = '';
    let largePriceInput = '';
    let largeAmountInput = '';

    // Dropdown states
    const [halalOpen, setHalalOpen] = useState(false);
    const [kosherOpen, setKosherOpen] = useState(false);
    const [vegetarianOpen, setVegetarianOpen] = useState(false);
    const [dessertsOpen, setDessertsOpen] = useState(false);
    const [meatOpen, setMeatOpen] = useState(false);
    const [ethnicityOpen, setEthnicityOpen] = useState(false);
    const [timeOpen, setTimeOpen] = useState(false);

    // Define dropdown options
    const halalOptions = [
        { label: 'No', value: 'No' },
        { label: 'Halal - Hand Slaughtered', value: 'hand-slaughtered' },
        { label: 'Halal - Machine Slaughtered', value: 'machine-slaughtered' },
        { label: "Halal - Doesn't Have Meat", value: 'doesnt-have-meat' },
    ];

    const kosherOptions = [
        { label: 'Yes', value: true },
        { label: 'No', value: false },
    ];

    const vegetarianOptions = [
        { label: 'Vegetarian', value: 'Vegetarian' },
        { label: 'Vegan', value: 'Vegan' },
        { label: 'None', value: 'None' },
    ];

    const dessertOptions = [
        { label: 'Desserts', value: 'Desserts' },
        { label: 'Drinks', value: 'Drinks' },
        { label: 'None', value: 'None' },
    ];

    const meatOptions = [
        { label: 'Beef', value: 'Beef' },
        { label: 'Goat', value: 'Goat' },
        { label: 'Lamb', value: 'Lamb' },
        { label: 'Chicken', value: 'Chicken' },
        { label: 'Pork', value: 'Pork' },
        { label: 'Fish', value: 'Fish' },
        { label: 'Other', value: 'Other' },
        { label: 'None', value: 'None' },
    ];

    const ethnicityOptions = [
        { label: 'Pakistani', value: 'Pakistan' },
        { label: 'Indian', value: 'Indian' },
        { label: 'Chinese', value: 'Chinese' },
        { label: 'Italian', value: 'Italian' },
        { label: 'Thai', value: 'Thai' },
        { label: 'Mexican', value: 'Mexican' },
        { label: 'Korean', value: 'Korean' },
        { label: 'Asian', value: 'Asian' },
        { label: 'Middle-Eastern', value: 'Middle-Eastern' },
        { label: 'Other', value: 'Other' },
        { label: 'None', value: 'None' },
    ];

    const timeOptions: ItemType<string>[] = [];
    for (let i = 15; i <= 60; i += 10) {
        timeOptions.push({ label: `${i} minutes`, value: `${i}` });
    }

    // Toggle size buttons
    const toggleSize = (size: string) => {
        switch (size) {
            case 'small':
                setSmallActive(!smallActive);
                if (!smallActive) {
                    setSmallPrice('');
                    setSmallAmount('');
                }
                break;
            case 'medium':
                setMediumActive(!mediumActive);
                if (!mediumActive) {
                    setMediumPrice('');
                    setMediumAmount('');
                }
                break;
            case 'large':
                setLargeActive(!largeActive);
                if (!largeActive) {
                    setLargePrice('');
                    setLargeAmount('');
                }
                break;
            default:
                break;
        }
    };

    // Handle dropdowns
    const handleDropdownOpen = (dropdown: string) => {
        if (dropdown !== 'halal') setHalalOpen(false);
        if (dropdown !== 'kosher') setKosherOpen(false);
        if (dropdown !== 'vegetarian') setVegetarianOpen(false);
        if (dropdown !== 'desserts') setDessertsOpen(false);
        if (dropdown !== 'meat') setMeatOpen(false);
        if (dropdown !== 'ethnicity') setEthnicityOpen(false);
        if (dropdown !== 'time') setTimeOpen(false);
    };

    // Handle image selection
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

    const handleUpdateFood = async () => {
        // Retrieve the access token from SecureStore
        const accessToken = await SecureStore.getItemAsync("token");
    
        if (!accessToken) {
            Alert.alert('Error', 'Authentication token is missing. Please log in again.');
            return;
        }
    
        // Prepare the form data
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('ingredients', ingredients);
        formData.append('halal', halalValue || '');
        formData.append('kosher', kosherValue.toString());
        formData.append('vegetarian', vegetarianValue || '');
        formData.append('desserts', dessertsValue || '');
        formData.append('contains_nuts', containsNuts.toString());
        formData.append('meat_type', meatValue || '');
        formData.append('ethnic_type', ethnicityValue || '');
        formData.append('auto_delivery_time', timeValue || '');
    
        // Construct the quantities array based on selected sizes and prices
        const quantities = [
            { size: 'small', price: smallPrice, quantity: smallAmount },
            { size: 'medium', price: mediumPrice, quantity: mediumAmount },
            { size: 'large', price: largePrice, quantity: largeAmount },
        ].filter(item => item.price && item.quantity); // Filter out entries without values
    
        // Append the quantities array as a JSON string
        formData.append('quantities', JSON.stringify(quantities));
    
        // Add selected images to the form data
        selectedImages.forEach((imageUri, index) => {
            formData.append(`image_${index + 1}`, {
                uri: imageUri,
                type: 'image/jpeg',
                name: `photo_${index + 1}.jpg`,
            });
        });
    
        try {
            // Send the request to the backend
            const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/food`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${accessToken}`, // Use the retrieved access token
                },
            });
    
            // Handle the response
            if (response.status === 200) {
                Alert.alert('Food posted successfully!');
            } else {
                Alert.alert('There was a problem submitting your post.');
            }
        } catch (error) {
            console.error('Error posting food:', error);
            Alert.alert('Failed to post food. Please try again.');
        }
    };
    

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            <View style={{ flex: 1 }}>
                <View style={styles.headerContainer}>
                    <BackButton onPress={() => router.navigate('/homepage/becomekterer')} />
                    <Text style={styles.dashboardTitle}>Kterer Dashboard</Text>
                    <Pressable onPress={() => console.log('Pressed')}>
                        <MaterialCommunityIcons name="bell-outline" size={24} color="#BF1E2E" style={styles.bellIcon} />
                    </Pressable>
                </View>

                <FlatList
                    data={[]}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={null}
                    ListHeaderComponent={() => (
                        <>
                            <View style={styles.sectionContainer}>
                                <Text style={styles.sectionTitle}>Post Food</Text>
                                <TextInput
                                    placeholder="Name of Food (Try to keep it short & sweet!)"
                                    placeholderTextColor="#969696"
                                    defaultValue={name}
                                    onChangeText={(val) => nameInput = val}
                                    onEndEditing={() => setName(nameInput)}
                                    style={styles.textInput}
                                />
                            </View>

                            <View style={styles.sectionContainer}>
                                <Text style={styles.sectionTitle}>Upload Photos</Text>
                                <Text style={styles.sectionSubtitle}>You may choose up to 3 photos.</Text>
                            </View>

                            <View style={styles.photoButtonsContainer}>
                                <Pressable style={({ pressed }) => [styles.photoButton, pressed && styles.pressed]} onPress={pickImage}>
                                    <FontAwesome name="image" size={24} color="black" />
                                    <Text style={styles.photoButtonText}>From Photos</Text>
                                </Pressable>

                                <Pressable style={({ pressed }) => [styles.photoButton, pressed && styles.pressed]} onPress={takePhoto}>
                                    <Feather name="camera" size={24} color="black" />
                                    <Text style={styles.photoButtonText}>From Camera</Text>
                                </Pressable>
                            </View>

                            <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 20 }}>
                                {selectedImages.map((uri, index) => (
                                    <Pressable key={index} onLongPress={() => removeImage(uri)}>
                                        <Image source={{ uri }} style={styles.image} />
                                    </Pressable>
                                ))}
                            </View>

                            {/* Dropdowns and Input Fields */}
                            {/* Halal Dropdown */}
                            <View style={[styles.sectionContainer, { zIndex: halalOpen ? 3000 : 0 }]}>
                                <Text style={styles.sectionTitle}>Is this item Halal?</Text>
                                <Text style={styles.sectionSubtitle}>Pork, Alcohol, and Gelatin are NOT halal.</Text>
                                <DropDownPicker
                                    open={halalOpen}
                                    value={halalValue}
                                    items={halalOptions}
                                    setOpen={(open) => {
                                        handleDropdownOpen('halal');
                                        setHalalOpen(open);
                                    }}
                                    setValue={setHalalValue}
                                    placeholder="Select Halal Option"
                                    style={styles.dropDown}
                                    textStyle={styles.dropDownText}
                                    dropDownContainerStyle={styles.dropDownContainer}
                                />
                            </View>

                            {/* Kosher Dropdown */}
                            <View style={[styles.sectionContainer, { zIndex: kosherOpen ? 2000 : 0 }]}>
                                <Text style={styles.sectionTitle}>Is this item Kosher?</Text>
                                <Text style={styles.sectionSubtitle}>Kosher is food prepared according to Jewish dietary guidelines.</Text>
                                <DropDownPicker
                                    open={kosherOpen}
                                    value={kosherValue}
                                    items={kosherOptions}
                                    setOpen={(open) => {
                                        handleDropdownOpen('kosher');
                                        setKosherOpen(open);
                                    }}
                                    setValue={setKosherValue}
                                    placeholder="Yes"
                                    style={styles.dropDown}
                                    textStyle={styles.dropDownText}
                                    dropDownContainerStyle={styles.dropDownContainer}
                                />
                            </View>

                            {/* Vegetarian/Vegan Dropdown */}
                            <View style={[styles.sectionContainer, { zIndex: vegetarianOpen ? 1800 : 0 }]}>
                                <Text style={styles.sectionTitle}>Vegetarian/Vegan?</Text>
                                <DropDownPicker
                                    open={vegetarianOpen}
                                    value={vegetarianValue}
                                    items={vegetarianOptions}
                                    setOpen={(open) => {
                                        handleDropdownOpen('vegetarian');
                                        setVegetarianOpen(open);
                                    }}
                                    setValue={setVegetarianValue}
                                    placeholder="Select Option"
                                    style={styles.dropDown}
                                    textStyle={styles.dropDownText}
                                    dropDownContainerStyle={styles.dropDownContainer}
                                />
                            </View>

                            {/* Desserts/Drinks Dropdown */}
                            <View style={[styles.sectionContainer, { zIndex: dessertsOpen ? 1700 : 0 }]}>
                                <Text style={styles.sectionTitle}>Desserts/Drinks?</Text>
                                <DropDownPicker
                                    open={dessertsOpen}
                                    value={dessertsValue}
                                    items={dessertOptions}
                                    setOpen={(open) => {
                                        handleDropdownOpen('desserts');
                                        setDessertsOpen(open);
                                    }}
                                    setValue={setDessertsValue}
                                    placeholder="Select Option"
                                    style={styles.dropDown}
                                    textStyle={styles.dropDownText}
                                    dropDownContainerStyle={styles.dropDownContainer}
                                />
                            </View>

                            {/* Meat Dropdown */}
                            <View style={[styles.sectionContainer, { zIndex: meatOpen ? 1500 : 0 }]}>
                                <Text style={styles.sectionTitle}>Type of Meat</Text>
                                <DropDownPicker
                                    open={meatOpen}
                                    value={meatValue}
                                    items={meatOptions}
                                    setOpen={(open) => {
                                        handleDropdownOpen('meat');
                                        setMeatOpen(open);
                                    }}
                                    setValue={setMeatValue}
                                    placeholder="Chicken"
                                    style={styles.dropDown}
                                    textStyle={styles.dropDownText}
                                    dropDownContainerStyle={styles.dropDownContainer}
                                />
                            </View>

                            {/* Ethnicity Dropdown */}
                            <View style={[styles.sectionContainer, { zIndex: ethnicityOpen ? 1000 : 0 }]}>
                                <Text style={styles.sectionTitle}>Ethnic Type</Text>
                                <DropDownPicker
                                    open={ethnicityOpen}
                                    value={ethnicityValue}
                                    items={ethnicityOptions}
                                    setOpen={(open) => {
                                        handleDropdownOpen('ethnicity');
                                        setEthnicityOpen(open);
                                    }}
                                    setValue={setEthnicityValue}
                                    placeholder="Indian"
                                    style={styles.dropDown}
                                    textStyle={styles.dropDownText}
                                    dropDownContainerStyle={styles.dropDownContainer}
                                />
                            </View>

                            {/* Time Dropdown */}
                            <View style={[styles.sectionContainer, { zIndex: timeOpen ? 500 : 0 }]}>
                                <Text style={styles.sectionTitle}>Preparation & Delivery Time</Text>
                                <Text style={styles.sectionSubtitle}>Important! This will help determine when your food will be picked up for delivery so make it as accurate as possible.</Text>
                                <DropDownPicker
                                    open={timeOpen}
                                    value={timeValue}
                                    items={timeOptions}
                                    setOpen={(open) => {
                                        handleDropdownOpen('time');
                                        setTimeOpen(open);
                                    }}
                                    setValue={setTimeValue}
                                    placeholder="Select Time"
                                    style={styles.dropDown}
                                    textStyle={styles.dropDownText}
                                    dropDownContainerStyle={styles.dropDownContainer}
                                />
                            </View>

                            <View style={styles.sectionContainer}>
                                <Text style={styles.sectionTitle}>Description</Text>
                                <TextInput
                                    placeholder="Tell us a little bit about your food item. Is it perfect for dinner? Lunch? Is it good for 3 people? Let customers know!"
                                    placeholderTextColor="#969696"
                                    multiline
                                    defaultValue={description}
                                    onChangeText={(val) => descriptionInput = val}
                                    onEndEditing={() => setDescription(descriptionInput)}
                                    style={styles.textArea}
                                />
                            </View>

                            <View style={styles.sectionContainer}>
                                <Text style={styles.sectionTitle}>Ingredients</Text>
                                <TextInput
                                    placeholder="Please include all ingredients and enter each ingredient on a new line."
                                    placeholderTextColor="#969696"
                                    multiline
                                    defaultValue={ingredients}
                                    onChangeText={(val) => ingredientsInput = val}
                                    onEndEditing={() => setIngredients(ingredientsInput)}
                                    style={styles.textArea}
                                />
                            </View>

                            {/* UI for size selections */}
                            <View style={styles.sectionContainer}>
                                <Text style={styles.sectionTitle}>What size/s are you selling?</Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 }}>
                                    <Pressable style={[styles.sizeButton, smallActive && styles.activeSize]} onPress={() => toggleSize('small')}>
                                        <Text style={styles.sizeText}>Small</Text>
                                    </Pressable>
                                    <Pressable style={[styles.sizeButton, mediumActive && styles.activeSize]} onPress={() => toggleSize('medium')}>
                                        <Text style={styles.sizeText}>Medium</Text>
                                    </Pressable>
                                    <Pressable style={[styles.sizeButton, largeActive && styles.activeSize]} onPress={() => toggleSize('large')}>
                                        <Text style={styles.sizeText}>Large</Text>
                                    </Pressable>
                                </View>

                                {smallActive && (
                                    <View style={styles.sizeInputContainer}>
                                        <TextInput
                                            placeholder="Price (Small)"
                                            placeholderTextColor="#969696"
                                            keyboardType="numeric"
                                            defaultValue={smallPrice}
                                            onChangeText={(val) => smallPriceInput = val}
                                            onEndEditing={() => setSmallPrice(smallPriceInput)}
                                            style={styles.textInput}
                                        />
                                        <TextInput
                                            placeholder="Quantity"
                                            placeholderTextColor="#969696"
                                            keyboardType="numeric"
                                            defaultValue={smallAmount}
                                            onChangeText={(val) => smallAmountInput = val}
                                            onEndEditing={() => setSmallAmount(smallAmountInput)}
                                            style={styles.textInput}
                                        />
                                    </View>
                                )}

                                {mediumActive && (
                                    <View style={styles.sizeInputContainer}>
                                        <TextInput
                                            placeholder="Price (Medium)"
                                            placeholderTextColor="#969696"
                                            keyboardType="numeric"
                                            defaultValue={mediumPrice}
                                            onChangeText={(val) => mediumPriceInput = val}
                                            onEndEditing={() => setMediumPrice(mediumPriceInput)}
                                            style={styles.textInput}
                                        />
                                        <TextInput
                                            placeholder="Quantity"
                                            placeholderTextColor="#969696"
                                            keyboardType="numeric"
                                            defaultValue={mediumAmount}
                                            onChangeText={(val) => mediumAmountInput = val}
                                            onEndEditing={() => setMediumAmount(mediumAmountInput)}
                                            style={styles.textInput}
                                        />
                                    </View>
                                )}

                                {largeActive && (
                                    <View style={styles.sizeInputContainer}>
                                        <TextInput
                                            placeholder="Price (Large)"
                                            placeholderTextColor="#969696"
                                            keyboardType="numeric"
                                            defaultValue={largePrice}
                                            onChangeText={(val) => largePriceInput = val}
                                            onEndEditing={() => setLargePrice(largePriceInput)}
                                            style={styles.textInput}
                                        />
                                        <TextInput
                                            placeholder="Quantity"
                                            placeholderTextColor="#969696"
                                            keyboardType="numeric"
                                            defaultValue={largeAmount}
                                            onChangeText={(val) => largeAmountInput = val}
                                            onEndEditing={() => setLargeAmount(largeAmountInput)}
                                            style={styles.textInput}
                                        />
                                    </View>
                                )}
                            </View>
                        </>
                    )}
                />
                <KBottomButton title="Post Food" onPress={handleUpdateFood} />
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 70,
        marginHorizontal: 10,
    },
    dashboardTitle: {
        fontSize: 15,
        fontFamily: 'TT Chocolates Trial Bold',
        color: '#000000',
    },
    bellIcon: {
        marginRight: 20,
    },
    sectionContainer: {
        marginTop: 20,
        marginHorizontal: 20,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 14,
        fontFamily: 'TT Chocolates Trial Bold',
        color: '#000000',
    },
    sectionSubtitle: {
        fontSize: 12,
        fontFamily: 'TT Chocolates Trial Regular',
        color: '#969696',
        marginTop: 10,
    },
    textInput: {
        fontSize: 12,
        fontFamily: 'TT Chocolates Trial Regular',
        color: '#000000',
        marginTop: 10,
        backgroundColor: '#F0F0F0',
        height: 50,
        width: '100%',
        borderRadius: 10,
        paddingHorizontal: 20,
    },
    textArea: {
        fontSize: 12,
        fontFamily: 'TT Chocolates Trial Regular',
        color: '#000000',
        marginTop: 10,
        backgroundColor: '#F0F0F0',
        height: 150,
        width: '100%',
        borderRadius: 10,
        paddingHorizontal: 20,
    },
    photoButtonsContainer: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-start',
        marginHorizontal: 20,
    },
    photoButton: {
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
    photoButtonText: {
        fontSize: 12,
        fontFamily: 'TT Chocolates Trial Medium',
        color: '#000000',
        marginTop: 10,
        marginLeft: 10,
    },
    pressed: {
        backgroundColor: '#EFEFF0',
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 10,
        marginRight: 10,
    },
    dropDown: {
        backgroundColor: '#fff',
        marginTop: 10,
        height: 'auto',
        borderColor: '#EEEEEE',
    },
    dropDownText: {
        fontSize: 12,
        fontFamily: 'TT Chocolates Trial Medium',
        color: '#000000',
        textAlign: 'center',
    },
    dropDownContainer: {
        borderColor: '#EEEEEE',
    },
    sizeButton: {
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#dcdcdc',
    },
    activeSize: {
        backgroundColor: '#d1d1d1',
    },
    sizeText: {
        fontSize: 14,
        color: '#000',
    },
    sizeInputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
});

export default Index;
