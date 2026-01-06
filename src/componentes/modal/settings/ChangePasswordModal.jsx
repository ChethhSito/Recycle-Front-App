import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    ScrollView,
    TextInput,
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

export const ChangePasswordModal = ({ visible, onClose }) => {
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

    const handleChangePasswordRequest = () => {
        if (isPasswordValid()) {
            setShowConfirmModal(true);
        }
    };

    const handleConfirmChange = () => {
        setShowConfirmModal(false);
        // Aquí iría la lógica para cambiar la contraseña en el backend
        setTimeout(() => {
            setShowSuccessModal(true);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        }, 300);
    };

    const handleSuccessClose = () => {
        setShowSuccessModal(false);
        onClose();
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
            {/* Modal Principal: Formulario de cambio de contraseña */}
            <Modal
                visible={visible && !showConfirmModal && !showSuccessModal}
                animationType="slide"
                transparent={true}
                onRequestClose={handleCloseAll}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        {/* Header */}
                        <View style={styles.header}>
                            <Text style={styles.title}>Cambiar Contraseña</Text>
                            <TouchableOpacity onPress={handleCloseAll} style={styles.closeButton}>
                                <Icon name="close" size={28} color="#32243B" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={styles.content}>
                                <Text style={styles.description}>
                                    Crea una contraseña segura de al menos 8 caracteres
                                </Text>

                                {/* Contraseña Actual */}
                                <View style={styles.inputGroup}>
                                    <Text style={styles.inputLabel}>Contraseña Actual</Text>
                                    <View style={styles.passwordInputContainer}>
                                        <TextInput
                                            style={styles.passwordInput}
                                            value={currentPassword}
                                            onChangeText={setCurrentPassword}
                                            placeholder="Ingresa tu contraseña actual"
                                            placeholderTextColor="#9CA3AF"
                                            secureTextEntry={!showCurrentPassword}
                                        />
                                        <TouchableOpacity
                                            onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                                            style={styles.eyeButton}
                                        >
                                            <Icon 
                                                name={showCurrentPassword ? 'eye-off' : 'eye'} 
                                                size={20} 
                                                color="#6B7280" 
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                {/* Nueva Contraseña */}
                                <View style={styles.inputGroup}>
                                    <Text style={styles.inputLabel}>Nueva Contraseña</Text>
                                    <View style={styles.passwordInputContainer}>
                                        <TextInput
                                            style={styles.passwordInput}
                                            value={newPassword}
                                            onChangeText={setNewPassword}
                                            placeholder="Ingresa tu nueva contraseña"
                                            placeholderTextColor="#9CA3AF"
                                            secureTextEntry={!showNewPassword}
                                        />
                                        <TouchableOpacity
                                            onPress={() => setShowNewPassword(!showNewPassword)}
                                            style={styles.eyeButton}
                                        >
                                            <Icon 
                                                name={showNewPassword ? 'eye-off' : 'eye'} 
                                                size={20} 
                                                color="#6B7280" 
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                {/* Confirmar Nueva Contraseña */}
                                <View style={styles.inputGroup}>
                                    <Text style={styles.inputLabel}>Confirmar Nueva Contraseña</Text>
                                    <View style={styles.passwordInputContainer}>
                                        <TextInput
                                            style={styles.passwordInput}
                                            value={confirmPassword}
                                            onChangeText={setConfirmPassword}
                                            placeholder="Confirma tu nueva contraseña"
                                            placeholderTextColor="#9CA3AF"
                                            secureTextEntry={!showConfirmPassword}
                                        />
                                        <TouchableOpacity
                                            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                            style={styles.eyeButton}
                                        >
                                            <Icon 
                                                name={showConfirmPassword ? 'eye-off' : 'eye'} 
                                                size={20} 
                                                color="#6B7280" 
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                {/* Requisitos de Contraseña */}
                                <View style={styles.requirementsContainer}>
                                    <Text style={styles.requirementsTitle}>La contraseña debe contener:</Text>
                                    <View style={styles.requirementItem}>
                                        <Icon 
                                            name={newPassword.length >= 8 ? 'check-circle' : 'circle-outline'} 
                                            size={16} 
                                            color={newPassword.length >= 8 ? '#10B981' : '#9CA3AF'} 
                                        />
                                        <Text style={[
                                            styles.requirementText,
                                            newPassword.length >= 8 && styles.requirementTextValid
                                        ]}>
                                            Al menos 8 caracteres
                                        </Text>
                                    </View>
                                    <View style={styles.requirementItem}>
                                        <Icon 
                                            name={/[A-Z]/.test(newPassword) ? 'check-circle' : 'circle-outline'} 
                                            size={16} 
                                            color={/[A-Z]/.test(newPassword) ? '#10B981' : '#9CA3AF'} 
                                        />
                                        <Text style={[
                                            styles.requirementText,
                                            /[A-Z]/.test(newPassword) && styles.requirementTextValid
                                        ]}>
                                            Una letra mayúscula
                                        </Text>
                                    </View>
                                    <View style={styles.requirementItem}>
                                        <Icon 
                                            name={/[0-9]/.test(newPassword) ? 'check-circle' : 'circle-outline'} 
                                            size={16} 
                                            color={/[0-9]/.test(newPassword) ? '#10B981' : '#9CA3AF'} 
                                        />
                                        <Text style={[
                                            styles.requirementText,
                                            /[0-9]/.test(newPassword) && styles.requirementTextValid
                                        ]}>
                                            Un número
                                        </Text>
                                    </View>
                                    <View style={styles.requirementItem}>
                                        <Icon 
                                            name={newPassword === confirmPassword && newPassword.length > 0 ? 'check-circle' : 'circle-outline'} 
                                            size={16} 
                                            color={newPassword === confirmPassword && newPassword.length > 0 ? '#10B981' : '#9CA3AF'} 
                                        />
                                        <Text style={[
                                            styles.requirementText,
                                            newPassword === confirmPassword && newPassword.length > 0 && styles.requirementTextValid
                                        ]}>
                                            Las contraseñas coinciden
                                        </Text>
                                    </View>
                                </View>

                                {/* Botón Cambiar Contraseña */}
                                <TouchableOpacity
                                    style={[
                                        styles.changeButton,
                                        !isPasswordValid() && styles.changeButtonDisabled
                                    ]}
                                    onPress={handleChangePasswordRequest}
                                    disabled={!isPasswordValid()}
                                >
                                    <Icon 
                                        name="lock-reset" 
                                        size={20} 
                                        color={isPasswordValid() ? '#FFF' : '#9CA3AF'} 
                                    />
                                    <Text style={[
                                        styles.changeButtonText,
                                        !isPasswordValid() && styles.changeButtonTextDisabled
                                    ]}>
                                        Cambiar Contraseña
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* Modal de Confirmación */}
            <Modal
                visible={showConfirmModal}
                animationType="fade"
                transparent={true}
                onRequestClose={() => setShowConfirmModal(false)}
            >
                <View style={styles.confirmModalOverlay}>
                    <View style={styles.confirmModalContent}>
                        {/* Icono de Escudo con fondo */}
                        <View style={styles.confirmIconContainer}>
                            <Icon name="shield-check" color="#FAC96E" size={48} />
                        </View>

                        <Text style={styles.confirmTitle}>¿Cambiar Contraseña?</Text>
                        <Text style={styles.confirmText}>
                            ¿Estás seguro de que deseas cambiar tu contraseña? Esta acción actualizará tu método de acceso.
                        </Text>

                        {/* Botones */}
                        <View style={styles.confirmButtons}>
                            <TouchableOpacity
                                style={styles.cancelConfirmButton}
                                onPress={() => setShowConfirmModal(false)}
                            >
                                <Text style={styles.cancelConfirmButtonText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.acceptConfirmButton}
                                onPress={handleConfirmChange}
                            >
                                <Text style={styles.acceptConfirmButtonText}>Sí, Cambiar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Modal de Éxito */}
            <Modal
                visible={showSuccessModal}
                animationType="fade"
                transparent={true}
                onRequestClose={handleSuccessClose}
            >
                <View style={styles.confirmModalOverlay}>
                    <View style={styles.confirmModalContent}>
                        {/* Icono de Check con fondo */}
                        <View style={styles.successIconContainer}>
                            <Icon name="check-circle" color="#10B981" size={48} />
                        </View>

                        <Text style={styles.successTitle}>¡Contraseña Cambiada!</Text>
                        <Text style={styles.confirmText}>
                            Tu contraseña se ha actualizado correctamente. Por favor, úsala en tu próximo inicio de sesión.
                        </Text>

                        <TouchableOpacity
                            style={styles.successButton}
                            onPress={handleSuccessClose}
                        >
                            <Text style={styles.successButtonText}>Entendido</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    // Modal Principal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '90%',
        paddingBottom: 30,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    closeButton: {
        padding: 4,
    },
    content: {
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    description: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 20,
        textAlign: 'center',
    },
    inputGroup: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    passwordInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        paddingHorizontal: 12,
    },
    passwordInput: {
        flex: 1,
        height: 48,
        fontSize: 15,
        color: '#1F2937',
    },
    eyeButton: {
        padding: 8,
    },
    requirementsContainer: {
        backgroundColor: '#F0FDF4',
        padding: 16,
        borderRadius: 12,
        marginTop: 8,
        marginBottom: 20,
    },
    requirementsTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 12,
    },
    requirementItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    requirementText: {
        fontSize: 13,
        color: '#9CA3AF',
        marginLeft: 8,
    },
    requirementTextValid: {
        color: '#10B981',
    },
    changeButton: {
        backgroundColor: '#018f64',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 12,
        gap: 8,
    },
    changeButtonDisabled: {
        backgroundColor: '#F3F4F6',
    },
    changeButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFF',
    },
    changeButtonTextDisabled: {
        color: '#9CA3AF',
    },

    // Modal de Confirmación y Éxito
    confirmModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    confirmModalContent: {
        backgroundColor: '#FFFFFF',
        padding: 28,
        borderRadius: 20,
        alignItems: 'center',
        width: '100%',
        maxWidth: 380,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
    },
    confirmIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#FEF3C7',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    successIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#D1FAE5',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    confirmTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 12,
        textAlign: 'center',
    },
    successTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#10B981',
        marginBottom: 12,
        textAlign: 'center',
    },
    confirmText: {
        fontSize: 15,
        textAlign: 'center',
        color: '#6B7280',
        marginBottom: 28,
        lineHeight: 22,
    },
    confirmButtons: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
    },
    cancelConfirmButton: {
        flex: 1,
        backgroundColor: '#F3F4F6',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    cancelConfirmButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#6B7280',
    },
    acceptConfirmButton: {
        flex: 1,
        backgroundColor: '#018f64',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#018f64',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    acceptConfirmButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFF',
    },
    successButton: {
        backgroundColor: '#10B981',
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 12,
        width: '100%',
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    successButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFF',
    },
});
