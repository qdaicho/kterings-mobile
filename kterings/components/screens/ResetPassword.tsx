import React, { useState } from 'react'
import { View, Text, StyleSheet, TextInput } from 'react-native'
import KButton from '../common/KButton';

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

    const handleConfirmPasswordChange = (text: React.SetStateAction<string>) => {
        setConfirmPassword(text);
        setPasswordsMatch(text === password);
    };
    return (
        <View style={{ flex: 1 }}>
            <View style={styles.container}>
                <Text style={styles.title}>Reset Password</Text>
                <Text style={styles.subtitle}>Please enter a new password.</Text>
                <Text style={styles.newPasswordLabel}>New Password</Text>
                <View style={[styles.inputContainer, !passwordsMatch && styles.errorContainer]}>
                    <TextInput
                        placeholder='New Password'
                        placeholderTextColor='#B2B2B2' // Set placeholder text color
                        secureTextEntry={true}
                        autoCorrect={false}
                        textContentType='password'
                        style={styles.input}
                        onChangeText={(password) => handlePasswordChange(password)}
                    />
                </View>
                <Text style={styles.newPasswordLabel}>Confirm New Password</Text>
                <View style={[styles.inputContainer, !passwordsMatch && styles.errorContainer]}>
                    <TextInput
                        placeholder='New Password'
                        placeholderTextColor='#B2B2B2' // Set placeholder text color
                        secureTextEntry={true}
                        autoCorrect={false}
                        textContentType='password'
                        style={styles.input}
                        onChangeText={(password) => handleConfirmPasswordChange(password)}
                    />
                    {/* <EyeIconOrImage style={{
                        position: 'absolute',
                        right: 20,
                    }} /> */}
                </View>

            </View>
            <KButton
                title="Reset Password"
                onPress={onPress}
                buttonStyle={{
                    marginTop: 20,
                    alignSelf: 'center'
                }}
                textStyle={{
                    fontSize: 16,
                }}
            />
        </View>

    )
}


const styles = StyleSheet.create({
    container: {
        marginLeft: 40,
        marginRight: 40,
    },
    title: {
        color: '#000000',
        fontFamily: 'TT Chocolates Trial Bold',
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 0,
        lineHeight: 29,
        textAlign: 'left',
    },
    subtitle: {
        color: '#000000',
        fontFamily: 'TT Chocolates Trial Medium',
        fontSize: 13,
        fontWeight: '500',
        letterSpacing: 0,
        lineHeight: 21,
    },
    inputContainer: {
        marginTop: 15,
        height: 47,
        width: 321,
        borderRadius: 4,
        backgroundColor: '#EBEBEB',
        justifyContent: 'center'
    },
    errorContainer: {
        height: 47,
        width: 262,
        borderRadius: 4,
        backgroundColor: '#EBEBEB',
        marginBottom: 30,
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'red',
    },
    input: {
        color: '#000000',
        fontFamily: 'TT Chocolates Trial Medium',
        fontSize: 13,
        fontWeight: '500',
        letterSpacing: 0,
        textAlign: 'left',
        marginLeft: 15
    },
    newPasswordLabel: {
        color: '#000000',
        fontFamily: 'TT Chocolates Trial Bold',
        fontSize: 13,
        fontWeight: '600',
        letterSpacing: 0,
        marginTop: 20
    },
});

export default ResetPassword;
