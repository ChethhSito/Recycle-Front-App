import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

export const PartnerRewardCard = ({ reward, onPress, userPoints }) => {
    const canRedeem = userPoints >= reward.points;
    const pointsNeeded = reward.points - userPoints;

    const partnerThemes = {
        yape: { color: '#6C3FB5', icon: 'cellphone' },
        bcp: { color: '#002C77', icon: 'bank' },
        corporate: { color: '#00796B', icon: 'office-building' },
    };

    const theme = partnerThemes[reward.partnerType] || partnerThemes.corporate;

    return (
        <TouchableOpacity
            style={[styles.card, !canRedeem && styles.cardDisabled]}
            onPress={onPress}
            activeOpacity={0.9}
        >
            {/* Banner de Imagen */}
            <View style={styles.imageContainer}>
                <Image source={reward.image} style={styles.image} resizeMode="cover" />

                {/* Badge de Partner Flotante */}
                <View style={[styles.partnerBadge, { backgroundColor: theme.color }]}>
                    <Icon name={theme.icon} size={14} color="#FFF" />
                    <Text style={styles.partnerText}>{reward.partnerName}</Text>
                </View>

                {!canRedeem && (
                    <View style={styles.lockOverlay}>
                        <View style={styles.lockCircle}>
                            <Icon name="lock" size={20} color="#666" />
                        </View>
                    </View>
                )}
            </View>

            <View style={styles.content}>
                <Text style={styles.title} numberOfLines={1}>{reward.title}</Text>
                <Text style={styles.description} numberOfLines={2}>{reward.description}</Text>

                {/* Info de Puntos */}
                <View style={styles.pointsRow}>
                    <View style={styles.pointsBadge}>
                        <Icon name="leaf" size={16} color="#018f64" />
                        <Text style={styles.pointsText}>{reward.points} pts</Text>
                    </View>
                    {!canRedeem && (
                        <Text style={styles.neededText}>Faltan {pointsNeeded} pts</Text>
                    )}
                </View>

                {/* Botón */}
                <View style={[
                    styles.button,
                    { backgroundColor: canRedeem ? theme.color : '#F3F4F6' }
                ]}>
                    <Text style={[styles.buttonText, { color: canRedeem ? '#FFF' : '#9CA3AF' }]}>
                        {canRedeem ? 'Canjear ahora' : 'Puntos insuficientes'}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFF',
        borderRadius: 24,
        overflow: 'hidden',
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        marginBottom: 16,
    },
    imageContainer: {
        height: 150,
        width: '100%',
        backgroundColor: '#F0F0F0',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    partnerBadge: {
        position: 'absolute',
        bottom: 12,
        left: 12,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        gap: 6,
    },
    partnerText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: 'bold',
    },
    lockOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255,255,255,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    lockCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
    },
    content: {
        padding: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 4,
    },
    description: {
        fontSize: 13,
        color: '#6B7280',
        marginBottom: 12,
    },
    pointsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    pointsBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E8F5F1',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        gap: 4,
    },
    pointsText: {
        color: '#018f64',
        fontWeight: 'bold',
    },
    neededText: {
        color: '#EF4444',
        fontSize: 12,
        fontWeight: '600',
    },
    button: {
        paddingVertical: 12,
        borderRadius: 14,
        alignItems: 'center',
    },
    buttonText: {
        fontWeight: 'bold',
        fontSize: 14,
    },
});