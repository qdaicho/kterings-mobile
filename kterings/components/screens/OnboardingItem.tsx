import React from 'react';
import { StyleSheet, Text, View, Image, useWindowDimensions } from 'react-native';

interface OnboardingItemProps {
  item: {
    id: number;
    text: string;
    textRed: string;
    textGray: string;
    image: number;
  };
}

const OnboardingItem: React.FC<OnboardingItemProps> = ({ item }) => {
  const { width } = useWindowDimensions();

  const indexOfTextRed = item.text.indexOf(item.textRed);

  const textBeforeRed = item.text.substring(0, indexOfTextRed);
  const textAfterRed = item.text.substring(indexOfTextRed + item.textRed.length);

  return (
    <View style={[styles.container, { width }]}>
      <Image source={item.image} style={[styles.image, { width, resizeMode: 'contain' }]} />
      <View style={styles.textContainer}>
        <Text style={styles.text}>
          {textBeforeRed}
          <Text style={styles.textRed}>{item.textRed}</Text>
          {textAfterRed}
        </Text>
        <Text style={styles.textGray}>{item.textGray}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: 141,
    width: 161,
  },
  textContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  text: {
    color: '#3B3B3B',
    fontFamily: 'TT Chocolates Trial Bold',
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: 0,
    lineHeight: 38,
    textAlign: 'center',
  },
  textRed: {
    color: '#BF1E2E',
    fontFamily: 'TT Chocolates Trial Bold',
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: 0,
    lineHeight: 38,
    textAlign: 'center',
  },
  textGray: {
    color: '#969696',
    fontFamily: 'TT Chocolates Trial Regular',
    fontSize: 22,
    fontWeight: '500',
    letterSpacing: 0,
    lineHeight: 29,
    textAlign: 'center',
  },
});

export default OnboardingItem;
