import React from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, StatusBar, Alert, Platform } from 'react-native';
import { Text, Button, Avatar, Divider } from 'react-native-paper';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRequestStore } from '../../hooks/use-request-store';

const { width, height } = Dimensions.get('window');

export const RequestDetailScreen = ({ route, navigation }) => {
    const { request } = route.params || {};
    const { startAcceptingRequest, isLoading } = useRequestStore();

    const item = {
        id: request?.id || request?._id,
        title: request?.title || 'Material Reciclable',
        user: request?.user || 'Usuario Anónimo',
        image: request?.image || 'https://via.placeholder.com/400x300?text=Sin+Imagen',
        quantity: request?.quantity || '---',
        distance: request?.distance || 'Cerca',
        description: request?.description || 'El usuario no ha añadido una descripción adicional.',
        address: request?.address || 'Ubicación en mapa',
    };

    const handleAccept = () => {
        if (!item.id) {
            Alert.alert("Error", "No se encontró el ID de la solicitud");
            return;
        }
        Alert.alert(
            "Confirmar Recojo",
            `¿Deseas aceptar el recojo de ${item.quantity} de ${item.title}?`,
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Aceptar",
                    onPress: async () => {
                        const success = await startAcceptingRequest(item.id);
                        if (success) {
                            Alert.alert("¡Éxito!", "Solicitud aceptada correctamente.");
                            navigation.goBack();
                        }
                    }
                }
            ]
        );
    };

    return (
        <View style={styles.mainContainer}>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

            {/* 1. HEADER FLOTANTE (Encima de la imagen) */}
            <View style={styles.floatingHeader}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Detalle del Recojo</Text>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* 2. IMAGEN DE PORTADA */}
                <View style={styles.imageWrapper}>
                    <Image source={{ uri: item.image }} style={styles.heroImage} resizeMode="cover" />
                    <View style={styles.distanceBadge}>
                        <Ionicons name="location" size={12} color="#FFF" />
                        <Text style={styles.distanceText}>{item.distance}</Text>
                    </View>
                </View>

                {/* 3. TARJETA DE INFORMACIÓN (OVERLAP) */}
                <View style={styles.infoCard}>
                    {/* Sección Usuario */}
                    <View style={styles.userRow}>
                        <Avatar.Text
                            size={44}
                            label={item.user.substring(0, 2).toUpperCase()}
                            style={styles.avatar}
                        />
                        <View style={styles.userTextContainer}>
                            <Text style={styles.userName}>{item.user}</Text>
                            <Text style={styles.userStatus}>Ciudadano verificado</Text>
                        </View>
                        <View style={styles.ratingBadge}>
                            <Ionicons name="star" size={14} color="#FBC02D" />
                            <Text style={styles.ratingText}>5.0</Text>
                        </View>
                    </View>

                    <Divider style={styles.mainDivider} />

                    {/* Título y Stats */}
                    <Text style={styles.materialTitle}>{item.title}</Text>

                    <View style={styles.statsGrid}>
                        <View style={styles.statBox}>
                            <View style={[styles.iconCircle, { backgroundColor: '#E8F5F1' }]}>
                                <MaterialCommunityIcons name="weight-kilogram" size={20} color="#018f64" />
                            </View>
                            <Text style={styles.statLabel}>Cantidad</Text>
                            <Text style={styles.statValue}>{item.quantity}</Text>
                        </View>

                        <View style={styles.statBox}>
                            <View style={[styles.iconCircle, { backgroundColor: '#E3F2FD' }]}>
                                <MaterialCommunityIcons name="recycle" size={20} color="#1E88E5" />
                            </View>
                            <Text style={styles.statLabel}>Tipo</Text>
                            <Text style={styles.statValue}>Reciclable</Text>
                        </View>
                    </View>

                    {/* Descripción */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Descripción</Text>
                        <Text style={styles.descriptionText}>{item.description}</Text>
                    </View>

                    {/* Ubicación */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Punto de Recojo</Text>
                        <View style={styles.locationBox}>
                            <View style={styles.mapIconCircle}>
                                <Ionicons name="map-outline" size={20} color="#018f64" />
                            </View>
                            <Text style={styles.addressText} numberOfLines={2}>{item.address}</Text>
                        </View>
                    </View>
                </View>

                {/* Espacio final para no tapar con el botón */}
                <View style={{ height: 120 }} />
            </ScrollView>

            {/* 4. FOOTER FIJO CON BOTÓN */}
            <View style={styles.footer}>
                <Button
                    mode="contained"
                    icon="truck-delivery"
                    onPress={handleAccept}
                    loading={isLoading}
                    style={styles.acceptButton}
                    contentStyle={styles.buttonContent}
                    labelStyle={styles.buttonLabel}
                >
                    Aceptar Solicitud
                </Button>
            </View>
        </View>
    );
};
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#b1eedc' // Mantenemos el fondo menta de tu marca
    },

    // Header flotante sobre la imagen
    floatingHeader: {
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: 100,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 40,
        zIndex: 10,
    },
    backButton: {
        width: 40, height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(49, 37, 59, 0.4)', // Usamos tu color primary con transparencia
        justifyContent: 'center', alignItems: 'center',
    },
    headerText: {
        marginLeft: 15, fontSize: 18, fontWeight: 'bold', color: '#FFF',
        textShadowColor: 'rgba(0, 0, 0, 0.3)', textShadowRadius: 4,
    },

    // Imagen Hero
    imageWrapper: { width: width, height: height * 0.4 },
    heroImage: { width: '100%', height: '100%' },
    distanceBadge: {
        position: 'absolute',
        bottom: 45, right: 20,
        backgroundColor: '#018f64', // Tu verde principal
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12,
    },
    distanceText: { color: '#FFF', fontSize: 12, fontWeight: 'bold', marginLeft: 4 },

    // --- LA TARJETA AHORA ES BLANCA PARA ROMPER EL VERDE ---
    infoCard: {
        flex: 1,
        backgroundColor: '#FFF', // CAMBIO CLAVE: Blanco para resaltar
        marginTop: -35,
        borderTopLeftRadius: 35,
        borderTopRightRadius: 35,
        paddingHorizontal: 25,
        paddingTop: 30,
        elevation: 10,
        shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10,
    },

    userRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    avatar: { backgroundColor: '#018f64' },
    userTextContainer: { flex: 1, marginLeft: 12 },
    userName: { fontSize: 17, fontWeight: 'bold', color: '#31253B' }, // Color Primary
    userStatus: { fontSize: 13, color: '#5A7A70' }, // Color Placeholder

    ratingBadge: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#FFF9C4', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8
    },
    ratingText: { marginLeft: 4, fontWeight: 'bold', color: '#856404', fontSize: 13 },

    mainDivider: { marginBottom: 20, height: 1, backgroundColor: '#F0F0F0' },

    // Stats Grid con colores diferenciados
    materialTitle: {
        fontSize: 24, fontWeight: 'bold', color: '#31253B',
        marginBottom: 20, textTransform: 'capitalize'
    },
    statsGrid: { flexDirection: 'row', gap: 12, marginBottom: 25 },
    statBox: {
        flex: 1,
        backgroundColor: '#F9FAFB', // Gris ultra suave
        borderRadius: 20,
        padding: 15,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#F0F0F0'
    },
    iconCircle: {
        width: 44, height: 44, borderRadius: 14,
        justifyContent: 'center', alignItems: 'center', marginBottom: 8
    },
    statLabel: { fontSize: 12, color: '#5A7A70', marginBottom: 2 },
    statValue: { fontSize: 15, fontWeight: 'bold', color: '#31253B' },

    // Secciones de información
    section: { marginBottom: 25 },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#31253B', marginBottom: 10 },
    descriptionText: { fontSize: 15, color: '#4B5563', lineHeight: 24 },

    locationBox: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#E8F5F1', // Verde menta muy suave
        padding: 15, borderRadius: 18,
        borderWidth: 1, borderColor: 'rgba(1, 143, 100, 0.1)'
    },
    mapIconCircle: {
        width: 36, height: 36, borderRadius: 10,
        backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', marginRight: 12
    },
    addressText: { flex: 1, fontSize: 14, color: '#018f64', fontWeight: '600' },

    // Footer Fijo
    footer: {
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        padding: 20,
        paddingBottom: Platform.OS === 'ios' ? 40 : 25,
        backgroundColor: '#FFF', // Blanco para separar de la pantalla
        borderTopWidth: 1, borderTopColor: '#F0F0F0',
    },
    acceptButton: {
        backgroundColor: '#FAC96E', // Tu color amarillo de acción
        borderRadius: 18,
        elevation: 4,
        shadowColor: '#FAC96E', shadowOpacity: 0.3, shadowRadius: 5
    },
    buttonContent: { height: 58 },
    buttonLabel: { fontSize: 18, fontWeight: 'bold', color: '#31253B' }, // Texto oscuro sobre amarillo
});