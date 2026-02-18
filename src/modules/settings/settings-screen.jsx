import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Image, StatusBar, Modal, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { SupportModal } from '../../componentes/modal/settings/SupportModal';
import { DeleteAccountModal } from '../../componentes/modal/settings/DeleteAccountModal';
import { TermsModal } from '../../componentes/modal/settings/TermsModal';
import { ChangePasswordModal } from '../../componentes/modal/settings/ChangePasswordModal';
import { ToggleConfirmModal } from '../../componentes/modal/settings/ToggleConfirmModal';
import { EditProfileModal } from './editprofilemodal-screen';
import { useAuthStore } from '../../hooks/use-auth-store';

const { width } = Dimensions.get('window');

// PALETA DE COLORES
const COLORS = {
    primary: '#31253B',
    background: '#018f64',
    lightMint: '#b1eedc',
    white: '#FFFFFF',
    danger: '#EF4444',
    textGrey: '#6B7280',
    iconBg: '#F3F4F6'
};

// Componente Switch Personalizado
const ToggleSwitch = ({ value, onValueChange, disabled }) => (
    <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#D1D5DB', true: '#A7F3D0' }}
        thumbColor={value ? COLORS.background : '#F9FAFB'}
        disabled={disabled}
    />
);

// Componente de Sección (Tarjeta Flotante)
const SettingsSection = ({ title, children }) => (
    <View style={styles.sectionContainer}>
        {title && <Text style={styles.sectionTitle}>{title}</Text>}
        <View style={styles.sectionCard}>
            {children}
        </View>
    </View>
);

// Componente de Ítem
const SettingsItem = ({ icon, iconColor = COLORS.background, label, value, onPress, rightComponent, isDanger, isLast }) => (
    <TouchableOpacity
        style={[styles.itemContainer, isLast && styles.itemLast]}
        onPress={onPress}
        disabled={!onPress && !rightComponent}
        activeOpacity={0.7}
    >
        <View style={styles.itemLeft}>
            <View style={[styles.iconBox, isDanger && styles.iconBoxDanger]}>
                <Icon name={icon} size={22} color={isDanger ? COLORS.danger : iconColor} />
            </View>
            <View style={styles.textColumn}>
                <Text style={[styles.itemLabel, isDanger && styles.textDanger]}>{label}</Text>
                {value && <Text style={styles.itemValue}>{value}</Text>}
            </View>
        </View>

        <View style={styles.itemRight}>
            {rightComponent || (onPress && <Icon name="chevron-right" size={20} color="#9CA3AF" />)}
        </View>
    </TouchableOpacity>
);

