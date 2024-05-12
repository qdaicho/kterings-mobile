import React from 'react';
import { Pressable, Text, StyleSheet, StyleProp, ViewStyle, TextStyle, Image, View } from 'react-native';
// import GoogleLogo from '@/assets/images/GoogleLogo';
import * as WebBrowser from "expo-web-browser";
import { useOAuth, useSignIn } from "@clerk/clerk-expo";
import { useWarmUpBrowser } from "@hooks/useWarmUpBrowser";
import { router } from 'expo-router';

interface SignInWithOAuthProps {
  title: string;
  buttonStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

WebBrowser.maybeCompleteAuthSession();

const SignInWithOAuth: React.FC<SignInWithOAuthProps> = ({ title = 'Sign in with Google', buttonStyle, textStyle }) => {
  useWarmUpBrowser();

  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const onPress = React.useCallback(async () => {
    // router.navigate("/homepage/");

    try {
      const { createdSessionId, signIn, signUp, setActive } =
        await startOAuthFlow();

      if (createdSessionId) {
        if (setActive) {
          setActive({ session: createdSessionId });
          router.navigate("/homepage/");
        } else {
          throw new Error("setActive is not defined");
        }
      } else {
        // Use signIn or signUp for next steps such as MFA
      }
    } catch (err: any) {
      console.error("An error occurred during OAuth flow:", err.errors[0].longMessage);
      // Handle the error appropriately, e.g., display a user-friendly message
    }
  }, []);


  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        buttonStyle,
        pressed && styles.pressedStyle, // Apply the pressed style when pressed
      ]}
      onPress={onPress}
    >
      <Image source={require('@assets/images/google_logo.png')} style={styles.logo} />
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </Pressable>
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
    backgroundColor: '#EFEFF0', // Change to this color when pressed
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
