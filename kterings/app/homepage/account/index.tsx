import { View, Text, StyleSheet, Pressable, Image, Modal, Alert, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import BackButton from '@/components/common/BackButton';
import { router } from 'expo-router';
import { MaterialCommunityIcons, AntDesign, FontAwesome } from '@expo/vector-icons';
import KAddButton from '@/components/common/KAddButton';
import axios from 'axios'; // Import axios for making API requests
import { User } from '@components/types/User'
import * as SecureStore from 'expo-secure-store';

export default function Account() {
  const [modalVisible, setModalVisible] = useState(false);
  const [userDetails, setUserDetails] = useState<User | null>(null); // State to store user details



  async function save(key: string, value: string) {
    await SecureStore.setItemAsync(key, value);
  }

  async function getValueFor(key: string) {
    let result = await SecureStore.getItemAsync(key);
    // if (result) {
    //   alert("🔐 Here's your value 🔐 \n" + result);
    // } else {
    //   alert('No values stored under that key.');
    // }

  }

  // Function to fetch user details
  const fetchUserDetails = async () => {
    try {
      const token = await SecureStore.getItemAsync("token");

      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error(`Error: ${response.statusText}`);
        return;
      }

      const data = await response.json();
      setUserDetails(data.user);
      console.log(data.user);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  // useEffect to fetch data on component mount
  useEffect(() => {
    fetchUserDetails();
  }, []);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  return (
    <View style={{ backgroundColor: '#FFFFFF', flex: 1 }}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          toggleModal();
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <AntDesign name="close" size={24} color="#969696" style={{ position: 'absolute', right: 10, top: 10 }} onPress={toggleModal} />
            <Text style={{ fontFamily: 'TT Chocolates Trial Bold', fontSize: 16, marginBottom: 5, textAlign: 'center', width: 200 }}>Are you sure you want to delete your account?</Text>
            <Text style={styles.modalText}>
              Once deleted, you may not be able to retrieve your information and other data associated with your account.
            </Text>
            <View style={styles.separator} />
            <Pressable style={[styles.button, styles.buttonClose]} onPress={toggleModal}>
              <Text style={styles.textStyle}>Delete</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <BackButton onPress={() => router.navigate("/homepage/")} buttonStyle={styles.backButton} />

      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Personal Details</Text>
          <Pressable
            onPress={() => router.push('/editdetails/')}
            style={({ pressed }) => [styles.pressableBase, pressed && styles.pressablePressed]}
          >
            <Text style={styles.editText}>Edit Section</Text>
          </Pressable>
        </View>

        <View style={styles.imageContainer}>
          <Pressable
            // onPressIn={() => setPressed(true)}
            // onPressOut={() => setPressed(false)}
            style={({ pressed }) => [styles.imageWrapper, { backgroundColor: pressed ? '#EFEFF0' : 'transparent' }]}
          >
            <Image source={require('@assets/images/logo.png')} style={styles.image} />
          </Pressable>
          {userDetails && (
            <View style={styles.detailsContainer}>
              <Text style={styles.detailsText}>{userDetails.first_name} {userDetails.last_name}</Text>
              <Text style={styles.detailsText}>{userDetails.phone}</Text>
              <Text style={styles.emailText}>{userDetails.email}</Text>
              <Text style={styles.detailsText}>*************</Text>
              <Text style={styles.detailsText}>{userDetails.country}</Text>
            </View>
          )}
        </View>

        <ScrollView>
          <View style={[styles.header, { marginTop: 20 }]}>
            <Text style={styles.headerText}>Saved Addresses</Text>
          </View>
          <View style={styles.addressContainer}>
            <View>
              <Text style={styles.addressTitle}>Home</Text>
              <Text style={styles.addressText}>123 Kterings Lane, Kterings Drive, Windsor</Text>
            </View>
            <Pressable>
              <MaterialCommunityIcons name="pencil" size={24} color="#BF1E2E" />
            </Pressable>
          </View>
          <View style={{ marginTop: 20 }}>
            <KAddButton onPress={() => router.push('/addaddress/')} title='Add New Address' />
          </View>

          <View style={[styles.header, { marginTop: 20 }]}>
            <Text style={styles.headerText}>Payment Details</Text>
          </View>
          <View style={styles.paymentContainer}>
            <FontAwesome name="cc-stripe" size={35} color="#5433FF" />
            <Text style={styles.paymentText}>Stripe Connected</Text>
          </View>

          <View style={{ marginTop: 20 }}>
            <KAddButton onPress={() => console.log('hello')} title='Add New Card' />
          </View>
        </ScrollView>
      </View>

      <Pressable style={{ ...styles.button, marginTop: 20 }} onPress={toggleModal}>
        <Text style={styles.deleteButton}>Delete Account</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  pressableBase: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  pressablePressed: {
    backgroundColor: '#dddddd',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 30,
    zIndex: 2,
  },
  container: {
    flex: 1,
    marginHorizontal: 30,
    marginTop: 60,
    backgroundColor: '#FFFFFF',
  },
  header: {
    marginTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  headerText: {
    fontSize: 16,
    fontFamily: 'TT Chocolates Trial Bold',
    color: '#000000',
  },
  editText: {
    fontSize: 14,
    fontFamily: 'TT Chocolates Trial Medium',
    color: '#D10025',
  },
  imageContainer: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  imageWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
  },
  detailsContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  detailsText: {
    fontSize: 14,
    fontFamily: 'TT Chocolates Trial Medium',
    color: '#000000',
    marginTop: 10,
  },
  emailText: {
    fontSize: 14,
    fontFamily: 'TT Chocolates Trial Medium',
    color: '#ABABAB',
    marginTop: 10,
  },
  addressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    alignItems: 'center',
  },
  addressTitle: {
    fontSize: 13,
    fontFamily: 'TT Chocolates Trial Bold',
    color: '#000000',
  },
  addressText: {
    fontSize: 12,
    fontFamily: 'TT Chocolates Trial Medium',
    color: '#000000',
  },
  paymentContainer: {
    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'center',
  },
  paymentText: {
    fontSize: 13,
    fontFamily: 'TT Chocolates Trial Medium',
    color: '#969696',
    marginLeft: 20,
    fontStyle: 'italic',
  },
  deleteButton: {
    fontSize: 14,
    fontFamily: 'TT Chocolates Trial Medium',
    color: '#BF1E2E',
    marginTop: 20,
    marginBottom: 50,
    alignSelf: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  separator: {
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
  modalText: {
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'TT Chocolates Trial Medium',
    fontSize: 12,
    width: 300,
    padding: 10,
  },
});
