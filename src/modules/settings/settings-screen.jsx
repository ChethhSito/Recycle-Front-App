import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Switch, StatusBar, Dimensions, Platform } from 'react-native';
import { Text, useTheme, Divider } from 'react-native-paper'; // 🚀 Paper para temas
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch, useSelector } from 'react-redux'; // 📦 Redux para el cambio global
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

// Modales y Componentes
import { SupportModal } from '../../componentes/modal/settings/SupportModal';
import { DeleteAccountModal } from '../../componentes/modal/settings/DeleteAccountModal';
import { TermsModal } from '../../componentes/modal/settings/TermsModal';
import { ChangePasswordModal } from '../../componentes/modal/settings/ChangePasswordModal';
import { ToggleConfirmModal } from '../../componentes/modal/settings/ToggleConfirmModal';
import { EditProfileModal } from './editprofilemodal-screen';
import { useAuthStore } from '../../hooks/use-auth-store';
// 🚀 Añade estas importaciones arriba
import { useTranslation } from '../../hooks/use-translation'; // O donde hayas creado el hook
import { setLanguage } from '../../store/language';
import { languageSlice } from '../../store/language';
import { toggleTheme } from '../../store/theme';

const { width } = Dimensions.get('window');

import { TwoFactorInfoScreen } from './two-factor-auth/two-factor-info-screen';

const ToggleSwitch = ({ value, onValueChange, theme }) => (
    <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: theme.colors.outline, true: theme.colors.primaryContainer }}
        thumbColor={value ? theme.colors.primary : theme.colors.surfaceVariant}
    />
);

const SettingsSection = ({ title, children, theme }) => (
    <View style={styles.sectionContainer}>
        {title && <Text style={[styles.sectionTitle, { color: theme.colors.onSurfaceVariant }]}>{title}</Text>}
        <View style={[styles.sectionCard, { backgroundColor: theme.colors.surface }]}>
            {children}
        </View>
    </View>
);

const SettingsItem = ({ icon, label, value, onPress, rightComponent, isDanger, isLast, theme }) => {
    const { colors } = theme;
    return (
        <TouchableOpacity
            style={[styles.itemContainer, isLast && styles.itemLast, { borderBottomColor: colors.outlineVariant }]}
            onPress={onPress}
            disabled={!onPress && !rightComponent}
            activeOpacity={0.7}
        >
            <View style={styles.itemLeft}>
                <View style={[styles.iconBox, { backgroundColor: isDanger ? 'rgba(239, 68, 68, 0.1)' : colors.surfaceVariant }]}>
                    <Icon name={icon} size={22} color={isDanger ? colors.error : colors.primary} />
                </View>
                <View style={styles.textColumn}>
                    <Text style={[styles.itemLabel, { color: isDanger ? colors.error : colors.onSurface }]}>{label}</Text>
                    {value && <Text style={[styles.itemValue, { color: colors.onSurfaceVariant }]}>{value}</Text>}
                </View>
            </View>
            <View style={styles.itemRight}>
                {rightComponent || (onPress && <Icon name="chevron-right" size={20} color={colors.outline} />)}
            </View>
        </TouchableOpacity>
    );
};

