import React from 'react';
import { StyleSheet, Text, View, Image, useWindowDimensions } from 'react-native';
import KButton from '../common/KButton';

interface OnboardingItemProps {
    item: {
        id: number;
        text: string;
        textRed: string;
        textGray: string;
        image: number;
        button: string;
    },
    onPress: () => void
}

const OnboardingItem: React.FC<OnboardingItemProps> = ({ item, onPress }) => {
    const { width } = useWindowDimensions();

    const indexOfTextRed = item.text.indexOf(item.textRed);

    const textBeforeRed = item.text.substring(0, indexOfTextRed);
    const textAfterRed = item.text.substring(indexOfTextRed + item.textRed.length);

    return (

        <View style={styles.container}>
            <Image source={item.image} style={[styles.image, { width, resizeMode: 'contain' }]} />
            <View>
                <Text style={styles.text}>
                    {textBeforeRed}
                    <Text style={styles.textRed}>{item.textRed}</Text>
                    {textAfterRed}
                </Text>
                <Text style={styles.textGray}>{item.textGray}</Text>
            </View>
            <KButton
                title={item.button}
                onPress={onPress}
                buttonStyle={{
                    marginBottom: 50,
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1, // Adjusted flex values
        marginTop: 30,
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    image: {
        marginTop: 80,
        alignItems: 'center',
    },

    text: {
        color: '#3B3B3B',
        fontFamily: 'TT Chocolates Trial Bold',
        fontSize: 28,
        fontWeight: '800',
        letterSpacing: 0,
        lineHeight: 38,
        textAlign: 'center',
    },
    textRed: {
        color: '#BF1E2E',
        fontFamily: 'TT Chocolates Trial Bold',
        fontSize: 28,
        fontWeight: '800',
        letterSpacing: 0,
        lineHeight: 38,
        textAlign: 'center',
    },
    textGray: {
        color: '#969696',
        fontFamily: 'TT Chocolates Trial Medium',
        fontSize: 18,
        fontWeight: '800',
        letterSpacing: 0,
        lineHeight: 29,
        textAlign: 'center',
    },
});

export default OnboardingItem;
