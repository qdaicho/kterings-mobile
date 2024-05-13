import { View, Text, Pressable, StyleSheet, TextInput, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';
import { router, useNavigation } from 'expo-router';
import BackButton from "@/components/common/BackButton";
import KBottomButton from "@/components/common/KBottomButton";
import DropDownPicker from 'react-native-dropdown-picker';

export default function index() {
    const navigation = useNavigation();

    const [halalOpen, setHalalOpen] = useState(false);
    const [halalValue, setHalalValue] = useState(null);
    const [halalOptions, setHalalOptions] = useState([
        { label: 'Halal - Hand Slaughtered', value: '1' },
        { label: 'Halal - Machine Slaughtered', value: '2' },
        { label: 'Not Halal', value: '3' },
    ]);

    const [kosherOpen, setKosherOpen] = useState(false);
    const [kosherValue, setKosherValue] = useState(null);
    const [kosherOptions, setKosherOptions] = useState([
        { label: 'Yes', value: '1' },
        { label: 'No', value: '2' },
    ]);


    const [meatOpen, setMeatOpen] = useState(false);
    const [meatValue, setMeatValue] = useState(null);
    const [meatOptions, setMeatOptions] = useState([
        { label: 'Chicken', value: '1' },
        { label: 'Beef', value: '2' },
        { label: 'Pork', value: '3' },
        { label: 'Lamb', value: '4' },
        { label: 'Turkey', value: '5' },
        { label: 'Duck', value: '6' },
        { label: 'Veal', value: '7' },
        // Add more options as needed
    ]);

    const [ethnicityOpen, setEthnicityOpen] = useState(false);
    const [ethnicityValue, setEthnicityValue] = useState(null);
    const [ethnicityOptions, setEthnicityOptions] = useState([
        { label: 'Indian', value: '1' },
        { label: 'Italian', value: '2' },
        { label: 'American', value: '3' },
        { label: 'Chinese', value: '4' },
        { label: 'Mexican', value: '5' },
        { label: 'Japanese', value: '6' },
        { label: 'French', value: '7' },
        // Add more options as needed
    ]);

    const [timeOpen, setTimeOpen] = useState(false);
    const [timeValue, setTimeValue] = useState(null);

    // Generate time options from 5 to 60 minutes with 5-minute intervals
    const timeOptions: { label: string; value: string }[] = [];
    for (let i = 5; i <= 60; i += 5) {
        timeOptions.push({ label: `${i} minutes`, value: `${i}` });
    }

    const setTimeOptions = (newOptions) => {
        // You can add additional logic here if needed
        setTimeOptions(newOptions);
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 70, marginHorizontal: 10 }}>
                {/* <Entypo name="menu" size={40} color="#BF1E2E" onPress={() => navigation.dispatch(DrawerActions.openDrawer())} /> */}
                <BackButton onPress={() => router.navigate('/homepage/becomekterer/')} />
                <Text style={{ fontSize: 15, fontFamily: 'TT Chocolates Trial Bold', color: '#000000' }}>Kterer Dashboard</Text>
                <Pressable onPress={() => console.log('Pressed')}>
                    <MaterialCommunityIcons name="bell-outline" size={24} color="#BF1E2E" style={{ marginRight: 20 }} />
                </Pressable>
            </View>

            <ScrollView style={{ flex: 1, marginVertical: 50 }}>
                <View style={{ marginTop: 20, flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-start', marginHorizontal: 20 }}>
                    <Text style={{ fontSize: 14, fontFamily: 'TT Chocolates Trial Bold', color: '#000000' }}>Post Food</Text>
                    <TextInput
                        placeholder='Name of Food (Try to keep it short & sweet!)'
                        placeholderTextColor='#969696'
                        style={{ fontSize: 12, fontFamily: 'TT Chocolates Trial Regular', color: '#000000', marginTop: 10, backgroundColor: '#F0F0F0', height: 50, width: '100%', borderRadius: 10, paddingHorizontal: 20 }}
                    />
                </View>


                <View style={{ marginTop: 20, flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-start', marginHorizontal: 20 }}>
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

                <View style={{ marginTop: 20, flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-start', marginHorizontal: 20 }}>
                    <Text style={{ fontSize: 14, fontFamily: 'TT Chocolates Trial Bold', color: '#000000', marginBottom: 10 }}>What size/s are you selling?</Text>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, alignContent: 'center', gap: 10 }}>
                        <View style={{ flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Pressable style={{ backgroundColor: `rgba(191,30,46,0.15)`, borderRadius: 10, paddingHorizontal: 20, paddingVertical: 10 }}>
                                <Text style={{ fontSize: 12, fontFamily: 'TT Chocolates Trial Regular', color: '#BF1E2E' }}>Small</Text>
                            </Pressable>

                            <TextInput
                                placeholder='Price (Small)'
                                placeholderTextColor='#969696'
                                style={{ fontSize: 12, fontFamily: 'TT Chocolates Trial Regular', color: '#000000', marginTop: 10, backgroundColor: '#F0F0F0', height: 50, width: 'auto', borderRadius: 10, paddingHorizontal: 10 }}
                            />
                            <TextInput
                                placeholder='Quantity'
                                placeholderTextColor='#969696'
                                style={{ fontSize: 12, fontFamily: 'TT Chocolates Trial Regular', color: '#000000', marginTop: 10, backgroundColor: '#F0F0F0', height: 50, width: 'auto', borderRadius: 10, paddingHorizontal: 10 }}
                            />
                        </View>
                        <View style={{ flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Pressable style={{ backgroundColor: `rgba(191,30,46,0.15)`, borderRadius: 10, paddingHorizontal: 20, paddingVertical: 10 }}>
                                <Text style={{ fontSize: 12, fontFamily: 'TT Chocolates Trial Regular', color: '#BF1E2E' }}>Medium</Text>
                            </Pressable>

                            <TextInput
                                placeholder='Price (Medium)'
                                placeholderTextColor='#969696'
                                style={{ fontSize: 12, fontFamily: 'TT Chocolates Trial Regular', color: '#000000', marginTop: 10, backgroundColor: '#F0F0F0', height: 50, width: 'auto', borderRadius: 10, paddingHorizontal: 10 }}
                            />
                            <TextInput
                                placeholder='Quantity'
                                placeholderTextColor='#969696'
                                style={{ fontSize: 12, fontFamily: 'TT Chocolates Trial Regular', color: '#000000', marginTop: 10, backgroundColor: '#F0F0F0', height: 50, width: 'auto', borderRadius: 10, paddingHorizontal: 10 }}
                            />
                        </View>
                        <View style={{ flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Pressable style={{ backgroundColor: `rgba(191,30,46,0.15)`, borderRadius: 10, paddingHorizontal: 20, paddingVertical: 10 }}>
                                <Text style={{ fontSize: 12, fontFamily: 'TT Chocolates Trial Regular', color: '#BF1E2E' }}>Large</Text>
                            </Pressable>

                            <TextInput
                                placeholder='Price (Large)'
                                placeholderTextColor='#969696'
                                style={{ fontSize: 12, fontFamily: 'TT Chocolates Trial Regular', color: '#000000', marginTop: 10, backgroundColor: '#F0F0F0', height: 50, width: 'auto', borderRadius: 10, paddingHorizontal: 10 }}
                            />
                            <TextInput
                                placeholder='Quantity'
                                placeholderTextColor='#969696'
                                style={{ fontSize: 12, fontFamily: 'TT Chocolates Trial Regular', color: '#000000', marginTop: 10, backgroundColor: '#F0F0F0', height: 50, width: 'auto', borderRadius: 10, paddingHorizontal: 10 }}
                            />
                        </View>
                    </View>
                </View>

                <View style={{ marginTop: 20, flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-start', marginHorizontal: 20 }}>
                    <Text style={{ fontSize: 14, fontFamily: 'TT Chocolates Trial Bold', color: '#000000' }}>Description</Text>
                    <TextInput
                        placeholder='Tell us a little bit about your food item. Is it perfect for dinner? Lunch? Is it good for 3 people? Let customers know!'
                        placeholderTextColor='#969696'
                        multiline={true}
                        style={{ fontSize: 12, fontFamily: 'TT Chocolates Trial Regular', color: '#000000', marginTop: 10, backgroundColor: '#F0F0F0', height: 150, width: '100%', borderRadius: 10, paddingHorizontal: 20 }}
                    />
                </View>

                <View style={{ marginTop: 20, flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-start', marginHorizontal: 20 }}>
                    <Text style={{ fontSize: 14, fontFamily: 'TT Chocolates Trial Bold', color: '#000000' }}>Ingredients</Text>
                    <TextInput
                        placeholder='Please include all ingredients and enter each ingredient on a new line.'
                        placeholderTextColor='#969696'
                        multiline={true}
                        style={{ fontSize: 12, fontFamily: 'TT Chocolates Trial Regular', color: '#000000', marginTop: 10, backgroundColor: '#F0F0F0', height: 150, width: '100%', borderRadius: 10, paddingHorizontal: 20 }}
                    />
                </View>

                <View style={{ marginTop: 20, flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-start', marginHorizontal: 20, flex: 1 }}>
                    <Text style={{ fontSize: 14, fontFamily: 'TT Chocolates Trial Bold', color: '#000000' }}>Is this item Halal?</Text>
                    <Text style={{ fontSize: 12, fontFamily: 'TT Chocolates Trial Regular', color: '#000000', marginTop: 10, }}>Pork, Alcohol, and Gelatin are NOT halal.</Text>
                    <DropDownPicker
                        open={halalOpen}
                        value={halalValue}
                        items={halalOptions}
                        setOpen={setHalalOpen}
                        setValue={setHalalValue}
                        setItems={setHalalOptions}
                        placeholder={'Halal - Hand Slaughtered'}
                        showArrowIcon={true}
                        style={{
                            backgroundColor: '#fff',
                            marginTop: 10,
                            height: 'auto',
                            borderColor: '#EEEEEE',
                            flex: 1
                        }}
                        textStyle={{
                            fontSize: 12,
                            fontFamily: 'TT Chocolates Trial Medium',
                            color: '#000000',
                            textAlign: 'center',
                        }}
                        dropDownContainerStyle={{
                            borderColor: '#EEEEEE',
                            zIndex: 2
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

                <View style={{ marginTop: 20, flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-start', marginHorizontal: 20, flex: 1 }}>
                    <Text style={{ fontSize: 14, fontFamily: 'TT Chocolates Trial Bold', color: '#000000' }}>Is this item Kosher?</Text>
                    <Text style={{ fontSize: 12, fontFamily: 'TT Chocolates Trial Regular', color: '#000000', marginTop: 10, }}>Kosher is food prepared according to the requirements of Jewish law.</Text>
                    <DropDownPicker
                        open={kosherOpen}
                        value={kosherValue}
                        items={kosherOptions}
                        setOpen={setKosherOpen}
                        setValue={setKosherValue}
                        setItems={setKosherOptions}
                        placeholder={'Yes'}
                        showArrowIcon={true}
                        style={{
                            backgroundColor: '#fff',
                            marginTop: 10,
                            height: 'auto',
                            borderColor: '#EEEEEE',
                            flex: 1
                        }}
                        textStyle={{
                            fontSize: 12,
                            fontFamily: 'TT Chocolates Trial Medium',
                            color: '#000000',
                            textAlign: 'center',
                        }}
                        dropDownContainerStyle={{
                            borderColor: '#EEEEEE',
                            zIndex: 2
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

                <View style={{ marginTop: 20, flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-start', marginHorizontal: 20, flex: 1 }}>
                    <Text style={{ fontSize: 14, fontFamily: 'TT Chocolates Trial Bold', color: '#000000' }}>Does this item contain nuts?</Text>
                    <DropDownPicker
                        open={kosherOpen}
                        value={kosherValue}
                        items={kosherOptions}
                        setOpen={setKosherOpen}
                        setValue={setKosherValue}
                        setItems={setKosherOptions}
                        placeholder={'Yes'}
                        showArrowIcon={true}
                        style={{
                            backgroundColor: '#fff',
                            marginTop: 10,
                            height: 'auto',
                            borderColor: '#EEEEEE',
                            flex: 1
                        }}
                        textStyle={{
                            fontSize: 12,
                            fontFamily: 'TT Chocolates Trial Medium',
                            color: '#000000',
                            textAlign: 'center',
                        }}
                        dropDownContainerStyle={{
                            borderColor: '#EEEEEE',
                            zIndex: 2
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

                <View style={{ marginTop: 20, flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-start', marginHorizontal: 20, flex: 1 }}>
                    <Text style={{ fontSize: 14, fontFamily: 'TT Chocolates Trial Bold', color: '#000000' }}>Type of Meat</Text>
                    <DropDownPicker
                        open={meatOpen}
                        value={meatValue}
                        items={meatOptions}
                        setOpen={setMeatOpen}
                        setValue={setMeatValue}
                        setItems={setMeatOptions}
                        placeholder={'Chicken'}
                        showArrowIcon={true}
                        style={{
                            backgroundColor: '#fff',
                            marginTop: 10,
                            height: 'auto',
                            borderColor: '#EEEEEE',
                            flex: 1,
                            zIndex: 2
                        }}
                        textStyle={{
                            fontSize: 12,
                            fontFamily: 'TT Chocolates Trial Medium',
                            color: '#000000',
                            textAlign: 'center',
                        }}
                        dropDownContainerStyle={{
                            borderColor: '#EEEEEE',
                            zIndex: 2
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

                <View style={{ marginTop: 20, flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-start', marginHorizontal: 20, flex: 1 }}>
                    <Text style={{ fontSize: 14, fontFamily: 'TT Chocolates Trial Bold', color: '#000000' }}>Ethnic Type</Text>
                    <DropDownPicker
                        open={ethnicityOpen}
                        value={ethnicityValue}
                        items={ethnicityOptions}
                        setOpen={setEthnicityOpen}
                        setValue={setEthnicityValue}
                        setItems={setEthnicityOptions}
                        placeholder={'Indian'}
                        showArrowIcon={true}
                        style={{
                            backgroundColor: '#fff',
                            marginTop: 10,
                            height: 'auto',
                            borderColor: '#EEEEEE',
                            flex: 1,
                            zIndex: 2
                        }}
                        textStyle={{
                            fontSize: 12,
                            fontFamily: 'TT Chocolates Trial Medium',
                            color: '#000000',
                            textAlign: 'center',
                        }}
                        dropDownContainerStyle={{
                            borderColor: '#EEEEEE',
                            zIndex: 2
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

                <View style={{
                    marginTop: 20, flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-start', marginHorizontal: 20, flex: 1, gap: 10
                }}>
                    <Text style={{ fontSize: 14, fontFamily: 'TT Chocolates Trial Bold', color: '#000000' }}>Preparation & Delivery Time</Text>
                    <Text style={{ fontSize: 12, fontFamily: 'TT Chocolates Trial Medium', color: '#969696' }}>Important! This will help determine when your food will be picked up for delivery so make it as accurate as you can!</Text>
                    <Text style={{ fontSize: 12, fontFamily: 'TT Chocolates Trial Medium', color: '#000000' }}>How long do you need to prepare/make this item?</Text>
                    <DropDownPicker
                        open={timeOpen}
                        value={timeValue}
                        items={timeOptions}
                        setOpen={setTimeOpen}
                        setValue={setTimeValue}
                        setItems={setTimeOptions}
                        placeholder={'35 minutes'}
                        showArrowIcon={true}
                        style={{
                            backgroundColor: '#fff',
                            marginTop: 10,
                            height: 'auto',
                            borderColor: '#EEEEEE',
                            flex: 1,
                            zIndex: 2
                        }}
                        textStyle={{
                            fontSize: 12,
                            fontFamily: 'TT Chocolates Trial Medium',
                            color: '#000000',
                            textAlign: 'center',
                        }}
                        dropDownContainerStyle={{
                            borderColor: '#EEEEEE',
                            zIndex: 2
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

            </ScrollView>

            <KBottomButton title="Save Changes" onPress={() => { console.log("proceed to payment"); }} />
        </View>
    )
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
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-start',
        marginHorizontal: 20,
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
