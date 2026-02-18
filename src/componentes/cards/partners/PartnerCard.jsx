import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

export const PartnerCard = ({ partner, onPress }) => {

    const mainColor = partner.mainColor || '#018f64';
    // Color de fondo muy suave para el botón (10% opacidad)
    const buttonBgColor = `${mainColor}15`;

    // Validamos imagen
    const imageSource = typeof partner.logo === 'string' ? { uri: partner.logo } : partner.logo;

    return (
        <TouchableOpacity
            style={styles.card}
            onPress={onPress}
            activeOpacity={0.95}
        >
            {/* 1. BANNER DE IMAGEN LIMPIO (Sin degradados) */}
            <View style={styles.bannerContainer}>
                <Image
                    source={imageSource}
                    style={styles.bannerImage}
                    resizeMode="cover" // Llena todo el espacio rectangular
                />

                {/* Badge de Categoría (Flotante con fondo blanco para contraste) */}
                <View style={styles.badgeWrapper}>
                    <View style={[styles.categoryBadge, { backgroundColor: mainColor }]}>
                        <Text style={[styles.categoryText, { color: '#FFF' }]}>
                            {partner.typeLabel || 'ALIADO'}
                        </Text>
                    </View>
                </View>
            </View>

            {/* 2. CONTENIDO */}
            <View style={styles.content}>

                {/* Título y Descripción */}
                <View style={styles.infoBlock}>
                    <Text style={styles.title} numberOfLines={1}>{partner.name}</Text>
                    <Text style={styles.description} numberOfLines={2}>
                        {partner.description || 'Alianza estratégica para beneficios exclusivos.'}
                    </Text>
                </View>

                {/* Bloque de Stats */}
                <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                        <Icon name="gift" size={18} color={mainColor} />
                        <Text style={styles.statText}>
                            <Text style={styles.boldText}>{partner.rewardsCount || 0}</Text> Premios
                        </Text>
                    </View>
                    <View style={styles.verticalDivider} />
                    <View style={styles.statItem}>
                        <Icon name="account-group" size={18} color={mainColor} />
                        <Text style={styles.statText}>
                            <Text style={styles.boldText}>{partner.usersCount || '100+'}</Text> Canjes
                        </Text>
                    </View>
                </View>

                {/* Botón Sólido */}
                <View style={[styles.actionButton, { backgroundColor: buttonBgColor }]}>
                    <Text style={[styles.actionText, { color: mainColor }]}>Ver Beneficios</Text>
                    <Icon name="arrow-right" size={18} color={mainColor} />
                </View>

            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        width: '100%',
        backgroundColor: '#FFF',
        borderRadius: 20,
        marginBottom: 16,
        overflow: 'hidden', // Para que la imagen respete las esquinas
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    // --- BANNER SUPERIOR ---
    bannerContainer: {
        height: 130, // Altura fija para que todas las cards sean iguales
        width: '100%',
        backgroundColor: '#F5F5F5', // Color de fondo por si la imagen tarda en cargar o es PNG transparente
        position: 'relative',
    },
    bannerImage: {
        width: '100%',
        height: '100%',
    },
    badgeWrapper: {
        position: 'absolute',
        top: 12,
        right: 12,
    },
    categoryBadge: {
        backgroundColor: '#FFF',
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 8,
        // Sombra fuerte para que el badge blanco se vea sobre cualquier imagen (clara u oscura)
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    categoryText: {
        fontSize: 12,

        textTransform: 'uppercase',
    },
    // --- CONTENIDO INFERIOR ---
    content: {
        padding: 16,
    },
    infoBlock: {
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 4,
    },
    description: {
        fontSize: 14,
        color: '#6B7280',
        lineHeight: 20,
    },
    // --- STATS ---
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        marginBottom: 16,
        backgroundColor: '#F9FAFB', // Gris muy claro para diferenciarlo del fondo blanco
        borderRadius: 12,
        paddingHorizontal: 16,
        gap: 20,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    statText: {
        fontSize: 13,
        color: '#6B7280',
    },
    boldText: {
        fontWeight: 'bold',
        color: '#374151',
        fontSize: 15,
    },
    verticalDivider: {
        width: 1,
        height: 20,
        backgroundColor: '#E5E7EB',
    },
    // --- BOTÓN ---
    actionButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 12,
        borderRadius: 12,
        gap: 8,
    },
    actionText: {
        fontSize: 15,
        fontWeight: '700',
    },
});