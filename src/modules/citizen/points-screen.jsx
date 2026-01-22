import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Dimensions, FlatList, Animated, Share, Platform, ActivityIndicator } from 'react-native';
import { Text, Button, ProgressBar, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useLevels } from '../../hooks/use-levels-store';
import { useAuthStore } from '../../hooks/use-auth-store';
const { width } = Dimensions.get('window');


export const RankScreen = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const navigation = useNavigation();

    // 1. Obtener datos reales del Hook
    const { levels, loading, error } = useLevels();
    const { user } = useAuthStore();
    // 2. Función de Compartir (Ajustada con datos reales)

    const currentUserPoints = user?.points || 0;
    const currentUserLevel = user?.level || 1;

    const onShare = async (item) => {
        const percentage = Math.round((currentUserPoints / item.maxPoints) * 100);
        const message = `🌿 *¡Mi Progreso en EcoRecicla!* 🌿\n\n🏆 *Rango Actual:* ${item.name} (Nivel ${item.levelNumber})\n✨ _"${item.description}"_\n\nPuntos: ${currentUserPoints} / ${item.maxPoints} XP\n\n♻️ ¡Ayúdame a salvar el planeta!`;
        try {
            await Share.share({ message: message, title: `Soy ${item.name} en EcoRecicla` });
        } catch (error) { }
    };



    const renderItem = ({ item }) => {
        // 3. Mapeo de datos (JSON DB -> Componente)
        const isLocked = item.levelNumber > currentUserLevel;
        // Evitar división por cero si maxPoints fuera 0
        const progress = item.maxPoints > 0 ? (currentUserPoints / item.maxPoints) : 0;

        return (
            // Usamos item.bgColor (viene de la BD)
            <View style={[styles.slideContainer, { backgroundColor: item.bgColor }]}>
                {isLocked ? (
                    // === ESTADO BLOQUEADO ===
                    <View style={styles.mainContent}>
                        <View style={[styles.circleBackdrop, { backgroundColor: 'rgba(255,255,255,0.4)' }]}>
                            {/* Usamos item.primaryColor */}
                            <MaterialCommunityIcons name="lock-outline" size={90} color={item.primaryColor} style={{ opacity: 0.8 }} />
                        </View>

                        <View style={styles.textContainer}>
                            {/* Usamos item.name */}
                            <Text variant="headlineMedium" style={[styles.title, { color: item.primaryColor, opacity: 0.7 }]}>
                                {item.name}
                            </Text>
                            <Text style={[styles.desc, { color: '#555' }]}>
                                Nivel {item.levelNumber} • No disponible
                            </Text>

                            <View style={[styles.lockedCard, { backgroundColor: 'rgba(255,255,255,0.6)' }]}>
                                <View style={styles.lockedHeader}>
                                    <MaterialCommunityIcons name="star-four-points" size={20} color={item.primaryColor} />
                                    <Text style={[styles.lockedCardTitle, { color: item.primaryColor }]}>REQUISITO</Text>
                                    <MaterialCommunityIcons name="star-four-points" size={20} color={item.primaryColor} />
                                </View>

                                {/* Usamos item.maxPoints */}
                                <Text style={styles.targetPointsText}>
                                    {item.maxPoints} <Text style={{ fontSize: 16, fontWeight: 'normal' }}>XP</Text>
                                </Text>

                                <View style={[styles.divider, { backgroundColor: item.primaryColor, opacity: 0.2, marginVertical: 10, height: 1 }]} />

                                <Text style={styles.lockedCardDesc}>
                                    Necesitas reciclar más para desbloquear este rango y sus beneficios.
                                </Text>
                            </View>
                        </View>

                        <View style={styles.bottomSection}>
                            <Button
                                mode="text"
                                textColor={item.primaryColor}
                                onPress={() => navigation.goBack()}
                            >
                                Volver
                            </Button>

                            <Button
                                mode="contained"
                                buttonColor={item.primaryColor}
                                icon="recycle"
                                onPress={() => navigation.navigate('Home')}
                                contentStyle={{ paddingHorizontal: 15, height: 50 }}
                                labelStyle={{ fontSize: 16, fontWeight: 'bold' }}
                                style={{ elevation: 4 }}
                            >
                                ¡Ir a Sumar Puntos!
                            </Button>
                        </View>
                    </View>

                ) : (
                    // === ESTADO DESBLOQUEADO ===
                    <View style={{ flex: 1, width: '100%' }}>
                        <View style={styles.mainContent}>
                            <View style={[styles.circleBackdrop, { backgroundColor: 'rgba(255,255,255,0.6)' }]}>
                                {/* Usamos item.iconName */}
                                <MaterialCommunityIcons name={item.iconName} size={130} color={item.primaryColor} />
                            </View>

                            <View style={styles.textContainer}>
                                <Text variant="displaySmall" style={[styles.title, { color: item.primaryColor }]}>
                                    {item.name}
                                </Text>
                                {/* Usamos item.description */}
                                <Text style={[styles.desc, { color: '#1d1d1d' }]}>
                                    {item.description}
                                </Text>
                                <View style={styles.divider} />
                                {/* Usamos item.longDescription */}
                                <Text style={styles.longDesc}>
                                    {item.longDescription}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.bottomSection}>
                            <View style={styles.statsContainer}>
                                <View style={styles.statsRow}>
                                    <View style={[styles.badgePill, { backgroundColor: item.primaryColor }]}>
                                        <Text style={styles.badgeText}>NIVEL {item.levelNumber}</Text>
                                    </View>
                                    <Text style={[styles.pointsText, { color: item.primaryColor }]}>
                                        {currentUserPoints} / {item.maxPoints} XP
                                    </Text>
                                </View>
                                <ProgressBar
                                    progress={progress}
                                    color={item.primaryColor}
                                    style={styles.progressBar}
                                />
                            </View>

                            <View style={styles.bottomButtonsAction}>
                                <Button
                                    mode="text"
                                    textColor={item.primaryColor}
                                    onPress={() => navigation.goBack()}
                                    labelStyle={{ fontSize: 16 }}
                                >
                                    Volver
                                </Button>
                                <Button
                                    mode="contained"
                                    buttonColor={item.primaryColor}
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
        // Validamos que levels exista para evitar errores
        if (!levels || levels.length === 0) return null;

        return (
            <View style={styles.paginationContainer}>
                {levels.map((item, i) => {
                    const isLocked = item.levelNumber > currentUserLevel;
                    return (
                        <View
                            key={item._id || i} // Usamos _id de Mongo
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

    // 4. Estado de Carga
    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#018f64" />
                <Text style={{ marginTop: 10 }}>Cargando rangos...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={levels}
                renderItem={renderItem}
                keyExtractor={(item) => item._id} // ID de Mongo
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
    container: { flex: 1, backgroundColor: '#fff' }, // Fondo blanco por defecto
    slideContainer: { width: width, height: '100%', alignItems: 'center', justifyContent: 'center' },

    mainContent: {
        flex: 0.75,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
        width: '100%',
    },
    circleBackdrop: {
        width: 200, height: 200, borderRadius: 100,
        justifyContent: 'center', alignItems: 'center',
        marginBottom: 30,
        elevation: 5,
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

    // --- ESTILOS TARJETA BLOQUEADA ---
    lockedCard: {
        marginTop: 20,
        padding: 20,
        borderRadius: 20,
        width: '100%',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.5)',
    },
    lockedHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
        gap: 8
    },
    lockedCardTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    targetPointsText: {
        fontSize: 42,
        fontWeight: 'bold',
        color: '#333',
        marginVertical: 5
    },
    lockedCardDesc: {
        fontSize: 14,
        color: '#555',
        textAlign: 'center',
        lineHeight: 20
    },

    bottomSection: {
        flex: 0.25,
        justifyContent: 'flex-start',
        paddingHorizontal: 30,
        paddingTop: 10,
        width: '100%',
        alignItems: 'center'
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