import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import BackButton from '@/components/common/BackButton';
import { router } from 'expo-router';
import { FlatList } from 'react-native-gesture-handler';
import NoNotifcations from "@assets/images/no_notifications.svg";
// Sample JSON data for notifications
const sampleNotifications: any[] = [
  { id: 1, title: 'Valentine\'s Day', timestamp: '2 hours ago', message: 'We\'ve received your order for Valentine\'s Day', read: false },
  { id: 2, title: 'Delivery Advisory', timestamp: '1 day ago', message: 'Your delivery has been delayed. We apologize for the inconvenience.', read: false },
  { id: 3, title: 'Special Offer', timestamp: '3 days ago', message: 'Check out our special offer! Limited time only.', read: false },
  { id: 4, title: 'New Feature', timestamp: '1 week ago', message: 'We\'ve added a new feature to our app. Update now!', read: false },
  // Add more sample notifications as needed
];

export default function Notifications() {
  const [notifications, setNotifications] = useState<{
    read: boolean; id: number; title: string; timestamp: string; message: string;
  }[]>([]);
  useEffect(() => {
    // Simulate loading notifications from JSON data initially
    setNotifications(sampleNotifications.map(notification => ({ ...notification, read: false })));
    // Later, you can replace this with an API call
    // fetchNotificationsFromAPI();
  }, []);

  // Function to handle notification click
  const handleNotificationClick = (id: number) => {
    const updatedNotifications = notifications.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    );
    setNotifications(updatedNotifications);
  };

  return (
    <View style={styles.container}>
      <BackButton onPress={() => router.navigate("/homepage/")} buttonStyle={styles.backButton} />
      <Text style={{ fontSize: 18, fontFamily: 'TT Chocolates Trial Bold', color: '#000000', marginTop: 120, marginBottom: 20 }}>Notifications</Text>

      {notifications.length > 0 ? (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleNotificationClick(item.id)} >
              <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginBottom: 10 }}>
                <View style={{ width: 3, height: 80, backgroundColor: item.read ? '#CCCCCC' : '#BF1E2E', marginRight: 10 }} />
                <View style={{ flex: 1, flexDirection: "column", justifyContent: 'flex-start' }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontSize: 14, fontFamily: 'TT Chocolates Trial Bold', color: '#000000' }}>{item.title}</Text>
                    <Text style={{ fontSize: 10, fontFamily: 'TT Chocolates Trial Medium', color: '#969696' }}>{item.timestamp}</Text>
                  </View>
                  <Text style={{ fontSize: 11, fontFamily: 'TT Chocolates Trial Medium', color: '#000000' }}>{item.message}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      ) : (
        <View style={{ flex: 1,alignItems: 'center', marginTop: 150 }}>
          <NoNotifcations style={{ }} />
          <Text style={{ fontSize: 18, fontFamily: 'TT Chocolates Trial Bold', color: '#000000', marginTop: 20 }}>No Notifications</Text>
        </View>
      )}
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
