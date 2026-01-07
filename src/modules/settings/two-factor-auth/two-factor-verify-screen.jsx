import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { verifyOTP, getOTPTimeRemaining, clearOTP, generateSecureOTP, storeOTP } from './otpManager';
import { sendOTPEmail } from './resendService';

export const TwoFactorVerifyScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { method, destination } = route.params || { method: 'email', destination: 'raulquintanazinc@gmail.com' };
    
    const [code, setCode] = useState(['', '', '', '']);
    const [error, setError] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutos en segundos
    const inputRefs = useRef([]);

    // Actualizar tiempo restante cada segundo
    useEffect(() => {
        const updateTime = async () => {
            const remaining = await getOTPTimeRemaining();
            setTimeRemaining(remaining);
            
            if (remaining === 0) {
                setError('El código ha expirado');
            }
        };
        
        updateTime();
        const interval = setInterval(updateTime, 1000);
        
        return () => clearInterval(interval);
    }, []);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleBack = () => {
        navigation.goBack();
    };

    const handleCodeChange = (text, index) => {
        // Limpiar error al escribir
        if (error) setError('');

        if (text.length > 1) {
            text = text.charAt(text.length - 1);
        }

        const newCode = [...code];
        newCode[index] = text;
        setCode(newCode);

        // Auto-focus al siguiente input
        if (text && index < 3) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleVerify = async () => {
        setIsVerifying(true);
        const enteredCode = code.join('');
        
        console.log(`[2FA] Verificando código: ${enteredCode}`);

        try {
            const isValid = await verifyOTP(enteredCode);
            
            if (isValid) {
                console.log('[2FA] ✅ Código correcto - Verificación exitosa');
                await clearOTP();
                navigation.navigate('TwoFactorSuccess', { method });
            } else {
                const remaining = await getOTPTimeRemaining();
                if (remaining === 0) {
                    console.log('[2FA] ❌ Código expirado');
                    setError('El código ha expirado');
                } else {
                    console.log('[2FA] ❌ Código incorrecto');
                    setError('Código incorrecto. Intenta nuevamente.');
                }
                setCode(['', '', '', '']);
                inputRefs.current[0]?.focus();
            }
        } catch (error) {
            console.error('[2FA] Error al verificar:', error);
            setError('Error al verificar el código');
        } finally {
            setIsVerifying(false);
        }
    };

    const handleResendCode = async () => {
        try {
            const newCode = await generateSecureOTP();
            await storeOTP(newCode, destination);
            
            console.log(`[2FA] Nuevo código generado: ${newCode}`);
            console.log(`[2FA] Método: ${method === 'sms' ? 'SMS' : 'Email'}`);
            
            // Si es email, intentar enviar por Resend
            if (method === 'email') {
                try {
                    const result = await sendOTPEmail(destination, 'Raúl', newCode);
                    if (result.success) {
                        console.log('[2FA] Email reenviado exitosamente');
                        Alert.alert(
                            'Código Reenviado',
                            'Se ha enviado un nuevo código a tu correo electrónico.',
                            [{ text: 'OK' }]
                        );
                    } else {
                        console.log('[2FA] Email no enviado, mostrar código');
                        Alert.alert(
                            'Código Generado',
                            `No se pudo enviar el email.\n\nTu nuevo código es: ${newCode}`,
                            [{ text: 'OK' }]
                        );
                    }
                } catch (error) {
                    console.log('[2FA] Error enviando email');
                    Alert.alert(
                        'Código Generado',
                        `Tu nuevo código es: ${newCode}`,
                        [{ text: 'OK' }]
                    );
                }
            } else {
                // SMS: siempre mostrar el código en alert simple
                Alert.alert(
                    'Código Reenviado',
                    `Se ha generado un nuevo código.\n\nCódigo: ${newCode}\n\nVálido por 10 minutos.`,
                    [{ text: 'OK' }]
                );
            }
            
            setCode(['', '', '', '']);
            setError('');
        } catch (error) {
            console.error('[2FA] Error al reenviar:', error);
            Alert.alert('Error', 'No se pudo reenviar el código');
        }
    };

    const isCodeComplete = code.every(digit => digit !== '');

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
                    <View style={styles.iconCircleMedium}>
                        <Icon 
                            name={method === 'sms' ? 'cellphone-message' : 'email'} 
                            size={48} 
                            color="#018f64" 
                        />
                    </View>

                    <Text style={styles.title}>Ingresa el código</Text>
                    <Text style={styles.subtitle}>
                        Hemos enviado un código de 4 dígitos a tu {method === 'sms' ? 'teléfono' : 'correo electrónico'}
                    </Text>

                    {/* Tiempo restante */}
                    {timeRemaining > 0 && (
                        <View style={styles.timerContainer}>
                            <Icon name="clock-outline" size={16} color="#6B7280" />
                            <Text style={styles.timerText}>
                                Expira en {formatTime(timeRemaining)}
                            </Text>
                        </View>
                    )}

                    {error ? (
                        <View style={styles.errorContainer}>
                            <Icon name="alert-circle" size={20} color="#DC2626" />
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    ) : null}

                    <View style={styles.codeInputContainer}>
                        {code.map((digit, index) => (
                            <TextInput
                                key={index}
                                ref={(ref) => (inputRefs.current[index] = ref)}
                                style={[
                                    styles.codeInput,
                                    digit && styles.codeInputFilled,
                                    error && styles.codeInputError
                                ]}
                                value={digit}
                                onChangeText={(text) => handleCodeChange(text, index)}
                                keyboardType="number-pad"
                                maxLength={1}
                                selectTextOnFocus
                                editable={!isVerifying}
                            />
                        ))}
                    </View>

                    <TouchableOpacity 
                        style={[
                            styles.primaryButton,
                            (!isCodeComplete || isVerifying) && styles.primaryButtonDisabled
                        ]}
                        onPress={handleVerify}
                        disabled={!isCodeComplete || isVerifying}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.primaryButtonText}>
                            {isVerifying ? 'Verificando...' : 'Verificar'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.resendButton}
                        onPress={handleResendCode}
                        disabled={isVerifying}
                    >
                        <Text style={styles.resendButtonText}>¿No recibiste el código? Reenviar</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
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
        alignItems: 'center',
    },
    iconCircleMedium: {
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: '#E8F5F1',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
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
        marginBottom: 16,
        textAlign: 'center',
        lineHeight: 24,
    },
    timerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        marginBottom: 24,
    },
    timerText: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '600',
    },
    codeInputContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 40,
        gap: 12,
    },
    codeInput: {
        width: 56,
        height: 64,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#D1D5DB',
        backgroundColor: '#FFFFFF',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#1F2937',
    },
    codeInputFilled: {
        borderColor: '#018f64',
        backgroundColor: '#F0FDF9',
    },
    codeInputError: {
        borderColor: '#DC2626',
        backgroundColor: '#FEE2E2',
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FEE2E2',
        padding: 12,
        borderRadius: 8,
        marginBottom: 20,
        width: '100%',
    },
    errorText: {
        color: '#DC2626',
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 8,
        flex: 1,
    },
    primaryButton: {
        width: '100%',
        backgroundColor: '#018f64',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#018f64',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    primaryButtonDisabled: {
        backgroundColor: '#D1D5DB',
        shadowOpacity: 0,
        elevation: 0,
    },
    primaryButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    resendButton: {
        marginTop: 16,
        paddingVertical: 8,
    },
    resendButtonText: {
        color: '#018f64',
        fontSize: 14,
        fontWeight: '600',
    },
});
