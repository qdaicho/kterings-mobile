import * as React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import * as Font from 'expo-font';
import OnboardingComponent from '../components/screens/Onboarding';
import Constants from 'expo-constants';
import { SignedIn, SignedOut } from '@clerk/clerk-expo';
import { Redirect } from "expo-router";
import { useEffect, useState } from 'react';
import { registerRootComponent } from 'expo';
import 'react-native-gesture-handler';
import { ThemeProvider } from '@components/ThemeContext';
import * as SecureStore from 'expo-secure-store';
import { useClerk, useSignIn } from '@clerk/clerk-expo';

// Main App component
function App() {
    const [fontsLoaded, setFontsLoaded] = useState(false);
    const { signIn, setActive, isLoaded } = useSignIn();


    useEffect(() => {
        // Load custom fonts
        async function loadFonts() {
            await Font.loadAsync({
                'TT Chocolates Trial Regular': require('../assets/fonts/TT Chocolates Trial Regular.otf'),
                'TT Chocolates Trial Bold': require('../assets/fonts/TT Chocolates Trial Bold.otf'),
                'TT Chocolates Trial Medium': require('../assets/fonts/TT Chocolates Trial Medium.otf'),
            });
            setFontsLoaded(true);
        }

        const initializeSession = async () => {
            const token = await SecureStore.getItemAsync("sessionID");

            if (setActive) {
                console.log(token);

                await setActive({ session: token });
            }
        };

        initializeSession();

        loadFonts();
    }, []);

    // Display nothing until fonts are loaded
    if (!fontsLoaded) {
        return null; // Optionally show a loading screen here
    }

    return (
        <ThemeProvider>
            <View style={styles.container}>
                {/* Display the onboarding component if the user is signed out */}
                <SignedOut>
                    <OnboardingComponent />
                </SignedOut>

                {/* Redirect to homepage if the user is signed in */}
                <SignedIn>
                    <Redirect href="/homepage" />
                </SignedIn>
            </View>
        </ThemeProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
});

// Register the root component
registerRootComponent(App);

export default App;
