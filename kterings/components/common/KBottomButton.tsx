import React, { FC, useState } from 'react';
import { View, Text, Pressable, Dimensions, StyleSheet } from 'react-native';

// Create a reusable component

type OnPressProp = () => void;

const KBottomButton: FC<{ onPress: OnPressProp, title?: string, buttonStyle?: object, textStyle?: object }> = ({ onPress, title = 'Add to Cart', buttonStyle = {}, textStyle = {} }) => {
    // Local state to handle press events
    const [isPressed, setIsPressed] = useState(false);

    return (
        <Pressable
            onPress={onPress} // Custom press action passed as prop
            onPressIn={() => setIsPressed(true)} // Button is pressed
            onPressOut={() => setIsPressed(false)} // Button is released
        >
            <View
                style={[
                    {
                        backgroundColor: '#D00024',
                        height: 80,
                        width: Dimensions.get('window').width, // Make the button as wide as the screen
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: 10,
                    },
                    isPressed ? styles.buttonPressed : null, // Apply pressed style when needed
                    buttonStyle, // Additional styles from props
                ]}
            >
                <Text
                    style={[
                        {
                            color: '#FFFFFF',
                            fontFamily: 'TT Chocolates Trial Bold',
                            fontSize: 20,
                            fontWeight: '800',
                            textAlign: 'center',
                        },
                        isPressed ? styles.textPressed : null, // Apply pressed text style when needed
                        textStyle, // Additional text styles from props
                    ]}
                >
                    {title}
                </Text>
            </View>
        </Pressable>
    );
};

// Default styles
const styles = StyleSheet.create({
    buttonPressed: {
        backgroundColor: '#EFEFF0', // Background color when pressed
    },
    textPressed: {
        color: '#969696', // Text color when pressed
    },
});

export default KBottomButton;
