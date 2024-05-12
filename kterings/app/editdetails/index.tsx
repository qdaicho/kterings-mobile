import { View, Text, StyleSheet, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import React from 'react';
import BackButton from '@/components/common/BackButton';
import { router } from 'expo-router';
import KBottomButton from '@/components/common/KBottomButton';
// Ensure these imports are correct

export default function PersonalDetails() {

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.mainContainer}>
        <BackButton
          onPress={() => router.navigate("/homepage/account")} // Ensure router.back() is a valid method
          buttonStyle={styles.backButton}
        />
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Edit Personal Details</Text>
          </View>


          <View style={{ flexDirection: 'column', justifyContent: 'space-between', marginTop: 30 }}>
            <View style={styles.formContainer}>
              <Text style={styles.formText}>First Name</Text>
              <TextInput style={styles.formInput} />
            </View>
            <View style={styles.formContainer}>
              <Text style={styles.formText}>Last Name</Text>
              <TextInput style={styles.formInput} />
            </View>
            <View style={styles.formContainer}>
              <Text style={styles.formText}>Mobile</Text>
              <TextInput style={styles.formInput} />
            </View>
            <View style={styles.formContainer}>
              <Text style={styles.formText}>Email</Text>
              <TextInput style={styles.formInput} />
            </View>
            <View style={styles.formContainer}>
              <Text style={styles.formText}>Password</Text>
              <TextInput style={[styles.formInput]} secureTextEntry />
            </View>
            <View style={styles.formContainer}>
              <Text style={styles.formText}>Country</Text>
              <TextInput style={styles.formInput} />
            </View>
          </View>

        </View>

        <KBottomButton title="Save Details" onPress={() => { console.log("Save Details");}}  buttonStyle={{marginTop: 30}}/>

      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: '#FFFFFF',
    flex: 1,
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
    marginTop: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  headerText: {
    fontSize: 16,
    fontFamily: 'TT Chocolates Trial Bold', // Ensure this font family is available
    color: '#000000',
  },
  formContainer: { flexDirection: 'row', marginBottom: 10, alignItems: 'center', gap: 20 },
  formText: { flex: 0.3, fontFamily: 'TT Chocolates Trial Medium', fontSize: 14, marginBottom: 5 },
  formInput: { flex: 0.7, backgroundColor: '#EBEBEB', borderRadius: 5, padding: 10, marginBottom: 10, width: 'auto' }
});
