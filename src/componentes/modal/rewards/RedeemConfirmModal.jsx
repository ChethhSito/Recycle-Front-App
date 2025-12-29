import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

export const RedeemConfirmModal = ({ visible, reward, userPoints, onClose, onConfirm }) => {
    if (!reward) return null;

    const pointsAfter = userPoints - reward.points;

    return (
        <Modal
            visible={visible}
            animationType="fade"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    {/* Icono */}
                    <View style={styles.iconContainer}>
                        <Icon name="gift" size={48} color="#018f64" />
                    </View>

                    {/* Título */}
                    <Text style={styles.title}>Confirmar Canje</Text>

                    {/* Descripción */}
                    <Text style={styles.message}>
                        ¿Estás seguro que deseas canjear tus puntos por:
                    </Text>

                    {/* Premio */}
                    <View style={styles.rewardInfo}>
                        <Text style={styles.rewardTitle}>{reward.title}</Text>
                        <View style={styles.pointsRow}>
                            <Icon name="leaf" size={18} color="#018f64" />
                            <Text style={styles.pointsText}>{reward.points} EcoPuntos</Text>
                        </View>
                    </View>

                    {/* Balance de puntos */}
                    <View style={styles.balanceContainer}>
                        <View style={styles.balanceRow}>
                            <Text style={styles.balanceLabel}>Tus puntos actuales:</Text>
                            <Text style={styles.balanceValue}>{userPoints}</Text>
                        </View>
                        <View style={styles.balanceRow}>
                            <Text style={styles.balanceLabel}>Puntos a canjear:</Text>
                            <Text style={[styles.balanceValue, styles.negative]}>-{reward.points}</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.balanceRow}>
                            <Text style={styles.balanceLabelBold}>Puntos restantes:</Text>
                            <Text style={[styles.balanceValueBold, pointsAfter < 100 && styles.warning]}>
                                {pointsAfter}
                            </Text>
                        </View>
                    </View>

                    {/* Advertencia si quedan pocos puntos */}
                    {pointsAfter < 100 && (
                        <View style={styles.warningContainer}>
                            <Icon name="alert" size={16} color="#FF9800" />
                            <Text style={styles.warningText}>
                                Te quedarán pocos puntos. ¡Sigue reciclando!
                            </Text>
                        </View>
                    )}

                    {/* Nota informativa */}
                    <Text style={styles.infoText}>
                        Recibirás un código de canje que podrás usar para reclamar tu premio.
                    </Text>

                    {/* Botones */}
                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={onClose}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.cancelButtonText}>Cancelar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.button, styles.confirmButton]}
                            onPress={onConfirm}
                            activeOpacity={0.8}
                        >
                            <Icon name="check" size={20} color="#FFF" />
                            <Text style={styles.confirmButtonText}>Confirmar</Text>
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
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 24,
        width: '100%',
        maxWidth: 400,
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#E8F5F1',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#32243B',
        marginBottom: 12,
        textAlign: 'center',
    },
    message: {
        fontSize: 15,
        color: '#666',
        textAlign: 'center',
        marginBottom: 16,
        lineHeight: 22,
    },
    rewardInfo: {
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        padding: 16,
        width: '100%',
        marginBottom: 16,
        alignItems: 'center',
    },
    rewardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#32243B',
        marginBottom: 8,
        textAlign: 'center',
    },
    pointsRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    pointsText: {
        fontSize: 15,
        color: '#018f64',
        fontWeight: '600',
        marginLeft: 6,
    },
    balanceContainer: {
        width: '100%',
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    balanceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    balanceLabel: {
        fontSize: 14,
        color: '#666',
    },
    balanceLabelBold: {
        fontSize: 15,
        color: '#32243B',
        fontWeight: 'bold',
    },
    balanceValue: {
        fontSize: 14,
        color: '#32243B',
        fontWeight: '600',
    },
    balanceValueBold: {
        fontSize: 18,
        color: '#018f64',
        fontWeight: 'bold',
    },
    negative: {
        color: '#FF5252',
    },
    warning: {
        color: '#FF9800',
    },
    divider: {
        height: 1,
        backgroundColor: '#E0E0E0',
        marginVertical: 8,
    },
    warningContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF3E0',
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
        width: '100%',
    },
    warningText: {
        fontSize: 13,
        color: '#FF9800',
        marginLeft: 8,
        flex: 1,
    },
    infoText: {
        fontSize: 13,
        color: '#999',
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 18,
    },
    buttonsContainer: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
    },
    button: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    cancelButton: {
        backgroundColor: '#F3F4F6',
    },
    confirmButton: {
        backgroundColor: '#018f64',
    },
    cancelButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#32243B',
    },
    confirmButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#FFF',
        marginLeft: 6,
    },
});
