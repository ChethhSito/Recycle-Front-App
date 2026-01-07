import React, { useEffect } from 'react';
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

export const TestingModeModal = ({ visible, onClose, code, method }) => {
    const methodInfo = {
        email: {
            icon: 'email-fast',
            color: '#018f64',
            bg: '#D1FAE5',
            title: 'Modo Desarrollo - Email',
            subtitle: 'Resend no pudo enviar',
            isSMS: false,
        },
        sms: {
            icon: 'cellphone-message',
            color: '#8B5CF6',
            bg: '#F5F3FF',
            title: 'Mensaje SMS',
            subtitle: 'Simulación de envío',
            isSMS: true,
        }
    };

    const info = methodInfo[method] || methodInfo.email;

    // Auto-cerrar después de 15 segundos solo para SMS
    useEffect(() => {
        if (visible && info.isSMS) {
            const timer = setTimeout(() => {
                console.log('[TestingModal] Auto-cerrando después de 15 segundos');
                onClose();
            }, 15000); // 15 segundos

            return () => clearTimeout(timer);
        }
    }, [visible, info.isSMS]);

    // Si es SMS, mostrar como mensaje de texto
    if (info.isSMS) {
        return (
            <Modal
                visible={visible}
                transparent={true}
                animationType="slide"
                onRequestClose={onClose}
            >
                <View style={styles.overlay}>
                    <View style={styles.smsContainer}>
                        {/* Header como notificación SMS */}
                        <View style={styles.smsHeader}>
                            <Icon name="cellphone" size={20} color="#8B5CF6" />
                            <Text style={styles.smsHeaderText}>Nuevo Mensaje SMS</Text>
                            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                <Icon name="close" size={20} color="#6B7280" />
                            </TouchableOpacity>
                        </View>

                        {/* Cuerpo del SMS */}
                        <View style={styles.smsBody}>
                            <View style={styles.smsFrom}>
                                <Icon name="message-text" size={16} color="#8B5CF6" />
                                <Text style={styles.smsFromText}>Recycle App</Text>
                            </View>
                            
                            <Text style={styles.smsTime}>Ahora</Text>
                            
                            <View style={styles.smsBubble}>
                                <Text style={styles.smsMessage}>
                                    Tu código de verificación es:{'\n\n'}
                                    <Text style={styles.smsCode}>{code}</Text>
                                    {'\n\n'}
                                    Válido por 10 minutos.{'\n'}
                                    No compartas este código.
                                </Text>
                            </View>

                            <View style={styles.smsFooter}>
                                <Icon name="shield-check" size={16} color="#6B7280" />
                                <Text style={styles.smsFooterText}>
                                    Mensaje simulado • Modo desarrollo
                                </Text>
                            </View>
                        </View>

                        {/* Botón */}
                        <TouchableOpacity 
                            style={styles.smsContinueButton}
                            onPress={onClose}
                        >
                            <Text style={styles.smsContinueButtonText}>Continuar con verificación</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    }

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    {/* Header */}
                    <View style={[styles.header, { backgroundColor: info.bg }]}>
                        <View style={[styles.iconContainer, { backgroundColor: info.color }]}>
                            <Icon name={info.icon} size={32} color="#FFFFFF" />
                        </View>
                    </View>

                    {/* Content */}
                    <ScrollView 
                        style={styles.content}
                        contentContainerStyle={styles.contentContainer}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.badge}>
                            <Icon name="flask" size={16} color="#F59E0B" />
                            <Text style={styles.badgeText}>MODO TESTING</Text>
                        </View>

                        <Text style={styles.title}>Servicio no disponible</Text>
                        
                        <View style={styles.infoBox}>
                            <Icon name="alert-circle" size={20} color="#6B7280" />
                            <View style={styles.infoTextContainer}>
                                <Text style={styles.infoTitle}>{info.title}</Text>
                                <Text style={styles.infoSubtitle}>{info.subtitle}</Text>
                            </View>
                        </View>

                        <Text style={styles.description}>
                            Por ahora, usa este código de prueba para continuar con la verificación:
                        </Text>

                        {/* OTP Code */}
                        <View style={styles.otpContainer}>
                            <Text style={styles.otpLabel}>Código de Prueba</Text>
                            <Text style={styles.otpCode}>{code}</Text>
                            <View style={styles.otpHint}>
                                <Icon name="timer-sand" size={16} color="#059669" />
                                <Text style={styles.otpHintText}>Válido por 10 minutos</Text>
                            </View>
                        </View>

                        {/* Instructions */}
                        <View style={styles.instructions}>
                            <View style={styles.instructionItem}>
                                <View style={styles.instructionNumber}>
                                    <Text style={styles.instructionNumberText}>1</Text>
                                </View>
                                <Text style={styles.instructionText}>
                                    Copia el código de arriba
                                </Text>
                            </View>
                            <View style={styles.instructionItem}>
                                <View style={styles.instructionNumber}>
                                    <Text style={styles.instructionNumberText}>2</Text>
                                </View>
                                <Text style={styles.instructionText}>
                                    Pégalo en la pantalla de verificación
                                </Text>
                            </View>
                            <View style={styles.instructionItem}>
                                <View style={styles.instructionNumber}>
                                    <Text style={styles.instructionNumberText}>3</Text>
                                </View>
                                <Text style={styles.instructionText}>
                                    Presiona "Verificar" para continuar
                                </Text>
                            </View>
                        </View>

                        {/* Note */}
                        <View style={styles.noteBox}>
                            <Icon name="information" size={20} color="#3B82F6" />
                            <Text style={styles.noteText}>
                                <Text style={styles.noteBold}>Nota:</Text> En producción, 
                                el código llegará por {method === 'email' ? 'email' : 'SMS'} automáticamente.
                            </Text>
                        </View>
                    </ScrollView>

                    {/* Footer Button */}
                    <View style={styles.footer}>
                        <TouchableOpacity 
                            style={styles.button}
                            onPress={onClose}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.buttonText}>Entendido</Text>
                            <Icon name="check" size={20} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContainer: {
        width: '100%',
        maxWidth: 450,
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        overflow: 'hidden',
        maxHeight: '90%',
    },
    header: {
        paddingVertical: 32,
        alignItems: 'center',
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        padding: 24,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: '#FEF3C7',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginBottom: 16,
        gap: 6,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#92400E',
        letterSpacing: 0.5,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1F2937',
        textAlign: 'center',
        marginBottom: 20,
    },
    infoBox: {
        flexDirection: 'row',
        backgroundColor: '#F9FAFB',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        borderLeftWidth: 3,
        borderLeftColor: '#6B7280',
        gap: 12,
    },
    infoTextContainer: {
        flex: 1,
    },
    infoTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 2,
    },
    infoSubtitle: {
        fontSize: 12,
        color: '#6B7280',
    },
    description: {
        fontSize: 15,
        color: '#4B5563',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 22,
    },
    otpContainer: {
        backgroundColor: '#F0FDF4',
        borderWidth: 3,
        borderColor: '#10B981',
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        marginBottom: 24,
    },
    otpLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: '#059669',
        letterSpacing: 1,
        marginBottom: 8,
    },
    otpCode: {
        fontSize: 40,
        fontWeight: '900',
        color: '#065f46',
        letterSpacing: 12,
        marginVertical: 8,
    },
    otpHint: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 8,
    },
    otpHintText: {
        fontSize: 13,
        color: '#059669',
        fontWeight: '600',
    },
    instructions: {
        marginBottom: 20,
    },
    instructionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 12,
    },
    instructionNumber: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#E8F5F1',
        justifyContent: 'center',
        alignItems: 'center',
    },
    instructionNumberText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#018f64',
    },
    instructionText: {
        flex: 1,
        fontSize: 14,
        color: '#374151',
        lineHeight: 20,
    },
    noteBox: {
        flexDirection: 'row',
        backgroundColor: '#EFF6FF',
        padding: 14,
        borderRadius: 12,
        gap: 10,
        alignItems: 'flex-start',
    },
    noteText: {
        flex: 1,
        fontSize: 13,
        color: '#1E40AF',
        lineHeight: 19,
    },
    noteBold: {
        fontWeight: '700',
    },
    footer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    button: {
        flexDirection: 'row',
        backgroundColor: '#018f64',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        shadowColor: '#018f64',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    // Estilos para SMS
    smsContainer: {
        width: '90%',
        maxWidth: 380,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    smsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        gap: 8,
    },
    smsHeaderText: {
        flex: 1,
        fontSize: 15,
        fontWeight: '600',
        color: '#1F2937',
    },
    closeButton: {
        padding: 4,
    },
    smsBody: {
        padding: 20,
        backgroundColor: '#FFFFFF',
    },
    smsFrom: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 6,
    },
    smsFromText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#8B5CF6',
    },
    smsTime: {
        fontSize: 13,
        color: '#9CA3AF',
        marginBottom: 16,
    },
    smsBubble: {
        backgroundColor: '#F5F3FF',
        borderRadius: 16,
        borderTopLeftRadius: 4,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E9D5FF',
    },
    smsMessage: {
        fontSize: 15,
        color: '#1F2937',
        lineHeight: 22,
    },
    smsCode: {
        fontSize: 32,
        fontWeight: '900',
        color: '#8B5CF6',
        letterSpacing: 8,
        fontFamily: 'monospace',
    },
    smsFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    smsFooterText: {
        fontSize: 12,
        color: '#6B7280',
        fontStyle: 'italic',
    },
    smsContinueButton: {
        backgroundColor: '#8B5CF6',
        paddingVertical: 16,
        alignItems: 'center',
        marginHorizontal: 20,
        marginBottom: 20,
        borderRadius: 12,
        shadowColor: '#8B5CF6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    smsContinueButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});
