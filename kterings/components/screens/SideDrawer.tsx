import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'
import { DrawerContent, DrawerContentComponentProps, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import BackButton from '../common/BackButton';
import { useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import BackChevron from '@assets/images/back_chevron.svg';
import Logout from '@assets/images/logout_icon.svg';
import { useClerk } from '@clerk/clerk-expo';
export default function SideDrawer(props: DrawerContentComponentProps) {
    const router = useRouter();
    const { user } = useClerk();

    return (
        <View style={styles.drawerContent}>
            {/* <BackButton onPress={() => { console.log('pressed') }} buttonStyle={styles.backButton} />
            <Text style={{ fontSize: 16, fontFamily: 'TT Chocolates Trial Bold', color: '#000000', marginLeft: 20 }}>{user?.fullName}</Text> */}

            <DrawerContentScrollView {...props} scrollEnabled={false} style={{}}>
                <DrawerItem
                    label="Back"
                    onPress={() => { props.navigation.closeDrawer(); }}
                    labelStyle={{
                        color: '#000000',
                        fontFamily: "TT Chocolates Trial Bold",
                        fontSize: 16,
                        letterSpacing: 0,
                        fontWeight: '500',
                        rowGap: 0
                    }}
                    icon={() => <BackChevron />}
                    style={{ marginBottom: 20 }}
                />
                <Text style={{ fontSize: 16, fontFamily: 'TT Chocolates Trial Bold', color: '#000000', marginLeft: 20, marginBottom: 20 }}>{user?.fullName}</Text>
                <DrawerItemList {...props} />
            </DrawerContentScrollView>
            <DrawerItem
                label="Log Out"
                onPress={() => router.navigate('/login')}
                labelStyle={{ fontSize: 14, fontFamily: 'TT Chocolates Trial Medium', color: '#000000' }}
                style={{ marginBottom: 30, }}
                icon={() => <Logout />}
            />

        </View>
    )
}

const styles = StyleSheet.create({
    drawerContent: {
        flex: 1,
        marginLeft: 20
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20
    }
})