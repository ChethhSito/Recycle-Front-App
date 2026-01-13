import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { EnvironmentalProgramCard } from '../../componentes/cards/programs/EnvironmentalProgramCard';
import { EnvironmentalProgramModal } from '../../componentes/modal/programs/EnvironmentalProgramModal';

export const EnvironmentalProgramsScreen = ({ navigation, onOpenDrawer, userAvatar }) => {
    const [selectedProgram, setSelectedProgram] = useState(null);
    const [filterType, setFilterType] = useState('ALL'); // 'ALL', 'ONG', 'NOS_PLANET', 'ESTADO'

    // Datos de ejemplo de programas ambientales
    const programsData = [
        {
            id: 1,
            title: 'Reforesta Perú',
            organization: 'Ministerio del Ambiente',
            organizationType: 'ESTADO',
            participants: 1250,
            location: 'Lima, Perú',
            duration: '6 meses',
            points: 150,
            image: require('../../../assets/program1.jpg'),
            description: 'Programa nacional de reforestación que busca recuperar áreas degradadas mediante la plantación de especies nativas. Cada participante contribuye directamente a la restauración de ecosistemas.',
            objectives: [
                'Plantar 50,000 árboles nativos en áreas deforestadas',
                'Capacitar a comunidades en técnicas de reforestación',
                'Monitorear el crecimiento y desarrollo de las plantaciones',
                'Crear conciencia sobre la importancia de los bosques'
            ],
            activities: [
                'Jornadas de plantación todos los sábados',
                'Talleres de educación ambiental',
                'Mantenimiento de áreas reforestadas',
                'Seguimiento fotográfico del progreso'
            ],
            contact: {
                email: 'reforesta@minam.gob.pe',
                phone: '+51 1 611 6000',
                website: 'www.minam.gob.pe/reforesta'
            }
        },
        {
            id: 2,
            title: 'Limpieza de Playas',
            organization: 'Nos Planet SAC',
            organizationType: 'NOS_PLANET',
            participants: 850,
            location: 'Costa Verde',
            duration: '3 meses',
            points: 100,
            image: require('../../../assets/program1.jpg'),
            description: 'Iniciativa de Nos Planet para mantener limpias las playas de Lima. Organizamos jornadas de limpieza donde retiramos plásticos y residuos que contaminan nuestro litoral.',
            objectives: [
                'Recolectar 5 toneladas de residuos plásticos',
                'Concientizar sobre la contaminación marina',
                'Promover el uso responsable de plásticos',
                'Crear una comunidad comprometida con el mar'
            ],
            activities: [
                'Limpieza de playas cada domingo',
                'Clasificación de residuos recolectados',
                'Charlas educativas sobre ecosistemas marinos',
                'Competencias de recolección por equipos'
            ],
            contact: {
                email: 'programas@nosplanet.pe',
                phone: '+51 999 888 777',
                website: 'www.nosplanet.pe/playas'
            }
        },
        {
            id: 3,
            title: 'Amazonía Verde',
            organization: 'WWF Perú',
            organizationType: 'ONG',
            participants: 2100,
            location: 'Madre de Dios',
            duration: '12 meses',
            points: 200,
            image: require('../../../assets/program1.jpg'),
            description: 'Programa de conservación de la biodiversidad amazónica. Trabajamos con comunidades locales para proteger especies en peligro y promover prácticas sostenibles.',
            objectives: [
                'Proteger 10,000 hectáreas de bosque amazónico',
                'Apoyar a 50 familias con proyectos sostenibles',
                'Monitorear especies en peligro de extinción',
                'Combatir la deforestación ilegal'
            ],
            activities: [
                'Patrullajes de vigilancia forestal',
                'Proyectos de agroforestería con comunidades',
                'Investigación de fauna silvestre',
                'Campañas contra la tala ilegal'
            ],
            contact: {
                email: 'contacto@wwf.org.pe',
                phone: '+51 1 440 5550',
                website: 'www.wwf.org.pe'
            }
        },
        {
            id: 4,
            title: 'Recicla Tu Ciudad',
            organization: 'Nos Planet SAC',
            organizationType: 'NOS_PLANET',
            participants: 3500,
            location: 'Lima Metropolitana',
            duration: 'Permanente',
            points: 80,
            image: require('../../../assets/program1.jpg'),
            description: 'Programa integral de reciclaje urbano que facilita la recolección selectiva de residuos en hogares y empresas. Transformamos residuos en recursos.',
            objectives: [
                'Reciclar 100 toneladas mensuales de residuos',
                'Instalar 200 puntos de acopio en la ciudad',
                'Capacitar a 1000 familias en separación de residuos',
                'Reducir la huella de carbono urbana'
            ],
            activities: [
                'Recolección domiciliaria programada',
                'Talleres de compostaje casero',
                'Ferias de reciclaje y educación',
                'App móvil para solicitar recolección'
            ],
            contact: {
                email: 'recicla@nosplanet.pe',
                phone: '+51 999 888 777',
                website: 'www.nosplanet.pe/recicla'
            }
        },
        {
            id: 5,
            title: 'Humedales Protegidos',
            organization: 'Sernanp',
            organizationType: 'ESTADO',
            participants: 620,
            location: 'Pantanos de Villa',
            duration: '8 meses',
            points: 120,
            image: require('../../../assets/program1.jpg'),
            description: 'Conservación y recuperación de humedales costeros. Protegemos estos ecosistemas vitales para aves migratorias y biodiversidad local.',
            objectives: [
                'Restaurar 50 hectáreas de humedales',
                'Proteger 80 especies de aves residentes',
                'Implementar sistemas de monitoreo',
                'Educar sobre importancia de humedales'
            ],
            activities: [
                'Limpieza y mantenimiento de zonas húmedas',
                'Observación de aves guiada',
                'Control de especies invasoras',
                'Investigación científica'
            ],
            contact: {
                email: 'contacto@sernanp.gob.pe',
                phone: '+51 1 717 7500',
                website: 'www.sernanp.gob.pe'
            }
        },
        {
            id: 6,
            title: 'Energía Limpia Rural',
            organization: 'Asociación Peruana de Energía Solar',
            organizationType: 'ONG',
            participants: 450,
            location: 'Cusco y Puno',
            duration: '10 meses',
            points: 180,
            image: require('../../../assets/program1.jpg'),
            description: 'Instalación de paneles solares en comunidades rurales sin acceso a electricidad. Llevamos energía limpia a familias que más lo necesitan.',
            objectives: [
                'Instalar paneles solares en 100 hogares',
                'Capacitar en mantenimiento de sistemas',
                'Reducir uso de combustibles fósiles',
                'Mejorar calidad de vida rural'
            ],
            activities: [
                'Instalación de sistemas fotovoltaicos',
                'Talleres técnicos de mantenimiento',
                'Seguimiento de consumo energético',
                'Promoción de cocinas solares'
            ],
            contact: {
                email: 'info@energiasolar.org.pe',
                phone: '+51 84 245 678',
                website: 'www.energiasolar.org.pe'
            }
        }
    ];

    const filteredPrograms = filterType === 'ALL'
        ? programsData
        : programsData.filter(p => p.organizationType === filterType);

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
                        <Text style={styles.headerSubtitle}>{filteredPrograms.length} programas activos</Text>
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
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {filteredPrograms.map((program) => (
                    <EnvironmentalProgramCard
                        key={program.id}
                        {...program}
                        onPress={() => handleProgramPress(program)}
                    />
                ))}
            </ScrollView>

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
