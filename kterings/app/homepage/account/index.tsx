import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Image, Modal, Alert, ScrollView, TextInput, Animated, GestureResponderEvent } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import BackButton from '@/components/common/BackButton';
import { router } from 'expo-router';
import KAddButton from '@/components/common/KAddButton';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';

interface Address {
  address: string;
  created_at: string;
  deleted_at: string | null;
  id: string;
  type: string;
  updated_at: string;
  user_id: number;
}

interface AddressResponse {
  home: Address;
  work: Address;
}

type User = {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  country: string;
  profile_image_url: string;
};

const Account: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [userDetails, setUserDetails] = useState<User | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    country: '',
  });
  const [image, setImage] = useState<string | null>(null);
  const [addresses, setAddresses] = useState<AddressResponse | null>(null);
  const [paymentMethods, setPaymentMethods] = useState([{ id: 'payment-1', label: 'Stripe Connected' }]);

  useEffect(() => {
    fetchUserDetails();
    fetchAddresses();
  }, []);

  const fetchUserDetails = async () => {
    try {
      const token = await SecureStore.getItemAsync("token");
      if (!token) throw new Error("Token not found");

      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error(response.statusText);

      const data = await response.json();
      setUserDetails(data.user);
      setForm({
        first_name: data.user.first_name,
        last_name: data.user.last_name,
        phone: data.user.phone,
        email: data.user.email,
        country: data.user.country,
      });
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const fetchAddresses = async () => {
    try {
      const token = await SecureStore.getItemAsync("token");
      if (!token) throw new Error("Token not found");

      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/address`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error(response.statusText);

      const data = await response.json();
      setAddresses(data);
      console.log(data);
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

  const updateUserDetails = async () => {
    try {
      const token = await SecureStore.getItemAsync("token");
      if (!token) throw new Error("Token not found");

      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/user`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error(response.statusText);

      const data = await response.json();
      setUserDetails(data.user);
      setEditMode(false);
      Alert.alert('Success', 'User details updated successfully');
    } catch (error) {
      console.error('Error updating user details:', error);
      Alert.alert('Error', 'Failed to update user details');
    }
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission to access camera roll is required!");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!pickerResult.canceled) {
      const uri = pickerResult.assets[0].uri;
      setImage(uri);
      uploadImage(uri);
    }
  };

  const uploadImage = async (uri: string) => {
    const formData = new FormData();
    formData.append('profile_image_url', {
      uri,
      name: 'profile.jpg',
      type: 'image/jpeg',
    } as any);

    try {
      const token = await SecureStore.getItemAsync("token");
      if (!token) throw new Error("Token not found");

      const response = await axios.put(`${process.env.EXPO_PUBLIC_API_URL}/user`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        fetchUserDetails();
        Alert.alert('Success', 'Profile image updated successfully');
      } else {
        throw new Error(response.statusText);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Error', 'Failed to upload image');
    }
  };

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const handleSelectAddress = async (address: Address) => {
    try {
      await SecureStore.setItemAsync('selectedAddress', JSON.stringify(address));
      Alert.alert('Success', 'Address selected successfully: ' + address.address);
    } catch (error) {
      console.error('Error saving address:', error);
      Alert.alert('Error', 'Failed to save address');
    }
  };

  const handleDeletePayment = (paymentId: string) => {
    setPaymentMethods((prev) => prev.filter(payment => payment.id !== paymentId));
  };

  const renderRightActions = (progress: Animated.AnimatedInterpolation<string | number>, dragX: Animated.AnimatedInterpolation<string | number>, onPress: ((event: GestureResponderEvent) => void) | null | undefined) => {
    const trans = dragX.interpolate({
      inputRange: [0, 50, 100, 101],
      outputRange: [0, 0, 0, 1],
    });
    return (
      <Pressable style={styles.editButton} onPress={onPress}>
        <Animated.View
          style={[
            styles.editButtonInner,
            {
              transform: [{ translateX: trans }],
            },
          ]}
        >
          <AntDesign name="edit" size={24} color="#FFF" />
        </Animated.View>
      </Pressable>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={toggleModal}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <AntDesign name="close" size={24} color="#969696" style={styles.modalCloseIcon} onPress={toggleModal} />
              <Text style={styles.modalHeader}>Are you sure you want to delete your account?</Text>
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

        <ScrollView style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Personal Details</Text>
            <Pressable
              onPress={() => setEditMode(true)}
              style={({ pressed }) => [styles.pressableBase, pressed && styles.pressablePressed]}
            >
              <Text style={styles.editText}>Edit Section</Text>
            </Pressable>
          </View>

          <View style={styles.imageContainer}>
            <Pressable
              style={({ pressed }) => [styles.imageWrapper, { backgroundColor: pressed ? '#EFEFF0' : 'transparent' }]}
              onPress={pickImage}
            >
              <Image source={{ uri: image || userDetails?.profile_image_url }} style={styles.image} />
            </Pressable>
            {userDetails && !editMode && (
              <View style={styles.detailsContainer}>
                <Text style={styles.detailsText}>{userDetails.first_name} {userDetails.last_name}</Text>
                <Text style={styles.detailsText}>{userDetails.phone}</Text>
                <Text style={styles.emailText}>{userDetails.email}</Text>
                <Text style={styles.detailsText}>*************</Text>
                <Text style={styles.detailsText}>{userDetails.country}</Text>
              </View>
            )}
            {editMode && (
              <View style={styles.detailsContainer}>
                {['first_name', 'last_name', 'phone', 'email', 'country'].map(field => (
                  <TextInput
                    key={field}
                    style={styles.input}
                    value={form[field as keyof typeof form]}
                    onChangeText={(text) => setForm({ ...form, [field]: text })}
                    placeholder={field.replace('_', ' ').toUpperCase()}
                  />
                ))}
                <Pressable style={styles.saveButton} onPress={updateUserDetails}>
                  <Text style={styles.saveButtonText}>Save</Text>
                </Pressable>
              </View>
            )}
          </View>

          <Section title="Saved Addresses">
            {addresses && (addresses.home || addresses.work) ? (
              <>
                {addresses.home && (
                  <View key={`address-${addresses.home.id}`} style={{ marginTop: 10 }}>
                    <Swipeable
                      key={`swipeable-address-${addresses.home.id}`}
                      renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, () => router.push('/addaddress/'))}
                    >
                      <Pressable onPress={() => handleSelectAddress(addresses.home)}>
                        <View style={styles.addressContainer}>
                          <View>
                            <Text style={styles.addressTitle}>{addresses.home.type}</Text>
                            <Text style={styles.addressText}>{addresses.home.address}</Text>
                          </View>
                        </View>
                      </Pressable>
                    </Swipeable>
                  </View>
                )}
                {addresses.work && (
                  <View key={`address-${addresses.work.id}`} style={{ marginTop: 10 }}>
                    <Swipeable
                      key={`swipeable-address-${addresses.work.id}`}
                      renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, () => router.push('/addaddress/'))}
                    >
                      <Pressable onPress={() => handleSelectAddress(addresses.work)}>
                        <View style={styles.addressContainer}>
                          <View>
                            <Text style={styles.addressTitle}>{addresses.work.type}</Text>
                            <Text style={styles.addressText}>{addresses.work.address}</Text>
                          </View>
                        </View>
                      </Pressable>
                    </Swipeable>
                  </View>
                )}
              </>
            ) : (
              <Text style={styles.noAddressesText}>No saved addresses found.</Text>
            )}
            <KAddButton onPress={() => router.push('/addaddress/')} title='Add New Address' />
          </Section>

          {/* <Section title="Payment Details">
            {paymentMethods.map(payment => (
              <View key={`payment-${payment.id}`} style={{ marginTop: 10 }}>
                <Swipeable
                  key={`swipeable-payment-${payment.id}`}
                  renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, () => handleDeletePayment(payment.id))}
                >
                  <View style={styles.paymentContainer}>
                    <FontAwesome name="cc-stripe" size={35} color="#5433FF" />
                    <Text style={styles.paymentText}>{payment.label}</Text>
                  </View>
                </Swipeable>
              </View>
            ))}
            <KAddButton onPress={() => console.log('Add New Card')} title='Add New Card' />
          </Section> */}

          <Pressable style={styles.deleteButtonContainer} onPress={toggleModal}>
            <Text style={styles.deleteButtonText}>Delete Account</Text>
          </Pressable>
        </ScrollView>
      </View>
    </GestureHandlerRootView>
  );
};

