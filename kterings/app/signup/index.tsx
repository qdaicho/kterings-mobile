import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Pressable,
    Dimensions,
} from "react-native";
import React, { useRef, useState } from "react";
import KButton from "@/components/common/KButton";
import RBSheet from "react-native-raw-bottom-sheet";
import { router } from "expo-router";
import { ClerkProvider, SignedIn, SignedOut, useSignUp } from "@clerk/clerk-expo";
import VerifyCode from "@/components/screens/VerifyCode";
import ErrorComponent from "@/components/screens/ErrorComponent";
import SignInWithOAuth from "@/components/common/SignInWithOAuth";
import BackButton from "@/components/common/BackButton";
import * as SecureStore from "expo-secure-store";
import { useUser } from "@clerk/clerk-react";

export default function Login() {
    const refRBSheet = useRef<RBSheet>(null);
    const [drawerHeight, setDrawerHeight] = useState(300);
    const [drawerIndex, setDrawerIndex] = useState(0);
    const { width } = Dimensions.get("window");

    const { isLoaded, signUp, setActive } = useSignUp();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [emailAddress, setEmailAddress] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [pendingVerification, setPendingVerification] = useState(false);
    const [code, setCode] = useState("");
    const [currentError, setCurrentError] = useState("");
    const { user } = useUser();

    const [passwordsMatch, setPasswordsMatch] = useState(true);

    async function save(key: string, value: string) {
        await SecureStore.setItemAsync(key, value);
    }

    const onSignUpPress = async () => {
        if (!isLoaded) {
            return;
        }

        if (password !== confirmPassword) {
            setCurrentError("Passwords do not match");
            refRBSheet.current && refRBSheet.current.open();
            setDrawerIndex(1);
            setDrawerHeight(200);
            return;
        }

        try {
            await signUp.create({
                firstName,
                lastName,
                emailAddress,
                password,
            });

            await signUp.prepareEmailAddressVerification({
                strategy: "email_code",
            });

            setPendingVerification(true);
        } catch (err: any) {
            console.log(err);
            setCurrentError(err.errors[0].message);
            refRBSheet.current && refRBSheet.current.open();
            setDrawerIndex(1);
            setDrawerHeight(200);
        }
    };

    const onPressVerify = async () => {
        if (!isLoaded) {
            return;
        }

        try {
            const completeSignUp = await signUp.attemptEmailAddressVerification({
                code,
            });

            if (completeSignUp.status === "complete") {
                await setActive({ session: completeSignUp.createdSessionId });
                const userId = completeSignUp.createdUserId;

                const registerResponse = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/register`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        client_id: userId,
                        first_name: completeSignUp.firstName,
                        last_name: completeSignUp.lastName,
                        user_type: "user",
                        email: completeSignUp.emailAddress,
                    }),
                });

                if (!registerResponse.ok) {
                    throw new Error("Network response was not ok");
                }

                const registerData = await registerResponse.json();
                save("token", registerData.token);
                router.navigate("/homepage");
            }
        } catch (err: any) {
            console.log(err.errors[0].message);
            setCurrentError(err.errors[0].message);
            refRBSheet.current && refRBSheet.current.open();
            setDrawerIndex(1);
            setDrawerHeight(200);
        }
    };

    const handlePasswordChange = (text: React.SetStateAction<string>) => {
        setPassword(text);
        setPasswordsMatch(text === confirmPassword);
    };

    const handleConfirmPasswordChange = (text: React.SetStateAction<string>) => {
        setConfirmPassword(text);
        setPasswordsMatch(text === password);
    };

    return (
        <>
            <SignedOut>
                <View style={styles.container}>
                    <BackButton onPress={() => router.back()} buttonStyle={styles.backButton} />
                    <Text style={styles.createAnAccount}>Create an Account</Text>
                    <Text style={styles.joinToExploreKter}>Join to explore Kterings today!</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            placeholder="First Name"
                            placeholderTextColor="#B2B2B2"
                            style={styles.input}
                            onChangeText={setFirstName}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <TextInput
                            placeholder="Last Name"
                            placeholderTextColor="#B2B2B2"
                            style={styles.input}
                            onChangeText={setLastName}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <TextInput
                            placeholder="Email/Username"
                            placeholderTextColor="#B2B2B2"
                            style={styles.input}
                            autoCorrect={false}
                            onChangeText={setEmailAddress}
                        />
                    </View>
                    <View style={[styles.inputContainer, !passwordsMatch && styles.errorContainer]}>
                        <TextInput
                            placeholder="Password"
                            placeholderTextColor="#B2B2B2"
                            style={styles.input}
                            secureTextEntry
                            autoCorrect={false}
                            textContentType="password"
                            onChangeText={handlePasswordChange}
                        />
                    </View>
                    <View style={[styles.inputContainer, !passwordsMatch && styles.errorContainer]}>
                        <TextInput
                            placeholder="Confirm Password"
                            placeholderTextColor="#B2B2B2"
                            style={styles.input}
                            secureTextEntry
                            autoCorrect={false}
                            textContentType="password"
                            onChangeText={handleConfirmPasswordChange}
                        />
                    </View>

                    <KButton
                        title="Sign Up"
                        onPress={onSignUpPress}
                        buttonStyle={{ marginBottom: 30 }}
                        textStyle={{ fontSize: 20 }}
                    />

                    <Pressable onPress={() => router.navigate("/login")}>
                        <Text style={styles.haveAccount}>I Already Have an Account</Text>
                    </Pressable>
                    <SignInWithOAuth title="Sign In with Google" buttonStyle={{ marginBottom: 50 }} />
                    <Pressable>
                        <View style={[styles.becomeKtererContainer, { height: 67, width }]}>
                            <Text style={styles.becomeAKterer}>Become a Kterer</Text>
                        </View>
                    </Pressable>

                    <RBSheet
                        ref={refRBSheet}
                        animationType="slide"
                        closeOnDragDown
                        closeOnPressMask
                        customStyles={{
                            container: {
                                borderWidth: 1,
                                borderColor: "#E9E9E9",
                                borderTopLeftRadius: 45,
                                borderTopRightRadius: 45,
                                height: drawerHeight,
                            },
                            wrapper: { backgroundColor: "transparent" },
                            draggableIcon: { width: 100, backgroundColor: "#E9E9E9" },
                        }}
                        onClose={() => setDrawerIndex(0)}
                    >
                        {drawerIndex === 0 && <VerifyCode onPress={onPressVerify} setCode={setCode} />}
                        {drawerIndex === 1 && <ErrorComponent subtitle={currentError} />}
                    </RBSheet>
                </View>
            </SignedOut>

            <SignedIn>
                <Text>Already signed in</Text>
            </SignedIn>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-around",
        alignItems: "center",
    },
    backButton: {
        position: "absolute",
        top: 40,
        left: 20,
    },
    createAnAccount: {
        color: "#000000",
        fontFamily: "TT Chocolates Trial Bold",
        fontSize: 20,
        letterSpacing: 0,
        lineHeight: 38,
        textAlign: "center",
        marginTop: 100,
    },
    joinToExploreKter: {
        color: "#969696",
        fontFamily: "TT Chocolates Trial Medium",
        fontSize: 18,
        fontWeight: "500",
        letterSpacing: 0,
        lineHeight: 20,
        textAlign: "center",
        marginTop: 5,
        marginBottom: 40,
    },
    haveAccount: {
        color: "#BF1E2E",
        fontFamily: "TT Chocolates Trial Medium",
        fontSize: 16,
        letterSpacing: 0,
        textAlign: "center",
        marginBottom: 30,
    },
    inputContainer: {
        height: 47,
        width: 262,
        borderRadius: 4,
        backgroundColor: "#EBEBEB",
        marginBottom: 30,
        justifyContent: "center",
    },
    errorContainer: {
        borderColor: "red",
        borderWidth: 1,
    },
    input: {
        color: "#000000",
        fontFamily: "TT Chocolates Trial Medium",
        fontSize: 15,
        letterSpacing: 0,
        textAlign: "center",
    },
    becomeKtererContainer: {
        justifyContent: "center",
        backgroundColor: "#BF1E2E",
    },
    becomeAKterer: {
        color: "#FFFFFF",
        fontFamily: "TT Chocolates Trial Bold",
        fontSize: 20,
        fontWeight: "800",
        letterSpacing: 0,
        lineHeight: 38,
        textAlign: "center",
    },
});
