import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList, Dimensions, ActivityIndicator, Alert, ScrollView, StatusBar } from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Text, useTheme } from 'react-native-paper';
import * as Location from 'expo-location';
import { useRequestStore } from '../../hooks/use-request-store';
import { useTranslation } from '../../hooks/use-translation'; // 🗣️ Hook de traducción

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export const MapScreen = () => {
    const t = useTranslation(); // 🗣️ Inicializar traducciones
    const navigation = useNavigation();
    const theme = useTheme();
    const { colors, dark } = theme;
    const componentStyles = getStyles(theme);

    // 🎨 CATEGORÍAS TRADUCIDAS DINÁMICAMENTE
    const CATEGORIES = {
        PLASTIC: {
            color: '#29B6F6',
            label: t.map?.categories?.plastic || 'Plastic', // 🛡️ Si t.map no existe, usa 'Plastic'
            icon: 'bottle-soda'
        },
        PAPER: { color: dark ? '#FFA726' : '#FF9800', label: t.map.categories.paper, icon: 'package-variant' },
        CARDBOARD: { color: dark ? '#FFA726' : '#FF9800', label: t.map.categories.cardboard, icon: 'package-variant' },
        GLASS: { color: '#8BC34A', label: t.map.categories.glass, icon: 'glass-fragile' },
        METAL: { color: '#78909C', label: t.map.categories.metal, icon: 'screw-machine-flat-top' },
        ELECTRONICS: { color: '#E91E63', label: t.map.categories.raee, icon: 'monitor' }
    };

    const [location, setLocation] = useState(null);
    const [selectedFilter, setSelectedFilter] = useState('all');
    const { nearbyRequests, startLoadingNearbyRequests } = useRequestStore();

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert(t.map.permissions.denied, t.map.permissions.message);
                return;
            }
            let loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
            setLocation(loc);
            if (loc) {
                startLoadingNearbyRequests({ lat: loc.coords.latitude, lng: loc.coords.longitude });
            }
        })();
    }, []);

    const mapFilter = dark
        ? 'filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%);'
        : '';

    const requestsJson = JSON.stringify(nearbyRequests);

    const renderRequestItem = ({ item }) => {
        const catKey = item.category?.toUpperCase() || 'PLASTIC';
        const catStyle = CATEGORIES[catKey] || CATEGORIES.PLASTIC;

        const requestData = {
            ...item,
            id: item._id,
            image: item.imageUrl || item.image,
            user: item.citizen?.fullName || item.user || t.map.anonymous,
            title: item.materialType || catStyle.label,
            address: item.location?.address || t.map.nearby
        };

        return (
            <TouchableOpacity
                style={componentStyles.card}
                onPress={() => navigation.navigate('RequestDetail', { request: requestData })}
                activeOpacity={0.8}
            >
                <View style={[componentStyles.cardIcon, { backgroundColor: catStyle.color }]}>
                    <MaterialCommunityIcons name={catStyle.icon} size={24} color="#FFF" />
                </View>
                <View style={componentStyles.cardContent}>
                    <Text style={[componentStyles.cardTitle, { color: colors.onSurface }]}>{requestData.title}</Text>
                    <Text style={[componentStyles.metaText, { color: colors.onSurfaceVariant }]}>
                        {item.quantity} • {requestData.address.split(',')[0]}
                    </Text>
                </View>
                <View style={[componentStyles.chevronBg, { backgroundColor: colors.surfaceVariant }]}>
                    <Ionicons name="chevron-forward" size={18} color={colors.primary} />
                </View>
            </TouchableOpacity>
        );
    };

    if (!location) return (
        <View style={[componentStyles.loadingContainer, { backgroundColor: colors.background }]}>
            <View style={[componentStyles.loaderBox, { backgroundColor: colors.elevation.level3 }]}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={[componentStyles.loadingText, { color: colors.onSurface }]}>{t.map.loading}</Text>
                <Text style={{ color: colors.onSurfaceVariant }}>{t.map.searching}</Text>
            </View>
        </View>
    );

    return (
        <View style={componentStyles.container}>
            <StatusBar barStyle={dark ? "light-content" : "dark-content"} />

            <WebView
                originWhitelist={['*']}
                source={{
                    html: `
        <html>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
            <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
            <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
            <style>
                body { margin: 0; background: ${dark ? '#121212' : '#FFFFFF'}; } 
                #map { width: 100%; height: 100vh; }
            </style>
        </head>
        <body>
            <div id="map"></div>
            <script>
                // 1. Inicializar mapa
                const map = L.map('map', { zoomControl: false }).setView([${location.coords.latitude}, ${location.coords.longitude}], 14);
                
                // 🚀 SOLUCIÓN AL ERROR 403: Usar esta URL de CartoDB (esta NO bloquea)
                L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
                    attribution: '© CartoDB'
                }).addTo(map);

                // 2. Tu marcador (Azul)
                L.marker([${location.coords.latitude}, ${location.coords.longitude}]).addTo(map)
                 .bindPopup("<b>Estás aquí</b>").openPopup();

                // 3. Lógica para pintar las solicitudes con coordenadas invertidas 📍
                const requests = ${requestsJson};
                
                requests.forEach(req => {
                    if (req.location && req.location.coordinates) {
                        // 🚨 LA CORRECCIÓN: 
                        // Mongo: [Long, Lat] -> Leaflet: [Lat, Long]
                        const lng = req.location.coordinates[0];
                        const lat = req.location.coordinates[1];
                        
                        // Ahora sí el punto saldrá en Lima
                        L.marker([lat, lng]).addTo(map)
                         .bindPopup("<b>" + (req.materialType.toUpperCase() || 'RECICLAJE') + "</b><br>" + req.quantity + " " + req.measureType);
                    }
                });
            </script>
        </body>
        </html>
    `}}
                style={componentStyles.map}
            />

            <View style={componentStyles.headerWrapper}>
                <View style={componentStyles.topNav}>
                    <TouchableOpacity style={[componentStyles.backBtn, { backgroundColor: colors.primary }]} onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color="#FFF" />
                    </TouchableOpacity>
                    <Text style={[componentStyles.headerTitle, { color: colors.surface }]}>
                        {t.map.title}
                    </Text>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={componentStyles.filterScroll}>
                    <TouchableOpacity
                        style={[componentStyles.filterChip, selectedFilter === 'all' && { backgroundColor: colors.primary, borderColor: colors.primary }]}
                        onPress={() => setSelectedFilter('all')}
                    >
                        <Text style={[componentStyles.filterChipText, { color: selectedFilter === 'all' ? '#FFF' : colors.onSurface }]}>{t.map.categories.all}</Text>
                    </TouchableOpacity>
                    {Object.keys(CATEGORIES).map(key => (
                        <TouchableOpacity
                            key={key}
                            style={[
                                componentStyles.filterChip,
                                selectedFilter === key && { backgroundColor: CATEGORIES[key].color, borderColor: CATEGORIES[key].color }
                            ]}
                            onPress={() => setSelectedFilter(key)}
                        >
                            <Text style={[componentStyles.filterChipText, { color: selectedFilter === key ? '#FFF' : colors.onSurface }]}>
                                {CATEGORIES[key].label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <View style={[componentStyles.bottomSheet, { backgroundColor: colors.surface }]}>
                <View style={[componentStyles.dragHandle, { backgroundColor: colors.outlineVariant }]} />
                <View style={componentStyles.sheetHeader}>
                    <Text style={[componentStyles.sheetTitle, { color: colors.onSurface }]}>{t.map.availableNow}</Text>
                    <View style={[componentStyles.countBadge, { backgroundColor: colors.primary }]}>
                        <Text style={componentStyles.countText}>{nearbyRequests.length}</Text>
                    </View>
                </View>

                <FlatList
                    data={nearbyRequests.filter(req => selectedFilter === 'all' || req.category?.toUpperCase() === selectedFilter)}
                    renderItem={renderRequestItem}
                    keyExtractor={item => item._id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 30 }}
                    ListEmptyComponent={
                        <View style={componentStyles.emptyContainer}>
                            <MaterialCommunityIcons name="map-marker-off" size={50} color={colors.outline} style={{ opacity: 0.3 }} />
                            <Text style={{ color: colors.onSurfaceVariant }}>{t.map.empty}</Text>
                        </View>
                    }
                />
            </View>
        </View>
    );
};

// 🎨 ESTILOS DINÁMICOS
const getStyles = (theme) => StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    map: { flex: 1 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loaderBox: { alignItems: 'center', padding: 30, borderRadius: 30 },
    loadingText: { marginTop: 20, fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
    headerWrapper: { position: 'absolute', top: 50, left: 0, right: 0, zIndex: 10 },
    topNav: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 15 },
    backBtn: { width: 45, height: 45, borderRadius: 15, justifyContent: 'center', alignItems: 'center', elevation: 8 },
    headerTitle: { marginLeft: 15, fontSize: 20, fontWeight: 'bold', textShadowRadius: 10 },
    filterScroll: { paddingHorizontal: 20, gap: 10 },
    filterChip: { backgroundColor: theme.colors.surface, paddingHorizontal: 18, paddingVertical: 10, borderRadius: 15, elevation: 4, borderWidth: 1, borderColor: theme.colors.outlineVariant, flexDirection: 'row', alignItems: 'center' },
    filterChipText: { fontSize: 13, fontWeight: 'bold' },
    bottomSheet: { position: 'absolute', bottom: 0, left: 0, right: 0, height: SCREEN_HEIGHT * 0.42, borderTopLeftRadius: 35, borderTopRightRadius: 35, paddingHorizontal: 20, elevation: 25 },
    dragHandle: { width: 45, height: 5, borderRadius: 10, alignSelf: 'center', marginTop: 15, marginBottom: 15 },
    sheetHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 15 },
    sheetTitle: { fontSize: 18, fontWeight: 'bold' },
    countBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
    countText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
    card: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.elevation.level2, borderRadius: 20, marginBottom: 12, padding: 12, elevation: 3 },
    cardIcon: { width: 50, height: 50, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
    cardContent: { flex: 1, marginLeft: 15 },
    cardTitle: { fontWeight: 'bold', color: theme.colors.onSurface, fontSize: 16, textTransform: 'capitalize' },
    metaText: { fontSize: 12, marginTop: 2 },
    chevronBg: { padding: 5, borderRadius: 10 },
    emptyContainer: { alignItems: 'center', marginTop: 40 }
});