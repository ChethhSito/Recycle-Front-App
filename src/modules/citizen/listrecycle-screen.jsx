import React, { useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Image, Dimensions, StatusBar, Platform } from 'react-native';
import { Text, FAB, ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { Svg, Path } from 'react-native-svg';
import { useRequestStore } from '../../hooks/use-request-store';

const { width } = Dimensions.get('window');

// PALETA (Consistente con tus otras pantallas)
const COLORS = {
    primary: '#31253B',      // Texto oscuro
    headerBg: '#018f64',     // Verde oscuro header
    appBg: '#b1eedc',        // Verde menta fondo
    cardBg: '#FFFFFF',       // Blanco tarjetas
    accent: '#FAC96E',       // Amarillo FAB
    textGrey: '#5A7A70'
};

export const RequestListScreen = ({ navigation }) => {
    const { requests, isLoading, startLoadingRequests } = useRequestStore();

    useEffect(() => {
        startLoadingRequests();
    }, []);

    // CONFIGURACIÓN DE ESTADOS (Colores y Textos)
    const getStatusConfig = (status) => {
        const s = status ? status.toUpperCase() : 'PENDING';
        switch (s) {
            case 'PENDING': return { color: '#F59E0B', bg: '#FFF7ED', label: 'Buscando...', icon: 'clock-outline' }; // Ámbar
            case 'ACCEPTED': return { color: '#2563EB', bg: '#EFF6FF', label: 'Aceptado', icon: 'account-check' };   // Azul
            case 'IN_PROGRESS': return { color: '#7C3AED', bg: '#F5F3FF', label: 'En camino', icon: 'truck-delivery' }; // Morado
            case 'COMPLETED': return { color: '#059669', bg: '#ECFDF5', label: 'Recogido', icon: 'check-circle' };    // Verde
            case 'CANCELLED': return { color: '#DC2626', bg: '#FEF2F2', label: 'Cancelado', icon: 'close-circle' };    // Rojo
            default: return { color: '#4B5563', bg: '#F3F4F6', label: s, icon: 'help-circle' };
        }
    };

    // RENDER ITEM (Tarjeta Mejorada)
    const renderItem = ({ item }) => {
        const statusCfg = getStatusConfig(item.status);

        // Títulos amigables
        const LABELS = {
            'plastic': 'Plástico', 'paper': 'Papel', 'cardboard': 'Cartón',
            'glass': 'Vidrio', 'metal': 'Metal', 'electronics': 'RAEE',
            'steel': 'Acero', 'copper': 'Cobre', 'pet': 'Botellas PET'
        };
        const title = LABELS[item.materialType] || LABELS[item.category] || item.category || 'Material';
        const unit = item.measureType === 'peso' ? 'kg' : 'unid.';
        const dateString = item.createdAt ? new Date(item.createdAt).toLocaleDateString('es-PE', { day: 'numeric', month: 'short' }) : '--/--';

        return (
            <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={() => navigation.navigate('MyRequestDetail', { request: item })}>
                {/* 1. Encabezado de la tarjeta (Fecha y Estado) */}
                <View style={styles.cardTopRow}>
                    <Text style={styles.dateText}>{dateString}</Text>
                    <View style={[styles.statusChip, { backgroundColor: statusCfg.bg }]}>
                        <Icon name={statusCfg.icon} size={14} color={statusCfg.color} />
                        <Text style={[styles.statusText, { color: statusCfg.color }]}>{statusCfg.label}</Text>
                    </View>
                </View>

                {/* 2. Cuerpo de la tarjeta (Imagen + Info) */}
                <View style={styles.cardBody}>
                    {/* Imagen con borde redondeado */}
                    <View style={styles.imageContainer}>
                        {item.imageUrl ? (
                            <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
                        ) : (
                            <View style={styles.placeholderImage}>
                                <Icon name="recycle" size={24} color={COLORS.headerBg} />
                            </View>
                        )}
                    </View>

                    {/* Textos Principales */}
                    <View style={styles.textContainer}>
                        <Text style={styles.itemTitle}>{title}</Text>
                        <Text style={styles.itemSubtitle}>
                            {item.quantity} {unit} • {item.address ? item.address.split(',')[0] : 'Ubicación registrada'}
                        </Text>
                    </View>

                    {/* Flecha de navegación */}
                    <Icon name="chevron-right" size={24} color="#D1D5DB" />
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.headerBg} />

            {/* HEADER VERDE + CURVA SVG */}
            <View style={styles.headerWrapper}>
                <View style={styles.headerContent}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <Icon name="arrow-left" size={24} color="#000" />
                    </TouchableOpacity>
                    <View>
                        <Text style={styles.headerTitle}>Mis Solicitudes</Text>
                        <Text style={styles.headerSubtitle}>Historial de reciclaje</Text>
                    </View>
                </View>
                {/* SVG Curvo para el efecto "Nube" */}
                <Svg width={width} height={30} viewBox="0 0 1440 320" preserveAspectRatio="none" style={styles.svgCurve}>
                    <Path fill="#018f64" d="M0,192L48,197.3C96,203,192,213,288,192C384,171,480,117,576,112C672,107,768,149,864,165.3C960,181,1056,171,1152,149.3C1248,128,1344,96,1392,80L1440,64L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z" />
                </Svg>
            </View>

            {/* LISTA DE TARJETAS */}
            {isLoading ? (
                <View style={styles.loadingCenter}>
                    <ActivityIndicator size="large" color={COLORS.headerBg} />
                    <Text style={{ marginTop: 10, color: COLORS.textGrey }}>Cargando solicitudes...</Text>
                </View>
            ) : (
                <FlatList
                    data={requests}
                    renderItem={renderItem}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={() => (
                        <View style={styles.emptyState}>
                            <View style={styles.emptyIconBg}>
                                <Icon name="leaf-off" size={50} color={COLORS.textGrey} style={{ opacity: 0.5 }} />
                            </View>
                            <Text style={styles.emptyTitle}>Aún no tienes solicitudes</Text>
                            <Text style={styles.emptyText}>
                                ¡Es un buen momento para reciclar! Crea tu primera solicitud ahora.
                            </Text>
                        </View>
                    )}
                />
            )}

            {/* FAB (Botón Flotante) */}
            <FAB
                icon="plus"
                label={requests.length === 0 ? "Crear Solicitud" : null}
                style={styles.fab}
                color={COLORS.primary}
                onPress={() => navigation.navigate('Request')}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.appBg },

    // HEADER
    headerWrapper: { zIndex: 1 },
    headerContent: {
        backgroundColor: COLORS.headerBg,
        paddingTop: 60,
        paddingBottom: 30, // Más espacio para que la curva no corte texto
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    backBtn: { marginRight: 15, padding: 5 },
    headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#000' },
    headerSubtitle: { fontSize: 13, color: '#000' }, // Verde clarito texto
    svgCurve: { marginTop: -1 }, // Pega el SVG al header

    // LISTA
    listContent: {
        paddingHorizontal: 16,
        paddingTop: 10, // Espacio antes de la primera tarjeta
        paddingBottom: 100 // Espacio para el FAB
    },
    loadingCenter: { flex: 1, justifyContent: 'center', alignItems: 'center' },

    // TARJETA (CARD)
    card: {
        backgroundColor: COLORS.cardBg,
        borderRadius: 20,
        padding: 16,
        marginBottom: 12,
        // Sombra suave
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
    },
    cardTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6'
    },
    dateText: { fontSize: 12, fontWeight: '600', color: '#9CA3AF' },
    statusChip: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 10, paddingVertical: 4,
        borderRadius: 12, gap: 4
    },
    statusText: { fontSize: 11, fontWeight: 'bold' },

    // Cuerpo Tarjeta
    cardBody: { flexDirection: 'row', alignItems: 'center' },
    imageContainer: {
        width: 50, height: 50, borderRadius: 15,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center', alignItems: 'center',
        marginRight: 15,
        overflow: 'hidden'
    },
    itemImage: { width: '100%', height: '100%' },
    placeholderImage: { opacity: 0.5 },
    textContainer: { flex: 1 },
    itemTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.primary, marginBottom: 4 },
    itemSubtitle: { fontSize: 12, color: COLORS.textGrey },

    // EMPTY STATE
    emptyState: { alignItems: 'center', marginTop: 60 },
    emptyIconBg: {
        width: 100, height: 100, borderRadius: 50,
        backgroundColor: 'rgba(255,255,255,0.5)',
        justifyContent: 'center', alignItems: 'center', marginBottom: 20
    },
    emptyTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.primary },
    emptyText: { textAlign: 'center', color: COLORS.textGrey, marginTop: 8, maxWidth: '70%' },

    // FAB
    fab: {
        position: 'absolute',
        margin: 20,
        right: 0,
        bottom: 20,
        backgroundColor: COLORS.accent, // Amarillo para acción
        elevation: 6
    },
});