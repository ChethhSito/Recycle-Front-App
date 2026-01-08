import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export const PartnerHeader = ({ userName, avatarUrl, onMenuPress }) => {
    return (
        <LinearGradient
            colors={['#018f64', '#00695C', '#004D40']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}
        >
            {/* Elementos decorativos */}
            <View style={styles.decorativeIconLeft}>
                <Icon name="handshake-outline" size={70} color="rgba(255, 255, 255, 0.1)" />
            </View>
            <View style={styles.decorativeIconRight}>
                <Icon name="account-multiple-outline" size={50} color="rgba(255, 255, 255, 0.1)" />
            </View>

            {/* Top Bar con Avatar y Menu */}
            <View style={styles.topBar}>
                <TouchableOpacity onPress={onMenuPress} style={styles.menuButton}>
                    <Icon name="menu" size={28} color="#FFF" />
                </TouchableOpacity>

                <View style={styles.avatarContainer}>
                    <Image source={{ uri: avatarUrl }} style={styles.avatar} />
                    <View style={styles.avatarBorder} />
                </View>
            </View>

            {/* Contenido Principal */}
            <View style={styles.content}>
                <View style={styles.titleSection}>
                    <Icon name="handshake" size={36} color="#FFD700" />
                    <View style={styles.titleTextContainer}>
                        <Text style={styles.greeting}>Hola, {userName}</Text>
                        <Text style={styles.title}>Nuestros Convenios</Text>
                        <Text style={styles.subtitle}>Empresas y organizaciones aliadas</Text>
                    </View>
                </View>

                {/* Info Card */}
                <View style={styles.infoCard}>
                    <View style={styles.infoRow}>
                        <View style={styles.infoItem}>
                            <Icon name="domain" size={24} color="#018f64" />
                            <View style={styles.infoTextContainer}>
                                <Text style={styles.infoLabel}>Partners</Text>
                                <Text style={styles.infoValue}>6+</Text>
                            </View>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.infoItem}>
                            <Icon name="gift" size={24} color="#018f64" />
                            <View style={styles.infoTextContainer}>
                                <Text style={styles.infoLabel}>Beneficios</Text>
                                <Text style={styles.infoValue}>20+</Text>
                            </View>
                        </View>
                    </View>
                    <Text style={styles.infoFooter}>
                        Descubre beneficios exclusivos con nuestras organizaciones aliadas
                    </Text>
                </View>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 20,
        position: 'relative',
        overflow: 'hidden',
    },
    decorativeIconLeft: {
        position: 'absolute',
        top: -15,
        left: -25,
        transform: [{ rotate: '-20deg' }],
    },
    decorativeIconRight: {
        position: 'absolute',
        top: 40,
        right: -15,
        transform: [{ rotate: '25deg' }],
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        zIndex: 1,
    },
    menuButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#ffffff0a',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarContainer: {
        position: 'relative',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 3,
        borderColor: '#FFF',
    },
    avatarBorder: {
        position: 'absolute',
        width: 58,
        height: 58,
        borderRadius: 29,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        top: -4,
        left: -4,
    },
    content: {
        zIndex: 1,
    },
    titleSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    titleTextContainer: {
        marginLeft: 12,
        flex: 1,
    },
    greeting: {
        fontSize: 14,
        color: '#B7ECDC',
        marginBottom: 2,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 2,
    },
    subtitle: {
        fontSize: 14,
        color: '#FFD700',
        fontWeight: '600',
    },
    infoCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginBottom: 12,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    infoTextContainer: {
        marginLeft: 10,
    },
    infoLabel: {
        fontSize: 12,
        color: '#666',
    },
    infoValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#018f64',
    },
    divider: {
        width: 1,
        height: 40,
        backgroundColor: '#E0E0E0',
        marginHorizontal: 16,
    },
    infoFooter: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        lineHeight: 18,
    },
});
