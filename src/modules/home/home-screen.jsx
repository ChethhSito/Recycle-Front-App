import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
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
import { ProgramDetailModal } from '../../componentes/modal/ProgramDetailModal';

export const HomeScreen = () => {
    const theme = useTheme();
    const componentStyles = styles(theme);
    const [filterType, setFilterType] = useState('peso'); // 'peso' o 'cantidad'
    const [selectedProgram, setSelectedProgram] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);

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
        <View style={componentStyles.container}>
            <ScrollView
                style={componentStyles.scrollContent}
                contentContainerStyle={componentStyles.scrollContentContainer}
            >
                {/* Header con usuario */}
                <CloudHeader
                    userName="Juan David"
                    userType="Ciudadano"
                    avatarUrl="https://i.pravatar.cc/150?img=33"
                    onMenuPress={() => setDrawerVisible(true)}
                />

                {/* Quote Card */}
                <QuoteCard
                    quote="El mejor momento para plantar un árbol fue hace 20 años. El segundo mejor momento es ahora."
                />

                {/* Tarjeta de Progreso */}
                <ProgressCard
                    badgeIcon="seed"
                    badgeTitle="Semilla de Cambio"
                    rank="Rango 1"
                    progress={0.3}
                    currentPoints={100}
                    maxPoints={600}
                />

                {/* Tu impacto este mes */}
                <View style={componentStyles.impactSection}>
                    <Text style={componentStyles.sectionTitle}>Tu impacto este mes:</Text>

                    <View style={componentStyles.filterContainer}>
                        <TouchableOpacity
                            style={[
                                componentStyles.filterButton,
                                filterType === 'peso' && componentStyles.filterButtonActive
                            ]}
                            onPress={() => setFilterType('peso')}
                        >
                            <Text style={[
                                componentStyles.filterText,
                                filterType === 'peso' && componentStyles.filterTextActive
                            ]}>
                                ver por peso
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                componentStyles.filterButton,
                                filterType === 'cantidad' && componentStyles.filterButtonActive
                            ]}
                            onPress={() => setFilterType('cantidad')}
                        >
                            <Text style={[
                                componentStyles.filterText,
                                filterType === 'cantidad' && componentStyles.filterTextActive
                            ]}>
                                ver por cantidad
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={componentStyles.statsContainer}>
                        {impactData[filterType].map((item, index) => (
                            <StatItem
                                key={index}
                                icon={item.icon}
                                label={item.label}
                                value={item.value}
                                backgroundColor={item.backgroundColor}
                                iconColor={item.iconColor}
                            />
                        ))}
                    </View>
                </View>

                {/* Nube decorativa */}
                <Image
                    source={require('../../../assets/nube.png')}
                    style={componentStyles.nubeImage}
                    resizeMode="stretch"
                />

                {/* Programas Populares */}
                <View style={componentStyles.programsSection}>
                    <View style={componentStyles.programsHeader}>
                        <Text style={componentStyles.programsTitle}>Programas Populares</Text>
                        <Icon name="leaf" size={32} color="#7CD1AA" />
                    </View>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {programsData.map((program) => (
                            <ProgramCard
                                key={program.id}
                                image={program.image}
                                title={program.title}
                                badge={program.badge}
                                schedule={program.schedule}
                                location={program.location}
                                onPress={() => handleProgramPress(program)}
                            />
                        ))}
                    </ScrollView>
                </View>
            </ScrollView>

            {/* Bottom Navigation - Fijo */}
            <View style={componentStyles.bottomNav}>
                <NavItem icon="home" label="Inicio" active />
                <NavItem icon="recycle" label="Reciclar" />
                <NavItem icon="trophy" label="Premios" />
            </View>

            {/* Modal de detalle */}
            <ProgramDetailModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                program={selectedProgram}
            />

            {/* Drawer Menu */}
            <DrawerMenu
                visible={drawerVisible}
                onClose={() => setDrawerVisible(false)}
                userName="Juan David"
                userEmail="jdavidhuay@gmail.com"
                userPoints="100"
                avatarUrl="https://i.pravatar.cc/150?img=33"
            />
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
    },
    scrollContentContainer: {
        paddingBottom: 100,
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
        gap: 5,
    },
    filterButtonActive: {
        backgroundColor: '#00C7A1',
    },
    filterText: {
        color: '#000',
        fontSize: 13,
        fontWeight: '500',
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
        backgroundColor: '#31253B',
        paddingHorizontal: 20,
        paddingBottom: 20,
        paddingTop: 20,
    },
    programsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
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
});