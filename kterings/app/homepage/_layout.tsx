import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { Dimensions } from 'react-native';
import SideDrawer from '@/components/screens/SideDrawer';
import Order from '@assets/images/orders_icon.svg';
import Account from '@assets/images/account_icon.svg';
import Heart from '@assets/images/heart_icon.svg';
import Support from '@assets/images/support_icon.svg';
import Star from '@assets/images/star_icon.svg';

export default function Layout() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Drawer
                screenOptions={{
                    drawerStyle: { width: Dimensions.get('window').width, },
                    // headerStyle: {backgroundColor: '#FF0000'},
                    drawerLabelStyle: { color: 'black', fontSize: 14, fontFamily: 'TT Chocolates Trial Medium' },
                    drawerLabel(props) {
                        return props.focused ? props.color : 'red';
                    },
                    drawerActiveTintColor: '#BF1E2E',
                    drawerActiveBackgroundColor: '#FFFFFF',
                    drawerInactiveTintColor: '#000000',
                    drawerInactiveBackgroundColor: '#FFFFFF',
                    headerShown: false,
                    // headerTintColor: 'red',
                    // header
                }}

                drawerContent={SideDrawer}

            >
                <Drawer.Screen
                    name="index" // This is the name of the page and must match the url from root
                    options={{
                        drawerLabel: '',
                        title: '',

                    }}
                />
                <Drawer.Screen
                    name="orders/index" // This is the name of the page and must match the url from root
                    options={{
                        drawerLabel: 'Orders',
                        title: 'Orders',
                        drawerIcon: ({ focused, color, size }) => <Order color={focused ? '#BF1E2E' : '#000000'} />,
                    }}
                />
                <Drawer.Screen
                    name="account/index" // This is the name of the page and must match the url from root
                    options={{
                        drawerLabel: 'Account',
                        title: 'Account',
                        drawerIcon: () => <Account />
                    }}
                />
                <Drawer.Screen
                    name="favorites/index" // This is the name of the page and must match the url from root
                    options={{
                        drawerLabel: 'Saved Kterers',
                        title: 'Saved Kterers',
                        drawerIcon: () => <Heart />
                    }}
                />
                <Drawer.Screen
                    name="support/index" // This is the name of the page and must match the url from root
                    options={{
                        drawerLabel: 'Help and Support',
                        title: 'Help and Support',
                        drawerIcon: () => <Support />
                    }}
                />
                <Drawer.Screen
                    name="becomekterer/index" // This is the name of the page and must match the url from root
                    options={{
                        drawerLabel: 'I want to become a Kterer',
                        title: 'I want to become a Kterer',
                        drawerIcon: () => <Star />
                    }}
                />
            </Drawer>
        </GestureHandlerRootView>
    );
}
