import {
  StyleSheet,
  Text,
  View,
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
import { SignedIn, SignedOut, useClerk, useSignIn, useUser } from "@clerk/clerk-expo";
import SignInWithOAuth from "@/components/common/SignInWithOAuth";
import Logo from "@assets/images/kterings_logo.svg";
import * as SecureStore from "expo-secure-store";
import { StatusBar } from "expo-status-bar";

const LoginLayout = () => {
  const refRBSheet = useRef<RBSheet>(null);
  const [drawerHeight, setDrawerHeight] = useState(300);
  const [drawerIndex, setDrawerIndex] = useState(0);

  const { signIn, setActive, isLoaded } = useSignIn();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [successfulCreation, setSuccessfulCreation] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { signOut } = useClerk();
  const { user } = useUser();

  const save = async (key: string, value: string) => {
    await SecureStore.setItemAsync(key, value);
  };

  // TypeScript-safe updated onSignInPress function
  const onSignInPress = async (): Promise<void> => {
    console.log("[onSignInPress] Attempting to sign in");

    if (!isLoaded || !signIn || !setActive) {
      console.log("[onSignInPress] Sign-in is not ready");
      setErrorMessage("Sign-in is not available at the moment. Please try again later.");
      refRBSheet.current?.open();
      setDrawerIndex(4);
      setDrawerHeight(200);
      return;
    }

    try {
      // Clear any existing sessions
      console.log("[onSignInPress] Signing out existing sessions");
      await signOut();

      // Start a new sign-in process
      const completeSignIn = await signIn.create({
        identifier: emailAddress,
        password,
      });
      console.log("[onSignInPress] signIn.create completed");

      if (signIn.status === "complete" && completeSignIn.createdSessionId) {
        console.log("[onSignInPress] Session is active, registering with server");

        // Use the backend `register` API to complete the session
        const registerUrl = `${process.env.EXPO_PUBLIC_API_URL}/register`;
        const registerResponse = await fetch(registerUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            client_id: completeSignIn.id,
            email: emailAddress,
          }),
        });

        if (!registerResponse.ok) {
          console.log("[onSignInPress] Registration failed with non-200 status");
          // print out the response in pretty json
          console.log(await registerResponse.text());
          throw new Error("Registration with server failed. Please try again.");
        }

        const registerData = await registerResponse.json();
        console.log("[onSignInPress] Registration success, saving token");

        // Save token for further authenticated requests
        await save("token", registerData.token);
        await save("sessionID", completeSignIn.createdSessionId);
        // Set the active Clerk session
        await setActive({ session: completeSignIn.createdSessionId });
        console.log("[onSignInPress] Session active, navigating to homepage");
        router.navigate("/homepage");
      } else {
        throw new Error("Failed to validate the session. Please try again.");
      }
    } catch (err: any) {
      console.log("[onSignInPress] Error:", err.message);

      const error =
        err.errors?.[0]?.message || err.message || "An error occurred during sign-in.";
      setErrorMessage(error);

      refRBSheet.current?.open();
      setDrawerIndex(4);
      setDrawerHeight(200);
    }
  };


  const sendPasswordResetCode = async () => {
    console.log("[sendPasswordResetCode] Attempting to send code");

    if (!signIn) {
      console.log("[sendPasswordResetCode] Sign-in not available");
      setErrorMessage("Reset password is not available at the moment. Please try again later.");
      refRBSheet.current?.open();
      setDrawerIndex(4);
      setDrawerHeight(200);
      return;
    }

    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: emailAddress,
      });
      console.log("[sendPasswordResetCode] Code sent successfully");
      setSuccessfulCreation(true);
      setErrorMessage("");

      // Advance to the EnterCode screen
      setDrawerIndex(1);
      setDrawerHeight(300); // Adjust height as needed
    } catch (err: any) {
      console.log("[sendPasswordResetCode] Error:", err.message);
      const error = err.errors?.[0]?.longMessage || err.message || "An error occurred.";
      setErrorMessage(error);
      refRBSheet.current?.open();
      setDrawerIndex(4);
      setDrawerHeight(200);
    }
  };


  const resetPassword = async () => {
    console.log("[resetPassword] Attempting password reset");

    if (!signIn || !setActive) {
      console.log("[resetPassword] Sign-in or setActive not available");
      setErrorMessage("Password reset is not available. Try again later.");
      refRBSheet.current?.open();
      setDrawerIndex(4);
      setDrawerHeight(200);
      return;
    }

    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password,
      });
      console.log("[resetPassword] attemptFirstFactor status:", result.status);

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        console.log("[resetPassword] Password reset complete. Navigating to homepage");

        // Close the RBSheet before navigating
        refRBSheet.current?.close();

        router.navigate("/homepage");
      } else {
        throw new Error("Unexpected result status");
      }
    } catch (err: any) {
      console.log("[resetPassword] Error:", err.message);
      const error = err.errors?.[0]?.longMessage || err.message || "An error occurred.";
      setErrorMessage(error);
      refRBSheet.current?.open();
      setDrawerIndex(4);
      setDrawerHeight(200);
    }
  };


  return (
    <>
      <StatusBar style="dark" />
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
              value={emailAddress}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Password"
              placeholderTextColor="#B2B2B2"
              style={styles.input}
              secureTextEntry
              onChangeText={setPassword}
              value={password}
            />
          </View>
          <Pressable
            onPress={() => {
              refRBSheet.current?.open();
              setDrawerIndex(0);
              setDrawerHeight(300);
              setErrorMessage("");
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
              },
              wrapper: {
                backgroundColor: "transparent",
              },
              draggableIcon: {
                width: 100,
                backgroundColor: "#E9E9E9",
              },
            }}
            height={drawerHeight}
          >
            <View>
              {drawerIndex === 0 && (
                <>
                  <ForgotPassword
                    onPress={sendPasswordResetCode}
                    setEmailAddress={setEmailAddress}
                  />
                  {errorMessage && (
                    <Text style={styles.rbsheetErrorText}>{errorMessage}</Text>
                  )}
                </>
              )}
              {drawerIndex === 1 && successfulCreation && (
                <EnterCode
                  onPress={() => {
                    setDrawerIndex(2);
                    setDrawerHeight(300); // Adjust height as needed
                  }}
                  setCode={setCode}
                />
              )}
              {drawerIndex === 2 && (
                <>
                  <ResetPassword
                    onPress={resetPassword}
                    setPassword={setPassword}
                    password={password}
                  />
                  {errorMessage && (
                    <Text style={styles.rbsheetErrorText}>{errorMessage}</Text>
                  )}
                </>
              )}
              {drawerIndex === 4 && (
                <Text style={styles.rbsheetErrorText}>{errorMessage}</Text>
              )}
            </View>
          </RBSheet>
        </View>
      </SignedOut>
      <SignedIn>
        <Redirect href="/homepage" />
      </SignedIn>
    </>
  );
};

export default LoginLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "white",
  },
  createAccount: {
    color: "#BF1E2E",
    fontFamily: "TT Chocolates Trial Medium",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
  forgotPassword: {
    color: "#BF1E2E",
    fontFamily: "TT Chocolates Trial Medium",
    fontSize: 15,
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
    textAlign: "center",
  },
  rbsheetErrorText: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 15,
    color: "#BF1E2E",
    fontFamily: "TT Chocolates Trial Bold",
  },
});
