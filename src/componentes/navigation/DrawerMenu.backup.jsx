import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Animated, Dimensions, Image, ScrollView } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LogOut, AlertTriangle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = width * 0.75;

// Modal de Confirmación de Cierre de Sesión
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
    const slideAnim = React.useRef(new Animated.Value(-DRAWER_WIDTH)).current;
    const [pressedItem, setPressedItem] = React.useState(null);
    const [logoutModalVisible, setLogoutModalVisible] = React.useState(false);

    React.useEffect(() => {
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

    const confirmLogout = () => {
        setLogoutModalVisible(false);
        onClose();
        // Navegar al Login y resetear la navegación
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
    };

    const menuSections = [
        {
            title: 'Principal',
            items: [
                { icon: 'home', label: 'Inicio', onPress: () => navigation.navigate('Home') },
                { icon: 'leaf', label: 'EcoPuntos', onPress: () => navigation.navigate('Rank') },
                { icon: 'gift', label: 'Premios', onPress: () => navigation.navigate('Rewards') },
                { icon: 'sprout', label: 'Tu huella verde', onPress: () => navigation.navigate('GreenFootprint') },
                { icon: 'account', label: 'Mi perfil', onPress: () => navigation.navigate('Profile') },
            ]
        },
        {
            title: 'Explorar',
            items: [
                { icon: 'handshake', label: 'Convenios', onPress: () => navigation.navigate('Partners') },
                { icon: 'pine-tree', label: 'Programas Ambientales', onPress: () => console.log('Programas Ambientales') },
                { icon: 'play-circle', label: 'Inducción', onPress: () => navigation.navigate('Induction') },
                { icon: 'forum', label: 'Foro', onPress: () => navigation.navigate('Forum') },
                { icon: 'information', label: 'Acerca de Nos Planét', onPress: () => navigation.navigate('AboutUs') },
            ]
        },
        {
            title: 'Cuenta',
            items: [
                { icon: 'cog', label: 'Configuración', onPress: () => console.log('Configuración') },
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
                        {/* Header del Drawer con gradiente mejorado */}
                        <LinearGradient
                            colors={['#018f64', '#00C7A1', '#018f64']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.drawerHeader}
                        >
                            {/* Elementos decorativos */}
                            <View style={styles.decorCircle1} />
                            <View style={styles.decorCircle2} />
                            
                            <View style={styles.headerContent}>
                                {/* Avatar con glow effect */}
                                <View style={styles.avatarContainer}>
                                    <View style={styles.avatarGlow}>
                                        <Image
                                            source={{ uri: avatarUrl }}
                                            style={styles.avatar}
                                        />
                                    </View>
                                </View>
                                
                                <View style={styles.userInfo}>
                                    <Text style={styles.userName}>{userName}</Text>
                                    <Text style={styles.userEmail}>{userEmail}</Text>
                                    
                                    {/* Points badge mejorado */}
                                    <View style={styles.pointsBadge}>
                                        <LinearGradient
                                            colors={['rgba(255, 255, 255, 0.95)', 'rgba(183, 236, 220, 0.95)']}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 0 }}
                                            style={styles.pointsGradient}
                                        >
                                            <Icon name="star" size={14} color="#FFD700" />
                                            <Text style={styles.pointsText}>{userPoints} EcoPuntos</Text>
                                        </LinearGradient>
                                    </View>
                                </View>
                            </View>
                        </LinearGradient>

                        {/* Secciones del Menú con diseño mejorado */}
                        {menuSections.map((section, sectionIndex) => (
                            <View key={sectionIndex} style={styles.menuSection}>
                                <View style={styles.sectionHeaderContainer}>
                                    <View style={styles.sectionLine} />
                                    <Text style={styles.sectionTitle}>{section.title}</Text>
                                    <View style={styles.sectionLine} />
                                </View>
                                
                                {section.items.map((item, itemIndex) => (
                                    <TouchableOpacity
                                        key={itemIndex}
                                        style={[
                                            styles.menuItem,
                                            pressedItem === `${sectionIndex}-${itemIndex}` && styles.menuItemPressed
                                        ]}
                                        onPress={() => {
                                            setPressedItem(`${sectionIndex}-${itemIndex}`);
                                            setTimeout(() => {
                                                item.onPress();
                                                onClose();
                                                setPressedItem(null);
                                            }, 200);
                                        }}
                                        activeOpacity={0.7}
                                    >
                                        <View style={styles.menuItemIconContainer}>
                                            <Icon name={item.icon} size={22} color="#018f64" />
                                        </View>
                                        <Text style={styles.menuItemText}>{item.label}</Text>
                                        <Icon name="chevron-right" size={18} color="#CCC" />
                                    </TouchableOpacity>
                                ))}
                            </View>
                        ))}

                        {/* Footer mejorado */}
                        <View style={styles.footer}>
                            <View style={styles.footerCard}>
                                <Icon name="information-outline" size={20} color="#018f64" />
                                <Text style={styles.versionText}>Recycle App v1.0.0</Text>
                            </View>
                            
                            <TouchableOpacity
                                style={styles.logoutButton}
                                onPress={handleLogoutPress}
                                activeOpacity={0.8}
                            >
                                <LinearGradient
                                    colors={['#D32F2F', '#F44336']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.logoutGradient}
                                >
                                    <Icon name="logout" size={20} color="#FFF" />
                                    <Text style={styles.logoutText}>Cerrar Sesión</Text>
                                </LinearGradient>
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
        backgroundColor: '#FFFFFF',
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
        paddingTop: 40,
        paddingHorizontal: 20,
        paddingBottom: 20,
        position: 'relative',
        overflow: 'hidden',
    },
    decorCircle1: {
        position: 'absolute',
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        top: -25,
        right: -15,
    },
    decorCircle2: {
        position: 'absolute',
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        bottom: -15,
        left: 15,
    },
    headerContent: {
        alignItems: 'center',
        zIndex: 1,
    },
    avatarContainer: {
        marginBottom: 12,
    },
    avatarGlow: {
        width: 76,
        height: 76,
        borderRadius: 38,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#FFF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 6,
    },
    avatar: {
        width: 70,
        height: 70,
        borderRadius: 35,
        borderWidth: 2.5,
        borderColor: '#FFF',
    },
    userInfo: {
        alignItems: 'center',
        width: '100%',
    },
    userName: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 3,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    userEmail: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.95)',
        marginBottom: 10,
    },
    pointsBadge: {
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
        elevation: 3,
    },
    pointsGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        gap: 5,
    },
    pointsText: {
        fontSize: 12,
        color: '#018f64',
        fontWeight: '700',
    },
    menuSection: {
        marginTop: 18,
        paddingHorizontal: 14,
    },
    sectionHeaderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#E0E0E0',
    },
    sectionTitle: {
        fontSize: 11,
        color: '#018f64',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginHorizontal: 10,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 11,
        paddingHorizontal: 12,
        marginBottom: 6,
        backgroundColor: '#F8F9FA',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E8E8E8',
    },
    menuItemPressed: {
        backgroundColor: '#E8F5F1',
        borderColor: '#B7ECDC',
        transform: [{ scale: 0.98 }],
    },
    menuItemIconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 2,
        elevation: 2,
    },
    menuItemText: {
        flex: 1,
        fontSize: 14,
        color: '#32243B',
        fontWeight: '500',
    },
    footer: {
        marginTop: 24,
        paddingHorizontal: 16,
        paddingBottom: 32,
    },
    footerCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F8F9FA',
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 10,
        marginBottom: 12,
        gap: 6,
    },
    versionText: {
        fontSize: 11,
        color: '#666',
        fontWeight: '500',
    },
    logoutButton: {
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#D32F2F',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 4,
    },
    logoutGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 13,
        paddingHorizontal: 16,
        gap: 8,
    },
    logoutText: {
        fontSize: 14,
        color: '#FFF',
        fontWeight: '700',
    },
    // Estilos del Modal de Logout mejorado
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