const Section: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
  <View style={{ marginTop: 20 }}>
    <View style={styles.header}>
      <Text style={styles.headerText}>{title}</Text>
    </View>
    {children}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    marginHorizontal: 30,
    marginTop: 60,
  },
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 50,
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
    alignItems: 'center',
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
    paddingLeft: 20,
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
    alignItems: 'center',
    paddingLeft: 20,
  },
  paymentText: {
    fontSize: 13,
    fontFamily: 'TT Chocolates Trial Medium',
    color: '#969696',
    marginLeft: 20,
    fontStyle: 'italic',
  },
  deleteButtonContainer: {
    marginTop: 200,
    alignSelf: 'center',
  },
  deleteButton: {
    backgroundColor: '#BF1E2E',
    justifyContent: 'center',
    alignItems: 'center',
    width: 75,
    // height: '100%',
    

  },
  deleteButtonInner: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 75,
    height: '100%',
    backgroundColor: '#BF1E2E',
  },
  deleteButtonText: {
    color: '#BF1E2E',
    fontFamily: 'TT Chocolates Trial Medium',
    fontSize: 16,
    paddingHorizontal: 10,
  },
  editButton: {
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    width: 75,
    height: '100%',
  },
  editButtonInner: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 75,
    height: '100%',
    backgroundColor: '#4CAF50',
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
  modalCloseIcon: {
    position: 'absolute',
    right: 10,
    top: 10,
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
    width: 300,
    padding: 10,
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
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    marginBottom: 10,
    fontSize: 14,
    fontFamily: 'TT Chocolates Trial Medium',
    width: '100%',
    padding: 5,
  },
  saveButton: {
    backgroundColor: '#BF1E2E',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontFamily: 'TT Chocolates Trial Medium',
    textAlign: 'center',
  },
  noAddressesText: {
    marginTop: 10,
    fontSize: 14,
    fontFamily: 'TT Chocolates Trial Medium',
    color: '#969696',
  },
});

export default Account;
