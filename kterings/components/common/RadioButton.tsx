import React from 'react';
import { StyleSheet, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { View } from 'react-native-animatable';

// Constants for size and border width multipliers
const DEFAULT_SIZE_MULTIPLIER = 0.7;
const DEFAULT_OUTER_BORDER_WIDTH_MULTIPLIER = 0.2;

// Define the prop types with a TypeScript interface
interface RadioButtonProps {
    size?: number; // Optional prop with a default value
    innerColor?: string; // Optional prop with a default value
    outerColor?: string; // Optional prop with a default value
    isSelected?: boolean; // Optional prop to indicate selection state
    onPress?: () => void; // Optional prop for handling press events
    [key: string]: any; // Allow additional props
}

// TypeScript component definition
const RadioButton: React.FC<RadioButtonProps> = ({
    size = 16,
    innerColor = 'dodgerblue',
    outerColor = 'dodgerblue',
    isSelected = false,
    onPress,
    ...props
}) => {
    // Outer style based on the size and colors
    const outerStyle: StyleProp<ViewStyle> = {
        borderColor: outerColor,
        width: size + size * DEFAULT_SIZE_MULTIPLIER,
        height: size + size * DEFAULT_SIZE_MULTIPLIER,
        borderRadius: (size + size * DEFAULT_SIZE_MULTIPLIER) / 2,
        borderWidth: size * DEFAULT_OUTER_BORDER_WIDTH_MULTIPLIER,
    };

    // Inner style for the selected state
    const innerStyle: StyleProp<ViewStyle> = {
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: innerColor,
    };

    return (
        <TouchableOpacity style={[styles.radio, outerStyle]} onPress={onPress}>
            {isSelected && <View style={innerStyle} {...props} />}
        </TouchableOpacity>
    );
};

// Component styles
const styles = StyleSheet.create({
    radio: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    },
});

export default RadioButton;
