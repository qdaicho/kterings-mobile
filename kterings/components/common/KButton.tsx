import React from 'react';
import { Pressable, Text, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';

interface KButtonProps {
  onPress: () => void;
  title: string;
  buttonStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const KButton: React.FC<KButtonProps> = ({ onPress, title, buttonStyle, textStyle }) => {
  return (
    <Pressable style={[styles.button, buttonStyle]} onPress={onPress}>
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 57,
    width: 259,
    borderRadius: 28,
    backgroundColor: '#BF1E2E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontFamily: 'TT Chocolates Trial Bold',
    fontSize: 23,
    fontWeight: '800',
    letterSpacing: 0,
    lineHeight: 38,
    textAlign: 'center',
  },
});

export default KButton;
