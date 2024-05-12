import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Image,
  Pressable,
  Text,
  TextInput,
  Dimensions,
  FlatList
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import BackButton from '@/components/common/BackButton';
import { router } from 'expo-router';
import MapView, { Marker, Camera, LatLng } from 'react-native-maps';
import * as Location from 'expo-location';
import RBSheet from 'react-native-raw-bottom-sheet';
import KButton from '@/components/common/KButton';
import { Ionicons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import MapsIcon from '@assets/images/maps_icon.svg';
import Geocoding from 'react-native-geocoding';



export default function AddAddress() {
  const [location, setLocation] = useState<Location.LocationObject>();
  const [subscription, setSubscription] = useState<Location.LocationSubscription | null>(null);
  const refRBSheet = useRef<RBSheet>(null);
  const [viewIndex, setViewIndex] = useState(0);

  useEffect(() => {
    const getLocationPermissions = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }

      const newSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 10,
        },
        (newLocation) => {
          setLocation(newLocation);
        }
      );

      setSubscription(newSubscription);
    };

    getLocationPermissions();
    refRBSheet.current && refRBSheet.current.open();
    return () => {
      if (subscription) {
        subscription.remove();
        setSubscription(null);
      }
    };
  }, []);

  const mapRef = React.useRef<MapView>(null);

  const handleRecenter = () => {
    if (location && mapRef.current) {
      mapRef.current.animateCamera({
        center: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
        zoom: 12,
      });
    }
  };

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ formatted_address: string; location: Geocoding.LatLng; }[]>([]);

  // Initialize the Geocoding API with your Google Maps API key
  Geocoding.init('AIzaSyCrm3OKsY8w4XiD9ywn9Ri0ICtkSlGt8y4');

  // Function to fetch address suggestions
  const fetchAddressSuggestions = async (text: string) => {
    setQuery(text);
    if (text.length > 2) {
      try {
        const response = await Geocoding.from(text);
        const addresses = response.results.map((item) => ({
          formatted_address: item.formatted_address,
          location: item.geometry.location,
        }));
        setResults(addresses);
      } catch (error) {
        console.error('Error fetching address suggestions:', error);
      }
    } else {
      setResults([]);
    }
  };

  const handleAddressSelect = (address: { formatted_address: string; location: Geocoding.LatLng; }) => {
    // Handle the selection of an address (e.g., store it in a state or navigate to another screen)
    console.log('Address selected:', address);
    setQuery(address.formatted_address);
    setResults([]); // Clear suggestions when an address is selected
  };

  function showAddressView() {
    return (
      <>
        <Text style={{
          color: '#000000',
          fontFamily: 'TT Chocolates Trial Bold',
          fontSize: 16,
          fontWeight: '600',
          letterSpacing: 0,
          lineHeight: 29,
          textAlign: 'left',
        }}>Add a new address</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="search-outline" size={24} color="#969696" style={{ marginLeft: 10 }} />
          <TextInput
            placeholder="Enter your address"
            placeholderTextColor="#B2B2B2"
            style={[styles.input]}
            secureTextEntry={false}
            autoCorrect={false}
            // textContentType="password"
            onFocus={() => { setViewIndex(1) }}
            onBlur={() => { setViewIndex(0) }}
          />
        </View>

        <KButton
          title="Add Address Details"
          onPress={() => {
            refRBSheet.current && refRBSheet.current.close();
            // signOut();
            // router.push("/login/");
          }}
          buttonStyle={{
            marginTop: 50,
            alignSelf: 'center'
          }}
          textStyle={{
            fontSize: 16,
          }}
        />
      </>
    );
  }

  function showAddressSearchView() {
    return (
      <>
        <Text style={{
          color: '#000000',
          fontFamily: 'TT Chocolates Trial Bold',
          fontSize: 16,
          fontWeight: '600',
          letterSpacing: 0,
          lineHeight: 29,
          textAlign: 'left',
        }}>Search Address</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="search-outline" size={24} color="#969696" style={{ marginLeft: 10 }} />
          <TextInput
            placeholder="Enter your address"
            placeholderTextColor="#B2B2B2"
            style={[styles.input]}
            secureTextEntry={false}
            autoCorrect={false}
            value={query}
            onChangeText={fetchAddressSuggestions} // Call the function when text changes
            onFocus={() => setViewIndex(1)}
          />
        </View>

        {results.length > 0 && (
          <FlatList
            data={results}
            keyExtractor={(item) => item.formatted_address}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleAddressSelect(item)}>
                <Text style={{ padding: 10 }}>{item.formatted_address}</Text>
              </TouchableOpacity>
            )}
          />
        )}
        {results.length === 0 &&
          (<View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: 50, gap: 20 }}>
            <MapsIcon style={{ width: 200, height: 200 }} />
            <Text style={{ color: '#969696', fontFamily: 'TT Chocolates Trial Medium', fontSize: 13, textAlign: 'center' }}>Enter an address to explore dishes around you</Text>
            <Text style={{ color: '#BF1E2E', fontFamily: 'TT Chocolates Trial Bold', fontSize: 13, textAlign: 'center' }}>Use my current location</Text>
          </View>
          )
        }

      </>
    );
  }
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.mainContainer}>
        <BackButton
          onPress={() => router.back()}
          buttonStyle={styles.backButton}
        />
        <MapView
          ref={mapRef}
          style={styles.map}
          camera={{
            center: {
              latitude: location?.coords.latitude || 37.78825,
              longitude: location?.coords.longitude || -122.4324,
            },
            pitch: 0,
            zoom: 12,
            heading: 0,
            altitude: 0,
          }}
        >
          {location && (
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              title="Your Location"
              image={require('@assets/images/location_marker.png')}
            />
          )}
        </MapView>
        <Pressable
          style={styles.recenterButton}
          onPress={handleRecenter}
        >
          <Image
            source={require('@assets/images/target_icon.png')}
            style={styles.recenterIcon}
          />
        </Pressable>

        <Pressable
          style={styles.addressButton}
          onPress={() => refRBSheet.current && refRBSheet.current.open()}
        >
          <Entypo name="home" size={24} color="#BF1E2E" />
        </Pressable>

        <RBSheet
          // keyboardAvoidingViewEnabled={true}
          ref={refRBSheet}
          animationType="slide"
          closeOnDragDown={true}
          closeOnPressMask={true}
          customStyles={{
            container: {
              borderWidth: 1,
              borderColor: "#E9E9E9",
              borderTopLeftRadius: 45,
              borderTopRightRadius: 45,
              height: '70%',
            },
            wrapper: {
              backgroundColor: "transparent",
            },
            draggableIcon: {
              width: 100,
              backgroundColor: "#E9E9E9",
            },
          }}
          onClose={() => setViewIndex(0)}
        >
          <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between' }}>
            <View style={{
              marginLeft: 40,
              marginRight: 40,
              // marginTop: 20
              justifyContent: 'space-between'
            }}>
              {viewIndex === 0 && showAddressView()}
              {viewIndex === 1 && showAddressSearchView()}
            </View>
          </View>
        </RBSheet>
      </View>


    </TouchableWithoutFeedback>
  );
}

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
  recenterIcon: {
    width: 30,
    height: 30,
    tintColor: 'red',
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
  inputContainer: {
    height: 40,
    width: '100%',
    borderRadius: 10,
    backgroundColor: "#EBEBEB",
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 20
  },
  input: {
    color: "#969696",
    fontFamily: "TT Chocolates Trial Medium",
    fontSize: 13,
    letterSpacing: 0,
    textAlign: "left",
    marginLeft: 10
  },
});
