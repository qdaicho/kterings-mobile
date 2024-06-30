import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Pressable,
} from "react-native";
import React, { useRef, useState } from "react";
import KButton from "@/components/common/KButton";
import RBSheet from "react-native-raw-bottom-sheet";
import ForgotPassword from "@/components/screens/ForgotPassword";
import EnterCode from "@/components/screens/EnterCode";
import ResetPassword from "@/components/screens/ResetPassword";
import PasswordReset from "@/components/screens/PasswordReset";
import { Redirect, router } from "expo-router";
import { SignedIn, SignedOut, useSignIn } from "@clerk/clerk-expo";
import SignInWithOAuth from "@/components/common/SignInWithOAuth";
import Logo from "@assets/images/kterings_logo.svg";
import * as SecureStore from "expo-secure-store";
import { useUser } from "@clerk/clerk-react";

export default function Login() {
  const refRBSheet = useRef<RBSheet>(null);
  const [drawerHeight, setDrawerHeight] = useState(300);
  const [drawerIndex, setDrawerIndex] = useState(0);

  const { signIn, setActive, isLoaded } = useSignIn();
  const { isSignedIn, user } = useUser();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");

  const [code, setCode] = useState("");
  const [successfulCreation, setSuccessfulCreation] = useState(false);
  const [secondFactor, setSecondFactor] = useState(false);
  const [error, setError] = useState("");

  const [currentError, setCurrentError] = useState(""); // State for current error

  async function save(key: string, value: string) {
    await SecureStore.setItemAsync(key, value);
  }

  const onSignInPress = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignIn = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signIn.status === "complete") {
        const registerResponse = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            client_id: completeSignIn.id,
            email: emailAddress,
          }),
        });

        if (!registerResponse.ok) {
          throw new Error("Network response was not ok");
        } else {
          const registerData = await registerResponse.json();
          save("token", registerData.token);
          console.log("Token saved:", registerData.token);
          await setActive({ session: signIn.createdSessionId });
          router.navigate("/homepage");
        }
      }
    } catch (err: any) {
      console.log("Error:", err.message || err);

      if (err.errors && err.errors.length > 0) {
        console.log(err.errors[0].message);
        setCurrentError(err.errors[0].message);
      } else {
        setCurrentError(err.message);
      }

      refRBSheet.current && refRBSheet.current.open();
      setDrawerIndex(4);
      setDrawerHeight(200);
    }
  };

  async function send_password_reset_code() {
    console.log("emailAddress", emailAddress);

    await signIn
      ?.create({
        strategy: "reset_password_email_code",
        identifier: emailAddress,
      })
      .then(() => {
        setSuccessfulCreation(true);
        setError("");
      })
      .catch((err) => {
        console.error("error", err.errors[0].longMessage);
        setError(err.errors[0].longMessage);
      });
  }

  async function reset_password() {
    await signIn
      ?.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password,
      })
      .then((result) => {
        if (result.status === "needs_second_factor") {
          setSecondFactor(true);
          setError("");
        } else if (result.status === "complete") {
          setActive({ session: result.createdSessionId });
          setError("");
          router.navigate("/homepage");
        } else {
          console.log(result);
        }
      })
      .catch((err) => {
        console.error("error", err.errors[0].longMessage);
        setError(err.errors[0].longMessage);
      });
  }

  return (
    <>
      <SignedOut>
        <View style={styles.container}>
          <Logo style={styles.kteringsLogo} width={110} height={110} />
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Email/Username"
              placeholderTextColor="#B2B2B2"
              style={styles.input}
              autoCorrect={false}
              onChangeText={setEmailAddress}
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Password"
              placeholderTextColor="#B2B2B2"
              style={styles.input}
              secureTextEntry
              autoCorrect={false}
              textContentType="password"
              onChangeText={setPassword}
            />
          </View>

          <Pressable
            onPress={() => {
              refRBSheet.current && refRBSheet.current.open();
              setDrawerIndex(0);
              setDrawerHeight(300);
            }}
          >
            <Text style={styles.forgotPassword}>Forgot Password?</Text>
          </Pressable>

          <KButton
            title="Login"
            onPress={onSignInPress}
            buttonStyle={{ marginBottom: 20 }}
            textStyle={{ fontSize: 20 }}
          />

          <SignInWithOAuth
            title="Sign in with Google"
            buttonStyle={{ marginBottom: 50 }}
          />

          <Pressable onPress={() => router.navigate("/signup")}>
            <Text style={styles.createAccount}>Create an Account</Text>
          </Pressable>
          <Pressable>
            <Text style={styles.privacyNotice}>Privacy Policy</Text>
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
              wrapper: {
                backgroundColor: "transparent",
              },
              draggableIcon: {
                width: 100,
                backgroundColor: "#E9E9E9",
              },
            }}
          >
            {drawerIndex === 0 && (
              <ForgotPassword
                onPress={() => {
                  setDrawerHeight(300);
                  setDrawerIndex(1);
                  send_password_reset_code();
                }}
                setEmailAddress={setEmailAddress}
              />
            )}
            {drawerIndex === 1 && successfulCreation && (
              <EnterCode
                onPress={() => {
                  setDrawerHeight(430);
                  setDrawerIndex(2);
                }}
                setCode={setCode}
              />
            )}
            {drawerIndex === 2 && (
              <ResetPassword
                onPress={() => {
                  setDrawerHeight(200);
                  setDrawerIndex(3);
                  reset_password();
                }}
                setPassword={setPassword}
                password={password}
              />
            )}
            {drawerIndex === 3 && <PasswordReset />}
            {drawerIndex === 4 && 
              <Text style={{marginTop: 20, textAlign: 'center', fontSize: 15, color: '#BF1E2E', fontFamily: 'TT Chocolates Trial Bold'}}>
                {currentError}
              </Text>
            }
          </RBSheet>
        </View>
      </SignedOut>

      <SignedIn>
        <Redirect href="/homepage" />
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
  createAccount: {
    color: "#BF1E2E",
    fontFamily: "TT Chocolates Trial Medium",
    fontSize: 18,
    letterSpacing: 0,
    lineHeight: 38,
    textAlign: "center",
    marginBottom: 20,
  },
  privacyNotice: {
    color: "#969696",
    fontFamily: "TT Chocolates Trial Regular",
    fontSize: 15,
    fontWeight: "500",
    letterSpacing: 0,
    lineHeight: 29,
    textAlign: "center",
    marginBottom: 20,
  },
  forgotPassword: {
    color: "#BF1E2E",
    fontFamily: "TT Chocolates Trial Medium",
    fontSize: 15,
    letterSpacing: 0,
    textAlign: "center",
    marginBottom: 60,
  },
  kteringsLogo: {
    marginBottom: 30,
    marginTop: 90,
  },
  inputContainer: {
    height: 47,
    width: 262,
    borderRadius: 4,
    backgroundColor: "#EBEBEB",
    marginBottom: 30,
    justifyContent: "center",
  },
  input: {
    color: "#000000",
    fontFamily: "TT Chocolates Trial Medium",
    fontSize: 15,
    letterSpacing: 0,
    textAlign: "center",
  },
});
