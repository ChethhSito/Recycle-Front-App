import React, { useState, useRef } from 'react';
import { View, StyleSheet, Dimensions, FlatList, Animated, Share } from 'react-native';
import { Text, Button, ProgressBar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

// 1. ACTUALIZAMOS LOS DATOS: Agregamos 'longDesc' para más texto
const LEVELS = [
    {
        id: '1',
        level: 1,
        title: 'Semilla de Cambio',
        icon: 'seed',
        color: '#5D4037',
        bg: '#e7cec2ff',
        desc: 'Todo gran cambio comienza pequeño.',
        longDesc: 'Como Semilla de Cambio, estás dando el primer paso vital. Cada pequeño acto de reciclaje es una promesa de un futuro más verde. ¡Sigue así para ver cómo tus esfuerzos germinan!', // NUEVO TEXTO
        currentPoints: 150,
        targetPoints: 500
    },
    {
        id: '2',
        level: 2,
        title: 'Brote Verde',
        icon: 'sprout',
        color: '#558B2F',
        bg: '#d3ebb7ff',
        desc: 'Tus acciones están echando raíces.',
        longDesc: 'Ya se ven los primeros resultados. Tus hábitos sostenibles están empezando a crecer y a fortalecerse, mostrando un compromiso real con el planeta.',
        currentPoints: 620,
        targetPoints: 1000
    },
    // ... Agrega 'longDesc' a los demás niveles ...
    {
        id: '3',
        level: 3,
        title: 'Tallo Robusto',
        icon: 'flower',
        color: '#2E7D32',
        bg: '#bce4bdff',
        desc: 'Creciendo fuerte con cada reciclaje.',
        longDesc: 'Nada te detiene. Tu constancia te ha convertido en un pilar fundamental del cambio. Tu tallo es fuerte y capaz de soportar grandes desafíos.',
        currentPoints: 1250,
        targetPoints: 2500
    },
    {
        id: '4',
        level: 4,
        title: 'Árbol Joven',
        icon: 'tree-outline',
        color: '#00695C',
        bg: '#B2DFDB',
        desc: 'Tu impacto genera sombra y protección.',
        longDesc: 'Tu influencia se expande. Como un árbol joven, empiezas a dar cobijo y ejemplo a otros, inspirando a tu comunidad a seguir tus pasos.',
        currentPoints: 3100,
        targetPoints: 5000
    },
    {
        id: '5',
        level: 5,
        title: 'Bosque Viviente',
        icon: 'forest',
        color: '#1B5E20',
        bg: '#A5D6A7',
        desc: 'Eres un ecosistema completo de cambio.',
        longDesc: 'Has alcanzado la cima. Eres un líder, un ecosistema en sí mismo que nutre y sostiene la vida a su alrededor. ¡Tu legado es un mundo más verde!',
        currentPoints: 8900,
        targetPoints: 10000
    },
];

export const RankScreen = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollX = useRef(new Animated.Value(0)).current;
    const navigation = useNavigation();

    const onShare = async (title, level) => {
        try {
            await Share.share({
                message: `¡He alcanzado el rango de ${title} (Nivel ${level}) en mi App de Reciclaje! 🌿♻️`,
            });
        } catch (error) {
            console.log(error.message);
        }
    };

    const renderItem = ({ item }) => {
        const progress = item.currentPoints / item.targetPoints;

        return (
            <View style={[styles.slideContainer, { backgroundColor: item.bg }]}>

                {/* --- Contenido Principal (Arriba) --- */}
                <View style={styles.mainContent}>
                    <View style={[styles.circleBackdrop, { backgroundColor: 'rgba(255,255,255,0.6)' }]}>
                        <MaterialCommunityIcons name={item.icon} size={140} color={item.color} />
                    </View>

                    <View style={styles.textContainer}>
                        <Text variant="displaySmall" style={[styles.title, { color: item.color }]}>
                            {item.title}
                        </Text>

                        <Text variant="bodyLarge" style={styles.desc}>
                            {item.desc}
                        </Text>

                        {/* NUEVO: Texto adicional sobre el rango */}
                        <Text variant="bodyMedium" style={styles.longDesc}>
                            {item.longDesc}
                        </Text>
                    </View>
                </View>

                {/* --- Sección Inferior (Progreso y Botones) --- */}
                <View style={styles.bottomSection}>
                    {/* Estadísticas y Barra de Progreso */}
                    <View style={styles.statsContainer}>
                        <View style={styles.statsRow}>
                            <View style={[styles.badgePill, { backgroundColor: item.color }]}>
                                <Text style={styles.badgeText}>NIVEL {item.level}</Text>
                            </View>
                            <Text style={[styles.pointsText, { color: item.color }]}>
                                {item.currentPoints} / {item.targetPoints} XP
                            </Text>
                        </View>
                        <ProgressBar
                            progress={progress}
                            color={item.color}
                            style={styles.progressBar}
                        />
                    </View>

                    {/* Botones de Acción (Volver y Compartir) - Extremo a Extremo */}
                    <View style={styles.bottomButtonsAction}>
                        <Button
                            mode="text"
                            textColor={item.color}
                            onPress={() => navigation.goBack()}
                            labelStyle={{ fontSize: 16 }}
                        >
                            Volver
                        </Button>
                        <Button
                            mode="contained" // Usamos 'contained' para resaltar la acción de compartir
                            buttonColor={item.color}
                            icon="share-variant"
                            onPress={() => onShare(item.title, item.level)}
                            labelStyle={{ fontSize: 16 }}
                        >
                            Compartir
                        </Button>
                    </View>
                </View>
            </View>
        );
    };

    // Indicadores (Puntitos)
    const Pagination = () => {
        return (
            <View style={styles.paginationContainer}>
                {LEVELS.map((_, i) => (
                    <View
                        key={i}
                        style={[
                            styles.dot,
                            { backgroundColor: i === activeIndex ? '#333' : 'rgba(0,0,0,0.2)', width: i === activeIndex ? 20 : 8 }
                        ]}
                    />
                ))}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={LEVELS}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={(ev) => {
                    const index = Math.round(ev.nativeEvent.contentOffset.x / width);
                    setActiveIndex(index);
                }}
            />
            <Pagination />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    slideContainer: {
        width: width,
        height: '100%',
    },
    mainContent: {
        // CAMBIO 1: Reducimos el flex de 0.9 a 0.6 para que no ocupe tanta pantalla innecesaria
        flex: 0.8,
        // CAMBIO 2: Cambiamos 'center' por 'flex-end'. Esto empuja el logo y texto hacia ABAJO.
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingHorizontal: 40,
        // Agregamos un pequeño padding abajo para que no se pegue totalmente a la siguiente sección
        paddingBottom: 20,
    },
    circleBackdrop: {
        width: 220, // Ligeramente más pequeño para dar espacio al texto extra
        height: 220,
        borderRadius: 110,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 25,
    },
    textContainer: {
        alignItems: 'start',
        width: '100%',
    },
    title: {
        fontSize: 32,
        fontFamily: 'InclusiveSans-Bold',
        marginBottom: 10,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    desc: {
        textAlign: 'center',
        color: '#1d1d1dff',
        fontSize: 20,
        fontWeight: '500',
        marginBottom: 10,
        maxWidth: '100%',
        paddingVertical: 10,
    },
    // Estilo para el nuevo texto largo
    longDesc: {
        textAlign: 'center',
        color: '#1d1d1dff',
        fontSize: 18,
        lineHeight: 25,
        maxWidth: '100%',
        opacity: 1,
        paddingVertical: 10,
    },

    // --- ESTILOS DE LA NUEVA SECCIÓN INFERIOR ---
    bottomSection: {

        width: '100%',
        paddingHorizontal: 40,
        paddingBottom: 0, // Espacio suficiente para los puntitos y margen
        justifyContent: 'flex-end',
        paddingTop: 20,
    },
    statsContainer: {
        width: '100%',
        marginBottom: 25, // Separación entre la barra y los botones
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    badgePill: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        marginVertical: 4,
    },
    badgeText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12
    },
    pointsText: {
        fontWeight: 'bold',
        fontSize: 14,
        marginVertical: 4,
    },
    progressBar: {
        height: 10,
        borderRadius: 5,
        backgroundColor: '#ffffff80',
    },
    // Contenedor para los botones de extremo a extremo
    bottomButtonsAction: {
        flexDirection: 'row',
        justifyContent: 'space-between', // Separa los elementos a los extremos
        alignItems: 'center',
        width: '100%',
    },
    paginationContainer: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 20, // Posición cerca del borde inferior
        alignSelf: 'center',
    },
    dot: {
        height: 10,
        borderRadius: 5,
        marginHorizontal: 8,
    },
});