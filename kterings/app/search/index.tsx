import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Pressable, Text, Image, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import BackChevron from '@assets/images/back_chevron.svg';
import { categories } from '@/assets/categories';
import { products } from '@/assets/products';

import RecentSearchIcon from '@/assets/images/recent_searches.svg';
import ProductLarge from '@/components/common/ProductLarge';
import DropDownPicker from 'react-native-dropdown-picker';

export default function Search() {
  const [recentSearches, setRecentSearches] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(false);

  const handleSearch = () => {
    // Show results and update search term when search is initiated
    setShowResults(true);
  };

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    {
      label: "Ratings 1.0+",
      value: 1.0
    },
    {
      label: "Ratings 2.0+",
      value: 2.0
    },
    {
      label: "Ratings 3.0+",
      value: 3.0
    },
    {
      label: "Ratings 4.0+",
      value: 4.0
    }
  ]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <BackChevron style={styles.backButton} width={15} height={15} />
        </Pressable>
        <View style={styles.inputContainer}>
          <Ionicons name="search-outline" size={24} color="#969696" style={styles.icon} />
          <TextInput
            placeholder="Search for food names & cuisines"
            placeholderTextColor="#B2B2B2"
            style={styles.input}
            secureTextEntry={false}
            autoCorrect={false}
            onFocus={() => setShowResults(true)}
            // onBlur={() => setShowResults(false)}
            onChangeText={(text) => setSearchTerm(text)}
            onSubmitEditing={handleSearch}
          />
        </View>
      </View>

      {!showResults ? (
        <View>
          <View style={styles.recentSearches}>
            <Text style={styles.recentSearchesTitle}>Recent Searches</Text>
            <View style={styles.recentSearchContainer}>
              <RecentSearchIcon width={20} height={20} />
              <Text style={styles.recentSearch}>pancake</Text>
            </View>
            <View style={styles.recentSearchContainer}>
              <RecentSearchIcon width={20} height={20} />
              <Text style={styles.recentSearch}>chicken curry</Text>
            </View>
          </View>

          <View style={styles.popularSearches}>
            <Text style={styles.popularSearchesTitle}>Popular Searches</Text>
            <View style={styles.popularSearchesContainer}>
              {categories.map((item, index) => (
                <View key={index} style={styles.popularSearch}>
                  <Text style={styles.popularSearchText}>{item.name}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.cuisines}>
            <Text style={styles.cuisinesTitle}>Cuisines</Text>
            <FlatList
              data={categories}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={styles.cuisineItem}>
                  <Image source={item.image} style={styles.cuisineImage} />
                  <Text style={styles.cuisineName}>{item.name}</Text>
                </View>
              )}
              horizontal
            />
          </View>
        </View>
      ) : (
        <View style={{ flex: 1 }}>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
            <Text style={{ fontSize: 15, fontFamily: 'TT Chocolates Trial Bold', color: '#000000' }}>
              {categories.length} results for "{searchTerm}"
            </Text>
            <DropDownPicker
              open={open}
              value={value}
              items={items}
              setOpen={setOpen}
              setValue={setValue}
              setItems={setItems}
              placeholder='Ratings 4.0+'
              showArrowIcon={false}
              showTickIcon={false}
              dropDownDirection="BOTTOM"
              style={{
                backgroundColor: '#BF1E2E',
                width: 100,
                borderColor: '#EEEEEE',
                borderRadius: 15,
                borderEndEndRadius: 15,
                borderEndStartRadius: 15,
                minHeight: 35,
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
                borderRadius: 20,
                marginTop: 10,
                borderStartEndRadius: 20,
                borderStartStartRadius: 20,
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

          <FlatList
            data={products}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <ProductLarge image={item.image} name={item.name} category={item.category} distance={item.distance} rating={item.rating} />
            )}
            style={{ marginTop: 10 }}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 20,
    marginTop: 70,
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
    backgroundColor: "#EBEBEB",
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginLeft: 10,
  },
  input: {
    flex: 1,
    color: "#969696",
    fontFamily: "TT Chocolates Trial Medium",
    fontSize: 13,
    letterSpacing: 0,
    textAlign: "left",
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
    marginTop: 10,
  },
  recentSearch: {
    fontSize: 12,
    fontFamily: 'TT Chocolates Trial Bold',
    color: '#000000',
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
  },
  popularSearchText: {
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
  resultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  resultsText: {
    fontSize: 20,
    fontFamily: 'TT Chocolates Trial Bold',
    color: '#000000',
  },
});
