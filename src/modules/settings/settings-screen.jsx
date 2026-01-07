import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Switch,
    Image,
    Animated,
    Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { SupportModal } from '../../componentes/modal/settings/SupportModal';
import { DeleteAccountModal } from '../../componentes/modal/settings/DeleteAccountModal';
import { TermsModal } from '../../componentes/modal/settings/TermsModal';
import { ChangePasswordModal } from '../../componentes/modal/settings/ChangePasswordModal';
import { ToggleConfirmModal } from '../../componentes/modal/settings/ToggleConfirmModal';

// Componente ToggleSwitch personalizado
const ToggleSwitch = ({ value, onValueChange, disabled = false }) => {
    return (
        <Switch
            value={value}
            onValueChange={onValueChange}
            trackColor={{ false: '#D1D5DB', true: '#6EE7B7' }}
            thumbColor={value ? '#018f64' : '#F3F4F6'}
            ios_backgroundColor="#D1D5DB"
            disabled={disabled}
        />
    );
};

// Componente SettingsSection para agrupar opciones
const SettingsSection = ({ title, children, style }) => {
    return (
        <View style={[styles.section, style]}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <View style={styles.sectionContent}>
                {children}
            </View>
        </View>
    );
};

// Componente SettingsItem para cada opción
const SettingsItem = ({ 
    icon, 
    iconColor = '#018f64', 
    label, 
    value, 
    onPress, 
    rightComponent, 
    status,
    isDanger = false 
}) => {
    const isDisabled = !!status;

    return (
        <TouchableOpacity
            style={[
                styles.settingsItem,
                isDisabled && styles.settingsItemDisabled,
                isDanger && styles.settingsItemDanger
            ]}
            onPress={onPress}
            disabled={isDisabled}
            activeOpacity={0.7}
        >
            <View style={styles.settingsItemLeft}>
                <View style={[
                    styles.iconContainer,
                    isDanger && styles.iconContainerDanger,
                    isDisabled && styles.iconContainerDisabled
                ]}>
                    <Icon 
                        name={icon} 
                        size={22} 
                        color={isDisabled ? '#9CA3AF' : (isDanger ? '#DC2626' : iconColor)} 
                    />
                </View>
                <View style={styles.settingsItemTextContainer}>
                    <Text style={[
                        styles.settingsItemLabel,
                        isDisabled && styles.settingsItemLabelDisabled,
                        isDanger && styles.settingsItemLabelDanger
                    ]}>
                        {label}
                    </Text>
                    {value && (
                        <Text style={[
                            styles.settingsItemValue,
                            isDisabled && styles.settingsItemValueDisabled
                        ]}>
                            {value}
                        </Text>
                    )}
                </View>
            </View>

            <View style={styles.settingsItemRight}>
                {status ? (
                    <View style={styles.statusBadge}>
                        <Text style={styles.statusBadgeText}>{status}</Text>
                    </View>
                ) : rightComponent ? (
                    rightComponent
                ) : (
                    <Icon name="chevron-right" size={20} color="#9CA3AF" />
                )}
            </View>
        </TouchableOpacity>
    );
};

