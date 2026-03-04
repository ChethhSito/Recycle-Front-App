import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Alert, Dimensions } from 'react-native';
import { Text, useTheme, ActivityIndicator } from 'react-native-paper'; // 🚀 Importación corregida
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { RewardHeader } from '../../componentes/cards/rewards/RewardHeader';
import { RewardCard } from '../../componentes/cards/rewards/RewardCard';
import { PartnerRewardCard } from '../../componentes/cards/rewards/PartnerRewardCard';
import { RewardDetailModal } from '../../componentes/modal/rewards/RewardDetailModal';
import { RedeemConfirmModal } from '../../componentes/modal/rewards/RedeemConfirmModal';
import { useAuthStore } from '../../hooks/use-auth-store';
import { useRewardsStore } from '../../hooks/use-reward-store';

const { width } = Dimensions.get('window');

export const RewardsScreen = ({ userAvatar, userName, onOpenDrawer }) => {
    const navigation = useNavigation();
    const theme = useTheme(); // 🎨 Obtenemos el tema dinámico
    const { colors, dark } = theme;
    const componentStyles = getStyles(theme);

    const { user } = useAuthStore();
    const { rewards, isLoading, startLoadingRewards } = useRewardsStore();

    const [refreshing, setRefreshing] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedReward, setSelectedReward] = useState(null);
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);

    // 💰 Puntos del usuario desde el store centralizado
    const userPoints = user?.current_points || 0;

    const categories = [
        { id: 'all', label: 'Todos', icon: 'gift-outline' },
        { id: 'partners', label: 'Convenios', icon: 'handshake-outline' },
        { id: 'products', label: 'Productos', icon: 'shopping-outline' },
        { id: 'discounts', label: 'Descuentos', icon: 'ticket-percent-outline' },
        { id: 'experiences', label: 'Experiencias', icon: 'star-outline' },
        { id: 'donations', label: 'Donaciones', icon: 'heart-outline' },
    ];

    useEffect(() => {
        startLoadingRewards();
    }, []);

    const safeRewards = Array.isArray(rewards) ? rewards : [];
    const filteredRewards = selectedCategory === 'all'
        ? safeRewards
        : safeRewards.filter(r => r.category === selectedCategory);

    const onRefresh = async () => {
        setRefreshing(true);
        await startLoadingRewards();
        setRefreshing(false);
    };

    const handleRewardPress = (reward) => {
        setSelectedReward(reward);
        setDetailModalVisible(true);
    };

    const handleRedeemFromDetail = () => {
        setDetailModalVisible(false);
        setTimeout(() => setConfirmModalVisible(true), 300);
    };

    const handleConfirmRedeem = () => {
        setConfirmModalVisible(false);
        setTimeout(() => {
            Alert.alert(
                '¡Canje Exitoso! 🎉',
                `Has canjeado "${selectedReward.title}".\n\nRevisa tu correo para las instrucciones.`,
                [{ text: 'Aceptar', style: 'default' }]
            );
            setSelectedReward(null);
        }, 300);
    };

    return (
        <View style={componentStyles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[colors.primary]} // ♻️ Color dinámico
                    />
                }
            >
                {/* Header Dinámico */}
                <RewardHeader
                    userName={user?.fullName || 'Usuario'}
                    avatarUrl={user?.avatarUrl}
                    userPoints={userPoints}
                    onMenuPress={onOpenDrawer}
                    theme={theme}
                />

                {/* Filtros de Categoría Dinámicos */}
                <View style={componentStyles.filtersSection}>
                    <Text style={[componentStyles.sectionTitle, { color: colors.onSurface }]}>
                        Explorar categorías
                    </Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={componentStyles.categoriesContainer}
                    >
                        {categories.map((category) => {
                            const isActive = selectedCategory === category.id;
                            return (
                                <TouchableOpacity
                                    key={category.id}
                                    style={[
                                        componentStyles.categoryChip,
                                        isActive && componentStyles.categoryChipActive
                                    ]}
                                    onPress={() => setSelectedCategory(category.id)}
                                    activeOpacity={0.8}
                                >
                                    <Icon
                                        name={category.icon}
                                        size={18}
                                        color={isActive ? '#FFF' : colors.onSurfaceVariant}
                                    />
                                    <Text style={[
                                        componentStyles.categoryText,
                                        { color: isActive ? '#FFF' : colors.onSurfaceVariant }
                                    ]}>
                                        {category.label}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>

                {/* Grid de Recompensas */}
                {isLoading && !refreshing ? (
                    <View style={componentStyles.loaderContainer}>
                        <ActivityIndicator size="large" color={colors.primary} />
                        <Text style={[componentStyles.loaderText, { color: colors.primary }]}>
                            Buscando recompensas...
                        </Text>
                    </View>
                ) : (
                    <View style={componentStyles.rewardsGrid}>
                        {filteredRewards.map((reward) => {
                            const imageSource = reward.imageUrl
                                ? { uri: reward.imageUrl }
                                : require('../../../assets/reciclaje.png');

                            const rewardWithImage = { ...reward, image: imageSource };

                            return (
                                <View key={reward._id} style={componentStyles.rewardCardWrapper}>
                                    {reward.isPartner ? (
                                        <PartnerRewardCard
                                            reward={rewardWithImage}
                                            userPoints={userPoints}
                                            onPress={() => handleRewardPress(rewardWithImage)}
                                            theme={theme} // 🚨 Inyectamos tema
                                        />
                                    ) : (
                                        <RewardCard
                                            reward={rewardWithImage}
                                            userPoints={userPoints}
                                            onPress={() => handleRewardPress(rewardWithImage)}
                                            theme={theme} // 🚨 Inyectamos tema
                                        />
                                    )}
                                </View>
                            );
                        })}
                    </View>
                )}

                {/* Estado Vacío Dinámico */}
                {!isLoading && filteredRewards.length === 0 && (
                    <View style={componentStyles.emptyState}>
                        <Icon name="gift-off-outline" size={64} color={colors.outlineVariant} />
                        <Text style={[componentStyles.emptyStateText, { color: colors.onSurfaceVariant }]}>
                            No hay premios disponibles en esta categoría por ahora.
                        </Text>
                    </View>
                )}

                <View style={componentStyles.bottomSpacing} />
            </ScrollView>

            <RewardDetailModal
                visible={detailModalVisible}
                reward={selectedReward}
                userPoints={userPoints}
                onClose={() => setDetailModalVisible(false)}
                onRedeem={handleRedeemFromDetail}
                theme={theme} // 🚨 Sincronización con el modal
            />

            <RedeemConfirmModal
                visible={confirmModalVisible}
                reward={selectedReward}
                userPoints={userPoints}
                onClose={() => setConfirmModalVisible(false)}
                onConfirm={handleConfirmRedeem}
                theme={theme} // 🚨 Sincronización con el modal
            />
        </View>
    );
};

// 🎨 ARQUITECTURA DE ESTILOS BASADA EN EL TEMA
const getStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    filtersSection: {
        marginTop: 20,
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginLeft: 20,
        marginBottom: 12,
    },
    categoriesContainer: {
        paddingHorizontal: 20,
        paddingBottom: 10,
        gap: 10,
    },
    categoryChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 25,
        backgroundColor: theme.colors.surface, // Cambia de blanco a gris oscuro
        gap: 6,
        borderWidth: 1,
        borderColor: theme.colors.outlineVariant,
        elevation: 2,
    },
    categoryChipActive: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
        elevation: 4,
    },
    categoryText: {
        fontSize: 13,
        fontWeight: '600',
    },
    rewardsGrid: {
        paddingHorizontal: 16,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    rewardCardWrapper: {
        width: '100%',
        marginBottom: 16,
    },
    loaderContainer: {
        padding: 60,
        alignItems: 'center',
    },
    loaderText: {
        marginTop: 12,
        fontWeight: '600',
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 80,
        paddingHorizontal: 40,
    },
    emptyStateText: {
        fontSize: 15,
        textAlign: 'center',
        marginTop: 16,
        lineHeight: 22,
    },
    bottomSpacing: {
        height: 40,
    },
});