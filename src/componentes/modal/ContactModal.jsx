import React from 'react';
import { View, Text, StyleSheet, Modal, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export const ContactModal = ({ visible, onClose }) => {
    const handleContact = (type) => {
        switch(type) {
            case 'email':
                Linking.openURL('mailto:convenios@nosplanet.pe');
                break;
            case 'phone':
                Linking.openURL('tel:+51999888777');
                break;
            case 'web':
                Linking.openURL('https://www.nosplanet.pe');
                break;
        }
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
                    {/* Header mejorado */}
                    <LinearGradient
                        colors={['#018f64', '#00C7A1', '#018f64']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.gradientHeader}
                    >
                        {/* Elementos decorativos */}
                        <View style={styles.decorCircle1} />
                        <View style={styles.decorCircle2} />

                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Icon name="close" size={24} color="#FFF" />
                        </TouchableOpacity>

                        <View style={styles.headerContent}>
                            <View style={styles.mainIconContainer}>
                                <View style={styles.iconGlow}>
                                    <Icon name="handshake" size={64} color="#FFF" />
                                </View>
                            </View>
                            <Text style={styles.title}>¿Quieres ser Partner?</Text>
                            <Text style={styles.subtitle}>Únete a la revolución del reciclaje</Text>
                        </View>
                    </LinearGradient>

                    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                        {/* Sobre Nos Planét */}
                        <View style={styles.aboutSection}>
                            <View style={styles.aboutHeader}>
                                <LinearGradient
                                    colors={['#018f64', '#00C7A1']}
                                    style={styles.aboutIconBg}
                                >
                                    <Icon name="leaf" size={32} color="#FFF" />
                                </LinearGradient>
                                <View style={styles.aboutTitleContainer}>
                                    <Text style={styles.aboutTitle}>Sobre Nos Planét</Text>
                                    <Text style={styles.aboutSubtitle}>Nuestra misión</Text>
                                </View>
                            </View>
                            <View style={styles.missionCard}>
                                <Icon name="format-quote-open" size={20} color="#018f64" style={styles.quoteIcon} />
                                <Text style={styles.missionText}>
                                    Democratizar el reciclaje y crear un impacto ambiental positivo a través de la tecnología, 
                                    conectando a ciudadanos comprometidos con el cuidado del planeta.
                                </Text>
                                <Icon name="format-quote-close" size={20} color="#018f64" style={styles.quoteIconEnd} />
                            </View>
                        </View>

                        {/* Por qué apoyar */}
                        <View style={styles.whySection}>
                            <View style={styles.whySectionHeader}>
                                <Icon name="heart-circle" size={28} color="#018f64" />
                                <Text style={styles.whyTitle}>¿Por qué apoyar esta iniciativa?</Text>
                            </View>
                            
                            <View style={styles.reasonCard}>
                                <View style={styles.reasonNumber}>
                                    <Text style={styles.reasonNumberText}>1</Text>
                                </View>
                                <View style={styles.reasonContent}>
                                    <Text style={styles.reasonTitle}>Impacto Real</Text>
                                    <Text style={styles.reasonText}>
                                        Cada tonelada reciclada reduce emisiones de CO₂ y protege nuestros ecosistemas
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.reasonCard}>
                                <View style={styles.reasonNumber}>
                                    <Text style={styles.reasonNumberText}>2</Text>
                                </View>
                                <View style={styles.reasonContent}>
                                    <Text style={styles.reasonTitle}>Comunidad Activa</Text>
                                    <Text style={styles.reasonText}>
                                        Miles de usuarios comprometidos con el reciclaje y el cuidado del medio ambiente
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.reasonCard}>
                                <View style={styles.reasonNumber}>
                                    <Text style={styles.reasonNumberText}>3</Text>
                                </View>
                                <View style={styles.reasonContent}>
                                    <Text style={styles.reasonTitle}>Responsabilidad Social</Text>
                                    <Text style={styles.reasonText}>
                                        Demuestra el compromiso de tu organización con la sostenibilidad ambiental
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.reasonCard}>
                                <View style={styles.reasonNumber}>
                                    <Text style={styles.reasonNumberText}>4</Text>
                                </View>
                                <View style={styles.reasonContent}>
                                    <Text style={styles.reasonTitle}>Visibilidad Positiva</Text>
                                    <Text style={styles.reasonText}>
                                        Tu marca asociada a valores ambientales y sociales importantes
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Beneficios de ser Partner */}
                        <View style={styles.benefitsSection}>
                            <Text style={styles.benefitsSectionTitle}>Beneficios de ser Partner</Text>
                            
                            <View style={styles.benefitsList}>
                                <View style={styles.benefitRow}>
                                    <View style={styles.benefitIconContainer}>
                                        <Icon name="eye" size={20} color="#018f64" />
                                    </View>
                                    <Text style={styles.benefitText}>Visibilidad en plataforma con +10K usuarios</Text>
                                </View>

                                <View style={styles.benefitRow}>
                                    <View style={styles.benefitIconContainer}>
                                        <Icon name="chart-line" size={20} color="#018f64" />
                                    </View>
                                    <Text style={styles.benefitText}>Reportes de impacto ambiental generado</Text>
                                </View>

                                <View style={styles.benefitRow}>
                                    <View style={styles.benefitIconContainer}>
                                        <Icon name="medal" size={20} color="#018f64" />
                                    </View>
                                    <Text style={styles.benefitText}>Reconocimiento como marca eco-friendly</Text>
                                </View>

                                <View style={styles.benefitRow}>
                                    <View style={styles.benefitIconContainer}>
                                        <Icon name="account-group" size={20} color="#018f64" />
                                    </View>
                                    <Text style={styles.benefitText}>Conexión con comunidad ambiental activa</Text>
                                </View>

                                <View style={styles.benefitRow}>
                                    <View style={styles.benefitIconContainer}>
                                        <Icon name="file-document" size={20} color="#018f64" />
                                    </View>
                                    <Text style={styles.benefitText}>Certificaciones y métricas detalladas</Text>
                                </View>
                            </View>
                        </View>

                        {/* Contacto */}
                        <View style={styles.contactSection}>
                            <View style={styles.contactHeader}>
                                <Icon name="phone-in-talk" size={24} color="#018f64" />
                                <Text style={styles.contactTitle}>Contáctanos</Text>
                            </View>
                            <Text style={styles.contactDescription}>
                                Estamos listos para escuchar tu propuesta y crear juntos un impacto positivo
                            </Text>
                            
                            <TouchableOpacity 
                                style={styles.contactCard}
                                onPress={() => handleContact('email')}
                            >
                                <View style={styles.contactIconBg}>
                                    <Icon name="email" size={24} color="#018f64" />
                                </View>
                                <View style={styles.contactInfo}>
                                    <Text style={styles.contactLabel}>Email</Text>
                                    <Text style={styles.contactValue}>convenios@nosplanet.pe</Text>
                                </View>
                                <Icon name="chevron-right" size={24} color="#CCC" />
                            </TouchableOpacity>

                            <TouchableOpacity 
                                style={styles.contactCard}
                                onPress={() => handleContact('phone')}
                            >
                                <View style={styles.contactIconBg}>
                                    <Icon name="phone" size={24} color="#018f64" />
                                </View>
                                <View style={styles.contactInfo}>
                                    <Text style={styles.contactLabel}>Teléfono</Text>
                                    <Text style={styles.contactValue}>+51 999 888 777</Text>
                                </View>
                                <Icon name="chevron-right" size={24} color="#CCC" />
                            </TouchableOpacity>

                            <TouchableOpacity 
                                style={styles.contactCard}
                                onPress={() => handleContact('web')}
                            >
                                <View style={styles.contactIconBg}>
                                    <Icon name="web" size={24} color="#018f64" />
                                </View>
                                <View style={styles.contactInfo}>
                                    <Text style={styles.contactLabel}>Sitio Web</Text>
                                    <Text style={styles.contactValue}>www.nosplanet.pe</Text>
                                </View>
                                <Icon name="chevron-right" size={24} color="#CCC" />
                            </TouchableOpacity>
                        </View>

                        {/* Footer message */}
                        <View style={styles.footerMessage}>
                            <Icon name="earth" size={32} color="#018f64" />
                            <Text style={styles.footerMessageText}>
                                Juntos podemos crear un futuro más sostenible para nuestro planeta
                            </Text>
                        </View>

                        <View style={styles.bottomSpacing} />
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        maxHeight: '92%',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 10,
    },
    gradientHeader: {
        padding: 32,
        paddingTop: 48,
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        position: 'relative',
        overflow: 'hidden',
    },
    decorCircle1: {
        position: 'absolute',
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        top: -30,
        right: -20,
    },
    decorCircle2: {
        position: 'absolute',
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        bottom: -20,
        left: 30,
    },
    closeButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        zIndex: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
        borderRadius: 22,
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerContent: {
        alignItems: 'center',
        zIndex: 1,
    },
    mainIconContainer: {
        marginBottom: 16,
    },
    iconGlow: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#FFF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 12,
        elevation: 8,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 8,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    subtitle: {
        fontSize: 15,
        color: 'rgba(255, 255, 255, 0.95)',
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 20,
    },
    aboutSection: {
        marginTop: 24,
    },
    aboutHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    aboutIconBg: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    aboutTitleContainer: {
        flex: 1,
    },
    aboutTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#32243B',
    },
    aboutSubtitle: {
        fontSize: 13,
        color: '#888',
        marginTop: 2,
    },
    missionCard: {
        backgroundColor: '#F0F9F6',
        borderRadius: 16,
        padding: 24,
        borderLeftWidth: 4,
        borderLeftColor: '#018f64',
        position: 'relative',
    },
    quoteIcon: {
        position: 'absolute',
        top: 12,
        left: 16,
        opacity: 0.3,
    },
    quoteIconEnd: {
        position: 'absolute',
        bottom: 12,
        right: 16,
        opacity: 0.3,
    },
    missionText: {
        fontSize: 15,
        color: '#444',
        lineHeight: 24,
        textAlign: 'center',
        paddingHorizontal: 16,
    },
    whySection: {
        marginTop: 28,
    },
    whySectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    whyTitle: {
        fontSize: 19,
        fontWeight: 'bold',
        color: '#32243B',
        marginLeft: 8,
    },
    reasonCard: {
        flexDirection: 'row',
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderLeftWidth: 3,
        borderLeftColor: '#018f64',
    },
    reasonNumber: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#018f64',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    reasonNumberText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFF',
    },
    reasonContent: {
        flex: 1,
    },
    reasonTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#32243B',
        marginBottom: 4,
    },
    reasonText: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    benefitsSection: {
        marginTop: 28,
        backgroundColor: '#F0F9F6',
        borderRadius: 16,
        padding: 20,
    },
    benefitsSectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#018f64',
        marginBottom: 16,
        textAlign: 'center',
    },
    benefitsList: {
        gap: 12,
    },
    benefitRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    benefitIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    benefitText: {
        fontSize: 14,
        color: '#444',
        flex: 1,
    },
    contactSection: {
        marginTop: 28,
        marginBottom: 20,
    },
    contactHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    contactTitle: {
        fontSize: 19,
        fontWeight: 'bold',
        color: '#32243B',
        marginLeft: 8,
    },
    contactDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 16,
        lineHeight: 20,
    },
    contactCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    contactIconBg: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    contactInfo: {
        flex: 1,
    },
    contactLabel: {
        fontSize: 12,
        color: '#888',
        marginBottom: 2,
    },
    contactValue: {
        fontSize: 15,
        fontWeight: '600',
        color: '#32243B',
    },
    footerMessage: {
        alignItems: 'center',
        paddingVertical: 24,
        paddingHorizontal: 30,
    },
    footerMessageText: {
        fontSize: 15,
        color: '#666',
        textAlign: 'center',
        marginTop: 12,
        lineHeight: 22,
        fontStyle: 'italic',
    },
    bottomSpacing: {
        height: 20,
    },
});
