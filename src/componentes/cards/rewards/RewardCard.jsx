import React from 'react';
import { StyleSheet, TouchableOpacity, Image, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper'; // 🚀 Importamos useTheme
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

export const RewardCard = ({ reward, onPress, userPoints }) => {
    const theme = useTheme();
    const { colors } = theme;
    const styles = getStyles(theme); // 🎨 Aplicamos estilos dinámicos

    const canRedeem = userPoints >= reward.points;
    const pointsNeeded = reward.points - userPoints;

    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
            <View style={styles.imageContainer}>
                <Image source={reward.image} style={styles.image} resizeMode="cover" />
                {reward.stock <= 5 && (
                    <View style={styles.stockBadge}>
                        <Text style={styles.stockText}>¡Solo {reward.stock}!</Text>
                    </View>
                )}
            </View>

            <View style={styles.content}>
                <Text style={styles.title}>{reward.title}</Text>

                <View style={styles.pointsRow}>
                    <Text style={[styles.pointsLarge, { color: colors.onSurface }]}>
                        {reward.points} <Text style={[styles.ptsLabel, { color: colors.onSurfaceVariant }]}>pts</Text>
                    </Text>
                    {!canRedeem && (
                        <View style={styles.neededContainer}>
                            <Icon name="lock" size={12} color={colors.error} />
                            <Text style={[styles.neededText, { color: colors.error }]}> Falta {pointsNeeded}</Text>
                        </View>
                    )}
                </View>

                {/* Botón dinámico según el estado de canje */}
                <View style={[
                    styles.button,
                    { backgroundColor: canRedeem ? colors.primary : colors.surfaceVariant }
                ]}>
                    <Text style={[
                        styles.buttonText,
                        { color: canRedeem ? colors.onPrimary : colors.outline }
                    ]}>
                        {canRedeem ? 'Obtener' : 'Bloqueado'}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const getStyles = (theme) => StyleSheet.create({
    card: {
        backgroundColor: theme.colors.surface, // 🌙 Cambia según el modo
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
    stockBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: '#EF4444',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
    },
    stockText: {
        color: '#FFF',
        fontSize: 11,
        fontWeight: 'bold',
    },
    content: {
        padding: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.onSurface,
        marginBottom: 8,
    },
    pointsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    pointsLarge: {
        fontSize: 22,
        fontWeight: '800',
    },
    ptsLabel: {
        fontSize: 14,
        fontWeight: '400',
    },
    neededContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.dark ? 'rgba(239, 68, 68, 0.1)' : '#FEE2E2',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    neededText: {
        fontSize: 12,
        fontWeight: '700',
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