import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

export const RewardCard = ({ reward, onPress, userPoints }) => {
    const canRedeem = userPoints >= reward.points;
    const pointsNeeded = reward.points - userPoints;

    return (
        <TouchableOpacity
            style={[
                styles.card,
                !canRedeem && styles.cardDisabled
            ]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            {/* Imagen del premio */}
            <View style={styles.imageContainer}>
                <Image
                    source={reward.image}
                    style={styles.image}
                    resizeMode="cover"
                />
                {!canRedeem && (
                    <View style={styles.lockedOverlay}>
                        <Icon name="lock" size={32} color="#FFF" />
                    </View>
                )}
                {reward.stock > 0 && reward.stock <= 5 && (
                    <View style={styles.stockBadge}>
                        <Text style={styles.stockText}>¡Solo {reward.stock}!</Text>
                    </View>
                )}
            </View>

            {/* Información del premio */}
            <View style={styles.content}>
                <Text style={styles.title} numberOfLines={2}>
                    {reward.title}
                </Text>
                
                <Text style={styles.description} numberOfLines={2}>
                    {reward.description}
                </Text>

                {/* Puntos */}
                <View style={styles.footer}>
                    <View style={styles.pointsContainer}>
                        <Icon name="leaf" size={18} color="#018f64" />
                        <Text style={styles.pointsText}>{reward.points} puntos</Text>
                    </View>

                    {!canRedeem && (
                        <Text style={styles.needText}>
                            Te faltan {pointsNeeded} pts
                        </Text>
                    )}
                </View>

                {/* Botón de canje */}
                <TouchableOpacity
                    style={[
                        styles.redeemButton,
                        !canRedeem && styles.redeemButtonDisabled
                    ]}
                    onPress={onPress}
                    disabled={!canRedeem}
                >
                    <Text style={[
                        styles.redeemButtonText,
                        !canRedeem && styles.redeemButtonTextDisabled
                    ]}>
                        {canRedeem ? 'Canjear' : 'Bloqueado'}
                    </Text>
                </TouchableOpacity>
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
    cardDisabled: {
        opacity: 0.7,
    },
    imageContainer: {
        width: '100%',
        height: 180,
        backgroundColor: '#F5F5F5',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    lockedOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    stockBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: '#FF5252',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    stockText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: 'bold',
    },
    content: {
        padding: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#32243B',
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
        color: '#666',
        marginBottom: 12,
        lineHeight: 20,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    pointsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E8F5F1',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    pointsText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#018f64',
        marginLeft: 6,
    },
    needText: {
        fontSize: 12,
        color: '#FF5252',
        fontWeight: '600',
    },
    redeemButton: {
        backgroundColor: '#018f64',
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    redeemButtonDisabled: {
        backgroundColor: '#E0E0E0',
    },
    redeemButtonText: {
        color: '#FFF',
        fontSize: 15,
        fontWeight: 'bold',
    },
    redeemButtonTextDisabled: {
        color: '#999',
    },
});
