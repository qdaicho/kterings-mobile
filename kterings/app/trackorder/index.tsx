import { View, Text, StyleSheet, ImageSourcePropType, Image, FlatList, VirtualizedList, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import BackButton from "@/components/common/BackButton";
import { router } from 'expo-router';
import PaymentImage from "@/assets/images/payment_img.svg";
import Motorcycle from "@assets/images/motorcycle_small.svg";
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import KBottomButton from '@/components/common/KBottomButton';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import KButton from '@/components/common/KButton';
import StepIndicator from 'react-native-step-indicator';
import { FontAwesome6 } from '@expo/vector-icons';
import ThumbsUp from "@/assets/images/thumbs_up.svg";
import { Feather } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
export default function index() {

    const labels = ["Order Received", "Preparing", "On the way", "Delivered"];
    const icons = [
        <Feather name="clock" size={24} color="#BF1E2E" />,
        <FontAwesome6 name="bell-concierge" size={24} color="#BF1E2E" />,
        <Feather name="truck" size={24} color="#BF1E2E" />,
        <AntDesign name="home" size={24} color="#BF1E2E" />,
        <Ionicons name="checkmark-done" size={24} color="#BF1E2E" />
    ]
    const customStyles = {
        stepIndicatorSize: 40,
        currentStepIndicatorSize: 40,
        separatorStrokeWidth: 2,
        currentStepStrokeWidth: 0,
        stepStrokeCurrentColor: '#BF1E2E',
        stepStrokeWidth: 0,
        stepStrokeFinishedColor: '#BF1E2E',
        stepStrokeUnFinishedColor: '#aaaaaa',
        separatorFinishedColor: '#BF1E2E',
        separatorUnFinishedColor: '#aaaaaa',
        stepIndicatorFinishedColor: '#ffffff',
        stepIndicatorUnFinishedColor: '#ffffff',
        stepIndicatorCurrentColor: '#ffffff',
        stepIndicatorLabelFontSize: 13,
        currentStepIndicatorLabelFontSize: 13,
        stepIndicatorLabelCurrentColor: '#BF1E2E',
        stepIndicatorLabelFinishedColor: '#ffffff',
        stepIndicatorLabelUnFinishedColor: '#aaaaaa',
        labelColor: '#999999',
        labelSize: 13,
        currentStepLabelColor: '#BF1E2E',
    }

    return (
        <>
            <BackButton
                onPress={() => router.push({ pathname: "/homepage/", params: { orders: "true" } })}
                buttonStyle={styles.backButton}
            />
            <View style={{ flex: 1, marginHorizontal: 30, flexDirection: 'column', marginTop: 60, marginBottom: 60 }}>
                <Text style={{ fontSize: 16, fontFamily: 'TT Chocolates Trial Medium', color: '#BF1E2E', alignSelf: 'flex-end' }}>Help</Text>


                <View style={{ flexDirection: 'column', alignItems: 'center', marginTop: 30, gap: 10 }}>
                    <Text style={{ fontSize: 14, fontFamily: 'TT Chocolates Trial Regular', color: '#000000' }}>Order No.: 1367</Text>
                    <Text style={{ fontSize: 16, fontFamily: 'TT Chocolates Trial Bold', color: '#000000' }}>WE’VE GOT YOUR ORDER!</Text>
                    <Text style={{ fontSize: 14, fontFamily: 'TT Chocolates Trial Regular', color: '#9A9A9A', fontStyle: 'italic' }}>Arriving in 20-30 mins</Text>
                    <ThumbsUp width={200} height={200} />
                </View>

                <StepIndicator

                    currentPosition={2}
                    labels={labels}
                    renderLabel={labelProps =>
                        <View style={{ flexDirection: 'column', gap: 5, position: 'relative', left: 130 }}>
                            <Text style={{ fontSize: 14, fontFamily: 'TT Chocolates Trial Bold', color: labelProps.stepStatus === 'current' ? '#969696' : '#BF1E2E' }}>{labelProps.label}</Text>
                            {labelProps.stepStatus != 'current' && <Text style={{ fontSize: 14, fontFamily: 'TT Chocolates Trial Regular', color: '#969696' }}>9:40am, 16 Feb 2024</Text>}
                        </View>
                    }
                    renderStepIndicator={iconProps => {
                        // const iconColor = iconProps.stepStatus === 'current' ? '#969696' : iconProps.position > iconProps.currentPosition ? '#969696' : '#BF1E2E';
                        return React.cloneElement(icons[iconProps.position], { color: '#BF1E2E' });
                    }}

                    direction="vertical"
                    customStyles={customStyles}
                />
            </View>
        </>
    )
}

const styles = StyleSheet.create({

    backButton: {
        position: 'absolute',
        top: 50,
        left: 30,
        zIndex: 2,
    }

})