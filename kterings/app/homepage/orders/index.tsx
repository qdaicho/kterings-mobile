import { View, Text, StyleSheet, Image, Pressable, FlatList, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import BackButton from '@/components/common/BackButton';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: number;
  kterer_name: string;
  created_at: string;
  items: OrderItem[];
  total_price: number;
  total_items: number;
  track_url: string;
  receipt_url: string;
  status: string;
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const accessToken = await SecureStore.getItemAsync("token");
        const apiURL = process.env.EXPO_PUBLIC_API_URL;
        const response = await fetch(`${apiURL}/orders`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setOrders(data.orders);
          console.log(JSON.stringify(data.orders, null, 2));
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Failed to fetch orders", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <>
      <BackButton
        onPress={() => router.navigate('/homepage/')}
        buttonStyle={styles.backButton}
      />
      <View style={{ flex: 1, marginHorizontal: 30, flexDirection: 'column' }}>
        <Text style={{ fontSize: 20, fontFamily: 'TT Chocolates Trial Bold', color: '#000000', marginTop: 120 }}>
          Active Orders
        </Text>

        
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ProductRow
              productName={item.items[0]?.name || 'Unknown'}
              status={item.status}
              price={item.total_price}
            />
          )}
          ListEmptyComponent={<Text>No active orders</Text>}
        />

        <Text style={{ fontSize: 20, fontFamily: 'TT Chocolates Trial Bold', color: '#000000', marginTop: 30 }}>
          Past Orders
        </Text>

        <FlatList
          data={orders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ProductRow
              productName={item.items[0]?.name || 'Unknown'}
              status={item.status}
              price={item.total_price}
            />
          )}
          ListEmptyComponent={<Text>No past orders</Text>}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    top: 50,
    left: 30,
    zIndex: 2,
  },
  rowContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  infoContainer: {
    flexDirection: 'column',
    marginLeft: 15,
  },
  productName: {
    fontSize: 16,
    fontFamily: 'TT Chocolates Trial Bold',
    color: '#000000',
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'TT Chocolates Trial Regular',
    color: '#000000',
  },
  receiptText: {
    fontSize: 12,
    fontFamily: 'TT Chocolates Trial Regular',
    color: '#BF1E2E',
    marginTop: 5,
  },
  priceText: {
    fontSize: 16,
    fontFamily: 'TT Chocolates Trial Medium',
    color: '#000000',
    alignSelf: 'flex-start',
    marginTop: 5,
  },
});

interface ProductRowProps {
  imageSource?: string;
  productName?: string;
  status?: string;
  receiptText?: string;
  price?: number;
}

const ProductRow: React.FC<ProductRowProps> = ({
  imageSource = require('@assets/images/products/lasagna.jpg'),
  productName = 'Lasagna',
  status = 'Preparing Order',
  receiptText = 'View Receipt',
  price = 35.96,
}) => {
  return (
    <View style={styles.rowContainer}>
      <View style={styles.leftContainer}>
        <Image source={imageSource} style={styles.productImage} />
        <View style={styles.infoContainer}>
          <Text style={styles.productName}>{productName}</Text>
          <Text style={styles.statusText}>{status}</Text>
          <Pressable onPress={() => {router.push('/receipts/')}}>
            <Text style={styles.receiptText}>{receiptText}</Text>
          </Pressable>
        </View>
      </View>
      <Text style={styles.priceText}>${price.toFixed(2)}</Text>
    </View>
  );
};

export default Orders;
