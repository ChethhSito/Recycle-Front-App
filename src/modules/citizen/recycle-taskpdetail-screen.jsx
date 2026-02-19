import React, { useState } from 'react'; // 🚨 Agregamos useState
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, StatusBar, Alert, Platform
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Button } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker'; // 🚨 Importar para la cámara
import { useRequestStore } from '../../hooks/use-request-store';

const { width, height } = Dimensions.get('window');

const COLORS = {
    primary: '#31253B',
    greenMain: '#018f64',
    mintBg: '#b1eedc',
    white: '#FFFFFF',
    textGrey: '#5A7A70',
    lightGrey: '#F9FAFB',
    danger: '#EF4444',
    blueStatus: '#2563EB'
};

export const RecyclerTaskDetailScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { startCompletingRequest, isLoading } = useRequestStore();

    // --- ESTADOS NUEVOS ---
    const [evidenceImage, setEvidenceImage] = useState(null); // Para guardar la URI de la foto

    const { request } = route.params || {};
    if (!request) return null;

    const LABELS = {
        'plastic': 'Plástico', 'paper': 'Papel', 'cardboard': 'Cartón',
        'glass': 'Vidrio', 'metal': 'Metal', 'electronics': 'RAEE',
        'steel': 'Acero', 'copper': 'Cobre', 'pet': 'Botellas PET', 'hdpe': 'Plástico Duro'
    };
    const title = LABELS[request.materialType] || LABELS[request.category] || 'Tarea de Recojo';
    const unit = request.measureType === 'peso' ? 'Kg' : 'Bolsas';

    // 🚨 1. FUNCIÓN PARA ABRIR LA CÁMARA
    const takePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert("Permiso denegado", "Necesitamos acceso a la cámara para la evidencia.");
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

    // 🚨 2. FUNCIÓN PARA FINALIZAR (Modificada para incluir la foto)
    const handleComplete = () => {
        if (!evidenceImage) {
            Alert.alert("Evidencia faltante", "Por favor, toma una foto del material antes de finalizar.");
            return;
        }

        Alert.alert(
            "Confirmar Entrega",
            "¿Confirmas que recibiste el material? Se enviará la foto y se darán los puntos.",
            [
                { text: "Aún no", style: "cancel" },
                {
                    text: "Sí, completar",
                    onPress: async () => {
                        // Enviamos la URI de la foto al store actualizado
                        const success = await startCompletingRequest(request._id, evidenceImage);
                        if (success) navigation.goBack();
                    }
                }
            ]
        );
    };

    return (
        <View style={styles.mainContainer}>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

            <View style={styles.floatingHeader}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Icon name="arrow-left" size={24} color="#FFF" />
                </TouchableOpacity>
            </View>

            <View style={styles.heroImageContainer}>
                {request.imageUrl ? (
                    <Image source={{ uri: request.imageUrl }} style={styles.heroImage} resizeMode="cover" />
                ) : (
                    <View style={styles.placeholderImage}>
                        <Icon name="image-off" size={60} color="rgba(255,255,255,0.4)" />
                    </View>
                )}
                <View style={styles.imageGradient} />
            </View>

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.infoCard}>

                    <View style={styles.statusBadge}>
                        <Icon name="account-check" size={18} color={COLORS.blueStatus} />
                        <Text style={styles.statusText}>Aceptado</Text>
                    </View>

                    <Text style={styles.materialTitle}>{title}</Text>

                    <View style={styles.divider} />

                    {/* Stats de cantidad y categoría */}
                    <View style={styles.statsRow}>
                        <View style={styles.statBox}>
                            <Icon name="scale" size={20} color={COLORS.greenMain} />
                            <Text style={styles.statLabel}>Cantidad</Text>
                            <Text style={styles.statValue}>{request.quantity} {unit}</Text>
                        </View>
                        <View style={styles.statBox}>
                            <Icon name="shape-outline" size={20} color="#F59E0B" />
                            <Text style={styles.statLabel}>Categoría</Text>
                            <Text style={styles.statValue}>{LABELS[request.category] || 'General'}</Text>
                        </View>
                    </View>

                    {/* Ubicación */}
                    <Text style={styles.sectionTitle}>Ubicación de Recojo</Text>
                    <View style={styles.locationWidget}>
                        <Icon name="map-marker-radius" size={24} color={COLORS.danger} />
                        <Text style={styles.addressText}>{request.location?.address || 'Ver mapa'}</Text>
                    </View>

                    {/* 🚨 SECCIÓN DE EVIDENCIA (NUEVA) */}
                    <Text style={styles.sectionTitle}>Evidencia de Recojo</Text>
                    {evidenceImage ? (
                        <View style={styles.evidencePreviewContainer}>
                            <Image source={{ uri: evidenceImage }} style={styles.evidenceImage} />
                            <TouchableOpacity style={styles.retakeBtn} onPress={takePhoto}>
                                <Icon name="camera-refresh" size={20} color="#FFF" />
                                <Text style={styles.retakeText}>Cambiar Foto</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <TouchableOpacity style={styles.takePhotoCard} onPress={takePhoto}>
                            <Icon name="camera-plus" size={30} color={COLORS.greenMain} />
                            <Text style={styles.takePhotoText}>Tomar foto del material</Text>
                        </TouchableOpacity>
                    )}

                    {/* BOTÓN FINALIZAR */}
                    <Button
                        mode="contained"
                        onPress={handleComplete}
                        style={[styles.mainActionBtn, !evidenceImage && { opacity: 0.6 }]}
                        contentStyle={{ height: 56 }}
                        loading={isLoading}
                        icon="check-decagram"
                        disabled={isLoading}
                    >
                        Finalizar Recojo
                    </Button>
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
    backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
    heroImageContainer: { position: 'absolute', top: 0, left: 0, right: 0, height: height * 0.4, backgroundColor: COLORS.greenMain },
    heroImage: { width: '100%', height: '100%' },
    imageGradient: { position: 'absolute', top: 0, left: 0, right: 0, height: 100, backgroundColor: 'rgba(0,0,0,0.2)' },
    scrollView: { flex: 1 },
    scrollContent: { paddingTop: height * 0.32, paddingBottom: 40 },
    infoCard: {
        backgroundColor: COLORS.white, borderTopLeftRadius: 35, borderTopRightRadius: 35,
        minHeight: height * 0.68, paddingHorizontal: 25, paddingTop: 35, paddingBottom: 20,
    },
    statusBadge: {
        position: 'absolute', top: -18, right: 30, flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#EFF6FF', elevation: 4, gap: 6
    },
    statusText: { fontSize: 13, fontWeight: 'bold', color: COLORS.blueStatus },
    materialTitle: { fontSize: 26, fontWeight: 'bold', color: COLORS.primary, marginBottom: 5 },
    divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 20 },
    statsRow: { flexDirection: 'row', gap: 15, marginBottom: 25 },
    statBox: { flex: 1, backgroundColor: COLORS.lightGrey, padding: 15, borderRadius: 20, alignItems: 'center' },
    statLabel: { fontSize: 11, color: COLORS.textGrey, textTransform: 'uppercase' },
    statValue: { fontSize: 15, fontWeight: 'bold', color: COLORS.primary },
    sectionTitle: { fontSize: 15, fontWeight: 'bold', color: COLORS.primary, marginBottom: 12, marginTop: 5 },
    locationWidget: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.lightGrey, padding: 16, borderRadius: 20, marginBottom: 20, gap: 12 },
    addressText: { fontSize: 14, fontWeight: '600', color: COLORS.primary, flex: 1 },

    // Estilos de Evidencia
    takePhotoCard: {
        height: 120, borderStyle: 'dashed', borderWidth: 2, borderColor: COLORS.greenMain,
        borderRadius: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: '#E8F5F1', marginBottom: 25
    },
    takePhotoText: { marginTop: 10, color: COLORS.greenMain, fontWeight: '600' },
    evidencePreviewContainer: { marginBottom: 25, borderRadius: 20, overflow: 'hidden', height: 200 },
    evidenceImage: { width: '100%', height: '100%' },
    retakeBtn: {
        position: 'absolute', bottom: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, flexDirection: 'row', alignItems: 'center', gap: 6
    },
    retakeText: { color: '#FFF', fontSize: 12, fontWeight: '600' },

    mainActionBtn: { marginTop: 10, backgroundColor: COLORS.greenMain, borderRadius: 18 },
});