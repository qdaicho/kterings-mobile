import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
  Text,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import MapView, { Marker, MapViewProps } from 'react-native-maps';
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

const GOOGLE_MAPS_API_KEY = 'AIzaSyAdWRPC1PJfTlDsrEeFZH6mrDZwieLdLpk';

interface RadioButtonProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
}

const RadioButton: React.FC<RadioButtonProps> = ({ label, isSelected, onPress }) => (
  <Pressable onPress={onPress} style={styles.radioButton}>
    <View style={[styles.radioButtonOuter, isSelected && styles.radioButtonOuterSelected]}>
      {isSelected && <View style={styles.radioButtonInner} />}
    </View>
    <Text style={styles.radioButtonText}>{label}</Text>
  </Pressable>
);

const AddAddress: React.FC = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<{ latitude: number; longitude: number } | null>(null);
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
      const token = await SecureStore.getItemAsync("token");
      if (!token) throw new Error("Token not found");

      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/address`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          address: selectedAddress,
          type: addressType || 'Home',
        }),
      });

      if (!response.ok) throw new Error(response.statusText);

      const data = await response.json();
      Alert.alert('Success', 'Address added successfully', [
        { text: 'OK', onPress: () => router.push('/homepage/account') }
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
      <Text style={styles.headerText}>
        {isSearching ? 'Search Address' : 'Add a new address'}
      </Text>
      <Text style={styles.typeText}>Enter an Address</Text>
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
          container: styles.autocompleteContainer,
          textInput: styles.autocompleteInput,
          listView: styles.autocompleteList,
          row: styles.autocompleteRow,
          description: styles.autocompleteDescription,
        }}
        onFail={(error) => console.error(error)}
        keepResultsAfterBlur={true}
        isRowScrollable={true}
        enablePoweredByContainer={false}
        minLength={2}
        debounce={300}
        renderLeftButton={() => (
          <View style={styles.searchIconContainer}>
            <Ionicons name="search-outline" size={24} color="#969696" />
          </View>
        )}
        textInputProps={{
          onFocus: () => setIsSearching(true),
          onSubmitEditing: () => { }, // Do nothing on submit to keep results visible
        }}
        listViewDisplayed={isSearching}
      />
      <Text style={styles.typeText}>Select Address Type</Text>
      <View style={styles.radioContainer}>
        <RadioButton
          onPress={() => setAddressType('Home')}
          label='Home'
          isSelected={addressType === 'Home'}
        />
        <RadioButton
          onPress={() => setAddressType('Work')}
          label='Work'
          isSelected={addressType === 'Work'}
        />
      </View>
      {selectedAddress && !isSearching && (
        <View style={styles.selectedAddressCard}>
          <Entypo name="location-pin" size={24} color="#BF1E2E" style={styles.locationIcon} />
          <Text style={styles.selectedAddressText}>{selectedAddress}</Text>
        </View>
      )}
      {!isSearching && (
        <KButton
          title="Add Address"
          onPress={() => {
            addAddress();
            refRBSheet.current?.close();
          }}
          buttonStyle={styles.addButton}
          textStyle={styles.addButtonText}
        />
      )}
    </>
  );

  return (
    <TouchableWithoutFeedback onPress={() => {
      Keyboard.dismiss();
      setIsSearching(false);
    }}>
      <View style={styles.mainContainer}>
        <BackButton onPress={() => router.push('/homepage/account')} buttonStyle={styles.backButton} />
        <MapView
          ref={mapRef}
          style={styles.map}
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
        <Pressable style={styles.recenterButton} onPress={handleRecenter}>
          <Entypo name="location" size={24} color="#BF1E2E" />
        </Pressable>
        <Pressable style={styles.addressButton} onPress={() => refRBSheet.current?.open()}>
          <Entypo name="home" size={24} color="#BF1E2E" />
        </Pressable>
        <RBSheet
          ref={refRBSheet}
          closeOnDragDown
          closeOnPressMask
          customStyles={{
            container: styles.sheetContainer,
            wrapper: styles.sheetWrapper,
            draggableIcon: styles.draggableIcon,
          }}
          onClose={() => setIsSearching(false)}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.sheetContent}
          >
            <View style={styles.sheetInnerContent}>
              {renderAddressView()}
            </View>
          </KeyboardAvoidingView>
        </RBSheet>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '100%',
  },
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
  recenterButton: {
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
  },
  addressButton: {
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
  },
  addButton: {
    marginTop: 50,
    alignSelf: 'center',
  },
  addButtonText: {
    fontSize: 16,
  },
  headerText: {
    color: '#000000',
    fontFamily: 'TT Chocolates Trial Bold',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 29,
    textAlign: 'left',
  },
  typeText: {
    color: '#969696',
    fontFamily: 'TT Chocolates Trial Medium',
    fontSize: 13,
    marginTop: 30,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioButtonOuter: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioButtonOuterSelected: {
    borderColor: '#BF1E2E',
  },
  radioButtonInner: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#BF1E2E',
  },
  radioButtonText: {
    marginLeft: 10,
    fontFamily: 'TT Chocolates Trial Medium',
    fontSize: 12,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedAddressCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    marginRight: 10,
  },
  selectedAddressText: {
    flex: 1,
    color: '#333',
    fontFamily: 'TT Chocolates Trial Medium',
    fontSize: 14,
  },
  autocompleteContainer: {
    flex: 0,
    width: '100%',
    marginTop: 20,
  },
  autocompleteInput: {
    height: 40,
    borderRadius: 10,
    backgroundColor: '#EBEBEB',
    color: '#969696',
    fontFamily: 'TT Chocolates Trial Medium',
    fontSize: 13,
    paddingLeft: 40,
  },
  autocompleteList: {
    borderWidth: 0,
    backgroundColor: '#F5F5F5',
    marginTop: 5,
    borderRadius: 10,
    maxHeight: 200,
  },
  autocompleteRow: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  autocompleteDescription: {
    fontSize: 14,
    color: '#333',
  },
  searchIconContainer: {
    position: 'absolute',
    left: 10,
    top: 8,
    zIndex: 1,
  },
  sheetContainer: {
    borderWidth: 1,
    borderColor: '#E9E9E9',
    borderTopLeftRadius: 45,
    borderTopRightRadius: 45,
    height: '70%',
  },
  sheetWrapper: {
    backgroundColor: 'transparent',
  },
  draggableIcon: {
    width: 100,
    backgroundColor: '#E9E9E9',
  },
  sheetContent: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  sheetInnerContent: {
    marginLeft: 40,
    marginRight: 40,
    justifyContent: 'space-between',
  },
});

export default AddAddress;
