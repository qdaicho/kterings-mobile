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
    try {
      const { createdSessionId, signIn, signUp, setActive } =
        await startOAuthFlow();
  
      if (createdSessionId) {
        if (setActive) {
          setActive({ session: createdSessionId });
          router.navigate("/");
        } else {
          console.error("setActive is not defined");
        }
      } else {
        // Use signIn or signUp for next steps such as MFA
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  }, []);

  return (
    <Pressable style={[styles.container, buttonStyle]} onPress={onPress}>
      {/* <GoogleLogo style={styles.logo} /> */}
      <Image source={require('@assets/images/google_logo.png')} style={styles.logo} />
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 38,
    width: 177,
    // borderRadius: 19,
    // backgroundColor: '#F8F9FA', // Change to Google's brand color
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  logo: {
    width: 32,
    height: 32,
    marginRight: 10,
  },
  text: {
    // color: '#4285F4', // Google's brand color
    fontFamily: 'TT Chocolates Trial Medium',
    fontSize: 14,
    fontWeight: '500',
    color: '#969696',
    letterSpacing: 0,
    // lineHeight: 38,
    textAlign: 'center',
  }
});

export default SignInWithOAuth;
