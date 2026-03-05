import React, { useState } from 'react';
import {
    View, StyleSheet, Modal, TouchableOpacity, ScrollView, TextInput, Platform
} from 'react-native';
import { Text, useTheme, Divider } from 'react-native-paper'; // 🚀 Paper para temas
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useTranslation } from '../../../hooks/use-translation';

export const ChangePasswordModal = ({ visible, onClose }) => {
    const theme = useTheme(); // 🎨 Obtenemos el tema
    const { colors, dark } = theme;
    const t = useTranslation(); // 🗣️ Cargamos traducciones
    const tp = t.password; // Atajo para no escribir t.settings.password...

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const isPasswordValid = () => {
        return newPassword.length >= 8 &&
            /[A-Z]/.test(newPassword) &&
            /[0-9]/.test(newPassword) &&
            newPassword === confirmPassword &&
            currentPassword.length > 0;
    };

    const handleConfirmChange = () => {
        setShowConfirmModal(false);
        // Aquí iría la lógica del backend
        setTimeout(() => {
            setShowSuccessModal(true);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        }, 300);
    };

    const handleCloseAll = () => {
        setShowConfirmModal(false);
        setShowSuccessModal(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        onClose();
    };

    return (
        <>
            <Modal
                visible={visible && !showConfirmModal && !showSuccessModal}
                animationType="slide"
                transparent={true}
                onRequestClose={handleCloseAll}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
                        <View style={[styles.header, { borderBottomColor: colors.outlineVariant }]}>
                            <Text style={[styles.title, { color: colors.onSurface }]}>{t.settings.changePassword}</Text>
                            <TouchableOpacity onPress={handleCloseAll}>
                                <Icon name="close" size={28} color={colors.onSurface} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={styles.content}>
                                <Text style={[styles.description, { color: colors.onSurfaceVariant }]}>{tp.description}</Text>

                                {/* Inputs con colores dinámicos */}
                                {[
                                    { label: tp.currentLabel, val: currentPassword, set: setCurrentPassword, show: showCurrentPassword, setShow: setShowCurrentPassword, placeholder: tp.currentPlaceholder },
                                    { label: tp.newLabel, val: newPassword, set: setNewPassword, show: showNewPassword, setShow: setShowNewPassword, placeholder: tp.newPlaceholder },
                                    { label: tp.confirmLabel, val: confirmPassword, set: setConfirmPassword, show: showConfirmPassword, setShow: setShowConfirmPassword, placeholder: tp.confirmPlaceholder }
                                ].map((item, index) => (
                                    <View key={index} style={styles.inputGroup}>
                                        <Text style={[styles.inputLabel, { color: colors.onSurface }]}>{item.label}</Text>
                                        <View style={[styles.passwordInputContainer, { backgroundColor: colors.surfaceVariant, borderColor: colors.outline }]}>
                                            <TextInput
                                                style={[styles.passwordInput, { color: colors.onSurface }]}
                                                value={item.val}
                                                onChangeText={item.set}
                                                placeholder={item.placeholder}
                                                placeholderTextColor={colors.onSurfaceVariant}
                                                secureTextEntry={!item.show}
                                            />
                                            <TouchableOpacity onPress={() => item.setShow(!item.show)} style={styles.eyeButton}>
                                                <Icon name={item.show ? 'eye-off' : 'eye'} size={20} color={colors.onSurfaceVariant} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ))}

                                {/* Requisitos Adaptables */}
                                <View style={[styles.requirementsContainer, { backgroundColor: dark ? 'rgba(0, 199, 161, 0.1)' : '#F0FDF4' }]}>
                                    <Text style={[styles.requirementsTitle, { color: colors.onSurface }]}>{tp.reqTitle}</Text>
                                    {[
                                        { check: newPassword.length >= 8, text: tp.reqChars },
                                        { check: /[A-Z]/.test(newPassword), text: tp.reqUpper },
                                        { check: /[0-9]/.test(newPassword), text: tp.reqNumber },
                                        { check: newPassword === confirmPassword && newPassword.length > 0, text: tp.reqMatch }
                                    ].map((req, i) => (
                                        <View key={i} style={styles.requirementItem}>
                                            <Icon name={req.check ? 'check-circle' : 'circle-outline'} size={16} color={req.check ? '#10B981' : colors.onSurfaceVariant} />
                                            <Text style={[styles.requirementText, { color: req.check ? '#10B981' : colors.onSurfaceVariant }]}>{req.text}</Text>
                                        </View>
                                    ))}
                                </View>

                                <TouchableOpacity
                                    style={[styles.changeButton, { backgroundColor: isPasswordValid() ? colors.primary : colors.surfaceVariant }]}
                                    onPress={() => setShowConfirmModal(true)}
                                    disabled={!isPasswordValid()}
                                >
                                    <Icon name="lock-reset" size={20} color={isPasswordValid() ? '#FFF' : colors.onSurfaceVariant} />
                                    <Text style={[styles.changeButtonText, { color: isPasswordValid() ? '#FFF' : colors.onSurfaceVariant }]}>{tp.btnChange}</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* Modal de Confirmación Adaptado */}
            <Modal visible={showConfirmModal} transparent animationType="fade">
                <View style={styles.confirmModalOverlay}>
                    <View style={[styles.confirmModalContent, { backgroundColor: colors.surface }]}>
                        <View style={[styles.confirmIconContainer, { backgroundColor: dark ? 'rgba(250, 201, 110, 0.1)' : '#FEF3C7' }]}>
                            <Icon name="shield-check" color="#FAC96E" size={48} />
                        </View>
                        <Text style={[styles.confirmTitle, { color: colors.onSurface }]}>{tp.modalConfirmTitle}</Text>
                        <Text style={[styles.confirmText, { color: colors.onSurfaceVariant }]}>{tp.modalConfirmMsg}</Text>
                        <View style={styles.confirmButtons}>
                            <TouchableOpacity style={[styles.cancelConfirmButton, { backgroundColor: colors.surfaceVariant }]} onPress={() => setShowConfirmModal(false)}>
                                <Text style={{ color: colors.onSurface }}>{tp.btnCancel}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.acceptConfirmButton, { backgroundColor: colors.primary }]} onPress={handleConfirmChange}>
                                <Text style={{ color: '#FFF', fontWeight: 'bold' }}>{tp.btnConfirm}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Modal de Éxito Adaptado */}
            <Modal visible={showSuccessModal} transparent animationType="fade">
                <View style={styles.confirmModalOverlay}>
                    <View style={[styles.confirmModalContent, { backgroundColor: colors.surface }]}>
                        <View style={[styles.successIconContainer, { backgroundColor: dark ? 'rgba(16, 185, 129, 0.1)' : '#D1FAE5' }]}>
                            <Icon name="check-circle" color="#10B981" size={48} />
                        </View>
                        <Text style={[styles.successTitle, { color: '#10B981' }]}>{tp.modalSuccessTitle}</Text>
                        <Text style={[styles.confirmText, { color: colors.onSurfaceVariant }]}>{tp.modalSuccessMsg}</Text>
                        <TouchableOpacity style={[styles.successButton, { backgroundColor: colors.primary }]} onPress={handleCloseAll}>
                            <Text style={styles.successButtonText}>{tp.btnOk}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.6)', justifyContent: 'flex-end' },
    modalContent: { borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '90%', paddingBottom: 30 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 15, borderBottomWidth: 1 },
    title: { fontSize: 20, fontWeight: 'bold' },
    content: { paddingHorizontal: 20, paddingVertical: 20 },
    description: { fontSize: 14, marginBottom: 20, textAlign: 'center' },
    inputGroup: { marginBottom: 16 },
    inputLabel: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
    passwordInputContainer: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, borderWidth: 1, paddingHorizontal: 12 },
    passwordInput: { flex: 1, height: 48, fontSize: 15 },
    eyeButton: { padding: 8 },
    requirementsContainer: { padding: 16, borderRadius: 12, marginTop: 8, marginBottom: 20 },
    requirementsTitle: { fontSize: 14, fontWeight: '600', marginBottom: 12 },
    requirementItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    requirementText: { fontSize: 13, marginLeft: 8 },
    changeButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 12, gap: 8 },
    changeButtonText: { fontSize: 16, fontWeight: '600' },
    confirmModalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.7)', justifyContent: 'center', alignItems: 'center', padding: 20 },
    confirmModalContent: { padding: 28, borderRadius: 20, alignItems: 'center', width: '100%', maxWidth: 380, elevation: 10 },
    confirmIconContainer: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
    successIconContainer: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
    confirmTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' },
    successTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' },
    confirmText: { fontSize: 15, textAlign: 'center', marginBottom: 28, lineHeight: 22 },
    confirmButtons: { flexDirection: 'row', gap: 12, width: '100%' },
    cancelConfirmButton: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
    acceptConfirmButton: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
    successButton: { paddingVertical: 14, paddingHorizontal: 32, borderRadius: 12, width: '100%', alignItems: 'center' },
    successButtonText: { fontSize: 16, fontWeight: '600', color: '#FFF' },
});