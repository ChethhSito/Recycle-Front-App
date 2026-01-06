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

export const DeleteAccountModal = ({ visible, onClose }) => {
    const [confirmText, setConfirmText] = useState('');
    const [showFinalConfirm, setShowFinalConfirm] = useState(false);

    const canDelete = confirmText === 'ELIMINAR';

    const handleDeleteRequest = () => {
        if (canDelete) {
            setShowFinalConfirm(true);
        }
    };

    const handleConfirmDelete = () => {
        setShowFinalConfirm(false);
        // Aquí iría la lógica para eliminar la cuenta en el backend
        console.log('Cuenta eliminada');
        setConfirmText('');
        onClose();
    };

    const handleCloseAll = () => {
        setShowFinalConfirm(false);
        setConfirmText('');
        onClose();
    };

    return (
        <>
            {/* Modal Principal */}
            <Modal
                visible={visible && !showFinalConfirm}
                animationType="slide"
                transparent={true}
                onRequestClose={handleCloseAll}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        {/* Header */}
                        <View style={styles.header}>
                            <Text style={styles.title}>Eliminar Cuenta</Text>
                            <TouchableOpacity onPress={handleCloseAll} style={styles.closeButton}>
                                <Icon name="close" size={28} color="#32243B" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={styles.content}>
                                {/* Icono de Advertencia */}
                                <View style={styles.warningIconContainer}>
                                    <Icon name="alert-circle" size={80} color="#EF4444" />
                                </View>

                                <Text style={styles.warningTitle}>
                                    ¿Estás seguro de eliminar tu cuenta?
                                </Text>

                                <Text style={styles.warningText}>
                                    Esta acción es permanente y no se puede deshacer. Perderás:
                                </Text>

                                {/* Lista de pérdidas */}
                                <View style={styles.lossList}>
                                    <View style={styles.lossItem}>
                                        <Icon name="close-circle" size={20} color="#EF4444" />
                                        <Text style={styles.lossText}>Todos tus EcoPuntos acumulados</Text>
                                    </View>
                                    <View style={styles.lossItem}>
                                        <Icon name="close-circle" size={20} color="#EF4444" />
                                        <Text style={styles.lossText}>Historial de reciclaje completo</Text>
                                    </View>
                                    <View style={styles.lossItem}>
                                        <Icon name="close-circle" size={20} color="#EF4444" />
                                        <Text style={styles.lossText}>Recompensas pendientes de canjear</Text>
                                    </View>
                                    <View style={styles.lossItem}>
                                        <Icon name="close-circle" size={20} color="#EF4444" />
                                        <Text style={styles.lossText}>Acceso a convenios y beneficios</Text>
                                    </View>
                                    <View style={styles.lossItem}>
                                        <Icon name="close-circle" size={20} color="#EF4444" />
                                        <Text style={styles.lossText}>Toda tu información de perfil</Text>
                                    </View>
                                </View>

                                {/* Confirmación por texto */}
                                <View style={styles.confirmSection}>
                                    <Text style={styles.confirmLabel}>
                                        Para continuar, escribe <Text style={styles.confirmKeyword}>ELIMINAR</Text> en el campo:
                                    </Text>
                                    <TextInput
                                        style={styles.confirmInput}
                                        value={confirmText}
                                        onChangeText={setConfirmText}
                                        placeholder="Escribe ELIMINAR"
                                        placeholderTextColor="#9CA3AF"
                                        autoCapitalize="characters"
                                    />
                                </View>

                                {/* Botones */}
                                <TouchableOpacity
                                    style={[
                                        styles.deleteButton,
                                        !canDelete && styles.deleteButtonDisabled
                                    ]}
                                    onPress={handleDeleteRequest}
                                    disabled={!canDelete}
                                >
                                    <Icon 
                                        name="delete-forever" 
                                        size={20} 
                                        color={canDelete ? '#FFF' : '#9CA3AF'} 
                                    />
                                    <Text style={[
                                        styles.deleteButtonText,
                                        !canDelete && styles.deleteButtonTextDisabled
                                    ]}>
                                        Eliminar Mi Cuenta
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.cancelButton}
                                    onPress={handleCloseAll}
                                >
                                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* Modal de Confirmación Final */}
            <Modal
                visible={showFinalConfirm}
                animationType="fade"
                transparent={true}
                onRequestClose={() => setShowFinalConfirm(false)}
            >
                <View style={styles.confirmModalOverlay}>
                    <View style={styles.confirmModalContent}>
                        <View style={styles.confirmIconContainer}>
                            <Icon name="alert-octagon" color="#EF4444" size={48} />
                        </View>

                        <Text style={styles.confirmTitle}>Última Confirmación</Text>
                        <Text style={styles.confirmText}>
                            ¿Realmente deseas eliminar tu cuenta de forma permanente? No podrás recuperar tu información después.
                        </Text>

                        <View style={styles.confirmButtons}>
                            <TouchableOpacity
                                style={styles.backButton}
                                onPress={() => setShowFinalConfirm(false)}
                            >
                                <Text style={styles.backButtonText}>No, Volver</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.finalDeleteButton}
                                onPress={handleConfirmDelete}
                            >
                                <Text style={styles.finalDeleteButtonText}>Sí, Eliminar</Text>
                            </TouchableOpacity>
                        </View>
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
        color: '#EF4444',
    },
    closeButton: {
        padding: 4,
    },
    content: {
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    warningIconContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    warningTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1F2937',
        textAlign: 'center',
        marginBottom: 12,
    },
    warningText: {
        fontSize: 15,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 20,
    },
    lossList: {
        backgroundColor: '#FEF2F2',
        padding: 16,
        borderRadius: 12,
        marginBottom: 24,
    },
    lossItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    lossText: {
        fontSize: 14,
        color: '#991B1B',
        marginLeft: 12,
        flex: 1,
    },
    confirmSection: {
        marginBottom: 20,
    },
    confirmLabel: {
        fontSize: 14,
        color: '#374151',
        marginBottom: 12,
        textAlign: 'center',
    },
    confirmKeyword: {
        fontWeight: 'bold',
        color: '#EF4444',
    },
    confirmInput: {
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 15,
        color: '#1F2937',
        textAlign: 'center',
        fontWeight: '600',
    },
    deleteButton: {
        backgroundColor: '#EF4444',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 12,
        gap: 8,
        marginBottom: 12,
    },
    deleteButtonDisabled: {
        backgroundColor: '#F3F4F6',
    },
    deleteButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFF',
    },
    deleteButtonTextDisabled: {
        color: '#9CA3AF',
    },
    cancelButton: {
        paddingVertical: 14,
        alignItems: 'center',
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#6B7280',
    },

    // Modal de Confirmación Final
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
        backgroundColor: '#FEE2E2',
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
    backButton: {
        flex: 1,
        backgroundColor: '#F3F4F6',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    backButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#6B7280',
    },
    finalDeleteButton: {
        flex: 1,
        backgroundColor: '#EF4444',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#EF4444',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    finalDeleteButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFF',
    },
});