export const SettingsScreen = ({ userAvatar, userName, onOpenDrawer }) => {
    const navigation = useNavigation();
    const route = useRoute();
    
    // Estados
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
    
    // Estados de modales
    const [supportModalVisible, setSupportModalVisible] = useState(false);
    const [deleteAccountModalVisible, setDeleteAccountModalVisible] = useState(false);
    const [termsModalVisible, setTermsModalVisible] = useState(false);
    const [changePasswordModalVisible, setChangePasswordModalVisible] = useState(false);
    const [toggleModalVisible, setToggleModalVisible] = useState(false);
    const [toggleModalConfig, setToggleModalConfig] = useState(null);

    // Escuchar cuando regresa de TwoFactorAuth con activación exitosa
    useEffect(() => {
        if (route.params?.twoFactorActivated) {
            setTwoFactorEnabled(true);
            // Limpiar el parámetro
            navigation.setParams({ twoFactorActivated: undefined });
        }
    }, [route.params?.twoFactorActivated]);

    const handleBack = () => {
        navigation.goBack();
    };

    const handleLanguagePress = () => {
        // Deshabilitado por estado "Próximamente"
    };

    const handleNotificationsToggle = (value) => {
        setToggleModalConfig({
            title: value ? 'Activar Notificaciones' : 'Desactivar Notificaciones',
            message: value 
                ? '¿Deseas recibir notificaciones sobre tus actividades de reciclaje, premios disponibles y novedades?'
                : '¿Estás seguro que deseas desactivar las notificaciones? Podrías perderte actualizaciones importantes.',
            icon: 'bell',
            iconColor: value ? '#10B981' : '#F59E0B',
            onConfirm: () => {
                setNotificationsEnabled(value);
                setToggleModalVisible(false);
            }
        });
        setToggleModalVisible(true);
    };

    const handleDarkModePress = () => {
        // Deshabilitado por estado "En desarrollo"
    };

    const handleChangePassword = () => {
        setChangePasswordModalVisible(true);
    };

    const handleTwoFactorToggle = (value) => {
        if (value) {
            // Si se activa, navegar al flujo de configuración
            navigation.navigate('TwoFactorInfo');
        } else {
            // Si se desactiva, mostrar modal de confirmación
            setToggleModalConfig({
                title: 'Desactivar Verificación en 2 Pasos',
                message: '¿Estás seguro? Tu cuenta será menos segura sin esta capa adicional de protección.',
                icon: 'shield-off',
                iconColor: '#EF4444',
                onConfirm: () => {
                    setTwoFactorEnabled(false);
                    setToggleModalVisible(false);
                }
            });
            setToggleModalVisible(true);
        }
    };

    const handleHelpCenter = () => {
        setSupportModalVisible(true);
    };

    const handleTermsPress = () => {
        setTermsModalVisible(true);
    };

    const handleDeleteAccount = () => {
        setDeleteAccountModalVisible(true);
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <LinearGradient
                colors={['#018f64', '#00C7A1', '#018f64']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.header}
            >
                {/* Elementos decorativos */}
                <View style={styles.decorativeIconLeft}>
                    <Icon name="cog-outline" size={60} color="rgba(255, 255, 255, 0.1)" />
                </View>
                <View style={styles.decorativeIconRight}>
                    <Icon name="shield-check-outline" size={40} color="rgba(255, 255, 255, 0.1)" />
                </View>

                {/* Top Bar con Avatar y Menu */}
                <View style={styles.topBar}>
                    <TouchableOpacity onPress={onOpenDrawer} style={styles.menuButton}>
                        <Icon name="menu" size={28} color="#FFF" />
                    </TouchableOpacity>

                    <View style={styles.avatarContainer}>
                        <Image source={{ uri: userAvatar }} style={styles.avatar} />
                        <View style={styles.avatarBorder} />
                    </View>
                </View>

                {/* Contenido Principal */}
                <View style={styles.content}>
                    <View style={styles.titleSection}>
                        <Icon name="cog" size={32} color="#FFD700" />
                        <View style={styles.titleTextContainer}>
                            <Text style={styles.greeting}>Hola, {userName}</Text>
                            <Text style={styles.headerTitle}>Configuración</Text>
                            <Text style={styles.headerSubtitle}>Personaliza tu experiencia</Text>
                        </View>
                    </View>
                </View>
            </LinearGradient>

            <ScrollView 
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
            >
                {/* Sección Preferencias */}
                <SettingsSection title="PREFERENCIAS">
                    <SettingsItem
                        icon="web"
                        label="Idioma"
                        value="Español"
                        status="Próximamente"
                        onPress={handleLanguagePress}
                    />
                    
                    <SettingsItem
                        icon="bell"
                        label="Notificaciones"
                        value={notificationsEnabled ? "Activadas" : "Desactivadas"}
                        rightComponent={
                            <ToggleSwitch
                                value={notificationsEnabled}
                                onValueChange={handleNotificationsToggle}
                            />
                        }
                    />
                    
                    <SettingsItem
                        icon="weather-night"
                        label="Modo Oscuro"
                        status="En desarrollo"
                        onPress={handleDarkModePress}
                    />
                </SettingsSection>

                {/* Sección Seguridad */}
                <SettingsSection title="SEGURIDAD">
                    <SettingsItem
                        icon="lock"
                        label="Cambiar Contraseña"
                        onPress={handleChangePassword}
                    />
                    
                    <SettingsItem
                        icon="shield-check"
                        label="Verificación en 2 pasos"
                        value={twoFactorEnabled ? "Activado" : "Desactivado"}
                        rightComponent={
                            <ToggleSwitch
                                value={twoFactorEnabled}
                                onValueChange={handleTwoFactorToggle}
                            />
                        }
                    />
                </SettingsSection>

                {/* Sección Soporte */}
                <SettingsSection title="SOPORTE">
                    <SettingsItem
                        icon="help-circle"
                        label="Centro de Ayuda"
                        onPress={handleHelpCenter}
                    />
                    
                    <SettingsItem
                        icon="file-document"
                        label="Términos y Privacidad"
                        onPress={handleTermsPress}
                    />
                </SettingsSection>

                {/* Zona de Peligro */}
                <SettingsSection title="ZONA DE PELIGRO" style={styles.dangerSection}>
                    <SettingsItem
                        icon="delete"
                        iconColor="#DC2626"
                        label="Eliminar Cuenta"
                        isDanger={true}
                        onPress={handleDeleteAccount}
                    />
                </SettingsSection>

                {/* Versión */}
                <View style={styles.versionContainer}>
                    <Text style={styles.versionText}>Recycle App v1.0.0</Text>
                    <Text style={styles.versionSubtext}>© 2026 Nos Planét SAC</Text>
                </View>

                <View style={styles.bottomSpacing} />
            </ScrollView>

            {/* Modales */}
            <SupportModal
                visible={supportModalVisible}
                onClose={() => setSupportModalVisible(false)}
            />

            <DeleteAccountModal
                visible={deleteAccountModalVisible}
                onClose={() => setDeleteAccountModalVisible(false)}
                onConfirm={() => {
                    setDeleteAccountModalVisible(false);
                    // Lógica para eliminar cuenta
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Login' }],
                    });
                }}
            />

            <TermsModal
                visible={termsModalVisible}
                onClose={() => setTermsModalVisible(false)}
            />

            <ChangePasswordModal
                visible={changePasswordModalVisible}
                onClose={() => setChangePasswordModalVisible(false)}
            />

            {toggleModalConfig && (
                <ToggleConfirmModal
                    visible={toggleModalVisible}
                    title={toggleModalConfig.title}
                    message={toggleModalConfig.message}
                    icon={toggleModalConfig.icon}
                    iconColor={toggleModalConfig.iconColor}
                    onClose={() => setToggleModalVisible(false)}
                    onConfirm={toggleModalConfig.onConfirm}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    header: {
        paddingTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 20,
        position: 'relative',
        overflow: 'hidden',
    },
    decorativeIconLeft: {
        position: 'absolute',
        top: -10,
        left: -20,
        transform: [{ rotate: '-15deg' }],
    },
    decorativeIconRight: {
        position: 'absolute',
        top: 30,
        right: -10,
        transform: [{ rotate: '15deg' }],
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        zIndex: 1,
    },
    menuButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarContainer: {
        position: 'relative',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 3,
        borderColor: '#FFF',
    },
    avatarBorder: {
        position: 'absolute',
        width: 58,
        height: 58,
        borderRadius: 29,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        top: -4,
        left: -4,
    },
    content: {
        zIndex: 1,
    },
    titleSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    titleTextContainer: {
        marginLeft: 12,
        flex: 1,
    },
    greeting: {
        fontSize: 14,
        color: '#B7ECDC',
        marginBottom: 2,
    },
    headerTitle: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 2,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#FFD700',
        fontWeight: '600',
    },
    scrollView: {
        flex: 1,
    },
    section: {
        marginTop: 24,
        paddingHorizontal: 16,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6B7280',
        marginBottom: 12,
        marginLeft: 4,
        letterSpacing: 0.5,
    },
    sectionContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    settingsItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    settingsItemDisabled: {
        opacity: 0.5,
        backgroundColor: '#F9FAFB',
    },
    settingsItemDanger: {
        backgroundColor: '#FEF2F2',
    },
    settingsItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#E8F5F1',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    iconContainerDisabled: {
        backgroundColor: '#F3F4F6',
    },
    iconContainerDanger: {
        backgroundColor: '#FEE2E2',
    },
    settingsItemTextContainer: {
        flex: 1,
    },
    settingsItemLabel: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 2,
    },
    settingsItemLabelDisabled: {
        color: '#9CA3AF',
    },
    settingsItemLabelDanger: {
        color: '#DC2626',
    },
    settingsItemValue: {
        fontSize: 13,
        color: '#6B7280',
        marginTop: 2,
    },
    settingsItemValueDisabled: {
        color: '#9CA3AF',
    },
    settingsItemRight: {
        marginLeft: 12,
    },
    statusBadge: {
        backgroundColor: '#FEF3C7',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#FCD34D',
    },
    statusBadgeText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#92400E',
    },
    dangerSection: {
        marginTop: 32,
    },
    versionContainer: {
        alignItems: 'center',
        paddingVertical: 32,
        paddingHorizontal: 16,
    },
    versionText: {
        fontSize: 13,
        color: '#9CA3AF',
        fontWeight: '500',
    },
    versionSubtext: {
        fontSize: 11,
        color: '#D1D5DB',
        marginTop: 4,
    },
    bottomSpacing: {
        height: 20,
    },
});
