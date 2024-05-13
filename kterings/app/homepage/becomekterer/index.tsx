import React from 'react';
import { View, Text, Pressable, StyleSheet, StatusBar, Modal, Alert } from 'react-native';
import { DrawerActions } from '@react-navigation/native';
import { router, useNavigation } from 'expo-router';
import { AntDesign, Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { FlatList } from 'react-native';
import KtererProduct from '@/components/common/KtererProduct';
import { products } from '@/assets/products';

export default function BecomeKterer() {
  const navigation = useNavigation();

  const DATA = [
    {
      title: 'Your Posts',
      data: products,
    },
    {
      title: 'Past Posts',
      data: products,
    },
  ];

  const [modalVisible, setModalVisible] = React.useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>

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
            <Text style={{ fontFamily: 'TT Chocolates Trial Bold', fontSize: 16, marginBottom: 5, textAlign: 'center', width: 200 }}>Are you sure you want to delete this item?</Text>
            <Text
              style={{
                ...styles.modalText,
                width: 300, // Constrain the text width to the image width
                textAlign: 'center', // Optional: Align the text within the given width
                padding: 10, // Optional: Add padding for spacing
              }}
            >
              This action cannot be undone. This will permanently delete the post.
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

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 70, marginHorizontal: 30 }}>
        <Entypo name="menu" size={40} color="#BF1E2E" onPress={() => navigation.dispatch(DrawerActions.openDrawer())} />
        <Text style={{ fontSize: 15, fontFamily: 'TT Chocolates Trial Bold', color: '#000000', marginLeft: 20 }}>Kterer Dashboard</Text>
        <Pressable onPress={() => router.navigate('/notifications')}>
          <MaterialCommunityIcons name="bell-outline" size={24} color="#BF1E2E" style={{ marginRight: 20 }} />
        </Pressable>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 30 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
          <Pressable
            onPress={() => router.navigate('/kearnings/')}
            style={{ backgroundColor: '#B81D2C', borderRadius: 10, paddingHorizontal: 20, paddingVertical: 10, flexDirection: 'row', alignItems: 'center' }}>
            <FontAwesome6 name="hand-holding-dollar" size={24} color="#FFFFFF" />
            <Text style={{ fontSize: 12, fontFamily: 'TT Chocolates Trial Bold', color: '#FFFFFF', marginLeft: 5 }}>Earnings</Text>
          </Pressable>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Pressable
            onPress={() => router.navigate('/kpostfood/')}
            style={{ backgroundColor: '#000000', borderRadius: 10, paddingHorizontal: 20, paddingVertical: 10, flexDirection: 'row', alignItems: 'center' }}>
            <Feather name="plus-circle" size={24} color="#FFFFFF" />
            <Text style={{ fontSize: 12, fontFamily: 'TT Chocolates Trial Bold', color: '#FFFFFF', marginLeft: 5 }}>Post Food</Text>
          </Pressable>
        </View>
      </View>

      <FlatList
        data={DATA}
        keyExtractor={(item, index) => `${item.title}-${index}`}
        renderItem={({ item }) => (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>{item.title}</Text>
            <FlatList
              data={item.data}
              keyExtractor={(item, index) => `${item.name}-${index}`}
              renderItem={({ item }) => (
                <KtererProduct name={item.name} image={item.image} category={item.category} distance={item.distance} rating={item.rating} onTrashPress={() => setModalVisible(true)} />
              )}
              numColumns={2} // Render items in two columns
              showsVerticalScrollIndicator={false}
            />
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'TT Chocolates Trial Bold',
    color: '#000000',
    marginBottom: 10,
    marginTop: 20,
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
