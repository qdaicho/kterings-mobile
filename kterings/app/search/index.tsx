import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TextInput, Pressable, Text, Image, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import BackChevron from '@assets/images/back_chevron.svg';
import { categories } from '@/assets/categories';
import { products } from '@/assets/products';

import RecentSearchIcon from '@/assets/images/recent_searches.svg';
import ProductLarge from '@/components/common/ProductLarge';
import DropDownPicker from 'react-native-dropdown-picker';

interface qImage {
  id: string;
  food_id: string;
  image_url: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface Quantity {
  id: string;
  food_id: string;
  size: string;
  price: string;
  quantity: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface Food {
  id: string;
  kterer_id: number;
  name: string;
  description: string;
  ingredients: string;
  halal: string;
  kosher: boolean;
  vegetarian: string;
  desserts: string;
  contains_nuts: boolean;
  meat_type: string;
  ethnic_type: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  auto_delivery_time: number;
  images: qImage[];
  quantities: Quantity[];
  rating: number;
}

function deepSearch(items: Food[], searchTerm: string): Food[] {
  const lowerCaseSearchTerm = searchTerm.toLowerCase();

  return items.filter(item => {
    return Object.values(item).some(value => {
      if (typeof value === 'string') {
        return value.toLowerCase().includes(lowerCaseSearchTerm);
      } else if (typeof value === 'number') {
        return value.toString().includes(lowerCaseSearchTerm);
      } else if (Array.isArray(value)) {
        return value.some(subItem => {
          return Object.values(subItem).some(subValue => {
            if (typeof subValue === 'string') {
              return subValue.toLowerCase().includes(lowerCaseSearchTerm);
            } else if (typeof subValue === 'number') {
              return subValue.toString().includes(lowerCaseSearchTerm);
            }
            return false;
          });
        });
      }
      return false;
    });
  });
}


export default function Search() {
  const [recentSearches, setRecentSearches] = useState(['pancake', 'chicken curry']);
  const [searchTerm, setSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(false);

  const handleSearch = () => {
    setShowResults(true);
  };

  const handlePopularSearchPress = (text: React.SetStateAction<string>) => {
    setSearchTerm(text);
  };

  const handleRecentSearchPress = (text: string) => {
    setSearchTerm(text);
  };

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [prod, setProd] = useState<Food[]>([]);


  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: "Ratings 1.0+", value: 1.0 },
    { label: "Ratings 2.0+", value: 2.0 },
    { label: "Ratings 3.0+", value: 3.0 },
    { label: "Ratings 4.0+", value: 4.0 }
  ]);

  useEffect(() => {
    const fetchData = async () => {

      // Asynchronous request to get all the food from the database upon load
      try {
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/food`, {
          method: 'GET',
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const products = await response.json();

        setProd(deepSearch(products.data, searchTerm));

        // const filteredProducts = products.data.filter((product: { rating: number; ethnic_type: string; }) =>
        //   product.rating >= (value || 4.0) && (selectedCategory ? product.ethnic_type === selectedCategory : true)
        // );
        // setAllItemsProd(filteredProducts);
        // setClosestProd(getClosestProducts(filteredProducts));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [value, selectedCategory]);

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
          style={styles.backButton}
        ><BackChevron style={styles.backButton} width={15} height={15} /></Pressable>
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
                  pressed ? styles.recentSearchPressed : null
                ]}
              >
                {({ pressed }) => (
                  <>
                    <RecentSearchIcon
                      width={20}
                      height={20}
                      fill={'#000000'} // Apply fill color conditionally
                    />
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
                    pressed ? styles.popularSearchPressed : null
                  ]}
                  onPress={() => handlePopularSearchPress(item.name)}
                >
                  {({ pressed }) => (
                    <Text style={pressed ? styles.popularSearchTextPressed : styles.popularSearchText}>
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
                <Pressable onPress={() => setSelectedCategory(selectedCategory === item.name ? null : item.name)}>
                  <View style={styles.cuisineItem}>
                    <Image source={item.image} style={styles.cuisineImage} />
                    <Text style={[
                      styles.cuisineName,
                      selectedCategory === item.name ? styles.selectedCuisineName : null
                    ]}>
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
              placeholder='Ratings 4.0+'
              showArrowIcon={false}
              showTickIcon={false}
              dropDownDirection="BOTTOM"
              style={styles.dropDownPicker}
              textStyle={styles.dropDownPickerText}
              containerStyle={styles.dropDownContainer}
              dropDownContainerStyle={styles.dropDownListContainer}
              listItemLabelStyle={styles.dropDownListItemText}
              itemSeparator
              itemSeparatorStyle={styles.dropDownSeparator}
            />
          </View>

          <FlatList
            data={prod}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <ProductLarge image={item.images[0].image_url} name={item.name} category={item.ethnic_type} distance={`${item.auto_delivery_time} min away`} rating={item.rating} />
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
  recentSearchIconPressed: {
    tintColor: '#BF1E2E',
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
  dropDownPicker: {
    backgroundColor: '#BF1E2E',
    width: 100,
    borderColor: '#EEEEEE',
    borderRadius: 15,
    minHeight: 35,
  },
  dropDownPickerText: {
    fontSize: 12,
    fontFamily: 'TT Chocolates Trial Medium',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  dropDownContainer: {
    width: 'auto',
  },
  dropDownListContainer: {
    width: 100,
    borderColor: '#EEEEEE',
    borderRadius: 20,
    marginTop: 10,
  },
  dropDownListItemText: {
    fontSize: 12,
    fontFamily: 'TT Chocolates Trial Medium',
    color: '#000000',
    textAlign: 'center',
  },
  dropDownSeparator: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginHorizontal: 10,
  },


});
