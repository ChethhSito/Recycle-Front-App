import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';

export const EnvironmentalProgramCard = ({
    image,
    title,
    organization,
    organizationType, // 'ONG', 'NOS_PLANET', 'ESTADO'
    participants,
    location,
    points,
    onPress
}) => {
    useEffect(() => {
        console.log("estas son las iamgenes", image);
    }, []);
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
            case 'NOS_PLANET': return 'Nos Planet';
            case 'ESTADO': return 'Estado Peruano';
            default: return 'Organización';
        }
    };

    return (
        <TouchableOpacity
            style={styles.card}
            onPress={onPress}
            activeOpacity={0.9}
        >
            {/* Imagen */}
            <View style={styles.imageContainer}>
                <Image source={image} style={styles.image} />
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.7)']}
                    style={styles.imageGradient}
                />

                {/* Badge de puntos - Izquierda */}
                <View style={styles.pointsBadge}>
                    <Icon name="star" size={14} color="#FFA500" />
                    <Text style={styles.pointsBadgeText}>{points} ecopuntos</Text>
                </View>

                {/* Badge de tipo de organización - Derecha */}
                <View style={[styles.orgBadge, { backgroundColor: getOrgColor() }]}>
                    <Text style={styles.orgBadgeText}>{getOrgLabel()}</Text>
                </View>
            </View>

            {/* Contenido */}
            <View style={styles.content}>
                <Text style={styles.title} numberOfLines={2}>{title}</Text>

                <View style={styles.infoRow}>
                    <Icon name="domain" size={16} color="#666" />
                    <Text style={styles.infoText}>{organization}</Text>
                </View>

                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Icon name="account-group" size={18} color="#018f64" />
                        <Text style={styles.statText}>{participants} participantes</Text>
                    </View>

                    <View style={styles.statItem}>
                        <Icon name="map-marker" size={18} color="#018f64" />
                        <Text style={styles.statText}>{location}</Text>
                    </View>
                </View>

                {/* Botón Ver más */}
                <View style={styles.actionContainer}>
                    <LinearGradient
                        colors={[getOrgColor(), getOrgColor() + 'CC']}
                        style={styles.actionButton}
                    >
                        <Text style={styles.actionText}>Ver programa</Text>
                        <Icon name="chevron-right" size={18} color="#fff" />
                    </LinearGradient>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        width: '100%', // 👈 ADD THIS LINE
        backgroundColor: '#fff',
        borderRadius: 16,
        marginBottom: 16,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    imageContainer: {
        position: 'relative',
        height: 180,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    imageGradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 80,
    },
    pointsBadge: {
        position: 'absolute',
        top: 12,
        left: 12,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    pointsBadgeText: {
        color: '#D68910',
        fontSize: 11,
        fontWeight: 'bold',
        marginLeft: 4,
    },
    orgBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        elevation: 2,
    },
    orgBadgeText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: 'bold',
    },
    content: {
        padding: 16,
    },
    title: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
        lineHeight: 24,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    infoText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 6,
        flex: 1,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 14,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statText: {
        fontSize: 13,
        color: '#666',
        marginLeft: 4,
    },
    actionContainer: {
        marginTop: 4,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 8,
    },
    actionText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
        marginRight: 4,
    },
});
