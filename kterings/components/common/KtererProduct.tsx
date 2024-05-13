import React from 'react';
import { View, Text, Image, StyleSheet, ImageSourcePropType, Pressable } from 'react-native';
import Svg, { Polygon } from 'react-native-svg';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';

interface Props {
    image: ImageSourcePropType,
    name: string,
    category: string,
    distance: string
    rating: number
}

const Product: React.FC<Props> = ({ image, name, category, distance, rating }) => {
    return (
        <View style={styles.container}>
            <View style={styles.buttonsContainer}>
                <Pressable style={styles.button} onPress={() => console.log('Trash button pressed')}>
                    <FontAwesome name="trash" size={14} color="#333" />
                </Pressable>
                <Pressable style={styles.button} onPress={() => router.navigate('/keditfood/')}>
                    <FontAwesome name="pencil" size={14} color="#333" />
                </Pressable>
            </View>
            <Pressable onPress={() => {
                router.navigate({
                    pathname: '/productscreen/', params: {
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
                            source={image}
                            style={styles.image}
                        />
                    </View>
                    <View style={styles.cardContent}>
                        <View style={styles.infoContainer}>
                            <View>
                                <Text style={styles.title}>{name}</Text>
                            </View>
                            <View style={styles.ratingContainer}>
                                <FontAwesome name="star" size={16} style={styles.starIcon} />
                                <Text style={styles.rating}>4.5</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
    },
    buttonsContainer: {
        position: 'absolute',
        top: 10,
        right: 20,
        flexDirection: 'row',
        zIndex: 1,
    },
    button: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 50,
        marginRight: 10,
        borderWidth: 0,
        borderColor: '#ccc',
    },
    card: {
        width: 160,
        marginRight: 20,
        elevation: 5,
        shadowOffset: { width: 1, height: 1 },
        borderRadius: 10,
        shadowColor: 'black',
        shadowRadius: 10,
        borderColor: "#E9E9E9",
        borderWidth: 1,
        borderBottomWidth: 3,
        marginBottom: 20,
    },
    cardHeader: {},
    image: {
        width: '100%',
        height: 100,
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
        fontSize: 10,
        fontWeight: 'bold',
        fontFamily: 'TT Chocolates Trial Bold',
    },
    subtitle: {
        fontSize: 10,
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
        fontSize: 8,
        fontWeight: 'bold',
        marginLeft: 4,
        fontFamily: 'TT Chocolates Trial Bold',
    },
});

export default Product;
