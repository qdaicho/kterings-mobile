import React, { useState, useRef } from 'react';
import { View, StyleSheet, FlatList, ViewToken } from 'react-native';
import KButton from '../common/KButton';
import PaginationDot from 'react-native-animated-pagination-dot';
import OnboardingItem from './OnboardingItem';
import { router } from 'expo-router';

const text = [
    {
        id: 1,
        text: 'Homemade goodness\n delivered to you',
        textRed: 'you',
        textGray: 'Order delicious meals and we\n will deliver right to your home.',
        image: require('@assets/images/motorcycle.png'),
        button: 'Next'
    },
    {
        id: 2,
        text: 'Discover new food\n items daily',
        textRed: 'daily',
        textGray: 'The selection can change\n everyday - surprise!',
        image: require('@assets/images/food.png'),
        button: 'Next'
    },
    {
        id: 3,
        text: 'Ready for the\n Kterings experience?',
        textRed: 'Kterings',
        textGray: "You're just a tap away from\n experiencing magic!",
        image: require('@assets/images/logo.png'),
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
        // justifyContent: 'space-around',
        alignItems: 'center',
        marginBottom: 80
        // paddingLeft: 20,
        // paddingRight: 20,
    },
});

export default OnboardingComponent;