export const SettingsScreen = ({ onOpenDrawer }) => {
    const navigation = useNavigation();
    const route = useRoute();
    const { user } = useAuthStore();

    // Estados
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

    // Modales
    const [editProfileModalVisible, setEditProfileModalVisible] = useState(false);
    const [supportModalVisible, setSupportModalVisible] = useState(false);
    const [deleteAccountModalVisible, setDeleteAccountModalVisible] = useState(false);
    const [termsModalVisible, setTermsModalVisible] = useState(false);
    const [changePasswordModalVisible, setChangePasswordModalVisible] = useState(false);
    const [toggleModalVisible, setToggleModalVisible] = useState(false);
    const [toggleModalConfig, setToggleModalConfig] = useState(null);

    useEffect(() => {
        if (route.params?.twoFactorActivated) {
            setTwoFactorEnabled(true);
            navigation.setParams({ twoFactorActivated: undefined });
        }
    }, [route.params?.twoFactorActivated]);

    // Handlers (Mantenemos tu lógica intacta)
    const handleNotificationsToggle = (value) => {
        setToggleModalConfig({
            title: value ? 'Activar Notificaciones' : 'Desactivar Notificaciones',
            message: value ? '¿Deseas recibir alertas de reciclaje?' : 'Podrías perderte actualizaciones importantes.',
            icon: 'bell', iconColor: value ? '#10B981' : '#F59E0B',
            onConfirm: () => { setNotificationsEnabled(value); setToggleModalVisible(false); }
        });
        setToggleModalVisible(true);
    };

    const handleTwoFactorToggle = (value) => {
        if (value) navigation.navigate('TwoFactorInfo');
        else {
            setToggleModalConfig({
                title: 'Desactivar 2FA',
                message: 'Tu cuenta será menos segura.',
                icon: 'shield-off', iconColor: COLORS.danger,
                onConfirm: () => { setTwoFactorEnabled(false); setToggleModalVisible(false); }
            });
            setToggleModalVisible(true);
        }
    };

    return (
        <View style={styles.mainContainer}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

            {/* Header Compacto */}
            <LinearGradient colors={[COLORS.background, '#016d4e']} style={styles.header}>
                <View style={styles.topBar}>
                    <TouchableOpacity onPress={onOpenDrawer} style={styles.menuBtn}>
                        <Icon name="menu" size={26} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Configuración</Text>
                    <View style={{ width: 40 }} />
                </View>



            </LinearGradient>

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Preferencias */}
                <SettingsSection title="GENERAL">
                    <SettingsItem icon="web" label="Idioma" value="Español" onPress={() => { }} />
                    <SettingsItem
                        icon="bell-outline"
                        label="Notificaciones"
                        rightComponent={<ToggleSwitch value={notificationsEnabled} onValueChange={handleNotificationsToggle} />}
                    />
                    <SettingsItem icon="theme-light-dark" label="Modo Oscuro" value="Automático" isLast onPress={() => { }} />
                </SettingsSection>

                {/* Seguridad */}
                <SettingsSection title="SEGURIDAD">
                    <SettingsItem icon="lock-outline" label="Cambiar Contraseña" onPress={() => setChangePasswordModalVisible(true)} />
                    <SettingsItem icon="account-edit-outline" label="Editar Perfil" onPress={() => setEditProfileModalVisible(true)} />
                    <SettingsItem
                        icon="shield-check-outline"
                        label="Verificación en 2 pasos"
                        rightComponent={<ToggleSwitch value={twoFactorEnabled} onValueChange={handleTwoFactorToggle} />}
                        isLast
                    />
                </SettingsSection>

                {/* Soporte */}
                <SettingsSection title="AYUDA & LEGAL">
                    <SettingsItem icon="lifebuoy" label="Centro de Ayuda" onPress={() => setSupportModalVisible(true)} />
                    <SettingsItem icon="file-document-outline" label="Términos y Privacidad" isLast onPress={() => setTermsModalVisible(true)} />
                </SettingsSection>

                {/* Zona de Peligro */}
                <View style={styles.dangerZone}>
                    <SettingsItem
                        icon="delete-outline"
                        label="Eliminar Cuenta"
                        isDanger
                        isLast
                        onPress={() => setDeleteAccountModalVisible(true)}
                    />
                </View>

                <View style={styles.versionInfo}>
                    <Text style={styles.versionText}>Versión 1.0.0 • Nos Planét</Text>
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>

            {/* Modales (Mantenemos tus componentes) */}
            <SupportModal visible={supportModalVisible} onClose={() => setSupportModalVisible(false)} />
            <DeleteAccountModal visible={deleteAccountModalVisible} onClose={() => setDeleteAccountModalVisible(false)} userEmail={user.email} userName={user.fullName} onConfirm={() => setDeleteAccountModalVisible(false)} />
            <TermsModal visible={termsModalVisible} onClose={() => setTermsModalVisible(false)} />
            <ChangePasswordModal visible={changePasswordModalVisible} onClose={() => setChangePasswordModalVisible(false)} />
            <EditProfileModal visible={editProfileModalVisible} onClose={() => setEditProfileModalVisible(false)} currentUser={{ fullName: user.fullName, phone: user.phone, avatarUrl: user.avatar }} onUpdateSuccess={onOpenDrawer} />
            {toggleModalConfig && <ToggleConfirmModal visible={toggleModalVisible} {...toggleModalConfig} onClose={() => setToggleModalVisible(false)} />}
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: COLORS.lightMint }, // Fondo Menta Global

    header: {
        paddingTop: 50, paddingBottom: 25, paddingHorizontal: 20,
        borderBottomLeftRadius: 30, borderBottomRightRadius: 30,
        marginBottom: 10,
        elevation: 4,
    },
    topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
    menuBtn: { padding: 8, borderRadius: 12 },
    headerTitle: { fontSize: 20, color: '#000' },

    profileSummary: { flexDirection: 'row', alignItems: 'center', gap: 15 },
    avatar: { width: 50, height: 50, borderRadius: 25, borderWidth: 1, borderColor: '#000' },
    userName: { fontSize: 18, color: '#000' },
    userEmail: { fontSize: 13, color: '#000000' },

    scrollContent: { paddingHorizontal: 20 },

    // Secciones (Tarjetas Blancas)
    sectionContainer: { marginTop: 20 },
    sectionTitle: { fontSize: 12, fontWeight: '700', color: COLORS.primary, marginBottom: 8, marginLeft: 10, textTransform: 'uppercase', opacity: 0.7 },
    sectionCard: {
        backgroundColor: COLORS.white,
        borderRadius: 20,
        paddingVertical: 5,
        elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5,
        overflow: 'hidden'
    },

    // Items
    itemContainer: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingVertical: 14, paddingHorizontal: 16,
        borderBottomWidth: 1, borderBottomColor: '#F3F4F6'
    },
    itemLast: { borderBottomWidth: 0 },
    itemLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 15 },
    iconBox: {
        width: 38, height: 38, borderRadius: 12,
        backgroundColor: COLORS.iconBg,
        justifyContent: 'center', alignItems: 'center'
    },
    iconBoxDanger: { backgroundColor: '#FEF2F2' },

    textColumn: { flex: 1 },
    itemLabel: { fontSize: 15, fontWeight: '600', color: COLORS.primary },
    itemValue: { fontSize: 12, color: COLORS.textGrey, marginTop: 2 },
    textDanger: { color: COLORS.danger },

    dangerZone: { marginTop: 25, marginBottom: 10 },

    versionInfo: { alignItems: 'center', marginTop: 20 },
    versionText: { fontSize: 12, color: COLORS.textGrey, fontWeight: '500' }
});