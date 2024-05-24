import React, { useState, useRef, useEffect } from 'react';
import { Pressable, Text, StyleSheet, StyleProp, ViewStyle, TextStyle, Image } from 'react-native';
import * as WebBrowser from "expo-web-browser";
import { useOAuth, useSignIn } from "@clerk/clerk-expo";
import { useWarmUpBrowser } from "@hooks/useWarmUpBrowser";
import { router } from 'expo-router';
import RBSheet from "react-native-raw-bottom-sheet";
import ErrorComponent from "@/components/screens/ErrorComponent";


interface SignInWithOAuthProps {
  title: string;
  buttonStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

WebBrowser.maybeCompleteAuthSession();

const SignInWithOAuth: React.FC<SignInWithOAuthProps> = ({ title = 'Sign in with Google', buttonStyle, textStyle }) => {
  useWarmUpBrowser();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  const refRBSheet = useRef<RBSheet>(null);
  const [drawerHeight, setDrawerHeight] = useState(300);
  const [drawerIndex, setDrawerIndex] = useState(0);
  const [currentError, setCurrentError] = useState("");
  

  const onPress = React.useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } = await startOAuthFlow();
      if (createdSessionId && setActive) {
        setActive({ session: createdSessionId });
      } else {
        throw new Error("Failed to set active session.");
      }
    } catch (err: any) {
      console.error("An error occurred during OAuth flow:", err);
      if (err.errors && err.errors.length > 0) {
        setCurrentError(err.errors[0].message);
      } else {
        setCurrentError(err.message);
      }
      refRBSheet.current && refRBSheet.current.open();
      setDrawerIndex(1);
      setDrawerHeight(200);
    }
  }, [startOAuthFlow]);

  return (
    <>
      <Pressable
        style={({ pressed }) => [
          styles.container,
          buttonStyle,
          pressed && styles.pressedStyle,
        ]}
        onPress={onPress}
      >
        <Image source={require('@assets/images/google_logo.png')} style={styles.logo} />
        <Text style={[styles.text, textStyle]}>{title}</Text>
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
        {drawerIndex === 1 && <ErrorComponent subtitle={currentError} />}
      </RBSheet>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 'auto',
    width: 'auto',
    padding: 10,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  pressedStyle: {
    backgroundColor: '#EFEFF0',
  },
  logo: {
    width: 32,
    height: 32,
    marginRight: 10,
  },
  text: {
    fontFamily: 'TT Chocolates Trial Medium',
    fontSize: 14,
    fontWeight: '500',
    color: '#969696',
    letterSpacing: 0,
    textAlign: 'center',
  },
});

export default SignInWithOAuth;
