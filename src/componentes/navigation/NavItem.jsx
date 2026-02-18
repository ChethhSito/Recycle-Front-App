// componentes/navigation/NavItem.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

export const NavItem = ({ icon, label, active, onPress }) => {
    // DEFINIMOS COLORES CLAROS PARA EL FONDO OSCURO DEL NAV
    const ACTIVE_COLOR = '#FFFFFF'; // Blanco puro para el activo
    const INACTIVE_COLOR = 'rgba(255, 255, 255, 0.5)'; // Blanco transparente para inactivos

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <Icon
                name={icon}
                size={24}
                color={active ? ACTIVE_COLOR : INACTIVE_COLOR}
            />
            <Text style={[
                styles.label,
                { color: active ? ACTIVE_COLOR : INACTIVE_COLOR, fontWeight: active ? 'bold' : '500' }
            ]}>
                {label}
            </Text>

            {/* Opcional: Una pequeña barrita indicadora abajo */}
            {active && <View style={styles.indicator} />}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        flex: 1,
    },
    label: {
        fontSize: 12,
        marginTop: 5,
    },
    indicator: {
        position: 'absolute',
        bottom: -2,
        width: 20,
        height: 3,
        backgroundColor: '#FFFFFF',
        borderRadius: 2,
    }
});