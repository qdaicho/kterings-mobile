import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import React from 'react';
import BackButton from '@/components/common/BackButton';
import { router } from 'expo-router';

export default function Orders() { // Changed to PascalCase for React components
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

        <ProductRow />

        <Text style={{ fontSize: 20, fontFamily: 'TT Chocolates Trial Bold', color: '#000000', marginTop: 30 }}>
          Past Orders
        </Text>

        <ProductRow status='Delivered on 9 Feb, 10:30' productName='Burger' price={22.98} />
        <ProductRow status='Delivered on 7 Feb, 06:35' productName='Fries' price={9.99} />
        <ProductRow status='Delivered on 6 Feb, 06:00' productName='Soda' price={4.99} />
        <ProductRow status='Delivered on 5 Feb, 10:30' productName='Fries' price={9.99} />
      </View>
    </>
  );
}

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
  imageSource?: string; // Optional parameter for image source
  productName?: string; // Optional parameter for product name
  status?: string; // Optional parameter for order status
  receiptText?: string; // Optional parameter for receipt text
  price?: number; // Optional parameter for product price
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
