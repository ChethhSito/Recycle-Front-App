import React, { useState, useEffect } from 'react';
import {
    View, StyleSheet, ScrollView, TouchableOpacity, Image, Platform, Alert, ActivityIndicator, Dimensions
} from 'react-native';
import { Text, TextInput, Button, IconButton, useTheme, Icon } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useRequestStore } from '../../hooks/use-request-store';

// 1. IMPORTAR SVG Y PATH
import { Svg, Path } from 'react-native-svg';

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
    const theme = useTheme();
    // ... (Tus estados anteriores se mantienen) ...
    const [loadingLocation, setLoadingLocation] = useState(false);
    const [addressText, setAddressText] = useState("Toca para localizarte");

    const [imageUri, setImageUri] = useState(null);
    const [measureType, setMeasureType] = useState('peso');

    const { startCreatingRequest, isLoading } = useRequestStore();

    // NUEVOS ESTADOS PARA LA LÓGICA DE CATEGORÍAS
    const [activeCategory, setActiveCategory] = useState(null); // La categoría padre seleccionada (ej. Metal)
    const [selectedSubMaterial, setSelectedSubMaterial] = useState(null); // El material final (ej. Cobre)

    const { control, handleSubmit, setValue } = useForm({
        defaultValues: { quantity: '', description: '', locationCoords: null }
    });

    const getLocation = async () => {
        setLoadingLocation(true);
        try {
            // let { status } = await Location.requestForegroundPermissionsAsync();
            // if (status !== 'granted') {
            //     Alert.alert('Permiso denegado', 'Activa el GPS.');
            //     setLoadingLocation(false);
            //     return;
            // }
            // let location = await Location.getCurrentPositionAsync({
            //     accuracy: Location.Accuracy.Balanced,
            //     timeout: 10000 // 10 segundos es más seguro en emuladores lentos
            // });
            // const { latitude, longitude } = location.coords;

            const latitude = -12.1390 - 0.005; // Mueve un poco al sur
            const longitude = -76.9626 - 0.005;
            setValue('locationCoords', { latitude, longitude });
            let addressResponse = await Location.reverseGeocodeAsync({ latitude, longitude });
            if (addressResponse.length > 0) {
                const addr = addressResponse[0];
                const formatted = `${addr.street || 'Calle s/n'} ${addr.streetNumber || ''}, ${addr.district || ''}`;
                setAddressText(formatted);
            }
            else {
                setAddressText(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
            }
        } catch (error) {
            console.log("Error GPS (Usando Fallback):", error);
            const defaultLocation = { latitude: -12.139065654219554, longitude: -76.96260382693715 };
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

        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true, aspect: [4, 3], quality: 0.5,
        });

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
            measureType: measureType, // 'peso' o 'cantidad'
            locationCoords: data.locationCoords,
            imageUri: imageUri,
            address: addressText,
            description: data.description
        });
        console.log("success", success);

        if (success) {
            Alert.alert("¡Éxito!", "Solicitud creada correctamente", [
                { text: "OK", onPress: () => navigation.goBack() }
            ]);
        } else {
            Alert.alert("Error", "No se pudo enviar la solicitud. Intenta nuevamente.");
        }
    };

    const resetSelection = () => {
        setActiveCategory(null);
        setSelectedSubMaterial(null);
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>

                {/* --- 2. HEADER CORREGIDO CON SVG --- */}
                <View style={styles.headerWrapper}>
                    {/* Parte sólida del header */}
                    <View style={styles.headerContent}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                            <IconButton icon="arrow-left" iconColor="#000" size={24} />
                        </TouchableOpacity>

                        <View style={{ marginTop: 10 }}>
                            <Text style={styles.headerTitle}>Nueva Solicitud</Text>
                            <Text style={styles.headerSubtitle}>Ayúdanos a limpiar el planeta</Text>
                        </View>
                    </View>

                    {/* Parte de la nube (SVG copiado de tu Home) */}
                    <View style={styles.svgContainer}>
                        <Svg
                            width={width}
                            height={50} // Altura ajustada
                            viewBox="0 0 1440 320"
                            preserveAspectRatio="none"
                        >
                            <Path
                                fill="#B7ECDD" // EL COLOR EXACTO DE TU HOME
                                d="M0,192L48,197.3C96,203,192,213,288,192C384,171,480,117,576,112C672,107,768,149,864,165.3C960,181,1056,171,1152,149.3C1248,128,1344,96,1392,80L1440,64L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
                            />
                        </Svg>
                    </View>
                </View>

                {/* CONTENIDO DEL FORMULARIO */}
                <View style={styles.contentContainer}>

                    {/* SECCIÓN 1: ¿QUÉ RECICLAS? */}
                    <View style={styles.contentContainer}>

                        {/* SECCIÓN 1: LÓGICA DE CATEGORÍAS Y SUBCATEGORÍAS */}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={styles.sectionTitle}>
                                {activeCategory ? `1. Tipo de ${activeCategory.label}` : "1. ¿Qué vas a reciclar?"}
                            </Text>
                            {/* Botón pequeño para volver atrás si ya elegí categoría */}
                            {activeCategory && (
                                <TouchableOpacity onPress={resetSelection}>
                                    <Text style={{ color: '#FAC96E', fontWeight: 'bold', textDecorationLine: 'underline' }}>Cambiar</Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        <View style={styles.materialsGrid}>
                            {/* CASO A: NO HAY CATEGORÍA SELECCIONADA (Muestra Generales) */}
                            {!activeCategory && CATEGORIES.map((cat) => (
                                <TouchableOpacity
                                    key={cat.id}
                                    style={[styles.materialCard, { backgroundColor: cat.bg }]} // Usamos el color pastel de fondo
                                    onPress={() => setActiveCategory(cat)}
                                >
                                    <Icon source={cat.icon} size={32} color={cat.color} />
                                    <Text style={[styles.materialLabel, { color: '#31253B' }]}>{cat.label}</Text>
                                    <Icon source="chevron-right" size={20} color={cat.color} style={{ marginTop: 5, opacity: 0.5 }} />
                                </TouchableOpacity>
                            ))}

                            {/* CASO B: HAY CATEGORÍA SELECCIONADA (Muestra Subcategorías) */}
                            {activeCategory && activeCategory.subcategories.map((sub) => {
                                const isSelected = selectedSubMaterial?.id === sub.id;

                                return (
                                    <TouchableOpacity
                                        key={sub.id}
                                        style={[
                                            styles.materialCard, // Mantienes el tamaño de tarjeta
                                            {
                                                backgroundColor: isSelected ? '#31253B' : '#F5F5F5',
                                                height: 60, // Hacemos la tarjeta más bajita (tipo botón)
                                                flexDirection: 'row', // Texto al lado, no abajo
                                                width: '48%', // 2 columnas
                                                marginBottom: 10,
                                                paddingHorizontal: 10
                                            }
                                        ]}
                                        onPress={() => setSelectedSubMaterial(sub)}
                                    >
                                        <Text style={{
                                            color: isSelected ? '#FFF' : '#333',
                                            fontWeight: '600',
                                            textAlign: 'center',
                                            fontSize: 13
                                        }}>
                                            {sub.label}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>

                    {/* SECCIÓN 2: CANTIDAD */}
                    <Text style={styles.sectionTitle}>2. Cantidad aprox.</Text>
                    <View style={styles.filterContainer}>
                        <TouchableOpacity
                            style={[styles.filterButton, measureType === 'peso' && styles.filterButtonActive]}
                            onPress={() => setMeasureType('peso')}
                        >
                            <Text style={[styles.filterText, measureType === 'peso' && styles.filterTextActive]}>Por Peso (Kg)</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.filterButton, measureType === 'cantidad' && styles.filterButtonActive]}
                            onPress={() => setMeasureType('cantidad')}
                        >
                            <Text style={[styles.filterText, measureType === 'cantidad' && styles.filterTextActive]}>Por Bolsas</Text>
                        </TouchableOpacity>
                    </View>

                    <Controller
                        control={control}
                        name="quantity"
                        rules={{ required: true }}
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                mode="flat"
                                placeholder={measureType === 'peso' ? "Ej: 2.5" : "Ej: 3 bolsas"}
                                placeholderTextColor="#5A7A70"
                                keyboardType="numeric"
                                style={styles.input}
                                value={value}
                                onChangeText={onChange}
                                underlineColor="transparent"
                                activeUnderlineColor="transparent"
                                left={<TextInput.Icon icon="scale" color="#31253B" />}
                            />
                        )}
                    />

                    {/* SECCIÓN 3: EVIDENCIA */}
                    <Text style={styles.sectionTitle}>3. Evidencia (Foto)</Text>
                    <TouchableOpacity onPress={takePhoto} style={styles.cameraButton}>
                        {imageUri ? (
                            <Image source={{ uri: imageUri }} style={styles.previewImage} />
                        ) : (
                            <View style={styles.cameraPlaceholder}>
                                <Icon source="camera-plus" size={40} color="#000000ff" />
                                <Text style={styles.cameraText}>Tomar foto ahora</Text>
                            </View>
                        )}
                    </TouchableOpacity>

                    {/* SECCIÓN 4: UBICACIÓN */}
                    <Text style={styles.sectionTitle}>4. Ubicación de recojo</Text>
                    <View style={styles.locationCard}>
                        <View style={styles.locationIcon}>
                            {loadingLocation ? (
                                <ActivityIndicator size="small" color="#00C7A1" />
                            ) : (
                                <Icon source="map-marker-radius" size={30} color="#EF4444" />
                            )}
                        </View>
                        <View style={styles.locationInfo}>
                            <Text style={styles.locationLabel}>Ubicación Actual</Text>
                            <Text style={styles.locationText} numberOfLines={2}>
                                {loadingLocation ? "Detectando satélites..." : addressText}
                            </Text>
                        </View>
                        <TouchableOpacity onPress={getLocation} style={styles.refreshButton}>
                            <Icon source="refresh" size={20} color="#31253B" />
                        </TouchableOpacity>
                    </View>


                    <Text style={[styles.sectionTitle, { marginTop: 20 }]}>2.1. Descripción (Opcional)</Text>
                    <Controller
                        control={control}

                        name="description"
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                mode="flat"
                                placeholder="Ej: 'Son 2 bolsas grandes negras...'"
                                placeholderTextColor="#5A7A70"
                                style={[styles.input, { height: 80, paddingTop: 10 }]} // Más alto
                                value={value}
                                onChangeText={onChange}
                                underlineColor="transparent"
                                activeUnderlineColor="transparent"
                                multiline={true}
                                numberOfLines={3}

                            />
                        )}
                    />

                    {/* BOTÓN FINAL */}
                    <Button
                        mode="contained"
                        onPress={handleSubmit(onSubmit)}
                        style={styles.submitBtn}
                        labelStyle={{ fontSize: 18, color: '#31253B', fontWeight: 'bold' }}
                        icon="send"
                    >
                        {isLoading ? "Enviando..." : "Enviar Solicitud"}
                    </Button>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#018f64',
    },
    // --- ESTILOS DEL HEADER CORREGIDOS ---
    headerWrapper: {
        backgroundColor: 'transparent', // Transparente para manejar las capas
    },
    headerContent: {
        backgroundColor: '#B7ECDD', // EL MISMO COLOR DEL HOME
        paddingTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 25,
        display: 'flex',
        flexDirection: 'row',
    },
    svgContainer: {
        marginTop: -1, // Evita líneas blancas entre el header y el svg
        zIndex: -1,
    },
    backButton: {
        alignSelf: 'flex-start',
        marginLeft: -10,
        marginBottom: 10,
    },
    headerTitle: {
        color: '#000', // Texto negro para contrastar con verde claro
        fontSize: 24,

        fontFamily: 'InclusiveSans-Bold',
    },
    headerSubtitle: {
        color: '#444', // Gris oscuro
        fontSize: 14,
        marginTop: 5,
        fontFamily: 'InclusiveSans-Regular',
    },

    // --- RESTO DE ESTILOS IGUAL QUE ANTES ---
    contentContainer: { paddingHorizontal: 20, paddingTop: 10 },
    sectionTitle: {
        fontSize: 16,
        color: '#FFFFFF', // Blanco para que resalte en el fondo verde oscuro

        marginBottom: 10, // Menos espacio debajo del título
        marginTop: 15,    // Menos espacio encima del título (antes era 20)
        fontFamily: 'InclusiveSans-Regular'
    },
    materialsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between', // Separa las tarjetas a los extremos
        rowGap: 12, // Espacio vertical entre la fila 1 y 2
    },
    materialCard: {
        width: '48%', // CASI LA MITAD: Para que ocupen todo el ancho (2 por fila)
        height: 100,  // ALTURA FIJA: Esto elimina el espacio extra. Antes era aspectRatio: 1 (cuadrado)
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        elevation: 3,
        backgroundColor: '#F5F5F5', // Blanco humo para que no sea tan brillante
    },
    materialLabel: { fontSize: 12, marginTop: 5, fontWeight: '600', fontFamily: 'InclusiveSans-Regular', textAlign: 'center' },
    filterContainer: { flexDirection: 'row', marginBottom: 15, backgroundColor: '#b1eedc', borderRadius: 20, padding: 4 },
    filterButton: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 20 },
    filterButtonActive: { backgroundColor: '#00C7A1' },
    filterText: { fontSize: 13, fontWeight: '500', color: '#555' },
    filterTextActive: { color: '#000' },
    input: { backgroundColor: '#b1eedc', borderRadius: 12, height: 50, borderTopLeftRadius: 12, borderTopRightRadius: 12, overflow: 'hidden', fontSize: 16 },
    cameraButton: { width: '100%', height: 150, backgroundColor: '#b1eedc', borderRadius: 20, borderWidth: 2, borderColor: '#B7ECDD', borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
    cameraPlaceholder: { alignItems: 'center' },
    cameraText: { color: '#000000ff', fontWeight: 'bold', marginTop: 10 },
    previewImage: { width: '100%', height: '100%' },
    locationCard: { flexDirection: 'row', backgroundColor: '#b1eedc', borderRadius: 15, padding: 15, alignItems: 'center', elevation: 2 },
    locationIcon: { width: 40, alignItems: 'center' },
    locationInfo: { flex: 1, paddingHorizontal: 10 },
    locationLabel: { fontSize: 12, color: '#999', fontWeight: 'bold' },
    locationText: { fontSize: 15, color: '#31253B', fontWeight: '600' },
    refreshButton: { padding: 5, backgroundColor: '#F0F4F5', borderRadius: 50 },
    submitBtn: { marginTop: 30, backgroundColor: '#FAC96E', borderRadius: 15, paddingVertical: 6 },
});