import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Switch,
    Image,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { ToggleConfirmModal } from '../../componentes/modal/settings/ToggleConfirmModal';

export const TwoFactorAuthScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { enabled: initialEnabled = false } = route.params || {};
    
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(initialEnabled);
    const [selectedMethod, setSelectedMethod] = useState('sms'); // 'sms', 'email', 'app'
    const [showActivateModal, setShowActivateModal] = useState(false);
    const [showDeactivateModal, setShowDeactivateModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleBack = () => {
        navigation.goBack();
    };

    const handleToggle2FA = (value) => {
        if (value) {
            // Activar 2FA
            setShowActivateModal(true);
        } else {
            // Desactivar 2FA
            setShowDeactivateModal(true);
        }
    };

    const handleConfirmActivate = () => {
        setShowActivateModal(false);
        setTwoFactorEnabled(true);
        setSuccessMessage('La verificación en 2 pasos ha sido activada correctamente.');
        setShowSuccessModal(true);
    };

    const handleConfirmDeactivate = () => {
        setShowDeactivateModal(false);
        setTwoFactorEnabled(false);
        setSuccessMessage('La verificación en 2 pasos ha sido desactivada.');
        setShowSuccessModal(true);
    };

    const methods = [
        {
            id: 'sms',
            title: 'Mensaje de Texto (SMS)',
            description: 'Recibe un código de 6 dígitos por SMS',
            icon: 'message-text',
            available: true,
        },
        {
            id: 'email',
            title: 'Correo Electrónico',
            description: 'Recibe un código en tu email registrado',
            icon: 'email',
            available: true,
        },
        {
            id: 'app',
            title: 'App de Autenticación',
            description: 'Usa Google Authenticator o similar',
            icon: 'cellphone-key',
            available: false,
            badge: 'Próximamente',
        },
    ];

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton} 
                    onPress={handleBack}
                    activeOpacity={0.7}
                >
                    <Icon name="arrow-left" size={24} color="#FFF" />
                </TouchableOpacity>
                <View style={styles.headerTextContainer}>
                    <Text style={styles.headerTitle}>Verificación en 2 Pasos</Text>
                    <Text style={styles.headerSubtitle}>Mayor seguridad para tu cuenta</Text>
                </View>
            </View>

            <ScrollView 
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
            >
                {/* Status Card */}
                <View style={[
                    styles.statusCard,
                    twoFactorEnabled ? styles.statusCardEnabled : styles.statusCardDisabled
                ]}>
                    <View style={styles.statusCardLeft}>
                        <View style={[
                            styles.statusIconContainer,
                            twoFactorEnabled ? styles.statusIconEnabled : styles.statusIconDisabled
                        ]}>
                            <Icon 
                                name={twoFactorEnabled ? 'shield-check' : 'shield-off'} 
                                size={32} 
                                color={twoFactorEnabled ? '#10B981' : '#6B7280'} 
                            />
                        </View>
                        <View style={styles.statusTextContainer}>
                            <Text style={styles.statusTitle}>
                                {twoFactorEnabled ? 'Activado' : 'Desactivado'}
                            </Text>
                            <Text style={styles.statusDescription}>
                                {twoFactorEnabled 
                                    ? 'Tu cuenta está protegida' 
                                    : 'Activa para mayor seguridad'}
                            </Text>
                        </View>
                    </View>
                    <Switch
                        value={twoFactorEnabled}
                        onValueChange={handleToggle2FA}
                        trackColor={{ false: '#D1D5DB', true: '#6EE7B7' }}
                        thumbColor={twoFactorEnabled ? '#10B981' : '#F3F4F6'}
                        ios_backgroundColor="#D1D5DB"
                    />
                </View>

                {/* Info Section */}
                <View style={styles.infoSection}>
                    <Text style={styles.infoTitle}>¿Qué es la verificación en 2 pasos?</Text>
                    <Text style={styles.infoText}>
                        Es una capa adicional de seguridad que requiere un código único cada vez que inicias sesión, 
                        además de tu contraseña. Esto protege tu cuenta incluso si alguien conoce tu contraseña.
                    </Text>
                </View>

                {/* Methods Section */}
                {twoFactorEnabled && (
                    <View style={styles.methodsSection}>
                        <Text style={styles.sectionTitle}>MÉTODO DE VERIFICACIÓN</Text>
                        
                        {methods.map((method) => (
                            <TouchableOpacity
                                key={method.id}
                                style={[
                                    styles.methodCard,
                                    selectedMethod === method.id && styles.methodCardSelected,
                                    !method.available && styles.methodCardDisabled
                                ]}
                                onPress={() => method.available && setSelectedMethod(method.id)}
                                disabled={!method.available}
                                activeOpacity={0.7}
                            >
                                <View style={styles.methodLeft}>
                                    <View style={[
                                        styles.methodIcon,
                                        selectedMethod === method.id && styles.methodIconSelected,
                                        !method.available && styles.methodIconDisabled
                                    ]}>
                                        <Icon 
                                            name={method.icon} 
                                            size={24} 
                                            color={
                                                !method.available ? '#9CA3AF' :
                                                selectedMethod === method.id ? '#018f64' : '#6B7280'
                                            } 
                                        />
                                    </View>
                                    <View style={styles.methodTextContainer}>
                                        <View style={styles.methodTitleRow}>
                                            <Text style={[
                                                styles.methodTitle,
                                                !method.available && styles.methodTitleDisabled
                                            ]}>
                                                {method.title}
                                            </Text>
                                            {method.badge && (
                                                <View style={styles.badge}>
                                                    <Text style={styles.badgeText}>{method.badge}</Text>
                                                </View>
                                            )}
                                        </View>
                                        <Text style={[
                                            styles.methodDescription,
                                            !method.available && styles.methodDescriptionDisabled
                                        ]}>
                                            {method.description}
                                        </Text>
                                    </View>
                                </View>
                                {method.available && (
                                    <View style={[
                                        styles.radioButton,
                                        selectedMethod === method.id && styles.radioButtonSelected
                                    ]}>
                                        {selectedMethod === method.id && (
                                            <View style={styles.radioButtonInner} />
                                        )}
                                    </View>
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                {/* Benefits Section */}
                <View style={styles.benefitsSection}>
                    <Text style={styles.sectionTitle}>BENEFICIOS</Text>
                    
                    <View style={styles.benefitItem}>
                        <Icon name="lock-check" size={24} color="#10B981" />
                        <View style={styles.benefitText}>
                            <Text style={styles.benefitTitle}>Mayor Seguridad</Text>
                            <Text style={styles.benefitDescription}>
                                Protege tu cuenta contra accesos no autorizados
                            </Text>
                        </View>
                    </View>

                    <View style={styles.benefitItem}>
                        <Icon name="alert-circle-check" size={24} color="#10B981" />
                        <View style={styles.benefitText}>
                            <Text style={styles.benefitTitle}>Alertas de Inicio de Sesión</Text>
                            <Text style={styles.benefitDescription}>
                                Recibe notificaciones cuando alguien intente acceder
                            </Text>
                        </View>
                    </View>

                    <View style={styles.benefitItem}>
                        <Icon name="shield-star" size={24} color="#10B981" />
                        <View style={styles.benefitText}>
                            <Text style={styles.benefitTitle}>Recomendado por Expertos</Text>
                            <Text style={styles.benefitDescription}>
                                Método de seguridad usado por las principales plataformas
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={styles.bottomSpacing} />
            </ScrollView>

            {/* Modal Activar 2FA */}
            <ToggleConfirmModal
                visible={showActivateModal}
                onClose={() => setShowActivateModal(false)}
                onConfirm={handleConfirmActivate}
                title="Activar Verificación en 2 Pasos"
                message="Se enviará un código de verificación a tu dispositivo cada vez que inicies sesión."
                icon="shield-check"
                iconColor="#10B981"
            />

            {/* Modal Desactivar 2FA */}
            <ToggleConfirmModal
                visible={showDeactivateModal}
                onClose={() => setShowDeactivateModal(false)}
                onConfirm={handleConfirmDeactivate}
                title="Desactivar Verificación en 2 Pasos"
                message="¿Estás seguro? Tu cuenta será menos segura sin esta capa adicional de protección."
                icon="shield-off"
                iconColor="#EF4444"
            />

            {/* Modal de Éxito */}
            <ToggleConfirmModal
                visible={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                onConfirm={() => setShowSuccessModal(false)}
                title={twoFactorEnabled ? '¡Activado!' : '¡Desactivado!'}
                message={successMessage}
                icon={twoFactorEnabled ? 'check-circle' : 'information'}
                iconColor={twoFactorEnabled ? '#10B981' : '#6B7280'}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    header: {
        backgroundColor: '#018f64',
        paddingTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },
    backButton: {
        padding: 4,
        marginRight: 15,
    },
    headerTextContainer: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    headerSubtitle: {
        fontSize: 13,
        color: '#fff',
        opacity: 0.9,
        marginTop: 2,
    },
    scrollView: {
        flex: 1,
    },
    statusCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFF',
        marginHorizontal: 16,
        marginTop: 20,
        padding: 20,
        borderRadius: 16,
        borderWidth: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    statusCardEnabled: {
        borderColor: '#10B981',
        backgroundColor: '#F0FDF4',
    },
    statusCardDisabled: {
        borderColor: '#E5E7EB',
    },
    statusCardLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    statusIconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    statusIconEnabled: {
        backgroundColor: '#D1FAE5',
    },
    statusIconDisabled: {
        backgroundColor: '#F3F4F6',
    },
    statusTextContainer: {
        flex: 1,
    },
    statusTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 4,
    },
    statusDescription: {
        fontSize: 13,
        color: '#6B7280',
    },
    infoSection: {
        backgroundColor: '#EFF6FF',
        marginHorizontal: 16,
        marginTop: 20,
        padding: 16,
        borderRadius: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#3B82F6',
    },
    infoTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1E40AF',
        marginBottom: 8,
    },
    infoText: {
        fontSize: 14,
        color: '#1E40AF',
        lineHeight: 20,
    },
    methodsSection: {
        marginTop: 24,
        marginHorizontal: 16,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6B7280',
        marginBottom: 12,
        letterSpacing: 0.5,
    },
    methodCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 2,
        borderColor: '#E5E7EB',
    },
    methodCardSelected: {
        borderColor: '#018f64',
        backgroundColor: '#F0FDF9',
    },
    methodCardDisabled: {
        opacity: 0.6,
        backgroundColor: '#F9FAFB',
    },
    methodLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    methodIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    methodIconSelected: {
        backgroundColor: '#D1FAE5',
    },
    methodIconDisabled: {
        backgroundColor: '#F9FAFB',
    },
    methodTextContainer: {
        flex: 1,
    },
    methodTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    methodTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1F2937',
    },
    methodTitleDisabled: {
        color: '#9CA3AF',
    },
    badge: {
        backgroundColor: '#FEF3C7',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
        marginLeft: 8,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: '600',
        color: '#92400E',
    },
    methodDescription: {
        fontSize: 13,
        color: '#6B7280',
    },
    methodDescriptionDisabled: {
        color: '#9CA3AF',
    },
    radioButton: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#D1D5DB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioButtonSelected: {
        borderColor: '#018f64',
    },
    radioButtonInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#018f64',
    },
    benefitsSection: {
        marginTop: 24,
        marginHorizontal: 16,
        backgroundColor: '#FFF',
        padding: 20,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    benefitItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    benefitText: {
        flex: 1,
        marginLeft: 12,
    },
    benefitTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 4,
    },
    benefitDescription: {
        fontSize: 13,
        color: '#6B7280',
        lineHeight: 18,
    },
    bottomSpacing: {
        height: 40,
    },
});
