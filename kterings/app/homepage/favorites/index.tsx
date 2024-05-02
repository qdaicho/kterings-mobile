import { View, Text, StyleSheet, Image } from 'react-native'
import React, { useState } from 'react'
import DropDownPicker from 'react-native-dropdown-picker';
import BackButton from '@/components/common/BackButton';
import { router } from 'expo-router';
import { SvgUri } from 'react-native-svg';
import Sara from '@assets/images/sara_delight.svg';
import Donuts from '@assets/images/just_donuts.svg';
import Indian from '@assets/images/indian_taste.svg';
import Foodstop from '@assets/images/local_foodstop.svg';
import AllRamen from '@assets/images/all_things_ramen.svg';
export default function favorites() {

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    {
      label: "Ratings 1.0+",
      value: 1.0,
    },
    {
      label: "Ratings 2.0+",
      value: 2.0,
    },
    {
      label: "Ratings 3.0+",
      value: 3.0,
    },
    {
      label: "Ratings 4.0+",
      value: 4.0,
    },
  ]);

  const favoriteKterers = [
    {
      label: 'Sara\'s Delights',
      image: Sara
    },
    {
      label: 'Just Donuts',
      image: Donuts
    },
    {
      label: 'Indian Taste',
      image: Indian
    },
    {
      label: 'Local Foodstop',
      image: Foodstop
    },
    {
      label: 'All Things Ramen',
      image: AllRamen
    }
  ]
  return (
    <>
      <BackButton
        onPress={() => router.back()}
        buttonStyle={styles.backButton}
      />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Saved Kterers</Text>
          <DropDownPicker
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            placeholder='Ratings 4.0+'
            showArrowIcon={false}
            showTickIcon={false}
            dropDownDirection="BOTTOM"
            style={{
              backgroundColor: '#BF1E2E',
              width: 100,
              borderColor: '#EEEEEE',
              // borderRadius: 35,
              borderStartEndRadius: 35,
              borderStartStartRadius: 35,
              borderEndEndRadius: 35,
              borderEndStartRadius: 35,
              minHeight: 35,
            }}
            textStyle={{
              fontSize: 12,
              fontFamily: 'TT Chocolates Trial Medium',
              color: '#FFFFFF',
              textAlign: 'center',
            }}
            containerStyle={{ width: 'auto' }}
            dropDownContainerStyle={{
              width: 100,
              borderColor: '#EEEEEE',
              // borderRadius: 20,
              marginTop: 10,
              borderStartEndRadius: 20,
              borderStartStartRadius: 20,
              borderEndEndRadius: 20,
              borderEndStartRadius: 20,
            }}
            listItemLabelStyle={{
              fontSize: 12,
              fontFamily: 'TT Chocolates Trial Medium',
              color: '#000000',
              textAlign: 'center',
            }}
            itemSeparator={true}
            itemSeparatorStyle={{ height: 1, backgroundColor: '#EEEEEE', marginHorizontal: 10 }}
          />
        </View>

        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'flex-start',
            marginHorizontal: 20,
            marginTop: 50,
            justifyContent: 'space-evenly', // Allow wrap to work properly
            alignSelf: 'center',
          }}
        >
          {favoriteKterers.map((kterer, index) => (
            <View
              key={index}
              style={{
                flexDirection: 'column',
                alignItems: 'center',
                // padding: 5,
                // marginRight: 10, // Optional: Space between items
                marginBottom: 50, // Optional: Space between rows
                width: 'auto', // Allow natural wrapping
              }}
            >
              <kterer.image width={60} height={60} />
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: 'TT Chocolates Trial Bold',
                  color: '#000000',
                  textAlign: 'center', // Ensure the text is centered
                  width: 'auto', // Allow natural wrapping
                }}
              >
                {kterer.label}
              </Text>
            </View>
          ))}
        </View>

      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 30,
    marginTop: 110,
  },
  headerText: {
    fontSize: 15,
    fontFamily: 'TT Chocolates Trial Bold',
    color: '#000000',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 30,
    zIndex: 2,
  },
})