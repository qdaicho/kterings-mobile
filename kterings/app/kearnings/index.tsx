import { View, Text, Pressable, StyleSheet, TextInput, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';
import { router, useNavigation } from 'expo-router';
import BackButton from "@/components/common/BackButton";
import KBottomButton from "@/components/common/KBottomButton";
import KButton from "@/components/common/KButton";
import KDashboardComponent from "@components/common/KDashboardComponent";
import DropDownPicker from 'react-native-dropdown-picker';

export default function index() {
    return (
        <View style={{ flex: 1, backgroundColor: '#BF1E2E', }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 70, marginHorizontal: 10 }}>
                {/* <Entypo name="menu" size={40} color="#BF1E2E" onPress={() => navigation.dispatch(DrawerActions.openDrawer())} /> */}
                <BackButton onPress={() => router.navigate('/homepage/becomekterer/')} textStyle={{ color: '#FFFFFF' }} color={'#FFFFFF'} />
                <Text style={{ fontSize: 15, fontFamily: 'TT Chocolates Trial Bold', color: '#FFFFFF' }}>Kterer Dashboard</Text>
                <Pressable onPress={() => console.log('Pressed')}>
                    <MaterialCommunityIcons name="bell-outline" size={24} color="#FFFFFF" style={{ marginRight: 20 }} />
                </Pressable>
            </View>

            <View style={{ flexDirection: 'column', justifyContent: 'center', marginTop: 30, alignItems: 'center' }}>
                <Text style={{ fontSize: 28, fontFamily: 'TT Chocolates Trial Bold', color: '#FFFFFF' }}>$289.45</Text>
                <Text style={{ fontSize: 12, fontFamily: 'TT Chocolates Trial Medium', color: '#FFFFFF', marginLeft: 10, marginRight: 10 }}>Today’s Total</Text>
            </View>

            <View style={{
                backgroundColor: '#FFFFFF',
                marginTop: 30,
                alignItems: 'flex-start',
                flex: 1,
                borderTopLeftRadius: 50,
                borderTopRightRadius: 50,
            }}>

                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    // alignItems: 'center',
                    marginTop: 30,
                    // marginHorizontal: 30,
                    alignSelf: 'center',
                    width: '80%',
                }}>
                    <Text style={{
                        fontSize: 16,
                        fontFamily: 'TT Chocolates Trial Bold',
                        color: '#000000',
                    }}>Earnings</Text>
                    <Text style={{
                        fontSize: 12,
                        fontFamily: 'TT Chocolates Trial Medium',
                        color: '#B81D2C',
                    }}>Edit Bank Info</Text>
                </View>

                <ScrollView style={{ flex: 1, marginVertical: 30 }}>
                    <Text style={{
                        fontSize: 16,
                        fontFamily: 'TT Chocolates Trial Bold',
                        color: '#000000',
                        width: '80%',
                        alignSelf: 'flex-start',
                        marginLeft: 40,
                        marginTop: 40,
                    }}>Orders</Text>


                    <Text style={{
                        fontSize: 15,
                        fontFamily: 'TT Chocolates Trial Bold',
                        color: '#000000',
                        width: '80%',
                        alignSelf: 'flex-start',
                        marginLeft: 40,
                        marginTop: 40,
                    }}>In Progress</Text>
                    <KDashboardComponent />

                    <Text style={{
                        fontSize: 15,
                        fontFamily: 'TT Chocolates Trial Bold',
                        color: '#000000',
                        width: '80%',
                        alignSelf: 'flex-start',
                        marginLeft: 40,
                        marginTop: 40,
                    }}>Open</Text>
                    <KDashboardComponent />

                    <Text style={{
                        fontSize: 15,
                        fontFamily: 'TT Chocolates Trial Bold',
                        color: '#000000',
                        width: '80%',
                        alignSelf: 'flex-start',
                        marginLeft: 40,
                        marginTop: 40,
                    }}>Completed</Text>

                    <KDashboardComponent />
                </ScrollView>
            </View>

        </View>
    )
}