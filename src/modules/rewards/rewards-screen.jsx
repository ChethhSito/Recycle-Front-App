import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Alert, ActivityIndicator, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';
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
    const { user } = useAuthStore();
    const { rewards, isLoading, startLoadingRewards } = useRewardsStore();

    const [refreshing, setRefreshing] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedReward, setSelectedReward] = useState(null);
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);

    const userPoints = user?.points || 0;

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
        <View style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#018f64']} />
                }
            >
                {/* Header */}
                <RewardHeader
                    userName={user?.fullName || 'Usuario'}
                    avatarUrl={user?.avatar || 'https://i.pravatar.cc/150?img=33'}
                    userPoints={userPoints}
                    onMenuPress={onOpenDrawer}
                />

                {/* Sección de Categorías (Chips) */}
                <View style={styles.filtersSection}>
                    <Text style={styles.sectionTitle}>Explorar categorías</Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.categoriesContainer}
                    >
                        {categories.map((category) => {
                            const isActive = selectedCategory === category.id;
                            return (
                                <TouchableOpacity
                                    key={category.id}
                                    style={[styles.categoryChip, isActive && styles.categoryChipActive]}
                                    onPress={() => setSelectedCategory(category.id)}
                                    activeOpacity={0.8}
                                >
                                    <Icon
                                        name={category.icon}
                                        size={18}
                                        color={isActive ? '#FFF' : '#444'}
                                    />
                                    <Text style={[styles.categoryText, isActive && styles.categoryTextActive]}>
                                        {category.label}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>

                {/* Lista de Premios */}
                {isLoading && !refreshing ? (
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator size="large" color="#018f64" />
                        <Text style={styles.loaderText}>Buscando recompensas...</Text>
                    </View>
                ) : (
                    <View style={styles.rewardsGrid}>
                        {filteredRewards.map((reward) => {
                            const imageSource = reward.imageUrl
                                ? { uri: reward.imageUrl }
                                : require('../../../assets/reciclaje.png');

                            const rewardWithImage = { ...reward, image: imageSource };

                            return (
                                <View key={reward._id} style={styles.rewardCardWrapper}>
                                    {reward.isPartner ? (
                                        <PartnerRewardCard
                                            reward={rewardWithImage}
                                            userPoints={userPoints}
                                            onPress={() => handleRewardPress(rewardWithImage)}
                                        />
                                    ) : (
                                        <RewardCard
                                            reward={rewardWithImage}
                                            userPoints={userPoints}
                                            onPress={() => handleRewardPress(rewardWithImage)}
                                        />
                                    )}
                                </View>
                            );
                        })}
                    </View>
                )}

                {/* Estado Vacío */}
                {!isLoading && filteredRewards.length === 0 && (
                    <View style={styles.emptyState}>
                        <Icon name="gift-off-outline" size={64} color="rgba(0,0,0,0.15)" />
                        <Text style={styles.emptyStateText}>
                            No hay premios disponibles en esta categoría por ahora.
                        </Text>
                    </View>
                )}

                <View style={styles.bottomSpacing} />
            </ScrollView>

            <RewardDetailModal
                visible={detailModalVisible}
                reward={selectedReward}
                userPoints={userPoints}
                onClose={() => setDetailModalVisible(false)}
                onRedeem={handleRedeemFromDetail}
            />

            <RedeemConfirmModal
                visible={confirmModalVisible}
                reward={selectedReward}
                userPoints={userPoints}
                onClose={() => setConfirmModalVisible(false)}
                onConfirm={handleConfirmRedeem}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#b1eedc', // Mantenemos el fondo menta de la marca
    },
    // --- FILTROS ---
    filtersSection: {
        marginTop: 20,
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#0D3E32',
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
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        gap: 6,
        borderWidth: 1,
        borderColor: '#FFF',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    categoryChipActive: {
        backgroundColor: '#018f64',
        borderColor: '#018f64',
        elevation: 4,
        shadowOpacity: 0.2,
    },
    categoryText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#333',
    },
    categoryTextActive: {
        color: '#FFF',
    },
    // --- GRID ---
    rewardsGrid: {
        paddingHorizontal: 16,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    rewardCardWrapper: {
        width: '100%', // Se puede cambiar a '48%' si prefieres 2 columnas
        marginBottom: 16,
    },
    // --- ESTADOS ---
    loaderContainer: {
        padding: 60,
        alignItems: 'center',
    },
    loaderText: {
        marginTop: 12,
        color: '#018f64',
        fontWeight: '600',
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 80,
        paddingHorizontal: 40,
    },
    emptyStateText: {
        fontSize: 15,
        color: 'rgba(0,0,0,0.5)',
        textAlign: 'center',
        marginTop: 16,
        lineHeight: 22,
    },
    bottomSpacing: {
        height: 40,
    },
});