import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, Platform, useWindowDimensions, Animated, ActivityIndicator } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import {
    UserHeader,
    CloudHeader,
    QuoteCard,
    ProgressCard,
    StatItem,
    ProgramCard
} from '../../componentes/cards/home';

import { NavItem } from '../../componentes/navigation/NavItem';
import { DrawerMenu } from '../../componentes/navigation/DrawerMenu';
import { ProgramDetailModal } from '../../componentes/modal/shared/ProgramDetailModal';
import { AssistantNotification, getRandomMessage } from '../../componentes/shared/AssistantNotification';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../hooks/use-auth-store';
import { useLevels } from '../../hooks/use-levels-store';
import { useProgramStore } from '../../hooks/use-program-store';
import { EnvironmentalProgramModal } from '../../componentes/modal/programs/EnvironmentalProgramModal';
import { EnvironmentalProgramCard } from '../../componentes/cards/programs/EnvironmentalProgramCard';
import { useRequestStore } from '../../hooks/use-request-store';


export const HomeScreen = () => {
    const { colors } = useTheme();
    const { user } = useAuthStore();
    const { levels, userLevelStatus, startLoadingUserStatus } = useLevels();
    const { programs, startLoadingPrograms, isLoading } = useProgramStore();
    const { requests, startLoadingRequests } = useRequestStore();
    const [isCitizen, setIsCitizen] = useState(user.role === 'CITIZEN');
    const stats = user?.recyclingStats?.by_category;

    const [hasActiveTask, setHasActiveTask] = useState(false);
    const [activeTask, setActiveTask] = useState(null);

    const navigation = useNavigation();
    const theme = useTheme();
    const { height } = useWindowDimensions(); // <--- 1. OBTENEMOS LA ALTURA DE LA PANTALLA
    const componentStyles = styles(theme);

    const [filterType, setFilterType] = useState('peso');
    const [selectedProgram, setSelectedProgram] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [notificationVisible, setNotificationVisible] = useState(false);

    // Animaciones para el FAB
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        startLoadingPrograms();
        startLoadingRequests();
        startLoadingUserStatus(); // 🚨 NUEVO: Carga el "objeto bonito" del nivel
    }, []);

    // Animación de pulso continua para el FAB
    useEffect(() => {
        const pulse = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.15,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        );
        pulse.start();

        // Mostrar notificación después de 3 segundos
        const notificationTimer = setTimeout(() => {
            setNotificationVisible(true);
        }, 3000);

        // Mostrar notificaciones periódicamente cada 60 segundos
        const intervalId = setInterval(() => {
            setNotificationVisible(true);
        }, 60000);

        return () => {
            pulse.stop();
            clearTimeout(notificationTimer);
            clearInterval(intervalId);
        };
    }, []);
    useEffect(() => {
        console.log("usuarioi actual", user)
    }, [user]);

    useEffect(() => {
        if (user.role !== 'RECYCLER' || !requests) return;


        console.log("LISTA DE SOLICITUDES EN HOME:",);


        const task = requests.find(req => req.status === 'ACCEPTED');
        console.log('TAREA ENCONTRADA:', task);

        if (task) {
            setHasActiveTask(true);
            setActiveTask(task);
        } else {
            setHasActiveTask(false);
            setActiveTask(null);
        }
    }, [requests, user.role]);

    const handleFabPress = () => {
        // Animación de escala al presionar
        Animated.sequence([
            Animated.timing(scaleAnim, {
                toValue: 0.9,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start();

        navigation.navigate('VirtualAssistant');
    };

    const popularPrograms = Array.isArray(programs) ? programs.slice(0, 5) : [];

    // Datos según el tipo de filtro
    const currentImpact = {
        peso: [
            {
                image: require('../../../assets/botella.jpg'),
                label: 'Plástico',
                value: `${stats?.plastic?.kg || 0} kg`, //
                overlayColor: '#D4E7FF'
            },
            {
                image: require('../../../assets/papelcarton.jpg'),
                label: 'Cartón',
                value: `${stats?.paper?.kg || 0} kg`, //
                overlayColor: '#FFE4CC'
            },
            {
                image: require('../../../assets/metales.jpg'),
                label: 'Metal',
                value: `${stats?.metal?.kg || 0} kg`,
                overlayColor: '#F3F4F6'
            },
            {
                image: require('../../../assets/electrodomesticos.jpg'),
                label: 'RAEE',
                value: `${stats?.electronics?.kg || 0} kg`,
                overlayColor: '#FFDDDD'
            },
        ],
        cantidad: [
            {
                image: require('../../../assets/botella.jpg'),
                label: 'Plástico',
                value: `${stats?.plastic?.units || 0} und`,
                overlayColor: '#D4E7FF'
            },
            {
                image: require('../../../assets/papelcarton.jpg'),
                label: 'Cartón',
                value: `${stats?.paper?.units || 0} und`,
                overlayColor: '#FFE4CC'
            },
            {
                image: require('../../../assets/metales.jpg'),
                label: 'Metal',
                value: `${stats?.metal?.units || 0} und`,
                overlayColor: '#F3F4F6'
            },
            {
                image: require('../../../assets/electrodomesticos.jpg'),
                label: 'RAEE',
                value: `${stats?.electronics?.units || 0} und`,
                overlayColor: '#FFDDDD'
            },
        ]
    };

    const toggleFilter = () => {
        setFilterType(prev => prev === 'peso' ? 'cantidad' : 'peso');
    };

    return (
        <View style={[componentStyles.container, Platform.OS === 'web' && { height: height, overflow: 'hidden' }]}>
            <ScrollView
                style={componentStyles.scrollContent}
                contentContainerStyle={componentStyles.scrollContentContainer}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled={true}
            >
                {/* 4. HEADER CONECTADO A REDUX */}
                <CloudHeader
                    userName={`Hola, ${user.fullName || 'Usuario'}`}
                    userType={user.role === 'CITIZEN' ? 'Ciudadano' : 'Reciclador'}
                    avatarUrl={user.avatar} // Si es null, el componente CloudHeader debería manejar un default
                    onMenuPress={() => setDrawerVisible(true)}
                />

                <QuoteCard quote="El mejor momento para plantar un árbol fue hace 20 años. El segundo mejor momento es ahora." />

                {/* BANNER DE TAREA ACTIVA (Solo para Recicladores con tarea pendiente) */}
                {hasActiveTask && activeTask && (
                    <TouchableOpacity
                        style={styles(theme).activeTaskBanner}
                        onPress={() => navigation.navigate('RecyclerTaskDetail', { request: activeTask })}
                        activeOpacity={0.9}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                            <View style={styles(theme).bannerIconCircle}>
                                <Icon name="truck-delivery" size={22} color="#FFFFFF" />
                            </View>
                            <View style={{ marginLeft: 12, flex: 1 }}>
                                <Text style={styles(theme).bannerTitle}>Recojo en curso</Text>
                                <Text style={styles(theme).bannerSubtitle} numberOfLines={1}>
                                    {activeTask.location?.address || 'Ver detalles de la ruta'}
                                </Text>
                            </View>
                        </View>
                        <Icon name="chevron-right" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                )}

                {/* 5. TARJETA DE PROGRESO 100% DINÁMICA */}
                {userLevelStatus ? (
                    console.log("userLevelStatus", userLevelStatus),
                    <ProgressCard
                        badgeIcon={userLevelStatus.currentLevel.icon}       // 'spa', 'tree', etc.
                        badgeTitle={userLevelStatus.currentLevel.name}     // 'Rama Fuerte'
                        rank={userLevelStatus.currentLevel.rank}           // 'Nivel 5'
                        progress={userLevelStatus.progress}                // 0.81 (calculado en el back)
                        currentPoints={userLevelStatus.points.current}     // 2270
                        maxPoints={userLevelStatus.points.max}             // 2800 (¡Ya no saldrá 400!)
                        bgColor={userLevelStatus.currentLevel.color}
                        iconColor={userLevelStatus.currentLevel.bgColor}
                        nextLevelTitle={userLevelStatus.nextLevel.name}    // 'Árbol Guardián'
                    />
                ) : (
                    <ActivityIndicator color={theme.colors.primary} /> // O un esqueleto de carga
                )}

                {/* Sección de Impacto */}
                <View style={componentStyles.impactSection}>
                    <Text style={componentStyles.sectionTitle}>Tu impacto este mes:</Text>
                    <View style={componentStyles.filterContainer}>
                        <TouchableOpacity style={[componentStyles.filterButton, filterType === 'peso' && componentStyles.filterButtonActive]} onPress={() => setFilterType('peso')}>
                            <Text style={[componentStyles.filterText, filterType === 'peso' && componentStyles.filterTextActive]}>Peso</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[componentStyles.filterButton, filterType === 'cantidad' && componentStyles.filterButtonActive]} onPress={() => setFilterType('cantidad')}>
                            <Text style={[componentStyles.filterText, filterType === 'cantidad' && componentStyles.filterTextActive]}>Cantidad</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={componentStyles.statsContainer}>
                        {currentImpact[filterType].map((item, index) => (
                            <StatItem key={index} {...item} />
                        ))}
                    </View>
                </View>



                {/* Programas */}
                <View style={componentStyles.programsSection}>
                    <View style={[componentStyles.programsHeader, { paddingHorizontal: 20 }]}>
                        <Text style={[componentStyles.sectionTitle, { color: '#31253B' }]}>
                            Programas Populares
                        </Text>
                    </View>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 10 }}>
                        {popularPrograms.length > 0 ? (
                            popularPrograms.map((program) => (
                                <View key={program._id} style={{ width: 280, marginRight: 15 }}>
                                    <EnvironmentalProgramCard
                                        key={program._id}
                                        {...program} // Pasamos todo (title, imageUrl, etc.)

                                        // 1. Para la TARJETA (Visualización en lista):
                                        // La tarjeta sí espera una prop 'image' que sea un objeto source ({uri: ...})
                                        image={
                                            (program.imageUrl && program.imageUrl.startsWith('http'))
                                                ? { uri: program.imageUrl }
                                                : require('../../../assets/botella.jpg')
                                        }

                                        // 2. Para el MODAL (Al hacer click):
                                        onPress={() => {
                                            const programForModal = {
                                                ...program,
                                                // Solo arreglamos el contacto (que sabemos que era el problema anterior)
                                                image: { uri: program.imageUrl },
                                                contactInfo: program.contactInfo
                                                    ? `${program.contactInfo.email || ''}\n${program.contactInfo.phone || ''}`
                                                    : 'Sin contacto'
                                            };

                                            setSelectedProgram(programForModal);
                                            setModalVisible(true);
                                        }}
                                    />
                                </View>
                            ))
                        ) : (
                            // Estado vacío o de carga
                            <Text style={{ marginLeft: 10, color: '#555' }}>
                                {isLoading ? 'Cargando programas...' : 'No hay programas destacados hoy.'}
                            </Text>
                        )}
                    </ScrollView>
                </View>
            </ScrollView>

            {/* Bottom Nav */}
            <View style={componentStyles.bottomNav}>
                <NavItem icon="home" label="Inicio" active />
                {isCitizen && (
                    <NavItem icon="recycle" label="Reciclar" onPress={() => navigation.navigate('RequestList')} />
                )}
                {!isCitizen && (
                    <NavItem icon="map" label="Solicitudes" onPress={() => navigation.navigate('Map')} />
                )}
                <NavItem icon="trophy" label="Premios" onPress={() => navigation.navigate('Rewards')} />
            </View>


            {/* 6. DRAWER CONECTADO A REDUX (Ya lo tenías bien) */}
            <DrawerMenu
                visible={drawerVisible}
                onClose={() => setDrawerVisible(false)}
            />

            <AssistantNotification visible={notificationVisible} onClose={() => setNotificationVisible(false)} onOpen={() => navigation.navigate('VirtualAssistant')} />

            {/* FAB */}
            <Animated.View style={[componentStyles.fabContainer, { transform: [{ scale: scaleAnim }] }]}>
                <TouchableOpacity style={componentStyles.fab} onPress={handleFabPress} activeOpacity={0.8}>
                    <Animated.View style={[componentStyles.fabPulse, { transform: [{ scale: pulseAnim }] }]} />
                    <Icon name="robot-happy" size={32} color="#FFFFFF" />
                    <View style={componentStyles.fabBadge}><Icon name="lightning-bolt" size={12} color="#FFF" /></View>
                </TouchableOpacity>
            </Animated.View>
            <EnvironmentalProgramModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                program={selectedProgram}
            />
        </View>
    );
};

