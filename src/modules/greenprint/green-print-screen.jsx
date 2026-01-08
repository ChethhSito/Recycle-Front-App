import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Share, Alert } from 'react-native';
import { Text, Button, IconButton, Card } from 'react-native-paper';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { Svg, Path } from 'react-native-svg';

const { width } = Dimensions.get('window');

// --- 1. LÓGICA DE EQUIVALENCIAS ---
const calculateStories = (totalKg) => {
    // Factores aproximados
    const co2Saved = totalKg * 1.5;

    return {
        co2: co2Saved.toFixed(1),
        // Energía: 1 kg plástico ~ 10 horas foco LED / 50 cargas cel
        lightbulbHours: Math.floor(totalKg * 10),
        phoneCharges: Math.floor(totalKg * 50),
        // Agua: 1 kg papel/cartón ~ 30L ahorrados
        showers: (totalKg * 30 / 15).toFixed(0), // 1 ducha rápida = 15L aprox
        // Transporte: 1 kg CO2 ~ 5 km auto
        carKm: (co2Saved * 5).toFixed(1),
        // Vida: 20kg CO2 ~ 1 árbol
        trees: (co2Saved / 20).toFixed(2)
    };
};

// --- 2. LÓGICA DEL "MUNDO LIMPIO" ---
const getPlanetStatus = (kg) => {
    if (kg < 10) return {
        color: '#9E9E9E', // Gris
        icon: 'earth',
        status: 'Mundo Gris',
        message: 'Tu planeta necesita ayuda. ¡Empieza a reciclar!'
    };
    if (kg < 50) return {
        color: '#00C7A1', // Verde Agua
        icon: 'earth',
        status: 'Recuperándose',
        message: '¡El aire se siente más limpio gracias a ti!'
    };
    return {
        color: '#4CAF50', // Verde Radiante
        icon: 'earth-plus',
        status: 'Mundo Radiante',
        message: '¡Eres un héroe ambiental! Tu mundo brilla.'
    };
};

