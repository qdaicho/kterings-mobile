import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
  Text,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import RBSheet from 'react-native-raw-bottom-sheet';
import { Ionicons, Entypo } from '@expo/vector-icons';
import {
  GooglePlacesAutocomplete,
  GooglePlacesAutocompleteRef,
} from 'react-native-google-places-autocomplete';
import BackButton from '@/components/common/BackButton';
import KButton from '@/components/common/KButton';
import * as SecureStore from 'expo-secure-store';
import 'react-native-get-random-values';

const GOOGLE_MAPS_API_KEY = 'AIzaSyAdWRPC1PJfTlDsrEeFZH6mrDZwieLdLpk';

interface RadioButtonProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
}

const RadioButton: React.FC<RadioButtonProps> = ({ label, isSelected, onPress }) => (
  <Pressable
    onPress={onPress}
    style={{
      flexDirection: 'row',
      alignItems: 'center',
    }}
  >
    <View
      style={[
        {
          height: 20,
          width: 20,
          borderRadius: 10,
          borderWidth: 2,
          borderColor: '#000000',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 10,
        },
        isSelected && { borderColor: '#BF1E2E' },
      ]}
    >
      {isSelected && (
        <View
          style={{
            height: 10,
            width: 10,
            borderRadius: 5,
            backgroundColor: '#BF1E2E',
          }}
        />
      )}
    </View>
    <Text
      style={{
        marginLeft: 10,
        fontFamily: 'TT Chocolates Trial Medium',
        fontSize: 12,
      }}
    >
      {label}
    </Text>
  </Pressable>
);

