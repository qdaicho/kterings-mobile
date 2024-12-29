import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import KButton from '../common/KButton';
import PasswordInput from '../common/PasswordInput';

interface ResetPasswordProps {
    onPress: () => void;
    setPassword: (password: string) => void;
    password: string;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({ onPress, setPassword, password }) => {
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordsMatch, setPasswordsMatch] = useState(true);

    const handlePasswordChange = (text: string) => {
        setPassword(text);
        setPasswordsMatch(text === confirmPassword);
    };

    const handleConfirmPasswordChange = (text: string) => {
        setConfirmPassword(text);
        setPasswordsMatch(text === password);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>Please enter a new password.</Text>

            <PasswordInput
                onChangeText={handlePasswordChange}
                value={password}
                placeholder="New Password"
                containerStyle={[
                    styles.inputContainer,
                    !passwordsMatch && styles.errorContainer,
                ]}
                inputStyle={styles.input}
            />

            <PasswordInput
                onChangeText={handleConfirmPasswordChange}
                value={confirmPassword}
                placeholder="Confirm New Password"
                containerStyle={[
                    styles.inputContainer,
                    !passwordsMatch && styles.errorContainer,
                ]}
                inputStyle={styles.input}
            />

            {!passwordsMatch && (
                <Text style={styles.errorText}>Passwords do not match</Text>
            )}

            <KButton
                title="Reset Password"
                onPress={onPress}
                buttonStyle={styles.button}
                textStyle={styles.buttonText}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-evenly', // Evenly distributes items vertically
        paddingHorizontal: 20,
        backgroundColor: '#ffffff',

    },
    title: {
        color: '#000000',
        fontFamily: 'TT Chocolates Trial Bold',
        fontSize: 18,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitle: {
        color: '#6F6F6F',
        fontFamily: 'TT Chocolates Trial Medium',
        fontSize: 14,
        textAlign: 'center',
    },
    inputContainer: {
        height: 47,
        borderRadius: 4,
        backgroundColor: '#EBEBEB',
        justifyContent: 'center',
        paddingHorizontal: 10,
        marginVertical: 10, // Adds space between input fields
        alignSelf: 'center',
    },
    errorContainer: {
        borderColor: 'red',
        borderWidth: 1,
    },
    input: {
        color: '#000000',
        fontFamily: 'TT Chocolates Trial Medium',
        fontSize: 14,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        fontFamily: 'TT Chocolates Trial Medium',
        textAlign: 'center',
    },
    button: {
        alignSelf: 'center',
        backgroundColor: '#BF1E2E',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontFamily: 'TT Chocolates Trial Bold',
        fontSize: 16,
    },
});

export default ResetPassword;
