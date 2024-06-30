import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import BackButton from '@/components/common/BackButton';
import { router } from 'expo-router';
import { FlatList } from 'react-native-gesture-handler';
import NoNotifcations from "@assets/images/no_notifications.svg";
import ProductLarge from '@/components/common/ProductLarge';
import { products } from '@/assets/products';

// Sample JSON data for notifications
const sampleNotifications: any[] = [
  { id: 1, title: 'Valentine\'s Day', timestamp: '2 hours ago', message: 'We\'ve received your order for Valentine\'s Day', read: false },
  { id: 2, title: 'Delivery Advisory', timestamp: '1 day ago', message: 'Your delivery has been delayed. We apologize for the inconvenience.', read: false },
  { id: 3, title: 'Special Offer', timestamp: '3 days ago', message: 'Check out our special offer! Limited time only.', read: false },
  { id: 4, title: 'New Feature', timestamp: '1 week ago', message: 'We\'ve added a new feature to our app. Update now!', read: false },
  // Add more sample notifications as needed
];

interface Image {
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
  images: Image[];
  quantities: Quantity[];
  rating: number;
}

export default function Notifications() {

  const [prod, setProd] = useState<Food[]>([]);


  const getClosestProducts = (products: any[], maxDistance = 5) => {
    const sortedProducts = products.sort((a, b) => a.auto_delivery_time - b.auto_delivery_time);
    const closestCluster = [];
    let deviation = 0;

    for (let i = 0; i < sortedProducts.length; i++) {
      if (i === 0) {
        closestCluster.push(sortedProducts[i]);
      } else {
        const currentDeviation = Math.abs(sortedProducts[i].auto_delivery_time - sortedProducts[i - 1].auto_delivery_time);
        if (currentDeviation <= maxDistance) {
          closestCluster.push(sortedProducts[i]);
          deviation += currentDeviation;
        } else {
          break;
        }
      }
    }
    return closestCluster;
  };

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
        // Handle the fetched products here
        // console.log(products.data);
        setProd(products.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <BackButton onPress={() => router.back()} buttonStyle={styles.backButton} />
      <Text style={{ fontSize: 18, fontFamily: 'TT Chocolates Trial Bold', color: '#000000', marginTop: 120, marginBottom: 20 }}>Near You</Text>

      <FlatList
        data={getClosestProducts(prod)}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <ProductLarge image={item.images[0].image_url} name={item.name} category={item.ethnic_type} distance={`${item.auto_delivery_time} min away`} rating={item.rating} />
        )}
        style={{ marginTop: 10 }}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 30
  },
  backButton: {
    position: 'absolute',
    top: 50,
  }
});