export const SettingsScreen = ({ onOpenDrawer }) => {
    const t = useTranslation();
    const { language } = useSelector(state => state.language);
    const navigation = useNavigation();
    const theme = useTheme(); // 🎨 Obtenemos el tema (Light o Dark)
    const { colors, dark } = theme;
    const componentStyles = getStyles(theme);

    const { user } = useAuthStore();
    // 📦 Conectamos con el estado de Redux para el modo oscuro
    const { isDarkMode } = useSelector(state => state.theme);
    const dispatch = useDispatch();

    const toggleLanguage = () => {
        const newLang = language === 'es' ? 'en' : 'es';
        dispatch(setLanguage(newLang));
    };

    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    // Modales
    const [editProfileModalVisible, setEditProfileModalVisible] = useState(false);
    const [supportModalVisible, setSupportModalVisible] = useState(false);
    const [deleteAccountModalVisible, setDeleteAccountModalVisible] = useState(false);
    const [termsModalVisible, setTermsModalVisible] = useState(false);
    const [changePasswordModalVisible, setChangePasswordModalVisible] = useState(false);
    const [toggleModalVisible, setToggleModalVisible] = useState(false);
    const [toggleModalConfig, setToggleModalConfig] = useState(null);

    // 🌙 Función para cambiar el tema en toda la App
    const handleThemeToggle = () => {
        dispatch(toggleTheme()); // ✅ ESTO es lo que hace que cambie
        console.log("Modo oscuro cambiado a:", !isDarkMode);
    };

    const handleNotificationsToggle = (value) => {
        setToggleModalConfig({
            title: value ? 'Activar Notificaciones' : 'Desactivar Notificaciones',
            message: value ? '¿Deseas recibir alertas de reciclaje?' : 'Podrías perderte actualizaciones importantes.',
            icon: 'bell', iconColor: value ? '#10B981' : '#F59E0B',
            onConfirm: () => { setNotificationsEnabled(value); setToggleModalVisible(false); }
        });
        setToggleModalVisible(true);
    };

    return (
        <View style={componentStyles.mainContainer}>
            <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

            {/* Header Adaptado a Nos Planét */}
            <LinearGradient colors={[colors.greenMain, dark ? colors.surface : colors.greenMain]} style={styles.header}>
                <View style={styles.topBar}>
                    <TouchableOpacity onPress={onOpenDrawer} style={styles.menuBtn}>
                        <Icon name="menu" size={26} color="#FFF" />
                    </TouchableOpacity>
                    {/* 🗣️ Título dinámico */}
                    <Text style={[styles.headerTitle, { color: '#FFF' }]}>{t.settings.title}</Text>
                    <View style={{ width: 40 }} />
                </View>
            </LinearGradient>

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* 🗣️ Sección General */}
                <SettingsSection title={t.settings.general} theme={theme}>
                    <SettingsItem
                        icon="web"
                        label={t.settings.language}
                        value={language === 'es' ? 'Español' : 'English'}
                        theme={theme}
                        onPress={toggleLanguage}
                    />
                    <SettingsItem
                        icon="bell-outline"
                        label={t.settings.notification} // Asegúrate de tenerlo en translations.js
                        theme={theme}
                        rightComponent={<ToggleSwitch value={notificationsEnabled} onValueChange={handleNotificationsToggle} theme={theme} />}
                    />
                    <SettingsItem
                        icon="theme-light-dark"
                        label={t.settings.darkMode}
                        value={isDarkMode ? t.settings.enabled : t.settings.disabled}
                        theme={theme}
                        isLast
                        rightComponent={<ToggleSwitch value={isDarkMode} onValueChange={handleThemeToggle} theme={theme} />}
                    />
                </SettingsSection>

                {/* 🗣️ Sección Seguridad */}
                <SettingsSection title={t.settings.security} theme={theme}>
                    <SettingsItem icon="lock-outline" label={t.settings.changePassword} theme={theme} onPress={() => setChangePasswordModalVisible(true)} />
                    <SettingsItem icon="account-edit-outline" label={t.settings.editProfile} theme={theme} onPress={() => setEditProfileModalVisible(true)} />
                    <SettingsItem
                        icon="shield-check-outline"
                        label={t.settings.twoStep}
                        theme={theme}
                        isLast
                        onPress={() => set}
                    />
                </SettingsSection>

                <SettingsSection title={t.settings.help} theme={theme}>
                    <SettingsItem icon="lifebuoy" label={t.settings.center} theme={theme} onPress={() => setSupportModalVisible(true)} />
                    <SettingsItem icon="file-document-outline" label={t.settings.terms} theme={theme} isLast onPress={() => setTermsModalVisible(true)} />
                </SettingsSection>

                <View style={styles.dangerZone}>

                </View>

                <View style={styles.versionInfo}>
                    <Text style={[styles.versionText, { color: colors.onSurfaceVariant }]}>Versión 1.0.0 • Nos Planét</Text>
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>

            {/* Modales Sincronizados con el Tema */}
            <SupportModal visible={supportModalVisible} onClose={() => setSupportModalVisible(false)} theme={theme} />
            <DeleteAccountModal visible={deleteAccountModalVisible} onClose={() => setDeleteAccountModalVisible(false)} userEmail={user.email} theme={theme} />
            <TermsModal visible={termsModalVisible} onClose={() => setTermsModalVisible(false)} theme={theme} />
            <ChangePasswordModal visible={changePasswordModalVisible} onClose={() => setChangePasswordModalVisible(false)} theme={theme} />
            <EditProfileModal visible={editProfileModalVisible} onClose={() => setEditProfileModalVisible(false)} theme={theme} currentUser={user} />
            {toggleModalConfig && <ToggleConfirmModal visible={toggleModalVisible} {...toggleModalConfig} onClose={() => setToggleModalVisible(false)} theme={theme} />}
        </View>
    );
};

// 🎨 ESTILOS DINÁMICOS
const getStyles = (theme) => StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: theme.colors.background },
});

// Estilos estáticos de Layout
const styles = StyleSheet.create({
    header: { paddingTop: 50, paddingBottom: 25, paddingHorizontal: 20, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, marginBottom: 10, elevation: 4 },
    topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
    menuBtn: { padding: 8 },
    headerTitle: { fontSize: 20, fontWeight: 'bold' },
    scrollContent: { paddingHorizontal: 20 },
    sectionContainer: { marginTop: 20 },
    sectionTitle: { fontSize: 12, fontWeight: '700', marginBottom: 8, marginLeft: 10, textTransform: 'uppercase', opacity: 0.7 },
    sectionCard: { borderRadius: 20, paddingVertical: 5, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, overflow: 'hidden' },
    itemContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, paddingHorizontal: 16, borderBottomWidth: 0.5 },
    itemLast: { borderBottomWidth: 0 },
    itemLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 15 },
    iconBox: { width: 38, height: 38, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    textColumn: { flex: 1 },
    itemLabel: { fontSize: 15, fontWeight: '600' },
    itemValue: { fontSize: 12, marginTop: 2 },
    dangerZone: { marginTop: 25, marginBottom: 10 },
    versionInfo: { alignItems: 'center', marginTop: 20 },
    versionText: { fontSize: 12, fontWeight: '500' }
});