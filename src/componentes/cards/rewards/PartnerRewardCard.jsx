import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export const PartnerRewardCard = ({ reward, onPress, userPoints }) => {
    const canRedeem = userPoints >= reward.points;
    const pointsNeeded = reward.points - userPoints;

    // Colores según el tipo de partner
    const partnerThemes = {
        yape: { colors: ['#6C3FB5', '#8B5FD8'], badge: '#6C3FB5', icon: 'cellphone' },
        bcp: { colors: ['#002C77', '#004BA8'], badge: '#002C77', icon: 'bank' },
        government: { colors: ['#D32F2F', '#F44336'], badge: '#D32F2F', icon: 'shield-account' },
        ong: { colors: ['#0288D1', '#4FC3F7'], badge: '#0288D1', icon: 'hand-heart' },
        corporate: { colors: ['#00796B', '#00897B'], badge: '#00796B', icon: 'office-building' },
    };

    const theme = partnerThemes[reward.partnerType] || partnerThemes.corporate;

    return (
        <TouchableOpacity
            style={[
                styles.card,
                !canRedeem && styles.cardDisabled
            ]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            {/* Gradiente superior con colores del partner */}
            <LinearGradient
                colors={theme.colors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientHeader}
            >
                {/* Badge de Convenio */}
                <View style={styles.partnerBadge}>
                    <Icon name="handshake" size={14} color="#FFF" />
                    <Text style={styles.partnerBadgeText}>Convenio</Text>
                </View>

                {/* Logo del Partner */}
                <View style={styles.partnerLogoContainer}>
                    <Icon name={theme.icon} size={40} color="rgba(255,255,255,0.9)" />
                </View>

                {!canRedeem && (
                    <View style={styles.lockedOverlay}>
                        <Icon name="lock" size={28} color="#FFF" />
                    </View>
                )}
            </LinearGradient>

            {/* Imagen del premio */}
            <View style={styles.imageContainer}>
                <Image
                    source={reward.image}
                    style={styles.image}
                    resizeMode="cover"
                />
                {reward.stock > 0 && reward.stock <= 5 && (
                    <View style={[styles.stockBadge, { backgroundColor: theme.badge }]}>
                        <Text style={styles.stockText}>¡Solo {reward.stock}!</Text>
                    </View>
                )}
            </View>

            {/* Información del premio */}
            <View style={styles.content}>
                {/* Partner Name */}
                <View style={[styles.partnerNameBadge, { backgroundColor: `${theme.badge}15` }]}>
                    <Text style={[styles.partnerNameText, { color: theme.badge }]}>
                        {reward.partnerName}
                    </Text>
                </View>

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

                {/* Botón de canje con colores del partner */}
                <TouchableOpacity
                    style={[
                        styles.redeemButton,
                        { backgroundColor: canRedeem ? theme.badge : '#E0E0E0' }
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
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
    },
    cardDisabled: {
        opacity: 0.7,
    },
    gradientHeader: {
        height: 80,
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    partnerBadge: {
        position: 'absolute',
        top: 12,
        left: 12,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.4)',
    },
    partnerBadgeText: {
        color: '#FFF',
        fontSize: 11,
        fontWeight: 'bold',
        marginLeft: 4,
    },
    partnerLogoContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    lockedOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageContainer: {
        width: '100%',
        height: 140,
        backgroundColor: '#F5F5F5',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    stockBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
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
    partnerNameBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        alignSelf: 'flex-start',
        marginBottom: 8,
    },
    partnerNameText: {
        fontSize: 12,
        fontWeight: 'bold',
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
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
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
