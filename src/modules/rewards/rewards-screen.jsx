import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Alert, Dimensions } from 'react-native';
import { Text, useTheme, ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// Componentes y Hooks
import { RewardHeader } from '../../componentes/cards/rewards/RewardHeader';
import { RewardCard } from '../../componentes/cards/rewards/RewardCard';
import { PartnerRewardCard } from '../../componentes/cards/rewards/PartnerRewardCard';
import { RewardDetailModal } from '../../componentes/modal/rewards/RewardDetailModal';
import { RedeemConfirmModal } from '../../componentes/modal/rewards/RedeemConfirmModal';
import { useAuthStore } from '../../hooks/use-auth-store';
import { useRewardsStore } from '../../hooks/use-reward-store';
import { useTranslation } from '../../hooks/use-translation';
import { useLevels } from '../../hooks/use-levels-store'; // 📈 El store con los puntos reales

const { width } = Dimensions.get('window');

export const RewardsScreen = ({ onOpenDrawer }) => {
    const navigation = useNavigation();
    const theme = useTheme();
    const { colors } = theme;
    const componentStyles = getStyles(theme);
    const t = useTranslation();

    // 📦 Stores
    const { user } = useAuthStore();
    const { rewards, isLoading, startLoadingRewards } = useRewardsStore();
    const { userLevelStatus, startLoadingUserStatus } = useLevels();


    // 💰 REEMPLAZO: Usamos los puntos del log de niveles
    // Antes: user?.current_points || 0
    const userPoints = userLevelStatus?.points?.current ?? 0;

    const [refreshing, setRefreshing] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedReward, setSelectedReward] = useState(null);
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);

    const categories = [
        { id: 'all', label: t.rewards.categories.all, icon: 'gift-outline' },
        { id: 'partners', label: t.rewards.categories.partners, icon: 'handshake-outline' },
        { id: 'products', label: t.rewards.categories.products, icon: 'shopping-outline' },
        { id: 'discounts', label: t.rewards.categories.discounts, icon: 'ticket-percent-outline' },
        { id: 'experiences', label: t.rewards.categories.experiences, icon: 'star-outline' },
        { id: 'donations', label: t.rewards.categories.donations, icon: 'heart-outline' },
    ];

    useEffect(() => {
        startLoadingRewards();
        startLoadingUserStatus(); // 🔄 Cargamos el status de niveles al entrar
        console.log("sigue sin funcionar", user)
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await Promise.all([startLoadingRewards(), startLoadingUserStatus()]);
        setRefreshing(false);
    };

    // ... (Lógica de handlers de canje se mantiene igual)
    const handleRewardPress = (reward) => {
        setSelectedReward(reward);
        setDetailModalVisible(true);
    };

    const handleConfirmRedeem = () => {
        setConfirmModalVisible(false);
        setTimeout(() => {
            Alert.alert(
                t.rewards.successTitle,
                t.rewards.successMsg.replace('{{title}}', selectedReward.title),
                [{ text: t.rewards.accept }]
            );
            setSelectedReward(null);
        }, 300);
    };

    return (
        <View style={componentStyles.container}>
            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
                }
            >
                <RewardHeader
                    userName={user?.fullName || 'Usuario'}
                    userPoints={userPoints} // 💎 Ahora muestra los 8,000 pts
                    onMenuPress={onOpenDrawer}
                    theme={theme}
                    avatarUrl={user?.avatar}
                />

                <View style={componentStyles.filtersSection}>
                    <Text style={[componentStyles.sectionTitle, { color: colors.onSurface }]}>
                        {t.rewards.explore}
                    </Text>
                    {/* ... Scroll de categorías */}
                </View>

                {/* Grid de Recompensas */}
                {isLoading && !refreshing ? (
                    <View style={componentStyles.loaderContainer}>
                        <ActivityIndicator size="large" color={colors.primary} />
                    </View>
                ) : (
                    <View style={componentStyles.rewardsGrid}>
                        {rewards.filter(r => selectedCategory === 'all' || r.category === selectedCategory).map((reward) => {
                            // 🛠️ 1. Centralizamos el formato de la imagen aquí
                            const rewardWithImage = {
                                ...reward,
                                image: reward.imageUrl ? { uri: reward.imageUrl } : require('../../../assets/header.png')
                            };

                            return (
                                <View key={reward._id} style={componentStyles.rewardCardWrapper}>
                                    {reward.isPartner ? (
                                        <PartnerRewardCard
                                            reward={rewardWithImage}
                                            userPoints={userPoints}
                                            onPress={() => handleRewardPress(rewardWithImage)} // ✅ Pasamos el objeto YA FORMATEADO
                                            theme={theme}
                                        />
                                    ) : (
                                        <RewardCard
                                            reward={rewardWithImage}
                                            userPoints={userPoints}
                                            onPress={() => handleRewardPress(rewardWithImage)} // ✅ Pasamos el objeto YA FORMATEADO
                                            theme={theme}
                                        />
                                    )}
                                </View>
                            );
                        })}
                    </View>
                )}

                <View style={componentStyles.bottomSpacing} />
            </ScrollView>

            <RewardDetailModal
                visible={detailModalVisible}
                reward={selectedReward}
                userPoints={userPoints} // 💎 Modal actualizado
                onClose={() => setDetailModalVisible(false)}
                onRedeem={() => { setDetailModalVisible(false); setTimeout(() => setConfirmModalVisible(true), 300); }}
                theme={theme}
            />

            <RedeemConfirmModal
                visible={confirmModalVisible}
                reward={selectedReward}
                userPoints={userPoints} // 💎 Confirmación actualizada
                onClose={() => setConfirmModalVisible(false)}
                onConfirm={handleConfirmRedeem}
                theme={theme}
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