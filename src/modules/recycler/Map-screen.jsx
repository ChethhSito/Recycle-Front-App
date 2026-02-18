import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, FlatList, Dimensions, Platform, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import { useRequestStore } from '../../hooks/use-request-store';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// PALETA DE COLORES (Cohesiva y no monocromática)
const COLORS = {
    primary: '#31253B',      // Tu color oscuro
    background: '#018f64',   // Verde principal
    lightMint: '#b1eedc',    // Verde clarito
    whiteCard: '#FDFDFD',    // Blanco para resaltar cards
    accentGreen: '#00C7A1',  // Verde brillante
    textGrey: '#5A7A70',
    // Colores de acento para que no sea todo verde
    plastic: '#29B6F6',
    paper: '#FF9800',
    glass: '#8BC34A',
    metal: '#78909C',
    electronics: '#E91E63'
};

const CATEGORIES = {
    PLASTIC: { color: COLORS.plastic, label: 'Plástico', icon: 'bottle-soda' },
    PAPER: { color: COLORS.paper, label: 'Papel', icon: 'package-variant' },
    CARDBOARD: { color: COLORS.paper, label: 'Cartón', icon: 'package-variant' },
    GLASS: { color: COLORS.glass, label: 'Vidrio', icon: 'glass-fragile' },
    METAL: { color: COLORS.metal, label: 'Metal', icon: 'screw-machine-flat-top' },
    ELECTRONICS: { color: COLORS.electronics, label: 'RAEE', icon: 'monitor' }
};

