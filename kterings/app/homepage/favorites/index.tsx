import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Pressable, FlatList, RefreshControl, Dimensions } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import BackButton from '@/components/common/BackButton';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Kterer } from '@/hooks/types';


export default function Favorites() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<number | null>(1.0);
  const [items, setItems] = useState([
    { label: "Ratings 1.0+", value: 1.0 },
    { label: "Ratings 2.0+", value: 2.0 },
    { label: "Ratings 3.0+", value: 3.0 },
    { label: "Ratings 4.0+", value: 4.0 },
  ]);
  const [favoriteKterers, setFavoriteKterers] = useState<Kterer[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchFavorites = async () => {
    try {
      const token = await SecureStore.getItemAsync('token');
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/favourites`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch favorites');
      }

      const data = await response.json();
      setFavoriteKterers(data.kterers);
    } catch (error) {
      console.error('Error fetching favorite Kterers:', error);
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

  const filteredKterers = favoriteKterers.filter(kterer => kterer.rating >= (value || 4.0));

  const handleKtererPress = (id: number) => {
    router.push({ pathname: '/sellerpage/', params: { id: id } });
  };

  const renderFavoriteKterer = ({ item }: { item: Kterer }) => (
    <Pressable key={item.id} style={styles.ktererContainer} onPress={() => handleKtererPress(item.id)}>
      <Image source={{ uri: item.profile_image_url }} style={styles.ktererImage} />
      <Text style={styles.ktererLabel}>{item.user.first_name} {item.user.last_name}</Text>
      <Text style={styles.ktererRating}>Rating: {item.rating}</Text>
    </Pressable>
  );

  return (
    <>
      <BackButton
        onPress={() => router.navigate("/homepage")}
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
            placeholder='Ratings 4.0+'
            showArrowIcon={false}
            showTickIcon={false}
            dropDownDirection="BOTTOM"
            style={{
              backgroundColor: '#BF1E2E',
              width: 100,
              borderColor: '#EEEEEE',
              borderStartEndRadius: 35,
              borderStartStartRadius: 35,
              borderEndEndRadius: 35,
              borderEndStartRadius: 35,
              minHeight: 35,
              zIndex: 2
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
              borderStartEndRadius: 20,
              borderStartStartRadius: 20,
              borderEndEndRadius: 20,
              borderEndStartRadius: 20,
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
          contentContainerStyle={styles.kterersContainer}
          data={filteredKterers}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderFavoriteKterer}
          numColumns={3}
          columnWrapperStyle={styles.columnWrapper}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 30,
    marginTop: 110,
    zIndex: 2
  },
  headerText: {
    fontSize: 15,
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
    marginTop: 50,
    justifyContent: 'space-evenly',
    alignSelf: 'center',
    zIndex: 0,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  ktererContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 50,
    width: Dimensions.get('window').width / 3 - 10,
  },
  ktererImage: {
    width: 100,
    height: 100,
  },
  ktererLabel: {
    fontSize: 12,
    fontFamily: 'TT Chocolates Trial Bold',
    color: '#000000',
    textAlign: 'center',
    width: 'auto',
    marginTop: 20,
  },
  ktererRating: {
    fontSize: 10,
    fontFamily: 'TT Chocolates Trial Medium',
    color: '#969696',
    textAlign: 'center',
  },
});
