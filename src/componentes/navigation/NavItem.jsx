import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

export const NavItem = ({ icon, label, active, onPress }) => {
    const theme = useTheme();
    const componentStyles = styles(theme);
    const activeColor = theme.colors.background;

    return (
        <TouchableOpacity style={componentStyles.navItem} onPress={onPress}>
            <Icon name={icon} size={26} color={active ? activeColor : '#1a1a1aff'} />
            <Text style={[componentStyles.navLabel, active && componentStyles.navLabelActive]}>
                {label}
            </Text>
        </TouchableOpacity>
    );
};

const styles = (theme) => StyleSheet.create({
    navItem: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        paddingHorizontal: 0,
        minWidth: 70,
    },
    navLabel: {
        fontSize: 14,
        color: '#1a1a1aff',
        marginTop: 5,
    },
    navLabelActive: {
        color: theme.colors.background,
    },
});
