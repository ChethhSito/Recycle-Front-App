import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Text, useTheme } from 'react-native-paper'; // 🚀 Importamos componentes de Paper
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

export const PartnerRewardCard = ({ reward, onPress, userPoints }) => {
    const theme = useTheme();
    const { colors, dark } = theme;
    const styles = getStyles(theme);

    const canRedeem = userPoints >= reward.points;
    const pointsNeeded = reward.points - userPoints;

    const partnerThemes = {
        yape: { color: '#6C3FB5', icon: 'cellphone' },
        bcp: { color: '#002C77', icon: 'bank' },
        corporate: { color: colors.primary, icon: 'office-building' },
    };

    const partnerStyle = partnerThemes[reward.partnerType] || partnerThemes.corporate;

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
                <View style={[styles.partnerBadge, { backgroundColor: partnerStyle.color }]}>
                    <Icon name={partnerStyle.icon} size={14} color="#FFF" />
                    <Text style={styles.partnerText}>{reward.partnerName}</Text>
                </View>

                {!canRedeem && (
                    <View style={[styles.lockOverlay, { backgroundColor: dark ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.4)' }]}>
                        <View style={[styles.lockCircle, { backgroundColor: colors.surface }]}>
                            <Icon name="lock" size={20} color={colors.outline} />
                        </View>
                    </View>
                )}
            </View>

            <View style={styles.content}>
                <Text style={[styles.title, { color: colors.onSurface }]} numberOfLines={1}>
                    {reward.title}
                </Text>
                <Text style={[styles.description, { color: colors.onSurfaceVariant }]} numberOfLines={2}>
                    {reward.description}
                </Text>

                {/* Info de Puntos */}
                <View style={styles.pointsRow}>
                    <View style={[styles.pointsBadge, { backgroundColor: dark ? 'rgba(1, 143, 100, 0.15)' : '#E8F5F1' }]}>
                        <Icon name="leaf" size={16} color="#018f64" />
                        <Text style={styles.pointsText}>{reward.points} pts</Text>
                    </View>
                    {!canRedeem && (
                        <Text style={[styles.neededText, { color: colors.error }]}>Faltan {pointsNeeded} pts</Text>
                    )}
                </View>

                {/* Botón */}
                <View style={[
                    styles.button,
                    { backgroundColor: canRedeem ? partnerStyle.color : colors.surfaceVariant }
                ]}>
                    <Text style={[styles.buttonText, { color: canRedeem ? '#FFF' : colors.outline }]}>
                        {canRedeem ? 'Canjear ahora' : 'Puntos insuficientes'}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const getStyles = (theme) => StyleSheet.create({
    card: {
        backgroundColor: theme.colors.surface,
        borderRadius: 24,
        overflow: 'hidden',
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: theme.colors.outlineVariant,
    },
    imageContainer: {
        height: 150,
        width: '100%',
        backgroundColor: theme.colors.surfaceVariant,
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
        justifyContent: 'center',
        alignItems: 'center',
    },
    lockCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
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
        marginBottom: 4,
    },
    description: {
        fontSize: 13,
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