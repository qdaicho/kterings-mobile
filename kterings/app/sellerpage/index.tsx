import { View, Text, StyleSheet, FlatList, Image, Pressable } from 'react-native'
import React, { useState } from 'react'
import BackButton from '@/components/common/BackButton'
import { router } from 'expo-router'
import DropDownPicker from 'react-native-dropdown-picker'
import ProductLarge from '@/components/common/ProductLarge'
import { products } from '@/assets/products'
import { Entypo, FontAwesome } from '@expo/vector-icons';

const SellerPage = () => {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
        {
            label: "Ratings 1.0+",
            value: 1.0,
        },
        {
            label: "Ratings 2.0+",
            value: 2.0,
        },
        {
            label: "Ratings 3.0+",
            value: 3.0,
        },
        {
            label: "Ratings 4.0+",
            value: 4.0,
        },
    ]);

    const renderSellerRating = (rating = 5) => {
        // Ensure the rating is a number, converting from string if needed
        const numericRating = typeof rating === 'string' ? parseInt(rating, 10) : rating;

        // Ensure the rating has one decimal place
        const formattedRating = numericRating.toFixed(1);

        // Create the star icons based on the integer part of the numeric rating
        const wholeStars = Math.floor(numericRating);
        const stars = Array.from({ length: wholeStars }, (_, index) => (
            <FontAwesome key={index} name="star" size={12} style={styles.starIcon} />
        ));

        return (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {stars}
                <Text style={{ ...styles.rating, fontSize: 12 }}>{formattedRating} (30+)</Text>
            </View>
        );
    };

    const [isFavorite, setIsFavorite] = useState(false); // New state variable

    const toggleFavorite = () => {
        setIsFavorite(!isFavorite); // Toggle the favorite status
    };

    return (
        <View style={styles.container}>
            <BackButton
                onPress={() => router.back()}
                buttonStyle={styles.backButton}
            />
            <View style={{ flex: 1, alignContent: 'center', marginHorizontal: 20, marginTop: 20 }}>
                <View style={{ marginTop: 100, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={require('@assets/images/bakery.png')} style={{ width: 60, height: 60, borderRadius: 20 }} />
                        <View style={{ marginLeft: 10, flexDirection: 'column' }}>
                            <Text style={{ fontFamily: 'TT Chocolates Trial Bold', fontSize: 18 }}>Bakery</Text>
                            <Text style={{ fontFamily: 'TT Chocolates Trial Regular', fontSize: 11, color: '#969696' }}>American</Text>
                            <Text style={{ fontFamily: 'TT Chocolates Trial Regular', fontSize: 11, color: '#969696' }}>20 min away</Text>
                            <Text style={{ fontFamily: 'TT Chocolates Trial Regular', fontSize: 11, color: '#969696' }}>3 years experience</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'column', alignItems: 'flex-end' }}>
                        <Pressable onPress={toggleFavorite} style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Entypo
                                name={isFavorite ? "heart" : "heart-outlined"} // Correct icon name
                                size={24}
                                color={isFavorite ? "red" : "gray"} // Toggle color based on favorite status
                            />
                            <Text style={{ fontFamily: 'TT Chocolates Trial Regular', fontSize: 11, color: '#000000', marginLeft: 5 }}>
                                Favorite
                            </Text>
                        </Pressable>

                        {renderSellerRating(4.5)}
                        <Text style={{ fontFamily: 'TT Chocolates Trial Regular', fontSize: 11, color: '#969696' }}>Member since 2024</Text>
                    </View>
                </View>
                <View style={styles.header}>
                    <Text style={styles.headerText}>All Items</Text>
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

                <FlatList
                    data={products}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={({ item }) => (
                        <ProductLarge
                            image={item.image}
                            name={item.name}
                            category={item.category}
                            distance={item.distance}
                            rating={item.rating}
                        />
                    )}
                    style={styles.flatList}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        flexDirection: 'column',
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 30,
        zIndex: 2,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        marginTop: 50,
    },
    headerText: {
        fontSize: 15,
        fontFamily: 'TT Chocolates Trial Bold',
        color: '#000000',
    },
    listItemLabel: {
        fontSize: 12,
        fontFamily: 'TT Chocolates Trial Medium',
        color: '#000000',
        textAlign: 'center',
    },
    flatList: {
        marginTop: 10, // Adjusted margin to provide more space
    },
    starIcon: {
        color: '#FFBF00',
        marginRight: 4,
    },
    rating: {
        fontSize: 11,
        color: '#969696',
        fontFamily: 'TT Chocolates Trial Regular',
        marginLeft: 4,
    },
});

export default SellerPage;
