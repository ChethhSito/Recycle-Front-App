import React from 'react';
import {
    Modal,
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    Image,
    Animated,
} from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const { height, width } = Dimensions.get('window');

export const ProgramDetailModal = ({ 
    visible, 
    onClose, 
    program 
}) => {
    const theme = useTheme();
    const slideAnim = React.useRef(new Animated.Value(height)).current;

    React.useEffect(() => {
        if (visible) {
            Animated.spring(slideAnim, {
                toValue: 0,
                useNativeDriver: true,
                tension: 50,
                friction: 8,
            }).start();
        } else {
            Animated.timing(slideAnim, {
                toValue: height,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [visible]);

    if (!program) return null;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <BlurView intensity={20} style={StyleSheet.absoluteFill} />
                
                <Animated.View 
                    style={[
                        styles.modalContent,
                        { transform: [{ translateY: slideAnim }] }
                    ]}
                >
                    {/* Header con imagen */}
                    <View style={styles.header}>
                        <Image 
                            source={program.image} 
                            style={styles.headerImage}
                            resizeMode="cover"
                        />
                        <TouchableOpacity 
                            style={styles.closeButton}
                            onPress={onClose}
                        >
                            <Icon name="close" size={28} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    {/* Contenido con scroll */}
                    <ScrollView 
                        style={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        <Text style={styles.title}>{program.title}</Text>

                        {/* Descripción */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Icon name="text" size={24} color="#00926F" />
                                <Text style={styles.sectionTitle}>Descripción</Text>
                            </View>
                            <Text style={styles.sectionText}>
                                {program.description || 'Participa en este programa de reciclaje comunitario y ayuda a mantener nuestro entorno limpio.'}
                            </Text>
                        </View>

                        {/* Horario */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Icon name="clock-outline" size={24} color="#00926F" />
                                <Text style={styles.sectionTitle}>Horario</Text>
                            </View>
                            <Text style={styles.sectionText}>
                                {program.schedule || '6:00 PM - 9:00 PM'}
                            </Text>
                        </View>

                        {/* Ubicación */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Icon name="map-marker" size={24} color="#00926F" />
                                <Text style={styles.sectionTitle}>Ubicación</Text>
                            </View>
                            <Text style={styles.sectionText}>
                                {program.location || 'Sector 3 - Plaza de Armas'}
                            </Text>
                        </View>

                        {/* Contacto */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Icon name="phone" size={24} color="#00926F" />
                                <Text style={styles.sectionTitle}>Contacto</Text>
                            </View>
                            <Text style={styles.sectionText}>
                                {program.contact || 'Tel: (01) 234-5678\nEmail: reciclaje@ecolloy.pe'}
                            </Text>
                        </View>

                        <View style={{ height: 100 }} />
                    </ScrollView>

                    {/* Botón de acción fijo */}
                    <View style={styles.footer}>
                        <Button
                            mode="contained"
                            onPress={() => {
                                console.log('Participar en:', program.title);
                                onClose();
                            }}
                            style={styles.participateButton}
                            labelStyle={styles.participateButtonLabel}
                        >
                            Participar ahora
                        </Button>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        height: height * 0.9,
        overflow: 'hidden',
    },
    header: {
        height: 250,
        position: 'relative',
    },
    headerImage: {
        width: '100%',
        height: '100%',
    },
    closeButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#31253B',
        marginBottom: 20,
    },
    section: {
        marginBottom: 25,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#31253B',
        marginLeft: 10,
    },
    sectionText: {
        fontSize: 15,
        color: '#666',
        lineHeight: 22,
        marginLeft: 34,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#E5E5E5',
    },
    participateButton: {
        backgroundColor: '#00926F',
        borderRadius: 12,
        paddingVertical: 8,
    },
    participateButtonLabel: {
        fontSize: 16,
        fontWeight: '600',
    },
});
