import React, { useState } from 'react';
import {
    View, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, StatusBar, Platform
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Text, Button, useTheme, ActivityIndicator, Divider } from 'react-native-paper'; // 🚀 Importación de Paper
import { useRequestStore } from '../../hooks/use-request-store';
import { AwesomeAlert } from '../../componentes/modal/modal';

const { width, height } = Dimensions.get('window');

export const MyRequestDetailScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const theme = useTheme(); // 🎨 Obtenemos el tema dinámico
    const { colors, dark } = theme;
    const componentStyles = getStyles(theme);

    const { startCancellingRequest, isLoading } = useRequestStore();
    const { request } = route.params || {};

    if (!request) return null;

    // CONFIGURACIÓN DE ESTADOS DINÁMICA (Sincronizada con RequestList)
    const getStatusConfig = (status) => {
        const s = status ? status.toUpperCase() : 'PENDING';
        switch (s) {
            case 'PENDING': return { color: '#F59E0B', bg: dark ? 'rgba(245, 158, 11, 0.15)' : '#FFF7ED', label: 'Buscando Reciclador', icon: 'clock-fast' };
            case 'ACCEPTED': return { color: '#2563EB', bg: dark ? 'rgba(37, 99, 235, 0.15)' : '#EFF6FF', label: 'Aceptado', icon: 'account-check' };
            case 'IN_PROGRESS': return { color: '#7C3AED', bg: dark ? 'rgba(124, 58, 237, 0.15)' : '#F5F3FF', label: 'En camino', icon: 'truck-delivery' };
            case 'COMPLETED': return { color: '#059669', bg: dark ? 'rgba(5, 150, 105, 0.15)' : '#ECFDF5', label: 'Completado', icon: 'check-decagram' };
            case 'CANCELLED': return { color: colors.error, bg: dark ? 'rgba(239, 68, 68, 0.15)' : '#FEF2F2', label: 'Cancelado', icon: 'close-circle' };
            default: return { color: colors.onSurfaceVariant, bg: colors.surfaceVariant, label: s, icon: 'information' };
        }
    };

    const statusCfg = getStatusConfig(request.status);

    const LABELS = {
        'plastic': 'Plástico', 'paper': 'Papel', 'cardboard': 'Cartón',
        'glass': 'Vidrio', 'metal': 'Metal', 'electronics': 'RAEE',
        'steel': 'Acero', 'copper': 'Cobre', 'pet': 'Botellas PET', 'hdpe': 'Plástico Duro'
    };

    const [alertConfig, setAlertConfig] = useState({
        visible: false,
        title: '',
        message: '',
        type: 'success',
        onConfirm: () => { }
    });

    const hideAlert = () => setAlertConfig(prev => ({ ...prev, visible: false }));

    const showAlert = (title, message, type, onConfirm, onCancel = hideAlert) => {
        setAlertConfig({ visible: true, title, message, type, onConfirm, onCancel });
    };

    const title = LABELS[request.materialType] || LABELS[request.category] || 'Material Reciclable';
    const unit = request.measureType === 'peso' ? 'Kg' : 'Bolsas';
    const dateString = request.createdAt
        ? new Date(request.createdAt).toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' })
        : 'Fecha desconocida';

    const handleCancel = () => {
        showAlert(
            "¿Cancelar Solicitud?",
            "Esta acción quitará tu pedido de la lista de los recicladores y no se puede deshacer.",
            "question",
            async () => {
                hideAlert();
                const success = await startCancellingRequest(request._id);
                if (success) {
                    setTimeout(() => {
                        showAlert(
                            "Cancelado",
                            "Tu solicitud ha sido eliminada correctamente.",
                            "success",
                            () => {
                                hideAlert();
                                navigation.goBack();
                            }
                        );
                    }, 500);
                }
            },
            hideAlert
        );
    };

    return (
        <View style={componentStyles.mainContainer}>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

            <View style={componentStyles.floatingHeader}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={componentStyles.backBtn}>
                    <Icon name="arrow-left" size={24} color="#FFF" />
                </TouchableOpacity>
            </View>

            <View style={componentStyles.heroImageContainer}>
                {request.imageUrl ? (
                    <Image source={{ uri: request.imageUrl }} style={componentStyles.heroImage} resizeMode="cover" />
                ) : (
                    <View style={componentStyles.placeholderImage}>
                        <Icon name="recycle" size={80} color="rgba(255,255,255,0.4)" />
                    </View>
                )}
                <View style={componentStyles.imageGradient} />
            </View>

            <ScrollView style={componentStyles.scrollView} contentContainerStyle={componentStyles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={[componentStyles.infoCard, { backgroundColor: colors.surface }]}>

                    {/* Badge de Estado Dinámico */}
                    <View style={[componentStyles.statusBadge, { backgroundColor: statusCfg.bg, borderColor: statusCfg.color + '40' }]}>
                        <Icon name={statusCfg.icon} size={18} color={statusCfg.color} />
                        <Text style={[componentStyles.statusText, { color: statusCfg.color }]}>{statusCfg.label}</Text>
                    </View>

                    <Text style={[componentStyles.materialTitle, { color: colors.onSurface }]}>{title}</Text>
                    <Text style={[componentStyles.dateText, { color: colors.onSurfaceVariant }]}>Publicado el {dateString}</Text>

                    <Divider style={[componentStyles.divider, { backgroundColor: colors.outlineVariant }]} />

                    <View style={componentStyles.statsRow}>
                        <View style={[componentStyles.statBox, { backgroundColor: colors.surfaceVariant }]}>
                            <View style={[componentStyles.statIconCircle, { backgroundColor: dark ? colors.primaryContainer : '#E8F5F1' }]}>
                                <Icon name="scale" size={22} color={colors.primary} />
                            </View>
                            <Text style={[componentStyles.statLabel, { color: colors.onSurfaceVariant }]}>Cantidad</Text>
                            <Text style={[componentStyles.statValue, { color: colors.onSurface }]}>{request.quantity} {unit}</Text>
                        </View>
                        <View style={[componentStyles.statBox, { backgroundColor: colors.surfaceVariant }]}>
                            <View style={[componentStyles.statIconCircle, { backgroundColor: dark ? 'rgba(245, 158, 11, 0.2)' : '#FFF7ED' }]}>
                                <Icon name="shape-outline" size={22} color="#F59E0B" />
                            </View>
                            <Text style={[componentStyles.statLabel, { color: colors.onSurfaceVariant }]}>Categoría</Text>
                            <Text style={[componentStyles.statValue, { color: colors.onSurface }]} numberOfLines={1}>
                                {LABELS[request.category] || 'General'}
                            </Text>
                        </View>
                    </View>

                    <Text style={[componentStyles.sectionTitle, { color: colors.onSurface }]}>Ubicación de Recojo</Text>
                    <View style={[componentStyles.widgetBox, { backgroundColor: colors.surfaceVariant }]}>
                        <View style={[componentStyles.widgetIconBg, { backgroundColor: dark ? 'rgba(239, 68, 68, 0.2)' : '#FFEBEE' }]}>
                            <Icon name="map-marker-radius" size={24} color={colors.error} />
                        </View>
                        <View style={componentStyles.widgetTextContainer}>
                            <Text style={[componentStyles.widgetValue, { color: colors.onSurface }]}>
                                {request.location?.address || 'Ubicación registrada'}
                            </Text>
                        </View>
                    </View>

                    {request.description ? (
                        <>
                            <Text style={[componentStyles.sectionTitle, { color: colors.onSurface }]}>Notas Adicionales</Text>
                            <View style={[componentStyles.widgetBox, { backgroundColor: colors.surfaceVariant }]}>
                                <Text style={[componentStyles.descriptionText, { color: colors.onSurfaceVariant }]}>{request.description}</Text>
                            </View>
                        </>
                    ) : null}

                    {/* Botón de Cancelar Dinámico */}
                    {(request.status === 'PENDING' || !request.status) && (
                        <Button
                            mode="outlined"
                            onPress={handleCancel}
                            style={[componentStyles.cancelBtn, { borderColor: colors.error }]}
                            textColor={colors.error}
                            icon="close-circle-outline"
                            loading={isLoading}
                            disabled={isLoading}
                        >
                            Cancelar Solicitud
                        </Button>
                    )}
                </View>
            </ScrollView>

            <AwesomeAlert
                visible={alertConfig.visible}
                title={alertConfig.title}
                message={alertConfig.message}
                type={alertConfig.type}
                onConfirm={alertConfig.onConfirm}
                onCancel={alertConfig.onCancel}
                theme={theme} // 🚨 Sincronización con el modal
            />
        </View>
    );
};