const styles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background, // 🚀 Usa el fondo del tema
    },
    scrollContent: {
        flex: 1,
        width: '100%',
    },
    scrollContentContainer: {
        flexGrow: 1, // Fundamental para que el scroll se active
        paddingBottom: 100, // Espacio para el nav de abajo
    },
    impactSection: {
        backgroundColor: theme.colors.background,
        padding: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.colors.onSurface, // 🎨 Cambia de negro a blanco automáticamente
        marginBottom: 15,
        paddingHorizontal: 20,
    },
    filterContainer: {
        flexDirection: 'row',
        marginBottom: 15,
        backgroundColor: theme.colors.inputBackground,
        borderRadius: 25,
        padding: 4,
    },
    filterButton: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 20,
    },
    filterButtonActive: {
        backgroundColor: '#018f64',
        elevation: 4,
    },
    filterText: {
        color: '#000',
        fontSize: 13,
        fontWeight: '500',
        marginLeft: 5,
    },
    filterTextActive: {
        color: '#FFFFFF', // Texto blanco para que resalte
        fontWeight: 'bold',
    },
    statsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    programsSection: {
        backgroundColor: theme.colors.background, // 🚨 Quitamos el #b1eedc fijo
        paddingBottom: 30,
    },
    programsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginBottom: 15,
    },
    programsTitle: {
        fontSize: 18,
        color: '#FFFFFF',
        fontWeight: '600',
    },

    bottomNav: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: theme.colors.greenMain,
        borderTopLeftRadius: 24, // Bordes más redondeados arriba para un look moderno
        borderTopRightRadius: 24,
        paddingVertical: 10,
        elevation: 20,
        color: '#000',
    },
    fabContainer: {
        position: 'absolute',
        bottom: 80,
        right: 20,
    },
    fab: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#018f64',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 12,
        shadowColor: '#018f64',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
    },
    fabPulse: {
        position: 'absolute',
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: 'rgba(1, 143, 100, 0.3)',
    },
    fabBadge: {
        position: 'absolute',
        top: -5,
        right: -5,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#F59E0B',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },

    activeTaskBanner: {
        backgroundColor: theme.colors.primary, // Usa tu color primario para que resalte
        marginHorizontal: 20,
        marginTop: 10,
        borderRadius: 20,
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 4,
    },
    bannerIconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bannerTitle: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 14,
    },
    bannerSubtitle: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 12,
    },
});