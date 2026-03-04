import React, { useState } from 'react';
import {
    View, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, StatusBar, Platform
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Text, Button, useTheme, ActivityIndicator } from 'react-native-paper'; // 🚀 Importación de Paper
import * as ImagePicker from 'expo-image-picker';
import { useRequestStore } from '../../hooks/use-request-store';
import { AwesomeAlert } from '../../componentes/modal/modal';

const { width, height } = Dimensions.get('window');

export const RecyclerTaskDetailScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const theme = useTheme(); // 🎨 Obtenemos el tema dinámico
    const { colors, dark } = theme;
    const componentStyles = getStyles(theme);

    const { startCompletingRequest, isLoading } = useRequestStore();
    const [evidenceImage, setEvidenceImage] = useState(null);

    const { request } = route.params || {};
    if (!request) return null;

    const LABELS = {
        'plastic': 'Plástico', 'paper': 'Papel', 'cardboard': 'Cartón',
        'glass': 'Vidrio', 'metal': 'Metal', 'electronics': 'RAEE',
        'steel': 'Acero', 'copper': 'Cobre', 'pet': 'Botellas PET', 'hdpe': 'Plástico Duro'
    };
    const title = LABELS[request.materialType] || LABELS[request.category] || 'Tarea de Recojo';
    const unit = request.measureType === 'peso' ? 'Kg' : 'Bolsas';

    const takePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            showAlert("Permiso denegado", "Necesitamos acceso a la cámara para registrar la evidencia.", "error", hideAlert);
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.7,
        });

        if (!result.canceled) {
            setEvidenceImage(result.assets[0].uri);
        }
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

    const handleComplete = () => {
        if (!evidenceImage) {
            showAlert("Evidencia faltante", "Toma una foto del material para validar el impacto ambiental.", "error", hideAlert);
            return;
        }

        showAlert(
            "Confirmar Entrega",
            "¿Confirmas que recibiste el material? Se asignarán los puntos al ciudadano.",
            "question",
            async () => {
                hideAlert();
                const success = await startCompletingRequest(request._id, evidenceImage);
                if (success) {
                    setTimeout(() => {
                        showAlert("¡Misión Cumplida!", "El recojo se completó con éxito.", "success", () => {
                            hideAlert();
                            navigation.goBack();
                        });
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
                        <Icon name="image-off" size={60} color="rgba(255,255,255,0.4)" />
                    </View>
                )}
                <View style={componentStyles.imageGradient} />
            </View>

            <ScrollView style={componentStyles.scrollView} contentContainerStyle={componentStyles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={[componentStyles.infoCard, { backgroundColor: colors.surface }]}>

                    <View style={[componentStyles.statusBadge, { backgroundColor: dark ? colors.primaryContainer : '#EFF6FF' }]}>
                        <Icon name="account-check" size={18} color={dark ? colors.onPrimaryContainer : '#2563EB'} />
                        <Text style={[componentStyles.statusText, { color: dark ? colors.onPrimaryContainer : '#2563EB' }]}>Aceptado</Text>
                    </View>

                    <Text style={[componentStyles.materialTitle, { color: colors.onSurface }]}>{title}</Text>

                    <View style={[componentStyles.divider, { backgroundColor: colors.outlineVariant }]} />

                    <View style={componentStyles.statsRow}>
                        <View style={[componentStyles.statBox, { backgroundColor: colors.background }]}>
                            <Icon name="scale" size={20} color={colors.primary} />
                            <Text style={[componentStyles.statLabel, { color: colors.onSurfaceVariant }]}>Cantidad</Text>
                            <Text style={[componentStyles.statValue, { color: colors.onSurface }]}>{request.quantity} {unit}</Text>
                        </View>
                        <View style={[componentStyles.statBox, { backgroundColor: colors.background }]}>
                            <Icon name="shape-outline" size={20} color="#F59E0B" />
                            <Text style={[componentStyles.statLabel, { color: colors.onSurfaceVariant }]}>Categoría</Text>
                            <Text style={[componentStyles.statValue, { color: colors.onSurface }]}>{LABELS[request.category] || 'General'}</Text>
                        </View>
                    </View>

                    <Text style={[componentStyles.sectionTitle, { color: colors.onSurface }]}>Ubicación de Recojo</Text>
                    <View style={[componentStyles.locationWidget, { backgroundColor: colors.background }]}>
                        <Icon name="map-marker-radius" size={24} color={colors.error} />
                        <Text style={[componentStyles.addressText, { color: colors.onSurface }]}>{request.location?.address || 'Ver mapa'}</Text>
                    </View>

                    <Text style={[componentStyles.sectionTitle, { color: colors.onSurface }]}>Evidencia de Recojo</Text>
                    {evidenceImage ? (
                        <View style={componentStyles.evidencePreviewContainer}>
                            <Image source={{ uri: evidenceImage }} style={componentStyles.evidenceImage} />
                            <TouchableOpacity style={componentStyles.retakeBtn} onPress={takePhoto}>
                                <Icon name="camera-refresh" size={20} color="#FFF" />
                                <Text style={componentStyles.retakeText}>Cambiar Foto</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <TouchableOpacity
                            style={[componentStyles.takePhotoCard, { backgroundColor: colors.primaryContainer, borderColor: colors.primary }]}
                            onPress={takePhoto}
                        >
                            <Icon name="camera-plus" size={30} color={colors.primary} />
                            <Text style={[componentStyles.takePhotoText, { color: colors.primary }]}>Tomar foto del material</Text>
                        </TouchableOpacity>
                    )}

                    <Button
                        mode="contained"
                        onPress={handleComplete}
                        style={[componentStyles.mainActionBtn, { backgroundColor: colors.primary }, !evidenceImage && { opacity: 0.6 }]}
                        contentStyle={{ height: 56 }}
                        loading={isLoading}
                        icon="check-decagram"
                        disabled={isLoading}
                        labelStyle={{ color: '#FFF', fontWeight: 'bold' }}
                    >
                        Finalizar Recojo
                    </Button>
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
    placeholderImage: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
    imageGradient: { position: 'absolute', top: 0, left: 0, right: 0, height: 100, backgroundColor: 'rgba(0,0,0,0.2)' },
    scrollView: { flex: 1 },
    scrollContent: { paddingTop: height * 0.32, paddingBottom: 40 },
    infoCard: { borderTopLeftRadius: 35, borderTopRightRadius: 35, minHeight: height * 0.68, paddingHorizontal: 25, paddingTop: 35, paddingBottom: 20 },
    statusBadge: { position: 'absolute', top: -18, right: 30, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, elevation: 4, gap: 6 },
    statusText: { fontSize: 13, fontWeight: 'bold' },
    materialTitle: { fontSize: 26, fontWeight: 'bold', marginBottom: 5 },
    divider: { height: 1, marginVertical: 20 },
    statsRow: { flexDirection: 'row', gap: 15, marginBottom: 25 },
    statBox: { flex: 1, padding: 15, borderRadius: 20, alignItems: 'center' },
    statLabel: { fontSize: 11, textTransform: 'uppercase' },
    statValue: { fontSize: 15, fontWeight: 'bold' },
    sectionTitle: { fontSize: 15, fontWeight: 'bold', marginBottom: 12, marginTop: 5 },
    locationWidget: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 20, marginBottom: 20, gap: 12 },
    addressText: { fontSize: 14, fontWeight: '600', flex: 1 },
    takePhotoCard: { height: 120, borderStyle: 'dashed', borderWidth: 2, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 25 },
    takePhotoText: { marginTop: 10, fontWeight: '600' },
    evidencePreviewContainer: { marginBottom: 25, borderRadius: 20, overflow: 'hidden', height: 200 },
    evidenceImage: { width: '100%', height: '100%' },
    retakeBtn: { position: 'absolute', bottom: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, flexDirection: 'row', alignItems: 'center', gap: 6 },
    retakeText: { color: '#FFF', fontSize: 12, fontWeight: '600' },
    mainActionBtn: { marginTop: 10, borderRadius: 18 },
});