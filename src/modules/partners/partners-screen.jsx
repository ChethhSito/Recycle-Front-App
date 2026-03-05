import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { PartnerHeader } from '../../componentes/cards/partners/PartnerHeader';
import { PartnerCard } from '../../componentes/cards/partners/PartnerCard';
import { ContactModal } from '../../componentes/modal/partners/ContactModal';
import { PartnerDetailModal } from '../../componentes/modal/partners/PartnerDetailModal';
import { usePartners } from '../../hooks/use-partners-store';
import { useTranslation } from '../../hooks/use-translation'; // 🗣️ Hook de traducción

export const PartnersScreen = ({ userAvatar, userName, onOpenDrawer }) => {
    const t = useTranslation(); // 🗣️ Inicializar traducciones
    const navigation = useNavigation();
    const theme = useTheme();
    const { colors, dark } = theme;
    const componentStyles = getStyles(theme);

    const [refreshing, setRefreshing] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [contactModalVisible, setContactModalVisible] = useState(false);
    const [selectedPartner, setSelectedPartner] = useState(null);
    const [detailModalVisible, setDetailModalVisible] = useState(false);

    const { partners, loading, refetch } = usePartners();

    // 📋 Filtros traducidos dinámicamente
    const filters = [
        { id: 'all', label: t.partners.filterLabels.all, icon: 'view-grid-outline' },
        { id: 'financial', label: t.partners.filterLabels.financial, icon: 'bank-outline' },
        { id: 'government', label: t.partners.filterLabels.government, icon: 'shield-account-outline' },
        { id: 'ong', label: t.partners.filterLabels.ong, icon: 'hand-heart-outline' },
        { id: 'corporate', label: t.partners.filterLabels.corporate, icon: 'domain' },
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
        <View style={componentStyles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[colors.primary]}
                        tintColor={colors.primary}
                    />
                }
                contentContainerStyle={{ paddingBottom: 40 }}
            >
                <PartnerHeader
                    userName={userName}
                    avatarUrl={userAvatar}
                    onMenuPress={onOpenDrawer}
                    theme={theme}
                />

                <View style={componentStyles.filtersContainer}>
                    <Text style={[componentStyles.sectionTitle, { color: colors.onSurface }]}>
                        {t.partners.categories}
                    </Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={componentStyles.filtersScroll}
                    >
                        {filters.map((filter) => {
                            const isActive = selectedFilter === filter.id;
                            return (
                                <TouchableOpacity
                                    key={filter.id}
                                    style={[
                                        componentStyles.filterChip,
                                        isActive && componentStyles.filterChipActive
                                    ]}
                                    onPress={() => setSelectedFilter(filter.id)}
                                    activeOpacity={0.8}
                                >
                                    <Icon
                                        name={filter.icon}
                                        size={18}
                                        color={isActive ? '#FFF' : colors.onSurfaceVariant}
                                    />
                                    <Text style={[
                                        componentStyles.filterText,
                                        { color: isActive ? '#FFF' : colors.onSurfaceVariant }
                                    ]}>
                                        {filter.label}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>

                {loading && !refreshing ? (
                    <View style={componentStyles.loadingContainer}>
                        <ActivityIndicator size="large" color={colors.primary} />
                        <Text style={[componentStyles.loadingText, { color: colors.primary }]}>
                            {t.partners.loading}
                        </Text>
                    </View>
                ) : (
                    <>
                        <View style={componentStyles.partnersList}>
                            {filteredPartners.map((partner) => {
                                const partnerFixed = {
                                    ...partner,
                                    logo: fixPartnerLogo(partner.logo)
                                };

                                return (
                                    <View key={partner._id || partner.id} style={componentStyles.cardWrapper}>
                                        <PartnerCard
                                            partner={partnerFixed}
                                            onPress={() => handlePartnerPress(partnerFixed)}
                                            theme={theme}
                                        />
                                    </View>
                                );
                            })}
                        </View>

                        {filteredPartners.length === 0 && (
                            <View style={componentStyles.emptyState}>
                                <Icon name="folder-search-outline" size={60} color={colors.outlineVariant} />
                                <Text style={[componentStyles.emptyStateText, { color: colors.onSurfaceVariant }]}>
                                    {t.partners.emptyState}
                                </Text>
                            </View>
                        )}
                    </>
                )}

                {/* Banner de Información Traducido */}
                <View style={[
                    componentStyles.infoSection,
                    { backgroundColor: dark ? colors.surfaceVariant : colors.primary }
                ]}>
                    <View style={componentStyles.infoContent}>
                        <Icon name="handshake" size={32} color="#FFF" />
                        <View style={{ flex: 1 }}>
                            <Text style={componentStyles.infoTitle}>{t.partners.allianceBanner.title}</Text>
                            <Text style={componentStyles.infoText}>
                                {t.partners.allianceBanner.subtitle}
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        style={[componentStyles.contactButton, { backgroundColor: dark ? colors.primary : '#FFF' }]}
                        onPress={() => setContactModalVisible(true)}
                    >
                        <Text style={[
                            componentStyles.contactButtonText,
                            { color: dark ? '#FFF' : colors.primary }
                        ]}>
                            {t.partners.allianceBanner.button}
                        </Text>
                        <Icon name="arrow-right" size={16} color={dark ? '#FFF' : colors.primary} />
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <ContactModal
                visible={contactModalVisible}
                onClose={() => setContactModalVisible(false)}
                theme={theme}
            />
            <PartnerDetailModal
                visible={detailModalVisible}
                partner={selectedPartner}
                onClose={() => setDetailModalVisible(false)}
                onViewRewards={handleViewRewards}
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
    filtersContainer: {
        marginTop: 15,
        marginBottom: 5,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginLeft: 20,
        marginBottom: 10,
    },
    filtersScroll: {
        paddingHorizontal: 20,
        paddingBottom: 10,
        gap: 10,
    },
    partnersList: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
    },
    cardWrapper: {
        width: '100%',
        marginBottom: 20,
    },
    filterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 25,
        backgroundColor: theme.colors.surface,
        gap: 6,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        borderWidth: 1,
        borderColor: theme.colors.outlineVariant,
    },
    filterChipActive: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
        elevation: 4,
    },
    filterText: {
        fontSize: 13,
        fontWeight: '600',
    },
    loadingContainer: {
        padding: 50,
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontWeight: '500',
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyStateText: {
        fontSize: 15,
        marginTop: 10,
    },
    infoSection: {
        marginHorizontal: 20,
        marginTop: 20,
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
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
        color: 'rgba(255, 255, 255, 0.8)',
        marginTop: 2,
    },
    contactButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 12,
        gap: 8,
        elevation: 2,
    },
    contactButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
});