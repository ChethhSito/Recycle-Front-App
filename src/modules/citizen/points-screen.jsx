import React, { useState, useRef } from 'react';
import { View, StyleSheet, Dimensions, FlatList, Animated, Share, Platform } from 'react-native';
import { Text, Button, ProgressBar, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const CURRENT_USER_LEVEL = 2;
// 1. DATA DE LOS 7 NIVELES (Colores y Textos actualizados)
const LEVELS = [
    {
        id: '1', level: 1, title: 'Semilla de Cambio', icon: 'seed',
        color: '#5D4037', bg: '#F5E6D3', // Beige Tierra
        desc: 'Todo gran cambio comienza pequeño.',
        longDesc: 'Estás dando el primer paso vital. Como una semilla, llevas dentro el potencial de un futuro más verde. ¡Sigue reciclando para germinar!',
        currentPoints: 400, targetPoints: 400
    },
    {
        id: '2', level: 2, title: 'Raíz Profunda', icon: 'grass',
        color: '#4E342E', bg: '#E6D0B3', // Tierra Oscura
        desc: 'Tus valores se están afianzando.',
        longDesc: 'Antes de crecer hacia arriba, creces hacia adentro. Tus hábitos de reciclaje están creando una base sólida y resistente.',
        currentPoints: 400, targetPoints: 800
    },
    {
        id: '3', level: 3, title: 'Brote Verde', icon: 'sprout',
        color: '#33691E', bg: '#D9F2C3', // Verde Lima
        desc: 'Tus acciones salen a la luz.',
        longDesc: '¡Ya eres visible! Tus primeros esfuerzos han roto la superficie. Tu compromiso con el planeta empieza a ser notorio.',
        currentPoints: 0, targetPoints: 1200
    },
    {
        id: '4', level: 4, title: 'Tallo Robusto', icon: 'flower-tulip',
        color: '#1B5E20', bg: '#B8E6C9', // Verde Menta
        desc: 'Resiliencia y constancia.',
        longDesc: 'Nada te detiene. Tu constancia te ha convertido en un pilar fundamental. Tu tallo es fuerte y capaz de soportar desafíos.',
        currentPoints: 0, targetPoints: 2000
    },
    {
        id: '5', level: 5, title: 'Rama Fuerte', icon: 'spa',
        color: '#004D40', bg: '#8CD4B6', // Verde Medio
        desc: 'Tu influencia se expande.',
        longDesc: 'Empiezas a ramificarte. Tu ejemplo alcanza a amigos y familiares, extendiendo la cultura del reciclaje más allá de ti mismo.',
        currentPoints: 0, targetPoints: 2800
    },
    {
        id: '6', level: 6, title: 'Árbol Guardián', icon: 'tree',
        color: '#006064', bg: '#5CB8A7', // Verde Azulado
        desc: 'Das sombra y protección.',
        longDesc: 'Has madurado. Eres un referente en tu comunidad, ofreciendo protección al medio ambiente y enseñando con el ejemplo.',
        currentPoints: 0, targetPoints: 4400
    },
    {
        id: '7', level: 7, title: 'Bosque Viviente', icon: 'pine-tree',
        color: '#00332C', bg: '#408573', // Verde Bosque Profundo
        desc: 'Eres un ecosistema de cambio.',
        longDesc: 'Has alcanzado la cima. Eres un líder, un ecosistema en sí mismo que nutre y sostiene la vida a su alrededor. ¡Eres leyenda!',
        currentPoints: 0, targetPoints: 6000
    },
];

export const RankScreen = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollX = useRef(new Animated.Value(0)).current;
    const navigation = useNavigation();

    // 2. FUNCIÓN DE COMPARTIR MEJORADA (Mensaje Largo y Estético)
    const onShare = async (item) => {
        const percentage = Math.round((item.currentPoints / item.targetPoints) * 100);

        // Creamos una "Barra de progreso" con texto para WhatsApp
        const barLength = 10;
        const filled = Math.round((percentage / 100) * barLength);
        const empty = barLength - filled;
        const progressBarText = '🟩'.repeat(filled) + '⬜'.repeat(empty);

        // Mensaje largo estructurado
        const message =
            `🌿 *¡Mi Progreso en EcoRecicla!* 🌿

🏆 *Rango Actual:* ${item.title} (Nivel ${item.level})
✨ _"${item.desc}"_

📊 *Estadísticas:*
${progressBarText} ${percentage}%
Puntos: ${item.currentPoints} / ${item.targetPoints} XP

💬 *Mi Estado:*
${item.longDesc}

♻️ ¡Ayúdame a salvar el planeta! Descarga la app y únete al cambio. #Reciclaje #EcoLloy #HuellaVerde`;

        try {
            await Share.share({
                message: message,
                // En iOS, el título a veces se usa como asunto de correo o preview
                title: `Soy ${item.title} en EcoRecicla`,
            });
        } catch (error) {
            console.log(error.message);
        }
    };

    const renderItem = ({ item }) => {
        const isLocked = item.level > CURRENT_USER_LEVEL;
        const progress = item.currentPoints / item.targetPoints;

        return (
            <View style={[styles.slideContainer, { backgroundColor: item.bg }]}>
                {isLocked ? (
                    // === ESTADO BLOQUEADO ===
                    <View style={styles.mainContent}>
                        {/* Círculo con Candado */}
                        <View style={[styles.circleBackdrop, { backgroundColor: 'rgba(0,0,0,0.1)' }]}>
                            <MaterialCommunityIcons name="lock" size={100} color="rgba(0,0,0,0.4)" />
                        </View>

                        <View style={styles.textContainer}>
                            <Text variant="headlineMedium" style={[styles.title, { color: 'rgba(0,0,0,0.5)' }]}>
                                Nivel {item.level} Bloqueado
                            </Text>
                            <Text style={[styles.desc, { color: 'rgba(0,0,0,0.4)' }]}>
                                Sigue reciclando para descubrir este rango.
                            </Text>

                            {/* Información mínima para motivar */}
                            <View style={styles.lockedInfoContainer}>
                                <Text style={styles.lockedInfoText}>
                                    Meta: {item.targetPoints} XP
                                </Text>
                            </View>
                        </View>

                        <View style={styles.bottomSection}>
                            {/* Botón Volver (Siempre activo) */}
                            <Button
                                mode="text"
                                textColor="rgba(0,0,0,0.5)"
                                onPress={() => navigation.goBack()}
                            >
                                Volver
                            </Button>

                            {/* Botón Simbólico */}
                            <Button
                                mode="contained"
                                disabled={true}
                                style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}
                                labelStyle={{ color: 'rgba(0,0,0,0.3)' }}
                            >
                                Bloqueado 🔒
                            </Button>
                        </View>
                    </View>

                ) : (
                    // === ESTADO DESBLOQUEADO (Tu diseño original) ===
                    <View style={{ flex: 1, width: '100%' }}>
                        <View style={styles.mainContent}>
                            <View style={[styles.circleBackdrop, { backgroundColor: 'rgba(255,255,255,0.6)' }]}>
                                <MaterialCommunityIcons name={item.icon} size={130} color={item.color} />
                            </View>

                            <View style={styles.textContainer}>
                                <Text variant="displaySmall" style={[styles.title, { color: item.color }]}>
                                    {item.title}
                                </Text>
                                <Text style={[styles.desc, { color: '#1d1d1d' }]}>
                                    {item.desc}
                                </Text>
                                <View style={styles.divider} />
                                <Text style={styles.longDesc}>
                                    {item.longDesc}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.bottomSection}>
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
                                    mode="contained"
                                    buttonColor={item.color}
                                    icon="share-variant"
                                    onPress={() => onShare(item)}
                                    labelStyle={{ fontSize: 16, fontWeight: 'bold' }}
                                    contentStyle={{ paddingHorizontal: 10 }}
                                >
                                    Compartir
                                </Button>
                            </View>
                        </View>
                    </View>
                )}
            </View>
        );
    };

    const Pagination = () => {
        return (
            <View style={styles.paginationContainer}>
                {LEVELS.map((item, i) => {
                    const isLocked = item.level > CURRENT_USER_LEVEL;
                    return (
                        <View
                            key={i}
                            style={[
                                styles.dot,
                                {
                                    backgroundColor: i === activeIndex ? '#333' : (isLocked ? 'rgba(0,0,0,0.05)' : 'rgba(0,0,0,0.2)'),
                                    width: i === activeIndex ? 20 : 8
                                }
                            ]}
                        />
                    );
                })}
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
    container: { flex: 1 },
    slideContainer: { width: width, height: '100%' },

    mainContent: {
        flex: 0.75, // Ocupa el 75% superior
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
    },
    circleBackdrop: {
        width: 200, height: 200, borderRadius: 100,
        justifyContent: 'center', alignItems: 'center',
        marginBottom: 30,
        elevation: 5, // Sombra suave en Android
    },
    textContainer: { width: '100%', alignItems: 'center' },
    title: {
        fontSize: 30, fontFamily: 'InclusiveSans-Bold', fontWeight: 'bold',
        textAlign: 'center', marginBottom: 5,
    },
    desc: {
        fontSize: 18, fontWeight: '600', textAlign: 'center',
        opacity: 0.8, marginBottom: 15,
    },
    divider: {
        width: 50, height: 4, backgroundColor: 'rgba(0,0,0,0.1)',
        borderRadius: 2, marginBottom: 15,
    },
    longDesc: {
        fontSize: 16, textAlign: 'center', color: '#333',
        lineHeight: 24, fontFamily: 'InclusiveSans-Regular',
    },

    bottomSection: {
        flex: 0.25, // Ocupa el 25% inferior
        justifyContent: 'flex-start',
        paddingHorizontal: 30,
        paddingTop: 10,
    },
    statsContainer: { width: '100%', marginBottom: 20 },
    statsRow: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8,
    },
    badgePill: {
        paddingHorizontal: 12, paddingVertical: 4, borderRadius: 10,
    },
    badgeText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
    pointsText: { fontWeight: 'bold', fontSize: 14 },
    progressBar: { height: 12, borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.7)' },

    bottomButtonsAction: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%',
    },
    paginationContainer: {
        flexDirection: 'row', position: 'absolute', bottom: 20, alignSelf: 'center',
    },
    dot: { height: 8, borderRadius: 4, marginHorizontal: 4 },
});