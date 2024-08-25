import React, { useState } from 'react';
import { View, Text, Pressable, Modal, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import KButton from './KButton'; // Assuming this is your custom button component
import { KOrder } from '@/hooks/types'; // Adjust the import path as necessary

interface KDashboardComponentProps {
    order: KOrder;
}

const KDashboardComponent: React.FC<KDashboardComponentProps> = ({ order }) => {
    const [webViewVisible, setWebViewVisible] = useState(false);
    const [webViewUrl, setWebViewUrl] = useState<string | null>(null);

    const openWebView = (url: string) => {
        setWebViewUrl(url);
        setWebViewVisible(true);
    };

    const closeWebView = () => {
        setWebViewVisible(false);
        setWebViewUrl(null);
    };

    return (
        <View style={styles.orderContainer}>
            <View style={styles.orderDetails}>
                <View style={styles.orderInfo}>
                    <Text style={styles.orderNumber}>Order No. {order.id}</Text>
                    <Text style={styles.itemName}>{order.items[0]?.name || 'Unknown Item'}</Text>
                    <Text style={styles.customerName}>Customer: {order.buyer_name}</Text>
                    <Text style={styles.orderDate}>Date: {new Date(order.created_at).toLocaleDateString()}</Text>
                </View>

                <Text style={styles.orderPrice}>${order.total_price.toFixed(2)}</Text>
            </View>

            <View style={styles.orderActions}>
                <Pressable onPress={() => order.receipt_url && openWebView(order.receipt_url)}>
                    <Text style={styles.viewReceiptText}>View Receipt</Text>
                </Pressable>
                <KButton
                    buttonStyle={styles.trackButton}
                    textStyle={styles.trackButtonText}
                    title="Track Delivery"
                    onPress={() => order.track_url && openWebView(order.track_url)}
                />
            </View>

            {/* WebView Modal */}
            <Modal visible={webViewVisible} animationType="slide" transparent={false}>
                <View style={{ flex: 1 }}>
                    {webViewUrl && (
                        <WebView
                            source={{ uri: webViewUrl }}
                            style={{ flex: 1, marginTop: 50, marginHorizontal: 30, marginBottom: 20 }}
                            onError={() => alert('Failed to load page')}
                        />
                    )}
                    <Pressable style={styles.closeButton} onPress={closeWebView}>
                        <Text style={styles.closeButtonText}>Close</Text>
                    </Pressable>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    orderContainer: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginTop: 30,
        marginLeft: 25,
        borderRadius: 10,
        borderWidth: 0.2,
        borderColor: '#E5E5E5',
        width: '90%',
        padding: 10,
        backgroundColor: '#FFFFFF',
    },
    orderDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    orderInfo: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        width: '70%',
    },
    orderNumber: {
        fontSize: 10,
        fontFamily: 'TT Chocolates Trial Regular',
        color: '#000000',
    },
    itemName: {
        fontSize: 13,
        fontFamily: 'TT Chocolates Trial Bold',
        color: '#000000',
        marginBottom: 5,
    },
    customerName: {
        fontSize: 12,
        fontFamily: 'TT Chocolates Trial Medium',
        color: '#000000',
        marginBottom: 5,
    },
    orderDate: {
        fontSize: 12,
        fontFamily: 'TT Chocolates Trial Medium',
        color: '#000000',
        marginBottom: 5,
    },
    orderPrice: {
        fontSize: 14,
        fontFamily: 'TT Chocolates Trial Bold',
        color: '#000000',
        alignSelf: 'center',
    },
    orderActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        alignItems: 'center',
        marginTop: 15,
    },
    viewReceiptText: {
        fontSize: 12,
        fontFamily: 'TT Chocolates Trial Medium',
        color: '#BF1E2E',
    },
    trackButton: {
        backgroundColor: '#B81D2C',
        paddingHorizontal: 20,
        paddingVertical: 5,
        borderRadius: 40,
        width: '40%',
    },
    trackButtonText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontFamily: 'TT Chocolates Trial Bold',
    },
    closeButton: {
        backgroundColor: '#BF1E2E',
        padding: 30,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'TT Chocolates Trial Bold',
    },
});

export default KDashboardComponent;
