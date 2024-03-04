import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import * as Font from 'expo-font';
import OnboardingComponent from '../components/screens/Onboarding';

const App: React.FC = () => {
    const [fontsLoaded, setFontsLoaded] = useState(false);

    useEffect(() => {
        async function loadFonts() {
            await Font.loadAsync({
                'TT Chocolates Trial Regular': require('../assets/fonts/TT Chocolates Trial Regular.otf'),
                'TT Chocolates Trial Bold': require('../assets/fonts/TT Chocolates Trial Bold.otf'),
            });
            setFontsLoaded(true);
        }
        
        loadFonts();
    }, []);

    if (!fontsLoaded) {
        return null; // You can show a loading indicator here if necessary
    }

    return (
        <View style={styles.container}>
            <OnboardingComponent />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default App;