const AddAddress: React.FC = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [addressType, setAddressType] = useState<string>('');
  const refRBSheet = useRef<RBSheet>(null);
  const mapRef = useRef<MapView>(null);
  const autocompleteRef = useRef<GooglePlacesAutocompleteRef>(null);

  const addAddress = async () => {
    if (!selectedAddress || !addressType) {
      Alert.alert('Incomplete Information', 'Please select an address and enter an address type.');
      return;
    }

    try {
      const token = await SecureStore.getItemAsync('token');
      if (!token) throw new Error('Token not found');

      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/address`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          address: selectedAddress,
          type: addressType || 'Home',
        }),
      });

      if (!response.ok) throw new Error(response.statusText);

      await response.json();
      Alert.alert('Success', 'Address added successfully', [
        { text: 'OK', onPress: () => router.replace('/homepage/account') },
      ]);
    } catch (error) {
      console.error('Error adding address:', error);
      Alert.alert('Error', 'Failed to add address');
    }
  };

  useEffect(() => {
    const getLocationPermissions = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }
      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
    };
    getLocationPermissions();
    refRBSheet.current?.open();
  }, []);

  const handleRecenter = () => {
    if (location && mapRef.current) {
      mapRef.current.animateCamera({
        center: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
        zoom: 15,
      });
    }
  };

  const handleAddressSelect = (data: any, details: any) => {
    if (details && details.geometry) {
      const { lat, lng } = details.geometry.location;
      mapRef.current?.animateCamera({
        center: { latitude: lat, longitude: lng },
        zoom: 18,
      });
      setSelectedLocation({ latitude: lat, longitude: lng });
    }
    setSelectedAddress(data.description);
    setIsSearching(false);
  };

  const renderAddressView = () => (
    <>
      <Text
        style={{
          color: '#000000',
          fontFamily: 'TT Chocolates Trial Bold',
          fontSize: 16,
          fontWeight: '600',
          lineHeight: 29,
          textAlign: 'left',
        }}
      >
        {isSearching ? 'Search Address' : 'Add a new address'}
      </Text>

      <Text
        style={{
          color: '#969696',
          fontFamily: 'TT Chocolates Trial Medium',
          fontSize: 13,
          marginTop: 30,
        }}
      >
        Enter an Address
      </Text>

      <GooglePlacesAutocomplete
        ref={autocompleteRef}
        placeholder="Enter your address"
        onPress={handleAddressSelect}
        fetchDetails={true}
        query={{
          key: GOOGLE_MAPS_API_KEY,
          language: 'en',
          types: 'address',
        }}
        styles={{
          container: {
            flex: 0,
            width: '100%',
            marginTop: 20,
          },
          textInput: {
            height: 40,
            borderRadius: 10,
            backgroundColor: '#EBEBEB',
            color: '#969696',
            fontFamily: 'TT Chocolates Trial Medium',
            fontSize: 13,
            paddingLeft: 40,
          },
          listView: {
            borderWidth: 0,
            backgroundColor: '#F5F5F5',
            marginTop: 5,
            borderRadius: 10,
            maxHeight: 200,
          },
          row: {
            padding: 15,
            borderBottomWidth: 1,
            borderBottomColor: '#E0E0E0',
          },
          description: {
            fontSize: 14,
            color: '#333',
          },
        }}
        onFail={(error) => console.error(error)}
        keepResultsAfterBlur={true}
        isRowScrollable={true}
        enablePoweredByContainer={false}
        minLength={2}
        debounce={300}
        renderLeftButton={() => (
          <View
            style={{
              position: 'absolute',
              left: 10,
              top: 8,
              zIndex: 1,
            }}
          >
            <Ionicons name="search-outline" size={24} color="#969696" />
          </View>
        )}
        textInputProps={{
          onFocus: () => setIsSearching(true),
          onSubmitEditing: () => {
            // Do nothing on submit to keep results visible
          },
        }}
        listViewDisplayed={isSearching}
      />

      <Text
        style={{
          color: '#969696',
          fontFamily: 'TT Chocolates Trial Medium',
          fontSize: 13,
          marginTop: 30,
        }}
      >
        Select Address Type
      </Text>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <RadioButton
          onPress={() => setAddressType('Home')}
          label="Home"
          isSelected={addressType === 'Home'}
        />
        <RadioButton
          onPress={() => setAddressType('Work')}
          label="Work"
          isSelected={addressType === 'Work'}
        />
      </View>

      {selectedAddress && !isSearching && (
        <View
          style={{
            backgroundColor: '#F5F5F5',
            borderRadius: 10,
            padding: 15,
            marginTop: 20,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Entypo
            name="location-pin"
            size={24}
            color="#BF1E2E"
            style={{ marginRight: 10 }}
          />
          <Text
            style={{
              flex: 1,
              color: '#333',
              fontFamily: 'TT Chocolates Trial Medium',
              fontSize: 14,
            }}
          >
            {selectedAddress}
          </Text>
        </View>
      )}

      {!isSearching && (
        <KButton
          title="Add Address"
          onPress={() => {
            addAddress();
            refRBSheet.current?.close();
          }}
          buttonStyle={{
            marginTop: 50,
            alignSelf: 'center',
          }}
          textStyle={{
            fontSize: 16,
          }}
        />
      )}
    </>
  );

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
        setIsSearching(false);
      }}
    >
      <View
        style={{
          backgroundColor: '#FFFFFF',
          flex: 1,
        }}
      >
        <BackButton
          onPress={() => router.back()}
          // onPress={() => router.navigate('../homepage/account', {relativeToDirectory: true})}
          buttonStyle={{
            position: 'absolute',
            top: 50,
            left: 30,
            zIndex: 2,
          }}
        />

        <MapView
          ref={mapRef}
          style={{
            width: '100%',
            height: '100%',
          }}
          initialRegion={{
            latitude: location?.coords.latitude || 37.78825,
            longitude: location?.coords.longitude || -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {location && (
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              title="Your Location"
              pinColor="blue"
            />
          )}

          {selectedLocation && (
            <Marker
              coordinate={selectedLocation}
              title="Selected Location"
              pinColor="red"
            />
          )}
        </MapView>

        <Pressable
          style={{
            position: 'absolute',
            bottom: 350,
            right: 30,
            width: 50,
            height: 50,
            backgroundColor: '#FFFFFF',
            borderRadius: 25,
            alignItems: 'center',
            justifyContent: 'center',
            elevation: 5,
          }}
          onPress={handleRecenter}
        >
          <Entypo name="location" size={24} color="#BF1E2E" />
        </Pressable>

        <Pressable
          style={{
            position: 'absolute',
            bottom: 450,
            right: 30,
            width: 50,
            height: 50,
            backgroundColor: '#FFFFFF',
            borderRadius: 25,
            alignItems: 'center',
            justifyContent: 'center',
            elevation: 5,
          }}
          onPress={() => refRBSheet.current?.open()}
        >
          <Entypo name="home" size={24} color="#BF1E2E" />
        </Pressable>

        <RBSheet
          ref={refRBSheet}
          closeOnDragDown
          closeOnPressMask
          customStyles={{
            container: {
              borderWidth: 1,
              borderColor: '#E9E9E9',
              borderTopLeftRadius: 45,
              borderTopRightRadius: 45,
              height: '70%',
            },
            wrapper: {
              backgroundColor: 'transparent',
            },
            draggableIcon: {
              width: 100,
              backgroundColor: '#E9E9E9',
            },
          }}
          onClose={() => setIsSearching(false)}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <View
              style={{
                marginLeft: 40,
                marginRight: 40,
                justifyContent: 'space-between',
              }}
            >
              {renderAddressView()}
            </View>
          </KeyboardAvoidingView>
        </RBSheet>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default AddAddress;
