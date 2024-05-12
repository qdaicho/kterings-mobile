import { View, Text, StyleSheet, Pressable, Image, Modal, Alert, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import BackButton from '@/components/common/BackButton';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import KAddButton from '@/components/common/KAddButton';
import * as Location from 'expo-location';

export default function Account() {
  const [pressed, setPressed] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);



  return (
    <View style={{ backgroundColor: '#FFFFFF', flex: 1 }}>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>

          <View style={styles.modalView}>
            <AntDesign name="close" size={24} color="#969696" style={{ position: 'absolute', right: 10, top: 10 }} onPress={() => setModalVisible(!modalVisible)} />
            <Text style={{ fontFamily: 'TT Chocolates Trial Bold', fontSize: 16, marginBottom: 5, textAlign: 'center', width: 200 }}>Are you sure you want to delete your account?</Text>
            <Text
              style={{
                ...styles.modalText,
                width: 300, // Constrain the text width to the image width
                textAlign: 'center', // Optional: Align the text within the given width
                padding: 10, // Optional: Add padding for spacing
              }}
            >
              Once deleted, you may not be able to retrieve your information and other data associated with your account.
            </Text>


            <View style={{ height: 0.5, backgroundColor: '#969696', marginBottom: 10, width: 300 }}></View>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.textStyle}>Delete</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <BackButton
        onPress={() => router.navigate("/homepage/")}
        buttonStyle={styles.backButton}
      />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Personal Details </Text>
          <Pressable
            onPress={() => {
              router.push('/editdetails/');
            }}
            style={({ pressed }) => [
              styles.pressableBase,
              pressed && styles.pressablePressed, // Apply pressed style when pressed
            ]}
          ><Text style={styles.editText}>Edit Section</Text></Pressable>
        </View>
        <View style={styles.imageContainer}>
          <Pressable
            onPressIn={() => setPressed(true)}
            onPressOut={() => setPressed(false)}
            style={({ pressed }) => [styles.imageWrapper, { backgroundColor: pressed ? '#EFEFF0' : 'transparent' }]}
          >
            <Image source={require('@assets/images/logo.png')} style={styles.image} />
          </Pressable>

          <View style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 14, fontFamily: 'TT Chocolates Trial Medium', color: '#000000', marginTop: 10 }}>Sara Kterings</Text>
            <Text style={{ fontSize: 14, fontFamily: 'TT Chocolates Trial Medium', color: '#000000', marginTop: 10 }}>+14484576892</Text>
            <Text style={{ fontSize: 14, fontFamily: 'TT Chocolates Trial Medium', color: '#ABABAB', marginTop: 10 }}>kteringsaccount@gmail.com</Text>
            <Text style={{ fontSize: 14, fontFamily: 'TT Chocolates Trial Medium', color: '#000000', marginTop: 10 }}>*************</Text>
            <Text style={{ fontSize: 14, fontFamily: 'TT Chocolates Trial Medium', color: '#000000', marginTop: 10 }}>Canada</Text>
          </View>
        </View>
        <ScrollView>
          <View style={[styles.header, { marginTop: 20 }]}><Text style={styles.headerText}>Saved Addresses</Text></View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, alignItems: 'center' }}>
            <View>
              <Text style={{ fontSize: 13, fontFamily: 'TT Chocolates Trial Bold', color: '#000000' }}>Home</Text>
              <Text style={{ fontSize: 12, fontFamily: 'TT Chocolates Trial Medium', color: '#000000' }}>123 Kterings Lane, Kterings Drive, Windsor</Text>
            </View>
            <Pressable><MaterialCommunityIcons name="pencil" size={24} color="#BF1E2E" /></Pressable>
          </View>

          <View style={{ marginTop: 20 }}>
            <KAddButton onPress={() => router.push({
              pathname: '/addaddress/',
            })} title='Add New Address' />
          </View>

          <View style={[styles.header, { marginTop: 20 }]}><Text style={styles.headerText}>Payment Details</Text></View>
          <View style={{ flexDirection: 'row', marginTop: 20, alignItems: 'center' }}>
            <FontAwesome name="cc-stripe" size={35} color="#5433FF" />
            <Text style={{ fontSize: 13, fontFamily: 'TT Chocolates Trial Medium', color: '#969696', marginLeft: 20, fontStyle: 'italic' }}>Stripe Connected</Text>
          </View>

          <View style={{ marginTop: 20 }}>
            <KAddButton onPress={() => console.log('hello')} title='Add New Card' />
          </View>
        </ScrollView>
      </View>
      <Pressable style={{ ...styles.button, marginTop: 20 }} onPress={() => setModalVisible(true)}><Text style={styles.deleteButton}>Delete Account</Text></Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  pressableBase: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center', // Center align the text within the pressable
  },
  pressablePressed: {
    backgroundColor: '#dddddd', // A light grey background when pressed
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 30,
    zIndex: 2,
  },
  container: {
    flex: 1,
    marginHorizontal: 30,
    marginTop: 60,
    backgroundColor: '#FFFFFF',
  },
  header: {
    marginTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  headerText: {
    fontSize: 16,
    fontFamily: 'TT Chocolates Trial Bold',
    color: '#000000',
  },
  editText: {
    fontSize: 14,
    fontFamily: 'TT Chocolates Trial Medium',
    color: '#D10025',
  },
  imageContainer: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  imageWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50, // 100 / 2 for a circle
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
  },
  deleteButton: {
    fontSize: 14,
    fontFamily: 'TT Chocolates Trial Medium',
    color: '#BF1E2E',
    marginTop: 20,
    marginBottom: 50,
    alignSelf: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'rgba(242,242,242,0.96)',
    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    marginTop: 5
  },
  buttonOpen: {
    // backgroundColor: '#F194FF',
  },
  buttonClose: {
    // backgroundColor: '#2196F3',
  },
  textStyle: {
    color: '#2196F3',
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'TT Chocolates Trial Medium',
    fontSize: 16
  },
  modalText: {
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'TT Chocolates Trial Medium',
    fontSize: 12,
  },
});
