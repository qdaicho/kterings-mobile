import React from 'react'
import { View, Text, StyleSheet, TextInput } from 'react-native'
import KButton from '../common/KButton';

interface ErrorProps {
    subtitle: string;
}

const ErrorComponent: React.FC<ErrorProps> = ({subtitle}) => {
    return (
        <View style={{ flex: 1 }}>
            <View style={styles.container}>
                <Text style={styles.title}>Error</Text>
                <Text style={styles.subtitle}>{subtitle}</Text>

            </View>
        </View>

    )
}


const styles = StyleSheet.create({
    container: {
        marginLeft: 40,
        marginRight: 40,
    },
    title: {
        color: '#000000',
        fontFamily: 'TT Chocolates Trial Bold',
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 0,
        lineHeight: 29,
        textAlign: 'left',
    },
    subtitle: {
        color: '#000000',
        fontFamily: 'TT Chocolates Trial Medium',
        fontSize: 13,
        fontWeight: '500',
        letterSpacing: 0,
        lineHeight: 21,
    },
    inputContainer: {
        marginTop: 15,
        height: 47,
        width: 321,
        borderRadius: 4,
        backgroundColor: '#EBEBEB',
        justifyContent: 'center'
    },
    input: {
        color: '#000000',
        fontFamily: 'TT Chocolates Trial Medium',
        fontSize: 13,
        fontWeight: '500',
        letterSpacing: 0,
        // marginLeft: 15,
        textAlign: 'center',
    },
});

export default ErrorComponent;
