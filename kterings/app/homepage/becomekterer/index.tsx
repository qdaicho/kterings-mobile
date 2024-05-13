import React from 'react';
import { View, Text, Pressable, StyleSheet, StatusBar } from 'react-native';
import { DrawerActions } from '@react-navigation/native';
import { router, useNavigation } from 'expo-router';
import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { FlatList } from 'react-native';
import KtererProduct from '@/components/common/KtererProduct';
import { products } from '@/assets/products';

export default function BecomeKterer() {
  const navigation = useNavigation();

  const DATA = [
    {
      title: 'Your Posts',
      data: products,
    },
    {
      title: 'Past Posts',
      data: products,
    },
  ];

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 70, marginHorizontal: 30 }}>
        <Entypo name="menu" size={40} color="#BF1E2E" onPress={() => navigation.dispatch(DrawerActions.openDrawer())} />
        <Text style={{ fontSize: 15, fontFamily: 'TT Chocolates Trial Bold', color: '#000000', marginLeft: 20 }}>Kterer Dashboard</Text>
        <Pressable onPress={() => router.navigate('/notifications')}>
          <MaterialCommunityIcons name="bell-outline" size={24} color="#BF1E2E" style={{ marginRight: 20 }} />
        </Pressable>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 30 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
          <Pressable style={{ backgroundColor: '#B81D2C', borderRadius: 10, paddingHorizontal: 20, paddingVertical: 10, flexDirection: 'row', alignItems: 'center' }}>
            <FontAwesome6 name="hand-holding-dollar" size={24} color="#FFFFFF" />
            <Text style={{ fontSize: 12, fontFamily: 'TT Chocolates Trial Bold', color: '#FFFFFF', marginLeft: 5 }}>Earnings</Text>
          </Pressable>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Pressable 
          onPress={() => router.navigate('/kpostfood/')}
          style={{ backgroundColor: '#000000', borderRadius: 10, paddingHorizontal: 20, paddingVertical: 10, flexDirection: 'row', alignItems: 'center' }}>
            <Feather name="plus-circle" size={24} color="#FFFFFF" />
            <Text style={{ fontSize: 12, fontFamily: 'TT Chocolates Trial Bold', color: '#FFFFFF', marginLeft: 5 }}>Post Food</Text>
          </Pressable>
        </View>
      </View>

      <FlatList
        data={DATA}
        keyExtractor={(item, index) => `${item.title}-${index}`}
        renderItem={({ item }) => (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>{item.title}</Text>
            <FlatList
              data={item.data}
              keyExtractor={(item, index) => `${item.name}-${index}`}
              renderItem={({ item }) => (
                <KtererProduct name={item.name} image={item.image} category={item.category} distance={item.distance} rating={item.rating} />
              )}
              numColumns={2} // Render items in two columns
              showsVerticalScrollIndicator={false}
            />
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'TT Chocolates Trial Bold',
    color: '#000000',
    marginBottom: 10,
    marginTop: 20,
  },
});
