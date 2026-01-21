import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Animated, Dimensions, Image, ScrollView } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LogOut } from 'lucide-react-native';
// 1. IMPORTAR EL HOOK
import { useAuthStore } from '../../hooks/use-auth-store';

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = width * 0.75;

// Modal de Confirmación de Cierre de Sesión (Se mantiene igual)
const LogoutModal = ({ visible, onClose, onConfirm }) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.logoutModalOverlay}>
                <View style={styles.logoutModalContent}>
                    <View style={styles.logoutModalIconContainer}>
                        <LogOut color="#D32F2F" size={40} />
                    </View>

                    <Text style={styles.logoutModalTitle}>Cerrar Sesión</Text>
                    <Text style={styles.logoutModalMessage}>
                        ¿Estás seguro que deseas cerrar sesión?
                    </Text>

                    <View style={styles.logoutModalButtons}>
                        <TouchableOpacity
                            style={[styles.logoutModalButton, styles.logoutCancelButton]}
                            onPress={onClose}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.logoutCancelButtonText}>Cancelar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.logoutModalButton, styles.logoutConfirmButton]}
                            onPress={onConfirm}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.logoutConfirmButtonText}>Cerrar Sesión</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export const DrawerMenu = ({ visible, onClose, userName, userEmail, userPoints, avatarUrl }) => {
    const navigation = useNavigation();

    // 2. EXTRAER startLogout DEL HOOK
    const { startLogout, user } = useAuthStore();

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
        console.log('user', user);
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
                { icon: 'gift', label: 'Premios', onPress: () => navigation.navigate('Rewards') },
                { icon: 'sprout', label: 'Tu huella verde', onPress: () => navigation.navigate('GreenFootprint') },
                { icon: 'account', label: 'Mi perfil', onPress: () => navigation.navigate('Profile') },
                { icon: 'map', label: 'Mapa', onPress: () => navigation.navigate('Map') },
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
                { icon: 'cog', label: 'Configuración', onPress: () => navigation.navigate('Settings') },
            ]
        }
    ];

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                {/* Overlay oscuro */}
                <TouchableOpacity
                    style={styles.overlay}
                    activeOpacity={1}
                    onPress={onClose}
                />

                {/* Drawer */}
                <Animated.View
                    style={[
                        styles.drawer,
                        { transform: [{ translateX: slideAnim }] }
                    ]}
                >
                    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                        {/* Header del Drawer */}
                        <View style={styles.drawerHeader}>
                            <Image
                                source={{ uri: avatarUrl }}
                                style={styles.avatar}
                            />
                            <View style={styles.userInfo}>
                                <Text style={styles.userName}>{userName}</Text>
                                <Text style={styles.userEmail}>{userEmail}</Text>
                                <View style={styles.pointsBadge}>
                                    <Text style={styles.pointsText}>{userPoints} puntos</Text>
                                </View>
                            </View>
                        </View>

                        {/* Secciones del Menú */}
                        {menuSections.map((section, sectionIndex) => (
                            <View key={sectionIndex} style={styles.menuSection}>
                                <Text style={styles.sectionTitle}>{section.title}</Text>
                                {section.items.map((item, itemIndex) => (
                                    <TouchableOpacity
                                        key={itemIndex}
                                        style={[
                                            styles.menuItem,
                                            item.highlight && styles.menuItemHighlight
                                        ]}
                                        onPress={() => {
                                            item.onPress();
                                            onClose();
                                        }}
                                    >
                                        <Icon
                                            name={item.icon}
                                            size={20}
                                            color={item.highlight ? '#018f64' : '#000'}
                                        />
                                        <Text style={[
                                            styles.menuItemText,
                                            item.highlight && styles.menuItemTextHighlight
                                        ]}>
                                            {item.label}
                                        </Text>
                                        {item.highlight && (
                                            <View style={styles.newBadge}>
                                                <Text style={styles.newBadgeText}>Nuevo</Text>
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        ))}

                        {/* Footer */}
                        <View style={styles.footer}>
                            <Text style={styles.versionText}>Recycle App v1.0.0</Text>

                            <TouchableOpacity
                                style={styles.logoutButton}
                                onPress={handleLogoutPress}
                                activeOpacity={0.8}
                            >
                                <Icon name="logout" size={20} color="#000" />
                                <Text style={styles.logoutText}>Cerrar Sesión</Text>

                            </TouchableOpacity>
                        </View>
                    </ScrollView>

                    {/* Modal de Confirmación de Logout */}
                    <LogoutModal
                        visible={logoutModalVisible}
                        onClose={() => setLogoutModalVisible(false)}
                        onConfirm={confirmLogout}
                    />
                </Animated.View>
            </View>
        </Modal>
    );
};

// ... Styles se mantienen igual ...
const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        flexDirection: 'row',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    drawer: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: DRAWER_WIDTH,
        backgroundColor: '#B7ECDC',
        shadowColor: '#000',
        shadowOffset: { width: 4, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    scrollView: {
        flex: 1,
    },
    drawerHeader: {
        backgroundColor: '#018f64',
        paddingTop: 30,
        paddingHorizontal: 20,
        paddingBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#eee',
        marginRight: 15,
    },
    userInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 2,
    },
    userEmail: {
        fontSize: 12,
        color: '#FFFFFF',
        marginBottom: 8,
    },
    pointsBadge: {
        backgroundColor: '#B7ECDC',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        alignSelf: 'flex-start',
    },
    pointsText: {
        fontSize: 12,
        color: '#000',
        fontWeight: '600',
    },
    menuSection: {
        marginTop: 20,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 12,
        color: '#666',
        marginBottom: 10,
        fontWeight: '600',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    menuItemHighlight: {
        backgroundColor: 'rgba(1, 143, 100, 0.1)',
        paddingHorizontal: 12,
        borderRadius: 8,
        marginVertical: 4,
    },
    menuItemText: {
        fontSize: 15,
        color: '#000',
        marginLeft: 15,
        flex: 1,
    },
    menuItemTextHighlight: {
        color: '#018f64',
        fontWeight: '600',
    },
    newBadge: {
        backgroundColor: '#F59E0B',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
    },
    newBadgeText: {
        fontSize: 10,
        color: '#FFF',
        fontWeight: 'bold',
    },
    footer: {
        marginTop: 30,
        paddingHorizontal: 20,
        paddingBottom: 40,
        alignItems: 'center',
    },
    versionText: {
        fontSize: 12,
        color: '#666',
        marginBottom: 15,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'transparent',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
        width: '100%',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#000',
    },
    logoutText: {
        fontSize: 14,
        color: '#000',
        fontWeight: '600',
        marginLeft: 8,
    },
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