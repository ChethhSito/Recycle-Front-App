import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    Modal,
    Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { logout } from '../../../store/auth';
import { useNavigation } from '@react-navigation/native';   // ← NUEVO

export const RestorationScreen = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();   // ← NUEVO

    const [daysRemaining, setDaysRemaining] = useState(0);
    const [deletionDate, setDeletionDate] = useState('');
    const [showRestoreConfirmModal, setShowRestoreConfirmModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showLogoutConfirmModal, setShowLogoutConfirmModal] = useState(false);

    const scaleAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        loadSuspensionData();
    }, []);

    const loadSuspensionData = async () => {
        try {
            const suspensionData = await AsyncStorage.getItem('account_suspended');
            if (suspensionData) {
                const data = JSON.parse(suspensionData);
                const suspensionDate = new Date(data.suspensionDate);
                const deletionDateCalc = new Date(suspensionDate);
                deletionDateCalc.setDate(deletionDateCalc.getDate() + 30);

                const today = new Date();
                const diffTime = deletionDateCalc.getTime() - today.getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                setDaysRemaining(Math.max(0, diffDays));
                setDeletionDate(
                    deletionDateCalc.toLocaleDateString('es-PE', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    })
                );
            }
        } catch (error) {
            console.error('Error al cargar datos de suspensión:', error);
        }
    };

    const handleRestorePress = () => {
        setShowRestoreConfirmModal(true);
    };

    //  🔥 AQUÍ ESTÁ LA MAGIA 🔥
    const confirmRestoreAccount = async () => {
        console.log('🟢 Restaurando cuenta...');

        setShowRestoreConfirmModal(false);

        try {
            await AsyncStorage.removeItem('account_suspended');
            await AsyncStorage.removeItem('suspension_date');

            setShowSuccessModal(true);

            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 5,
                tension: 40,
                useNativeDriver: true,
            }).start();

            // ⏳ Espera 2 segundos → Logout → Ir Login
            setTimeout(async () => {
                try {
                    await AsyncStorage.removeItem('user_token');
                    dispatch(logout());

                    // 🚀 ENVÍA DIRECTO A LOGIN Y LIMPIA HISTORIAL
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Login' }],
                    });

                    console.log('✅ Redirigido al Login correctamente');
                } catch (error) {
                    console.error('❌ Error en logout:', error);
                }
            }, 2000);
        } catch (error) {
            console.error('❌ Error al restaurar:', error);
        }
    };

    const handleLogoutPress = () => {
        setShowLogoutConfirmModal(true);
    };

    const confirmLogout = async () => {
        try {
            await AsyncStorage.removeItem('user_token');
            dispatch(logout());

            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });

        } catch (error) {
            console.error('❌ Error logout:', error);
        }
    };
    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#018f64" />
            
            {/* Fondo con LinearGradient */}
            <LinearGradient
                colors={['#018f64', '#00755b', '#005c4b']}
                style={styles.gradient}
            >
                <ScrollView 
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header Icon */}
                    <View style={styles.headerIcon}>
                        <View style={styles.iconCircle}>
                            <Icon name="clock-alert-outline" color="#F59E0B" size={64} />
                        </View>
                    </View>

                    {/* Tarjeta Central Blanca */}
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Icon name="shield-alert" color="#F59E0B" size={32} />
                            <Text style={styles.cardTitle}>Cuenta en Proceso de Eliminación</Text>
                        </View>

                        <Text style={styles.cardSubtitle}>
                            Tu cuenta está suspendida temporalmente
                        </Text>

                        {/* Contador de Días */}
                        <View style={styles.countdownContainer}>
                            <Text style={styles.countdownLabel}>TIEMPO RESTANTE</Text>
                            <View style={styles.countdownCircle}>
                                <Text style={styles.countdownNumber}>{daysRemaining}</Text>
                                <Text style={styles.countdownDays}>días</Text>
                            </View>
                            <View style={styles.deletionInfo}>
                                <Icon name="calendar-clock" color="#9CA3AF" size={16} />
                                <Text style={styles.deletionLabel}>Eliminación programada:</Text>
                            </View>
                            <Text style={styles.deletionDate}>{deletionDate}</Text>
                        </View>

                        {/* Información */}
                        <View style={styles.infoContainer}>
                            <View style={styles.infoRow}>
                                <View style={styles.infoDotGreen} />
                                <Text style={styles.infoText}>
                                    Puedes restaurar tu cuenta durante estos {daysRemaining} días
                                </Text>
                            </View>
                            <View style={styles.infoRow}>
                                <View style={styles.infoDotRed} />
                                <Text style={styles.infoText}>
                                    Después, tus datos serán eliminados permanentemente
                                </Text>
                            </View>
                        </View>

                        {/* Botones */}
                        <TouchableOpacity
                            style={styles.restoreButton}
                            onPress={handleRestorePress}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={['#10B981', '#059669']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.restoreButtonGradient}
                            >
                                <Icon name="refresh" color="#FFF" size={24} />
                                <Text style={styles.restoreButtonText}>Restaurar Mi Cuenta</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.logoutButton}
                            onPress={handleLogoutPress}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Footer */}
                    <Text style={styles.footerText}>Recycle App © 2026</Text>
                </ScrollView>
            </LinearGradient>

            {/* Modal de Confirmación de Restaurar (estilo DrawerMenu) */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={showRestoreConfirmModal}
                onRequestClose={() => setShowRestoreConfirmModal(false)}
            >
                <View style={styles.confirmModalOverlay}>
                    <View style={styles.confirmModalContent}>
                        <View style={styles.confirmModalIconContainer}>
                            <Icon name="refresh-circle" color="#10B981" size={50} />
                        </View>

                        <Text style={styles.confirmModalTitle}>Restaurar Cuenta</Text>
                        <Text style={styles.confirmModalMessage}>
                            ¿Estás seguro que deseas restaurar tu cuenta?{'\n\n'}
                            Tu cuenta volverá a estar activa inmediatamente.
                        </Text>

                        <View style={styles.confirmModalButtons}>
                            <TouchableOpacity
                                style={[styles.confirmModalButton, styles.confirmCancelButton]}
                                onPress={() => setShowRestoreConfirmModal(false)}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.confirmCancelButtonText}>Cancelar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.confirmModalButton, styles.confirmRestoreButton]}
                                onPress={confirmRestoreAccount}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.confirmRestoreButtonText}>Restaurar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Modal de Éxito */}
            <Modal
                visible={showSuccessModal}
                transparent
                animationType="fade"
            >
                <View style={styles.modalOverlay}>
                    <Animated.View 
                        style={[
                            styles.modalContent,
                            { transform: [{ scale: scaleAnim }] }
                        ]}
                    >
                        <View style={styles.successIconContainer}>
                            <Icon name="check-circle" color="#10B981" size={80} />
                        </View>
                        <Text style={styles.modalTitle}>¡Cuenta Restaurada!</Text>
                        <Text style={styles.modalMessage}>
                            Tu cuenta ha sido reactivada exitosamente.{'\n'}
                            ¡Bienvenido de vuelta! 🎉
                        </Text>
                    </Animated.View>
                </View>
            </Modal>

            {/* Modal de Confirmación de Logout (estilo DrawerMenu) */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={showLogoutConfirmModal}
                onRequestClose={() => setShowLogoutConfirmModal(false)}
            >
                <View style={styles.logoutModalOverlay}>
                    <View style={styles.logoutModalContent}>
                        <View style={styles.logoutModalIconContainer}>
                            <Icon name="logout" color="#D32F2F" size={40} />
                        </View>

                        <Text style={styles.logoutModalTitle}>Cerrar Sesión</Text>
                        <Text style={styles.logoutModalMessage}>
                            ¿Estás seguro que deseas cerrar sesión?{'\n\n'}
                            Tu cuenta seguirá suspendida.
                        </Text>

                        <View style={styles.logoutModalButtons}>
                            <TouchableOpacity
                                style={[styles.logoutModalButton, styles.logoutCancelButton]}
                                onPress={() => setShowLogoutConfirmModal(false)}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.logoutCancelButtonText}>Cancelar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.logoutModalButton, styles.logoutConfirmButton]}
                                onPress={confirmLogout}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.logoutConfirmButtonText}>Cerrar Sesión</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#018f64',
    },
    gradient: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    headerIcon: {
        alignItems: 'center',
        marginTop: 60,
        marginBottom: 32,
    },
    iconCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 28,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        marginBottom: 12,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1F2937',
        textAlign: 'center',
        flex: 1,
    },
    cardSubtitle: {
        fontSize: 15,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 32,
    },
    countdownContainer: {
        backgroundColor: '#F9FAFB',
        borderRadius: 20,
        padding: 28,
        alignItems: 'center',
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    countdownLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: '#9CA3AF',
        letterSpacing: 1.5,
        marginBottom: 20,
    },
    countdownCircle: {
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: '#FEF3C7',
        borderWidth: 6,
        borderColor: '#F59E0B',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    countdownNumber: {
        fontSize: 56,
        fontWeight: 'bold',
        color: '#D97706',
        lineHeight: 56,
    },
    countdownDays: {
        fontSize: 16,
        fontWeight: '600',
        color: '#92400E',
        marginTop: 4,
    },
    deletionInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 8,
    },
    deletionLabel: {
        fontSize: 13,
        color: '#6B7280',
    },
    deletionDate: {
        fontSize: 15,
        fontWeight: '700',
        color: '#DC2626',
        textAlign: 'center',
    },
    infoContainer: {
        backgroundColor: '#F9FAFB',
        borderRadius: 16,
        padding: 20,
        marginBottom: 28,
        gap: 16,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
    },
    infoDotGreen: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#10B981',
        marginTop: 6,
    },
    infoDotRed: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#EF4444',
        marginTop: 6,
    },
    infoText: {
        flex: 1,
        fontSize: 14,
        color: '#374151',
        lineHeight: 20,
    },
    restoreButton: {
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 12,
        elevation: 4,
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    restoreButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        gap: 12,
    },
    restoreButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    logoutButton: {
        paddingVertical: 16,
        alignItems: 'center',
    },
    logoutButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#6B7280',
    },
    footerText: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.6)',
        textAlign: 'center',
        marginTop: 32,
    },
    
    // Modal de Confirmación de Restaurar (estilo DrawerMenu)
    confirmModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    confirmModalContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 28,
        width: '100%',
        maxWidth: 340,
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
    },
    confirmModalIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#ECFDF5',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    confirmModalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#32243B',
        marginBottom: 10,
    },
    confirmModalMessage: {
        fontSize: 15,
        color: '#666',
        textAlign: 'center',
        marginBottom: 28,
        lineHeight: 22,
    },
    confirmModalButtons: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
    },
    confirmModalButton: {
        flex: 1,
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
    },
    confirmCancelButton: {
        backgroundColor: '#F3F4F6',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    confirmRestoreButton: {
        backgroundColor: '#10B981',
    },
    confirmCancelButtonText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#32243B',
    },
    confirmRestoreButtonText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    
    // Modal de Éxito
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
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
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 12,
        textAlign: 'center',
    },
    modalMessage: {
        fontSize: 15,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 22,
    },
    
    // Modal de Confirmación de Logout (estilo DrawerMenu)
    logoutModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    logoutModalContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 28,
        width: '100%',
        maxWidth: 340,
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
    },
    logoutModalIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#FFEBEE',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#D32F2F',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    logoutModalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#32243B',
        marginBottom: 10,
    },
    logoutModalMessage: {
        fontSize: 15,
        color: '#666',
        textAlign: 'center',
        marginBottom: 28,
        lineHeight: 22,
    },
    logoutModalButtons: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
    },
    logoutModalButton: {
        flex: 1,
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
    },
    logoutCancelButton: {
        backgroundColor: '#F3F4F6',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    logoutConfirmButton: {
        backgroundColor: '#D32F2F',
    },
    logoutCancelButtonText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#32243B',
    },
    logoutConfirmButtonText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#FFFFFF',
    },
});
