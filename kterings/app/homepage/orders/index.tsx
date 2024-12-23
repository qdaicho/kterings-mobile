import React, { useEffect, useState, useCallback, memo } from 'react';
import { View, Text, StyleSheet, Image, Pressable, FlatList, RefreshControl, Animated } from 'react-native';
import BackButton from '@/components/common/BackButton';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { WebView } from 'react-native-webview';
import { Order } from '@/hooks/types';
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
        await AsyncStorage.setItem('cachedOrders', JSON.stringify(sortedOrders)); // Cache the orders
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

  const loadCachedOrders = async () => {
    try {
      const cachedOrders = await AsyncStorage.getItem('cachedOrders');
      if (cachedOrders) {
        setOrders(JSON.parse(cachedOrders));
      }
    } catch (error) {
      console.error('Error loading cached orders:', error);
    }
  };

  useEffect(() => {
    loadCachedOrders().then(() => {
      if (orders.length === 0) fetchOrders(); // Fetch only if no cached orders
    });
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchOrders(); // Manually refresh the orders when the user pulls to refresh
  }, []);

  const filterOrders = () => {
    const activeOrders = orders.filter(order =>
      order.status !== 'cancelled' &&
      order.status !== 'delivered' &&
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
            onPress={() => router.back()}
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
                <MemoizedProductRow
                  order={item}
                  openWebView={openWebView}
                  fetchFoodImage={fetchFoodImage}
                  orders={orders}
                />
              )}
              initialNumToRender={10}
              maxToRenderPerBatch={5}
              windowSize={10}
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
                <MemoizedProductRow
                  order={item}
                  openWebView={openWebView}
                  fetchFoodImage={fetchFoodImage}
                  orders={orders}
                />
              )}
              initialNumToRender={10}
              maxToRenderPerBatch={5}
              windowSize={10}
              ListEmptyComponent={<Text>No past orders</Text>}
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
});

interface ProductRowProps {
  order: Order;
  openWebView: (url: string) => void;
  fetchFoodImage: (foodId: string) => Promise<string | null>;
  orders: Order[];
}

const ProductRow: React.FC<ProductRowProps> = memo(({
  order,
  openWebView,
  fetchFoodImage,
  orders,
}) => {
  const [imageSource, setImageSource] = useState<string | null>(null);

  useEffect(() => {
    const getImage = async () => {
      const imageUrl = await fetchFoodImage(order.items[0]?.food_id || '');
      setImageSource(imageUrl);
    };
    getImage();
  }, [order.items]);

  const handlePress = async () => {
    const currentOrder = orders.find(o => o.id === order.id);
    if (currentOrder) {
      await AsyncStorage.removeItem('current_order');
      await AsyncStorage.setItem('current_order', JSON.stringify(currentOrder));
      router.push(`/receipts`);
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
          <Text style={styles.productName}>ORDER-{order.id}</Text>
          <Text style={styles.statusText}>{order.status}</Text>
          <Text style={styles.createdAtText}>{formatDate(order.created_at)}</Text>
          <Pressable onPress={() => openWebView(order.receipt_url)}>
            <Text style={styles.receiptText}>View Receipt</Text>
          </Pressable>
        </View>
      </View>
      <Text style={styles.priceText}>${order.total_price.toFixed(2)}</Text>
    </Pressable>
  );
});

const MemoizedProductRow = memo(ProductRow);

export default Orders;
