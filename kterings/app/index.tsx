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

// Main App component
function App() {
    const [fontsLoaded, setFontsLoaded] = useState(false);

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

        loadFonts();
    }, []);

    // Display nothing until fonts are loaded
    if (!fontsLoaded) {
        return null; // Optionally show a loading screen here
    }

    return (
        <View style={styles.container}>
            {/* Display the onboarding component if the user is signed out */}
            <SignedOut>
                <OnboardingComponent />
            </SignedOut>

            {/* Redirect to homepage if the user is signed in */}
            <SignedIn>
                <Redirect href="/homepage/" />
            </SignedIn>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

// Register the root component
registerRootComponent(App);

export default App;
