import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import BackButton from '@/components/common/BackButton';
import { router } from 'expo-router';
import { FlatList } from 'react-native-gesture-handler';
import NoNotifcations from "@assets/images/no_notifications.svg";
import * as SecureStore from 'expo-secure-store';

// Define the Notification interface
interface Notification {
  id: number;
  title: string;
  timestamp: string;
  message: string;
  read: boolean;
}

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Fetch notifications from the API
    fetchNotificationsFromAPI();
  }, []);

  const fetchNotificationsFromAPI = async () => {
    try {
      let token = await SecureStore.getItemAsync('token');

      const response = await fetch(`${API_URL}/notifications`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data: Notification[] = await response.json();
      setNotifications(data);

      console.log(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const handleNotificationClick = async (id: number) => {
    try {
      await fetch(`${API_URL}/notifications/mark_read/${id}`, {
        method: 'POST'
      });
      const updatedNotifications = notifications.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      );
      setNotifications(updatedNotifications);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
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
              <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginBottom: 10, backgroundColor: item.read ? '#f0f0f0' : '#ffffff' }}>
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
        <View style={{ flex: 1, alignItems: 'center', marginTop: 150 }}>
          <NoNotifcations />
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
