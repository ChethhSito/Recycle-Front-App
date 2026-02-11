import React from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, StatusBar, Alert, Platform } from 'react-native';
import { Text, Button, IconButton, Avatar, Card, Divider, Appbar } from 'react-native-paper';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export const RequestDetailScreen = ({ route, navigation }) => {
    // Recibimos los datos de la solicitud desde la pantalla anterior
    const { request } = route.params || {};

    // Datos de respaldo por si algo falla (Fallback)
    const item = {
        title: request?.title || 'Material Reciclable',
        user: request?.user || 'Usuario Anónimo', // Esto evita el crash del substring
        image: request?.image || 'https://via.placeholder.com/400x300?text=Sin+Imagen',
        quantity: request?.quantity || '---',
        distance: request?.distance || 'Cerca',
        description: request?.description || 'El usuario no ha añadido una descripción adicional.',
        address: request?.address || 'Ubicación en mapa',
        lat: request?.lat,
        lng: request?.lng

    };

    const handleAccept = () => {
        Alert.alert(
            "Confirmar Recojo",
            `¿Deseas aceptar el recojo de ${item.quantity} de ${item.title}?`,
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Aceptar", onPress: () => console.log("Recojo aceptado", item.id) }
            ]
        );
    };

    return (
        <View style={styles.mainContainer}>
            {/* Configura la barra de estado para que se vea bien en Android/iOS */}
            <StatusBar backgroundColor="#31253B" barStyle="light-content" />

            {/* 1. NUEVO HEADER (Barra de navegación estándar) */}
            <Appbar.Header style={styles.appbar}>
                <Appbar.BackAction onPress={() => navigation.goBack()} color="#FFF" />
                <Appbar.Content title="Detalle de Solicitud" titleStyle={styles.appbarTitle} />
            </Appbar.Header>

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* 2. TARJETA DEL USUARIO (Arriba, como en redes sociales) */}
                <View style={styles.userSection}>
                    <Avatar.Text
                        size={50}
                        label={item.user.substring(0, 2).toUpperCase()}
                        style={{ backgroundColor: '#018f64' }} color="#FFF"
                    />
                    <View style={styles.userInfo}>
                        <Text style={styles.userName}>{item.user}</Text>
                        <Text style={styles.timestamp}>Ciudadano • Hace un momento</Text>
                    </View>
                    {/* Badge de Distancia */}
                    <View style={styles.distanceBadge}>
                        <Ionicons name="location" size={14} color="#FFF" />
                        <Text style={styles.distanceText}>{item.distance}</Text>
                    </View>
                </View>

                {/* 3. IMAGEN DE EVIDENCIA (Grande y completa) */}
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: item.image }}
                        style={styles.evidenceImage}
                        resizeMode="cover" // 'cover' aquí llena el contenedor redondeado sin deformar
                    />
                </View>

                {/* 4. TÍTULO Y DETALLES CLAVE */}
                <View style={styles.detailsSection}>
                    <Text style={styles.materialTitle}>{item.title}</Text>

                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <MaterialCommunityIcons name="weight" size={22} color="#018f64" />
                            <Text style={styles.statValue}>{item.quantity}</Text>
                            <Text style={styles.statLabel}>Cantidad</Text>
                        </View>
                        <View style={styles.verticalDivider} />
                        <View style={styles.statItem}>
                            <MaterialCommunityIcons name="recycle" size={22} color="#018f64" />
                            <Text style={styles.statValue}>Reciclable</Text>
                            <Text style={styles.statLabel}>Tipo</Text>
                        </View>
                        <View style={styles.verticalDivider} />
                        <View style={styles.statItem}>
                            <MaterialCommunityIcons name="star" size={22} color="#FBC02D" />
                            <Text style={styles.statValue}>5.0</Text>
                            <Text style={styles.statLabel}>Reputación</Text>
                        </View>
                    </View>
                </View>

                <Divider style={styles.divider} />

                {/* 5. DESCRIPCIÓN Y UBICACIÓN */}
                <View style={styles.infoSection}>
                    <Text style={styles.sectionHeader}>Descripción</Text>
                    <Text style={styles.descriptionText}>{item.description}</Text>

                    <Text style={styles.sectionHeader}>Ubicación de Recojo</Text>
                    <View style={styles.addressBox}>
                        <View style={styles.addressIconBg}>
                            <Ionicons name="map" size={20} color="#018f64" />
                        </View>
                        <Text style={styles.addressText}>{item.address}</Text>
                    </View>
                </View>

                {/* Espacio extra para el botón fijo */}
                <View style={{ height: 100 }} />
            </ScrollView>

            {/* 6. FOOTER (Botón Fijo) */}
            <View style={styles.footer}>
                <Button
                    mode="contained"
                    icon="truck-fast"
                    onPress={handleAccept}
                    style={styles.acceptButton}
                    contentStyle={{ height: 54 }}
                    labelStyle={{ fontSize: 18, fontWeight: 'bold' }}
                >
                    Aceptar Recojo
                </Button>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: '#b1eedc' }, // Fondo gris muy claro
    appbar: {
        backgroundColor: '#31253B', // Color oscuro para el header superior
        elevation: 0,
    },
    appbarTitle: { color: '#FFF', fontWeight: 'bold' },
    scrollView: { flex: 1 },
    scrollContent: { paddingBottom: 20 },

    // Sección de Usuario
    userSection: {
        flexDirection: 'row', alignItems: 'center',
        padding: 20, backgroundColor: '#b1eedc'
    },
    userInfo: { marginLeft: 15, flex: 1 },
    userName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    timestamp: { fontSize: 13, color: '#888', marginTop: 2 },
    distanceBadge: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#018f64', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20
    },
    distanceText: { color: '#FFF', fontSize: 12, fontWeight: '600', marginLeft: 4 },

    // Contenedor de Imagen Mejorado
    imageContainer: {
        width: width, // Ancho completo
        height: width * 0.75, // Relación de aspecto 4:3 (más alta que antes)
        backgroundColor: '#E1E1E1', // Color de fondo mientras carga
        marginBottom: 20,
    },
    evidenceImage: {
        width: '100%', height: '100%',
        // No usamos borderRadius aquí para que se vea de borde a borde como en redes sociales
    },

    // Sección de Detalles
    detailsSection: { paddingHorizontal: 20, backgroundColor: '#b1eedc', paddingBottom: 20 },
    materialTitle: { fontSize: 26, fontWeight: 'bold', color: '#333', marginBottom: 20, textTransform: 'capitalize' },
    statsRow: {
        flexDirection: 'row', justifyContent: 'space-around',
        backgroundColor: '#F5F9F8', borderRadius: 16, paddingVertical: 15
    },
    statItem: { alignItems: 'center', flex: 1 },
    statValue: { fontSize: 16, fontWeight: 'bold', color: '#333', marginTop: 5 },
    statLabel: { fontSize: 12, color: '#888' },
    verticalDivider: { width: 1, backgroundColor: '#E0E0E0', height: '80%', alignSelf: 'center' },

    divider: { backgroundColor: '#E0E0E0' },

    // Sección de Info (Descripción/Mapa)
    infoSection: { padding: 20, backgroundColor: '#b1eedc' },
    sectionHeader: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 10, marginTop: 10 },
    descriptionText: { fontSize: 15, color: '#555', lineHeight: 22, marginBottom: 20 },
    addressBox: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#F5F9F8', padding: 12, borderRadius: 12
    },
    addressIconBg: { backgroundColor: '#b1eedc', padding: 8, borderRadius: 8, marginRight: 12 },
    addressText: { fontSize: 15, color: '#333', flex: 1 },

    // Footer
    footer: {
        position: 'absolute', bottom: 0, left: 0, right: 0,
        backgroundColor: '#b1eedc', padding: 20,
        elevation: 10
    },
    acceptButton: { backgroundColor: '#FAC96E', borderRadius: 15, } // Color amarillo de acción
});