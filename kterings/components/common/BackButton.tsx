import React from 'react';
import { Pressable, Text, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';
import BackChevron from "@assets/images/back_chevron.svg";


interface BackButtonProps {
  onPress: () => void;
  buttonStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const BackButton: React.FC<BackButtonProps> = ({ onPress, buttonStyle, textStyle }) => {
  return (
    <Pressable style={[styles.button, buttonStyle]} onPress={onPress}>
      <BackChevron width={15} height={15} />
      <Text style={[styles.back, textStyle]}>Back</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  back: {
    color: '#000000',
    fontFamily: "TT Chocolates Trial Bold",
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0,
    lineHeight: 38,
    marginLeft: 5
  },
  button: {
    flexDirection: 'row', 
    alignItems: 'center'
  }
});

export default BackButton;

