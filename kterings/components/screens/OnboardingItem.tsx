import React from 'react';
import { Dimensions, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import KButton from '../common/KButton';
import { SvgProps } from 'react-native-svg';

interface OnboardingItemProps {
    item: {
        id: number;
        text: string;
        textRed: string;
        textGray: string;
        ImageComponent: React.FC<SvgProps>;
        button: string;
    },
    onPress: () => void
}

const OnboardingItem: React.FC<OnboardingItemProps> = ({ item, onPress }) => {
    const { width } = useWindowDimensions();

    const indexOfTextRed = item.text.indexOf(item.textRed);

    const textBeforeRed = item.text.substring(0, indexOfTextRed);
    const textAfterRed = item.text.substring(indexOfTextRed + item.textRed.length);

    const ImageComponent = item.ImageComponent;

    return (
        <View style={styles.container}>
            <ImageComponent style={[styles.image, { width : width  }]} />
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
        flex: 1,
        marginTop: 30,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        width: Dimensions.get('window').width,
    },
    image: {
        marginTop: 80,
        // marginLeft: 20,
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
        // marginHorizontal: 20,
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
