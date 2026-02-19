import React, { useState, useEffect } from 'react';
import {
    View, StyleSheet, ScrollView, TouchableOpacity, Image, Platform, Alert, ActivityIndicator, Dimensions, StatusBar
} from 'react-native';
import { Svg, Path } from 'react-native-svg';
import { Text, TextInput, Button, IconButton, useTheme, Icon } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useRequestStore } from '../../hooks/use-request-store';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Materiales (Igual que antes)
const CATEGORIES = [
    {
        id: 'plastic',
        label: 'Plástico',
        icon: 'bottle-soda',
        color: '#3B82F6',
        bg: '#D4E7FF',
        subcategories: [
            { id: 'pet', label: 'PET (Botellas)', icon: 'bottle-soda-classic-outline' },
            { id: 'hdpe', label: 'Envases Duros', icon: 'pail-outline' },
            { id: 'pvc', label: 'Tubos / PVC', icon: 'pipe' },
            { id: 'other_plastic', label: 'Otros Plásticos', icon: 'recycle-variant' }
        ]
    },
    {
        id: 'cardboard',
        label: 'Papel/Cartón',
        icon: 'package-variant',
        color: '#F97316',
        bg: '#FFE4CC',
        subcategories: [
            { id: 'box', label: 'Cajas Cartón', icon: 'package-variant-closed' },
            { id: 'paper', label: 'Papel Blanco', icon: 'file-document-outline' },
            { id: 'newspaper', label: 'Periódico', icon: 'newspaper-variant-outline' },
            { id: 'mixed', label: 'Mixto', icon: 'folder-open-outline' }
        ]
    },
    {
        id: 'metal',
        label: 'Metal',
        icon: 'screw-machine-flat-top',
        color: '#6B7280',
        bg: '#E5E7EB',
        subcategories: [
            { id: 'copper', label: 'Cobre / Cables', icon: 'cable-data' },
            { id: 'aluminum', label: 'Latas Alum.', icon: 'beer-outline' },
            { id: 'steel', label: 'Fierro / Acero', icon: 'girder' },
            { id: 'scrap', label: 'Chatarra', icon: 'wrench-outline' }
        ]
    },
    {
        id: 'electronics',
        label: 'RAEE',
        icon: 'monitor',
        color: '#EF4444',
        bg: '#FFDDDD',
        subcategories: [
            { id: 'pc', label: 'Computadoras', icon: 'laptop' },
            { id: 'phone', label: 'Celulares', icon: 'cellphone' },
            { id: 'appliance', label: 'Electrodom.', icon: 'washing-machine' }
        ]
    },
];

