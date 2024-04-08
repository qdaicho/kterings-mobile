import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import BackButton from '@/components/common/BackButton';
import { router } from 'expo-router';
import { FlatList } from 'react-native-gesture-handler';
import NoNotifcations from "@assets/images/no_notifications.svg";
import ProductLarge from '@/components/common/ProductLarge';
import { products } from '@/assets/products';

// Sample JSON data for notifications
const sampleNotifications: any[] = [
  { id: 1, title: 'Valentine\'s Day', timestamp: '2 hours ago', message: 'We\'ve received your order for Valentine\'s Day', read: false },
  { id: 2, title: 'Delivery Advisory', timestamp: '1 day ago', message: 'Your delivery has been delayed. We apologize for the inconvenience.', read: false },
  { id: 3, title: 'Special Offer', timestamp: '3 days ago', message: 'Check out our special offer! Limited time only.', read: false },
  { id: 4, title: 'New Feature', timestamp: '1 week ago', message: 'We\'ve added a new feature to our app. Update now!', read: false },
  // Add more sample notifications as needed
];

export default function Notifications() {

  return (
    <View style={styles.container}>
      <BackButton onPress={() => router.back()} buttonStyle={styles.backButton} />
      <Text style={{ fontSize: 18, fontFamily: 'TT Chocolates Trial Bold', color: '#000000', marginTop: 120, marginBottom: 20 }}>Near You</Text>

      <FlatList
        data={products}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <ProductLarge image={item.image} name={item.name} category={item.category} distance={item.distance} rating={item.rating} />
        )}
        style={{ marginTop: 10 }}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 30
  },
  backButton: {
    position: 'absolute',
    top: 50,
  }
});
