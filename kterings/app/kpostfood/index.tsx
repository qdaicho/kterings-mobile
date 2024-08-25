import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, TextInput, FlatList } from 'react-native';
import { Entypo, MaterialCommunityIcons, FontAwesome, Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
import BackButton from "@/components/common/BackButton";
import KBottomButton from "@/components/common/KBottomButton";
import DropDownPicker from 'react-native-dropdown-picker';

interface Option {
    label: string;
    value: string;
}

export default function Index() {
    const navigation = useNavigation();

    // States for the dropdowns
    const [halalOpen, setHalalOpen] = useState(false);
    const [halalValue, setHalalValue] = useState<string | null>(null);
    const [halalOptions] = useState<Option[]>([
        { label: 'Halal - Hand Slaughtered', value: '1' },
        { label: 'Halal - Machine Slaughtered', value: '2' },
        { label: 'Not Halal', value: '3' },
    ]);

    const [kosherOpen, setKosherOpen] = useState(false);
    const [kosherValue, setKosherValue] = useState<string | null>(null);
    const [kosherOptions] = useState<Option[]>([
        { label: 'Yes', value: '1' },
        { label: 'No', value: '2' },
    ]);

    const [meatOpen, setMeatOpen] = useState(false);
    const [meatValue, setMeatValue] = useState<string | null>(null);
    const [meatOptions] = useState<Option[]>([
        { label: 'Chicken', value: '1' },
        { label: 'Beef', value: '2' },
        { label: 'Pork', value: '3' },
        { label: 'Lamb', value: '4' },
        { label: 'Turkey', value: '5' },
        { label: 'Duck', value: '6' },
        { label: 'Veal', value: '7' },
    ]);

    const [ethnicityOpen, setEthnicityOpen] = useState(false);
    const [ethnicityValue, setEthnicityValue] = useState<string | null>(null);
    const [ethnicityOptions] = useState<Option[]>([
        { label: 'Indian', value: '1' },
        { label: 'Italian', value: '2' },
        { label: 'American', value: '3' },
        { label: 'Chinese', value: '4' },
        { label: 'Mexican', value: '5' },
        { label: 'Japanese', value: '6' },
        { label: 'French', value: '7' },
    ]);

    const [timeOpen, setTimeOpen] = useState(false);
    const [timeValue, setTimeValue] = useState<string | null>(null);
    const timeOptions: Option[] = [];
    for (let i = 5; i <= 60; i += 5) {
        timeOptions.push({ label: `${i} minutes`, value: `${i}` });
    }

    // This will close any other dropdown when one is opened to avoid overlapping
    const handleDropdownOpen = (dropdown: string) => {
        if (dropdown !== 'halal') setHalalOpen(false);
        if (dropdown !== 'kosher') setKosherOpen(false);
        if (dropdown !== 'meat') setMeatOpen(false);
        if (dropdown !== 'ethnicity') setEthnicityOpen(false);
        if (dropdown !== 'time') setTimeOpen(false);
    };

    const renderItem = () => (
        <>
            <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Post Food</Text>
                <TextInput
                    placeholder="Name of Food (Try to keep it short & sweet!)"
                    placeholderTextColor="#969696"
                    style={styles.textInput}
                />
            </View>

            <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Upload Photos</Text>
                <Text style={styles.sectionSubtitle}>You may choose up to 3 photos.</Text>
            </View>

            <View style={styles.photoButtonsContainer}>
                <Pressable style={({ pressed }) => [styles.photoButton, pressed && styles.pressed]}>
                    <FontAwesome name="image" size={24} color="black" />
                    <Text style={styles.photoButtonText}>From Photos</Text>
                </Pressable>

                <Pressable style={({ pressed }) => [styles.photoButton, pressed && styles.pressed]}>
                    <Feather name="camera" size={24} color="black" />
                    <Text style={styles.photoButtonText}>From Camera</Text>
                </Pressable>
            </View>

            <View style={styles.plusIconContainer}>
                {[...Array(3)].map((_, index) => (
                    <Entypo key={index} name="plus" size={40} color="#969696" />
                ))}
            </View>

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

            <View style={[styles.sectionContainer, { zIndex: kosherOpen ? 2000 : 0 }]}>
                <Text style={styles.sectionTitle}>Is this item Kosher?</Text>
                <Text style={styles.sectionSubtitle}>Kosher is food prepared according to the requirements of Jewish law.</Text>
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

            <View style={[styles.sectionContainer, { zIndex: timeOpen ? 500 : 0 }]}>
                <Text style={styles.sectionTitle}>Preparation & Delivery Time</Text>
                <Text style={styles.sectionSubtitle}>How long do you need to prepare/make this item?</Text>
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
                    style={styles.textArea}
                />
            </View>

            <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Ingredients</Text>
                <TextInput
                    placeholder="Please include all ingredients and enter each ingredient on a new line."
                    placeholderTextColor="#969696"
                    multiline
                    style={styles.textArea}
                />
            </View>
        </>
    );

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.headerContainer}>
                <BackButton onPress={() => router.navigate('/homepage/becomekterer/')} />
                <Text style={styles.dashboardTitle}>Kterer Dashboard</Text>
                <Pressable onPress={() => console.log('Pressed')}>
                    <MaterialCommunityIcons name="bell-outline" size={24} color="#BF1E2E" style={styles.bellIcon} />
                </Pressable>
            </View>

            <FlatList
                data={[]}
                keyExtractor={(item, index) => index.toString()}
                renderItem={null}
                ListHeaderComponent={renderItem}
                ListFooterComponent={<KBottomButton title="Post Food" onPress={() => console.log("proceed to payment")} />}
            />
        </View>
    );
}

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
    plusIconContainer: {
        marginTop: 50,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-start',
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
    dropDownItemLabel: {
        fontSize: 12,
        fontFamily: 'TT Chocolates Trial Medium',
        color: '#000000',
        textAlign: 'center',
    },
    itemSeparator: {
        height: 1,
        backgroundColor: '#EEEEEE',
        marginHorizontal: 10,
    },
});
