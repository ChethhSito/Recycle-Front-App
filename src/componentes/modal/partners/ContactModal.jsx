import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export const ContactModal = ({ visible, onClose }) => {
    const [sending, setSending] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleContact = (type) => {
        switch(type) {
            case 'email':
                Linking.openURL('mailto:convenios@nosplanet.pe');
                break;
            case 'phone':
                Linking.openURL('tel:+51999888777');
                break;
            case 'web':
                Linking.openURL('https://nosplanet.pe/convenios');
                break;
        }
    };

    const handleSendRequest = () => {
        setSending(true);
        setTimeout(() => {
            setSending(false);
            setShowSuccessModal(true);
        }, 1000);
    };

    const handleCloseSuccess = () => {
        setShowSuccessModal(false);
        onClose();
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    {/* Header */}
                    <View style={{ flex: 0 }}>
                        <LinearGradient
                            colors={['#018f64', '#00C7A1']}
                            style={styles.header}
                        >
                            <View style={styles.headerContent}>
                                <Icon name="handshake" size={40} color="#fff" />
                                <Text style={styles.title}>¿Eres una Empresa?</Text>
                                <Text style={styles.subtitle}>Conviértete en Partner</Text>
                            </View>
                            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                                <Icon name="close" size={28} color="#fff" />
                            </TouchableOpacity>
                        </LinearGradient>
                    </View>

                    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                        {/* Introducción */}
                        <View style={styles.introSection}>
                            <Text style={styles.introText}>
                                ¿Quieres formar parte de nuestra red de partners comprometidos con el medio ambiente? 
                                Contáctanos y únete al cambio.
                            </Text>
                        </View>

                        {/* Beneficios */}
                        <View style={styles.benefitsSection}>
                            <Text style={styles.sectionTitle}>¿Por qué ser Partner?</Text>
                            
                            <View style={styles.benefitItem}>
                                <Icon name="check-circle" size={20} color="#018f64" />
                                <Text style={styles.benefitText}>Visibilidad en nuestra plataforma</Text>
                            </View>
                            
                            <View style={styles.benefitItem}>
                                <Icon name="check-circle" size={20} color="#018f64" />
                                <Text style={styles.benefitText}>Conexión con comunidad eco-consciente</Text>
                            </View>
                            
                            <View style={styles.benefitItem}>
                                <Icon name="check-circle" size={20} color="#018f64" />
                                <Text style={styles.benefitText}>Promoción de productos sostenibles</Text>
                            </View>
                            
                            <View style={styles.benefitItem}>
                                <Icon name="check-circle" size={20} color="#018f64" />
                                <Text style={styles.benefitText}>Contribuye al cuidado del planeta</Text>
                            </View>
                        </View>

                        {/* Información de Contacto */}
                        <View style={styles.contactSection}>
                            <Text style={styles.contactTitle}>Información de Contacto</Text>
                            
                            <TouchableOpacity 
                                style={styles.contactCard}
                                onPress={() => handleContact('email')}
                            >
                                <View style={styles.iconContainer}>
                                    <Icon name="email" size={24} color="#018f64" />
                                </View>
                                <View style={styles.contactInfo}>
                                    <Text style={styles.contactLabel}>Correo</Text>
                                    <Text style={styles.contactValue}>convenios@nosplanet.pe</Text>
                                </View>
                                <Icon name="chevron-right" size={20} color="#999" />
                            </TouchableOpacity>

                            <TouchableOpacity 
                                style={styles.contactCard}
                                onPress={() => handleContact('phone')}
                            >
                                <View style={styles.iconContainer}>
                                    <Icon name="phone" size={24} color="#018f64" />
                                </View>
                                <View style={styles.contactInfo}>
                                    <Text style={styles.contactLabel}>Teléfono</Text>
                                    <Text style={styles.contactValue}>+51 999 888 777</Text>
                                </View>
                                <Icon name="chevron-right" size={20} color="#999" />
                            </TouchableOpacity>

                            <TouchableOpacity 
                                style={styles.contactCard}
                                onPress={() => handleContact('web')}
                            >
                                <View style={styles.iconContainer}>
                                    <Icon name="web" size={24} color="#018f64" />
                                </View>
                                <View style={styles.contactInfo}>
                                    <Text style={styles.contactLabel}>Página Web</Text>
                                    <Text style={styles.contactValue}>nosplanet.pe/convenios</Text>
                                </View>
                                <Icon name="chevron-right" size={20} color="#999" />
                            </TouchableOpacity>
                        </View>

                        {/* Botón Enviar Solicitud */}
                        <TouchableOpacity 
                            style={styles.sendButton}
                            onPress={handleSendRequest}
                            disabled={sending}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={['#018f64', '#00C7A1']}
                                style={styles.sendButtonGradient}
                            >
                                {sending ? (
                                    <Text style={styles.sendButtonText}>Enviando...</Text>
                                ) : (
                                    <>
                                        <Icon name="send" size={20} color="#fff" style={{ marginRight: 8 }} />
                                        <Text style={styles.sendButtonText}>Enviar Solicitud</Text>
                                    </>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>

                        <View style={styles.bottomPadding} />
                    </ScrollView>
                </View>
            </View>

            {/* Modal de Éxito */}
            <Modal
                visible={showSuccessModal}
                animationType="fade"
                transparent={true}
                onRequestClose={handleCloseSuccess}
            >
                <View style={styles.successOverlay}>
                    <View style={styles.successModal}>
                        <LinearGradient
                            colors={['#018f64', '#00C7A1']}
                            style={styles.successHeader}
                        >
                            <View style={styles.successIconContainer}>
                                <Icon name="check-circle" size={60} color="#fff" />
                            </View>
                        </LinearGradient>
                        
                        <View style={styles.successContent}>
                            <Text style={styles.successTitle}>Solicitud Enviada Exitosamente</Text>
                            <Text style={styles.successMessage}>
                                Hemos enviado a su correo electrónico un formulario detallado para que pueda proporcionarnos 
                                más información sobre su empresa. Nuestro equipo revisará su solicitud y nos pondremos en 
                                contacto con usted a la brevedad posible.
                            </Text>
                            
                            <TouchableOpacity 
                                style={styles.successButton}
                                onPress={handleCloseSuccess}
                                activeOpacity={0.8}
                            >
                                <LinearGradient
                                    colors={['#018f64', '#00C7A1']}
                                    style={styles.successButtonGradient}
                                >
                                    <Text style={styles.successButtonText}>Entendido</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '92%',
        height: '80%',
        backgroundColor: '#fff',
        borderRadius: 20,
        overflow: 'hidden',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    header: {
        paddingTop: 25,
        paddingBottom: 20,
        paddingHorizontal: 20,
        position: 'relative',
    },
    headerContent: {
        alignItems: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
        marginTop: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 13,
        color: '#fff',
        marginTop: 5,
        opacity: 0.95,
    },
    closeButton: {
        position: 'absolute',
        top: 15,
        right: 15,
        zIndex: 1,
        padding: 5,
    },
    scrollContent: {
        flex: 1,
    },
    introSection: {
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 10,
    },
    introText: {
        fontSize: 15,
        color: '#555',
        lineHeight: 22,
        textAlign: 'center',
    },
    contactSection: {
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    benefitsSection: {
        paddingHorizontal: 20,
        paddingTop: 5,
        paddingBottom: 10,
    },
    contactTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
    },
    section: {
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    description: {
        fontSize: 15,
        color: '#555',
        lineHeight: 22,
        textAlign: 'center',
    },
    sectionTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
    },
    benefitItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        paddingVertical: 2,
    },
    benefitText: {
        fontSize: 14,
        color: '#444',
        marginLeft: 10,
        flex: 1,
        lineHeight: 20,
    },
    contactCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
        padding: 14,
        borderRadius: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#E0F7F4',
        justifyContent: 'center',
        alignItems: 'center',
    },
    contactInfo: {
        flex: 1,
        marginLeft: 12,
    },
    contactLabel: {
        fontSize: 12,
        color: '#999',
        marginBottom: 2,
    },
    contactValue: {
        fontSize: 15,
        color: '#333',
        fontWeight: '500',
    },
    sendButton: {
        marginHorizontal: 20,
        marginTop: 10,
        borderRadius: 12,
        overflow: 'hidden',
        elevation: 4,
        shadowColor: '#018f64',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    sendButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
    },
    sendButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    bottomPadding: {
        height: 25,
    },
    // Estilos de Modal de Éxito
    successOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    successModal: {
        width: '85%',
        backgroundColor: '#fff',
        borderRadius: 20,
        overflow: 'hidden',
        elevation: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.4,
        shadowRadius: 15,
    },
    successHeader: {
        paddingVertical: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    successIconContainer: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    successContent: {
        padding: 25,
        alignItems: 'center',
    },
    successTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
        textAlign: 'center',
    },
    successMessage: {
        fontSize: 15,
        color: '#555',
        lineHeight: 22,
        textAlign: 'center',
        marginBottom: 25,
    },
    successButton: {
        width: '100%',
        borderRadius: 12,
        overflow: 'hidden',
        elevation: 3,
    },
    successButtonGradient: {
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    successButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
