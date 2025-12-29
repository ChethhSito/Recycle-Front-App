import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { RewardHeader } from '../../componentes/cards/rewards/RewardHeader';
import { RewardCard } from '../../componentes/cards/rewards/RewardCard';
import { PartnerRewardCard } from '../../componentes/cards/rewards/PartnerRewardCard';
import { RewardDetailModal } from '../../componentes/modal/RewardDetailModal';
import { RedeemConfirmModal } from '../../componentes/modal/RedeemConfirmModal';

export const RewardsScreen = ({ userAvatar, userName, onOpenDrawer }) => {
    const navigation = useNavigation();
    const [refreshing, setRefreshing] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedReward, setSelectedReward] = useState(null);
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);
    const [userPoints, setUserPoints] = useState(330); // Puntos del usuario

    // Categorías de premios
    const categories = [
        { id: 'all', label: 'Todos', icon: 'gift' },
        { id: 'partners', label: 'Convenios', icon: 'handshake' },
        { id: 'products', label: 'Productos', icon: 'shopping' },
        { id: 'discounts', label: 'Descuentos', icon: 'ticket-percent' },
        { id: 'experiences', label: 'Experiencias', icon: 'star' },
        { id: 'donations', label: 'Donaciones', icon: 'heart' },
    ];

    // Datos de premios
    const rewardsData = [
        {
            id: 1,
            title: 'Botella de Agua Reutilizable',
            description: 'Botella térmica de acero inoxidable, 500ml. Mantiene bebidas frías 24h y calientes 12h.',
            image: require('../../../assets/reciclaje.jpg'),
            points: 250,
            category: 'Productos',
            categoryIcon: 'shopping',
            stock: 15,
            sponsor: 'EcoLife Store',
            expiryDate: '31 Dic 2025',
            terms: 'El canje es válido por una sola unidad. No reembolsable. Recoger en tienda dentro de 30 días.',
        },
        {
            id: 2,
            title: 'Bolsa de Tela Ecológica',
            description: 'Set de 3 bolsas reutilizables de algodón orgánico. Ideales para compras sostenibles.',
            image: require('../../../assets/reciclaje.png'),
            points: 150,
            category: 'Productos',
            categoryIcon: 'shopping',
            stock: 25,
            sponsor: 'Green Market',
            expiryDate: '31 Dic 2025',
            terms: 'Válido para canjear por un set completo. Sujeto a disponibilidad de stock.',
        },
        {
            id: 3,
            title: '20% de Descuento en Tienda Verde',
            description: 'Descuento aplicable en toda la tienda de productos ecológicos. Una sola compra.',
            image: require('../../../assets/program1.jpg'),
            points: 200,
            category: 'Descuentos',
            categoryIcon: 'ticket-percent',
            stock: 50,
            sponsor: 'Tienda Verde',
            expiryDate: '28 Feb 2026',
            terms: 'Válido por una compra. No acumulable con otras promociones. Mínimo de compra $50.',
        },
        {
            id: 4,
            title: 'Kit de Jardinería Urbana',
            description: 'Kit completo con macetas biodegradables, semillas orgánicas y sustrato ecológico.',
            image: require('../../../assets/program2.jpg'),
            points: 400,
            category: 'Productos',
            categoryIcon: 'shopping',
            stock: 8,
            sponsor: 'Urban Garden Co.',
            expiryDate: '30 Jun 2026',
            terms: 'Incluye guía de cultivo. Recoger en punto de distribución autorizado.',
        },
        {
            id: 5,
            title: 'Taller de Compostaje',
            description: 'Entrada a taller práctico de compostaje casero. Duración 3 horas. Incluye materiales.',
            image: require('../../../assets/reciclaje.jpg'),
            points: 300,
            category: 'Experiencias',
            categoryIcon: 'star',
            stock: 20,
            sponsor: 'Eco Academy',
            expiryDate: '31 Mar 2026',
            terms: 'Reserva sujeta a disponibilidad de fechas. Confirmar asistencia 48h antes.',
        },
        {
            id: 6,
            title: 'Donación: Plantar 5 Árboles',
            description: 'Tu canje se convierte en 5 árboles nativos plantados en zonas de reforestación.',
            image: require('../../../assets/program1.jpg'),
            points: 500,
            category: 'Donaciones',
            categoryIcon: 'heart',
            stock: 100,
            sponsor: 'Fundación Verde',
            expiryDate: '31 Dic 2026',
            terms: 'Recibirás certificado digital con ubicación GPS de los árboles plantados.',
        },
        {
            id: 7,
            title: 'Cubiertos Biodegradables - Set 20 Piezas',
            description: 'Set de cubiertos desechables hechos de bambú. 100% biodegradables y compostables.',
            image: require('../../../assets/reciclaje.png'),
            points: 180,
            category: 'Productos',
            categoryIcon: 'shopping',
            stock: 30,
            sponsor: 'BioWare',
            expiryDate: '31 Dic 2025',
            terms: 'Producto de un solo uso. Ideal para eventos y picnics sostenibles.',
        },
        {
            id: 8,
            title: 'Suscripción Premium 1 Mes',
            description: 'Acceso a contenido exclusivo, estadísticas avanzadas y prioridad en eventos.',
            image: require('../../../assets/program2.jpg'),
            points: 350,
            category: 'Experiencias',
            categoryIcon: 'star',
            stock: 999,
            sponsor: 'Nos Planét',
            expiryDate: '31 Dic 2026',
            terms: 'Activación inmediata. Renovación automática deshabilitada.',
        },
        // CONVENIOS - YAPE
        {
            id: 9,
            title: 'S/ 5 Cashback en Yape',
            description: 'Recibe S/ 5 de cashback en tu próxima recarga de celular por Yape.',
            image: require('../../../assets/reciclaje.jpg'),
            points: 200,
            category: 'Convenios',
            categoryIcon: 'handshake',
            stock: 100,
            sponsor: 'Yape',
            partnerName: 'Yape',
            partnerType: 'yape',
            expiryDate: '31 Mar 2026',
            terms: 'Válido en recargas de S/ 20 o más. Código se activa en 48 horas. Válido por 30 días.',
            isPartner: true,
        },
        {
            id: 10,
            title: 'S/ 10 en Yape',
            description: 'Transferencia de S/ 10 a tu cuenta Yape. Mínimo 500 puntos acumulados.',
            image: require('../../../assets/program1.jpg'),
            points: 500,
            category: 'Convenios',
            categoryIcon: 'handshake',
            stock: 50,
            sponsor: 'Yape',
            partnerName: 'Yape',
            partnerType: 'yape',
            expiryDate: '31 Dic 2026',
            terms: 'Transferencia en 72 horas hábiles. Requiere cuenta Yape verificada y validación de identidad.',
            isPartner: true,
        },
        // CONVENIOS - BCP
        {
            id: 11,
            title: '10% Dscto. en Comisión de Transferencias',
            description: 'Descuento en comisiones de transferencias BCP por 3 meses.',
            image: require('../../../assets/program2.jpg'),
            points: 350,
            category: 'Convenios',
            categoryIcon: 'handshake',
            stock: 80,
            sponsor: 'BCP',
            partnerName: 'BCP',
            partnerType: 'bcp',
            expiryDate: '30 Jun 2026',
            terms: 'Válido para clientes BCP. Activación mediante código. No acumulable con otras promociones.',
            isPartner: true,
        },
        {
            id: 12,
            title: 'Bono de S/ 20 para Apertura de Cuenta BCP',
            description: 'Bono de bienvenida al abrir tu cuenta de ahorros o corriente en BCP.',
            image: require('../../../assets/reciclaje.png'),
            points: 450,
            category: 'Convenios',
            categoryIcon: 'handshake',
            stock: 60,
            sponsor: 'BCP',
            partnerName: 'BCP',
            partnerType: 'bcp',
            expiryDate: '31 Dic 2026',
            terms: 'Para nuevos clientes BCP. Depósito mínimo de apertura S/ 100. Bono se acredita en 30 días.',
            isPartner: true,
        },
        // CONVENIOS - ESTADO/GOBIERNO
        {
            id: 13,
            title: 'Descuento 50% en Talleres Municipales',
            description: 'Medio precio en talleres ambientales de tu municipalidad.',
            image: require('../../../assets/program1.jpg'),
            points: 280,
            category: 'Convenios',
            categoryIcon: 'handshake',
            stock: 150,
            sponsor: 'Municipalidad Local',
            partnerName: 'Municipalidad',
            partnerType: 'government',
            expiryDate: '30 Jun 2026',
            terms: 'Válido en talleres de compostaje, reciclaje y huertos urbanos. Presentar código en municipio.',
            isPartner: true,
        },
        {
            id: 14,
            title: 'Certificado Municipal de Reciclador',
            description: 'Reconocimiento oficial de tu municipio por tu labor ambiental.',
            image: require('../../../assets/reciclaje.jpg'),
            points: 400,
            category: 'Convenios',
            categoryIcon: 'handshake',
            stock: 300,
            sponsor: 'Municipalidad Local',
            partnerName: 'Municipalidad',
            partnerType: 'government',
            expiryDate: '31 Dic 2026',
            terms: 'Certificado digital y físico. Válido para portafolio profesional y currículum.',
            isPartner: true,
        },
        // CONVENIOS - ONG
        {
            id: 15,
            title: 'Planta 1 Árbol Nativo',
            description: 'Tu canje financia la siembra de un árbol nativo en áreas deforestadas.',
            image: require('../../../assets/program2.jpg'),
            points: 250,
            category: 'Convenios',
            categoryIcon: 'handshake',
            stock: 200,
            sponsor: 'Reforesta Perú - ONG',
            partnerName: 'Reforesta Perú',
            partnerType: 'ong',
            expiryDate: '31 Dic 2026',
            terms: 'Recibirás código de seguimiento y ubicación GPS del árbol plantado a tu nombre.',
            isPartner: true,
        },
        {
            id: 16,
            title: 'Sponsor 1kg de Comida para Albergue',
            description: 'Financia 1kg de alimento para mascotas rescatadas.',
            image: require('../../../assets/reciclaje.png'),
            points: 180,
            category: 'Convenios',
            categoryIcon: 'handshake',
            stock: 150,
            sponsor: 'Patitas Felices - ONG',
            partnerName: 'Patitas Felices',
            partnerType: 'ong',
            expiryDate: '31 Dic 2026',
            terms: 'Contribuyes a la alimentación de perros y gatos rescatados. Certificado digital de donación.',
            isPartner: true,
        },
    ];

    // Filtrar premios por categoría
    const filteredRewards = selectedCategory === 'all'
        ? rewardsData
        : rewardsData.filter(reward => 
            reward.category.toLowerCase() === categories.find(c => c.id === selectedCategory)?.label.toLowerCase()
        );

    const onRefresh = async () => {
        setRefreshing(true);
        // Simular carga de datos
        setTimeout(() => {
            setRefreshing(false);
        }, 1500);
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
        
        // Restar puntos
        setUserPoints(prev => prev - selectedReward.points);

        // Mostrar alerta de éxito
        setTimeout(() => {
            Alert.alert(
                '¡Canje Exitoso! 🎉',
                `Has canjeado "${selectedReward.title}".\n\nCódigo de canje: RW${Math.random().toString(36).substr(2, 9).toUpperCase()}\n\nRecibirás un email con las instrucciones.`,
                [
                    {
                        text: 'Ver Historial',
                        onPress: () => navigation.navigate('History')
                    },
                    { text: 'Aceptar', style: 'default' }
                ]
            );
            setSelectedReward(null);
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
                {/* Header Exclusivo de Premios */}
                <RewardHeader
                    userName={userName}
                    avatarUrl={userAvatar || 'https://i.pravatar.cc/150?img=33'}
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
                <View style={styles.rewardsGrid}>
                    {filteredRewards.map((reward) => (
                        reward.isPartner ? (
                            <PartnerRewardCard
                                key={reward.id}
                                reward={reward}
                                userPoints={userPoints}
                                onPress={() => handleRewardPress(reward)}
                            />
                        ) : (
                            <RewardCard
                                key={reward.id}
                                reward={reward}
                                userPoints={userPoints}
                                onPress={() => handleRewardPress(reward)}
                            />
                        )
                    ))}
                </View>

                {filteredRewards.length === 0 && (
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
        backgroundColor: '#F5F5F5',
    },
    scrollView: {
        flex: 1,
    },
    categoriesSection: {
        backgroundColor: '#FFF',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
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
        color: '#018f64',
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
