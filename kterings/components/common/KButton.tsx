import React, { useState } from 'react';
import { Pressable, Text, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';

interface KButtonProps {
  onPress: () => void;
  title: string;
  buttonStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const KButton: React.FC<KButtonProps> = ({ onPress, title, buttonStyle, textStyle }) => {
  const [isPressed, setIsPressed] = useState(false); // State to track if the button is pressed

  return (
    <Pressable
      style={[
        styles.button,
        buttonStyle,
        isPressed ? styles.buttonPressed : null, // Apply style when pressed
      ]}
      onPress={onPress}
      onPressIn={() => setIsPressed(true)} // When button is pressed
      onPressOut={() => setIsPressed(false)} // When button is released
    >
      <Text
        style={[
          styles.text,
          textStyle,
          isPressed ? styles.textPressed : null, // Change text color when pressed
        ]}
      >
        {title}
      </Text>
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
  buttonPressed: {
    backgroundColor: '#EFEFF0', // Color when pressed
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
  textPressed: {
    color: '#969696', // Text color when pressed
  },
});

export default KButton;
