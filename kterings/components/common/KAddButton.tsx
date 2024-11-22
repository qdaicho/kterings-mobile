import React, { useState } from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

type KAddButtonProps = {
    icon?: string;
    iconSize?: number;
    iconColor?: string;
    title?: string;
    onPress: () => void; // Function type for onPress
};

const KAddButton = ({
    iconSize = 24,
    iconColor = '#BF1E2E',
    title = 'Add New Address',
    onPress,
}: KAddButtonProps) => {
    const [isPressed, setIsPressed] = useState(false);

    return (
        <Pressable
            onPress={onPress} // External press handler
            onPressIn={() => setIsPressed(true)} // Set state to true when pressed
            onPressOut={() => setIsPressed(false)} // Reset state when released
        >
            <View
                style={[
                    styles.buttonContainer,
                    isPressed ? styles.pressed : {}, // Apply pressed style conditionally
                ]}
            >
                <AntDesign name='pluscircleo' size={iconSize} color={isPressed ? '#888' : iconColor} />
                <Text style={[styles.title, isPressed ? styles.titlePressed : {}]}> 
                    {title ? title : ''}
                </Text>
            </View>
        </Pressable>
    );
};

// Default styles for the component
const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        // padding: 10,
        // borderRadius: 5,
        marginTop: 20,
    },
    pressed: {
        backgroundColor: '#f0f0f0', // Light gray background when pressed
    },
    title: {
        fontSize: 13,
        fontFamily: 'TT Chocolates Trial Medium',
        color: '#000000',
        marginLeft: 20, // Space between the icon and the text
    },
    titlePressed: {
        color: '#888', // Change text color when pressed
    },
});

export default KAddButton;
