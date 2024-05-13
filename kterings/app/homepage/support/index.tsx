import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import WebView from 'react-native-webview';
import BackButton from '@/components/common/BackButton';
import { router } from 'expo-router';

export default function Support() {
  return (
    <View style={{ flex: 1 }}>
      <BackButton
        onPress={() => router.back()}
        buttonStyle={styles.backButton}
      />
      <WebView
        source={{ uri: 'https://www.kterings.com/legal/terms-and-conditions' }}
        style={{ flex: 1 }}
        startInLoadingState={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    top: 50,
    left: 30,
    zIndex: 2,
  }
})