export const CreateRequestScreen = ({ navigation }) => {
    // Estados y lógica (Idéntico a tu código)
    const theme = useTheme();
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

    // ... (Mantengo tus funciones getLocation, takePhoto y onSubmit intactas) ...
    const getLocation = async () => {
        setLoadingLocation(true);
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permiso denegado', 'Activa el GPS.');
                setLoadingLocation(false);
                return;
            }
            let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.BestForNavigation, timeout: 10000 });
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
            const defaultLocation = { latitude: -12.139065, longitude: -76.962603 };
            setValue('locationCoords', defaultLocation);
            setAddressText("Ubicación por defecto (Lima)");
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
            Alert.alert("¡Éxito!", "Solicitud creada correctamente", [{ text: "OK", onPress: () => navigation.goBack() }]);
        } else {
            Alert.alert("Error", "No se pudo enviar la solicitud.");
        }
    };

    const resetSelection = () => {
        setActiveCategory(null);
        setSelectedSubMaterial(null);
    };

    return (
        <View style={styles.mainContainer}>
            <StatusBar barStyle="dark-content" backgroundColor="#B7ECDD" />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* HEADER */}
                <View style={styles.headerWrapper}>
                    <View style={styles.headerContent}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                            <MaterialCommunityIcons name="chevron-left" size={28} color="#31253B" />
                        </TouchableOpacity>
                        <View style={styles.headerTextContainer}>
                            <Text style={styles.headerTitle}>Nueva Solicitud</Text>
                            <Text style={styles.headerSubtitle}>Detalla lo que vas a reciclar</Text>
                        </View>
                    </View>
                    <Svg width={width} height={40} viewBox="0 0 1440 320" preserveAspectRatio="none">
                        <Path fill="#B7ECDD" d="M0,192L48,197.3C96,203,192,213,288,192C384,171,480,117,576,112C672,107,768,149,864,165.3C960,181,1056,171,1152,149.3C1248,128,1344,96,1392,80L1440,64L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z" />
                    </Svg>
                </View>

                {/* FORM CARD */}
                <View style={styles.formCard}>

                    {/* SECCIÓN 1: MATERIALES (ESTILO STAT ITEM APLICADO) */}
                    <View style={styles.sectionHeaderRow}>
                        <Text style={styles.sectionLabel}>
                            {activeCategory ? `Tipo de ${activeCategory.label}` : "Selecciona el material"}
                        </Text>
                        {activeCategory && (
                            <TouchableOpacity onPress={resetSelection}>
                                <Text style={styles.changeText}>Cambiar</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    <View style={styles.materialsGrid}>
                        {/* CASO A: MOSTRAR CATEGORÍAS ESTILO "STAT ITEM" */}
                        {!activeCategory && CATEGORIES.map((cat) => (
                            <TouchableOpacity
                                key={cat.id}
                                style={[styles.statCard, { backgroundColor: cat.bg }]}
                                onPress={() => setActiveCategory(cat)}
                                activeOpacity={0.9}
                            >
                                {/* Icono Decorativo Gigante (Fondo) */}
                                <View style={styles.statIconContainer}>
                                    <MaterialCommunityIcons
                                        name={cat.icon}
                                        size={90}
                                        color={cat.color}
                                        style={{ opacity: 0.2 }} // Transparencia para que parezca marca de agua
                                    />
                                </View>

                                {/* Contenido Real */}
                                <View style={styles.statContent}>
                                    <View style={[styles.miniIconCircle, { backgroundColor: 'rgba(255,255,255,0.6)' }]}>
                                        <MaterialCommunityIcons name={cat.icon} size={24} color={cat.color} />
                                    </View>
                                    <Text style={styles.statLabel}>{cat.label}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}

                        {/* CASO B: SUBCATEGORÍAS (LISTA SIMPLE Y LIMPIA) */}
                        {activeCategory && activeCategory.subcategories.map((sub) => {
                            const isSelected = selectedSubMaterial?.id === sub.id;
                            return (
                                <TouchableOpacity
                                    key={sub.id}
                                    style={[styles.subCatItem, isSelected && styles.subCatSelected]}
                                    onPress={() => setSelectedSubMaterial(sub)}
                                >
                                    <Text style={[styles.subCatText, isSelected && styles.textWhite]}>{sub.label}</Text>
                                    {isSelected && <MaterialCommunityIcons name="check-circle" size={18} color="#FFF" />}
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    {/* SECCIÓN 2: CANTIDAD */}
                    <Text style={styles.sectionLabel}>Cantidad aproximada</Text>
                    <View style={styles.measureContainer}>
                        <TouchableOpacity style={[styles.measureTab, measureType === 'peso' && styles.measureTabActive]} onPress={() => setMeasureType('peso')}>
                            <Text style={[styles.measureTabText, measureType === 'peso' && styles.textWhite]}>Kg</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.measureTab, measureType === 'cantidad' && styles.measureTabActive]} onPress={() => setMeasureType('cantidad')}>
                            <Text style={[styles.measureTabText, measureType === 'cantidad' && styles.textWhite]}>Bolsas</Text>
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
                                style={styles.input}
                                value={value}
                                onChangeText={onChange}
                                outlineColor="#F0F0F0"
                                activeOutlineColor="#018f64"
                                left={<TextInput.Icon icon="scale" color="#6B7280" />}
                            />
                        )}
                    />

                    {/* SECCIÓN 2.1: DESCRIPCIÓN */}
                    <Text style={styles.sectionLabel}>Notas adicionales (Opcional)</Text>
                    <Controller
                        style={styles.input}
                        control={control}
                        name="description"
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                mode="outlined"
                                placeholder="Ej: El material está en bolsas negras fuera de la casa..."
                                placeholderTextColor="#9CA3AF"
                                multiline
                                numberOfLines={3}
                                style={[styles.input, { height: 100, paddingTop: 10, borderRadius: 30 }]}
                                value={value}
                                onChangeText={onChange}
                                outlineColor="#F0F0F0"
                                activeOutlineColor="#018f64"
                                left={<TextInput.Icon icon="pencil-outline" color="#6B7280" />}
                            />
                        )}
                    />

                    {/* SECCIÓN 3: EVIDENCIA */}
                    <Text style={styles.sectionLabel}>Foto de los residuos</Text>
                    <TouchableOpacity onPress={takePhoto} style={styles.photoBox}>
                        {imageUri ? (
                            <Image source={{ uri: imageUri }} style={styles.fullImage} />
                        ) : (
                            <View style={styles.photoPlaceholder}>
                                <View style={[styles.cameraIconCircle, { backgroundColor: '#E8F5F1' }]}>
                                    <MaterialCommunityIcons name="camera-plus" size={30} color="#018f64" />
                                </View>
                                <Text style={styles.photoHint}>Presiona para capturar evidencia</Text>
                            </View>
                        )}
                    </TouchableOpacity>

                    {/* SECCIÓN 4: UBICACIÓN */}
                    <Text style={styles.sectionLabel}>Ubicación de recojo</Text>
                    <View style={styles.locWidget}>
                        <View style={[styles.locIconBg, { backgroundColor: loadingLocation ? '#F3F4F6' : '#FFEBEE' }]}>
                            {loadingLocation ? <ActivityIndicator size="small" color="#018f64" /> : <MaterialCommunityIcons name="map-marker-radius" size={26} color="#EF4444" />}
                        </View>
                        <View style={styles.locTextContainer}>
                            <Text style={styles.locLabelText}>Dirección detectada</Text>
                            <Text style={styles.locValueText} numberOfLines={1}>{loadingLocation ? "Buscando ubicación..." : addressText}</Text>
                        </View>
                        <TouchableOpacity onPress={getLocation} style={styles.refreshBtn}>
                            <MaterialCommunityIcons name="refresh" size={22} color="#31253B" />
                        </TouchableOpacity>
                    </View>

                    {/* BOTÓN SUBMIT */}
                    <Button
                        mode="contained"
                        onPress={handleSubmit(onSubmit)}
                        style={styles.mainSubmitBtn}
                        contentStyle={{ height: 56, color: '#000' }}
                        loading={isLoading}
                        icon="send-check"
                    >
                        Publicar Solicitud
                    </Button>

                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: '#b1eedc' },
    scrollContent: { paddingBottom: 40 },

    // Header
    headerWrapper: { backgroundColor: '#B7ECDD' },
    headerContent: { paddingTop: 50, paddingHorizontal: 25, flexDirection: 'row', alignItems: 'center', paddingBottom: 10 },
    backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.4)', justifyContent: 'center', alignItems: 'center' },
    headerTextContainer: { marginLeft: 15 },
    headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#31253B' },
    headerSubtitle: { fontSize: 13, color: '#5A7A70' },

    // Card Principal
    formCard: {
        backgroundColor: '#FFF',
        marginHorizontal: 16,
        marginTop: -15,
        borderRadius: 30,
        padding: 24,
        elevation: 10,
        shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10,
    },
    sectionLabel: { fontSize: 14, fontWeight: 'bold', color: '#5A7A70', marginBottom: 12, marginTop: 20, textTransform: 'uppercase', letterSpacing: 0.5 },
    sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
    changeText: { color: '#018f64', fontWeight: 'bold', textDecorationLine: 'underline', fontSize: 12 },

    // --- NUEVOS ESTILOS ESTILO "STAT ITEM" ---
    materialsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between' },
    statCard: {
        width: '48%',
        height: 110, // Más alto para lucir el diseño
        borderRadius: 24,
        marginBottom: 8,
        overflow: 'hidden', // CLAVE: Corta el icono gigante
        padding: 15,
        justifyContent: 'space-between',
        // Sin bordes feos, solo color puro y sombra suave
        elevation: 2,
    },
    statIconContainer: {
        position: 'absolute',
        bottom: -20,
        right: -20,
        transform: [{ rotate: '-15deg' }], // Rotación dinámica
        zIndex: -1, // Detrás del texto
    },
    statContent: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    miniIconCircle: {
        width: 36, height: 36, borderRadius: 18,
        justifyContent: 'center', alignItems: 'center',
    },
    statLabel: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#31253B',
        marginTop: 5,
    },

    // Subcategorías (Estilo Botón Limpio)
    subCatItem: {
        width: '48%',
        paddingVertical: 14,
        backgroundColor: '#F9FAFB',
        borderRadius: 16,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#F0F0F0',
        gap: 8,
        marginBottom: 8
    },
    subCatSelected: { backgroundColor: '#31253B', borderColor: '#31253B' },
    subCatText: { fontSize: 13, fontWeight: '600', color: '#4B5563' },

    // Resto de estilos (Inputs, Foto, Mapa...)
    measureContainer: { flexDirection: 'row', backgroundColor: '#F3F4F6', borderRadius: 15, padding: 4, marginBottom: 10 },
    measureTab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 12 },
    measureTabActive: { backgroundColor: '#018f64' },
    measureTabText: { fontWeight: 'bold', color: '#6B7280' },
    input: { backgroundColor: '#F9FAFB', marginBottom: 10, borderRadius: 30 },
    photoBox: { width: '100%', height: 160, borderRadius: 24, backgroundColor: '#F9FAFB', borderStyle: 'dashed', borderWidth: 2, borderColor: '#D1D5DB', overflow: 'hidden', justifyContent: 'center', alignItems: 'center' },
    photoPlaceholder: { alignItems: 'center' },
    cameraIconCircle: { width: 54, height: 54, borderRadius: 27, backgroundColor: '#E8F5F1', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
    photoHint: { fontSize: 12, fontWeight: 'bold', color: '#9CA3AF' },
    fullImage: { width: '100%', height: '100%' },
    locWidget: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB', padding: 15, borderRadius: 20, borderWidth: 1, borderColor: '#F0F0F0' },
    locIconBg: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
    locTextContainer: { flex: 1, marginLeft: 12 },
    locLabelText: { fontSize: 11, color: '#9CA3AF', fontWeight: 'bold' },
    locValueText: { fontSize: 13, fontWeight: 'bold', color: '#31253B' },
    refreshBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', elevation: 2 },
    mainSubmitBtn: { marginTop: 30, backgroundColor: '#FAC96E', borderRadius: 20, elevation: 4, color: '#000' },
    textWhite: { color: '#FFF' },
});