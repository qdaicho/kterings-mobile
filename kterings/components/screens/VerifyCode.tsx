import React from 'react'
import { View, Text, StyleSheet, TextInput } from 'react-native'
import KButton from '../common/KButton';

interface VerifyCodeProps {
    onPress: () => void;
    setCode: (code: string) => void;
}

const VerifyCode: React.FC<VerifyCodeProps> = ({onPress, setCode}) => {
    return (
        <View style={{ flex: 1 }}>
            <View style={styles.container}>
                <Text style={styles.title}>Enter Sign Up Verification Code</Text>
                <Text style={styles.subtitle}>Please enter the 4-digit code we sent to the email you provided to proceed.</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder='Code'
                        placeholderTextColor='#B2B2B2' // Set placeholder text color
                        secureTextEntry={true}
                        style={styles.input}
                        onChangeText={(code) => setCode(code)}
                        keyboardType='number-pad'
                    />
                </View>

            </View>
            <KButton
                title="Verify Email"
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
        // marginLeft: 15,
        textAlign: 'center',
    },
});

export default VerifyCode;
