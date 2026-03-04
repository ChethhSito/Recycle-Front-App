import React, { useState, useEffect } from 'react';
import {
    View, StyleSheet, ScrollView, TouchableOpacity, Image, Platform, Alert, ActivityIndicator, Dimensions, StatusBar
} from 'react-native';
import { Svg, Path } from 'react-native-svg';
import { Text, TextInput, Button, useTheme } from 'react-native-paper'; // 🚀 Paper para temas
import { useForm, Controller } from 'react-hook-form';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useRequestStore } from '../../hooks/use-request-store';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AwesomeAlert } from '../../componentes/modal/modal';

const { width } = Dimensions.get('window');

// 🎨 CATEGORÍAS (Colores adaptables para el modo oscuro)
const getCategories = (isDark) => [
    {
        id: 'plastic', label: 'Plástico', icon: 'bottle-soda', color: '#3B82F6',
        bg: isDark ? 'rgba(59, 130, 246, 0.2)' : '#D4E7FF',
        subcategories: [
            { id: 'pet', label: 'PET (Botellas)', icon: 'bottle-soda-classic-outline' },
            { id: 'hdpe', label: 'Envases Duros', icon: 'pail-outline' },
            { id: 'pvc', label: 'Tubos / PVC', icon: 'pipe' },
            { id: 'other_plastic', label: 'Otros Plásticos', icon: 'recycle-variant' }
        ]
    },
    {
        id: 'paper', label: 'Papel/Cartón', icon: 'package-variant', color: '#F97316',
        bg: isDark ? 'rgba(249, 115, 22, 0.2)' : '#FFE4CC',
        subcategories: [
            { id: 'box', label: 'Cajas Cartón', icon: 'package-variant-closed' },
            { id: 'paper', label: 'Papel Blanco', icon: 'file-document-outline' },
            { id: 'newspaper', label: 'Periódico', icon: 'newspaper-variant-outline' },
            { id: 'mixed', label: 'Mixto', icon: 'folder-open-outline' }
        ]
    },
    {
        id: 'metal', label: 'Metal', icon: 'screw-machine-flat-top', color: isDark ? '#9CA3AF' : '#6B7280',
        bg: isDark ? 'rgba(156, 163, 175, 0.2)' : '#E5E7EB',
        subcategories: [
            { id: 'copper', label: 'Cobre / Cables', icon: 'cable-data' },
            { id: 'aluminum', label: 'Latas Alum.', icon: 'beer-outline' },
            { id: 'steel', label: 'Fierro / Acero', icon: 'girder' },
            { id: 'scrap', label: 'Chatarra', icon: 'wrench-outline' }
        ]
    },
    {
        id: 'electronics', label: 'RAEE', icon: 'monitor', color: '#EF4444',
        bg: isDark ? 'rgba(239, 68, 68, 0.2)' : '#FFDDDD',
        subcategories: [
            { id: 'pc', label: 'Computadoras', icon: 'laptop' },
            { id: 'phone', label: 'Celulares', icon: 'cellphone' },
            { id: 'appliance', label: 'Electrodom.', icon: 'washing-machine' }
        ]
    },
];

