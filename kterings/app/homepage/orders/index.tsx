import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Image, Pressable, FlatList, RefreshControl, Animated } from 'react-native';
import BackButton from '@/components/common/BackButton';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { WebView } from 'react-native-webview';
import { Food, Order } from '@/hooks/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  };
  return date.toLocaleTimeString(undefined, options);
};

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [webViewVisible, setWebViewVisible] = useState(false);
  const [webViewUrl, setWebViewUrl] = useState<string | null>(null);

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
        const sortedOrders = data.orders.sort((a: Order, b: Order) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        setOrders(sortedOrders);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchFoodImage = async (foodId: string) => {
    try {
      const accessToken = await SecureStore.getItemAsync("token");
      const apiURL = process.env.EXPO_PUBLIC_API_URL;
      const response = await fetch(`${apiURL}/food/${foodId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      if (response.ok && data.data.images.length > 0) {
        return data.data.images[0].image_url;
      } else {
        console.error("Failed to fetch food image");
        return null;
      }
    } catch (error) {
      console.error("Failed to fetch food image", error);
      return null;
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchOrders();
  }, []);

  const filterOrders = () => {
    const activeOrders = orders.filter(order =>
      order.status !== 'cancelled' &&
      order.status !== 'delivered' &&
      order.status !== 'progress' &&
      order.receipt_url &&
      order.track_url
    );

    const pastOrders = orders.filter(order =>
      (order.status === 'cancelled' || order.status === 'delivered') &&
      order.receipt_url &&
      order.track_url
    );

    return { activeOrders, pastOrders };
  };

  const { activeOrders, pastOrders } = filterOrders();

  const openWebView = (url: string) => {
    setWebViewUrl(url);
    setWebViewVisible(true);
  };

  const closeWebView = () => {
    setWebViewVisible(false);
    setWebViewUrl(null);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingText />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {webViewVisible && webViewUrl ? (
        <View style={{ flex: 1 }}>
          <WebView source={{ uri: webViewUrl }} style={{ marginTop: 50, marginHorizontal: 30, marginBottom: 20 }} />
          <Pressable style={styles.closeButton} onPress={closeWebView}>
            <Text style={styles.closeButtonText}>Close</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <BackButton
            onPress={() => router.navigate('/homepage/')}
            buttonStyle={styles.backButton}
          />
          <View style={{ flex: 1, marginHorizontal: 30, flexDirection: 'column', backgroundColor: '#FFFFFF' }}>
            <Text style={{ fontSize: 20, fontFamily: 'TT Chocolates Trial Bold', color: '#000000', marginTop: 100 }}>
              Active Orders
            </Text>
            <FlatList
              data={activeOrders}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <ProductRow
                  orderId={item.id}
                  productName={item.items[0]?.name || 'Unknown'}
                  status={item.status}
                  price={item.total_price}
                  createdAt={item.created_at}
                  receiptUrl={item.receipt_url}
                  trackUrl={item.track_url}
                  foodId={item.items[0]?.food_id || ''}
                  openWebView={openWebView}
                  fetchFoodImage={fetchFoodImage}
                  orders={orders}
                />
              )}
              ListEmptyComponent={<Text>No active orders</Text>}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            />
            <Text style={{ fontSize: 20, fontFamily: 'TT Chocolates Trial Bold', color: '#000000', marginTop: 10 }}>
              Past Orders
            </Text>
            <FlatList
              data={pastOrders}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <ProductRow
                  orderId={item.id}
                  productName={item.items[0]?.name || 'Unknown'}
                  status={item.status}
                  price={item.total_price}
                  createdAt={item.created_at}
                  receiptUrl={item.receipt_url}
                  trackUrl={item.track_url}
                  foodId={item.items[0]?.food_id || ''}
                  openWebView={openWebView}
                  fetchFoodImage={fetchFoodImage}
                  orders={orders}
                />
              )}
              ListEmptyComponent={<Text>No past orders</Text>}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            />
          </View>
        </>
      )}
    </View>
  );
};

const LoadingText: React.FC = () => {
  const dot1 = useState(new Animated.Value(0))[0];
  const dot2 = useState(new Animated.Value(0))[0];
  const dot3 = useState(new Animated.Value(0))[0];

  const animateDots = () => {
    Animated.sequence([
      Animated.timing(dot1, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.timing(dot2, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.timing(dot3, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.timing(dot1, { toValue: 0, duration: 300, useNativeDriver: true }),
      Animated.timing(dot2, { toValue: 0, duration: 300, useNativeDriver: true }),
      Animated.timing(dot3, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start(() => animateDots());
  };

  useEffect(() => {
    animateDots();
  }, []);

  return (
    <View style={styles.loadingTextContainer}>
      <Text style={styles.loadingText}>Loading your Orders</Text>
      <View style={styles.dotsContainer}>
        <Animated.Text style={[styles.dot, { opacity: dot1 }]}>.</Animated.Text>
        <Animated.Text style={[styles.dot, { opacity: dot2 }]}>.</Animated.Text>
        <Animated.Text style={[styles.dot, { opacity: dot3 }]}>.</Animated.Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
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
  createdAtText: {
    fontSize: 10,
    fontFamily: 'TT Chocolates Trial Regular',
    color: '#666666',
    marginTop: 5,
  },
  closeButton: {
    position: 'absolute',
    bottom: 50,
    right: 15,
    backgroundColor: '#BF1E2E',
    padding: 10,
    borderRadius: 10,
    zIndex: 2,
  },
  closeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'TT Chocolates Trial Bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 20,
    fontFamily: 'TT Chocolates Trial Bold',
    color: '#000000',
  },
  dotsContainer: {
    flexDirection: 'row',
    marginLeft: 5,
  },
  dot: {
    fontSize: 20,
    fontFamily: 'TT Chocolates Trial Bold',
    color: '#000000',
    marginLeft: 2,
  },
  skeletonContainer: {
    flex: 1,
    padding: 20,
  },
});

interface ProductRowProps {
  orderId: number;
  imageSource?: string;
  productName?: string;
  status?: string;
  receiptUrl?: string;
  trackUrl?: string;
  price?: number;
  createdAt?: string;
  foodId: string;
  openWebView: (url: string) => void;
  fetchFoodImage: (foodId: string) => Promise<string | null>;
  orders: Order[];
}

const ProductRow: React.FC<ProductRowProps> = ({
  orderId,
  productName = 'Unknown',
  status = 'Preparing Order',
  receiptUrl = '',
  trackUrl = '',
  price = 35.96,
  createdAt = '',
  foodId,
  openWebView,
  fetchFoodImage,
  orders,
}) => {
  const [imageSource, setImageSource] = useState<string | null>(null);

  useEffect(() => {
    const getImage = async () => {
      const imageUrl = await fetchFoodImage(foodId);
      setImageSource(imageUrl);
    };
    getImage();
  }, [foodId]);

  const handlePress = async () => {
    const currentOrder = orders.find(order => order.id === orderId);
    if (currentOrder) {
      await AsyncStorage.removeItem('current_order');
      await AsyncStorage.setItem('current_order', JSON.stringify(currentOrder));
      console.log(JSON.stringify(currentOrder, null, 2));
      router.push(`/receipts/`);
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.rowContainer,
        { backgroundColor: pressed ? '#d3d3d3' : 'white' },
      ]}
      onPress={handlePress}
    >
      <View style={styles.leftContainer}>
        {imageSource ? (
          <Image source={{ uri: imageSource }} style={styles.productImage} />
        ) : (
          <Image source={require('@assets/images/products/lasagna.jpg')} style={styles.productImage} />
        )}
        <View style={styles.infoContainer}>
          <Text style={styles.productName}>ORDER-{orderId}</Text>
          <Text style={styles.statusText}>{status}</Text>
          <Text style={styles.createdAtText}>{formatDate(createdAt)}</Text>
          <Pressable onPress={() => openWebView(receiptUrl)}>
            <Text style={styles.receiptText}>View Receipt</Text>
          </Pressable>
        </View>
      </View>
      <Text style={styles.priceText}>${price.toFixed(2)}</Text>
    </Pressable>
  );
};

export default Orders;
