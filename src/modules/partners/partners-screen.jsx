import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { PartnerHeader } from '../../componentes/cards/partners/PartnerHeader';
import { PartnerCard } from '../../componentes/cards/partners/PartnerCard';
import { ContactModal } from '../../componentes/modal/partners/ContactModal';
import { PartnerDetailModal } from '../../componentes/modal/partners/PartnerDetailModal';
import { usePartners } from '../../hooks/use-partners-store';

const { width } = Dimensions.get('window');

export const PartnersScreen = ({ userAvatar, userName, onOpenDrawer }) => {
    const navigation = useNavigation();
    const [refreshing, setRefreshing] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [contactModalVisible, setContactModalVisible] = useState(false);
    const [selectedPartner, setSelectedPartner] = useState(null);
    const [detailModalVisible, setDetailModalVisible] = useState(false);

    const { partners, loading, refetch } = usePartners();

    const filters = [
        { id: 'all', label: 'Todos', icon: 'view-grid-outline' },
        { id: 'financial', label: 'Financieros', icon: 'bank-outline' },
        { id: 'government', label: 'Gobierno', icon: 'shield-account-outline' },
        { id: 'ong', label: 'ONGs', icon: 'hand-heart-outline' },
        { id: 'corporate', label: 'Corporativos', icon: 'domain' },
    ];

    useFocusEffect(
        useCallback(() => {
            refetch();
        }, [refetch])
    );

    const onRefresh = async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    };

    const fixPartnerLogo = (url) => {
        if (!url) return null;
        if (url.startsWith('http://') || url.startsWith('https://')) return url;
        return `https://${url}`;
    };

    const filteredPartners = selectedFilter === 'all'
        ? partners
        : partners.filter(partner => partner.filterType === selectedFilter);

    const handlePartnerPress = (partner) => {
        const fixedPartner = { ...partner, logo: fixPartnerLogo(partner.logo) };
        setSelectedPartner(fixedPartner);
        setDetailModalVisible(true);
    };

    const handleViewRewards = () => {
        if (selectedPartner) {
            navigation.navigate('Rewards', {
                partnerId: selectedPartner._id,
                partnerName: selectedPartner.name
            });
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#018f64']} />}
                contentContainerStyle={{ paddingBottom: 40 }}
            >
                {/* Header */}
                <PartnerHeader
                    userName={userName}
                    avatarUrl={userAvatar || 'https://i.pravatar.cc/150?img=33'}
                    onMenuPress={onOpenDrawer}
                />

                {/* --- NUEVA SECCIÓN DE FILTROS --- */}
                <View style={styles.filtersContainer}>
                    <Text style={styles.sectionTitle}>Categorías</Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.filtersScroll}
                    >
                        {filters.map((filter) => {
                            const isActive = selectedFilter === filter.id;
                            return (
                                <TouchableOpacity
                                    key={filter.id}
                                    style={[styles.filterChip, isActive && styles.filterChipActive]}
                                    onPress={() => setSelectedFilter(filter.id)}
                                    activeOpacity={0.8}
                                >
                                    <Icon
                                        name={filter.icon}
                                        size={18}
                                        color={isActive ? '#FFF' : '#555'}
                                    />
                                    <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
                                        {filter.label}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>

                {/* Loading o Lista */}
                {loading && !refreshing ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#018f64" />
                        <Text style={styles.loadingText}>Buscando aliados...</Text>
                    </View>
                ) : (
                    <>
                        <View style={styles.partnersList}>
                            {filteredPartners.map((partner) => {
                                // Corrección del logo
                                const partnerFixed = {
                                    ...partner,
                                    logo: fixPartnerLogo(partner.logo)
                                };

                                return (
                                    <View key={partner._id || partner.id} style={styles.cardWrapper}>
                                        <PartnerCard
                                            partner={partnerFixed}
                                            onPress={() => handlePartnerPress(partnerFixed)}
                                        />
                                    </View>
                                );
                            })}
                        </View>

                        {filteredPartners.length === 0 && (
                            <View style={styles.emptyState}>
                                <Icon name="folder-search-outline" size={60} color="#b0d6cc" />
                                <Text style={styles.emptyStateText}>
                                    No hay convenios en esta categoría
                                </Text>
                            </View>
                        )}
                    </>
                )}

                {/* Banner de Información */}
                <View style={styles.infoSection}>
                    <View style={styles.infoContent}>
                        <Icon name="handshake" size={32} color="#FFF" />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.infoTitle}>¿Quieres ser un aliado?</Text>
                            <Text style={styles.infoText}>
                                Únete a nuestra red de empresas sostenibles.
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        style={styles.contactButton}
                        onPress={() => setContactModalVisible(true)}
                    >
                        <Text style={styles.contactButtonText}>Contactar</Text>
                        <Icon name="arrow-right" size={16} color="#FFF" />
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <ContactModal visible={contactModalVisible} onClose={() => setContactModalVisible(false)} />
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
        backgroundColor: '#b1eedc', // Fondo general más limpio (gris muy claro)
    },
    // --- ESTILOS DE FILTROS ---
    filtersContainer: {
        marginTop: 15,
        marginBottom: 5,
        backgroundColor: '#b1eedc',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2937',
        marginLeft: 20,
        marginBottom: 10,
    },
    filtersScroll: {
        paddingHorizontal: 20,
        paddingBottom: 10, // Espacio para la sombra
        gap: 10,
    },

    partnersList: {
        paddingHorizontal: 20, // Margen lateral general para la lista
        paddingTop: 10,
        paddingBottom: 20,
    },

    cardWrapper: {
        width: '100%', // Ocupa todo el ancho disponible
        marginBottom: 20, // Espacio vertical entre tarjetas
        // Ya no necesitamos paddings raros ni widths al 50%
    },
    filterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 25,
        backgroundColor: '#FFFFFF', // Inactivo: Fondo blanco
        gap: 6,
        // Sombra suave para que floten
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    filterChipActive: {
        backgroundColor: '#018f64', // Activo: Verde
        elevation: 4,
        shadowOpacity: 0.2,
    },
    filterText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#555', // Inactivo: Texto gris
    },
    filterTextActive: {
        color: '#FFF', // Activo: Texto blanco
    },

    // --- ESTILOS DEL GRID ---
    partnersGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 12, // Reducimos el padding lateral (antes era 20 o más)
        justifyContent: 'space-between', // Empuja las tarjetas a los extremos
    },
    gridItem: {
        width: '48%', // Ocupa casi la mitad exacta (-2% para el hueco del medio)
        marginBottom: 16, // Espacio vertical
        // Eliminamos padding interno aquí para que la card crezca
    },

    // --- ESTILOS DE CARGA Y VACÍO ---
    loadingContainer: {
        padding: 50,
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        color: '#018f64',
        fontWeight: '500',
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyStateText: {
        fontSize: 15,
        color: '#888',
        marginTop: 10,
    },

    // --- ESTILOS DEL INFO BANNER ---
    infoSection: {
        backgroundColor: '#018f64', // Verde muy pálido
        marginHorizontal: 20,
        marginTop: 20,
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(1, 143, 100, 0.1)',
    },
    infoContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
        marginBottom: 15,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFF',
    },
    infoText: {
        fontSize: 13,
        color: '#FFF',
        marginTop: 2,
    },
    contactButton: {
        backgroundColor: '#FFF',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 12,
        gap: 8,
        elevation: 2,
    },
    contactButtonText: {
        color: '#018f64',
        fontSize: 14,
        fontWeight: 'bold',
    },
});