import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    ScrollView,
    TextInput,
    ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { sendSuspensionEmail } from '../../../api/email/suspension/suspension-email';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { logout } from '../../../store/auth';

export const DeleteAccountModal = ({ visible, onClose, userEmail = 'raulquintanazinc@gmail.com', userName = 'Raul Quintana' }) => {
    const dispatch = useDispatch();
    const [confirmText, setConfirmText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const canSuspend = confirmText.toUpperCase() === 'SUSPENDER';

    const handleConfirmSuspend = async () => {
        if (!canSuspend || isLoading) return;

        setIsLoading(true);
        
        try {
            const suspensionDate = new Date();
            
            // Guardar datos de suspensión
            await AsyncStorage.setItem('account_suspended', JSON.stringify({
                isSuspended: true,
                suspensionDate: suspensionDate.toISOString(),
                userEmail,
                userName
            }));

            // Enviar email de notificación
            const emailResult = await sendSuspensionEmail(userEmail, userName, suspensionDate);
            
            if (emailResult.success) {
                console.log('✅ Email de suspensión enviado');
            } else {
                console.warn('⚠️ Email falló (cuenta suspendida de todos modos)');
            }

            // Cerrar modal principal
            setConfirmText('');
            onClose();

            // Mostrar modal de éxito
            setShowSuccessModal(true);

            // Después de 2 segundos, cerrar sesión (Redux maneja la navegación)
            setTimeout(() => {
                setShowSuccessModal(false);
                dispatch(logout());
            }, 2000);

        } catch (error) {
            console.error('Error al suspender cuenta:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setConfirmText('');
        onClose();
    };

    return (
        <>
            {/* Modal Principal */}
            <Modal
                visible={visible}
                animationType="slide"
                transparent={true}
                onRequestClose={handleClose}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        {/* Header con Gradient */}
                        <LinearGradient
                            colors={['#F59E0B', '#D97706']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.header}
                        >
                            <Icon name="alert-circle" size={40} color="#FFF" />
                            <Text style={styles.headerTitle}>Suspender Cuenta</Text>
                            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                                <Icon name="close" size={28} color="#FFF" />
                            </TouchableOpacity>
                        </LinearGradient>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={styles.content}>
                                <Text style={styles.title}>
                                    ¿Estás seguro de suspender tu cuenta?
                                </Text>

                                <Text style={styles.description}>
                                    Tu cuenta se suspenderá por <Text style={styles.highlightText}>30 días</Text>. 
                                    Si cambias de opinión, solo inicia sesión para recuperarla. 
                                    Después de 30 días, se eliminará permanentemente.
                                </Text>

                                {/* Countdown Badge */}
                                <View style={styles.countdownBadge}>
                                    <Text style={styles.countdownNumber}>30</Text>
                                    <Text style={styles.countdownLabel}>días de gracia</Text>
                                </View>

                                {/* Lista de pérdidas */}
                                <View style={styles.lossList}>
                                    <Text style={styles.lossListTitle}>Se perderá permanentemente:</Text>
                                    {[
                                        'Todos tus EcoPuntos acumulados',
                                        'Historial de reciclaje completo',
                                        'Recompensas pendientes de canjear',
                                        'Acceso a convenios y beneficios',
                                        'Toda tu información de perfil'
                                    ].map((item, index) => (
                                        <View key={index} style={styles.lossItem}>
                                            <Icon name="close-circle" size={18} color="#DC2626" />
                                            <Text style={styles.lossText}>{item}</Text>
                                        </View>
                                    ))}
                                </View>

                                {/* Input de Confirmación */}
                                <View style={styles.confirmSection}>
                                    <Text style={styles.confirmLabel}>
                                        Para continuar, escribe <Text style={styles.confirmKeyword}>SUSPENDER</Text>
                                    </Text>
                                    <TextInput
                                        style={[
                                            styles.confirmInput,
                                            canSuspend && styles.confirmInputValid
                                        ]}
                                        value={confirmText}
                                        onChangeText={setConfirmText}
                                        placeholder="Escribe SUSPENDER"
                                        placeholderTextColor="#9CA3AF"
                                        autoCapitalize="characters"
                                        editable={!isLoading}
                                    />
                                </View>

                                {/* Botones */}
                                <TouchableOpacity
                                    style={[
                                        styles.suspendButton,
                                        (!canSuspend || isLoading) && styles.suspendButtonDisabled
                                    ]}
                                    onPress={handleConfirmSuspend}
                                    disabled={!canSuspend || isLoading}
                                    activeOpacity={0.8}
                                >
                                    {isLoading ? (
                                        <ActivityIndicator size="small" color="#FFF" />
                                    ) : (
                                        <>
                                            <Icon 
                                                name="clock-alert-outline" 
                                                size={20} 
                                                color="#FFF" 
                                            />
                                            <Text style={styles.suspendButtonText}>
                                                Suspender Mi Cuenta
                                            </Text>
                                        </>
                                    )}
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.cancelButton}
                                    onPress={handleClose}
                                    disabled={isLoading}
                                >
                                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* Modal de Éxito */}
            <Modal
                visible={showSuccessModal}
                animationType="fade"
                transparent={true}
            >
                <View style={styles.successOverlay}>
                    <View style={styles.successContent}>
                        <View style={styles.successIconContainer}>
                            <Icon name="check-circle" size={80} color="#10B981" />
                        </View>
                        <Text style={styles.successTitle}>¡Cuenta Suspendida!</Text>
                        <Text style={styles.successMessage}>
                            Tu cuenta ha sido suspendida por 30 días.{'\n'}
                            Revisa tu email para más información.
                        </Text>
                    </View>
                </View>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
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
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 20,
        gap: 12,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFF',
        flex: 1,
    },
    closeButton: {
        padding: 4,
    },
    content: {
        paddingHorizontal: 24,
        paddingVertical: 28,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1F2937',
        textAlign: 'center',
        marginBottom: 16,
    },
    description: {
        fontSize: 15,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 24,
    },
    highlightText: {
        fontWeight: 'bold',
        color: '#F59E0B',
    },
    countdownBadge: {
        backgroundColor: '#FEF3C7',
        borderRadius: 16,
        paddingVertical: 20,
        paddingHorizontal: 24,
        alignItems: 'center',
        marginBottom: 24,
        borderWidth: 2,
        borderColor: '#F59E0B',
    },
    countdownNumber: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#D97706',
        lineHeight: 48,
    },
    countdownLabel: {
        fontSize: 14,
        color: '#92400E',
        fontWeight: '600',
        marginTop: 4,
    },
    lossList: {
        backgroundColor: '#FEF2F2',
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
    },
    lossListTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#991B1B',
        marginBottom: 12,
    },
    lossItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        gap: 10,
    },
    lossText: {
        fontSize: 14,
        color: '#991B1B',
        flex: 1,
    },
    confirmSection: {
        marginBottom: 24,
    },
    confirmLabel: {
        fontSize: 14,
        color: '#374151',
        marginBottom: 12,
        textAlign: 'center',
    },
    confirmKeyword: {
        fontWeight: 'bold',
        color: '#F59E0B',
    },
    confirmInput: {
        backgroundColor: '#F9FAFB',
        borderWidth: 2,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: '#1F2937',
        textAlign: 'center',
        fontWeight: '600',
    },
    confirmInputValid: {
        borderColor: '#10B981',
        backgroundColor: '#ECFDF5',
    },
    suspendButton: {
        backgroundColor: '#F59E0B',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 12,
        gap: 10,
        marginBottom: 12,
        elevation: 4,
        shadowColor: '#F59E0B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    suspendButtonDisabled: {
        backgroundColor: '#F3F4F6',
        elevation: 0,
        shadowOpacity: 0,
    },
    suspendButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFF',
    },
    cancelButton: {
        paddingVertical: 16,
        alignItems: 'center',
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#6B7280',
    },

    // Modal de Éxito
    successOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    successContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 32,
        alignItems: 'center',
        width: '100%',
        maxWidth: 340,
        elevation: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
    },
    successIconContainer: {
        marginBottom: 20,
    },
    successTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 12,
        textAlign: 'center',
    },
    successMessage: {
        fontSize: 15,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 22,
    },
});
