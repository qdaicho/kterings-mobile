import React, { useEffect, useState } from 'react';
import { View, TextInput, Pressable, Text, Image, FlatList, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import BackChevron from '@assets/images/back_chevron.svg';
import { categories } from '@/assets/categories';
import RecentSearchIcon from '@/assets/images/recent_searches.svg';
import ProductLarge from '@/components/common/ProductLarge';
import DropDownPicker from 'react-native-dropdown-picker';
import { Food, SearchTerm } from '@/hooks/types';
import * as SecureStore from 'expo-secure-store';

export default function Search() {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [prod, setProd] = useState<Food[]>([]);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(4.0); // Default rating filter to 4.0+
  const [items, setItems] = useState([
    { label: 'Ratings 1.0+', value: 1.0 },
    { label: 'Ratings 2.0+', value: 2.0 },
    { label: 'Ratings 3.0+', value: 3.0 },
    { label: 'Ratings 4.0+', value: 4.0 },
  ]);
  const [popularSearches, setPopularSearches] = useState<SearchTerm[]>([]); // New state for popular searches
  // Function to load recent searches from SecureStore
  const loadRecentSearches = async () => {
    try {
      const storedRecentSearches = await SecureStore.getItemAsync('recentSearches');
      if (storedRecentSearches) {
        setRecentSearches(JSON.parse(storedRecentSearches));
      }
    } catch (error) {
      console.error('Error loading recent searches:', error);
    }
  };
  // Function to fetch popular searches from backend
  const fetchPopularSearches = async () => {
    try {
      const url = `${process.env.EXPO_PUBLIC_API_URL}/food/popular-searches?limit=10`;
      const accessToken = await SecureStore.getItemAsync('token');

      if (!accessToken) {
        Alert.alert('Error', 'Authentication token is missing. Please log in again.');
        return;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch popular searches.');
      }

      const data = await response.json();
      console.log('Fetched Popular Searches:', data.data);
      // Assuming data.data is an array of search terms
      setPopularSearches(data.data);
    } catch (error) {
      console.error('Error fetching popular searches:', error);
      Alert.alert('Error', 'An unexpected error occurred while fetching popular searches.');
    }
  };
  // Function to add a search term to recent searches


  const addToRecentSearches = async (term: string) => {
    try {
      let updatedRecentSearches: string[] = [...recentSearches];
      // Remove the term if it already exists (case-insensitive)
      updatedRecentSearches = updatedRecentSearches.filter(
        (existingTerm: string) => existingTerm.toLowerCase() !== term.toLowerCase()
      );
      // Add the new term to the beginning
      updatedRecentSearches.unshift(term);
      // Limit to 10 recent searches
      if (updatedRecentSearches.length > 10) {
        updatedRecentSearches = updatedRecentSearches.slice(0, 10);
      }
      setRecentSearches(updatedRecentSearches);
      await SecureStore.setItemAsync('recentSearches', JSON.stringify(updatedRecentSearches));
    } catch (error) {
      console.error('Error saving recent searches:', error);
    }
  };

  const handleSearch = async () => {
    if (searchTerm.trim() === '') {
      Alert.alert('Input Required', 'Please enter a search term.');
      return;
    }
    await addToRecentSearches(searchTerm);
    setShowResults(true);
  };

  const handlePopularSearchPress = async (text: string) => {
    setSearchTerm(text);
    await addToRecentSearches(text);
    setShowResults(true);
  };

  const handleRecentSearchPress = async (text: string) => {
    setSearchTerm(text);
    await addToRecentSearches(text);
    setShowResults(true);
  };


  useEffect(() => {
    if (!showResults) {
      return;
    }

    const fetchData = async () => {
      try {
        const params = new URLSearchParams();
        params.append('query', searchTerm);

        const url = `${process.env.EXPO_PUBLIC_API_URL}/food/search?${params.toString()}`;
        const accessToken = await SecureStore.getItemAsync('token');

        if (!accessToken) {
          Alert.alert('Error', 'Authentication token is missing. Please log in again.');
          return;
        }

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data.');
        }

        const data = await response.json();
        console.log('Fetched Data:', data.data); // Log to ensure data is fetched correctly

        setProd(data.data); // Update state with search results
      } catch (error) {
        console.error('Error fetching data:', error);
        Alert.alert('Error', 'An unexpected error occurred while fetching data.');
      }
    };

    fetchData();
  }, [showResults, searchTerm, value, selectedCategory]);



  const renderProduct = ({ item }: { item: Food }) => {
    const imageUrl = item.images && item.images.length > 0 ? item.images[0] : '';
    return (
      <ProductLarge
        image={{ uri: imageUrl }}
        name={item.name}
        category={item.ethnic_type}
        distance={`${item.auto_delivery_time} min away`}
        rating={item.rating || 0}
        id={item.id}
      />
    );
  };

  useEffect(() => {
    loadRecentSearches();
    fetchPopularSearches();
  }, []);

  return (
    <View style={{ flex: 1, marginHorizontal: 20, marginTop: 70, backgroundColor: '#FFFFFF' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', marginBottom: 50 }}>
        <Pressable
          onPress={() => {
            if (showResults) setShowResults(false);
            else router.replace('/homepage');
          }}
          style={({ pressed }) => ({ padding: 10, backgroundColor: pressed ? '#E9E9E9' : 'transparent', borderRadius: 5, marginRight: 10 })}
        >
          <BackChevron width={15} height={15} style={{ marginRight: 10 }} />
        </Pressable>
        <View style={{ flex: 1, height: 40, borderRadius: 10, backgroundColor: '#EBEBEB', flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="search-outline" size={24} color="#969696" style={{ marginLeft: 10 }} />
          <TextInput
            placeholder="Search for food names & cuisines"
            placeholderTextColor="#B2B2B2"
            style={{ flex: 1, color: '#969696', fontFamily: 'TT Chocolates Trial Medium', fontSize: 13, letterSpacing: 0, textAlign: 'left', marginLeft: 10 }}
            value={searchTerm}
            onChangeText={(text) => setSearchTerm(text)}
            onSubmitEditing={handleSearch}
          />
        </View>
      </View>

      {!showResults ? (
        <View>
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 15, fontFamily: 'TT Chocolates Trial Bold', color: '#000000', marginBottom: 10 }}>Recent Searches</Text>
            {recentSearches.slice(0, 5).map((search, index) => (
              <Pressable
                key={index}
                onPress={() => handleRecentSearchPress(search)}
                style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'flex-start', marginTop: 20, backgroundColor: pressed ? '#ffffff' : 'transparent' })}
              >
                {({ pressed }) => (
                  <>
                    <RecentSearchIcon width={20} height={20} fill="#000000" />
                    <Text style={{ color: pressed ? '#BF1E2E' : '#000000', fontSize: 12, fontFamily: 'TT Chocolates Trial Bold', marginLeft: 20 }}>
                      {search}
                    </Text>
                  </>
                )}
              </Pressable>
            ))}
          </View>

          <View style={{ marginTop: 20 }}>
            <Text style={{ fontSize: 15, fontFamily: 'TT Chocolates Trial Bold', color: '#000000', marginBottom: 10 }}>
              Popular Searches
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {popularSearches.slice(0, 7).map((item, index) => (
                <Pressable
                  key={index}
                  onPress={() => handlePopularSearchPress(item.search_term)}
                  style={({ pressed }) => ({
                    borderRadius: 30,
                    borderWidth: 1,
                    borderColor: '#D4D4D4',
                    padding: 10,
                    marginTop: 10,
                    alignSelf: 'flex-start',
                    marginRight: 15,
                    height: 40,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: pressed ? '#E0E0E0' : 'transparent',
                  })}
                >
                  {({ pressed }) => (
                    <Text style={{ fontFamily: 'TT Chocolates Trial Regular', fontSize: 11, color: pressed ? '#BF1E2E' : '#000000' }}>{item.search_term}</Text>
                  )}
                </Pressable>
              ))}
            </View>
          </View>

          <View style={{ marginTop: 20 }}>
            <Text style={{ fontSize: 15, fontFamily: 'TT Chocolates Trial Bold', color: '#000000', marginBottom: 20 }}>Cuisines</Text>
            <FlatList
              data={categories}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item }) => (
                <Pressable onPress={() => setSelectedCategory(selectedCategory === item.name ? null : item.name)}>
                  <View style={{ flexDirection: 'column', alignItems: 'center', marginRight: 20 }}>
                    <Image source={item.image} style={{ width: 50, height: 50, marginBottom: 10 }} />
                    <Text
                      style={{
                        fontSize: 10,
                        fontFamily: selectedCategory === item.name ? 'TT Chocolates Trial Bold' : 'TT Chocolates Trial Medium',
                        color: selectedCategory === item.name ? '#BF1E2E' : '#000000',
                      }}
                    >
                      {item.name}
                    </Text>
                  </View>
                </Pressable>
              )}
              horizontal
            />
          </View>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30, zIndex: 2 }}>
            <Text style={{ fontSize: 15, fontFamily: 'TT Chocolates Trial Bold', color: '#000000' }}>
              {prod.length} results for "{searchTerm}"
            </Text>
            <DropDownPicker
              open={open}
              value={value}
              items={items}
              setOpen={setOpen}
              setValue={setValue}
              setItems={setItems}
              placeholder={`Ratings ${value}.0+`}
              showArrowIcon={false}
              showTickIcon={false}
              dropDownDirection="BOTTOM"
              style={{ backgroundColor: '#BF1E2E', width: 100, borderColor: '#EEEEEE', borderRadius: 35, minHeight: 35, zIndex: 2 }}
              textStyle={{ fontSize: 12, fontFamily: 'TT Chocolates Trial Medium', color: '#FFFFFF', textAlign: 'center' }}
              containerStyle={{ width: 'auto' }}
              dropDownContainerStyle={{ width: 100, borderColor: '#EEEEEE', marginTop: 10, borderRadius: 20 }}
              listItemLabelStyle={{ fontSize: 12, fontFamily: 'TT Chocolates Trial Medium', color: '#000000', textAlign: 'center' }}
              itemSeparator
              itemSeparatorStyle={{ height: 1, backgroundColor: '#EEEEEE', marginHorizontal: 10 }}
            />
          </View>

          {prod.length === 0 ? (
            <View style={{ alignItems: 'center', marginTop: 20 }}>
              <Text style={{ fontSize: 16, color: '#888888' }}>No results found.</Text>
            </View>
          ) : (
            <FlatList
              data={prod}
              keyExtractor={(item) => item.id}
              renderItem={renderProduct}
              style={{ marginTop: 10 }}
            />
          )}

        </View>
      )}
    </View>
  );
}
