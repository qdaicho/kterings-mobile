import { StyleSheet, Text, View, Image, TextInput, Pressable } from 'react-native'
import React, { useRef, useState } from 'react'
import KButton from '@/components/common/KButton';
import IconButton from '@/components/common/IconButton';
import RBSheet from "react-native-raw-bottom-sheet";
import ForgotPassword from '@/components/screens/ForgotPassword';
import EnterCode from '@/components/screens/EnterCode';
import ResetPassword from '@/components/screens/ResetPassword';
import PasswordReset from '@/components/screens/PasswordReset';
import { router } from 'expo-router';
import { Dimensions, PixelRatio } from 'react-native';


export default function Login() {
    const refRBSheet = useRef<RBSheet>(null);
    const [drawerHeight, setDrawerHeight] = useState(300);
    const [drawerIndex, setDrawerIndex] = useState(0);
    const { width, height } = Dimensions.get('window');
    return (
        <View style={styles.container}>
            {/* <Image source={require('../../assets/images/logo.png')} style={styles.kteringsLogo} /> */}
            <Text style={styles.createAnAccount}>Create an Account</Text>  
            <Text style={styles.joinToExploreKter}>Join to explore Kterings today!</Text> 
            <View style={styles.inputContainer}>
                <TextInput
                    placeholder='First Name'
                    placeholderTextColor='#B2B2B2' // Set placeholder text color
                    style={styles.input}
                />
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    placeholder='Last Name'
                    placeholderTextColor='#B2B2B2' // Set placeholder text color
                    style={styles.input}
                />
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    placeholder='Mobile'
                    placeholderTextColor='#B2B2B2' // Set placeholder text color
                    style={styles.input}
                />
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    placeholder='Email/Username'
                    placeholderTextColor='#B2B2B2' // Set placeholder text color
                    style={styles.input}
                />
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    placeholder='Password'
                    placeholderTextColor='#B2B2B2' // Set placeholder text color
                    style={styles.input}
                    secureTextEntry={true}
                    autoCorrect={false}
                    textContentType='password'
                />
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    placeholder='Confirm Password'
                    placeholderTextColor='#B2B2B2' // Set placeholder text color
                    style={styles.input}
                    secureTextEntry={true}
                    autoCorrect={false}
                    textContentType='password'
                />
            </View>

            <KButton
                title="Sign Up"
                onPress={() => console.log('Sign Up')}
                buttonStyle={{
                    marginBottom: 30,
                    // marginTop: 10
                }}
                textStyle={{
                    fontSize: 20,
                }}
            />

            <Pressable onPress={() => { router.navigate('/login') }}>
                <Text style={styles.haveAccount}>I Already Have an Account</Text>
            </Pressable>
            <IconButton
                title="Sign Up with Google"
                onPress={() => console.log('Sign Up with Google')}
                buttonStyle={{
                    marginBottom: 50,
                }}
            />
            <Pressable>
                <View style={[styles.becomeKtererContainer, { height: 67, width: width }]}>
                    <Text style={styles.becomeAKterer}>Become a Kterer</Text>
                </View>
            </Pressable>

        </View>
    )
}

// export default index;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-around',
        // justifyContent: 'center',
        alignItems: 'center',
        // marginBottom: 80
        // paddingLeft: 20,
        // paddingRight: 20,
    },
    createAnAccount: {
        color: '#000000',
        fontFamily: 'TT Chocolates Trial Medium',
        fontSize: 20,
        // fontWeight: '600',
        letterSpacing: 0,
        lineHeight: 38,
        textAlign: 'center',
        marginTop: 100
      },
      joinToExploreKter: {
        color: '#969696',
        fontFamily: 'TT Chocolates Trial Medium',
        fontSize: 18,
        fontWeight: '500',
        letterSpacing: 0,
        lineHeight: 20,
        textAlign: 'center',
        marginTop: 5,
        marginBottom: 40
      },
    haveAccount: {
        color: '#BF1E2E',
        fontFamily: "TT Chocolates Trial Medium",
        fontSize: 16,
        letterSpacing: 0,
        textAlign: 'center',
        marginBottom: 30,
    },
    kteringsLogo: {
        height: 145.5,
        width: 166.5,
        marginBottom: 50,
        marginTop: 60
    },
    inputContainer: {
        height: 47,
        width: 262,
        borderRadius: 4,
        backgroundColor: '#EBEBEB',
        marginBottom: 30,
        justifyContent: 'center',
    },
    input: {
        color: '#000000',
        fontFamily: "TT Chocolates Trial Medium",
        fontSize: 15,
        letterSpacing: 0,
        textAlign: 'center',
    },
    becomeKtererContainer: {
        // width: 'auto',
        // width: 391,
        justifyContent: 'center',
        backgroundColor: '#BF1E2E',
    },
    becomeAKterer: {
        color: '#FFFFFF',
        fontFamily: 'TT Chocolates Trial Bold',
        fontSize: 20,
        fontWeight: '800',
        letterSpacing: 0,
        lineHeight: 38,
        textAlign: 'center',
    },
});