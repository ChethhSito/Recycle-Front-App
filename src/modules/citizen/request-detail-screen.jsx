import React from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, StatusBar, Alert, Platform
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Button, ActivityIndicator } from 'react-native-paper';
// 👇 IMPORTAMOS EL HOOK
import { useRequestStore } from '../../hooks/use-request-store';

const { width, height } = Dimensions.get('window');

const COLORS = {
    primary: '#31253B',
    greenMain: '#018f64',
    mintBg: '#b1eedc',
    white: '#FFFFFF',
    textGrey: '#5A7A70',
    lightGrey: '#F9FAFB',
    danger: '#EF4444'
};

export const MyRequestDetailScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();

    // 👇 EXTRAEMOS LAS FUNCIONES DEL STORE
    const { startCancellingRequest, isLoading } = useRequestStore();

    const { request } = route.params || {};

    if (!request) return null;

    const getStatusConfig = (status) => {
        const s = status ? status.toUpperCase() : 'PENDING';
        switch (s) {
            case 'PENDING': return { color: '#F59E0B', bg: '#FFF7ED', label: 'Buscando Reciclador', icon: 'clock-fast' };
            case 'ACCEPTED': return { color: '#2563EB', bg: '#EFF6FF', label: 'Aceptado', icon: 'account-check' };
            case 'IN_PROGRESS': return { color: '#7C3AED', bg: '#F5F3FF', label: 'En camino', icon: 'truck-delivery' };
            case 'COMPLETED': return { color: '#059669', bg: '#ECFDF5', label: 'Completado', icon: 'check-decagram' };
            case 'CANCELLED': return { color: COLORS.danger, bg: '#FEF2F2', label: 'Cancelado', icon: 'close-circle' };
            default: return { color: '#4B5563', bg: '#F3F4F6', label: s, icon: 'information' };
        }
    };

    const statusCfg = getStatusConfig(request.status);

    const LABELS = {
        'plastic': 'Plástico', 'paper': 'Papel', 'cardboard': 'Cartón',
        'glass': 'Vidrio', 'metal': 'Metal', 'electronics': 'RAEE',
        'steel': 'Acero', 'copper': 'Cobre', 'pet': 'Botellas PET', 'hdpe': 'Plástico Duro'
    };

    const title = LABELS[request.materialType] || LABELS[request.category] || 'Material Reciclable';
    const unit = request.measureType === 'peso' ? 'Kg' : 'Bolsas';
    const dateString = request.createdAt
        ? new Date(request.createdAt).toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' })
        : 'Fecha desconocida';

    // 👇 ACTUALIZAMOS LA FUNCIÓN DE CANCELACIÓN
    const handleCancel = () => {
        Alert.alert(
            "Cancelar Solicitud",
            "¿Estás seguro de que deseas cancelar esta solicitud? Esta acción no se puede deshacer.",
            [
                { text: "No, mantener", style: "cancel" },
                {
                    text: "Sí, cancelar",
                    style: "destructive",
                    onPress: async () => {
                        // Llamamos a la función del store que conecta al backend
                        const success = await startCancellingRequest(request._id);
                        if (success) {
                            navigation.goBack(); // Regresamos a la lista si fue exitoso
                        }
                    }
                }
            ]
        );
    };

    return (
        <View style={styles.mainContainer}>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

            {/* HEADER FLOTANTE */}
            <View style={styles.floatingHeader}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Icon name="arrow-left" size={24} color="#FFF" />
                </TouchableOpacity>
            </View>

            {/* IMAGEN HERO */}
            <View style={styles.heroImageContainer}>
                {request.imageUrl ? (
                    <Image source={{ uri: request.imageUrl }} style={styles.heroImage} resizeMode="cover" />
                ) : (
                    <View style={styles.placeholderImage}>
                        <Icon name="recycle" size={80} color="rgba(255,255,255,0.5)" />
                    </View>
                )}
                <View style={styles.imageGradient} />
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.infoCard}>

                    {/* Badge de Estado */}
                    <View style={[styles.statusBadge, { backgroundColor: statusCfg.bg, borderColor: statusCfg.color + '40' }]}>
                        <Icon name={statusCfg.icon} size={18} color={statusCfg.color} />
                        <Text style={[styles.statusText, { color: statusCfg.color }]}>{statusCfg.label}</Text>
                    </View>

                    <Text style={styles.materialTitle}>{title}</Text>
                    <Text style={styles.dateText}>Publicado el {dateString}</Text>

                    <View style={styles.divider} />

                    {/* Estadísticas Rápidas */}
                    <View style={styles.statsRow}>
                        <View style={styles.statBox}>
                            <View style={[styles.statIconCircle, { backgroundColor: '#E8F5F1' }]}>
                                <Icon name="scale" size={22} color={COLORS.greenMain} />
                            </View>
                            <Text style={styles.statLabel}>Cantidad</Text>
                            <Text style={styles.statValue}>{request.quantity} {unit}</Text>
                        </View>
                        <View style={styles.statBox}>
                            <View style={[styles.statIconCircle, { backgroundColor: '#FFF7ED' }]}>
                                <Icon name="shape-outline" size={22} color="#F59E0B" />
                            </View>
                            <Text style={styles.statLabel}>Categoría</Text>
                            <Text style={styles.statValue} numberOfLines={1}>{LABELS[request.category] || 'General'}</Text>
                        </View>
                    </View>

                    {/* Ubicación */}
                    <Text style={styles.sectionTitle}>Ubicación de Recojo</Text>
                    <View style={styles.widgetBox}>
                        <View style={styles.widgetIconBg}>
                            <Icon name="map-marker-radius" size={24} color={COLORS.danger} />
                        </View>
                        <View style={styles.widgetTextContainer}>
                            <Text style={styles.widgetValue}>
                                {request.location?.address || 'Ubicación registrada'}
                            </Text>
                        </View>
                    </View>

                    {/* Notas */}
                    {request.description ? (
                        <>
                            <Text style={styles.sectionTitle}>Notas Adicionales</Text>
                            <View style={styles.widgetBox}>
                                <Text style={styles.descriptionText}>{request.description}</Text>
                            </View>
                        </>
                    ) : null}

                    {/* Botón de Cancelar (Solo si está pendiente) */}
                    {(request.status === 'PENDING' || !request.status) && (
                        <Button
                            mode="outlined"
                            onPress={handleCancel}
                            style={styles.cancelBtn}
                            textColor={COLORS.danger}
                            icon="close-circle-outline"
                            loading={isLoading} // Muestra el spinner si está cancelando
                            disabled={isLoading}
                        >
                            Cancelar Solicitud
                        </Button>
                    )}

                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: COLORS.mintBg },
    floatingHeader: {
        position: 'absolute', top: 0, left: 0, right: 0,
        paddingTop: Platform.OS === 'ios' ? 50 : (StatusBar.currentHeight || 0) + 10,
        paddingHorizontal: 20, zIndex: 10,
    },
    backBtn: {
        width: 44, height: 44, borderRadius: 22,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center', alignItems: 'center',
    },
    heroImageContainer: {
        position: 'absolute', top: 0, left: 0, right: 0,
        height: height * 0.4, backgroundColor: COLORS.greenMain,
    },
    heroImage: { width: '100%', height: '100%' },
    placeholderImage: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    imageGradient: {
        position: 'absolute', top: 0, left: 0, right: 0, height: 100,
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    scrollView: { flex: 1 },
    scrollContent: { paddingTop: height * 0.32, paddingBottom: 40 },
    infoCard: {
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 35, borderTopRightRadius: 35,
        minHeight: height * 0.68, paddingHorizontal: 25,
        paddingTop: 35, paddingBottom: 20,
        elevation: 15, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 20,
    },
    statusBadge: {
        position: 'absolute', top: -18, right: 30,
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 16, paddingVertical: 8,
        borderRadius: 20, borderWidth: 1,
        backgroundColor: COLORS.white, elevation: 4, gap: 6
    },
    statusText: { fontSize: 13, fontWeight: 'bold' },
    materialTitle: { fontSize: 26, fontWeight: 'bold', color: COLORS.primary, marginBottom: 5 },
    dateText: { fontSize: 14, color: COLORS.textGrey },
    divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 20 },
    statsRow: { flexDirection: 'row', gap: 15, marginBottom: 25 },
    statBox: {
        flex: 1, backgroundColor: COLORS.lightGrey,
        padding: 15, borderRadius: 20,
        alignItems: 'center', borderWidth: 1, borderColor: '#F0F0F0'
    },
    statIconCircle: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
    statLabel: { fontSize: 12, color: COLORS.textGrey, marginBottom: 2 },
    statValue: { fontSize: 15, fontWeight: 'bold', color: COLORS.primary },
    sectionTitle: { fontSize: 15, fontWeight: 'bold', color: COLORS.primary, marginBottom: 12, marginTop: 5 },
    widgetBox: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: COLORS.lightGrey, padding: 16, borderRadius: 20,
        borderWidth: 1, borderColor: '#F0F0F0', marginBottom: 20
    },
    widgetIconBg: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#FFEBEE', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    widgetTextContainer: { flex: 1 },
    widgetValue: { fontSize: 14, fontWeight: '600', color: COLORS.primary, lineHeight: 20 },
    descriptionText: { fontSize: 14, color: '#4B5563', lineHeight: 22 },
    cancelBtn: { marginTop: 10, borderColor: COLORS.danger, borderRadius: 15, borderWidth: 1.5, paddingVertical: 4 },
});