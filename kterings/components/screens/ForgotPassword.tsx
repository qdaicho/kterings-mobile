import React from 'react'
import { View, Text, StyleSheet, TextInput } from 'react-native'
import KButton from '../common/KButton';

interface ForgotPasswordProps {
    onPress: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onPress }) => {
    return (
        <View style={{ flex: 1 , }}>
            <View style={styles.container}>
                <Text style={styles.forgotPassword}>Forgot Password?</Text>
                <Text style={styles.pleaseEnterYourEm}>Please enter your email to receive a 4-digit verification code.</Text>
                <View style={styles.rectangleCopy}>
                    <TextInput
                        placeholder='Email/Username'
                        placeholderTextColor='#B2B2B2' // Set placeholder text color
                        style={styles.kteringsemailGmail}
                    />
                </View>

            </View>
            <KButton
                title="Continue"
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
        // flex: 1,
        // justifyContent: 'space-around',
        // alignItems: 'center',
        // marginBottom: 80
        // padding: 40,
        // paddingLeft: 40,
        // paddingRight: 20,
        marginLeft: 40,
    },
    forgotPassword: {
        color: '#000000',
        fontFamily: 'TT Chocolates Trial Bold',
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 0,
        lineHeight: 29,
        textAlign: 'left',
    },
    pleaseEnterYourEm: {
        color: '#000000',
        fontFamily: 'TT Chocolates Trial Medium',
        fontSize: 13,
        fontWeight: '500',
        letterSpacing: 0,
        lineHeight: 21,
    },
    rectangleCopy: {
        marginTop: 15,
        height: 47,
        width: 321,
        borderRadius: 4,
        backgroundColor: '#EBEBEB',

        justifyContent: 'center'

    },
    kteringsemailGmail: {
        color: '#000000',
        fontFamily: 'TT Chocolates Trial Medium',
        fontSize: 13,
        fontWeight: '500',
        letterSpacing: 0,
        marginLeft: 15,
        textAlign: 'left',
    },
});

export default ForgotPassword;