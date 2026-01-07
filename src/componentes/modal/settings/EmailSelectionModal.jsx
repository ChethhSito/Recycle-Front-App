import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

export const EmailSelectionModal = ({ visible, onClose, onSelectEmail }) => {
    const [customEmail, setCustomEmail] = useState('');
    const [selectedOption, setSelectedOption] = useState('default');

    // Emails predefinidos para testing
    const predefinedEmails = [
        { id: 'default', email: 'raulquintanazinc@gmail.com', label: 'Email Principal' },
    ];

    const handleConfirm = () => {
        let emailToSend = '';
        
        if (selectedOption === 'custom') {
            emailToSend = customEmail.trim();
        } else {
            const selected = predefinedEmails.find(e => e.id === selectedOption);
            emailToSend = selected ? selected.email : predefinedEmails[0].email;
        }

        if (emailToSend) {
            onSelectEmail(emailToSend);
        }
    };

    const isValidEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const canConfirm = selectedOption === 'custom' 
        ? isValidEmail(customEmail) 
        : true;

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Icon name="close" size={28} color="#32243B" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
                        {/* Icono y título */}
                        <View style={styles.headerInfo}>
                            <View style={styles.iconContainer}>
                                <Icon name="email-edit" size={40} color="#018f64" />
                            </View>
                            <Text style={styles.title}>Selecciona el Email</Text>
                            <Text style={styles.subtitle}>
                                Elige el correo donde recibirás el código
                            </Text>
                        </View>

                        {/* Contenido */}
                        <View style={styles.content}>
                            {/* Emails Predefinidos */}
                            <Text style={styles.sectionTitle}>CORREOS DISPONIBLES</Text>
                            {predefinedEmails.map((item) => (
                                <TouchableOpacity
                                    key={item.id}
                                    style={[
                                        styles.emailOption,
                                        selectedOption === item.id && styles.emailOptionSelected
                                    ]}
                                    onPress={() => setSelectedOption(item.id)}
                                    activeOpacity={0.7}
                                >
                                    <View style={styles.emailOptionLeft}>
                                        <View style={[
                                            styles.radioOuter,
                                            selectedOption === item.id && styles.radioOuterSelected
                                        ]}>
                                            {selectedOption === item.id && (
                                                <View style={styles.radioInner} />
                                            )}
                                        </View>
                                        <View style={styles.emailInfo}>
                                            <Text style={styles.emailLabel}>{item.label}</Text>
                                            <Text style={styles.emailText}>{item.email}</Text>
                                        </View>
                                    </View>
                                    <Icon 
                                        name="email-check" 
                                        size={20} 
                                        color={selectedOption === item.id ? '#018f64' : '#9CA3AF'} 
                                    />
                                </TouchableOpacity>
                            ))}

                            {/* Opción Custom */}
                            <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
                                CORREO PERSONALIZADO
                            </Text>
                            <View
                                style={[
                                    styles.emailOption,
                                    styles.emailOptionDisabled
                                ]}
                            >
                                <View style={styles.emailOptionLeft}>
                                    <View style={styles.radioOuter}>
                                        <View style={styles.radioInner} />
                                    </View>
                                    <Text style={styles.emailLabelDisabled}>Escribir otro correo (por el momento no funciona)</Text>
                                </View>
                                <Icon 
                                    name="pencil-off" 
                                    size={24} 
                                    color="#9CA3AF" 
                                />
                            </View>

                            {/* Info */}
                            <View style={styles.infoBox}>
                                <Icon name="information" size={20} color="#3B82F6" />
                                <Text style={styles.infoText}>
                                    El código será válido por 10 minutos
                                </Text>
                            </View>
                        </View>
                    </ScrollView>

                    {/* Footer Buttons */}
                    <View style={styles.footer}>
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={onClose}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.cancelButtonText}>Cancelar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.confirmButton,
                                !canConfirm && styles.confirmButtonDisabled
                            ]}
                            onPress={handleConfirm}
                            disabled={!canConfirm}
                            activeOpacity={0.7}
                        >
                            <Icon name="send" size={20} color="#FFF" />
                            <Text style={styles.confirmButtonText}>Enviar Código</Text>
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 5,
    },
    header: {
        paddingTop: 16,
        paddingHorizontal: 20,
        alignItems: 'flex-end',
    },
    closeButton: {
        padding: 4,
    },
    scrollView: {
        maxHeight: '75%',
    },
    headerInfo: {
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 8,
        paddingBottom: 20,
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
        fontSize: 24,
        fontWeight: 'bold',
        color: '#32243B',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 15,
        color: '#666',
        textAlign: 'center',
        lineHeight: 22,
    },
    content: {
        paddingHorizontal: 24,
        paddingBottom: 24,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '700',
        color: '#018f64',
        marginBottom: 12,
        letterSpacing: 1,
    },
    emailOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#F9FAFB',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 2,
        borderColor: '#E5E7EB',
    },
    emailOptionSelected: {
        backgroundColor: '#E8F5F1',
        borderColor: '#018f64',
    },
    emailOptionDisabled: {
        backgroundColor: '#F3F4F6',
        borderColor: '#D1D5DB',
        opacity: 0.6,
    },
    emailOptionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 12,
    },
    radioOuter: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#D1D5DB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioOuterSelected: {
        borderColor: '#018f64',
    },
    radioInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#018f64',
    },
    emailInfo: {
        flex: 1,
    },
    emailLabel: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 2,
    },
    emailLabelDisabled: {
        fontSize: 15,
        fontWeight: '600',
        color: '#9CA3AF',
        marginBottom: 2,
    },
    emailText: {
        fontSize: 13,
        color: '#6B7280',
    },
    customInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderWidth: 2,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginTop: 12,
        gap: 10,
    },
    customInput: {
        flex: 1,
        fontSize: 15,
        color: '#1F2937',
    },
    infoBox: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#EFF6FF',
        padding: 14,
        borderRadius: 12,
        gap: 10,
        marginTop: 20,
    },
    infoText: {
        flex: 1,
        fontSize: 13,
        color: '#1E40AF',
        lineHeight: 19,
    },
    footer: {
        flexDirection: 'row',
        padding: 20,
        gap: 12,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    cancelButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#374151',
    },
    confirmButton: {
        flex: 1,
        flexDirection: 'row',
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: '#018f64',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        shadowColor: '#018f64',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    confirmButtonDisabled: {
        backgroundColor: '#D1D5DB',
        shadowOpacity: 0,
        elevation: 0,
    },
    confirmButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#FFFFFF',
    },
});
