import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, FlatList, Dimensions, Platform, ActivityIndicator, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location'; // <--- IMPORTANTE

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// Datos de prueba (MOCK)
const MOCK_REQUESTS = [
    { id: '1', title: 'Botellas Plásticas', user: 'Juan Pérez', distance: '200m' },
    { id: '2', title: 'Cartón y Papel', user: 'María Lopez', distance: '500m' },
];

export const MapScreen = () => {
    const navigation = useNavigation();

    // Estado para guardar la ubicación del usuario
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    // 1. OBTENER UBICACIÓN AL INICIAR
    useEffect(() => {
        (async () => {
            // A. Pedir permisos
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permiso de ubicación denegado');
                Alert.alert("Permiso necesario", "Necesitamos tu ubicación para mostrar el mapa.");
                // Fallback: Si niega permiso, cargamos una ubicación por defecto (ej. Lima Centro)
                setLocation({ coords: { latitude: -12.046374, longitude: -77.042793 } });
                return;
            }

            // B. Obtener posición actual (GPS)
            // 'HighAccuracy' consume más batería pero es preciso para mapas
            let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
            setLocation(location);
        })();
    }, []);

    // 2. GENERAR HTML DINÁMICO
    // Solo se genera si tenemos 'location', inyectando las variables ${lat} y ${lng}
    const getMapHTML = (lat, lng) => `
        <!DOCTYPE html>
        <html>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
            <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
            <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
            <style>
                body { margin: 0; padding: 0; width: 100%; height: 100%; }
                #map { width: 100%; height: 100vh; }
                .leaflet-touch .leaflet-bar a { width: 44px !important; height: 44px !important; line-height: 44px !important; font-size: 22px !important; }
            </style>
        </head>
        <body>
            <div id="map"></div>
            <script>
                // AQUI ESTA LA MAGIA: Usamos las coordenadas que pasamos por parámetro
                const userLat = ${lat};
                const userLng = ${lng};

                const map = L.map('map', { zoomControl: false, attributionControl: false })
                             .setView([userLat, userLng], 16); // Zoom 16 es bueno para calles

                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);
                
                // Agregamos un marcador especial para "YO" (Usuario)
                const userIcon = L.icon({
                    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3082/3082383.png', // Icono de persona azul
                    iconSize: [40, 40],
                    iconAnchor: [20, 40],
                    popupAnchor: [0, -40]
                });

                L.marker([userLat, userLng], {icon: userIcon}).addTo(map)
                 .bindPopup("<b>¡Estás aquí!</b>").openPopup();

                // Marcadores de prueba (Simulando cercanía)
                // Truco: Ponemos un marcador cerca de la ubicación del usuario para probar
                L.marker([userLat + 0.002, userLng + 0.002]).addTo(map).bindPopup("Solicitud #1");
            </script>
        </body>
        </html>
    `;

    // Render de Items (Igual que antes)
    const renderRequestItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardIcon}><Ionicons name="cube-outline" size={24} color="#018f64" /></View>
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardSubtitle}>{item.user}</Text>
            </View>
            <TouchableOpacity style={styles.actionButton}><Text style={styles.actionText}>Ver</Text></TouchableOpacity>
        </View>
    );

    // 3. PANTALLA DE CARGA
    // Si 'location' sigue siendo null, mostramos cargando
    if (!location) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#018f64" />
                <Text style={{ marginTop: 10 }}>Buscando tu ubicación...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Pasamos las coordenadas obtenidas al HTML */}
            <WebView
                originWhitelist={['*']}
                source={{ html: getMapHTML(location.coords.latitude, location.coords.longitude) }}
                style={styles.map}
            />

            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>

            <View style={styles.bottomSheet}>
                <View style={styles.dragHandle} />
                <Text style={styles.sheetTitle}>Solicitudes Cercanas</Text>
                <FlatList
                    data={MOCK_REQUESTS}
                    renderItem={renderRequestItem}
                    keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    map: { flex: 1 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' }, // Nuevo estilo para carga

    backButton: {
        position: 'absolute', top: Platform.OS === 'android' ? 70 : 60, left: 20,
        backgroundColor: '#fff', padding: 10, borderRadius: 25, elevation: 5, zIndex: 10,
    },
    bottomSheet: {
        position: 'absolute', bottom: 0, left: 0, right: 0, height: SCREEN_HEIGHT * 0.35,
        backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, elevation: 10,
    },
    dragHandle: { width: 40, height: 5, backgroundColor: '#ddd', borderRadius: 3, alignSelf: 'center', marginBottom: 15 },
    sheetTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#333' },
    card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f5f9f8', padding: 12, borderRadius: 12, marginBottom: 10 },
    cardIcon: { width: 40, height: 40, backgroundColor: '#e0f2ec', borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
    cardContent: { flex: 1 },
    cardTitle: { fontWeight: 'bold', color: '#333', fontSize: 14 },
    cardSubtitle: { color: '#666', fontSize: 12 },
    actionButton: { backgroundColor: '#018f64', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
    actionText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
});