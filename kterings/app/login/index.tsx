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


export default function Login() {
    const refRBSheet = useRef<RBSheet>(null);
    const [drawerHeight, setDrawerHeight] = useState(300);
    const [drawerIndex, setDrawerIndex] = useState(0);
    return (
        <View style={styles.container}>
            <Image source={require('../../assets/images/logo.png')} style={styles.kteringsLogo} />
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
            <Pressable onPress={() => {refRBSheet.current && refRBSheet.current.open(); setDrawerIndex(0); setDrawerHeight(300) }}>
                <Text style={styles.forgotPassword}>Forgot Password?</Text>
            </Pressable>
            <KButton
                title="Login"
                onPress={() => console.log('Login')}
                buttonStyle={{
                    marginBottom: 20,
                }}
                textStyle={{
                    fontSize: 20,
                }}
            />
            <IconButton
                title="Sign in with Google"
                onPress={() => console.log('Sign in with Google')}
                buttonStyle={{
                    marginBottom: 50,
                }}
            />
            <Pressable onPress={() => router.navigate('/signup')}>
                <Text style={styles.createAccount}>Create an Account</Text>
            </Pressable>
            <Pressable>
                <Text style={styles.privacyNotice}>Privacy Policy</Text>
            </Pressable>

            <RBSheet
                ref={refRBSheet}
                animationType='slide'
                closeOnDragDown={true}
                closeOnPressMask={true}
                customStyles={{
                    container: {
                        borderWidth: 1,
                        borderColor: "#E9E9E9",
                        borderTopLeftRadius: 45,
                        borderTopRightRadius: 45,
                        height: drawerHeight
                    },
                    wrapper: {
                        backgroundColor: "transparent",
                    },
                    draggableIcon: {
                        width: 100,
                        backgroundColor: "#E9E9E9"
                    },
                }}
            >

                {drawerIndex === 0 && (
                    <ForgotPassword onPress={() => { setDrawerHeight(300); setDrawerIndex(1); }} />
                )}
                {drawerIndex === 1 && (
                    <EnterCode onPress={() => { setDrawerHeight(430); setDrawerIndex(2); }} />
                )}
                {drawerIndex === 2 && (
                    <ResetPassword onPress={() => { setDrawerHeight(200); setDrawerIndex(3); }} />
                )}
                {drawerIndex === 3 && (
                    <PasswordReset />
                )}

            </RBSheet>

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
    createAccount: {
        color: '#BF1E2E',
        fontFamily: "TT Chocolates Trial Medium",
        fontSize: 18,
        // fontWeight: '600',
        letterSpacing: 0,
        lineHeight: 38,
        textAlign: 'center',
        marginBottom: 20
    },
    privacyNotice: {
        color: '#969696',
        fontFamily: "TT Chocolates Trial Regular",
        fontSize: 15,
        fontWeight: '500',
        letterSpacing: 0,
        lineHeight: 29,
        textAlign: 'center',
        marginBottom: 20
    },
    forgotPassword: {
        color: '#BF1E2E',
        fontFamily: "TT Chocolates Trial Medium",
        fontSize: 15,
        letterSpacing: 0,
        textAlign: 'center',
        marginBottom: 60
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
});