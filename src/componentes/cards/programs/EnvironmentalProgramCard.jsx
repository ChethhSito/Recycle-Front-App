import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
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
    const theme = useTheme();
    const { colors } = theme;
    const styles = getStyles(theme);

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
            <View style={styles.imageContainer}>
                <Image source={image} style={styles.image} resizeMode="cover" />
                <View style={styles.pointsBadge}>
                    <Icon name="star" size={12} color="#FFA500" />
                    <Text style={styles.pointsBadgeText}>{points} pts</Text>
                </View>
                <View style={[styles.orgBadge, { backgroundColor: activeColor }]}>
                    <Text style={styles.orgBadgeText}>{organizationType}</Text>
                </View>
            </View>

            <View style={styles.content}>
                <View style={styles.headerContent}>
                    <Text style={styles.title} numberOfLines={2}>{title}</Text>
                    <View style={styles.orgRow}>
                        <Icon name="domain" size={14} color={colors.onSurfaceVariant} />
                        <Text style={styles.orgText} numberOfLines={1}>{organization}</Text>
                    </View>
                </View>

                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Icon name="account-group-outline" size={16} color={colors.onSurfaceVariant} />
                        <Text style={styles.statText}>{participants}</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.statItem}>
                        <Icon name="map-marker-outline" size={16} color={colors.onSurfaceVariant} />
                        <Text style={styles.statText}>{location}</Text>
                    </View>
                </View>

                <View style={styles.footer}>
                    <Text style={[styles.viewMoreText, { color: activeColor }]}>Ver detalles</Text>
                    <View style={[styles.iconCircle, { backgroundColor: activeColor + '20' }]}>
                        <Icon name="arrow-right" size={16} color={activeColor} />
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const getStyles = (theme) => StyleSheet.create({
    card: {
        width: 280,
        backgroundColor: theme.colors.surface,
        borderRadius: 22,
        marginBottom: 16,
        marginRight: 15,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        borderWidth: 1,
        borderColor: theme.colors.outlineVariant,
        overflow: 'hidden',
    },
    imageContainer: { height: 150, width: '100%', position: 'relative' },
    image: { width: '100%', height: '100%' },
    pointsBadge: {
        position: 'absolute', top: 12, left: 12, flexDirection: 'row',
        alignItems: 'center', backgroundColor: theme.colors.surface,
        paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, gap: 4,
    },
    pointsBadgeText: { color: theme.colors.onSurface, fontSize: 11, fontWeight: '800' },
    orgBadge: { position: 'absolute', top: 12, right: 12, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    orgBadgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
    content: { padding: 16 },
    title: { fontSize: 16, fontWeight: '700', color: theme.colors.onSurface, marginBottom: 4, lineHeight: 22 },
    orgRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    orgText: { fontSize: 13, color: theme.colors.onSurfaceVariant, fontWeight: '500' },
    statsContainer: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: theme.colors.surfaceVariant,
        borderRadius: 12, paddingVertical: 8, paddingHorizontal: 12, marginBottom: 14,
    },
    statItem: { flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1, justifyContent: 'center' },
    statText: { fontSize: 12, color: theme.colors.onSurfaceVariant, fontWeight: '500' },
    divider: { width: 1, height: 16, backgroundColor: theme.colors.outline, marginHorizontal: 4 },
    footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    viewMoreText: { fontSize: 14, fontWeight: '700' },
    iconCircle: { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
});