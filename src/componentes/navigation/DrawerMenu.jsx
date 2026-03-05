import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, Animated, Dimensions, Image, ScrollView } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LogOut } from 'lucide-react-native';
import { useRequestStore } from '../../hooks/use-request-store';
import { useAuthStore } from '../../hooks/use-auth-store';
import { useTranslation } from '../../hooks/use-translation'; // 🗣️ Importar Traducción

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = width * 0.75;

const LogoutModal = ({ visible, onClose, onConfirm, theme }) => {
    const t = useTranslation(); // 🗣️ Traducción para el modal
    const { colors } = theme;
    return (
        <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
            <View style={styles.logoutModalOverlay}>
                <View style={[styles.logoutModalContent, { backgroundColor: colors.surface }]}>
                    <View style={styles.logoutModalIconContainer}>
                        <LogOut color={colors.error} size={40} />
                    </View>
                    <Text style={[styles.logoutModalTitle, { color: colors.onSurface }]}>
                        {t.logoutModal.title}
                    </Text>
                    <Text style={[styles.logoutModalMessage, { color: colors.onSurfaceVariant }]}>
                        {t.logoutModal.message}
                    </Text>
                    <View style={styles.logoutModalButtons}>
                        <TouchableOpacity
                            style={[styles.logoutModalButton, { backgroundColor: colors.surfaceVariant }]}
                            onPress={onClose}
                        >
                            <Text style={{ color: colors.onSurface }}>{t.logoutModal.cancel}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.logoutModalButton, { backgroundColor: colors.error }]}
                            onPress={onConfirm}
                        >
                            <Text style={{ color: '#FFF', fontWeight: 'bold' }}>{t.logoutModal.confirm}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export const DrawerMenu = ({ visible, onClose }) => {
    const t = useTranslation(); // 🗣️ Hook de traducción
    const navigation = useNavigation();
    const theme = useTheme();
    const { colors, dark } = theme;
    const componentStyles = getStyles(theme);
    const { startLogout, user } = useAuthStore();
    const { requests } = useRequestStore();

    const textColor = dark ? colors.onSurface : '#FFFFFF';
    const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
    const [logoutModalVisible, setLogoutModalVisible] = useState(false);

    useEffect(() => {
        if (visible) {
            Animated.spring(slideAnim, {
                toValue: 0,
                useNativeDriver: true,
                tension: 65,
                friction: 11,
            }).start();
        } else {
            Animated.timing(slideAnim, {
                toValue: -DRAWER_WIDTH,
                duration: 250,
                useNativeDriver: true,
            }).start();
        }
    }, [visible]);

    const confirmLogout = () => {
        setLogoutModalVisible(false);
        onClose();
        startLogout();
    };

    // Estructura del menú traducida dinámicamente
    const menuSections = [
        {
            title: t.drawer.sections.main,
            items: [
                { icon: 'home', label: t.drawer.items.home, onPress: () => navigation.navigate('Home') },
                { icon: 'robot-happy', label: t.drawer.items.assistant, onPress: () => navigation.navigate('VirtualAssistant'), highlight: true },
                { icon: 'leaf', label: t.drawer.items.rank, onPress: () => navigation.navigate('Rank') },
                { icon: 'sprout', label: t.drawer.items.footprint, onPress: () => navigation.navigate('GreenFootprint') },
                { icon: 'account', label: t.drawer.items.profile, onPress: () => navigation.navigate('Profile') },
                { icon: 'handshake', label: t.drawer.items.donations, onPress: () => navigation.navigate('Donation') },
            ]
        },
        {
            title: t.drawer.sections.explore,
            items: [
                { icon: 'handshake', label: t.drawer.items.partners, onPress: () => navigation.navigate('Partners') },
                { icon: 'pine-tree', label: t.drawer.items.programs, onPress: () => navigation.navigate('EnvironmentalPrograms') },
                { icon: 'play-circle', label: t.drawer.items.induction, onPress: () => navigation.navigate('Induction') },
                { icon: 'forum', label: t.drawer.items.forum, onPress: () => navigation.navigate('Forum') },
                { icon: 'information', label: t.drawer.items.about, onPress: () => navigation.navigate('AboutUs') },
            ]
        },
        {
            title: t.drawer.sections.account,
            items: [
                {
                    icon: 'cog',
                    label: t.drawer.items.settings,
                    onPress: () => navigation.navigate('Settings', {
                        userAvatar: user.avatar,
                        userName: user.fullName,
                        userEmail: user.email,
                        userPhone: user.phone
                    })
                },
            ]
        }
    ];

    return (
        <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
            <View style={styles.modalContainer}>
                <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose} />

                <Animated.View style={[componentStyles.drawer, { transform: [{ translateX: slideAnim }] }]}>
                    <ScrollView showsVerticalScrollIndicator={false}>

                        {/* HEADER */}
                        <View style={componentStyles.drawerHeader}>
                            <Image source={{ uri: user.avatar }} style={styles.avatar} />
                            <View style={styles.userInfo}>
                                <Text style={[styles.userName, { color: textColor }]}>{user.fullName}</Text>
                                <Text style={[styles.userEmail, { color: dark ? colors.onSurfaceVariant : 'rgba(255,255,255,0.7)' }]}>
                                    {user.email}
                                </Text>
                                <View style={[styles.pointsBadge, { backgroundColor: dark ? colors.primaryContainer : 'rgba(255,255,255,0.2)' }]}>
                                    <Text style={{ color: textColor, fontWeight: 'bold' }}>
                                        {user.points} {t.drawer.points}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* SECCIONES */}
                        {menuSections.map((section, idx) => (
                            <View key={idx} style={styles.menuSection}>
                                <Text style={[styles.sectionTitle, { color: dark ? colors.primary : 'rgba(255,255,255,0.6)' }]}>
                                    {section.title}
                                </Text>
                                {section.items.map((item, i) => (
                                    <TouchableOpacity key={i} style={styles.menuItem} onPress={() => { item.onPress(); onClose(); }}>
                                        <Icon
                                            name={item.icon}
                                            size={22}
                                            color={item.highlight ? (dark ? colors.primary : '#FAC96E') : textColor}
                                        />
                                        <Text style={[styles.menuItemText, { color: textColor, fontWeight: item.highlight ? 'bold' : '400' }]}>
                                            {item.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        ))}

                        {/* FOOTER */}
                        <View style={styles.footer}>
                            <TouchableOpacity
                                style={[styles.logoutButton, { borderColor: textColor }]}
                                onPress={() => setLogoutModalVisible(true)}
                            >
                                <Icon name="logout" size={20} color={textColor} />
                                <Text style={[styles.logoutText, { color: textColor }]}>{t.drawer.logout}</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>

                    <LogoutModal visible={logoutModalVisible} onClose={() => setLogoutModalVisible(false)} onConfirm={confirmLogout} theme={theme} />
                </Animated.View>
            </View>
        </Modal>
    );
};

const getStyles = (theme) => StyleSheet.create({
    drawer: {
        position: 'absolute',
        left: 0, top: 0, bottom: 0,
        width: DRAWER_WIDTH,
        // 🚀 Si es oscuro usa el surface de Paper, si es claro usa tu verde principal
        backgroundColor: theme.dark ? theme.colors.background : theme.colors.greenMain,
        elevation: 16,
    },
    drawerHeader: {
        paddingTop: 50,
        paddingHorizontal: 20,
        paddingBottom: 20,
        borderBottomWidth: 0.5,
        borderBottomColor: theme.dark ? theme.colors.outlineVariant : 'rgba(255,255,255,0.2)',
        flexDirection: 'row',
        alignItems: 'center',
    },
});

// Estilos estáticos que no dependen del color (Layout)
const styles = StyleSheet.create({
    modalContainer: { flex: 1, flexDirection: 'row' },
    overlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.6)' },
    avatar: { width: 70, height: 70, borderRadius: 35, marginRight: 15 },
    userInfo: { flex: 1 },
    userName: { fontSize: 16, fontWeight: 'bold' },
    userEmail: { fontSize: 12 },
    pointsBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, alignSelf: 'flex-start', marginTop: 5 },
    menuSection: { marginTop: 20, paddingHorizontal: 20 },
    sectionTitle: { fontSize: 12, fontWeight: 'bold', marginBottom: 10, textTransform: 'uppercase' },
    menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
    menuItemText: { fontSize: 15, marginLeft: 15 },
    activeTaskSection: { marginTop: 15, paddingHorizontal: 20 },
    activeTaskSectionTitle: { fontSize: 11, fontWeight: 'bold', marginBottom: 8, textTransform: 'uppercase' },
    activeTaskItem: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 12 },
    activeTaskLabel: { fontSize: 13, fontWeight: 'bold', marginLeft: 10, flex: 1 },
    footer: { marginTop: 30, paddingHorizontal: 20, paddingBottom: 40 },
    logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 10, borderWidth: 1 },
    logoutText: { fontSize: 14, fontWeight: 'bold', marginLeft: 8 },
    logoutModalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.6)', justifyContent: 'center', alignItems: 'center' },
    logoutModalContent: { borderRadius: 24, padding: 28, width: '85%', alignItems: 'center' },
    logoutModalIconContainer: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#FFEBEE', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
    logoutModalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
    logoutModalMessage: { textAlign: 'center', marginBottom: 20 },
    logoutModalButtons: { flexDirection: 'row', gap: 10 },
    logoutModalButton: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
});