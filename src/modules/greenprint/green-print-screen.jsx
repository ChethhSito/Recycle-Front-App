import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Share, Alert, StatusBar } from 'react-native';
import { Text, IconButton, useTheme } from 'react-native-paper'; // 🚀 Importación de Paper
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { Svg, Path } from 'react-native-svg';
import { useAuthStore } from '../../hooks/use-auth-store';

const { width } = Dimensions.get('window');

// --- LÓGICA DE EQUIVALENCIAS ---
const calculateStories = (totalKg) => {
    const co2Saved = totalKg * 1.5;
    return {
        co2: co2Saved.toFixed(1),
        lightbulbHours: Math.floor(totalKg * 10),
        phoneCharges: Math.floor(totalKg * 50),
        showers: (totalKg * 30 / 15).toFixed(0),
        carKm: (co2Saved * 5).toFixed(1),
        trees: (co2Saved / 20).toFixed(2)
    };
};

// --- LÓGICA DEL "MUNDO LIMPIO" ADAPTADA ---
const getPlanetStatus = (kg, isDark) => {
    if (kg < 10) return {
        color: isDark ? '#B0BEC5' : '#9E9E9E',
        icon: 'earth',
        status: 'Mundo Gris',
        message: 'Tu planeta necesita ayuda. ¡Empieza a reciclar!'
    };
    if (kg < 50) return {
        color: '#00C7A1',
        icon: 'earth',
        status: 'Recuperándose',
        message: '¡El aire se siente más limpio gracias a ti!'
    };
    return {
        color: '#4CAF50',
        icon: 'earth-plus',
        status: 'Mundo Radiante',
        message: '¡Eres un héroe ambiental! Tu mundo brilla.'
    };
};

export const GreenFootprintScreen = ({ navigation }) => {
    const theme = useTheme(); // 🎨 Obtenemos el tema dinámico
    const { colors, dark } = theme;
    const componentStyles = getStyles(theme);

    const { user } = useAuthStore();
    // 📊 Usamos las estadísticas reales de tu MongoDB
    const userRecycledKg = user?.recyclingStats?.total_kg || 0;

    const stories = calculateStories(userRecycledKg);
    const planetState = getPlanetStatus(userRecycledKg, dark);

    const handleShare = async () => {
        try {
            await Share.share({
                message: `🌿 Este mes mi Huella Verde salvó el equivalente a ${stories.trees} árboles en la app Recycle. ¿Y tú qué hiciste por el planeta? 🌎 #Reciclaje #NosPlanét`,
            });
        } catch (error) {
            Alert.alert("Error", error.message);
        }
    };

    return (
        <View style={componentStyles.container}>
            <StatusBar barStyle={dark ? "light-content" : "dark-content"} />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

                {/* HEADER DINÁMICO */}
                <View style={componentStyles.headerWrapper}>
                    <View style={[componentStyles.headerContent, { backgroundColor: dark ? colors.surface : colors.greenMain }]}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={componentStyles.backButton}>
                            <IconButton icon="arrow-left" iconColor={colors.onSurface} size={24} />
                        </TouchableOpacity>
                        <View style={{ marginTop: 10 }}>
                            <Text style={[componentStyles.headerTitle, { color: colors.onSurface }]}>Tu Huella Verde</Text>
                            <Text style={[componentStyles.headerSubtitle, { color: colors.onSurfaceVariant }]}>Mira lo que has logrado</Text>
                        </View>
                    </View>
                    <View style={componentStyles.svgContainer}>
                        <Svg width={width} height={50} viewBox="0 0 1440 320" preserveAspectRatio="none">
                            <Path
                                fill={dark ? colors.surface : colors.greenMain}
                                d="M0,192L48,197.3C96,203,192,213,288,192C384,171,480,117,576,112C672,107,768,149,864,165.3C960,181,1056,171,1152,149.3C1248,128,1344,96,1392,80L1440,64L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
                            />
                        </Svg>
                    </View>
                </View>

                <View style={componentStyles.contentContainer}>

                    {/* --- EL MUNDO LIMPIO --- */}
                    <View style={componentStyles.planetSection}>
                        <View style={[componentStyles.planetCircle, { backgroundColor: colors.surface, shadowColor: planetState.color }]}>
                            <Icon name={planetState.icon} size={100} color={planetState.color} />
                            <Icon name="cloud" size={30} color={dark ? colors.primaryContainer : "#E0F7FA"} style={{ position: 'absolute', top: 20, right: 20 }} />
                        </View>
                        <Text style={[componentStyles.planetStatus, { color: planetState.color }]}>{planetState.status}</Text>
                        <Text style={[componentStyles.planetMessage, { color: colors.onSurface }]}>{planetState.message}</Text>
                    </View>

                    {/* --- CARD CO2 REDUCIDO --- */}
                    <View style={[componentStyles.co2Card, { backgroundColor: colors.primary }]}>
                        <View>
                            <Text style={[componentStyles.cardLabelLight, { color: colors.onPrimary }]}>Huella de Carbono Reducida</Text>
                            <Text style={[componentStyles.co2Value, { color: colors.onPrimary }]}>{stories.co2} <Text style={{ fontSize: 20 }}>kg</Text></Text>
                        </View>
                        <Icon name="cloud-check-outline" size={60} color={colors.onPrimary} style={{ opacity: 0.5 }} />
                    </View>

                    {/* --- EQUIVALENCIAS TANGIBLES --- */}
                    <Text style={[componentStyles.sectionTitle, { color: colors.onSurface }]}>Equivalencias Reales</Text>
                    <Text style={[componentStyles.sectionSubtitle, { color: colors.onSurfaceVariant }]}>Para que dimensiones tu impacto:</Text>

                    <View style={componentStyles.grid}>
                        {/* 1. Energía */}
                        <View style={[componentStyles.storyCard, { backgroundColor: dark ? '#3E3A20' : '#FFF9C4' }]}>
                            <Icon name="lightning-bolt" size={28} color="#FBC02D" style={componentStyles.storyIcon} />
                            <Text style={[componentStyles.storyText, { color: dark ? '#F0F0F0' : '#444' }]}>
                                Ahorraste energía para <Text style={{ fontWeight: 'bold' }}>{stories.lightbulbHours} horas</Text> de un foco o <Text style={{ fontWeight: 'bold' }}>{stories.phoneCharges} cargas</Text> de celular.
                            </Text>
                        </View>

                        {/* 2. Agua */}
                        <View style={[componentStyles.storyCard, { backgroundColor: dark ? '#1A2E38' : '#E1F5FE' }]}>
                            <Icon name="water" size={28} color="#039BE5" style={componentStyles.storyIcon} />
                            <Text style={[componentStyles.storyText, { color: dark ? '#F0F0F0' : '#444' }]}>
                                Evitaste el uso de agua equivalente a <Text style={{ fontWeight: 'bold' }}>{stories.showers} duchas rápidas</Text>.
                            </Text>
                        </View>

                        {/* 3. Transporte */}
                        <View style={[componentStyles.storyCard, { backgroundColor: dark ? '#3D2F1D' : '#FFECB3' }]}>
                            <Icon name="car-hatchback" size={28} color="#FF6F00" style={componentStyles.storyIcon} />
                            <Text style={[componentStyles.storyText, { color: dark ? '#F0F0F0' : '#444' }]}>
                                Evitaste emisiones iguales a un viaje de <Text style={{ fontWeight: 'bold' }}>{stories.carKm} km</Text> en auto.
                            </Text>
                        </View>

                        {/* 4. Vida */}
                        <View style={[componentStyles.storyCard, { backgroundColor: dark ? '#213123' : '#E8F5E9' }]}>
                            <Icon name="tree" size={28} color="#43A047" style={componentStyles.storyIcon} />
                            <Text style={[componentStyles.storyText, { color: dark ? '#F0F0F0' : '#444' }]}>
                                Has salvado el equivalente a <Text style={{ fontWeight: 'bold' }}>{stories.trees} árboles</Text> adultos.
                            </Text>
                        </View>
                    </View>

                    {/* --- BOTÓN PRESUMIR (Social) --- */}
                    <TouchableOpacity
                        style={[componentStyles.shareButton, { backgroundColor: dark ? colors.primary : '#2D2338' }]}
                        onPress={handleShare}
                    >
                        <View style={componentStyles.shareContent}>
                            <Icon name="share-variant" size={24} color="#FFF" />
                            <Text style={componentStyles.shareText}>Presumir mi Logro</Text>
                        </View>
                        <Text style={componentStyles.shareSubtext}>Inspirar a otros a reciclar</Text>
                    </TouchableOpacity>

                </View>
            </ScrollView>
        </View>
    );
};

