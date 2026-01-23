import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { EnvironmentalProgramCard } from '../../componentes/cards/programs/EnvironmentalProgramCard';
import { EnvironmentalProgramModal } from '../../componentes/modal/programs/EnvironmentalProgramModal';
import { useProgramStore } from '../../hooks/use-program-store';
import { ActivityIndicator } from 'react-native-paper';

export const EnvironmentalProgramsScreen = ({ navigation, onOpenDrawer, userAvatar }) => {
    const [selectedProgram, setSelectedProgram] = useState(null);
    const [filterType, setFilterType] = useState('ALL'); // 'ALL', 'ONG', 'NOS_PLANET', 'ESTADO'
    const { programs, isLoading, startLoadingPrograms } = useProgramStore();

    useEffect(() => {
        startLoadingPrograms();
        console.log(programs);
    }, []);

    const safePrograms = Array.isArray(programs) ? programs : [];

    const filteredPrograms = filterType === 'ALL'
        ? safePrograms
        : safePrograms.filter(p => p.organizationType === filterType);

    const handleProgramPress = (program) => {
        setSelectedProgram(program);
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <LinearGradient
                colors={['#018f64', '#018f64']}
                style={styles.header}
            >
                <View style={styles.headerContent}>
                    <TouchableOpacity onPress={onOpenDrawer} style={styles.menuButton}>
                        <Icon name="menu" size={28} color="#ffffffff" />
                    </TouchableOpacity>

                    <View style={styles.headerTextContainer}>
                        <Text style={styles.headerTitle}>Programas Ambientales</Text>
                        <Text style={styles.headerSubtitle}>
                            {/* Mostramos la cantidad real */}
                            {isLoading ? 'Cargando...' : `${filteredPrograms.length} programas activos`}
                        </Text>
                    </View>

                    <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                        <Image
                            source={{ uri: userAvatar }}
                            style={styles.avatar}
                        />
                    </TouchableOpacity>
                </View>
            </LinearGradient>

            {/* Filtros */}
            <View style={styles.filtersContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersScroll}>
                    {/* ... Tus botones de filtro siguen IGUAL ... */}
                    <TouchableOpacity
                        style={[styles.filterChip, filterType === 'ALL' && styles.filterChipActive]}
                        onPress={() => setFilterType('ALL')}
                    >
                        <Text style={[styles.filterText, filterType === 'ALL' && styles.filterTextActive]}>
                            Todos
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.filterChip, filterType === 'NOS_PLANET' && styles.filterChipActive]}
                        onPress={() => setFilterType('NOS_PLANET')}
                    >
                        <View style={[styles.filterDot, { backgroundColor: '#018f64' }]} />
                        <Text style={[styles.filterText, filterType === 'NOS_PLANET' && styles.filterTextActive]}>
                            Nos Planet
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.filterChip, filterType === 'ONG' && styles.filterChipActive]}
                        onPress={() => setFilterType('ONG')}
                    >
                        <View style={[styles.filterDot, { backgroundColor: '#FF6B6B' }]} />
                        <Text style={[styles.filterText, filterType === 'ONG' && styles.filterTextActive]}>
                            ONGs
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.filterChip, filterType === 'ESTADO' && styles.filterChipActive]}
                        onPress={() => setFilterType('ESTADO')}
                    >
                        <View style={[styles.filterDot, { backgroundColor: '#4A90E2' }]} />
                        <Text style={[styles.filterText, filterType === 'ESTADO' && styles.filterTextActive]}>
                            Estado
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>

            {/* Lista de programas */}
            {isLoading ? (
                // 4. Mostrar Spinner mientras carga
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#018f64" />
                    <Text style={{ marginTop: 10, color: '#666' }}>Buscando iniciativas...</Text>
                </View>
            ) : (
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {filteredPrograms.length === 0 ? (
                        <View style={{ padding: 20, alignItems: 'center' }}>
                            <Text style={{ color: '#666' }}>No se encontraron programas en esta categoría.</Text>
                        </View>
                    ) : (
                        filteredPrograms.map((program) => (
                            <EnvironmentalProgramCard
                                key={program._id} // 👈 OJO: MongoDB usa _id, no id
                                {...program}
                                // 5. Adaptar la imagen: Si viene URL, úsala. Si no, usa placeholder.
                                image={
                                    program.imageUrl
                                        ? { uri: program.imageUrl }
                                        : require('../../../assets/program1.jpg') // Tu imagen por defecto
                                }
                                onPress={() => handleProgramPress(program)}
                            />
                        ))
                    )}
                </ScrollView>
            )}

            {/* Modal de detalles */}
            <EnvironmentalProgramModal
                visible={selectedProgram !== null}
                onClose={() => setSelectedProgram(null)}
                program={selectedProgram}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#b1eedc',
    },
    header: {
        paddingTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 20,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    menuButton: {
        padding: 4,
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

        color: '#ffffffff',
    },
    headerSubtitle: {
        fontSize: 13,
        color: '#cfcfcfff',
        opacity: 0.9,
        marginTop: 2,
    },
    filtersContainer: {
        backgroundColor: '#b1eedc',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#018f64',
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
        backgroundColor: '#f0f0f0',
        marginRight: 10,
    },
    filterChipActive: {
        backgroundColor: '#018f64',
    },
    filterDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
    filterText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    filterTextActive: {
        color: '#fff',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
    },
});
