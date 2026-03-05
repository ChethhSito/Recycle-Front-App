import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, StatusBar } from 'react-native';
import { Text, useTheme, ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { Svg, Path } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { EnvironmentalProgramCard } from '../../componentes/cards/programs/EnvironmentalProgramCard';
import { EnvironmentalProgramModal } from '../../componentes/modal/programs/EnvironmentalProgramModal';
import { useProgramStore } from '../../hooks/use-program-store';
import { useAuthStore } from '../../hooks/use-auth-store';
import { useTranslation } from '../../hooks/use-translation'; // 🗣️ Hook de traducción

export const EnvironmentalProgramsScreen = ({ navigation, onOpenDrawer }) => {
    const t = useTranslation(); // 🗣️ Inicializar traducciones
    const theme = useTheme();
    const { colors, dark } = theme;
    const componentStyles = getStyles(theme);

    const { user } = useAuthStore();
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
            <StatusBar
                barStyle="light-content"
                backgroundColor={colors.greenMain}
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
                        <Text style={componentStyles.headerTitle}>{t.programs.title}</Text>
                        <Text style={componentStyles.headerSubtitle}>
                            {isLoading
                                ? t.programs.loading
                                : t.programs.activeCount.replace('{{count}}', filteredPrograms.length)}
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
                <Svg width={width} height={40} viewBox="0 0 1440 320" preserveAspectRatio="none">
                    <Path
                        fill={colors.greenMain}
                        d="M0,0 L1440,0 L1440,160 Q720,320 0,160 Z"
                    />
                </Svg>
            </View>

            {/* Filtros Horizontales Traducidos */}
            <View style={componentStyles.filtersContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={componentStyles.filtersScroll}>
                    <FilterChip
                        label={t.programs.filters.all}
                        active={filterType === 'ALL'}
                        onPress={() => setFilterType('ALL')}
                        theme={theme}
                    />
                    <FilterChip
                        label={t.programs.filters.nosPlanet}
                        active={filterType === 'NOS_PLANET'}
                        onPress={() => setFilterType('NOS_PLANET')}
                        theme={theme}
                        dotColor={colors.primary}
                    />
                    <FilterChip
                        label={t.programs.filters.ongs}
                        active={filterType === 'ONG'}
                        onPress={() => setFilterType('ONG')}
                        theme={theme}
                        dotColor="#FF6B6B"
                    />
                    <FilterChip
                        label={t.programs.filters.state}
                        active={filterType === 'ESTADO'}
                        onPress={() => setFilterType('ESTADO')}
                        theme={theme}
                        dotColor="#4A90E2"
                    />
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
                        <View style={styles.emptyContainer}>
                            <Icon name="leaf-off" size={48} color={colors.outline} />
                            <Text style={[styles.emptyText, { color: colors.onSurfaceVariant }]}>
                                {t.programs.empty}
                            </Text>
                        </View>
                    ) : (
                        filteredPrograms.map((program) => (
                            <EnvironmentalProgramCard
                                key={program._id}
                                {...program}
                                image={{ uri: program.imageUrl }}
                                theme={theme}
                                containerStyle={styles.cardMargin}
                                onPress={() => {
                                    const programForModal = {
                                        ...program,
                                        contactInfo: program.contactInfo
                                            ? `${program.contactInfo.email || ''}\n${program.contactInfo.phone || ''}`
                                            : t.programs.noContact,
                                        image: { uri: program.imageUrl }
                                    };
                                    setSelectedProgram(programForModal);
                                }}
                            />
                        ))
                    )}
                </ScrollView>
            )}

            <EnvironmentalProgramModal
                visible={selectedProgram !== null}
                onClose={() => setSelectedProgram(null)}
                program={selectedProgram}
                theme={theme}
            />
        </View>
    );
};

const FilterChip = ({ label, active, onPress, theme, dotColor }) => (
    <TouchableOpacity
        style={[
            styles.filterChip,
            { backgroundColor: active ? theme.colors.primary : theme.colors.surface },
            { borderColor: theme.colors.outlineVariant },
            active && { elevation: 4 }
        ]}
        onPress={onPress}
    >
        {dotColor && !active && <View style={[styles.filterDot, { backgroundColor: dotColor }]} />}
        <Text style={[
            styles.filterText,
            { color: active ? '#FFF' : theme.colors.onSurfaceVariant }
        ]}>
            {label}
        </Text>
    </TouchableOpacity>
);

const getStyles = (theme) => StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: { paddingTop: 60, paddingBottom: 20, paddingHorizontal: 20 },
    headerContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    avatar: { width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: '#fff' },
    headerTextContainer: { flex: 1, marginLeft: 15 },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFF' },
    headerSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
    svgContainer: { marginTop: -1 },
    filtersContainer: { marginTop: 10, backgroundColor: 'transparent' },
    filtersScroll: { paddingHorizontal: 20 },
    scrollView: { flex: 1 },
    scrollContent: { padding: 20, paddingBottom: 40 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});

const styles = StyleSheet.create({
    filterChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 10, borderWidth: 1 },
    filterDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
    filterText: { fontSize: 14, fontWeight: '600' },
    cardMargin: { width: '100%', marginBottom: 20 },
    emptyContainer: { padding: 40, alignItems: 'center', gap: 10 },
    emptyText: { textAlign: 'center', fontSize: 14 }
});