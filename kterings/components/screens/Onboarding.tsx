import React, { useState, useRef } from 'react';
import { View, StyleSheet, FlatList, ViewToken } from 'react-native';
import KButton from '../common/KButton';
import PaginationDot from 'react-native-animated-pagination-dot';
import OnboardingItem from './OnboardingItem';

const text = [
    {
        id: 1,
        text: 'Homemade goodness delivered to you',
        textRed: 'you',
        textGray: 'Order delicious meals and we will deliver right to your home.',
        image: require('@assets/images/motorcycle.png'),
    },
    {
        id: 2,
        text: 'Discover new food items daily',
        textRed: 'daily',
        textGray: 'The selection can change everyday - surprise!',
        image: require('@assets/images/food.png'),
    },
    {
        id: 3,
        text: 'Ready for the Kterings experience?',
        textRed: 'Kterings',
        textGray: "You're just a tap away from experiencing magic!",
        image: require('@assets/images/logo.png'),
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
                renderItem={({ item }) => <OnboardingItem item={item} />}
                horizontal
                pagingEnabled
                keyExtractor={(item) => item.id.toString()}
                viewabilityConfig={viewConfig}
                scrollEventThrottle={32}
                onViewableItemsChanged={handleViewableItemsChanged}
            />
            <KButton
                title="Next"
                onPress={() => {
                    const nextPage = Math.min(curPage + 1, text.length - 1);
                    setCurPage(nextPage);
                    scrollToIndex(nextPage);
                }}
            />
            <PaginationDot activeDotColor={'black'} curPage={curPage} maxPage={text.length} sizeRatio={1} />

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // paddingLeft: 20,
        // paddingRight: 20,
    },
});

export default OnboardingComponent;
