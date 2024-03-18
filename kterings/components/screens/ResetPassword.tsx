import React from 'react'
import { View, Text, StyleSheet, TextInput } from 'react-native'
import KButton from '../common/KButton';

interface ResetPasswordProps {
    onPress: () => void;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({onPress}) => {
    return (
        <View style={{ flex: 1 }}>
            <View style={styles.container}>
                <Text style={styles.title}>Reset Password</Text>
                <Text style={styles.subtitle}>Please enter a new password.</Text>
                <Text style={styles.newPasswordLabel}>New Password</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder='New Password'
                        placeholderTextColor='#B2B2B2' // Set placeholder text color
                        secureTextEntry={true}
                        autoCorrect={false}
                        textContentType='password'
                        style={styles.input}
                    />
                </View>
                <Text style={styles.newPasswordLabel}>Confirm New Password</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder='New Password'
                        placeholderTextColor='#B2B2B2' // Set placeholder text color
                        secureTextEntry={true}
                        autoCorrect={false}
                        textContentType='password'
                        style={styles.input}
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
