import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

export const QuoteCard = ({ quote }) => {
    const theme = useTheme();
    const componentStyles = styles(theme);

    return (
        <View style={componentStyles.quoteCard}>
            <Text style={componentStyles.quote}>{quote}</Text>

        </View>
    );
};

const styles = (theme) => StyleSheet.create({
    quoteCard: {
        backgroundColor: '#B7ECDC',
        margin: 20,
        padding: 15,
        borderRadius: 15,
    },
    quote: {
        fontSize: 16,
        color: '#000',

        textAlign: 'center',
    },
});
