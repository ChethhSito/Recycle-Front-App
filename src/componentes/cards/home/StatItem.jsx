import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

export const StatItem = ({ icon, label, value, backgroundColor, iconColor }) => {
    const theme = useTheme();
    const componentStyles = styles(theme);
    
    return (
    <View style={[componentStyles.statItem, backgroundColor && { backgroundColor }]}>
        <Icon name={icon} size={32} color={iconColor || '#000'} />
        <Text style={componentStyles.statLabel}>{label}</Text>
        <Text style={componentStyles.statValue}>{value}</Text>
    </View>
    );
};

const styles = (theme) => StyleSheet.create({
    statItem: {
        width: '48%',
        backgroundColor: theme.colors.inputBackground,
        padding: 15,
        borderRadius: 15,
        marginBottom: 10,
        alignItems: 'center',
    },
    statLabel: {
        fontSize: 14,
        color: '#000',
        marginTop: 8,
    },
    statValue: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
});
