import React, { useState } from 'react';
import { Pressable, Text, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

interface BackButtonProps {
  onPress: () => void;
  buttonStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  color?: string;
}

const BackButton: React.FC<BackButtonProps> = ({
  onPress,
  buttonStyle,
  textStyle,
  color = '#000000',
}) => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <Pressable
      style={[
        styles.button,
        buttonStyle,
        isPressed ? styles.buttonPressed : null, // Apply styles when pressed
      ]}
      onPress={onPress}
      onPressIn={() => setIsPressed(true)} // Set state to pressed
      onPressOut={() => setIsPressed(false)} // Reset state when released
    >
      <FontAwesome5
        name="chevron-left"
        size={24}
        color={isPressed ? '#969696' : color} // Change icon color on press
      />
      <Text
        style={[
          styles.back,
          textStyle,
          isPressed ? styles.textPressed : null, // Change text color on press
        ]}
      >
        Back
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10, // Additional padding for comfort
  },
  buttonPressed: {
    backgroundColor: '#EFEFF0', // Background color when pressed
    borderRadius: 10, // Slight rounding when pressed
  },
  back: {
    color: '#000000',
    fontFamily: 'TT Chocolates Trial Bold',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  textPressed: {
    color: '#969696', // Text color when pressed
  },
});

export default BackButton;
