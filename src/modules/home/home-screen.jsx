import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, Platform, useWindowDimensions, Animated } from 'react-native';
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


export const HomeScreen = () => {

    const { user } = useAuthStore();
    const { levels } = useLevels();

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

    const userLevelNumber = user?.level || 1;
    const currentLevelData = levels?.find(l => l.levelNumber === userLevelNumber) || {};

    const userName = user?.fullName
    const userEmail = user?.email
    const userPoints = user?.points
    const userAvatarUrl = user?.avatarUrl
    const levelName = currentLevelData.name
    const levelIcon = currentLevelData.iconName
    const targetPoints = currentLevelData.maxPoints
    const currentPoints = user?.points;
    // Calculamos el progreso (evitando división por cero)
    const progressValue = targetPoints > 0 ? (currentPoints / targetPoints) : 0;

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

    // Datos según el tipo de filtro
    const impactData = {
        peso: [
            { icon: 'bottle-soda', label: 'Plástico', value: '5.2 kg', backgroundColor: '#D4E7FF', iconColor: '#3B82F6' },
            { icon: 'package-variant', label: 'Cartón', value: '3.8 kg', backgroundColor: '#FFE4CC', iconColor: '#F97316' },
            { icon: 'silverware-fork-knife', label: 'Metal', value: '2.1 kg', backgroundColor: '#F3F4F6', iconColor: '#6B7280' },
            { icon: 'trash-can', label: 'RAEE', value: '1.5 kg', backgroundColor: '#FFDDDD', iconColor: '#EF4444' },
        ],
        cantidad: [
            { icon: 'bottle-soda', label: 'Plástico', value: '100 unidades', backgroundColor: '#D4E7FF', iconColor: '#3B82F6' },
            { icon: 'package-variant', label: 'Cartón', value: '10 unidades', backgroundColor: '#FFE4CC', iconColor: '#F97316' },
            { icon: 'silverware-fork-knife', label: 'Metal', value: '5 unidades', backgroundColor: '#F3F4F6', iconColor: '#6B7280' },
            { icon: 'trash-can', label: 'RAEE', value: '1 unidad', backgroundColor: '#FFDDDD', iconColor: '#EF4444' },
        ]
    };

    const toggleFilter = () => {
        setFilterType(prev => prev === 'peso' ? 'cantidad' : 'peso');
    };

    const programsData = [
        {
            id: 1,
            image: require('../../../assets/reciclaje.jpg'),
            title: 'Sector 3\nHorario de recojo',
            badge: { text: 'Hoy', icon: 'calendar', type: 'today' },
            schedule: '6:00 PM - 9:00 PM',
            location: 'Sector 3',
            description: 'Programa de recojo de residuos en el Sector 3. Participa y ayuda a mantener limpia tu comunidad.',
            contact: 'Tel: (01) 234-5678',
        },
        {
            id: 2,
            image: require('../../../assets/reciclaje.png'),
            title: 'Horarios\ndel recojo de basura',
            badge: { text: 'Actividad', icon: 'calendar-check', type: 'activity' },
            schedule: '6:00 PM - 9:00 PM',
            location: 'Plaza de Armas - Campaña del limpieza',
            description: 'Campaña de limpieza comunitaria. Únete y haz la diferencia en tu barrio.',
            contact: 'Email: limpieza@ecolloy.pe',
        },
        {
            id: 3,
            image: require('../../../assets/program1.jpg'),
            title: 'Taller de\nReciclaje Creativo',
            badge: { text: 'Próximo', icon: 'calendar-clock', type: 'today' },
            schedule: 'Sábados 10:00 AM - 1:00 PM',
            location: 'Centro Comunitario - Sector 5',
            description: 'Aprende a crear objetos útiles a partir de materiales reciclados. Talleres prácticos para toda la familia.',
            contact: 'Tel: (01) 987-6543\nEmail: talleres@ecolloy.pe',
        },
    ];

    const handleProgramPress = (program) => {
        setSelectedProgram(program);
        setModalVisible(true);
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
                    avatarUrl={user.avatarUrl} // Si es null, el componente CloudHeader debería manejar un default
                    onMenuPress={() => setDrawerVisible(true)}
                />

                <QuoteCard quote="El mejor momento para plantar un árbol fue hace 20 años. El segundo mejor momento es ahora." />

                {/* 5. TARJETA DE PROGRESO 100% DINÁMICA */}
                <ProgressCard
                    badgeIcon={currentLevelData.iconName || 'seed'}
                    badgeTitle={currentLevelData.name || 'Semilla'}
                    rank={`Nivel ${userLevelNumber}`}
                    progress={progressValue}
                    currentPoints={currentPoints}
                    maxPoints={targetPoints}

                    // 👇 PASAMOS LOS COLORES DE LA BD
                    bgColor={currentLevelData.primaryColor || '#F5E6D3'}
                    iconColor={currentLevelData.bgColor || '#5D4037'}
                />

                {/* Sección de Impacto */}
                <View style={componentStyles.impactSection}>
                    <Text style={componentStyles.sectionTitle}>Tu impacto este mes:</Text>
                    <View style={componentStyles.filterContainer}>
                        <TouchableOpacity style={[componentStyles.filterButton, filterType === 'peso' && componentStyles.filterButtonActive]} onPress={() => setFilterType('peso')}>
                            <Text style={[componentStyles.filterText, filterType === 'peso' && componentStyles.filterTextActive]}>ver por peso</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[componentStyles.filterButton, filterType === 'cantidad' && componentStyles.filterButtonActive]} onPress={() => setFilterType('cantidad')}>
                            <Text style={[componentStyles.filterText, filterType === 'cantidad' && componentStyles.filterTextActive]}>ver por cantidad</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={componentStyles.statsContainer}>
                        {impactData[filterType].map((item, index) => (
                            <StatItem key={index} {...item} />
                        ))}
                    </View>
                </View>

                {/* Decoración */}
                <Image source={require('../../../assets/nube.png')} style={componentStyles.nubeImage} resizeMode="stretch" />

                {/* Programas */}
                <View style={componentStyles.programsSection}>
                    <View style={[componentStyles.programsHeader, { paddingHorizontal: 20 }]}>
                        <Icon name="leaf" size={50} color="#018f64" />
                        <Text style={[componentStyles.sectionTitle, { color: '#31253B', marginBottom: 0, marginLeft: 10 }]}>Programas Populares</Text>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 10 }}>
                        {programsData.map((program) => (
                            <ProgramCard key={program.id} {...program} onPress={() => handleProgramPress(program)} />
                        ))}
                    </ScrollView>
                </View>
            </ScrollView>

            {/* Bottom Nav */}
            <View style={componentStyles.bottomNav}>
                <NavItem icon="home" label="Inicio" active />
                <NavItem icon="recycle" label="Reciclar" onPress={() => navigation.navigate('RequestList')} />
                <NavItem icon="trophy" label="Premios" onPress={() => navigation.navigate('Rewards')} />
            </View>

            {/* Modales y Drawer */}
            <ProgramDetailModal visible={modalVisible} onClose={() => setModalVisible(false)} program={selectedProgram} />

            {/* 6. DRAWER CONECTADO A REDUX (Ya lo tenías bien) */}
            <DrawerMenu
                visible={drawerVisible}
                onClose={() => setDrawerVisible(false)}
                userName={user.fullName}
                userEmail={user.email}
                userPoints={user.points}
                avatarUrl={user.avatarUrl || 'https://i.pravatar.cc/150?img=33'}
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
        </View>
    );
};

const styles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
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
        fontSize: 18,
        color: '#F0F4F5',
        marginBottom: 15,
        textAlign: 'center',
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
        backgroundColor: '#00C7A1',
    },
    filterText: {
        color: '#000',
        fontSize: 13,
        fontWeight: '500',
        marginLeft: 5,
    },
    filterTextActive: {
        color: '#000',
    },
    statsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    programsSection: {
        backgroundColor: '#B7ECDC',
        paddingTop: 20,
        paddingBottom: 20,
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
    nubeImage: {
        width: '120%',
        height: 85,
        alignSelf: 'center',
        marginBottom: -20,
    },
    bottomNav: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: theme.colors.inputBackground,
        paddingVertical: 10,
        borderRadius: 12,
        marginHorizontal: 0,
        elevation: 10,
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
});