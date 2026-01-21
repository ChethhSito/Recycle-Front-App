import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export const PartnerCard = ({ partner, onPress }) => {
    // Helper para generar un color más claro para el gradiente
    const lightenColor = (hex, percent) => {
        const num = parseInt(hex.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    };

    const mainColor = partner.mainColor || '#00796B';
    const lightColor = lightenColor(mainColor, 20);
    const textColor = mainColor;

    return (
        <TouchableOpacity
            style={styles.card}
            onPress={onPress}
            activeOpacity={0.8}
        >
            {/* Header con gradiente dinámico */}
            <LinearGradient
                colors={[mainColor, lightColor]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientHeader}
            >
                <View style={styles.logoContainer}>
                    <Image
                        source={{ uri: partner.logo }}
                        style={styles.logoImage}
                        resizeMode="cover"
                    />
                </View>
            </LinearGradient>

            {/* Contenido */}
            <View style={styles.content}>
                {/* Tipo de partner */}
                <View style={[styles.typeBadge, { backgroundColor: `${textColor}15` }]}>
                    <Text style={[styles.typeText, { color: textColor }]}>
                        {partner.typeLabel}
                    </Text>
                </View>

                {/* Nombre del partner */}
                <Text style={styles.partnerName}>{partner.name}</Text>

                {/* Descripción */}
                <Text style={styles.description} numberOfLines={2}>
                    {partner.description}
                </Text>

                {/* Estadísticas */}
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Icon name="gift-outline" size={18} color={textColor} />
                        <Text style={styles.statText}>{partner.rewardsCount || 0} premios</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Icon name="account-group" size={18} color={textColor} />
                        <Text style={styles.statText}>{partner.usersCount || 0} canjes</Text>
                    </View>
                </View>

                {/* Botón */}
                <View style={styles.footer}>
                    <Text style={[styles.footerText, { color: textColor }]}>
                        Ver beneficios
                    </Text>
                    <Icon name="arrow-right" size={20} color={textColor} />
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        overflow: 'hidden',
        marginHorizontal: 16,
        marginBottom: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    gradientHeader: {
        height: 120,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    logoContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: 'rgba(255, 255, 255, 0.4)',
        overflow: 'hidden',
    },
    logoImage: {
        width: '100%',
        height: '100%',
    },
    content: {
        padding: 16,
    },
    typeBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        alignSelf: 'flex-start',
        marginBottom: 8,
    },
    typeText: {
        fontSize: 11,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    partnerName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#32243B',
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
        marginBottom: 16,
    },
    statsContainer: {
        flexDirection: 'row',
        marginBottom: 16,
        gap: 16,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    statText: {
        fontSize: 13,
        color: '#666',
        fontWeight: '600',
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    footerText: {
        fontSize: 15,
        fontWeight: 'bold',
    },
});
