import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export const PartnerCard = ({ partner, onPress }) => {
    const partnerThemes = {
        yape: { colors: ['#6C3FB5', '#8B5FD8'], textColor: '#6C3FB5' },
        bcp: { colors: ['#002C77', '#004BA8'], textColor: '#002C77' },
        government: { colors: ['#D32F2F', '#F44336'], textColor: '#D32F2F' },
        ong: { colors: ['#0288D1', '#4FC3F7'], textColor: '#0288D1' },
        corporate: { colors: ['#00796B', '#00897B'], textColor: '#00796B' },
    };

    const theme = partnerThemes[partner.type] || partnerThemes.corporate;

    return (
        <TouchableOpacity
            style={styles.card}
            onPress={onPress}
            activeOpacity={0.8}
        >
            {/* Header con gradiente */}
            <LinearGradient
                colors={theme.colors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientHeader}
            >
                <View style={styles.iconContainer}>
                    <Icon name={partner.icon} size={48} color="#FFF" />
                </View>
            </LinearGradient>

            {/* Contenido */}
            <View style={styles.content}>
                {/* Tipo de partner */}
                <View style={[styles.typeBadge, { backgroundColor: `${theme.textColor}15` }]}>
                    <Text style={[styles.typeText, { color: theme.textColor }]}>
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
                        <Icon name="gift-outline" size={18} color={theme.textColor} />
                        <Text style={styles.statText}>{partner.rewardsCount} premios</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Icon name="account-group" size={18} color={theme.textColor} />
                        <Text style={styles.statText}>{partner.usersCount} canjes</Text>
                    </View>
                </View>

                {/* Botón */}
                <View style={styles.footer}>
                    <Text style={[styles.footerText, { color: theme.textColor }]}>
                        Ver beneficios
                    </Text>
                    <Icon name="arrow-right" size={20} color={theme.textColor} />
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
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: 'rgba(255, 255, 255, 0.4)',
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
