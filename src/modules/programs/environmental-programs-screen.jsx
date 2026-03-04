import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, StatusBar } from 'react-native';
import { Text, useTheme, ActivityIndicator } from 'react-native-paper'; // 🚀 Paper para componentes y temas
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { Svg, Path } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { EnvironmentalProgramCard } from '../../componentes/cards/programs/EnvironmentalProgramCard';
import { EnvironmentalProgramModal } from '../../componentes/modal/programs/EnvironmentalProgramModal';
import { useProgramStore } from '../../hooks/use-program-store';
import { useAuthStore } from '../../hooks/use-auth-store';

export const EnvironmentalProgramsScreen = ({ navigation, onOpenDrawer }) => {
    const theme = useTheme(); // 🎨 Obtenemos el tema dinámico
    const { colors, dark } = theme;
    const componentStyles = getStyles(theme);

    const { user } = useAuthStore(); // 👤 Obtenemos datos del usuario centralizados
    const [selectedProgram, setSelectedProgram] = useState(null);
    const [filterType, setFilterType] = useState('ALL');
    const { programs, isLoading, startLoadingPrograms } = useProgramStore();

    useEffect(() => {
        startLoadingPrograms();
    }, []);

    const safePrograms = Array.isArray(programs) ? programs : [];
    const { width } = Dimensions.get('window');

    const filteredPrograms = filterType === 'ALL'
        ? safePrograms
        : safePrograms.filter(p => p.organizationType === filterType);

    return (
        <View style={componentStyles.container}>
            {/* Sincronización de la barra de estado */}
            <StatusBar
                barStyle="light-content"
                backgroundColor={colors.background}
            />

            {/* Header con Identidad Verde */}
            <LinearGradient
                colors={[colors.greenMain, colors.greenMain]}
                style={componentStyles.header}
            >
                <View style={componentStyles.headerContent}>
                    <TouchableOpacity onPress={onOpenDrawer} style={componentStyles.menuButton}>
                        <Icon name="menu" size={28} color="#FFF" />
                    </TouchableOpacity>

                    <View style={componentStyles.headerTextContainer}>
                        <Text style={componentStyles.headerTitle}>Programas Ambientales</Text>
                        <Text style={componentStyles.headerSubtitle}>
                            {isLoading ? 'Cargando...' : `${filteredPrograms.length} programas activos`}
                        </Text>
                    </View>

                    <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                        <Image
                            source={{ uri: user.avatar }}
                            style={componentStyles.avatar}
                        />
                    </TouchableOpacity>
                </View>
            </LinearGradient>

            {/* Curva SVG Dinámica */}
            <View style={componentStyles.svgContainer}>
                <Svg
                    width={width}
                    height={40}
                    viewBox="0 0 1440 320"
                    preserveAspectRatio="none"
                >
                    <Path
                        fill={colors.greenMain} // ♻️ Color primario del tema
                        d="M0,0 L1440,0 L1440,160 Q720,320 0,160 Z"
                    />
                </Svg>
            </View>

            {/* Filtros Horizontales */}
            <View style={componentStyles.filtersContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={componentStyles.filtersScroll}>
                    <TouchableOpacity
                        style={[componentStyles.filterChip, filterType === 'ALL' && componentStyles.filterChipActive]}
                        onPress={() => setFilterType('ALL')}
                    >
                        <Text style={[componentStyles.filterText, { color: filterType === 'ALL' ? '#FFF' : colors.onSurfaceVariant }]}>
                            Todos
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[componentStyles.filterChip, filterType === 'NOS_PLANET' && componentStyles.filterChipActive]}
                        onPress={() => setFilterType('NOS_PLANET')}
                    >
                        <View style={[componentStyles.filterDot, { backgroundColor: colors.primary }]} />
                        <Text style={[componentStyles.filterText, { color: filterType === 'NOS_PLANET' ? '#FFF' : colors.onSurfaceVariant }]}>
                            Nos Planet
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[componentStyles.filterChip, filterType === 'ONG' && componentStyles.filterChipActive]}
                        onPress={() => setFilterType('ONG')}
                    >
                        <View style={[componentStyles.filterDot, { backgroundColor: '#FF6B6B' }]} />
                        <Text style={[componentStyles.filterText, { color: filterType === 'ONG' ? '#FFF' : colors.onSurfaceVariant }]}>
                            ONGs
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[componentStyles.filterChip, filterType === 'ESTADO' && componentStyles.filterChipActive]}
                        onPress={() => setFilterType('ESTADO')}
                    >
                        <View style={[componentStyles.filterDot, { backgroundColor: '#4A90E2' }]} />
                        <Text style={[componentStyles.filterText, { color: filterType === 'ESTADO' ? '#FFF' : colors.onSurfaceVariant }]}>
                            Estado
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>

            {/* Lista de Programas */}
            {isLoading ? (
                <View style={componentStyles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : (
                <ScrollView
                    style={componentStyles.scrollView}
                    contentContainerStyle={componentStyles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {filteredPrograms.length === 0 ? (
                        <View style={{ padding: 20, alignItems: 'center' }}>
                            <Text style={{ color: colors.onSurfaceVariant }}>No se encontraron programas en esta categoría.</Text>
                        </View>
                    ) : (
                        filteredPrograms.map((program) => (
                            <EnvironmentalProgramCard
                                key={program._id}
                                {...program}
                                image={{ uri: program.imageUrl }}
                                theme={theme} // 🚨 Pasamos el tema a la tarjeta
                                containerStyle={{
                                    width: '100%',
                                    marginBottom: 20
                                }}
                                onPress={() => {
                                    const programForModal = {
                                        ...program,
                                        contactInfo: program.contactInfo
                                            ? `${program.contactInfo.email || ''}\n${program.contactInfo.phone || ''}`
                                            : 'Sin contacto',
                                        image: { uri: program.imageUrl }
                                    };
                                    setSelectedProgram(programForModal);
                                }}
                            />
                        ))
                    )}
                </ScrollView>
            )}

            {/* Modal de detalles dinámico */}
            <EnvironmentalProgramModal
                visible={selectedProgram !== null}
                onClose={() => setSelectedProgram(null)}
                program={selectedProgram}
                theme={theme}
            />
        </View>
    );
};

// 🎨 ESTILOS DINÁMICOS BASADOS EN EL TEMA
const getStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 20,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#fff',
    },
    headerTextContainer: {
        flex: 1,
        marginLeft: 15,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFF', // Texto blanco sobre el header verde siempre
    },
    headerSubtitle: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 2,
    },
    svgContainer: {
        marginTop: -1,
    },
    filtersContainer: {
        marginTop: 10,
        backgroundColor: 'transparent',
    },
    filtersScroll: {
        paddingHorizontal: 20,
    },
    filterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: theme.colors.mainG, // Cambia según el modo
        marginRight: 10,
        borderWidth: 1,
        borderColor: theme.colors.outlineVariant,
    },
    filterChipActive: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    filterDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
    filterText: {
        fontSize: 14,
        fontWeight: '600',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});