// 🎨 ESTILOS DINÁMICOS BASADOS EN EL TEMA
const getStyles = (theme) => StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: theme.colors.background },
    floatingHeader: { position: 'absolute', top: 0, left: 0, right: 0, paddingTop: Platform.OS === 'ios' ? 50 : (StatusBar.currentHeight || 0) + 10, paddingHorizontal: 20, zIndex: 10 },
    backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
    heroImageContainer: { position: 'absolute', top: 0, left: 0, right: 0, height: height * 0.4, backgroundColor: theme.colors.primary },
    heroImage: { width: '100%', height: '100%' },
    placeholderImage: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    imageGradient: { position: 'absolute', top: 0, left: 0, right: 0, height: 100, backgroundColor: 'rgba(0,0,0,0.2)' },
    scrollView: { flex: 1 },
    scrollContent: { paddingTop: height * 0.32, paddingBottom: 40 },
    infoCard: { borderTopLeftRadius: 35, borderTopRightRadius: 35, minHeight: height * 0.68, paddingHorizontal: 25, paddingTop: 35, paddingBottom: 20, elevation: 15 },
    statusBadge: { position: 'absolute', top: -18, right: 30, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, elevation: 4, gap: 6 },
    statusText: { fontSize: 13, fontWeight: 'bold' },
    materialTitle: { fontSize: 26, fontWeight: 'bold', marginBottom: 5 },
    dateText: { fontSize: 14 },
    divider: { height: 1, marginVertical: 20 },
    statsRow: { flexDirection: 'row', gap: 15, marginBottom: 25 },
    statBox: { flex: 1, padding: 15, borderRadius: 20, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)' },
    statIconCircle: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
    statLabel: { fontSize: 12, marginBottom: 2 },
    statValue: { fontSize: 15, fontWeight: 'bold' },
    sectionTitle: { fontSize: 15, fontWeight: 'bold', marginBottom: 12, marginTop: 5 },
    widgetBox: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 20, marginBottom: 20 },
    widgetIconBg: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    widgetTextContainer: { flex: 1 },
    widgetValue: { fontSize: 14, fontWeight: '600', lineHeight: 20 },
    descriptionText: { fontSize: 14, lineHeight: 22 },
    cancelBtn: { marginTop: 10, borderRadius: 15, borderWidth: 1.5, paddingVertical: 4 },
});