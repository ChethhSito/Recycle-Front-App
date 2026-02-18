import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { Svg, Path } from 'react-native-svg';
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
    }, []);

    const safePrograms = Array.isArray(programs) ? programs : [];
    const { width } = Dimensions.get('window');
    const CLOUD_HEIGHT = 100;

    const filteredPrograms = filterType === 'ALL'
        ? safePrograms
        : safePrograms.filter(p => p.organizationType === filterType);

    const [modalVisible, setModalVisible] = useState(false);

    return (
        <View style={styles.container}>
            {/* Header */}
            <LinearGradient
                colors={['#018f64', '#018f64']}
                style={styles.header}
            >
                <View style={styles.headerContent}>
                    <TouchableOpacity onPress={onOpenDrawer} style={styles.menuButton}>
                        <Icon name="menu" size={28} color="#000" />
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
            <View style={styles.svgContainer}>
                <Svg
                    width={width}
                    height={40} // Altura mucho menor (antes era gigante)
                    viewBox="0 0 1440 320"
                    preserveAspectRatio="none"
                >
                    <Path
                        fill="#018f64" // El mismo color de tu Header
                        // Esta ruta dibuja una curva suave en la parte inferior
                        d="M0,0 L1440,0 L1440,160 Q720,320 0,160 Z"
                    />
                </Svg>
            </View>

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
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#018f64" />
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
                        <ScrollView
                            style={styles.scrollView}
                            contentContainerStyle={styles.scrollContent}
                            showsVerticalScrollIndicator={false}
                        >
                            {filteredPrograms.map((program) => (
                                <EnvironmentalProgramCard
                                    key={program._id} // 👈 OJO: MongoDB usa _id, no id
                                    {...program}
                                    // 5. Adaptar la imagen: Si viene URL, úsala. Si no, usa placeholder.
                                    image={
                                        { uri: program.imageUrl }
                                    }

                                    containerStyle={{
                                        width: '100%',
                                        marginRight: 0,
                                        marginBottom: 20
                                    }}
                                    onPress={() => {
                                        const programForModal = {
                                            ...program,
                                            contactInfo: program.contactInfo
                                                ? `${program.contactInfo.email || ''}\n${program.contactInfo.phone || ''}`
                                                : 'Sin contacto',

                                            // 🚨 Pasamos la imagen YA RESUELTA (objeto o número de recurso)
                                            // Esto evita que el Modal tenga que hacer require() y fallar
                                            image: (program.imageUrl && program.imageUrl.startsWith('http'))
                                                ? { uri: program.imageUrl }
                                                : defaultImage
                                        };

                                        setSelectedProgram(programForModal);
                                        setModalVisible(true);
                                    }}
                                />
                            ))
                            }
                            <View style={{ height: 20 }} />
                        </ScrollView>
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

    svgContainer: {
        marginTop: -1,
    },
    container: {
        flex: 1,
        backgroundColor: '#b1eedc',
    },
    header: {
        paddingTop: 80,
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

        color: '#000',
    },
    headerSubtitle: {
        fontSize: 13,
        color: '#000',
        opacity: 0.9,
        marginTop: 2,
    },
    filtersContainer: {
        marginTop: 10, // Sube los filtros para que toquen el header
        paddingBottom: 0,
        // Quita el background color o ponlo transparente si quieres que floten
        backgroundColor: 'transparent',
        // borderBottomWidth: 0, // Quita la línea si prefieres limpieza
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
        padding: 20, // Un poco más de padding general se ve mejor
        paddingBottom: 40,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
