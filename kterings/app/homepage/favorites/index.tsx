import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  Pressable, 
  FlatList, 
  RefreshControl, 
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import BackButton from '@/components/common/BackButton';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Kterer } from '@/hooks/types';
import { Entypo } from '@expo/vector-icons'; // Ensure you have this import if you're using Entypo icons

export default function Favorites() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<number | null>(0.0); // Set initial value to 0.0
  const [items, setItems] = useState([
    { label: "All Ratings", value: 0.0 },
    { label: "Ratings 1.0+", value: 1.0 },
    { label: "Ratings 2.0+", value: 2.0 },
    { label: "Ratings 3.0+", value: 3.0 },
    { label: "Ratings 4.0+", value: 4.0 },
  ]);
  const [favoriteKterers, setFavoriteKterers] = useState<Kterer[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true); // Added loading state
  const [error, setError] = useState<string | null>(null); // Added error state

  const fetchFavorites = async () => {
    try {
      setError(null); // Reset error state before fetching
      const token = await SecureStore.getItemAsync('token');
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }

      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/favourites`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const responseText = await response.text(); // Read response as text first for logging
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error('Failed to parse server response as JSON.');
      }

      console.log('Fetched favorite Kterers:', data); // Log the entire response

      // Handle different possible response formats
      if (Array.isArray(data)) {
        // If the response is an array, set it directly
        setFavoriteKterers(data);
      } else if (data.kterers && Array.isArray(data.kterers)) {
        // If the response is an object with a 'kterers' array
        setFavoriteKterers(data.kterers);
      } else if (data.data && Array.isArray(data.data.kterers)) {
        // If the response is nested deeper
        setFavoriteKterers(data.data.kterers);
      } else {
        // If none of the above, throw an error
        throw new Error('Unexpected response format from the server.');
      }
    } catch (error) {
      console.error('Error fetching favorite Kterers:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred.');
      setFavoriteKterers([]); // Ensure it's an empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchFavorites();
    setRefreshing(false);
  };

  const handleFilterChange = (value: number) => {
    setValue(value);
  };

  const filteredKterers = favoriteKterers.filter(kterer => {
    // Ensure that rating is a number
    const rating = typeof kterer.rating === 'number' ? kterer.rating : 0;
    return rating >= (value !== null ? value : 0);
  });

  const handleKtererPress = (id: number) => {
    router.replace({ pathname: '/sellerpage', params: { id: id } });
  };

  const renderFavoriteKterer = ({ item }: { item: Kterer }) => (
    <Pressable 
      key={item.id} 
      style={styles.ktererContainer} 
      onPress={() => handleKtererPress(item.id)}
    >
      <Image 
        source={{ uri: item.profile_image_url }} 
        style={styles.ktererImage} 
        resizeMode="cover"
      />
      <Text style={styles.ktererLabel}>
        {item.user?.first_name || item.user.first_name} {item.user?.last_name || item.user.last_name}
      </Text>
      <Text style={styles.ktererRating}>
        Rating: {item.rating}
      </Text>
    </Pressable>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#BF1E2E" />
      </View>
    );
  }

  return (
    <>
      <BackButton
        onPress={() => router.replace('/homepage')}
        buttonStyle={styles.backButton}
      />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Saved Kterers</Text>
          <DropDownPicker
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            placeholder='Ratings 0.0+'
            showArrowIcon={true} // Changed to true for better UX
            showTickIcon={false}
            dropDownDirection="BOTTOM"
            style={{
              backgroundColor: '#BF1E2E',
              width: 140, // Increased width for better readability
              borderColor: '#EEEEEE',
              borderRadius: 35,
              minHeight: 35,
              zIndex: 2,
            }}
            textStyle={{
              fontSize: 12,
              fontFamily: 'TT Chocolates Trial Medium',
              color: '#FFFFFF',
              textAlign: 'center',
            }}
            containerStyle={{ width: 140 }} // Set to fixed width
            dropDownContainerStyle={{
              width: 140,
              borderColor: '#EEEEEE',
              marginTop: 10,
              borderRadius: 20,
            }}
            listItemLabelStyle={{
              fontSize: 12,
              fontFamily: 'TT Chocolates Trial Medium',
              color: '#000000',
              textAlign: 'center',
            }}
            itemSeparator={true}
            itemSeparatorStyle={{ height: 1, backgroundColor: '#EEEEEE', marginHorizontal: 10 }}
          />
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <FlatList
          contentContainerStyle={styles.kterersContainer}
          data={filteredKterers}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderFavoriteKterer}
          numColumns={3}
          columnWrapperStyle={styles.columnWrapper}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No favorite Kterers found.</Text>
            </View>
          }
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignContent: 'center',
    paddingTop: 100, // Adjusted padding to prevent overlap with BackButton
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 30,
    marginBottom: 20, // Reduced marginTop to accommodate paddingTop
    zIndex: 2,
  },
  headerText: {
    fontSize: 20, // Increased font size for better visibility
    fontFamily: 'TT Chocolates Trial Bold',
    color: '#000000',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 30,
    zIndex: 2,
  },
  kterersContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginHorizontal: 20,
    // marginTop: 50, // Removed to use paddingTop in container
    justifyContent: 'space-evenly',
    alignSelf: 'center',
    zIndex: 0,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 20, // Added margin between rows
  },
  ktererContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 20, // Reduced margin for better spacing
    width: Dimensions.get('window').width / 3, // Adjusted width for better spacing
  },
  ktererImage: {
    width: 80,
    height: 80,
    borderRadius: 10, // Made the image circular
    backgroundColor: '#EEEEEE', // Placeholder background color
  },
  ktererLabel: {
    fontSize: 14, // Increased font size for better readability
    fontFamily: 'TT Chocolates Trial Bold',
    color: '#000000',
    textAlign: 'center',
    width: '100%',
    marginTop: 10,
  },
  ktererRating: {
    fontSize: 12,
    fontFamily: 'TT Chocolates Trial Medium',
    color: '#969696',
    textAlign: 'center',
    marginTop: 5,
  },
  emptyContainer: {
    marginTop: 50,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#969696',
    fontFamily: 'TT Chocolates Trial Medium',
  },
  errorContainer: {
    marginHorizontal: 30,
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#FFEAEA',
    borderRadius: 10,
  },
  errorText: {
    color: '#D8000C',
    fontSize: 14,
    fontFamily: 'TT Chocolates Trial Medium',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});
