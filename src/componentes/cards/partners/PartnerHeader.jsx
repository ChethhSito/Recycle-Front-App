import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export const PartnerHeader = ({ userName, avatarUrl, onMenuPress }) => {
    return (
        <View style={styles.mainWrapper}>
            {/* Header con gradiente más suave y bordes redondeados abajo */}
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

                        <Text style={styles.headerTitle}>Aliados Estratégicos</Text>
                    </View>

                    <View style={styles.avatarWrapper}>
                        <Image source={{ uri: avatarUrl }} style={styles.avatar} />
                    </View>
                </View>

                {/* Tarjeta de Estadísticas Flotante */}
                <View style={styles.statsCard}>
                    <View style={styles.statBox}>
                        <View style={styles.iconCircle}>
                            <Icon name="handshake" size={22} color="#018f64" />
                        </View>
                        <View>
                            <Text style={styles.statValue}>12+</Text>
                            <Text style={styles.statLabel}>Aliados</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.statBox}>
                        <View style={[styles.iconCircle, { backgroundColor: '#FFF9C4' }]}>
                            <Icon name="gift" size={22} color="#FBC02D" />
                        </View>
                        <View>
                            <Text style={styles.statValue}>45+</Text>
                            <Text style={styles.statLabel}>Premios</Text>
                        </View>
                    </View>
                </View>
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    mainWrapper: {
        backgroundColor: '#b1eedc', // Color de fondo de la pantalla
        paddingBottom: 30, // Espacio para que la tarjeta de stats sobresalga
    },
    container: {
        paddingTop: 50,
        paddingBottom: 40,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
    },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        marginTop: 20,
    },
    menuButton: {
        width: 40,
        height: 40,
        borderRadius: 12,


        justifyContent: 'center',
        alignItems: 'center',
    },
    headerInfo: {
        flex: 1,
        marginLeft: 15,
    },
    greeting: {
        fontSize: 19,
        color: '#000',

    },
    headerTitle: {
        fontSize: 19,

        color: '#000000',
    },
    avatarWrapper: {
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 20,
        padding: 2,
    },
    avatar: {
        width: 38,
        height: 38,
        borderRadius: 18,
    },
    // --- ESTILOS DE LA TARJETA DE STATS ---
    statsCard: {
        position: 'absolute',
        bottom: -30, // La mitad fuera del header verde
        left: 20,
        right: 20,
        backgroundColor: '#31253B',
        borderRadius: 20,
        flexDirection: 'row',
        paddingVertical: 15,
        paddingHorizontal: 10,
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
    },
    statBox: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#E8F5F1',
        justifyContent: 'center',
        alignItems: 'center',
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFF',
    },
    statLabel: {
        fontSize: 12,
        color: '#FFF',
    },
    divider: {
        width: 1,
        height: '100%',
        backgroundColor: '#F3F4F6',
    }
});