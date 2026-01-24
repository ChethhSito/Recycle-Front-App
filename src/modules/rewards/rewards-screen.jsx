import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Alert, ActivityIndicator } from 'react-native';
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

export const RewardsScreen = ({ userAvatar, userName, onOpenDrawer }) => {
    const navigation = useNavigation();

    // Hooks del Store
    const { user } = useAuthStore();
    const { rewards, isLoading, startLoadingRewards } = useRewardsStore();

    // Estados Locales
    const [refreshing, setRefreshing] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedReward, setSelectedReward] = useState(null);
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);

    // 👇 2. Usamos los puntos reales del usuario (0 si no carga aún)
    const userPoints = user?.points || 0;

    const categories = [
        { id: 'all', label: 'Todos', icon: 'gift' },
        { id: 'partners', label: 'Convenios', icon: 'handshake' },
        { id: 'products', label: 'Productos', icon: 'shopping' },
        { id: 'discounts', label: 'Descuentos', icon: 'ticket-percent' },
        { id: 'experiences', label: 'Experiencias', icon: 'star' },
        { id: 'donations', label: 'Donaciones', icon: 'heart' },
    ];

    useEffect(() => {
        startLoadingRewards();
    }, []);

    const safeRewards = Array.isArray(rewards) ? rewards : [];

    const filteredRewards = selectedCategory === 'all'
        ? safeRewards
        : safeRewards.filter(r => r.category === selectedCategory);

    // Pull to Refresh real
    const onRefresh = async () => {
        setRefreshing(true);
        await startLoadingRewards(); // Recarga del backend
        setRefreshing(false);
    };

    const handleRewardPress = (reward) => {
        setSelectedReward(reward);
        setDetailModalVisible(true);
    };

    const handleRedeemFromDetail = () => {
        setDetailModalVisible(false);
        setTimeout(() => {
            setConfirmModalVisible(true);
        }, 300);
    };

    const handleConfirmRedeem = () => {
        setConfirmModalVisible(false);

        // AQUÍ DEBERÍAS LLAMAR A UNA ACCIÓN DEL BACKEND PARA CANJEAR
        // Por ahora simulamos el éxito visualmente:

        setTimeout(() => {
            Alert.alert(
                '¡Canje Exitoso! 🎉',
                `Has canjeado "${selectedReward.title}".\n\nCódigo: RW${Math.random().toString(36).substr(2, 9).toUpperCase()}\n\nRevisa tu correo.`,
                [
                    { text: 'Aceptar', style: 'default' }
                ]
            );
            setSelectedReward(null);
            // Opcional: Recargar usuario para ver puntos descontados
            // checkAuthStatus(); 
        }, 300);
    };

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scrollView}
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

                {/* Categorías */}
                <View style={styles.categoriesSection}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.categoriesContainer}
                    >
                        {categories.map((category) => (
                            <TouchableOpacity
                                key={category.id}
                                style={[
                                    styles.categoryButton,
                                    selectedCategory === category.id && styles.categoryButtonActive
                                ]}
                                onPress={() => setSelectedCategory(category.id)}
                            >
                                <Icon
                                    name={category.icon}
                                    size={20}
                                    color={selectedCategory === category.id ? '#FFF' : '#018f64'}
                                />
                                <Text style={[
                                    styles.categoryButtonText,
                                    selectedCategory === category.id && styles.categoryButtonTextActive
                                ]}>
                                    {category.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Lista de Premios */}
                {isLoading && !refreshing ? (
                    <View style={{ padding: 50 }}>
                        <ActivityIndicator size="large" color="#018f64" />
                    </View>
                ) : (
                    <View style={styles.rewardsGrid}>
                        {filteredRewards.map((reward) => {
                            // 👇 5. Lógica de Imagen: Si hay URL, la usa. Si no, usa placeholder.
                            // Esto evita que la app explote si imageUrl es null.
                            const imageSource = reward.imageUrl
                                ? { uri: reward.imageUrl }
                                : require('../../../assets/reciclaje.png'); // Asegúrate de tener esta imagen o cambia la ruta

                            // Inyectamos la imagen procesada al objeto reward para que el componente Card no sufra
                            const rewardWithImage = { ...reward, image: imageSource };

                            return reward.isPartner ? (
                                <PartnerRewardCard
                                    key={reward._id} // MongoDB usa _id
                                    reward={rewardWithImage}
                                    userPoints={userPoints}
                                    onPress={() => handleRewardPress(rewardWithImage)}
                                />
                            ) : (
                                <RewardCard
                                    key={reward._id}
                                    reward={rewardWithImage}
                                    userPoints={userPoints}
                                    onPress={() => handleRewardPress(rewardWithImage)}
                                />
                            );
                        })}
                    </View>
                )}

                {!isLoading && filteredRewards.length === 0 && (
                    <View style={styles.emptyState}>
                        <Icon name="gift-off" size={64} color="#CCC" />
                        <Text style={styles.emptyStateText}>
                            No hay premios en esta categoría
                        </Text>
                    </View>
                )}

                <View style={styles.bottomSpacing} />
            </ScrollView>

            {/* Modales */}
            <RewardDetailModal
                visible={detailModalVisible}
                reward={selectedReward} // Ya lleva la imagen procesada
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
        backgroundColor: '#b1eedc',
    },
    scrollView: {
        flex: 1,
    },
    categoriesSection: {
        backgroundColor: '#b1eedc',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#018f64',
    },
    categoriesContainer: {
        paddingHorizontal: 16,
        gap: 12,
    },
    categoryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: '#E8F5F1',
        borderWidth: 1,
        borderColor: '#018f64',
    },
    categoryButtonActive: {
        backgroundColor: '#018f64',
        borderColor: '#018f64',
    },
    categoryButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#030303ff',
        marginLeft: 6,
    },
    categoryButtonTextActive: {
        color: '#FFF',
    },
    scrollView: {
        flex: 1,
    },
    rewardsGrid: {
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
    bottomSpacing: {
        height: 20,
    },
});
