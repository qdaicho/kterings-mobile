import React from 'react';
import { View, Text, Image, StyleSheet, ImageSourcePropType, Pressable } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';

interface Props {
    image: ImageSourcePropType | string,
    name: string,
    category: string,
    distance: string,
    rating: number
}

const ProductLarge: React.FC<Props> = ({ image, name, category, distance, rating }) => {
    // Convert image prop to ImageSourcePropType if it's a string
    const imageSource = typeof image === 'string' ? { uri: image } : image;

    return (
        <Pressable onPress={() => {
            router.navigate({
                pathname: '/productscreen/',
                params: {
                    // @ts-ignore: Suppress the next line warning
                    image: image,
                    name: name,
                    category: category,
                    distance: distance,
                    rating: rating
                }
            });
        }}>
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Image
                        source={imageSource}
                        style={styles.image}
                    />
                </View>
                <View style={styles.cardContent}>
                    <View style={styles.infoContainer}>
                        <View>
                            <Text style={styles.title}>{name}</Text>
                            <Text style={styles.subtitle}>{category} • {distance}</Text>
                        </View>
                        <View style={styles.ratingContainer}>
                            <FontAwesome name="star" size={16} style={styles.starIcon} />
                            <Text style={styles.rating}>{rating}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    card: {
        width: "100%",
        marginBottom: 20,
        elevation: 5,
        shadowOffset: { width: 1, height: 1 },
        borderRadius: 10,
        shadowColor: 'black',
        shadowRadius: 10,
        borderColor: "#E9E9E9",
        borderWidth: 1,
        borderBottomWidth: 3,
    },
    cardHeader: {},
    image: {
        width: '100%',
        height: 150,
        resizeMode: 'cover',
        borderRadius: 10,
    },
    cardContent: {
        padding: 16,
    },
    infoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'TT Chocolates Trial Bold',
    },
    subtitle: {
        fontSize: 12,
        color: '#888',
        fontFamily: 'TT Chocolates Trial Regular',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    starIcon: {
        color: '#FFBF00',
    },
    rating: {
        fontSize: 12,
        fontWeight: 'bold',
        marginLeft: 4,
        fontFamily: 'TT Chocolates Trial Bold',
    },
});

export default ProductLarge;
