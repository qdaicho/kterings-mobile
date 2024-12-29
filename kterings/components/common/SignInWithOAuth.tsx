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
import { useClerk, useOAuth } from '@clerk/clerk-expo';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import * as AuthSession from 'expo-auth-session';
import * as SecureStore from "expo-secure-store";
import { useUser } from '@clerk/clerk-expo';

interface OAuthFlowResult {
  createdSessionId: string;
  setActive: (options: { session: string }) => Promise<void>;
  signIn?: {
    status?: string;
    emailAddress?: string;
    firstName?: string;
    lastName?: string;
  };
  signUp?: {
    status?: string;
    emailAddress?: string;
    firstName?: string;
    lastName?: string;
  };
  authSessionResult: {
    type: string;
    error?: string;
  };
}

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
  mode?: 'signup' | 'signin'; // New prop to determine mode
}

const SignInWithOAuth: React.FC<SignInWithOAuthProps> = ({
  title = 'Sign in with Google',
  buttonStyle,
  textStyle,
  mode = 'signup', // Default to 'signup'
}) => {
  useWarmUpBrowser();

  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });
  const { signOut } = useClerk();

  const router = useRouter();
  const user = useUser();

  const save = async (key: string, value: string) => {
    await SecureStore.setItemAsync(key, value);
  };

  const handleSignIn = useCallback(async () => {
    try {
      console.log('Starting OAuth flow and signing out.');
      await signOut();
  
      const redirectUri = AuthSession.makeRedirectUri({
        scheme: 'myapp',
        path: 'redirect',
      });
  
      const { createdSessionId, setActive, signIn, signUp, authSessionResult } =
        (await startOAuthFlow({ redirectUrl: redirectUri })) as OAuthFlowResult;
  
      console.log('OAuth flow result:', JSON.stringify({
        createdSessionId,
        setActive,
        signIn,
        signUp,
        authSessionResult,
      }, null, 2));
  
      if (!createdSessionId || !setActive) {
        throw new Error('OAuth flow did not return a valid session ID or setActive function.');
      }
  
      await save('sessionID', createdSessionId);
  
      if (signUp?.status === 'complete') {
        // Handle Sign-Up Flow
        console.log('Detected Sign-Up flow');
        const registerResponse = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            client_id: createdSessionId,
            first_name: signUp.firstName,
            last_name: signUp.lastName,
            user_type: 'user',
            email: signUp.emailAddress,
          }),
        });
  
        if (!registerResponse.ok) {
          const errorData = await registerResponse.text();
          throw new Error(`Registration failed: ${errorData}`);
        }
  
        const registerData = await registerResponse.json();
        await save('token', registerData.token);
        await setActive({ session: createdSessionId });
        router.replace('/homepage');
  
      } else if (signIn?.status === 'complete') {
        // Handle Sign-In Flow
        console.log('Detected Sign-In flow');
        const loginResponse = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            client_id: createdSessionId,
            email: signIn.emailAddress,
          }),
        });
  
        if (!loginResponse.ok) {
          const errorData = await loginResponse.text();
          throw new Error(`Login failed: ${errorData}`);
        }
  
        const loginData = await loginResponse.json();
        await save('token', loginData.token);
        console.log('Token:', loginData.token);
        await setActive({ session: createdSessionId });
        router.replace('/homepage');
  
      } else {
        console.warn('No valid signIn or signUp status returned from OAuth flow.');
      }
  
    } catch (err) {
      console.error('OAuth Error:', err);
      alert('An error occurred during authentication. Please try again.');
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
