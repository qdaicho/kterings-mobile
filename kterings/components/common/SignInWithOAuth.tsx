// SignInWithOAuth.tsx
import React, { useCallback, useEffect } from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  Image,
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { useOAuth } from '@clerk/clerk-expo';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import * as AuthSession from 'expo-auth-session';
import * as SecureStore from "expo-secure-store";
import { useUser } from '@clerk/clerk-expo'

// Hook to warm up the browser for improved UX
const useWarmUpBrowser = () => {
  useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

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
  textStyle,
}) => {
  useWarmUpBrowser();

  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });
  const router = useRouter();

  const save = async (key: string, value: string) => {
    await SecureStore.setItemAsync(key, value);
  };

  const handleSignIn = useCallback(async () => {
    try {
      console.log('Starting OAuth flow...');

      const redirectUri = AuthSession.makeRedirectUri({
        scheme: 'myapp',
        path: 'redirect',
      });
      // console.log('Generated redirectUri:', redirectUri);

      const { createdSessionId, setActive, signIn, signUp, authSessionResult } = await startOAuthFlow({
        redirectUrl: redirectUri,
      });

      // Log the entire result for comprehensive debugging
      console.log('OAuth flow result:', {
        createdSessionId,
        setActive,
        signIn,
        signUp,
        authSessionResult,
      });

      if (createdSessionId && setActive) {
        console.log('Session ID created:', createdSessionId);
        await save("sessionID", createdSessionId);
        

        // Register with the backend using OAuth data
        const registerResponse = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            client_id: createdSessionId,
            // Assuming these fields are available from the OAuth data
            first_name: signUp?.firstName,
            last_name: signUp?.lastName,
            user_type: "user",
            email: signUp?.emailAddress,
          }),
        });

        // print out the fields as json pretty
        console.log('Fields:', JSON.stringify({
          client_id: createdSessionId,
          first_name: signUp?.firstName,
          last_name: signUp?.lastName,
          user_type: "user",
          email: signUp?.emailAddress,
        }, null, 2));

        if (!registerResponse.ok) {
          throw new Error("Network response was not ok");
        }

        const registerData = await registerResponse.json();
        save("token", registerData.token);
        await setActive({ session: createdSessionId });
        router.push('/homepage');
      } else {
        console.warn('OAuth flow did not return a session ID or setActive is missing.');
      }
    } catch (err) {
      console.error('OAuth Error:', err);
      console.error('Error details (stringified):', JSON.stringify(err, null, 2));
      // Optional: Display an alert or notification to the user
      // ...existing code...
    }
  }, [startOAuthFlow, router]);



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
