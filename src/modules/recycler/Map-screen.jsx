import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, FlatList, Dimensions, Platform, ActivityIndicator, Alert, Image } from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'; // Importamos MaterialCommunityIcons para mejores iconos de reciclaje
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import { useRequestStore } from '../../hooks/use-request-store';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// 1. CONFIGURACIÓN DE CATEGORÍAS (4 COLORES)
const CATEGORIES = {
    PLASTIC: { color: '#29B6F6', label: 'Plástico', icon: 'bottle-soda' }, // Azul Cielo
    PAPER: { color: '#FFA726', label: 'Cartón/Papel', icon: 'package-variant' }, // Naranja
    GLASS: { color: '#66BB6A', label: 'Vidrio', icon: 'glass-fragile' }, // Verde Claro
    METAL: { color: '#EF5350', label: 'Metal/RAEE', icon: 'screw-machine-flat-top' } // Rojo Suave
};

export const MapScreen = () => {
    const navigation = useNavigation();
    const [errorMsg, setErrorMsg] = useState(null);

    // OBTENER UBICACIÓN (Igual que antes)
    const [location, setLocation] = useState(null);
    // 👇 Usamos el store
    const { nearbyRequests, startLoadingNearbyRequests } = useRequestStore();

    useEffect(() => {
        console.log("mapMarkers", mapMarkers);
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert("Permiso necesario", "Necesitamos tu ubicación para mostrar el mapa.");
                return;
            }

            let loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
            setLocation(loc);

            // Fetch nearby requests using store
            if (loc) {
                startLoadingNearbyRequests({
                    lat: loc.coords.latitude,
                    lng: loc.coords.longitude
                });
            }

        })();
    }, []);

    const mapMarkers = nearbyRequests.map(req => ({
        id: req._id,
        title: req.materialType || req.category,
        // GeoJSON format: coordinates[1] is Lat, [0] is Lng
        lat: req.location.coordinates[1],
        lng: req.location.coordinates[0],
        distance: 'Cerca',
        quantity: `${req.quantity} ${req.measureType === 'peso' ? 'Kg' : 'Unid'}`,
        user: req.citizen?.fullName || 'Usuario Anónimo', // <--- ESTO EVITA EL ERROR
        image: req.imageUrl,
        description: req.description || 'Sin descripción adicional.',
        distance: 'Cerca', // O calcula la distancia real
        address: req.location.address
    }));


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
                
                // User Marker
                const userIcon = L.icon({
                    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3082/3082383.png',
                    iconSize: [40, 40],
                    iconAnchor: [20, 40],
                    popupAnchor: [0, -40]
                });
                L.marker([userLat, userLng], {icon: userIcon}).addTo(map).bindPopup("<b>Tú estás aquí</b>");

                // Request Markers from Store Data
                const requests = ${JSON.stringify(mapMarkers)};
                
                requests.forEach((req) => {
                    L.marker([req.lat, req.lng])
                      .addTo(map)
                      .bindPopup('<b>' + req.title + '</b><br>' + req.quantity);
                });
            </script>
        </body>
        </html>
    `;

    const renderRequestItem = ({ item }) => {
        // Fallback to PLASTIC if category not found or convert to uppercase just in case
        const catKey = item.category ? item.category.toUpperCase() : 'PLASTIC';
        const categoryStyle = CATEGORIES[catKey] || CATEGORIES.PLASTIC;

        // Calculate distance logic or use placeholder
        const displayDistance = "Cerca";

        const cleanItem = {

            id: item._id,
            title: item.materialType || item.category,
            // Ensure user string exists. Check citizen.fullName first, then direct user prop, then fallback.
            user: item.citizen?.fullName || item.user || 'Usuario Anónimo',
            image: item.imageUrl || item.image, // Handle both potential property names
            quantity: `${item.quantity} ${item.measureType === 'peso' ? 'kg' : 'unid'}`,
            description: item.description,
            distance: displayDistance,
            lat: item.location?.coordinates ? item.location.coordinates[1] : 0,
            lng: item.location?.coordinates ? item.location.coordinates[0] : 0,
            address: item.location?.address
        };

        return (
            <View style={styles.card}>
                <View style={[styles.categoryIndicator, { backgroundColor: categoryStyle.color }]} />
                <View style={[styles.cardIcon, { backgroundColor: categoryStyle.color + '20' }]}>
                    <MaterialCommunityIcons name={categoryStyle.icon} size={24} color={categoryStyle.color} />
                </View>
                <View style={styles.cardContent}>
                    <Text style={styles.cardTitle}>{cleanItem.title}</Text>
                    <View style={styles.metaRow}>
                        <View style={styles.metaItem}>
                            <Ionicons name="location-sharp" size={14} color="#666" />
                            <Text style={styles.metaText}>{cleanItem.distance}</Text>
                        </View>
                        <Text style={styles.separator}>•</Text>
                        <Text style={styles.metaText}>{cleanItem.quantity}</Text>
                    </View>
                </View>
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: categoryStyle.color }]}
                    // 👇 PASS THE CLEAN OBJECT
                    onPress={() => navigation.navigate('RequestDetail', { request: cleanItem })}
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

                <FlatList
                    data={nearbyRequests} // 👈 Use real data from store
                    renderItem={renderRequestItem}
                    keyExtractor={item => item._id} // 👈 Use _id for MongoDB keys
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    ListEmptyComponent={
                        <Text style={{ textAlign: 'center', marginTop: 20, color: '#fff' }}>
                            No hay solicitudes cercanas.
                        </Text>
                    }
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
