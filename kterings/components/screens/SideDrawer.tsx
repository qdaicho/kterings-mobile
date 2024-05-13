import { View, Text, StyleSheet } from 'react-native'
import React, { useRef } from 'react'
import { useRouter } from 'expo-router'
import { DrawerContent, DrawerContentComponentProps, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import BackButton from '../common/BackButton';
import { useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import BackChevron from '@assets/images/back_chevron.svg';
import Logout from '@assets/images/logout_icon.svg';
import { useClerk } from '@clerk/clerk-expo';
import RBSheet from 'react-native-raw-bottom-sheet';
import KButton from '../common/KButton';
export default function SideDrawer(props: DrawerContentComponentProps) {
    const router = useRouter();
    const { user, signOut } = useClerk();
    const refRBSheet = useRef<RBSheet>(null);

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
                onPress={() => {
                    router.push("/login/");
                    signOut();
                    refRBSheet.current && refRBSheet.current.open();
                }}
                labelStyle={{ fontSize: 14, fontFamily: 'TT Chocolates Trial Medium', color: '#000000' }}
                style={{ marginBottom: 30, }}
                icon={() => <Logout />}
            />

            <RBSheet
                ref={refRBSheet}
                animationType="slide"
                closeOnDragDown={true}
                closeOnPressMask={true}
                customStyles={{
                    container: {
                        borderWidth: 1,
                        borderColor: "#E9E9E9",
                        borderTopLeftRadius: 45,
                        borderTopRightRadius: 45,
                        height: 200,
                    },
                    wrapper: {
                        backgroundColor: "transparent",
                    },
                    draggableIcon: {
                        width: 100,
                        backgroundColor: "#E9E9E9",
                    },
                }}
            >
                <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between' }}>
                    <View style={{
                        marginLeft: 40,
                        marginRight: 40,
                    }}>
                        <Text style={{
                            color: '#000000',
                            fontFamily: 'TT Chocolates Trial Bold',
                            fontSize: 16,
                            fontWeight: '600',
                            letterSpacing: 0,
                            lineHeight: 29,
                            textAlign: 'left',
                        }}>Log Out</Text>
                        <Text style={{
                            color: '#000000',
                            fontFamily: 'TT Chocolates Trial Medium',
                            fontSize: 13,
                            fontWeight: '500',
                            letterSpacing: 0,
                            lineHeight: 21,
                        }}>Are you sure you want to log out?</Text>
                        <KButton
                            title="Confirm"
                            onPress={() => {
                                refRBSheet.current && refRBSheet.current.close();
                                signOut();
                                router.push("/login/");
                            }}
                            buttonStyle={{
                                marginTop: 20,
                                alignSelf: 'center'
                            }}
                            textStyle={{
                                fontSize: 16,
                            }}
                        />
                    </View>
                </View>
            </RBSheet>

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