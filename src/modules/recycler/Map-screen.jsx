import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, FlatList, Dimensions, Platform, ActivityIndicator, Alert, Image } from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'; // Importamos MaterialCommunityIcons para mejores iconos de reciclaje
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// 1. CONFIGURACIÓN DE CATEGORÍAS (4 COLORES)
const CATEGORIES = {
    PLASTIC: { color: '#29B6F6', label: 'Plástico', icon: 'bottle-soda' }, // Azul Cielo
    PAPER: { color: '#FFA726', label: 'Cartón/Papel', icon: 'package-variant' }, // Naranja
    GLASS: { color: '#66BB6A', label: 'Vidrio', icon: 'glass-fragile' }, // Verde Claro
    METAL: { color: '#EF5350', label: 'Metal/RAEE', icon: 'screw-machine-flat-top' } // Rojo Suave
};

// 2. DATOS DE PRUEBA AMPLIADOS (Para probar el Scroll)
const MOCK_REQUESTS = [
    {
        id: '1',
        title: 'Botellas Plásticas',
        category: 'PLASTIC',
        distance: '0.2 km', // <--- Dato importante
        quantity: '3 Kg',
        user: 'Juan Pérez'
    },
    {
        id: '2',
        title: 'Cajas de Cartón',
        category: 'PAPER',
        distance: '0.5 km',
        quantity: '5 Kg',
        user: 'María Lopez'
    },
    {
        id: '3',
        title: 'Latas de Aluminio',
        category: 'METAL',
        distance: '1.2 km',
        quantity: '2 Kg',
        user: 'Carlos Ruiz'
    },
    {
        id: '4',
        title: 'Botellas de Vidrio',
        category: 'GLASS',
        distance: '2.5 km',
        quantity: '10 Kg',
        user: 'Ana Díaz'
    },
    {
        id: '5',
        title: 'Monitores Viejos (RAEE)',
        category: 'METAL',
        distance: '3.1 km',
        quantity: '2 Unid.',
        user: 'Pedro S.'
    },
    {
        id: '6',
        title: 'Revistas y Periódicos',
        category: 'PAPER',
        distance: '4.0 km',
        quantity: '8 Kg',
        user: 'Luisa M.'
    },
];

export const MapScreen = () => {
    const navigation = useNavigation();
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    // OBTENER UBICACIÓN (Igual que antes)
    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permiso de ubicación denegado');
                Alert.alert("Permiso necesario", "Necesitamos tu ubicación para mostrar el mapa.");
                setLocation({ coords: { latitude: -12.046374, longitude: -77.042793 } });
                return;
            }
            let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
            setLocation(location);
        })();
    }, []);

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
            </style>
        </head>
        <body>
            <div id="map"></div>
            <script>
                const userLat = ${lat};
                const userLng = ${lng};
                const map = L.map('map', { zoomControl: false, attributionControl: false }).setView([userLat, userLng], 15);
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);
                
                const userIcon = L.icon({
                    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3082/3082383.png',
                    iconSize: [40, 40],
                    iconAnchor: [20, 40],
                    popupAnchor: [0, -40]
                });
                L.marker([userLat, userLng], {icon: userIcon}).addTo(map).bindPopup("<b>Tú estás aquí</b>").openPopup();

                // Simulamos marcadores para las solicitudes MOCK
                // Generamos puntos aleatorios cercanos
                const requests = ${JSON.stringify(MOCK_REQUESTS)};
                requests.forEach((req, index) => {
                    const offset = (Math.random() - 0.5) * 0.01; 
                    L.marker([userLat + offset, userLng + offset])
                     .addTo(map)
                     .bindPopup('<b>' + req.title + '</b><br>' + req.distance);
                });
            </script>
        </body>
        </html>
    `;

    // 3. RENDERIZADO MEJORADO DE LA TARJETA
    const renderRequestItem = ({ item }) => {
        // Obtenemos configuración visual según categoría
        const categoryStyle = CATEGORIES[item.category] || CATEGORIES.PLASTIC;

        return (
            <View style={styles.card}>
                {/* Línea de color a la izquierda */}
                <View style={[styles.categoryIndicator, { backgroundColor: categoryStyle.color }]} />

                {/* Icono con fondo de color suave */}
                <View style={[styles.cardIcon, { backgroundColor: categoryStyle.color + '20' }]}>
                    <MaterialCommunityIcons name={categoryStyle.icon} size={24} color={categoryStyle.color} />
                </View>

                <View style={styles.cardContent}>
                    <Text style={styles.cardTitle}>{item.title}</Text>

                    {/* Fila de Distancia y Cantidad */}
                    <View style={styles.metaRow}>
                        <View style={styles.metaItem}>
                            <Ionicons name="location-sharp" size={14} color="#666" />
                            <Text style={styles.metaText}>A {item.distance}</Text>
                        </View>
                        <Text style={styles.separator}>•</Text>
                        <Text style={styles.metaText}>{item.quantity}</Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: categoryStyle.color }]} // Botón del color de la categoría
                    onPress={() => navigation.navigate('RequestDetail', { request: item })}
                >
                    <Text style={styles.actionText}>Ver</Text>
                </TouchableOpacity>
            </View>
        );
    };

    if (!location) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#018f64" />
                <Text style={{ marginTop: 10 }}>Ubicando...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
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

                {/* Lista Scrolleable */}
                <FlatList
                    data={MOCK_REQUESTS}
                    renderItem={renderRequestItem}
                    keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 20 }} // Espacio al final para scrollear bien
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#018f64' },
    map: { flex: 1 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#b1eedc' },

    backButton: {
        position: 'absolute', top: Platform.OS === 'android' ? 50 : 60, left: 20,
        backgroundColor: '#fff', padding: 10, borderRadius: 25, elevation: 5, zIndex: 10,
    },

    // Bottom Sheet (Panel inferior)
    bottomSheet: {
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: SCREEN_HEIGHT * 0.45, // Aumenté un poco la altura para ver más items
        backgroundColor: '#018f64',
        borderTopLeftRadius: 24, borderTopRightRadius: 24,
        paddingHorizontal: 20, paddingTop: 15,
        elevation: 20,
        shadowColor: "#000", shadowOffset: { width: 0, height: -3 }, shadowOpacity: 0.3, shadowRadius: 5,
    },
    dragHandle: {
        width: 40, height: 5, backgroundColor: 'rgba(255,255,255,0.5)',
        borderRadius: 3, alignSelf: 'center', marginBottom: 15
    },
    sheetTitle: {
        fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#fff'
    },

    // Estilos de la Tarjeta (Card)
    card: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#fff', // Fondo blanco para mayor limpieza
        borderRadius: 12, marginBottom: 12,
        overflow: 'hidden', // Para que la línea de color no se salga
        height: 70,
        paddingRight: 12
    },
    categoryIndicator: {
        width: 6, height: '100%', marginRight: 10
    },
    cardIcon: {
        width: 40, height: 40, borderRadius: 20,
        alignItems: 'center', justifyContent: 'center', marginRight: 12
    },
    cardContent: { flex: 1, justifyContent: 'center' },
    cardTitle: { fontWeight: 'bold', color: '#333', fontSize: 15, marginBottom: 4 },

    // Meta data (Distancia y Cantidad)
    metaRow: { flexDirection: 'row', alignItems: 'center' },
    metaItem: { flexDirection: 'row', alignItems: 'center' },
    metaText: { color: '#666', fontSize: 12, marginLeft: 4, fontWeight: '500' },
    separator: { marginHorizontal: 8, color: '#ccc' },

    actionButton: {
        paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, elevation: 2
    },
    actionText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
});