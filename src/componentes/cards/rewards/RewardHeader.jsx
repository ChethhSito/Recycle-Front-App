import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export const RewardHeader = ({ userName, avatarUrl, userPoints, onMenuPress }) => {
    return (
        <LinearGradient
            colors={['#018f64', '#00C7A1', '#018f64']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}
        >
            {/* Elementos decorativos */}
            <View style={styles.decorativeIconLeft}>
                <Icon name="gift-outline" size={60} color="rgba(255, 255, 255, 0.1)" />
            </View>
            <View style={styles.decorativeIconRight}>
                <Icon name="star-outline" size={40} color="rgba(255, 255, 255, 0.1)" />
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
                    <Icon name="gift" size={32} color="#FFD700" />
                    <View style={styles.titleTextContainer}>
                        <Text style={styles.greeting}>Hola, {userName}</Text>
                        <Text style={styles.title}>Tienda de Premios</Text>
                        <Text style={styles.subtitle}>Canjea tus EcoPuntos</Text>
                    </View>
                </View>

                {/* Card de Puntos */}
                <View style={styles.pointsCard}>
                    <View style={styles.pointsHeader}>
                        <Icon name="wallet" size={20} color="#018f64" />
                        <Text style={styles.pointsLabel}>Tus EcoPuntos</Text>
                    </View>
                    <View style={styles.pointsContent}>
                        <Icon name="leaf" size={28} color="#018f64" />
                        <Text style={styles.pointsValue}>{userPoints}</Text>
                        <Text style={styles.pointsUnit}>puntos</Text>
                    </View>
                    <View style={styles.pointsFooter}>
                        <Icon name="chart-line" size={14} color="#666" />
                        <Text style={styles.pointsFooterText}>Sigue reciclando para ganar más</Text>
                    </View>
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
        top: -10,
        left: -20,
        transform: [{ rotate: '-15deg' }],
    },
    decorativeIconRight: {
        position: 'absolute',
        top: 30,
        right: -10,
        transform: [{ rotate: '15deg' }],
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
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
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
    pointsCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    pointsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    pointsLabel: {
        fontSize: 13,
        color: '#666',
        marginLeft: 6,
        fontWeight: '600',
    },
    pointsContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    pointsValue: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#018f64',
        marginLeft: 8,
    },
    pointsUnit: {
        fontSize: 16,
        color: '#666',
        marginLeft: 6,
        marginTop: 12,
    },
    pointsFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    pointsFooterText: {
        fontSize: 12,
        color: '#666',
        marginLeft: 4,
    },
});
