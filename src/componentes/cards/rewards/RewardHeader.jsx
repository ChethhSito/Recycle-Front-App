import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export const RewardHeader = ({ userName, avatarUrl, userPoints, onMenuPress }) => {
    return (
        <View style={styles.mainWrapper}>
            {/* Header con bordes redondeados pronunciados */}
            <LinearGradient
                colors={['#018f64', '#01a374']}
                style={styles.container}
            >
                {/* Top Bar simplificada */}
                <View style={styles.topBar}>
                    <TouchableOpacity onPress={onMenuPress} style={styles.menuButton}>
                        <Icon name="menu" size={26} color="#000" />
                    </TouchableOpacity>

                    <View style={styles.headerInfo}>
                        <Text style={styles.greeting}>Hola, {userName}</Text>
                        <Text style={styles.headerTitle}>Tienda de Premios</Text>
                    </View>

                    <View style={styles.avatarWrapper}>
                        <Image source={{ uri: avatarUrl }} style={styles.avatar} />
                    </View>
                </View>

                {/* Mensaje motivador sutil */}


                {/* TARJETA DE PUNTOS FLOTANTE (Overlap) */}
                <View style={styles.pointsCard}>
                    <View style={styles.pointsLeft}>
                        <View style={styles.walletIconCircle}>
                            <Icon name="wallet-outline" size={24} color="#018f64" />
                        </View>
                        <View>
                            <Text style={styles.pointsLabel}>Tus EcoPuntos</Text>
                            <Text style={styles.pointsValue}>
                                {userPoints} <Text style={styles.pointsUnit}>pts</Text>
                            </Text>
                        </View>
                    </View>

                    <View style={styles.verticalDivider} />

                    <TouchableOpacity style={styles.historyBtn}>
                        <Icon name="history" size={20} color="#666" />
                        <Text style={styles.historyText}>Historial</Text>
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    mainWrapper: {
        backgroundColor: '#b1eedc', // Color de fondo de la pantalla
        paddingBottom: 35, // Espacio para que la tarjeta sobresalga
    },
    container: {
        paddingTop: 50,
        paddingBottom: 50, // Más espacio abajo para el overlap
        paddingHorizontal: 20,
        borderBottomLeftRadius: 35,
        borderBottomRightRadius: 35,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
    },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 15,
        marginTop: 15,
    },
    menuButton: {
        width: 42,
        height: 42,
        borderRadius: 12,

        justifyContent: 'center',
        alignItems: 'center',
    },
    headerInfo: {
        flex: 1,
        marginLeft: 15,
    },
    greeting: {
        fontSize: 16,
        color: '#000',

    },
    headerTitle: {
        fontSize: 22,

        color: '#000',
    },
    avatarWrapper: {
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 15,
        padding: 2,
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 12,
    },
    subtitle: {
        fontSize: 14,
        color: '#000',
        marginBottom: 10,
    },
    // --- ESTILOS DE LA TARJETA DE PUNTOS ---
    pointsCard: {
        position: 'absolute',
        bottom: -35, // Flota sobre la pantalla menta
        left: 20,
        right: 20,
        backgroundColor: '#31253B',
        borderRadius: 22,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 18,
        paddingHorizontal: 20,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
    },
    pointsLeft: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    walletIconCircle: {
        width: 46,
        height: 46,
        borderRadius: 14,
        backgroundColor: '#b1eedc',
        justifyContent: 'center',
        alignItems: 'center',
    },
    pointsLabel: {
        fontSize: 12,
        color: '#fff',

    },
    pointsValue: {
        fontSize: 24,
        fontWeight: '400',
        color: '#fff',
    },
    pointsUnit: {
        fontSize: 14,
        color: '#fff',

    },
    verticalDivider: {
        width: 1,
        height: 30,
        backgroundColor: '#F3F4F6',
        marginHorizontal: 15,
    },
    historyBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
    },
    historyText: {
        fontSize: 11,
        color: '#fff',
        fontWeight: '500',
    }
});