export const GreenFootprintScreen = ({ navigation }) => {
    // DATO SIMULADO (Esto vendría de tu BD)
    const userRecycledKg = 15.5;

    const stories = calculateStories(userRecycledKg);
    const planetState = getPlanetStatus(userRecycledKg);

    // Función para el botón Compartir
    const handleShare = async () => {
        try {
            await Share.share({
                message: `🌿 Este mes mi Huella Verde salvó el equivalente a ${stories.trees} árboles en la app Recycle. ¿Y tú qué hiciste por el planeta? 🌎 #Reciclaje #EcoLloy`,
            });
        } catch (error) {
            Alert.alert(error.message);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

                {/* HEADER (Estilo consistente) */}
                <View style={styles.headerWrapper}>
                    <View style={styles.headerContent}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                            <IconButton icon="arrow-left" iconColor="#000" size={24} />
                        </TouchableOpacity>
                        <View style={{ marginTop: 10 }}>
                            <Text style={styles.headerTitle}>Tu Huella Verde</Text>
                            <Text style={styles.headerSubtitle}>Mira lo que has logrado</Text>
                        </View>
                    </View>
                    <View style={styles.svgContainer}>
                        <Svg width={width} height={50} viewBox="0 0 1440 320" preserveAspectRatio="none">
                            <Path fill="#B7ECDD" d="M0,192L48,197.3C96,203,192,213,288,192C384,171,480,117,576,112C672,107,768,149,864,165.3C960,181,1056,171,1152,149.3C1248,128,1344,96,1392,80L1440,64L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z" />
                        </Svg>
                    </View>
                </View>

                <View style={styles.contentContainer}>

                    {/* --- EL MUNDO LIMPIO (Gamificación) --- */}
                    <View style={styles.planetSection}>
                        <View style={[styles.planetCircle, { shadowColor: planetState.color }]}>
                            <Icon name={planetState.icon} size={100} color={planetState.color} />
                            {/* Nube decorativa pequeña */}
                            <Icon name="cloud" size={30} color="#E0F7FA" style={{ position: 'absolute', top: 20, right: 20 }} />
                        </View>
                        <Text style={[styles.planetStatus, { color: planetState.color }]}>{planetState.status}</Text>
                        <Text style={styles.planetMessage}>{planetState.message}</Text>
                    </View>

                    {/* --- CARD CO2 REDUCIDO (Lo que pediste mantener) --- */}
                    <View style={styles.co2Card}>
                        <View>
                            <Text style={styles.cardLabelLight}>Huella de Carbono Reducida</Text>
                            <Text style={styles.co2Value}>{stories.co2} <Text style={{ fontSize: 20 }}>kg</Text></Text>
                        </View>
                        <Icon name="cloud-check-outline" size={60} color="#B7ECDD" style={{ opacity: 0.8 }} />
                    </View>

                    {/* --- EQUIVALENCIAS TANGIBLES --- */}
                    <Text style={styles.sectionTitle}>Equivalencias Reales</Text>
                    <Text style={styles.sectionSubtitle}>Para que dimensiones tu impacto:</Text>

                    <View style={styles.grid}>
                        {/* 1. Energía (Focos/Cargas) */}
                        <View style={[styles.storyCard, { backgroundColor: '#FFF9C4' }]}>
                            <Icon name="lightning-bolt" size={28} color="#FBC02D" style={styles.storyIcon} />
                            <Text style={styles.storyText}>
                                Ahorraste energía para <Text style={{ fontWeight: 'bold' }}>{stories.lightbulbHours} horas</Text> de un foco encendido o <Text style={{ fontWeight: 'bold' }}>{stories.phoneCharges} cargas</Text> de celular.
                            </Text>
                        </View>

                        {/* 2. Agua (Duchas) */}
                        <View style={[styles.storyCard, { backgroundColor: '#E1F5FE' }]}>
                            <Icon name="water" size={28} color="#039BE5" style={styles.storyIcon} />
                            <Text style={styles.storyText}>
                                Evitaste el uso de agua equivalente a <Text style={{ fontWeight: 'bold' }}>{stories.showers} duchas rápidas</Text>.
                            </Text>
                        </View>

                        {/* 3. Transporte (Auto) */}
                        <View style={[styles.storyCard, { backgroundColor: '#FFECB3' }]}>
                            <Icon name="car-hatchback" size={28} color="#FF6F00" style={styles.storyIcon} />
                            <Text style={styles.storyText}>
                                Evitaste emisiones iguales a un viaje de <Text style={{ fontWeight: 'bold' }}>{stories.carKm} km</Text> en auto.
                            </Text>
                        </View>

                        {/* 4. Vida (Árboles) */}
                        <View style={[styles.storyCard, { backgroundColor: '#E8F5E9' }]}>
                            <Icon name="tree" size={28} color="#43A047" style={styles.storyIcon} />
                            <Text style={styles.storyText}>
                                Has salvado el equivalente a <Text style={{ fontWeight: 'bold' }}>{stories.trees} árboles</Text> adultos.
                            </Text>
                        </View>
                    </View>

                    {/* --- BOTÓN PRESUMIR (Share) --- */}
                    <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
                        <View style={styles.shareContent}>

                            <Text style={styles.shareText}>Presumir mi Logro</Text>
                        </View>
                        <Text style={styles.shareSubtext}>Generar imagen para Stories</Text>
                    </TouchableOpacity>

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
    // HEADER
    headerWrapper: { backgroundColor: 'transparent' },
    headerContent: {
        backgroundColor: '#B7ECDD',
        paddingTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 25,
        flexDirection: 'row',
    },
    svgContainer: { marginTop: -1, zIndex: -1 },
    backButton: { alignSelf: 'flex-start', marginLeft: -10, marginBottom: 10, marginRight: 15 },
    headerTitle: { color: '#000', fontSize: 24, fontWeight: 'bold', fontFamily: 'InclusiveSans-Bold' },
    headerSubtitle: { color: '#444', fontSize: 14, fontFamily: 'InclusiveSans-Regular' },

    contentContainer: { paddingHorizontal: 20, marginTop: 10 },

    // PLANET SECTION (MUNDO LIMPIO)
    planetSection: {
        alignItems: 'center',
        marginBottom: 30,
        marginTop: 10,
    },
    planetCircle: {
        backgroundColor: '#FFF',
        width: 140,
        height: 140,
        borderRadius: 70,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 10, // Sombra fuerte para efecto 3D
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        marginBottom: 15,
    },
    planetStatus: {
        fontSize: 22,
        fontWeight: 'bold',
        fontFamily: 'InclusiveSans-Bold',
        marginBottom: 5,
    },
    planetMessage: {
        fontSize: 15,
        color: '#ffffffff',
        textAlign: 'center',
        paddingHorizontal: 40,
        fontFamily: 'InclusiveSans-Regular',
    },

    // CO2 CARD
    co2Card: {
        backgroundColor: '#0d6e51ff',
        borderRadius: 20,
        padding: 25,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 25,
        elevation: 4,
    },
    cardLabelLight: { color: '#B7ECDD', fontSize: 14, fontFamily: 'InclusiveSans-Regular' },
    co2Value: { color: '#FFF', fontSize: 36, fontWeight: 'bold', fontFamily: 'InclusiveSans-Bold', marginTop: 5 },

    // EQUIVALENCIAS
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#ffffffff', marginBottom: 5 },
    sectionSubtitle: { fontSize: 14, color: '#ffffffff', marginBottom: 15 },
    grid: {
        gap: 15,
    },
    storyCard: {
        borderRadius: 15,
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 1,
    },
    storyIcon: { marginRight: 15 },
    storyText: { flex: 1, fontSize: 14, color: '#444', lineHeight: 20, fontFamily: 'InclusiveSans-Regular' },

    // SHARE BUTTON
    shareButton: {
        marginTop: 30,
        backgroundColor: '#2D2338', // Morado oscuro elegante para Instagram
        borderRadius: 20,
        paddingVertical: 15,
        paddingHorizontal: 20,
        alignItems: 'center',
        elevation: 5,
    },
    shareContent: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
    shareText: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginLeft: 10 },
    shareSubtext: { color: '#BBB', fontSize: 12 },
});