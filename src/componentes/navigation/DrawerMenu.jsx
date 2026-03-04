import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Animated, Dimensions, Image, ScrollView } from 'react-native';
import { useTheme } from 'react-native-paper'; // 🚀 IMPORTACIÓN CORREGIDA AQUÍ
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LogOut } from 'lucide-react-native';
import { useRequestStore } from '../../hooks/use-request-store';
// 1. IMPORTAR EL HOOK
import { useAuthStore } from '../../hooks/use-auth-store';

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = width * 0.75;

// Modal de Confirmación de Cierre de Sesión (Se mantiene igual)
const LogoutModal = ({ visible, onClose, onConfirm, theme }) => {
    const { colors } = theme;
    return (
        <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
            <View style={styles.logoutModalOverlay}>
                <View style={[styles.logoutModalContent, { backgroundColor: colors.surface }]}>
                    <View style={styles.logoutModalIconContainer}>
                        <LogOut color={colors.error} size={40} />
                    </View>
                    <Text style={[styles.logoutModalTitle, { color: colors.onSurface }]}>Cerrar Sesión</Text>
                    <Text style={[styles.logoutModalMessage, { color: colors.onSurfaceVariant }]}>
                        ¿Estás seguro que deseas cerrar sesión?
                    </Text>
                    <View style={styles.logoutModalButtons}>
                        <TouchableOpacity
                            style={[styles.logoutModalButton, { backgroundColor: colors.surfaceVariant }]}
                            onPress={onClose}
                        >
                            <Text style={{ color: colors.onSurface }}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.logoutModalButton, { backgroundColor: colors.error }]}
                            onPress={onConfirm}
                        >
                            <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Cerrar Sesión</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export const DrawerMenu = ({ visible, onClose }) => {
    const navigation = useNavigation();
    const theme = useTheme(); // 🎨 Obtenemos el tema
    // 2. EXTRAER startLogout DEL HOOK
    const { colors, dark } = theme;
    const componentStyles = getStyles(theme); // 🛠️ Pasamos el tema a los estilos
    const { startLogout, user } = useAuthStore();
    const { requests } = useRequestStore();
    const textColor = dark ? colors.onSurface : '#FFFFFF';
    const iconColor = dark ? colors.primary : '#FFFFFF';
    const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
    const [logoutModalVisible, setLogoutModalVisible] = useState(false);
    const activeTask = user.role === 'RECYCLER'
        ? requests.find(req => req.status === 'ACCEPTED')
        : null;

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

    const handleLogoutPress = () => {
        setLogoutModalVisible(true);
    };

    // 3. FUNCIÓN LOGOUT SIMPLIFICADA
    const confirmLogout = () => {
        setLogoutModalVisible(false);
        onClose(); // Cierra el drawer visualmente

        // Llamada directa al hook (sin try-catch ni async/await necesarios aquí, el hook lo maneja)
        startLogout();
    };

    const menuSections = [
        {
            title: 'Principal',
            items: [
                { icon: 'home', label: 'Inicio', onPress: () => navigation.navigate('Home') },
                { icon: 'robot-happy', label: 'Asistente Virtual', onPress: () => navigation.navigate('VirtualAssistant'), highlight: true },
                { icon: 'leaf', label: 'EcoPuntos', onPress: () => navigation.navigate('Rank') },
                { icon: 'sprout', label: 'Tu huella verde', onPress: () => navigation.navigate('GreenFootprint') },
                { icon: 'account', label: 'Mi perfil', onPress: () => navigation.navigate('Profile') },
                { icon: 'handshake', label: 'Donaciones', onPress: () => navigation.navigate('Donation') },
                // { icon: 'map', label: 'Solicitudes', onPress: () => navigation.navigate('Map') },
            ]
        },
        {
            title: 'Explorar',
            items: [
                { icon: 'handshake', label: 'Convenios', onPress: () => navigation.navigate('Partners') },
                { icon: 'pine-tree', label: 'Programas Ambientales', onPress: () => navigation.navigate('EnvironmentalPrograms') },
                { icon: 'play-circle', label: 'Inducción', onPress: () => navigation.navigate('Induction') },
                { icon: 'forum', label: 'Foro', onPress: () => navigation.navigate('Forum') },
                { icon: 'information', label: 'Acerca de Nos Planét', onPress: () => navigation.navigate('AboutUs') },
            ]
        },
        {
            title: 'Cuenta',
            items: [
                {
                    icon: 'cog', label: 'Configuración', onPress: () => navigation.navigate('Settings', {
                        // Pasamos los datos del usuario que sacaste del store
                        userAvatar: user.avatar,
                        userName: user.fullName,
                        userEmail: user.email,
                        userPhone: user.phone // Agregamos el teléfono también
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

                        {/* HEADER: Texto Blanco sobre el verde de Nos Planét */}
                        <View style={componentStyles.drawerHeader}>
                            <Image source={{ uri: user.avatar }} style={styles.avatar} />
                            <View style={styles.userInfo}>
                                <Text style={[styles.userName, { color: textColor }]}>{user.fullName}</Text>
                                <Text style={[styles.userEmail, { color: dark ? colors.onSurfaceVariant : 'rgba(255,255,255,0.7)' }]}>
                                    {user.email}
                                </Text>
                                <View style={[styles.pointsBadge, { backgroundColor: dark ? colors.primaryContainer : 'rgba(255,255,255,0.2)' }]}>
                                    <Text style={{ color: textColor, fontWeight: 'bold' }}>{user.points} puntos</Text>
                                </View>
                            </View>
                        </View>

                        {/* SECCIONES: Iconos y Textos dinámicos */}
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

                        <View style={styles.footer}>
                            <TouchableOpacity
                                style={[styles.logoutButton, { borderColor: textColor }]}
                                onPress={() => setLogoutModalVisible(true)}
                            >
                                <Icon name="logout" size={20} color={textColor} />
                                <Text style={[styles.logoutText, { color: textColor }]}>Cerrar Sesión</Text>
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