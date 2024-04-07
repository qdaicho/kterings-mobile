import React, { useState, useRef } from 'react';
import { View, StyleSheet, FlatList, ViewToken } from 'react-native';
import KButton from '../common/KButton';
import PaginationDot from 'react-native-animated-pagination-dot';
import OnboardingItem from './OnboardingItem';
import { router } from 'expo-router';
import Motorcycle from "@assets/images/motorcycle.svg";
import Food from "@assets/images/donuts_and_food.svg";
import Logo from "@assets/images/kterings_logo.svg";
import { SvgProps } from 'react-native-svg';

const text = [
    {
        id: 1,
        text: 'Homemade goodness\n delivered to you',
        textRed: 'you',
        textGray: 'Order delicious meals and we\n will deliver right to your home.',
        ImageComponent: Motorcycle, // Import the component directly
        button: 'Next'
    },
    {
        id: 2,
        text: 'Discover new food\n items daily',
        textRed: 'daily',
        textGray: 'The selection can change\n everyday - surprise!',
        ImageComponent: Food, // Import the component directly
        button: 'Next'
    },
    {
        id: 3,
        text: 'Ready for the\n Kterings experience?',
        textRed: 'Kterings',
        textGray: "You're just a tap away from\n experiencing magic!",
        ImageComponent: Logo, // Import the component directly
        button: 'Get Started'
    },
];

const OnboardingComponent: React.FC = () => {
    const [curPage, setCurPage] = useState(0);
    const flatListRef = useRef<FlatList>(null);
    const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

    const handleViewableItemsChanged = ({ viewableItems }: { viewableItems: ViewToken[] }) => {
        if (viewableItems.length > 0) {
            setCurPage(viewableItems[0].index || 0);
        }
    };

    const scrollToIndex = (index: number) => {
        if (flatListRef.current) {
            flatListRef.current.scrollToIndex({ animated: true, index });
        }
    };

    return (
        <View style={styles.container}>
            <FlatList
                ref={flatListRef}
                data={text}
                renderItem={
                    ({ item }) =>
                        <OnboardingItem
                            item={item}
                            onPress={() => {
                                const nextPage = Math.min(curPage + 1, text.length - 1);
                                setCurPage(nextPage);
                                scrollToIndex(nextPage);
                                if (curPage === text.length - 1) {
                                    router.navigate('/login/');
                                }
                            }}

                        />
                }
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                keyExtractor={(item) => item.id.toString()}
                viewabilityConfig={viewConfig}
                scrollEventThrottle={32}
                onViewableItemsChanged={handleViewableItemsChanged}
            />

            <PaginationDot activeDotColor={'black'} curPage={curPage} maxPage={text.length} sizeRatio={1} />

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        marginBottom: 80
    },
});

export default OnboardingComponent;
