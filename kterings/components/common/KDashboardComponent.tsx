import React from 'react';
import { View, Text } from 'react-native';
import KButton from './KButton'; // Assuming this is your custom button component
import { router } from 'expo-router';

const KDashboardComponent = () => {
    return (
        <View style={{
            flexDirection: 'column',
            justifyContent: 'space-between',
            marginTop: 30,
            // alignSelf: 'center',
            marginLeft: 25,
            borderRadius: 10,
            borderWidth: 0.2,
            borderColor: '#E5E5E5',
            width: '90%',
            padding: 10,
            backgroundColor: '#FFFFFF',
        }}>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
            }}>
                <View style={{
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    width: '70%',
                }}>
                    <Text style={{
                        fontSize: 10,
                        fontFamily: 'TT Chocolates Trial Regular',
                        color: '#000000',
                    }}>Order No. 36</Text>
                    <Text style={{
                        fontSize: 13,
                        fontFamily: 'TT Chocolates Trial Bold',
                        color: '#000000',
                        marginBottom: 5,
                    }}>Fluffy Pancakes</Text>
                    <Text style={{
                        fontSize: 12,
                        fontFamily: 'TT Chocolates Trial Medium',
                        color: '#000000',
                        marginBottom: 5,
                    }}>Customer: Charley Brown</Text>
                    <Text style={{
                        fontSize: 12,
                        fontFamily: 'TT Chocolates Trial Medium',
                        color: '#000000',
                        marginBottom: 5,
                    }}>Date: Feb 6, 2024</Text>
                </View>

                <Text style={{
                    fontSize: 14,
                    fontFamily: 'TT Chocolates Trial Bold',
                    color: '#000000',
                    alignSelf: 'center',
                }}>$37.76</Text>
            </View>

            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
                alignItems: 'center',
                marginTop: 15,
            }}>
                <Text style={{
                    fontSize: 12,
                    fontFamily: 'TT Chocolates Trial Medium',
                    color: '#BF1E2E',
                }}>View Receipt</Text>
                <KButton
                    buttonStyle={{
                        backgroundColor: '#B81D2C',
                        paddingHorizontal: 20,
                        paddingVertical: -10,
                        borderRadius: 40,
                        width: 'auto',
                        height: 'auto',
                    }}
                    textStyle={{
                        color: '#FFFFFF',
                        fontSize: 10,
                        fontFamily: 'TT Chocolates Trial Bold',
                    }}
                    title='Track Delivery'
                    onPress={() => router.navigate('/receipts/')}
                />
            </View>
        </View>
    );
};

export default KDashboardComponent;
