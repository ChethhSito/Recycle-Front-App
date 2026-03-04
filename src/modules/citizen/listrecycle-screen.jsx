import React, { useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Image, Dimensions, StatusBar, Platform } from 'react-native';
import { Text, FAB, ActivityIndicator, useTheme } from 'react-native-paper'; // 🚀 Importación de Paper para temas
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { Svg, Path } from 'react-native-svg';
import { useRequestStore } from '../../hooks/use-request-store';

const { width } = Dimensions.get('window');

export const RequestListScreen = ({ navigation }) => {
    const theme = useTheme(); // 🎨 Obtenemos el tema dinámico
    const { colors, dark } = theme;
    const componentStyles = getStyles(theme);

    const { requests, isLoading, startLoadingRequests } = useRequestStore();

    useEffect(() => {
        startLoadingRequests();
    }, []);

    // CONFIGURACIÓN DE ESTADOS DINÁMICA
    const getStatusConfig = (status) => {
        const s = status ? status.toUpperCase() : 'PENDING';
        // En modo oscuro usamos fondos más sutiles para los chips
        switch (s) {
            case 'PENDING': return { color: '#F59E0B', bg: dark ? 'rgba(245, 158, 11, 0.15)' : '#FFF7ED', label: 'Buscando...', icon: 'clock-outline' };
            case 'ACCEPTED': return { color: '#2563EB', bg: dark ? 'rgba(37, 99, 235, 0.15)' : '#EFF6FF', label: 'Aceptado', icon: 'account-check' };
            case 'IN_PROGRESS': return { color: '#7C3AED', bg: dark ? 'rgba(124, 58, 237, 0.15)' : '#F5F3FF', label: 'En camino', icon: 'truck-delivery' };
            case 'COMPLETED': return { color: '#059669', bg: dark ? 'rgba(5, 150, 105, 0.15)' : '#ECFDF5', label: 'Recogido', icon: 'check-circle' };
            case 'CANCELLED': return { color: '#DC2626', bg: dark ? 'rgba(220, 38, 38, 0.15)' : '#FEF2F2', label: 'Cancelado', icon: 'close-circle' };
            default: return { color: colors.onSurfaceVariant, bg: colors.surfaceVariant, label: s, icon: 'help-circle' };
        }
    };

    const renderItem = ({ item }) => {
        const statusCfg = getStatusConfig(item.status);
        const LABELS = {
            'plastic': 'Plástico', 'paper': 'Papel', 'cardboard': 'Cartón',
            'glass': 'Vidrio', 'metal': 'Metal', 'electronics': 'RAEE',
            'steel': 'Acero', 'copper': 'Cobre', 'pet': 'Botellas PET'
        };
        const title = LABELS[item.materialType] || LABELS[item.category] || item.category || 'Material';
        const unit = item.measureType === 'peso' ? 'kg' : 'unid.';
        const dateString = item.createdAt ? new Date(item.createdAt).toLocaleDateString('es-PE', { day: 'numeric', month: 'short' }) : '--/--';

        return (
            <TouchableOpacity
                style={componentStyles.card}
                activeOpacity={0.8}
                onPress={() => navigation.navigate('MyRequestDetail', { request: item })}
            >
                <View style={componentStyles.cardTopRow}>
                    <Text style={[componentStyles.dateText, { color: colors.onSurfaceVariant }]}>{dateString}</Text>
                    <View style={[componentStyles.statusChip, { backgroundColor: statusCfg.bg }]}>
                        <Icon name={statusCfg.icon} size={14} color={statusCfg.color} />
                        <Text style={[componentStyles.statusText, { color: statusCfg.color }]}>{statusCfg.label}</Text>
                    </View>
                </View>

                <View style={componentStyles.cardBody}>
                    <View style={[componentStyles.imageContainer, { backgroundColor: colors.surfaceVariant }]}>
                        {item.imageUrl ? (
                            <Image source={{ uri: item.imageUrl }} style={componentStyles.itemImage} />
                        ) : (
                            <Icon name="recycle" size={24} color={colors.primary} style={{ opacity: 0.5 }} />
                        )}
                    </View>

                    <View style={componentStyles.textContainer}>
                        <Text style={[componentStyles.itemTitle, { color: colors.onSurface }]}>{title}</Text>
                        <Text style={[componentStyles.itemSubtitle, { color: colors.onSurfaceVariant }]}>
                            {item.quantity} {unit} • {item.address ? item.address.split(',')[0] : 'Ubicación registrada'}
                        </Text>
                    </View>

                    <Icon name="chevron-right" size={24} color={colors.outline} />
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={componentStyles.container}>
            <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

            {/* HEADER DINÁMICO */}
            <View style={componentStyles.headerWrapper}>
                <View style={[componentStyles.headerContent, { backgroundColor: colors.greenMain }]}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={componentStyles.backBtn}>
                        <Icon name="arrow-left" size={24} color="#FFF" />
                    </TouchableOpacity>
                    <View>
                        <Text style={componentStyles.headerTitle}>Mis Solicitudes</Text>
                        <Text style={componentStyles.headerSubtitle}>Historial de reciclaje</Text>
                    </View>
                </View>
                <Svg width={width} height={30} viewBox="0 0 1440 320" preserveAspectRatio="none" style={componentStyles.svgCurve}>
                    <Path fill={colors.greenMain} d="M0,192L48,197.3C96,203,192,213,288,192C384,171,480,117,576,112C672,107,768,149,864,165.3C960,181,1056,171,1152,149.3C1248,128,1344,96,1392,80L1440,64L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z" />
                </Svg>
            </View>

            {isLoading ? (
                <View style={componentStyles.loadingCenter}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={{ marginTop: 10, color: colors.onSurfaceVariant }}>Cargando solicitudes...</Text>
                </View>
            ) : (
                <FlatList
                    data={requests}
                    renderItem={renderItem}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={componentStyles.listContent}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={() => (
                        <View style={componentStyles.emptyState}>
                            <View style={[componentStyles.emptyIconBg, { backgroundColor: colors.surfaceVariant }]}>
                                <Icon name="leaf-off" size={50} color={colors.onSurfaceVariant} style={{ opacity: 0.5 }} />
                            </View>
                            <Text style={[componentStyles.emptyTitle, { color: colors.onSurface }]}>Aún no tienes solicitudes</Text>
                            <Text style={[componentStyles.emptyText, { color: colors.onSurfaceVariant }]}>
                                ¡Es un buen momento para reciclar! Crea tu primera solicitud ahora.
                            </Text>
                        </View>
                    )}
                />
            )}

            <FAB
                icon="plus"
                label={requests.length === 0 ? "Crear Solicitud" : null}
                style={[componentStyles.fab, { backgroundColor: colors.primary }]}
                color="#FFF"
                onPress={() => navigation.navigate('Request')}
            />
        </View>
    );
};

// 🎨 ESTILOS DINÁMICOS BASADOS EN EL TEMA
const getStyles = (theme) => StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    headerWrapper: { zIndex: 1 },
    headerContent: { paddingTop: 60, paddingBottom: 20, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center' },
    backBtn: { marginRight: 15, padding: 5 },
    headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#FFF' }, // Texto blanco sobre verde siempre
    headerSubtitle: { fontSize: 13, color: 'rgba(255, 255, 255, 0.8)' },
    svgCurve: { marginTop: -1 },
    listContent: { paddingHorizontal: 16, paddingTop: 10, paddingBottom: 100 },
    loadingCenter: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    card: {
        backgroundColor: theme.colors.surface,
        borderRadius: 20,
        padding: 16,
        marginBottom: 12,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8
    },
    cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, paddingBottom: 12, borderBottomWidth: 0.5, borderBottomColor: theme.colors.outlineVariant },
    dateText: { fontSize: 12, fontWeight: '600' },
    statusChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, gap: 4 },
    statusText: { fontSize: 11, fontWeight: 'bold' },
    cardBody: { flexDirection: 'row', alignItems: 'center' },
    imageContainer: { width: 50, height: 50, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginRight: 15, overflow: 'hidden' },
    itemImage: { width: '100%', height: '100%' },
    textContainer: { flex: 1 },
    itemTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
    itemSubtitle: { fontSize: 12 },
    emptyState: { alignItems: 'center', marginTop: 60 },
    emptyIconBg: { width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
    emptyTitle: { fontSize: 18, fontWeight: 'bold' },
    emptyText: { textAlign: 'center', marginTop: 8, maxWidth: '70%' },
    fab: { position: 'absolute', margin: 20, right: 0, bottom: 20, elevation: 6 },
});