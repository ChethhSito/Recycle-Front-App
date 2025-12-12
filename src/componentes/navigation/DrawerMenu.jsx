import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Animated, Dimensions, Image, ScrollView } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = width * 0.75;

export const DrawerMenu = ({ visible, onClose, userName, userEmail, userPoints, avatarUrl }) => {
    const slideAnim = React.useRef(new Animated.Value(-DRAWER_WIDTH)).current;

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

    const menuSections = [
        {
            title: 'Principal',
            items: [
                { icon: 'home', label: 'Inicio', onPress: () => console.log('Inicio') },
                { icon: 'leaf', label: 'EcoPuntos', onPress: () => console.log('EcoPuntos') },
                { icon: 'sprout', label: 'Tu histerio verde', onPress: () => console.log('Tu histerio verde') },
                { icon: 'account', label: 'Mi perfil', onPress: () => console.log('Mi perfil') },
            ]
        },
        {
            title: 'Explorar',
            items: [
                { icon: 'pine-tree', label: 'Programas Ambientales', onPress: () => console.log('Programas Ambientales') },
                { icon: 'play-circle', label: 'Inducción', onPress: () => console.log('Inducción') },
                { icon: 'forum', label: 'Foro', onPress: () => console.log('Foro') },
                { icon: 'information', label: 'Acerca de Nosotros', onPress: () => console.log('Acerca de Nosotros') },
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
                                        style={styles.menuItem}
                                        onPress={() => {
                                            item.onPress();
                                            onClose();
                                        }}
                                    >
                                        <Icon name={item.icon} size={20} color="#000" />
                                        <Text style={styles.menuItemText}>{item.label}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        ))}

                        {/* Footer */}
                        <View style={styles.footer}>
                            <Text style={styles.versionText}>Recycle v1.0.0</Text>
                            <TouchableOpacity 
                                style={styles.logoutButton}
                                onPress={() => {
                                    console.log('Cerrar Sesión');
                                    onClose();
                                }}
                            >
                                <Icon name="logout" size={18} color="#B7ECDC" />
                                <Text style={styles.logoutText}>Cerrar Sesión</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
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
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    drawer: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: DRAWER_WIDTH,
        backgroundColor: '#B7ECDC',
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 5,
    },
    scrollView: {
        flex: 1,
    },
    drawerHeader: {
        backgroundColor: '#00926F',
        paddingTop: 50,
        paddingHorizontal: 20,
        paddingBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#eee',
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
        gap: 15,
    },
    menuItemText: {
        fontSize: 15,
        color: '#000',
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
        backgroundColor: '#00926F',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
        gap: 8,
        width: '100%',
        justifyContent: 'center',
    },
    logoutText: {
        fontSize: 14,
        color: '#B7ECDC',
        fontWeight: '600',
    },
});
