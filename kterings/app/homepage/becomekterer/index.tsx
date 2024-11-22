import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet, Modal, Alert } from 'react-native';
import { DrawerActions } from '@react-navigation/native';
import { router, useNavigation } from 'expo-router';
import { AntDesign, Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { FlatList } from 'react-native';
import KtererProduct from '@/components/common/KtererProduct';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Food, User } from '@hooks/types';

export default function BecomeKterer() {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [yourPosts, setYourPosts] = useState<Food[]>([]);
  const [pastPosts, setPastPosts] = useState<Food[]>([]);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState<User | null>(null); // State to hold user details
  const [isKterer, setIsKterer] = useState<boolean>(false); // State to determine if the user is a Kterer

  // Fetch user details to check if they are a Kterer
  const fetchUserDetails = async () => {
    try {
      const token = await SecureStore.getItemAsync("token");
      if (!token) throw new Error("Token not found");

      const cachedUserDetails = await AsyncStorage.getItem('userDetails');

      if (cachedUserDetails) {
        const user: User = JSON.parse(cachedUserDetails);
        setUserDetails(user);
        console.log(user);
        setIsKterer(user.user_type === 'kterer'); // Check if the user type is Kterer
      } else {
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/user`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error(response.statusText);

        const data = await response.json();
        const user = data.user;

        setUserDetails(user);
        setIsKterer(user.user_type === 'kterer'); // Check if the user type is Kterer

        // Cache the fetched data
        await AsyncStorage.setItem('userDetails', JSON.stringify(user));
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  // Fetch the Kterer's food using the Kterer ID
  const fetchKtererFood = async (id: number) => {
    try {
      const accessToken = await SecureStore.getItemAsync("token");

      // Fetch current foods
      const currentFoodsResponse = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/food/kterer/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Fetch past foods
      const pastFoodsResponse = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/past_food/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setYourPosts(currentFoodsResponse.data.data as Food[]);
      setPastPosts(pastFoodsResponse.data.data as Food[]);
    } catch (error) {
      console.error("Error fetching Kterer food:", error);
      Alert.alert("Error", "Failed to load posts. Please try again.");
    }
  };

  // Use effect to fetch user details on component mount
  useEffect(() => {
    fetchUserDetails();
  }, []);

  // Fetch Kterer's food when the user is confirmed as a Kterer
  useEffect(() => {
    if (isKterer && userDetails?.kterer?.id) {
      fetchKtererFood(userDetails.kterer.id);
    }
  }, [isKterer, userDetails]);

  // Function to delete a post
  const handleDeletePost = async (postId: string) => {
    try {
      const accessToken = await SecureStore.getItemAsync("token");

      const response = await axios.delete(`${process.env.EXPO_PUBLIC_API_URL}/food/${postId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 200) {
        Alert.alert("Success", "Post deleted successfully.");
        setYourPosts(yourPosts.filter((post) => post.id !== postId));
      } else {
        Alert.alert("Error", "Failed to delete post.");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      Alert.alert("Error", "Failed to delete post. Please try again.");
    }
  };

  // Data structure for FlatList with separate sections
  const DATA = [
    {
      title: 'Your Posts',
      data: yourPosts,
      editable: true, // current posts are editable
    },
    {
      title: 'Past Posts',
      data: pastPosts,
      editable: false, // past posts are not editable
    },
  ];

  // Render a message if the user is not a Kterer
  if (!isKterer) {
    return (
      <View style={styles.centeredView}>
        <Text style={styles.notKtererText}>
          You are not registered as a Kterer. To register as a Kterer, please visit our website.
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <AntDesign
              name="close"
              size={24}
              color="#969696"
              style={{ position: 'absolute', right: 10, top: 10 }}
              onPress={() => setModalVisible(!modalVisible)}
            />
            <Text style={styles.modalHeader}>Are you sure you want to delete this item?</Text>
            <Text style={styles.modalText}>
              This action cannot be undone. This will permanently delete the post.
            </Text>
            <View style={styles.modalDivider}></View>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                if (selectedPostId) handleDeletePost(selectedPostId);
                setModalVisible(false);
              }}>
              <Text style={styles.textStyle}>Delete</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <View style={styles.headerContainer}>
        <Entypo name="menu" size={40} color="#BF1E2E" onPress={() => navigation.dispatch(DrawerActions.openDrawer())} />
        <Text style={styles.headerTitle}>Kterer Dashboard</Text>
        <Pressable onPress={() => router.navigate('/notifications')}>
          <MaterialCommunityIcons name="bell-outline" size={24} color="#BF1E2E" style={{ marginRight: 20 }} />
        </Pressable>
      </View>

      <View style={styles.actionButtonsContainer}>
        <Pressable
          onPress={() => router.navigate('/kearnings')}
          style={styles.earningsButton}>
          <FontAwesome6 name="hand-holding-dollar" size={24} color="#FFFFFF" />
          <Text style={styles.buttonText}>Earnings</Text>
        </Pressable>
        <Pressable
          onPress={() => router.navigate('/kpostfood')}
          style={styles.postFoodButton}>
          <Feather name="plus-circle" size={24} color="#FFFFFF" />
          <Text style={styles.buttonText}>Post Food</Text>
        </Pressable>
      </View>

      <FlatList
        data={DATA}
        keyExtractor={(item, index) => `${item.title}-${index}`}
        renderItem={({ item }) => (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>{item.title}</Text>
            <FlatList
              data={item.data}
              keyExtractor={(food) => food.id}
              renderItem={({ item: food }) => (
                <KtererProduct
                  name={food.name}
                  image={{ uri: food.images[0]?.image_url }}
                  category={food.ethnic_type}
                  distance={`${food.auto_delivery_time} minutes`}
                  rating={food.rating}
                  onTrashPress={
                    item.editable
                      ? () => {
                        setSelectedPostId(food.id);
                        setModalVisible(true);
                      }
                      : () => { } // Provide a no-op function instead of null
                  }
                  onEditPress={() => router.navigate({ pathname: '/keditfood', params: { id: food.id } })}
                />
              )}
              numColumns={2} // Render items in two columns
              showsVerticalScrollIndicator={false}
            />
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 70,
    marginHorizontal: 30,
  },
  headerTitle: {
    fontSize: 15,
    fontFamily: 'TT Chocolates Trial Bold',
    color: '#000000',
    marginLeft: 20,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  earningsButton: {
    backgroundColor: '#B81D2C',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  postFoodButton: {
    backgroundColor: '#000000',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 12,
    fontFamily: 'TT Chocolates Trial Bold',
    color: '#FFFFFF',
    marginLeft: 5,
  },
  sectionContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'TT Chocolates Trial Bold',
    color: '#000000',
    marginBottom: 10,
    marginTop: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notKtererText: {
    fontSize: 16,
    fontFamily: 'TT Chocolates Trial Medium',
    textAlign: 'center',
    padding: 20,
    color: '#BF1E2E',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'rgba(242,242,242,0.96)',
    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    fontFamily: 'TT Chocolates Trial Bold',
    fontSize: 16,
    marginBottom: 5,
    textAlign: 'center',
    width: 200,
  },
  modalText: {
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'TT Chocolates Trial Medium',
    fontSize: 12,
  },
  modalDivider: {
    height: 0.5,
    backgroundColor: '#969696',
    marginBottom: 10,
    width: 300,
  },
  button: {
    marginTop: 5,
  },
  buttonClose: {},
  textStyle: {
    color: '#2196F3',
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'TT Chocolates Trial Medium',
    fontSize: 16,
  },
});