export const MapScreen = () => {
    const navigation = useNavigation();
    const [location, setLocation] = useState(null);
    const [selectedFilter, setSelectedFilter] = useState('all');
    const { nearbyRequests, startLoadingNearbyRequests } = useRequestStore();

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert("Permiso denegado", "No podemos mostrar el mapa sin tu ubicación.");
                return;
            }
            let loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
            setLocation(loc);
            if (loc) {
                startLoadingNearbyRequests({ lat: loc.coords.latitude, lng: loc.coords.longitude });
            }
        })();
    }, []);

    const renderRequestItem = ({ item }) => {
        const catKey = item.category?.toUpperCase() || 'PLASTIC';
        const catStyle = CATEGORIES[catKey] || CATEGORIES.PLASTIC;

        // UNIFICACIÓN DE DATOS PARA NAVEGACIÓN
        // Esto asegura que RequestDetail reciba 'image' correctamente
        const requestData = {
            ...item,
            id: item._id,
            image: item.imageUrl || item.image,
            user: item.citizen?.fullName || item.user || 'Usuario Anónimo',
            title: item.materialType || item.category,
            address: item.location?.address || 'Ubicación cercana'
        };

        return (
            <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate('RequestDetail', { request: requestData })}
                activeOpacity={0.8}
            >
                <View style={[styles.cardIcon, { backgroundColor: catStyle.color }]}>
                    <MaterialCommunityIcons name={catStyle.icon} size={24} color="#FFF" />
                </View>
                <View style={styles.cardContent}>
                    <Text style={styles.cardTitle}>{requestData.title}</Text>
                    <Text style={styles.metaText}>{item.quantity} • {requestData.address.split(',')[0]}</Text>
                </View>
                <View style={styles.chevronBg}>
                    <Ionicons name="chevron-forward" size={18} color={COLORS.primary} />
                </View>
            </TouchableOpacity>
        );
    };

    // PANTALLA DE CARGA MEJORADA (Evita el vacío de image_5b2842.png)
    if (!location) return (
        <View style={styles.loadingContainer}>
            <View style={styles.loaderBox}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>Localizando puntos de reciclaje...</Text>
                <Text style={styles.loadingSubtext}>Estamos buscando solicitudes cerca de ti</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <WebView
                originWhitelist={['*']}
                source={{
                    html: `
                    <html>
                    <head>
                        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
                        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
                        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
                        <style>body { margin: 0; } #map { width: 100%; height: 100vh; }</style>
                    </head>
                    <body>
                        <div id="map"></div>
                        <script>
                            const map = L.map('map', { zoomControl: false }).setView([${location.coords.latitude}, ${location.coords.longitude}], 15);
                            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
                            L.marker([${location.coords.latitude}, ${location.coords.longitude}]).addTo(map);
                        </script>
                    </body>
                    </html>
                `}}
                style={styles.map}
            />

            {/* HEADER FLOTANTE */}
            <View style={styles.headerWrapper}>
                <View style={styles.topNav}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color="#FFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Solicitudes Cercanas</Text>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
                    <TouchableOpacity
                        style={[styles.filterChip, selectedFilter === 'all' && styles.filterChipActive]}
                        onPress={() => setSelectedFilter('all')}
                    >
                        <Text style={[styles.filterChipText, selectedFilter === 'all' && { color: '#FFF' }]}>Todos</Text>
                    </TouchableOpacity>
                    {Object.keys(CATEGORIES).map(key => (
                        <TouchableOpacity
                            key={key}
                            style={[styles.filterChip, selectedFilter === key && { backgroundColor: CATEGORIES[key].color, borderColor: CATEGORIES[key].color }]}
                            onPress={() => setSelectedFilter(key)}
                        >
                            <Text style={[styles.filterChipText, selectedFilter === key && { color: '#FFF' }]}>
                                {CATEGORIES[key].label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* PANEL INFERIOR (ESTILO GLASSMORPISM) */}
            <View style={styles.bottomSheet}>
                <View style={styles.dragHandle} />
                <View style={styles.sheetHeader}>
                    <Text style={styles.sheetTitle}>Disponibles ahora</Text>
                    <View style={styles.countBadge}>
                        <Text style={styles.countText}>{nearbyRequests.length}</Text>
                    </View>
                </View>

                <FlatList
                    data={nearbyRequests.filter(req => selectedFilter === 'all' || req.category?.toUpperCase() === selectedFilter)}
                    renderItem={renderRequestItem}
                    keyExtractor={item => item._id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 30 }}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <MaterialCommunityIcons name="map-marker-off" size={50} color={COLORS.textGrey} style={{ opacity: 0.3 }} />
                            <Text style={styles.emptyText}>No hay solicitudes en esta zona</Text>
                        </View>
                    }
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    map: { flex: 1 },

    // Loading Screen
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#b1eedc' // Tu color verde clarito
    },
    loaderBox: {
        alignItems: 'center',
        padding: 30,
        borderRadius: 30,
        backgroundColor: 'rgba(255,255,255,0.5)'
    },
    loadingText: {
        marginTop: 20,
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.primary,
        textAlign: 'center'
    },
    loadingSubtext: {
        marginTop: 8,
        fontSize: 14,
        color: COLORS.textGrey,
        textAlign: 'center'
    },

    // Header Flotante
    headerWrapper: { position: 'absolute', top: 50, left: 0, right: 0, zIndex: 10 },
    topNav: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 15 },
    backBtn: {
        width: 45, height: 45, borderRadius: 15, backgroundColor: COLORS.primary,
        justifyContent: 'center', alignItems: 'center', elevation: 8
    },
    headerTitle: {
        marginLeft: 15,
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.primary,
        textShadowColor: 'rgba(255,255,255,0.8)',
        textShadowRadius: 10
    },
    filterScroll: { paddingHorizontal: 20, gap: 10 },
    filterChip: {
        backgroundColor: COLORS.whiteCard,
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 15,
        elevation: 4,
        borderWidth: 1,
        borderColor: COLORS.lightMint,
        flexDirection: 'row',
        alignItems: 'center'
    },
    filterChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
    filterChipText: { fontSize: 13, fontWeight: 'bold', color: COLORS.primary },

    // Panel Inferior
    bottomSheet: {
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: SCREEN_HEIGHT * 0.42,
        backgroundColor: COLORS.lightMint, // Color menta de fondo
        borderTopLeftRadius: 35,
        borderTopRightRadius: 35,
        paddingHorizontal: 20,
        elevation: 25,
        shadowColor: COLORS.primary,
        shadowOpacity: 0.3
    },
    dragHandle: {
        width: 45, height: 5, backgroundColor: 'rgba(49, 37, 59, 0.1)', borderRadius: 10,
        alignSelf: 'center', marginTop: 15, marginBottom: 15
    },
    sheetHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 15
    },
    sheetTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.primary },
    countBadge: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10
    },
    countText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },

    // Cards
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.whiteCard,
        borderRadius: 20,
        marginBottom: 12,
        padding: 12,
        elevation: 3,
        shadowColor: COLORS.primary,
        shadowOpacity: 0.1
    },
    cardIcon: { width: 50, height: 50, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
    cardContent: { flex: 1, marginLeft: 15 },
    cardTitle: { fontWeight: 'bold', color: COLORS.primary, fontSize: 16, textTransform: 'capitalize' },
    metaText: { color: COLORS.textGrey, fontSize: 12, marginTop: 2 },
    chevronBg: { backgroundColor: '#F0F0F0', padding: 5, borderRadius: 10 },

    emptyContainer: { alignItems: 'center', marginTop: 40 },
    emptyText: { marginTop: 10, color: COLORS.textGrey, fontSize: 14 }
});