export const CreateRequestScreen = ({ navigation }) => {
    const theme = useTheme(); // 🎨 Obtenemos el tema dinámico
    const { colors, dark } = theme;
    const componentStyles = getStyles(theme);
    const CATEGORIES = getCategories(dark);

    const [loadingLocation, setLoadingLocation] = useState(false);
    const [addressText, setAddressText] = useState("Toca para localizarte");
    const [imageUri, setImageUri] = useState(null);
    const [measureType, setMeasureType] = useState('peso');
    const { startCreatingRequest, isLoading } = useRequestStore();
    const [activeCategory, setActiveCategory] = useState(null);
    const [selectedSubMaterial, setSelectedSubMaterial] = useState(null);

    const { control, handleSubmit, setValue } = useForm({
        defaultValues: { quantity: '', description: '', locationCoords: null }
    });

    const [alertConfig, setAlertConfig] = useState({
        visible: false, title: '', message: '', type: 'success'
    });

    const hideAlert = () => {
        setAlertConfig({ ...alertConfig, visible: false });
        if (alertConfig.type === 'success') navigation.goBack();
    };

    const showAlert = (title, message, type = 'success') => {
        setAlertConfig({ visible: true, title, message, type });
    };

    const getLocation = async () => {
        setLoadingLocation(true);
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permiso denegado', 'Activa el GPS.');
                setLoadingLocation(false);
                return;
            }
            let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
            const { latitude, longitude } = location.coords;
            setValue('locationCoords', { latitude, longitude });
            let addressResponse = await Location.reverseGeocodeAsync({ latitude, longitude });
            if (addressResponse.length > 0) {
                const addr = addressResponse[0];
                const formatted = `${addr.street || 'Calle s/n'} ${addr.streetNumber || ''}, ${addr.district || ''}`;
                setAddressText(formatted);
            } else {
                setAddressText(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
            }
        } catch (error) {
            console.log("Error GPS:", error);
            setAddressText("Error al detectar ubicación");
        } finally {
            setLoadingLocation(false);
        }
    };

    useEffect(() => { getLocation(); }, []);

    const takePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') return Alert.alert('Permiso necesario', 'Necesitamos acceso a la cámara.');
        let result = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [4, 3], quality: 0.5 });
        if (!result.canceled) setImageUri(result.assets[0].uri);
    };

    const onSubmit = async (data) => {
        if (!selectedSubMaterial) return Alert.alert('Falta dato', 'Selecciona un tipo de material.');
        if (!imageUri) return Alert.alert('Falta evidencia', 'Debes tomar una foto.');
        if (!data.locationCoords) return Alert.alert('Falta ubicación', 'Espera a que detectemos tu ubicación.');

        const success = await startCreatingRequest({
            category: activeCategory.id,
            materialType: selectedSubMaterial.id,
            quantity: data.quantity,
            measureType: measureType,
            locationCoords: data.locationCoords,
            imageUri: imageUri,
            address: addressText,
            description: data.description
        });

        if (success) {
            showAlert("¡Éxito!", "Tu solicitud ha sido publicada. Pronto un reciclador se pondrá en contacto.");
        } else {
            showAlert("Error", "No pudimos conectar con el servidor.", "error");
        }
    };

    const resetSelection = () => {
        setActiveCategory(null);
        setSelectedSubMaterial(null);
    };

    return (
        <View style={componentStyles.mainContainer}>
            <StatusBar barStyle={dark ? "light-content" : "dark-content"} backgroundColor={dark ? colors.surface : "#B7ECDD"} />

            <ScrollView contentContainerStyle={componentStyles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* HEADER */}
                <View style={[componentStyles.headerWrapper, { backgroundColor: dark ? colors.surface : "#B7ECDD" }]}>
                    <View style={componentStyles.headerContent}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={[componentStyles.backBtn, { backgroundColor: dark ? colors.elevation.level2 : 'rgba(255,255,255,0.4)' }]}>
                            <MaterialCommunityIcons name="chevron-left" size={28} color={colors.onSurface} />
                        </TouchableOpacity>
                        <View style={componentStyles.headerTextContainer}>
                            <Text style={[componentStyles.headerTitle, { color: colors.onSurface }]}>Nueva Solicitud</Text>
                            <Text style={[componentStyles.headerSubtitle, { color: colors.onSurfaceVariant }]}>Detalla lo que vas a reciclar</Text>
                        </View>
                    </View>
                    <Svg width={width} height={40} viewBox="0 0 1440 320" preserveAspectRatio="none">
                        <Path fill={dark ? colors.surface : "#B7ECDD"} d="M0,192L48,197.3C96,203,192,213,288,192C384,171,480,117,576,112C672,107,768,149,864,165.3C960,181,1056,171,1152,149.3C1248,128,1344,96,1392,80L1440,64L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z" />
                    </Svg>
                </View>

                {/* FORM CARD */}
                <View style={[componentStyles.formCard, { backgroundColor: colors.surface }]}>

                    <View style={componentStyles.sectionHeaderRow}>
                        <Text style={[componentStyles.sectionLabel, { color: colors.onSurfaceVariant }]}>
                            {activeCategory ? `Tipo de ${activeCategory.label}` : "Selecciona el material"}
                        </Text>
                        {activeCategory && (
                            <TouchableOpacity onPress={resetSelection}>
                                <Text style={[componentStyles.changeText, { color: colors.primary }]}>Cambiar</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    <View style={componentStyles.materialsGrid}>
                        {!activeCategory && CATEGORIES.map((cat) => (
                            <TouchableOpacity
                                key={cat.id}
                                style={[componentStyles.statCard, { backgroundColor: cat.bg }]}
                                onPress={() => setActiveCategory(cat)}
                                activeOpacity={0.9}
                            >
                                <View style={componentStyles.statIconContainer}>
                                    <MaterialCommunityIcons name={cat.icon} size={90} color={cat.color} style={{ opacity: 0.15 }} />
                                </View>
                                <View style={componentStyles.statContent}>
                                    <View style={[componentStyles.miniIconCircle, { backgroundColor: dark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.6)' }]}>
                                        <MaterialCommunityIcons name={cat.icon} size={24} color={cat.color} />
                                    </View>
                                    <Text style={[componentStyles.statLabel, { color: dark ? '#FFF' : colors.onSurface }]}>{cat.label}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}

                        {activeCategory && activeCategory.subcategories.map((sub) => {
                            const isSelected = selectedSubMaterial?.id === sub.id;
                            return (
                                <TouchableOpacity
                                    key={sub.id}
                                    style={[
                                        componentStyles.subCatItem,
                                        { backgroundColor: dark ? colors.elevation.level1 : '#F9FAFB', borderColor: colors.outlineVariant },
                                        isSelected && { backgroundColor: colors.primary, borderColor: colors.primary }
                                    ]}
                                    onPress={() => setSelectedSubMaterial(sub)}
                                >
                                    <Text style={[
                                        componentStyles.subCatText,
                                        { color: colors.onSurfaceVariant },
                                        isSelected && { color: '#FFF' }
                                    ]}>{sub.label}</Text>
                                    {isSelected && <MaterialCommunityIcons name="check-circle" size={18} color="#FFF" />}
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    <Text style={[componentStyles.sectionLabel, { color: colors.onSurfaceVariant }]}>Cantidad aproximada</Text>
                    <View style={[componentStyles.measureContainer, { backgroundColor: colors.surfaceVariant }]}>
                        <TouchableOpacity style={[componentStyles.measureTab, measureType === 'peso' && { backgroundColor: colors.primary }]} onPress={() => setMeasureType('peso')}>
                            <Text style={[componentStyles.measureTabText, { color: colors.onSurfaceVariant }, measureType === 'peso' && { color: '#FFF' }]}>Kg</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[componentStyles.measureTab, measureType === 'cantidad' && { backgroundColor: colors.primary }]} onPress={() => setMeasureType('cantidad')}>
                            <Text style={[componentStyles.measureTabText, { color: colors.onSurfaceVariant }, measureType === 'cantidad' && { color: '#FFF' }]}>Bolsas</Text>
                        </TouchableOpacity>
                    </View>

                    <Controller
                        control={control}
                        name="quantity"
                        rules={{ required: true }}
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                mode="outlined"
                                placeholder={measureType === 'peso' ? "Ej: 2.5" : "Ej: 3"}
                                keyboardType="numeric"
                                style={[componentStyles.input, { backgroundColor: colors.surface }]}
                                value={value}
                                onChangeText={onChange}
                                outlineColor={colors.outlineVariant}
                                activeOutlineColor={colors.primary}
                                left={<TextInput.Icon icon="scale" color={colors.onSurfaceVariant} />}
                            />
                        )}
                    />

                    <Text style={[componentStyles.sectionLabel, { color: colors.onSurfaceVariant }]}>Notas adicionales (Opcional)</Text>
                    <Controller
                        control={control}
                        name="description"
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                mode="outlined"
                                placeholder="Ej: El material está en bolsas negras..."
                                multiline
                                numberOfLines={3}
                                style={[componentStyles.input, { height: 100, paddingTop: 10, backgroundColor: colors.surface }]}
                                value={value}
                                onChangeText={onChange}
                                outlineColor={colors.outlineVariant}
                                activeOutlineColor={colors.primary}
                                left={<TextInput.Icon icon="pencil-outline" color={colors.onSurfaceVariant} />}
                            />
                        )}
                    />

                    <Text style={[componentStyles.sectionLabel, { color: colors.onSurfaceVariant }]}>Foto de los residuos</Text>
                    <TouchableOpacity onPress={takePhoto} style={[componentStyles.photoBox, { backgroundColor: colors.background, borderColor: colors.outlineVariant }]}>
                        {imageUri ? (
                            <Image source={{ uri: imageUri }} style={componentStyles.fullImage} />
                        ) : (
                            <View style={componentStyles.photoPlaceholder}>
                                <View style={[componentStyles.cameraIconCircle, { backgroundColor: dark ? colors.background : '#E8F5F1' }]}>
                                    <MaterialCommunityIcons name="camera-plus" size={30} color={colors.primary} />
                                </View>
                                <Text style={[componentStyles.photoHint, { color: colors.onSurfaceVariant }]}>Capturar evidencia</Text>
                            </View>
                        )}
                    </TouchableOpacity>

                    <Text style={[componentStyles.sectionLabel, { color: colors.onSurfaceVariant }]}>Ubicación de recojo</Text>
                    <View style={[componentStyles.locWidget, { backgroundColor: colors.background, borderColor: colors.outlineVariant }]}>
                        <View style={[componentStyles.locIconBg, { backgroundColor: loadingLocation ? colors.surface : (dark ? 'rgba(239, 68, 68, 0.2)' : '#FFEBEE') }]}>
                            {loadingLocation ? <ActivityIndicator size="small" color={colors.primary} /> : <MaterialCommunityIcons name="map-marker-radius" size={26} color={colors.error} />}
                        </View>
                        <View style={componentStyles.locTextContainer}>
                            <Text style={[componentStyles.locLabelText, { color: colors.onSurfaceVariant }]}>Dirección detectada</Text>
                            <Text style={[componentStyles.locValueText, { color: colors.onSurface }]} numberOfLines={1}>{loadingLocation ? "Buscando..." : addressText}</Text>
                        </View>
                        <TouchableOpacity onPress={getLocation} style={[componentStyles.refreshBtn, { backgroundColor: colors.surface }]}>
                            <MaterialCommunityIcons name="refresh" size={22} color={colors.primary} />
                        </TouchableOpacity>
                    </View>

                    <Button
                        mode="contained"
                        onPress={handleSubmit(onSubmit)}
                        style={[componentStyles.mainSubmitBtn, { backgroundColor: colors.primary }]}
                        contentStyle={{ height: 56 }}
                        loading={isLoading}
                        icon="send-check"
                        labelStyle={{ color: '#FFF', fontWeight: 'bold', fontSize: 16 }}
                    >
                        Publicar Solicitud
                    </Button>
                </View>
            </ScrollView>

            <AwesomeAlert
                visible={alertConfig.visible}
                title={alertConfig.title}
                message={alertConfig.message}
                type={alertConfig.type}
                onConfirm={hideAlert}
                theme={theme}
            />
        </View>
    );
};

// 🎨 ESTILOS DINÁMICOS BASADOS EN EL TEMA
const getStyles = (theme) => StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: theme.colors.background },
    scrollContent: { paddingBottom: 40 },
    headerWrapper: { paddingBottom: 10 },
    headerContent: { paddingTop: 60, paddingHorizontal: 25, flexDirection: 'row', alignItems: 'center', paddingBottom: 10 },
    backBtn: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    headerTextContainer: { marginLeft: 15 },
    headerTitle: { fontSize: 22, fontWeight: 'bold' },
    headerSubtitle: { fontSize: 13 },
    formCard: { marginHorizontal: 16, marginTop: -15, borderRadius: 30, padding: 24, elevation: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
    sectionLabel: { fontSize: 14, fontWeight: 'bold', marginBottom: 12, marginTop: 20, textTransform: 'uppercase', letterSpacing: 0.5 },
    sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
    changeText: { fontWeight: 'bold', textDecorationLine: 'underline', fontSize: 12 },
    materialsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between' },
    statCard: { width: '48%', height: 110, borderRadius: 24, marginBottom: 8, overflow: 'hidden', padding: 15, justifyContent: 'space-between', elevation: 2 },
    statIconContainer: { position: 'absolute', bottom: -20, right: -20, transform: [{ rotate: '-15deg' }], zIndex: -1 },
    statContent: { flex: 1, justifyContent: 'space-between', alignItems: 'flex-start' },
    miniIconCircle: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
    statLabel: { fontSize: 15, fontWeight: 'bold', marginTop: 5 },
    subCatItem: { width: '48%', paddingVertical: 14, borderRadius: 16, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', borderWidth: 1, gap: 8, marginBottom: 8 },
    subCatText: { fontSize: 13, fontWeight: '600' },
    measureContainer: { flexDirection: 'row', borderRadius: 15, padding: 4, marginBottom: 10 },
    measureTab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 12 },
    measureTabText: { fontWeight: 'bold' },
    input: { marginBottom: 10 },
    photoBox: { width: '100%', height: 160, borderRadius: 24, borderStyle: 'dashed', borderWidth: 2, overflow: 'hidden', justifyContent: 'center', alignItems: 'center' },
    photoPlaceholder: { alignItems: 'center' },
    cameraIconCircle: { width: 54, height: 54, borderRadius: 27, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
    photoHint: { fontSize: 12, fontWeight: 'bold' },
    fullImage: { width: '100%', height: '100%' },
    locWidget: { flexDirection: 'row', alignItems: 'center', padding: 15, borderRadius: 20, borderWidth: 1 },
    locIconBg: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
    locTextContainer: { flex: 1, marginLeft: 12 },
    locLabelText: { fontSize: 11, fontWeight: 'bold' },
    locValueText: { fontSize: 13, fontWeight: 'bold' },
    refreshBtn: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center', elevation: 2 },
    mainSubmitBtn: { marginTop: 30, borderRadius: 20, elevation: 4 },
});