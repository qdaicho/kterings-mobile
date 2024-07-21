import { View, Text, StyleSheet, FlatList, Image, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import BackButton from '@/components/common/BackButton';
import { router, useLocalSearchParams } from 'expo-router';
import DropDownPicker from 'react-native-dropdown-picker';
import ProductLarge from '@/components/common/ProductLarge';
import { Entypo, FontAwesome } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';

interface KtererResponse {
    isFavorite: boolean;
    kterer: {
        id: number;
        profile_image_url: string;
        name: string;
        ethnicity: string;
        experienceValue: string | null;
        rating: number;
        created_at: string;
    };
}

interface Food {
    id: string;
    name: string;
    ethnic_type: string;
    auto_delivery_time: number;
    rating: number;
    images: { image_url: string }[];
}

const SellerPage = () => {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(1.0);
    const [items] = useState([
        { label: "Ratings 1.0+", value: 1.0 },
        { label: "Ratings 2.0+", value: 2.0 },
        { label: "Ratings 3.0+", value: 3.0 },
        { label: "Ratings 4.0+", value: 4.0 },
    ]);
    const identifier = useLocalSearchParams();
    const [ktererProfile, setKtererProfile] = useState<KtererResponse | null>(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [prod, setProd] = useState<Food[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await SecureStore.getItemAsync('token');
                if (!token) throw new Error('No token found');

                const ktererResponse = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/kterer/${identifier.id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }).then((res) => res.json());
                setKtererProfile(ktererResponse);
                setIsFavorite(ktererResponse.isFavorite);

                const productsResponse = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/food/kterer/${identifier.id}`, {
                    method: 'GET',
                }).then((res) => res.json());
                const filteredProducts = productsResponse.data.filter((product: Food) => product.rating >= value);
                setProd(filteredProducts);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [value, identifier.id]);

    const handleFavoriteToggle = async () => {
        try {
            const token = await SecureStore.getItemAsync('token');
            if (!token) throw new Error('No token found');

            const url = `${process.env.EXPO_PUBLIC_API_URL}/favourite/kterer/${identifier.id}`;
            const method = isFavorite ? 'DELETE' : 'POST';
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error('Network response was not ok');

            setIsFavorite(!isFavorite);
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };

    const renderSellerRating = (rating = 5) => {
        const formattedRating = rating.toFixed(1);
        const wholeStars = Math.floor(rating);
        const stars = Array.from({ length: wholeStars }, (_, index) => (
            <FontAwesome key={index} name="star" size={12} style={styles.starIcon} />
        ));

        return (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {stars}
                <Text style={styles.rating}>{formattedRating}</Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <BackButton onPress={() => router.back()} buttonStyle={styles.backButton} />
            <View style={styles.content}>
                <View style={styles.headerContainer}>
                    <View style={styles.sellerInfo}>
                        <Image source={{ uri: ktererProfile?.kterer.profile_image_url }} style={styles.sellerImage} />
                        <View style={styles.sellerDetails}>
                            <Text style={styles.sellerTitle}>{ktererProfile?.kterer.name}</Text>
                            <Text style={styles.sellerSubTitle}>{ktererProfile?.kterer.ethnicity}</Text>
                            <Text style={styles.sellerSubTitle}>
                                {ktererProfile?.kterer.experienceValue ? `${ktererProfile?.kterer.experienceValue} years experience` : '? years experience'}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.sellerActions}>
                        <Pressable onPress={handleFavoriteToggle} style={styles.favoriteButton}>
                            <Entypo name={isFavorite ? "heart" : "heart-outlined"} size={24} color={isFavorite ? "red" : "gray"} />
                            <Text style={styles.favoriteText}>Favorite</Text>
                        </Pressable>
                        {renderSellerRating(ktererProfile?.kterer.rating || 0)}
                        <Text style={styles.memberSince}>
                            Member since {ktererProfile?.kterer.created_at ? new Date(ktererProfile.kterer.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Unknown'}
                        </Text>
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
                        setItems={() => { }}
                        placeholder='Ratings 4.0+'
                        showArrowIcon={false}
                        showTickIcon={false}
                        dropDownDirection="TOP"
                        style={styles.dropdown}
                        textStyle={styles.dropdownText}
                        containerStyle={styles.dropdownContainer}
                        dropDownContainerStyle={styles.dropdownContainerStyle}
                        listItemLabelStyle={styles.listItemLabel}
                        itemSeparator={true}
                        itemSeparatorStyle={styles.itemSeparator}
                    />
                </View>

                <FlatList
                    data={prod}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <ProductLarge image={item.images[0].image_url} name={item.name} category={item.ethnic_type} distance={`${item.auto_delivery_time} min away`} rating={item.rating} id={item.id} />
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
    content: {
        flex: 1,
        alignContent: 'center',
        marginHorizontal: 10,
        marginTop: 20,
    },
    headerContainer: {
        marginTop: 100,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    sellerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sellerImage: {
        width: 60,
        height: 60,
        borderRadius: 20,
    },
    sellerDetails: {
        marginLeft: 5,
        flexDirection: 'column',
    },
    sellerTitle: {
        fontFamily: 'TT Chocolates Trial Bold',
        fontSize: 18,
    },
    sellerSubTitle: {
        fontFamily: 'TT Chocolates Trial Regular',
        fontSize: 11,
        color: '#969696',
    },
    sellerActions: {
        flexDirection: 'column',
        alignItems: 'flex-end',
    },
    favoriteButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    favoriteText: {
        fontFamily: 'TT Chocolates Trial Regular',
        fontSize: 11,
        color: '#000000',
        marginLeft: 5,
    },
    memberSince: {
        fontFamily: 'TT Chocolates Trial Regular',
        fontSize: 11,
        color: '#969696',
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
    dropdown: {
        backgroundColor: '#BF1E2E',
        width: 100,
        borderColor: '#EEEEEE',
        borderRadius: 35,
        borderStartEndRadius: 35,
        borderStartStartRadius: 35,
        minHeight: 35,
    },
    dropdownText: {
        fontSize: 12,
        fontFamily: 'TT Chocolates Trial Medium',
        color: '#FFFFFF',
        textAlign: 'center',
    },
    dropdownContainer: {
        width: 'auto',
    },
    dropdownContainerStyle: {
        width: 100,
        borderColor: '#EEEEEE',
        borderRadius: 20,
        marginBottom: 10,
        borderEndEndRadius: 20,
        borderEndStartRadius: 20,
    },
    listItemLabel: {
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
    flatList: {
        marginTop: 10,
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
