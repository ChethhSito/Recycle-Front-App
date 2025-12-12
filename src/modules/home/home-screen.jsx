import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { 
    UserHeader, 
    QuoteCard, 
    ProgressCard, 
    StatItem, 
    ProgramCard 
} from '../../componentes/cards/home';
import { NavItem } from '../../componentes/navigation/NavItem';

export const HomeScreen = () => {
    const theme = useTheme();
    const componentStyles = styles(theme);
    const [filterType, setFilterType] = useState('peso'); // 'peso' o 'cantidad'

    // Datos según el tipo de filtro
    const impactData = {
        peso: [
            { icon: 'bottle-soda', label: 'Plástico', value: '5.2 kg' },
            { icon: 'package-variant', label: 'Cartón', value: '3.8 kg' },
            { icon: 'silverware-fork-knife', label: 'Metal', value: '2.1 kg' },
            { icon: 'trash-can', label: 'RAEE', value: '1.5 kg' },
        ],
        cantidad: [
            { icon: 'bottle-soda', label: 'Plástico', value: '100 unidades' },
            { icon: 'package-variant', label: 'Cartón', value: '10 unidades' },
            { icon: 'silverware-fork-knife', label: 'Metal', value: '5 unidades' },
            { icon: 'trash-can', label: 'RAEE', value: '1 unidad' },
        ]
    };

    const toggleFilter = () => {
        setFilterType(prev => prev === 'peso' ? 'cantidad' : 'peso');
    };
    
    return (
        <View style={componentStyles.container}>
            <ScrollView 
                style={componentStyles.scrollContent}
                contentContainerStyle={componentStyles.scrollContentContainer}
            >
                {/* Header con usuario */}
                <UserHeader 
                    userName="Juan David"
                    userType="Ciudadano"
                    quote="El mejor momento para plantar un árbol fue hace 20 años. El segundo mejor momento es ahora."
                    onMenuPress={() => console.log('Menu pressed')}
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
                    <Text style={[componentStyles.sectionTitle, { color: '#31253B', marginTop: 0 }]}>Programas Populares:</Text>
                    
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <ProgramCard 
                            image={require('../../../assets/program1.jpg')}
                            title="Horarios del recojo de basura"
                        />
                        <ProgramCard 
                            image={require('../../../assets/program2.jpg')}
                            title="Reciclaje Comunitario"
                        />
                    </ScrollView>
                </View>
            </ScrollView>

            {/* Bottom Navigation - Fijo */}
            <View style={componentStyles.bottomNav}>
                <NavItem icon="home" label="Inicio" active />
                <NavItem icon="recycle" label="Reciclar" />
                <NavItem icon="trophy" label="Premios" />
            </View>
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
        backgroundColor: '#B7ECDC',
        paddingHorizontal: 20,
        paddingBottom: 20,
        paddingTop: 0,
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
        paddingVertical: 15,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
});