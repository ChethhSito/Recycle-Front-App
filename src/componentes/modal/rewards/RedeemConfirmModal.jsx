import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useTranslation } from '../../../hooks/use-translation';
import { useTheme } from 'react-native-paper';

export const RedeemConfirmModal = ({ visible, reward, userPoints, onClose, onConfirm }) => {
    const theme = useTheme();
    const { colors } = theme;
    const t = useTranslation();

    if (!reward) return null;

    const pointsAfter = userPoints - reward.points;
    const isLowPoints = pointsAfter < 100;

    return (
        <Modal visible={visible} animationType="fade" transparent={true} onRequestClose={onClose}>
            <View style={styles.modalOverlay}>
                <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
                    <View style={[styles.iconContainer, { backgroundColor: colors.primaryContainer }]}>
                        <Icon name="gift" size={48} color={colors.primary} />
                    </View>

                    <Text style={[styles.title, { color: colors.onSurface }]}>{t.rewards.modal.confirmTitle}</Text>
                    <Text style={[styles.message, { color: colors.onSurfaceVariant }]}>{t.rewards.modal.confirmPrompt}</Text>

                    <View style={[styles.rewardInfo, { backgroundColor: colors.elevation.level1 }]}>
                        <Text style={[styles.rewardTitle, { color: colors.onSurface }]}>{reward.title}</Text>
                        <View style={styles.pointsRow}>
                            <Icon name="leaf" size={18} color={colors.primary} />
                            <Text style={[styles.pointsText, { color: colors.primary }]}>{reward.points} {t.home.pointsUnit}</Text>
                        </View>
                    </View>

                    <View style={[styles.balanceContainer, { backgroundColor: colors.elevation.level2 }]}>
                        <BalanceRow label={t.rewards.modal.currentPoints} value={userPoints} color={colors.onSurface} />
                        <BalanceRow label={t.rewards.modal.pointsToRedeem} value={`-${reward.points}`} color={colors.error} />
                        <View style={[styles.divider, { backgroundColor: colors.outlineVariant }]} />
                        <BalanceRow
                            label={t.rewards.modal.remainingPoints}
                            value={pointsAfter}
                            color={isLowPoints ? colors.tertiary : colors.primary}
                            isBold
                        />
                    </View>

                    {isLowPoints && (
                        <View style={[styles.warningContainer, { backgroundColor: colors.tertiaryContainer }]}>
                            <Icon name="alert" size={16} color={colors.tertiary} />
                            <Text style={[styles.warningText, { color: colors.onTertiaryContainer }]}>{t.rewards.modal.warningLow}</Text>
                        </View>
                    )}

                    <Text style={[styles.infoText, { color: colors.onSurfaceVariant }]}>{t.rewards.modal.redeemNote}</Text>

                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity style={[styles.button, { backgroundColor: colors.surfaceVariant }]} onPress={onClose}>
                            <Text style={{ color: colors.onSurfaceVariant, fontWeight: 'bold' }}>{t.rewards.modal.cancel}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={onConfirm}>
                            <Icon name="check" size={20} color={colors.onPrimary} />
                            <Text style={{ color: colors.onPrimary, fontWeight: 'bold', marginLeft: 6 }}>{t.rewards.modal.confirm}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};
const BalanceRow = ({ label, value, color, isBold }) => (
    <View style={styles.balanceRow}>
        <Text style={[isBold ? styles.balanceLabelBold : styles.balanceLabel]}>{label}</Text>
        <Text style={[isBold ? styles.balanceValueBold : styles.balanceValue, { color }]}>{value}</Text>
    </View>
);

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
