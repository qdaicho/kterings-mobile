import React, { useState } from 'react';
import { StyleSheet, TextInput, View, Pressable, Text, TextInputProps, StyleProp, TextStyle, ViewStyle } from 'react-native';

interface PasswordInputProps extends TextInputProps {
    placeholder?: string; // Custom placeholder
    containerStyle?: StyleProp<ViewStyle>; // Style for the container
    inputStyle?: StyleProp<TextStyle>; // Style for the input
    toggleTextStyle?: StyleProp<TextStyle>; // Style for the toggle text
}

const PasswordInput: React.FC<PasswordInputProps> = ({
    placeholder = "Password",
    onChangeText,
    value,
    maxLength = 50,
    containerStyle,
    inputStyle,
    toggleTextStyle,
    ...props // Other TextInput props
}) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    return (
        <View style={[styles.inputContainer, containerStyle]}>
            <TextInput
                placeholder={placeholder}
                placeholderTextColor="#B2B2B2"
                style={[styles.input, inputStyle]}
                secureTextEntry={!isPasswordVisible}
                onChangeText={onChangeText}
                value={value}
                maxLength={maxLength}
                editable={true}
                keyboardType="default"
                selectionColor="#000"
                {...props} // Pass down any additional TextInput props
            />
            <Pressable
                style={styles.toggleButton}
                onPress={togglePasswordVisibility}
            >
                <Text style={[styles.toggleText, toggleTextStyle]}>
                    {isPasswordVisible ? 'Hide' : 'Show'}
                </Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        height: 47,
        width: 262,
        borderRadius: 4,
        backgroundColor: "#EBEBEB",
        marginBottom: 30,
        justifyContent: "center",
        flexDirection: "row",
    },
    input: {
        flex: 1,
        color: "#000000",
        fontFamily: "TT Chocolates Trial Medium",
        fontSize: 15,
        textAlign: "center",
        paddingHorizontal: 10,
        marginRight: 30,
        width: 'auto'
    },
    toggleButton: {
        position: "absolute",
        right: 10,
        top: 15,
        zIndex: 1,
    },
    toggleText: {
        color: "#BF1E2E",
        fontFamily: "TT Chocolates Trial Medium",
        fontSize: 10,
    },
});

export default PasswordInput;
