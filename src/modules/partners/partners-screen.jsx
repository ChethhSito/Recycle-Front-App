import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { PartnerHeader } from '../../componentes/cards/partners/PartnerHeader';
import { PartnerCard } from '../../componentes/cards/partners/PartnerCard';
import { ContactModal } from '../../componentes/modal/partners/ContactModal';
import { PartnerDetailModal } from '../../componentes/modal/partners/PartnerDetailModal';
import { usePartners } from '../../hooks/use-partners-store';

export const PartnersScreen = ({ userAvatar, userName, onOpenDrawer }) => {
    const navigation = useNavigation();
    const [refreshing, setRefreshing] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [contactModalVisible, setContactModalVisible] = useState(false);
    const [selectedPartner, setSelectedPartner] = useState(null);
    const [detailModalVisible, setDetailModalVisible] = useState(false);

    // Use custom hook
    const { partners, loading, refetch } = usePartners();

    // Filtros de tipo de partner
    const filters = [
        { id: 'all', label: 'Todos', icon: 'view-grid' },
        { id: 'financial', label: 'Financieros', icon: 'bank' },
        { id: 'government', label: 'Gobierno', icon: 'shield-account' },
        { id: 'ong', label: 'ONGs', icon: 'hand-heart' },
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
        if (url.startsWith('http://') || url.startsWith('https://')) {
            return url;
        }
        return `https://${url}`;
    };

    // Filtrar partners
    const filteredPartners = selectedFilter === 'all'
        ? partners
        : partners.filter(partner => partner.filterType === selectedFilter);

    const handlePartnerPress = (partner) => {
        // Aseguramos que al abrir el modal también lleve la imagen corregida
        const fixedPartner = {
            ...partner,
            logo: fixPartnerLogo(partner.logo)
        };
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

                {/* Loading State or List */}
                {loading && !refreshing ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#018f64" />
                        <Text style={styles.loadingText}>Cargando aliados...</Text>
                    </View>
                ) : (
                    <>
                        {/* Lista de Partners */}
                        <View style={styles.partnersGrid}>
                            {filteredPartners.map((partner) => {
                                // 👇 2. AQUÍ APLICAMOS EL ARREGLO
                                // Creamos una copia del partner con el logo corregido antes de pasarlo a la Card
                                const partnerFixed = {
                                    ...partner,
                                    logo: fixPartnerLogo(partner.logo) // Asumiendo que el campo se llama 'logo'
                                };
                                console.log(`Partner: ${partnerFixed.name}, Logo URL: ${partnerFixed.logo}`);
                                return (
                                    <PartnerCard
                                        key={partner._id || partner.id}
                                        partner={partnerFixed} // 👈 Pasamos el objeto corregido
                                        onPress={() => handlePartnerPress(partnerFixed)}
                                    />
                                );
                            })}
                        </View>


                        {filteredPartners.length === 0 && (
                            <View style={styles.emptyState}>
                                <Icon name="briefcase-off" size={64} color="#CCC" />
                                <Text style={styles.emptyStateText}>
                                    No hay convenios en esta categoría
                                </Text>
                            </View>
                        )}
                    </>
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
        backgroundColor: '#b1eedc',
    },
    filtersSection: {
        backgroundColor: '#b1eedc',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#018f64',
    },
    filtersTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: '#000000ff',
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
        color: '#000000ff',
    },
    filterTextActive: {
        color: '#FFF',
    },
    partnersGrid: {
        paddingTop: 16,
    },
    loadingContainer: {
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        marginTop: 10,
        color: '#666',
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
