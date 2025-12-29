import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { PartnerHeader } from '../../componentes/cards/partners/PartnerHeader';
import { PartnerCard } from '../../componentes/cards/partners/PartnerCard';
import { ContactModal } from '../../componentes/modal/partners/ContactModal';
import { PartnerDetailModal } from '../../componentes/modal/partners/PartnerDetailModal';

export const PartnersScreen = ({ userAvatar, userName, onOpenDrawer }) => {
    const navigation = useNavigation();
    const [refreshing, setRefreshing] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [contactModalVisible, setContactModalVisible] = useState(false);
    const [selectedPartner, setSelectedPartner] = useState(null);
    const [detailModalVisible, setDetailModalVisible] = useState(false);

    // Filtros de tipo de partner
    const filters = [
        { id: 'all', label: 'Todos', icon: 'view-grid' },
        { id: 'financial', label: 'Financieros', icon: 'bank' },
        { id: 'government', label: 'Gobierno', icon: 'shield-account' },
        { id: 'ong', label: 'ONGs', icon: 'hand-heart' },
    ];

    // Datos de partners - NOS PLANÉT FIJADO Y PRIMERO
    const partnersData = [
        {
            id: 6,
            name: 'Nos Planét',
            type: 'corporate',
            typeLabel: 'Plataforma',
            icon: 'leaf',
            description: 'Beneficios exclusivos en la plataforma. Suscripciones y más.',
            fullDescription: 'Nos Planét es la plataforma líder en reciclaje y sostenibilidad en Perú. Conectamos ciudadanos, empresas y gobierno para crear un impacto ambiental positivo.',
            environmentalCommitment: 'Nuestra misión es democratizar el reciclaje y hacer que cada acción cuente. Trabajamos para crear una economía circular donde los residuos se conviertan en recursos.',
            contributions: [
                'Plataforma tecnológica sin costo para usuarios',
                'Sistema de gamificación para incentivar el reciclaje',
                'Educación ambiental continua',
                'Red de alianzas con partners comprometidos',
                'Reportes de impacto ambiental en tiempo real'
            ],
            impact: [
                { icon: 'account-group', value: '10K+', label: 'Usuarios activos' },
                { icon: 'recycle', value: '50 Ton', label: 'Material reciclado' },
                { icon: 'tree', value: '500+', label: 'Árboles plantados' },
                { icon: 'handshake', value: '6+', label: 'Partners activos' }
            ],
            rewardsCount: 1,
            usersCount: 5234,
            filterType: 'all',
            isPinned: true,
        },
        {
            id: 1,
            name: 'Yape',
            type: 'yape',
            typeLabel: 'Fintech',
            icon: 'cellphone',
            description: 'Beneficios en recargas y cashback directo. Canjea tus puntos por saldo.',
            fullDescription: 'Yape es la billetera digital más popular del Perú. Con más de 10 millones de usuarios, democratiza el acceso a servicios financieros digitales.',
            environmentalCommitment: 'Yape promueve una economía sin efectivo, reduciendo la huella de carbono asociada a la impresión y transporte de billetes. Apoyamos iniciativas que impulsen la sostenibilidad digital.',
            contributions: [
                'Cashback en recargas para usuarios de Nos Planét',
                'Transferencias directas sin comisión',
                'Campaña "Yape Verde" promoviendo el reciclaje',
                'Donación de S/ 1 por cada canje realizado a ONGs ambientales'
            ],
            impact: [
                { icon: 'account-check', value: '1.2K', label: 'Canjes realizados' },
                { icon: 'cash', value: 'S/ 8K', label: 'Transferido' },
                { icon: 'leaf', value: '1.2K', label: 'Árboles donados' },
                { icon: 'cellphone-check', value: '100%', label: 'Digital' }
            ],
            rewardsCount: 2,
            usersCount: 1245,
            filterType: 'financial',
        },
        {
            id: 2,
            name: 'BCP',
            type: 'bcp',
            typeLabel: 'Banco',
            icon: 'bank',
            description: 'Descuentos exclusivos en servicios bancarios y bonos de apertura.',
            fullDescription: 'Banco de Crédito del Perú, líder en servicios financieros con más de 130 años de historia. Comprometidos con el desarrollo sostenible del país.',
            environmentalCommitment: 'BCP ha implementado una estrategia de sostenibilidad que incluye financiamiento verde, reducción de huella de carbono y educación financiera con enfoque ambiental.',
            contributions: [
                'Cuentas de ahorro con beneficios para recicladores',
                'Financiamiento preferencial para proyectos verdes',
                'Programa de voluntariado corporativo en limpieza',
                'Reducción de papel mediante digitalización'
            ],
            impact: [
                { icon: 'bank', value: '850+', label: 'Cuentas abiertas' },
                { icon: 'currency-usd', value: 'S/ 15K', label: 'En beneficios' },
                { icon: 'file-document', value: '80%', label: 'Sin papel' },
                { icon: 'account-heart', value: '200', label: 'Voluntarios' }
            ],
            rewardsCount: 2,
            usersCount: 856,
            filterType: 'financial',
        },
        {
            id: 3,
            name: 'Municipalidad Local',
            type: 'government',
            typeLabel: 'Gobierno',
            icon: 'city',
            description: 'Acceso a talleres municipales y certificaciones ambientales oficiales.',
            fullDescription: 'Alianza con municipalidades locales para promover el reciclaje comunitario y la educación ambiental a nivel distrital.',
            environmentalCommitment: 'Compromiso con la implementación de políticas públicas de gestión de residuos, cumpliendo con la Ley General de Residuos Sólidos del Perú.',
            contributions: [
                'Talleres gratuitos de compostaje y reciclaje',
                'Certificaciones oficiales para recicladores',
                'Puntos de acopio municipales',
                'Campañas de sensibilización ambiental',
                'Reconocimiento público a ciudadanos destacados'
            ],
            impact: [
                { icon: 'school', value: '45', label: 'Talleres dictados' },
                { icon: 'certificate', value: '2.1K', label: 'Certificados' },
                { icon: 'map-marker', value: '12', label: 'Puntos acopio' },
                { icon: 'account-group', value: '3.5K', label: 'Participantes' }
            ],
            rewardsCount: 2,
            usersCount: 2134,
            filterType: 'government',
        },
        {
            id: 4,
            name: 'Reforesta Perú',
            type: 'ong',
            typeLabel: 'ONG Ambiental',
            icon: 'tree',
            description: 'Contribuye a la reforestación. Cada canje planta árboles nativos.',
            fullDescription: 'ONG dedicada a la reforestación de zonas degradadas en Perú, con más de 15 años de experiencia plantando especies nativas.',
            environmentalCommitment: 'Recuperar los ecosistemas degradados mediante la plantación de especies nativas, generando sumideros de carbono y protegiendo la biodiversidad.',
            contributions: [
                'Por cada canje, se planta 1 árbol nativo',
                'Certificado digital con ubicación GPS del árbol',
                'Reportes trimestrales de crecimiento',
                'Involucra a comunidades locales en el cuidado',
                'Educación sobre especies nativas'
            ],
            impact: [
                { icon: 'tree', value: '3.4K', label: 'Árboles plantados' },
                { icon: 'leaf', value: '850', label: 'Ton CO₂ capturado' },
                { icon: 'map', value: '8', label: 'Zonas recuperadas' },
                { icon: 'account-multiple', value: '15', label: 'Comunidades' }
            ],
            rewardsCount: 1,
            usersCount: 3421,
            filterType: 'ong',
        },
        {
            id: 5,
            name: 'Patitas Felices',
            type: 'ong',
            typeLabel: 'ONG Social',
            icon: 'paw',
            description: 'Ayuda a albergues de animales rescatados con tus canjes.',
            fullDescription: 'ONG dedicada al rescate, rehabilitación y adopción de perros y gatos en situación de calle. Gestionamos 3 albergues en Lima.',
            environmentalCommitment: 'Promovemos la tenencia responsable y el concepto de economía circular: los residuos reciclables se convierten en alimento para animales rescatados.',
            contributions: [
                'Conversión de puntos en alimento para mascotas',
                'Campañas de adopción responsable',
                'Educación sobre tenencia responsable',
                'Uso de materiales reciclados en albergues',
                'Esterilización gratuita mediante fondos de reciclaje'
            ],
            impact: [
                { icon: 'paw', value: '450', label: 'Animales rescatados' },
                { icon: 'food', value: '2 Ton', label: 'Alimento donado' },
                { icon: 'home-heart', value: '180', label: 'Adopciones' },
                { icon: 'medical-bag', value: '250', label: 'Esterilizaciones' }
            ],
            rewardsCount: 1,
            usersCount: 1876,
            filterType: 'ong',
        },
    ];

    // Filtrar partners
    const filteredPartners = selectedFilter === 'all'
        ? partnersData
        : partnersData.filter(partner => partner.filterType === selectedFilter);

    const onRefresh = async () => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 1500);
    };

    const handlePartnerPress = (partner) => {
        setSelectedPartner(partner);
        setDetailModalVisible(true);
    };

    const handleViewRewards = () => {
        if (selectedPartner) {
            navigation.navigate('Rewards', { 
                partnerId: selectedPartner.id, 
                partnerName: selectedPartner.name 
            });
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#018f64']} />
                }
            >
                {/* Header */}
                <PartnerHeader
                    userName={userName}
                    avatarUrl={userAvatar || 'https://i.pravatar.cc/150?img=33'}
                    onMenuPress={onOpenDrawer}
                />

                {/* Filtros */}
                <View style={styles.filtersSection}>
                    <Text style={styles.filtersTitle}>Filtrar por tipo</Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.filtersContainer}
                    >
                        {filters.map((filter) => (
                            <TouchableOpacity
                                key={filter.id}
                                style={[
                                    styles.filterButton,
                                    selectedFilter === filter.id && styles.filterButtonActive
                                ]}
                                onPress={() => setSelectedFilter(filter.id)}
                            >
                                <Icon
                                    name={filter.icon}
                                    size={20}
                                    color={selectedFilter === filter.id ? '#FFF' : '#018f64'}
                                />
                                <Text style={[
                                    styles.filterText,
                                    selectedFilter === filter.id && styles.filterTextActive
                                ]}>
                                    {filter.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Lista de Partners */}
                <View style={styles.partnersGrid}>
                    {filteredPartners.map((partner) => (
                        <PartnerCard
                            key={partner.id}
                            partner={partner}
                            onPress={() => handlePartnerPress(partner)}
                        />
                    ))}
                </View>

                {filteredPartners.length === 0 && (
                    <View style={styles.emptyState}>
                        <Icon name="briefcase-off" size={64} color="#CCC" />
                        <Text style={styles.emptyStateText}>
                            No hay convenios en esta categoría
                        </Text>
                    </View>
                )}

                {/* Sección de información */}
                <View style={styles.infoSection}>
                    <View style={styles.infoBox}>
                        <Icon name="information" size={24} color="#018f64" />
                        <Text style={styles.infoText}>
                            ¿Eres una empresa u organización interesada en formar parte de nuestros convenios?
                        </Text>
                    </View>
                    <TouchableOpacity 
                        style={styles.contactButton}
                        onPress={() => setContactModalVisible(true)}
                    >
                        <Icon name="email" size={20} color="#FFF" />
                        <Text style={styles.contactButtonText}>Contáctanos</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.bottomSpacing} />
            </ScrollView>

            {/* Modales */}
            <ContactModal
                visible={contactModalVisible}
                onClose={() => setContactModalVisible(false)}
            />

            <PartnerDetailModal
                visible={detailModalVisible}
                partner={selectedPartner}
                onClose={() => setDetailModalVisible(false)}
                onViewRewards={handleViewRewards}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    filtersSection: {
        backgroundColor: '#FFF',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    filtersTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: '#666',
        marginBottom: 12,
    },
    filtersContainer: {
        gap: 10,
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: '#E8F5F1',
        borderWidth: 1,
        borderColor: '#018f64',
        gap: 6,
    },
    filterButtonActive: {
        backgroundColor: '#018f64',
        borderColor: '#018f64',
    },
    filterText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#018f64',
    },
    filterTextActive: {
        color: '#FFF',
    },
    partnersGrid: {
        paddingTop: 16,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyStateText: {
        fontSize: 16,
        color: '#999',
        marginTop: 16,
    },
    infoSection: {
        backgroundColor: '#FFF',
        marginHorizontal: 16,
        marginTop: 16,
        borderRadius: 16,
        padding: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    infoBox: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 16,
        gap: 12,
    },
    infoText: {
        flex: 1,
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    contactButton: {
        backgroundColor: '#018f64',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 12,
        gap: 8,
    },
    contactButtonText: {
        color: '#FFF',
        fontSize: 15,
        fontWeight: 'bold',
    },
    bottomSpacing: {
        height: 20,
    },
});
