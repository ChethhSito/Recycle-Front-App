import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, StatusBar, Platform } from 'react-native';
import { Text, Button, Avatar, Divider, useTheme } from 'react-native-paper'; // 🚀 Importamos useTheme
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRequestStore } from '../../hooks/use-request-store';
import { AwesomeAlert } from '../../componentes/modal/modal';

const { width, height } = Dimensions.get('window');

export const RequestDetailScreen = ({ route, navigation }) => {
    const theme = useTheme(); // 🎨 Obtenemos el tema (colores, modo oscuro/claro)
    const { colors, dark } = theme;
    const componentStyles = getStyles(theme);

    const { request } = route.params || {};
    const { startAcceptingRequest, isLoading } = useRequestStore();

    const item = {
        id: request?.id || request?._id,
        title: request?.title || 'Material Reciclable',
        user: request?.user || 'Usuario Anónimo',
        image: request?.image || 'https://via.placeholder.com/400x300?text=Sin+Imagen',
        quantity: request?.quantity || '---',
        distance: request?.distance || 'Cerca',
        description: request?.description || 'El usuario no ha añadido una descripción adicional.',
        address: request?.address || 'Ubicación en mapa',
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

    const handleAccept = () => {
        if (!item.id) {
            showAlert("Error", "No se encontró el ID de la solicitud", "error", hideAlert);
            return;
        }

        showAlert(
            "Confirmar Recojo",
            `¿Deseas aceptar el recojo de ${item.quantity} de ${item.title}?`,
            "question",
            async () => {
                hideAlert();
                const success = await startAcceptingRequest(item.id);
                if (success) {
                    setTimeout(() => {
                        showAlert("¡Excelente!", "Has aceptado el recojo. Revisa tu ruta en el mapa.", "success", () => {
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
            {/* Barra de estado dinámica: En modo oscuro el texto es claro */}
            <StatusBar translucent backgroundColor="transparent" barStyle={dark ? "light-content" : "dark-content"} />

            {/* 1. HEADER FLOTANTE (Mantiene contraste sobre la imagen) */}
            <View style={componentStyles.floatingHeader}>
                <TouchableOpacity
                    style={[componentStyles.backButton, { backgroundColor: dark ? 'rgba(0,0,0,0.5)' : 'rgba(49, 37, 59, 0.4)' }]}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="#FFF" />
                </TouchableOpacity>
                <Text style={componentStyles.headerText}>Detalle del Recojo</Text>
            </View>

            <ScrollView
                style={componentStyles.scrollView}
                contentContainerStyle={componentStyles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* 2. IMAGEN DE PORTADA */}
                <View style={componentStyles.imageWrapper}>
                    <Image source={{ uri: item.image }} style={componentStyles.heroImage} resizeMode="cover" />
                    <View style={[componentStyles.distanceBadge, { backgroundColor: colors.primary }]}>
                        <Ionicons name="location" size={12} color="#FFF" />
                        <Text style={componentStyles.distanceText}>{item.distance}</Text>
                    </View>
                </View>

                {/* 3. TARJETA DE INFORMACIÓN DINÁMICA */}
                <View style={[componentStyles.infoCard, { backgroundColor: colors.surface }]}>
                    <View style={componentStyles.userRow}>
                        <Avatar.Text
                            size={44}
                            label={item.user.substring(0, 2).toUpperCase()}
                            style={{ backgroundColor: colors.primary }}
                        />
                        <View style={componentStyles.userTextContainer}>
                            <Text style={[componentStyles.userName, { color: colors.onSurface }]}>{item.user}</Text>
                            <Text style={[componentStyles.userStatus, { color: colors.onSurfaceVariant }]}>Ciudadano verificado</Text>
                        </View>
                        <View style={[componentStyles.ratingBadge, { backgroundColor: dark ? colors.surfaceVariant : '#FFF9C4' }]}>
                            <Ionicons name="star" size={14} color="#FBC02D" />
                            <Text style={[componentStyles.ratingText, { color: dark ? '#FAC96E' : '#856404' }]}>5.0</Text>
                        </View>
                    </View>

                    <Divider style={[componentStyles.mainDivider, { backgroundColor: colors.outlineVariant }]} />

                    <Text style={[componentStyles.materialTitle, { color: colors.onSurface }]}>{item.title}</Text>

                    <View style={componentStyles.statsGrid}>
                        <View style={[componentStyles.statBox, { backgroundColor: colors.surfaceVariant, borderColor: colors.outlineVariant }]}>
                            <View style={[componentStyles.iconCircle, { backgroundColor: dark ? colors.primaryContainer : '#E8F5F1' }]}>
                                <MaterialCommunityIcons name="weight-kilogram" size={20} color={colors.primary} />
                            </View>
                            <Text style={[componentStyles.statLabel, { color: colors.onSurfaceVariant }]}>Cantidad</Text>
                            <Text style={[componentStyles.statValue, { color: colors.onSurface }]}>{item.quantity}</Text>
                        </View>

                        <View style={[componentStyles.statBox, { backgroundColor: colors.surfaceVariant, borderColor: colors.outlineVariant }]}>
                            <View style={[componentStyles.iconCircle, { backgroundColor: dark ? colors.secondaryContainer : '#E3F2FD' }]}>
                                <MaterialCommunityIcons name="recycle" size={20} color={dark ? colors.secondary : '#1E88E5'} />
                            </View>
                            <Text style={[componentStyles.statLabel, { color: colors.onSurfaceVariant }]}>Tipo</Text>
                            <Text style={[componentStyles.statValue, { color: colors.onSurface }]}>Reciclable</Text>
                        </View>
                    </View>

                    <View style={componentStyles.section}>
                        <Text style={[componentStyles.sectionTitle, { color: colors.onSurface }]}>Descripción</Text>
                        <Text style={[componentStyles.descriptionText, { color: colors.onSurfaceVariant }]}>{item.description}</Text>
                    </View>

                    <View style={componentStyles.section}>
                        <Text style={[componentStyles.sectionTitle, { color: colors.onSurface }]}>Punto de Recojo</Text>
                        <View style={[componentStyles.locationBox, { backgroundColor: colors.primaryContainer, borderColor: colors.outlineVariant }]}>
                            <View style={[componentStyles.mapIconCircle, { backgroundColor: colors.surface }]}>
                                <Ionicons name="map-outline" size={20} color={colors.primary} />
                            </View>
                            <Text style={[componentStyles.addressText, { color: colors.onPrimaryContainer }]} numberOfLines={2}>{item.address}</Text>
                        </View>
                    </View>
                </View>

                <View style={{ height: 120 }} />
            </ScrollView>

            {/* 4. FOOTER FIJO */}
            <View style={[componentStyles.footer, { backgroundColor: colors.surface, borderTopColor: colors.outlineVariant }]}>
                <Button
                    mode="contained"
                    icon="truck-delivery"
                    onPress={handleAccept}
                    loading={isLoading}
                    style={componentStyles.acceptButton}
                    contentStyle={componentStyles.buttonContent}
                    labelStyle={[componentStyles.buttonLabel, { color: dark ? '#121212' : '#31253B' }]}
                >
                    Aceptar Solicitud
                </Button>
            </View>

            <AwesomeAlert
                visible={alertConfig.visible}
                title={alertConfig.title}
                message={alertConfig.message}
                type={alertConfig.type}
                onConfirm={alertConfig.onConfirm}
                onCancel={alertConfig.onCancel}
                theme={theme} // 🚨 Pasamos el tema a la alerta
            />
        </View>
    );
};

// 🎨 ESTILOS DINÁMICOS
const getStyles = (theme) => StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: theme.colors.background },
    floatingHeader: { position: 'absolute', top: 0, left: 0, right: 0, height: 100, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 40, zIndex: 10 },
    backButton: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    headerText: { marginLeft: 15, fontSize: 18, fontWeight: 'bold', color: '#FFF', textShadowColor: 'rgba(0, 0, 0, 0.3)', textShadowRadius: 4 },
    imageWrapper: { width: width, height: height * 0.4 },
    heroImage: { width: '100%', height: '100%' },
    distanceBadge: { position: 'absolute', bottom: 45, right: 20, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
    distanceText: { color: '#FFF', fontSize: 12, fontWeight: 'bold', marginLeft: 4 },
    infoCard: { flex: 1, marginTop: -35, borderTopLeftRadius: 35, borderTopRightRadius: 35, paddingHorizontal: 25, paddingTop: 30, elevation: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
    userRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    userTextContainer: { flex: 1, marginLeft: 12 },
    userName: { fontSize: 17, fontWeight: 'bold' },
    userStatus: { fontSize: 13 },
    ratingBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    ratingText: { marginLeft: 4, fontWeight: 'bold', fontSize: 13 },
    mainDivider: { marginBottom: 20, height: 1 },
    materialTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textTransform: 'capitalize' },
    statsGrid: { flexDirection: 'row', gap: 12, marginBottom: 25 },
    statBox: { flex: 1, borderRadius: 20, padding: 15, alignItems: 'center', borderWidth: 1 },
    iconCircle: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
    statLabel: { fontSize: 12, marginBottom: 2 },
    statValue: { fontSize: 15, fontWeight: 'bold' },
    section: { marginBottom: 25 },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
    descriptionText: { fontSize: 15, lineHeight: 24 },
    locationBox: { flexDirection: 'row', alignItems: 'center', padding: 15, borderRadius: 18, borderWidth: 1 },
    mapIconCircle: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    addressText: { flex: 1, fontSize: 14, fontWeight: '600' },
    footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, paddingBottom: Platform.OS === 'ios' ? 40 : 25, borderTopWidth: 1 },
    acceptButton: { backgroundColor: '#FAC96E', borderRadius: 18, elevation: 4 },
    buttonContent: { height: 58 },
    buttonLabel: { fontSize: 18, fontWeight: 'bold' },
});