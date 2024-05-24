import { View, Text, StyleSheet, TextInput, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import BackButton from '@/components/common/BackButton';
import { router } from 'expo-router';
import KBottomButton from '@/components/common/KBottomButton';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

export default function PersonalDetails() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [country, setCountry] = useState('');

  // Function to fetch user details on component mount
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = await SecureStore.getItemAsync("token");
        const response = await axios.get('http://192.168.2.122:8000/api/user', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const user = response.data.user;
        setFirstName(user.first_name);
        setLastName(user.last_name);
        setMobile(user.phone);
        setEmail(user.email);
        setCountry(user.country);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };
    fetchUserDetails();
  }, []);

  // Function to handle the PUT request
  const updateDetails = async () => {
    try {
      const token = await SecureStore.getItemAsync("token");
      const response = await axios.put('http://192.168.2.122:8000/api/user', {
        first_name: firstName,
        last_name: lastName,
        phone: mobile,
        email: email,
        country: country,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      Alert.alert('Success', 'User details updated successfully');
      console.log(response.data.user);
    } catch (error) {
      console.error('Error updating user details:', error);
      Alert.alert('Error', 'Failed to update user details');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.mainContainer}>
        <BackButton
          onPress={() => router.navigate("/homepage/account")}
          buttonStyle={styles.backButton}
        />
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Edit Personal Details</Text>
          </View>
          <View style={styles.formWrapper}>
            <View style={styles.formContainer}>
              <Text style={styles.formText}>First Name</Text>
              <TextInput
                style={styles.formInput}
                value={firstName}
                onChangeText={setFirstName}
              />
            </View>
            <View style={styles.formContainer}>
              <Text style={styles.formText}>Last Name</Text>
              <TextInput
                style={styles.formInput}
                value={lastName}
                onChangeText={setLastName}
              />
            </View>
            <View style={styles.formContainer}>
              <Text style={styles.formText}>Mobile</Text>
              <TextInput
                style={styles.formInput}
                value={mobile}
                onChangeText={setMobile}
                keyboardType="number-pad"
              />
            </View>
            <View style={styles.formContainer}>
              <Text style={styles.formText}>Email</Text>
              <TextInput
                style={styles.formInput}
                value={email}
                onChangeText={setEmail}
              />
            </View>
            {/* <View style={styles.formContainer}>
              <Text style={styles.formText}>Password</Text>
              <TextInput
                style={styles.formInput}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View> */}
            <View style={styles.formContainer}>
              <Text style={styles.formText}>Country</Text>
              <TextInput
                style={styles.formInput}
                value={country}
                onChangeText={setCountry}
              />
            </View>
          </View>
        </View>
        <KBottomButton
          title="Save Details"
          onPress={updateDetails}
          buttonStyle={{ marginTop: 30 }}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: '#FFFFFF',
    flex: 1,
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
    marginTop: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  headerText: {
    fontSize: 16,
    fontFamily: 'TT Chocolates Trial Bold', // Ensure this font family is available
    color: '#000000',
  },
  formWrapper: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  formContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
    gap: 20,
  },
  formText: {
    flex: 0.3,
    fontFamily: 'TT Chocolates Trial Medium',
    fontSize: 14,
    marginBottom: 5,
  },
  formInput: {
    flex: 0.7,
    backgroundColor: '#EBEBEB',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: 'auto',
  },
});
