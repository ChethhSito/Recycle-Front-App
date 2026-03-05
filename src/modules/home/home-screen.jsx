import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, Platform, useWindowDimensions, Animated, ActivityIndicator } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// Tus componentes personalizados
import { CloudHeader, QuoteCard, ProgressCard, StatItem } from '../../componentes/cards/home';
import { NavItem } from '../../componentes/navigation/NavItem';
import { DrawerMenu } from '../../componentes/navigation/DrawerMenu';
import { AssistantNotification } from '../../componentes/shared/AssistantNotification';
import { EnvironmentalProgramModal } from '../../componentes/modal/programs/EnvironmentalProgramModal';
import { EnvironmentalProgramCard } from '../../componentes/cards/programs/EnvironmentalProgramCard';

// Hooks de tu arquitectura
import { useAuthStore } from '../../hooks/use-auth-store';
import { useLevels } from '../../hooks/use-levels-store';
import { useProgramStore } from '../../hooks/use-program-store';
import { useRequestStore } from '../../hooks/use-request-store';
import { useTranslation } from '../../hooks/use-translation'; // 🗣️ Hook de traducción

export const HomeScreen = () => {
    const t = useTranslation(); // 🗣️ Inicializar traducciones
    const theme = useTheme();
    const { colors } = theme;
    const { user } = useAuthStore();
    const { userLevelStatus, startLoadingUserStatus } = useLevels();
    const { programs, startLoadingPrograms, isLoading } = useProgramStore();
    const { requests, startLoadingRequests } = useRequestStore();

    const [isCitizen] = useState(user.role === 'CITIZEN');
    const stats = user?.recyclingStats?.by_category;

    const [hasActiveTask, setHasActiveTask] = useState(false);
    const [activeTask, setActiveTask] = useState(null);
    const [filterType, setFilterType] = useState('peso');
    const [selectedProgram, setSelectedProgram] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [notificationVisible, setNotificationVisible] = useState(false);

    const { height } = useWindowDimensions();
    const navigation = useNavigation();
    const componentStyles = styles(theme);

    // Animaciones
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        startLoadingPrograms();
        startLoadingRequests();
        startLoadingUserStatus();
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
            { image: require('../../../assets/botella.jpg'), label: t.home.categories.plastic, value: `${stats?.plastic?.kg || 0} ${t.home.units.kg}`, overlayColor: '#D4E7FF' },
            { image: require('../../../assets/papelcarton.jpg'), label: t.home.categories.cardboard, value: `${stats?.paper?.kg || 0} ${t.home.units.kg}`, overlayColor: '#FFE4CC' },
            { image: require('../../../assets/metales.jpg'), label: t.home.categories.metal, value: `${stats?.metal?.kg || 0} ${t.home.units.kg}`, overlayColor: '#F3F4F6' },
            { image: require('../../../assets/electrodomesticos.jpg'), label: t.home.categories.electronics, value: `${stats?.electronics?.kg || 0} ${t.home.units.kg}`, overlayColor: '#FFDDDD' },
        ],
        cantidad: [
            { image: require('../../../assets/botella.jpg'), label: t.home.categories.plastic, value: `${stats?.plastic?.units || 0} ${t.home.units.und}`, overlayColor: '#D4E7FF' },
            { image: require('../../../assets/papelcarton.jpg'), label: t.home.categories.cardboard, value: `${stats?.paper?.units || 0} ${t.home.units.und}`, overlayColor: '#FFE4CC' },
            { image: require('../../../assets/metales.jpg'), label: t.home.categories.metal, value: `${stats?.metal?.units || 0} ${t.home.units.und}`, overlayColor: '#F3F4F6' },
            { image: require('../../../assets/electrodomesticos.jpg'), label: t.home.categories.electronics, value: `${stats?.electronics?.units || 0} ${t.home.units.und}`, overlayColor: '#FFDDDD' },
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
            >
                {/* Header dinámico */}
                <CloudHeader
                    userName={`${t.home.greeting}, ${user.fullName || 'User'}`}
                    userType={user.role === 'CITIZEN' ? t.home.roles.citizen : t.home.roles.recycler}
                    avatarUrl={user.avatar}
                    onMenuPress={() => setDrawerVisible(true)}
                />

                <QuoteCard quote={t.home.quote} />

                {/* Banner de Tarea Activa Traducido */}
                {hasActiveTask && activeTask && (
                    <TouchableOpacity
                        style={componentStyles.activeTaskBanner}
                        onPress={() => navigation.navigate('RecyclerTaskDetail', { request: activeTask })}
                        activeOpacity={0.9}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                            <View style={componentStyles.bannerIconCircle}>
                                <Icon name="truck-delivery" size={22} color="#FFFFFF" />
                            </View>
                            <View style={{ marginLeft: 12, flex: 1 }}>
                                <Text style={componentStyles.bannerTitle}>{t.home.activeTask.title}</Text>
                                <Text style={componentStyles.bannerSubtitle} numberOfLines={1}>
                                    {activeTask.location?.address || t.home.activeTask.subtitle}
                                </Text>
                            </View>
                        </View>
                        <Icon name="chevron-right" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                )}

                {/* Tarjeta de Progreso */}
                {userLevelStatus ? (
                    <ProgressCard
                        badgeIcon={userLevelStatus.currentLevel.icon}
                        badgeTitle={userLevelStatus.currentLevel.name}
                        rank={userLevelStatus.currentLevel.rank}
                        progress={userLevelStatus.progress}
                        currentPoints={userLevelStatus.points.current}
                        maxPoints={userLevelStatus.points.max}
                        bgColor={userLevelStatus.currentLevel.color}
                        iconColor={userLevelStatus.currentLevel.bgColor}
                        nextLevelTitle={userLevelStatus.nextLevel.name}
                    />
                ) : (
                    <ActivityIndicator style={{ marginVertical: 20 }} color={colors.primary} />
                )}

                {/* Sección de Impacto con Filtros Traducidos */}
                <View style={componentStyles.impactSection}>
                    <Text style={[componentStyles.sectionTitle, { paddingHorizontal: 0 }]}>{t.home.impact.title}</Text>
                    <View style={componentStyles.filterContainer}>
                        <TouchableOpacity
                            style={[componentStyles.filterButton, filterType === 'peso' && componentStyles.filterButtonActive]}
                            onPress={() => setFilterType('peso')}
                        >
                            <Text style={[componentStyles.filterText, filterType === 'peso' && componentStyles.filterTextActive]}>
                                {t.home.impact.weight}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[componentStyles.filterButton, filterType === 'cantidad' && componentStyles.filterButtonActive]}
                            onPress={() => setFilterType('cantidad')}
                        >
                            <Text style={[componentStyles.filterText, filterType === 'cantidad' && componentStyles.filterTextActive]}>
                                {t.home.impact.quantity}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={componentStyles.statsContainer}>
                        {currentImpact[filterType].map((item, index) => (
                            <StatItem key={index} {...item} />
                        ))}
                    </View>
                </View>

                {/* Programas Populares */}
                <View style={componentStyles.programsSection}>
                    <View style={componentStyles.programsHeader}>
                        <Text style={[componentStyles.sectionTitle, { color: colors.onSurface }]}>
                            {t.home.programs.popular}
                        </Text>
                    </View>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 10 }}>
                        {popularPrograms.length > 0 ? (
                            popularPrograms.map((program) => (
                                <View key={program._id} style={{ width: 280, marginRight: 15 }}>
                                    <EnvironmentalProgramCard
                                        {...program}
                                        image={program.imageUrl ? { uri: program.imageUrl } : require('../../../assets/botella.jpg')}
                                        onPress={() => {
                                            const programForModal = {
                                                ...program,
                                                image: { uri: program.imageUrl },
                                                contactInfo: program.contactInfo
                                                    ? `${program.contactInfo.email || ''}\n${program.contactInfo.phone || ''}`
                                                    : 'No contact info'
                                            };
                                            setSelectedProgram(programForModal);
                                            setModalVisible(true);
                                        }}
                                    />
                                </View>
                            ))
                        ) : (
                            <Text style={{ marginLeft: 20, color: colors.onSurfaceVariant }}>
                                {isLoading ? t.home.programs.loading : t.home.programs.empty}
                            </Text>
                        )}
                    </ScrollView>
                </View>
            </ScrollView>

            {/* Bottom Nav Traducido */}
            <View style={componentStyles.bottomNav}>
                <NavItem icon="home" label={t.home.nav.start} active />
                {isCitizen ? (
                    <NavItem icon="recycle" label={t.home.nav.recycle} onPress={() => navigation.navigate('RequestList')} />
                ) : (
                    <NavItem icon="map" label={t.home.nav.requests} onPress={() => navigation.navigate('Map')} />
                )}
                <NavItem icon="trophy" label={t.home.nav.rewards} onPress={() => navigation.navigate('Rewards')} />
            </View>

            <DrawerMenu visible={drawerVisible} onClose={() => setDrawerVisible(false)} theme={theme} />
            <AssistantNotification visible={notificationVisible} onClose={() => setNotificationVisible(false)} onOpen={() => navigation.navigate('VirtualAssistant')} />

            <EnvironmentalProgramModal visible={modalVisible} onClose={() => setModalVisible(false)} program={selectedProgram} />
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
        color: theme.colors.text,
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