import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TextInput, Pressable, Text, Image, FlatList, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import BackChevron from '@assets/images/back_chevron.svg';
import { categories } from '@/assets/categories';
import RecentSearchIcon from '@/assets/images/recent_searches.svg';
import ProductLarge from '@/components/common/ProductLarge';
import DropDownPicker from 'react-native-dropdown-picker';
import { Food } from '@/hooks/types';
import * as SecureStore from 'expo-secure-store';

export default function Search() {
  const [recentSearches, setRecentSearches] = useState(['pancake', 'chicken curry']);
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

  const handleSearch = () => {
    setShowResults(true);
  };

  const handlePopularSearchPress = (text: string) => {
    setSearchTerm(text);
    setShowResults(true);
  };

  const handleRecentSearchPress = (text: string) => {
    setSearchTerm(text);
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

        // Convert the object into an array and cast it as Food[]
        const productArray = Object.values(data.data || {}) as Food[];
        setProd(productArray);
      } catch (error) {
        console.error('Error fetching data:', error);
        Alert.alert('Error', 'An unexpected error occurred while fetching data.');
      }
    };

    fetchData();
  }, [showResults, searchTerm, value, selectedCategory]);


  const renderProduct = ({ item }: { item: Food }) => {
    // Ensure images exist and use the first available image URL if present
    const imageUrl = item.images && item.images.length > 0 ? item.images[0] : '';

    return (
      <ProductLarge
        image={{ uri: imageUrl }}
        name={item.name}
        category={item.ethnic_type}
        distance={`${item.auto_delivery_time} min away`}
        rating={item.rating || 0} // Assuming there is a 'rating' property in your data
        id={item.id}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          onPress={() => {
            if (showResults) {
              setShowResults(false);
            } else {
              router.back();
            }
          }}
          style={({ pressed }) => ({
            padding: 10,
            backgroundColor: pressed ? '#E9E9E9' : 'transparent',
            borderRadius: 5,
            marginRight: 10,
          })}
        >
          <BackChevron width={15} height={15} style={styles.backButton} />
        </Pressable>
        <View style={styles.inputContainer}>
          <Ionicons name="search-outline" size={24} color="#969696" style={styles.icon} />
          <TextInput
            placeholder="Search for food names & cuisines"
            placeholderTextColor="#B2B2B2"
            style={styles.input}
            value={searchTerm}
            onChangeText={(text) => setSearchTerm(text)}
            onSubmitEditing={handleSearch}
          />
        </View>
      </View>

      {!showResults ? (
        <View>
          <View style={styles.recentSearches}>
            <Text style={styles.recentSearchesTitle}>Recent Searches</Text>
            {recentSearches.map((search, index) => (
              <Pressable
                key={index}
                onPress={() => handleRecentSearchPress(search)}
                style={({ pressed }) => [
                  styles.recentSearchContainer,
                  pressed ? styles.recentSearchPressed : null,
                ]}
              >
                {({ pressed }) => (
                  <>
                    <RecentSearchIcon width={20} height={20} fill={'#000000'} />
                    <Text style={pressed ? styles.recentSearchTextPressed : styles.recentSearch}>
                      {search}
                    </Text>
                  </>
                )}
              </Pressable>
            ))}
          </View>

          <View style={styles.popularSearches}>
            <Text style={styles.popularSearchesTitle}>Popular Searches</Text>
            <View style={styles.popularSearchesContainer}>
              {categories.map((item, index) => (
                <Pressable
                  key={index}
                  style={({ pressed }) => [
                    styles.popularSearch,
                    pressed ? styles.popularSearchPressed : null,
                  ]}
                  onPress={() => handlePopularSearchPress(item.name)}
                >
                  {({ pressed }) => (
                    <Text
                      style={
                        pressed ? styles.popularSearchTextPressed : styles.popularSearchText
                      }
                    >
                      {item.name}
                    </Text>
                  )}
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.cuisines}>
            <Text style={styles.cuisinesTitle}>Cuisines</Text>
            <FlatList
              data={categories}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() =>
                    setSelectedCategory(selectedCategory === item.name ? null : item.name)
                  }
                >
                  <View style={styles.cuisineItem}>
                    <Image source={item.image} style={styles.cuisineImage} />
                    <Text
                      style={[
                        styles.cuisineName,
                        selectedCategory === item.name ? styles.selectedCuisineName : null,
                      ]}
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
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsText}>
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
              style={{
                backgroundColor: '#BF1E2E',
                width: 100,
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
              containerStyle={{ width: 'auto' }}
              dropDownContainerStyle={{
                width: 100,
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
              itemSeparator
              itemSeparatorStyle={{
                height: 1,
                backgroundColor: '#EEEEEE',
                marginHorizontal: 10,
              }}
            />
          </View>

          <FlatList
            data={prod}
            keyExtractor={(item) => item.id}
            renderItem={renderProduct}
            style={{ marginTop: 10 }}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // Styles remain unchanged
  container: {
    flex: 1,
    marginHorizontal: 20,
    marginTop: 70,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginBottom: 50,
  },
  backButton: {
    marginRight: 10,
  },
  inputContainer: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#EBEBEB',
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginLeft: 10,
  },
  input: {
    flex: 1,
    color: '#969696',
    fontFamily: 'TT Chocolates Trial Medium',
    fontSize: 13,
    letterSpacing: 0,
    textAlign: 'left',
    marginLeft: 10,
  },
  recentSearches: {
    marginBottom: 20,
  },
  recentSearchesTitle: {
    fontSize: 15,
    fontFamily: 'TT Chocolates Trial Bold',
    color: '#000000',
    marginBottom: 10,
  },
  recentSearchContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 20,
  },
  recentSearch: {
    fontSize: 12,
    fontFamily: 'TT Chocolates Trial Bold',
    color: '#000000',
    marginLeft: 20,
  },
  recentSearchPressed: {
    backgroundColor: '#ffffff',
  },
  recentSearchTextPressed: {
    color: '#BF1E2E',
    fontSize: 12,
    fontFamily: 'TT Chocolates Trial Bold',
    marginLeft: 20,
  },
  popularSearches: {
    marginTop: 20,
  },
  popularSearchesTitle: {
    fontSize: 15,
    fontFamily: 'TT Chocolates Trial Bold',
    color: '#000000',
    marginBottom: 10,
  },
  popularSearchesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  popularSearch: {
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
  },
  popularSearchPressed: {
    backgroundColor: '#E0E0E0',
  },
  popularSearchText: {
    fontFamily: 'TT Chocolates Trial Regular',
    fontSize: 11,
  },
  popularSearchTextPressed: {
    color: '#BF1E2E',
    fontFamily: 'TT Chocolates Trial Regular',
    fontSize: 11,
  },
  cuisines: {
    marginTop: 20,
  },
  cuisinesTitle: {
    fontSize: 15,
    fontFamily: 'TT Chocolates Trial Bold',
    color: '#000000',
    marginBottom: 20,
  },
  cuisineItem: {
    flexDirection: 'column',
    alignItems: 'center',
    marginRight: 20,
  },
  cuisineImage: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  cuisineName: {
    fontSize: 10,
    fontFamily: 'TT Chocolates Trial Medium',
    color: '#000000',
  },
  selectedCuisineName: {
    fontFamily: 'TT Chocolates Trial Bold',
    color: '#BF1E2E',
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    zIndex: 2,
  },
  resultsText: {
    fontSize: 15,
    fontFamily: 'TT Chocolates Trial Bold',
    color: '#000000',
  },
});
