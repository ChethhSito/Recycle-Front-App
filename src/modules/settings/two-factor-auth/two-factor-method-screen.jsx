import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { generateSecureOTP, storeOTP } from './otpManager';
import { sendOTPEmail } from './resendService';
import { TestingModeModal } from '../../../componentes/modal/settings/TestingModeModal';
import { EmailSelectionModal } from '../../../componentes/modal/settings/EmailSelectionModal';

export const TwoFactorMethodScreen = () => {
    const navigation = useNavigation();
    const [isSending, setIsSending] = useState(false);
    const [showTestingModal, setShowTestingModal] = useState(false);
    const [testingCode, setTestingCode] = useState('');
    const [testingMethod, setTestingMethod] = useState('email');
    const [showEmailSelectionModal, setShowEmailSelectionModal] = useState(false);

    const handleBack = () => {
        navigation.goBack();
    };

    const handleMethodSelect = async (method) => {
        if (method === 'email') {
            // Para email, mostrar modal de selección primero
            setShowEmailSelectionModal(true);
        } else {
            // Para SMS, flujo normal
            await sendOTPToMethod('sms', '+51 982 109 407');
        }
    };

    const sendOTPToMethod = async (method, destination) => {
        setIsSending(true);
        
        // Generar código OTP seguro
        const verificationCode = generateSecureOTP();
        
        console.log(`[2FA] Código generado: ${verificationCode}`);
        console.log(`[2FA] Método: ${method === 'sms' ? 'SMS' : 'Email'}`);
        
        // Guardar OTP con expiración
        await storeOTP(verificationCode, destination);
        
        let sentSuccessfully = false;
        
        if (method === 'email') {
            // EMAIL: Intentar enviar real con Resend
            try {
                const result = await sendOTPEmail(
                    destination,
                    'Raúl',
                    verificationCode
                );
                
                sentSuccessfully = result.success;
                
                if (!sentSuccessfully) {
                    console.log('[2FA] Email no enviado, mostrando modo testing');
                }
            } catch (error) {
                console.error('[2FA] Error al enviar código:', error);
                sentSuccessfully = false;
            }
        } else {
            // SMS: Siempre modo simulación (no hay servicio real)
            console.log('[2FA] SMS - Modo simulación');
            sentSuccessfully = false; // Forzar modal de testing para SMS
        }
        
        setIsSending(false);
        
        // Mostrar modal de testing si no se envió
        if (!sentSuccessfully) {
            setTestingCode(verificationCode);
            setTestingMethod(method);
            setShowTestingModal(true);
            
            // No navegar automáticamente, esperar a que el usuario cierre el modal
        } else {
            // Si se envió exitosamente (solo email), navegar directamente
            navigation.navigate('TwoFactorVerify', { 
                method,
                destination
            });
        }
    };
    
    const handleModalClose = () => {
        setShowTestingModal(false);
        // Navegar cuando se cierra el modal
        const method = testingMethod;
        const destination = method === 'email' ? 'raulquintanazinc@gmail.com' : '+51 982 109 407';
        navigation.navigate('TwoFactorVerify', { 
            method,
            destination
        });
    };

    const handleEmailSelected = async (email) => {
        setShowEmailSelectionModal(false);
        await sendOTPToMethod('email', email);
    };

    return (
        <View style={styles.container}>
            {/* Simple Header */}
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton} 
                    onPress={handleBack}
                    activeOpacity={0.7}
                >
                    <Icon name="arrow-left" size={24} color="#1F2937" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Verificación en 2 pasos</Text>
            </View>

            <ScrollView 
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.stepContainer}>
                    <Text style={styles.title}>Elige un método</Text>
                    <Text style={styles.subtitle}>
                        Selecciona cómo deseas recibir tu código de verificación
                    </Text>

                    {/* Opción SMS - Simulación */}
                    <TouchableOpacity 
                        style={[styles.methodCard, isSending && styles.methodCardDisabled]}
                        onPress={() => handleMethodSelect('sms')}
                        activeOpacity={0.7}
                        disabled={isSending}
                    >
                        <View style={styles.methodIconContainer}>
                            <Icon name="cellphone" size={40} color="#8B5CF6" />
                        </View>
                        <View style={styles.methodTextContainer}>
                            <Text style={styles.methodTitle}>Mensaje de Texto (SMS)</Text>
                            <Text style={styles.methodDescription}>+51 982 109 407</Text>
                            <View style={styles.modeBadge}>
                                <Icon name="message-badge" size={12} color="#8B5CF6" />
                                <Text style={styles.modeBadgeText}>Código vía SMS</Text>
                            </View>
                        </View>
                        <Icon name="chevron-right" size={24} color="#9CA3AF" />
                    </TouchableOpacity>

                    {/* Opción Email - Real con Resend */}
                    <TouchableOpacity 
                        style={[styles.methodCard, styles.methodCardPrimary, isSending && styles.methodCardDisabled]}
                        onPress={() => handleMethodSelect('email')}
                        activeOpacity={0.7}
                        disabled={isSending}
                    >
                        <View style={[styles.methodIconContainer, styles.methodIconPrimary]}>
                            {isSending ? (
                                <ActivityIndicator size="small" color="#018f64" />
                            ) : (
                                <Icon name="email" size={40} color="#018f64" />
                            )}
                        </View>
                        <View style={styles.methodTextContainer}>
                            <Text style={styles.methodTitle}>Correo Electrónico</Text>
                            <Text style={styles.methodDescription}>raulquintanazinc@gmail.com</Text>
                            <View style={[styles.modeBadge, styles.modeBadgeSuccess]}>
                                <Icon name="email-fast" size={12} color="#059669" />
                                <Text style={[styles.modeBadgeText, styles.modeBadgeTextSuccess]}>Código vía Email</Text>
                            </View>
                        </View>
                        <Icon name="chevron-right" size={24} color="#9CA3AF" />
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Testing Mode Modal */}
            <TestingModeModal
                visible={showTestingModal}
                onClose={handleModalClose}
                code={testingCode}
                method={testingMethod}
            />

            {/* Email Selection Modal */}
            <EmailSelectionModal
                visible={showEmailSelectionModal}
                onClose={() => setShowEmailSelectionModal(false)}
                onSelectEmail={handleEmailSelected}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        backgroundColor: '#FFFFFF',
        paddingTop: 50,
        paddingBottom: 16,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    backButton: {
        padding: 4,
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1F2937',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    stepContainer: {
        flex: 1,
        paddingHorizontal: 24,
        paddingVertical: 32,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 12,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#6B7280',
        marginBottom: 32,
        textAlign: 'center',
        lineHeight: 24,
    },
    methodCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 16,
        marginBottom: 16,
        borderWidth: 2,
        borderColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    methodCardPrimary: {
        borderColor: '#018f64',
        borderWidth: 2,
    },
    methodCardDisabled: {
        opacity: 0.6,
    },
    methodIconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    methodIconPrimary: {
        backgroundColor: '#D1FAE5',
    },
    methodTextContainer: {
        flex: 1,
    },
    methodTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 4,
    },
    methodDescription: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 6,
    },
    modeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F3FF',
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        gap: 4,
    },
    modeBadgeSuccess: {
        backgroundColor: '#D1FAE5',
    },
    modeBadgeText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#8B5CF6',
    },
    modeBadgeTextSuccess: {
        color: '#059669',
    },
});