// 🎨 ESTILOS DINÁMICOS BASADOS EN EL TEMA
const getStyles = (theme) => StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    headerWrapper: { backgroundColor: 'transparent' },
    headerContent: { paddingTop: 50, paddingBottom: 20, paddingHorizontal: 25, flexDirection: 'row' },
    svgContainer: { marginTop: -1, zIndex: -1 },
    backButton: { alignSelf: 'flex-start', marginLeft: -10, marginBottom: 10, marginRight: 15 },
    headerTitle: { fontSize: 24, fontWeight: 'bold' },
    headerSubtitle: { fontSize: 14 },
    contentContainer: { paddingHorizontal: 20, marginTop: 10 },
    planetSection: { alignItems: 'center', marginBottom: 30, marginTop: 10 },
    planetCircle: { width: 140, height: 140, borderRadius: 70, alignItems: 'center', justifyContent: 'center', elevation: 10, shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.3, shadowRadius: 10, marginBottom: 15 },
    planetStatus: { fontSize: 22, fontWeight: 'bold', marginBottom: 5 },
    planetMessage: { fontSize: 15, textAlign: 'center', paddingHorizontal: 40 },
    co2Card: { borderRadius: 20, padding: 25, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 25, elevation: 4 },
    cardLabelLight: { fontSize: 14 },
    co2Value: { fontSize: 36, fontWeight: 'bold', marginTop: 5 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
    sectionSubtitle: { fontSize: 14, marginBottom: 15 },
    grid: { gap: 15 },
    storyCard: { borderRadius: 15, padding: 15, flexDirection: 'row', alignItems: 'center', elevation: 1 },
    storyIcon: { marginRight: 15 },
    storyText: { flex: 1, fontSize: 14, lineHeight: 20 },
    shareButton: { marginTop: 30, borderRadius: 20, paddingVertical: 15, paddingHorizontal: 20, alignItems: 'center', elevation: 5 },
    shareContent: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
    shareText: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginLeft: 10 },
    shareSubtext: { color: 'rgba(255, 255, 255, 0.7)', fontSize: 12 },
});