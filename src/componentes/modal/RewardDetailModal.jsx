import React from 'react';
import { View, Text, StyleSheet, Modal, ScrollView, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

export const RewardDetailModal = ({ visible, reward, userPoints, onClose, onRedeem }) => {
    if (!reward) return null;

    const canRedeem = userPoints >= reward.points;
    const pointsNeeded = reward.points - userPoints;

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    {/* Header con botón cerrar */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Icon name="close" size={28} color="#32243B" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        {/* Imagen del premio */}
                        <View style={styles.imageContainer}>
                            <Image
                                source={reward.image}
                                style={styles.image}
                                resizeMode="cover"
                            />
                            {!canRedeem && (
                                <View style={styles.lockedOverlay}>
                                    <Icon name="lock" size={48} color="#FFF" />
                                    <Text style={styles.lockedText}>Bloqueado</Text>
                                </View>
                            )}
                        </View>

                        {/* Contenido */}
                        <View style={styles.contentContainer}>
                            {/* Título y categoría */}
                            <View style={styles.categoryBadge}>
                                <Icon name={reward.categoryIcon} size={14} color="#018f64" />
                                <Text style={styles.categoryText}>{reward.category}</Text>
                            </View>

                            <Text style={styles.title}>{reward.title}</Text>

                            {/* Puntos necesarios */}
                            <View style={styles.pointsCard}>
                                <View style={styles.pointsInfo}>
                                    <Icon name="leaf" size={24} color="#018f64" />
                                    <View style={styles.pointsTextContainer}>
                                        <Text style={styles.pointsLabel}>Puntos necesarios</Text>
                                        <Text style={styles.pointsValue}>{reward.points} EcoPuntos</Text>
                                    </View>
                                </View>
                                
                                {!canRedeem && (
                                    <View style={styles.needContainer}>
                                        <Icon name="alert-circle" size={18} color="#FF5252" />
                                        <Text style={styles.needText}>
                                            Te faltan {pointsNeeded} puntos
                                        </Text>
                                    </View>
                                )}

                                {canRedeem && (
                                    <View style={styles.canRedeemContainer}>
                                        <Icon name="check-circle" size={18} color="#4CAF50" />
                                        <Text style={styles.canRedeemText}>
                                            ¡Puedes canjearlo!
                                        </Text>
                                    </View>
                                )}
                            </View>

                            {/* Descripción */}
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Descripción</Text>
                                <Text style={styles.description}>{reward.description}</Text>
                            </View>

                            {/* Detalles adicionales */}
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Detalles</Text>
                                <View style={styles.detailRow}>
                                    <Icon name="package-variant" size={20} color="#666" />
                                    <Text style={styles.detailText}>Stock disponible: {reward.stock} unidades</Text>
                                </View>
                                {reward.expiryDate && (
                                    <View style={styles.detailRow}>
                                        <Icon name="calendar-clock" size={20} color="#666" />
                                        <Text style={styles.detailText}>Válido hasta: {reward.expiryDate}</Text>
                                    </View>
                                )}
                                {reward.sponsor && (
                                    <View style={styles.detailRow}>
                                        <Icon name="handshake" size={20} color="#666" />
                                        <Text style={styles.detailText}>Patrocinado por: {reward.sponsor}</Text>
                                    </View>
                                )}
                            </View>

                            {/* Términos y condiciones */}
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Términos y Condiciones</Text>
                                <Text style={styles.termsText}>{reward.terms}</Text>
                            </View>
                        </View>
                    </ScrollView>

                    {/* Footer con botón de canje */}
                    <View style={styles.footer}>
                        <TouchableOpacity
                            style={[
                                styles.redeemButton,
                                !canRedeem && styles.redeemButtonDisabled
                            ]}
                            onPress={onRedeem}
                            disabled={!canRedeem}
                        >
                            <Icon 
                                name={canRedeem ? "gift" : "lock"} 
                                size={20} 
                                color={canRedeem ? "#FFF" : "#999"} 
                            />
                            <Text style={[
                                styles.redeemButtonText,
                                !canRedeem && styles.redeemButtonTextDisabled
                            ]}>
                                {canRedeem ? 'Canjear Premio' : `Faltan ${pointsNeeded} puntos`}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '90%',
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    closeButton: {
        padding: 4,
    },
    imageContainer: {
        width: '100%',
        height: 250,
        backgroundColor: '#F5F5F5',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    lockedOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    lockedText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 8,
    },
    contentContainer: {
        padding: 20,
    },
    categoryBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E8F5F1',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        alignSelf: 'flex-start',
        marginBottom: 12,
    },
    categoryText: {
        fontSize: 12,
        color: '#018f64',
        fontWeight: '600',
        marginLeft: 4,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#32243B',
        marginBottom: 16,
    },
    pointsCard: {
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
    },
    pointsInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    pointsTextContainer: {
        marginLeft: 12,
        flex: 1,
    },
    pointsLabel: {
        fontSize: 13,
        color: '#666',
        marginBottom: 4,
    },
    pointsValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#018f64',
    },
    needContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFEBEE',
        padding: 12,
        borderRadius: 8,
    },
    needText: {
        fontSize: 14,
        color: '#FF5252',
        fontWeight: '600',
        marginLeft: 8,
    },
    canRedeemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E8F5E9',
        padding: 12,
        borderRadius: 8,
    },
    canRedeemText: {
        fontSize: 14,
        color: '#4CAF50',
        fontWeight: '600',
        marginLeft: 8,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#32243B',
        marginBottom: 12,
    },
    description: {
        fontSize: 15,
        color: '#666',
        lineHeight: 24,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    detailText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 12,
        flex: 1,
    },
    termsText: {
        fontSize: 13,
        color: '#999',
        lineHeight: 20,
    },
    footer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    redeemButton: {
        backgroundColor: '#018f64',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 12,
    },
    redeemButtonDisabled: {
        backgroundColor: '#E0E0E0',
    },
    redeemButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    redeemButtonTextDisabled: {
        color: '#999',
    },
});
