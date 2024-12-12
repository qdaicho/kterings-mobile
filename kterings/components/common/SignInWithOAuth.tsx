import React, { useCallback } from 'react';
import { Pressable, Text, StyleSheet, StyleProp, ViewStyle, TextStyle, Image } from 'react-native';
import * as WebBrowser from "expo-web-browser";
import { useOAuth } from "@clerk/clerk-expo";
import { useWarmUpBrowser } from "@hooks/useWarmUpBrowser";
import { router } from 'expo-router';

// Ensure auth session is handled
WebBrowser.maybeCompleteAuthSession();

interface SignInWithOAuthProps {
  title?: string;
  buttonStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const SignInWithOAuth: React.FC<SignInWithOAuthProps> = ({ 
  title = 'Sign in with Google', 
  buttonStyle, 
  textStyle 
}) => {
  // Warm up browser for better performance
  useWarmUpBrowser();

  const { startOAuthFlow } = useOAuth({ 
    strategy: "oauth_google",
    redirectUrl: 'https://clerk.kterings.com/v1/oauth_callback' // Add your redirect URL here
  });

  const handleSignIn = useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow();

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        router.replace("/homepage"); // Using replace instead of navigate to prevent going back
      }
    } catch (err) {
      console.error("OAuth Error:", err);
      // You might want to show an error message to the user
      // Alert.alert("Sign in failed", "Please try again later");
    }
  }, [startOAuthFlow]);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        buttonStyle,
        pressed && styles.pressedStyle,
      ]}
      onPress={handleSignIn}
    >
      <Image 
        source={require('@assets/images/google_logo.png')} 
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
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