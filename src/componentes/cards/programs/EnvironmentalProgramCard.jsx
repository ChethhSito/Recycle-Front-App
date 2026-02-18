import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
// Ya no necesitamos LinearGradient para el botón, pero lo mantenemos por si quieres usarlo en otro lado
// import { LinearGradient } from 'expo-linear-gradient'; 

export const EnvironmentalProgramCard = ({
    image,
    title,
    organization,
    organizationType, // 'ONG', 'NOS_PLANET', 'ESTADO'
    participants,
    containerStyle,
    location,
    points,
    onPress
}) => {

    const getOrgColor = () => {
        switch (organizationType) {
            case 'ONG': return '#FF6B6B';
            case 'NOS_PLANET': return '#018f64';
            case 'ESTADO': return '#4A90E2';
            default: return '#018f64';
        }
    };

    const getOrgLabel = () => {
        switch (organizationType) {
            case 'ONG': return 'ONG';
            case 'NOS_PLANET': return 'Nos Planét';
            case 'ESTADO': return 'Estado Peruano';
            default: return 'Organización';
        }
    };

    const activeColor = getOrgColor();

    return (
        <TouchableOpacity
            style={[styles.card, containerStyle]}
            onPress={onPress}
            activeOpacity={0.9}
        >
            {/* 1. Imagen de Cabecera */}
            <View style={styles.imageContainer}>
                <Image source={image} style={styles.image} resizeMode="cover" />

                {/* Badge de Puntos (Flotante izquierda) */}
                <View style={styles.pointsBadge}>
                    <Icon name="star" size={12} color="#FFA500" />
                    <Text style={styles.pointsBadgeText}>{points} pts</Text>
                </View>

                {/* Badge de Organización (Flotante derecha) */}
                <View style={[styles.orgBadge, { backgroundColor: activeColor }]}>
                    <Text style={styles.orgBadgeText}>{getOrgLabel()}</Text>
                </View>
            </View>

            {/* 2. Contenido Principal */}
            <View style={styles.content}>

                {/* Título y Organización */}
                <View style={styles.headerContent}>
                    <Text style={styles.title} numberOfLines={2}>{title}</Text>
                    <View style={styles.orgRow}>
                        <Icon name="domain" size={14} color="#888" />
                        <Text style={styles.orgText} numberOfLines={1}>{organization}</Text>
                    </View>
                </View>

                {/* 3. Bloque de Estadísticas (Gris suave) */}
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Icon name="account-group-outline" size={16} color="#555" />
                        <Text style={styles.statText}>{participants}</Text>
                    </View>

                    {/* Línea divisoria vertical */}
                    <View style={styles.divider} />

                    <View style={styles.statItem}>
                        <Icon name="map-marker-outline" size={16} color="#555" />
                        <Text style={styles.statText}>{location}</Text>
                    </View>
                </View>

                {/* 4. Footer con Acción (Más limpio) */}
                <View style={styles.footer}>
                    {/* Usamos el color de la organización para el texto del botón */}
                    <Text style={[styles.viewMoreText, { color: activeColor }]}>Ver detalles</Text>
                    <View style={[styles.iconCircle, { backgroundColor: activeColor + '20' }]}>
                        {/* '20' añade transparencia hex al color */}
                        <Icon name="arrow-right" size={16} color={activeColor} />
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        width: 280, // Ancho fijo si es carrusel horizontal (o '100%' si es lista vertical)
        backgroundColor: '#fff',
        borderRadius: 22,
        marginBottom: 16,
        marginRight: 15, // Separación lateral en carrusel

        // Sombras suaves modernas
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,

        borderWidth: 1,
        borderColor: '#F0F0F0',
        overflow: 'hidden',
    },
    imageContainer: {
        height: 150,
        width: '100%',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    // Badges
    pointsBadge: {
        position: 'absolute',
        top: 12,
        left: 12,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
        elevation: 2,
    },
    pointsBadgeText: {
        color: '#333',
        fontSize: 11,
        fontWeight: '800',
    },
    orgBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        elevation: 2,
    },
    orgBadgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '700',
        textTransform: 'uppercase',
    },

    // Contenido
    content: {
        padding: 16,
    },
    headerContent: {
        marginBottom: 12,
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 4,
        lineHeight: 22,
    },
    orgRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    orgText: {
        fontSize: 13,
        color: '#6B7280',
        fontWeight: '500',
    },

    // Bloque de Estadísticas
    statsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6', // Fondo gris muy claro
        borderRadius: 12,
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginBottom: 14,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        flex: 1, // Para que ocupen espacio equitativo
        justifyContent: 'center',
    },
    statText: {
        fontSize: 12,
        color: '#4B5563',
        fontWeight: '500',
    },
    divider: {
        width: 1,
        height: 16,
        backgroundColor: '#D1D5DB',
        marginHorizontal: 4,
    },

    // Footer
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 4,
    },
    viewMoreText: {
        fontSize: 14,
        fontWeight: '700',
    },
    iconCircle: {
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
});