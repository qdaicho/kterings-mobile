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
import Logo from "@assets/images/kterings_logo.svg"

export default function Login() {
  const refRBSheet = useRef<RBSheet>(null);
  const [drawerHeight, setDrawerHeight] = useState(300);
  const [drawerIndex, setDrawerIndex] = useState(0);

  const { signIn, setActive, isLoaded } = useSignIn();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");

  // forgot password variables
  // const [emailAddress, setEmailAddress] = useState('');
  // const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [successfulCreation, setSuccessfulCreation] = useState(false);
  const [secondFactor, setSecondFactor] = useState(false);
  const [error, setError] = useState('');

  const onSignInPress = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignIn = await signIn.create({
        identifier: emailAddress,
        password,
      });
      // This is an important step,
      // This indicates the user is signed in
      await setActive({ session: completeSignIn.createdSessionId });
      console.log("Complete sign in:", signIn.status);
      if (signIn.status === "complete") {
        router.navigate("/homepage");
      }
    } catch (err: any) { console.error(err.errors); }
  };

  // Send the password reset code to the user's email
  async function send_password_reset_code() {
    console.log('emailAddress', emailAddress);
    // e.preventDefault();
    await signIn
      ?.create({
        strategy: 'reset_password_email_code',
        identifier: emailAddress,
      })
      .then(_ => {
        setSuccessfulCreation(true);
        setError('');
      })
      .catch(err => {
        console.error('error', err.errors[0].longMessage);
        setError(err.errors[0].longMessage);
      });
  }

  // Reset the user's password. 
  // Upon successful reset, the user will be 
  // signed in and redirected to the home page
  async function reset_password() {
    // e.preventDefault();
    await signIn
      ?.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code,
        password,
      })
      .then(result => {
        // Check if 2FA is required
        if (result.status === 'needs_second_factor') {
          setSecondFactor(true);
          setError('');
        } else if (result.status === 'complete') {
          // Set the active session to 
          // the newly created session (user is now signed in)
          setActive({ session: result.createdSessionId });
          setError('');
          router.navigate('/homepage');
        } else {
          console.log(result);
        }
      })
      .catch(err => {
        console.error('error', err.errors[0].longMessage)
        setError(err.errors[0].longMessage);
      });
  }

  return (
    <><SignedOut>
      <View style={styles.container}>
        {/* <Image
      source={require("../../assets/images/logo.png")}
      style={styles.kteringsLogo}
    /> */}
        <Logo style={styles.kteringsLogo} width={110} height={110} />
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Email/Username"
            placeholderTextColor="#B2B2B2" // Set placeholder text color
            style={styles.input}
            autoCorrect={false}
            onChangeText={(emailAddress) => setEmailAddress(emailAddress)} />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Password"
            placeholderTextColor="#B2B2B2" // Set placeholder text color
            style={styles.input}
            secureTextEntry={true}
            autoCorrect={false}
            textContentType="password"
            onChangeText={(password) => setPassword(password)} />
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
          buttonStyle={{
            marginBottom: 20,
          }}
          textStyle={{
            fontSize: 20,
          }} />

        <SignInWithOAuth
          title="Sign in with Google"
          buttonStyle={{
            marginBottom: 50,
          }} />
          
        <Pressable onPress={() => router.navigate("/signup")}>
          <Text style={styles.createAccount}>Create an Account</Text>
        </Pressable>
        <Pressable>
          <Text style={styles.privacyNotice}>Privacy Policy</Text>
        </Pressable>

        <RBSheet
          ref={refRBSheet}
          animationType="slide"
          closeOnDragDown={true}
          closeOnPressMask={true}
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
              setEmailAddress={setEmailAddress} />
          )}
          {drawerIndex === 1 && successfulCreation && (
            <EnterCode
              onPress={() => {
                setDrawerHeight(430);
                setDrawerIndex(2);
                // reset_password();
              }}
              setCode={setCode} />
          )}
          {drawerIndex === 2 && (
            <ResetPassword
              onPress={() => {
                setDrawerHeight(200);
                setDrawerIndex(3);
                reset_password();
              }}
              setPassword={setPassword}
              password={password} />
          )}
          {drawerIndex === 3 && <PasswordReset />}
        </RBSheet>
      </View>
    </SignedOut>

      <SignedIn>
        <Redirect href="/homepage" />
      </SignedIn>

    </>
  );
}

// export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-around",
    // justifyContent: 'center',
    alignItems: "center",
    // marginBottom: 80
    // paddingLeft: 20,
    // paddingRight: 20,
  },
  createAccount: {
    color: "#BF1E2E",
    fontFamily: "TT Chocolates Trial Medium",
    fontSize: 18,
    // fontWeight: '600',
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
    // height: 130,
    // width: 150,
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