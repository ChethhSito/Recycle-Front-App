import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    ScrollView,
    Linking,
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export const SupportModal = ({ visible, onClose }) => {
    const navigation = useNavigation();
    const [expandedFAQ, setExpandedFAQ] = useState(null);
    const [showInfoModal, setShowInfoModal] = useState(null); // 'recycle', 'points', 'rewards'

    const helpTopics = [
        {
            icon: 'recycle',
            title: '¿Cómo reciclar?',
            description: 'Aprende los pasos para reciclar correctamente',
            action: () => setShowInfoModal('recycle')
        },
        {
            icon: 'star',
            title: '¿Cómo ganar puntos?',
            description: 'Descubre todas las formas de acumular EcoPuntos',
            action: () => setShowInfoModal('points')
        },
        {
            icon: 'gift',
            title: 'Canjear premios',
            description: 'Guía para canjear tus puntos por recompensas',
            action: () => setShowInfoModal('rewards')
        },
        {
            icon: 'email',
            title: 'Contactar soporte',
            description: 'Envíanos un mensaje directamente',
            action: () => {
                Linking.openURL('mailto:soporte@nosplanet.pe?subject=Solicitud de Ayuda');
            }
        },
    ];

    const faqs = [
        {
            question: '¿Cómo verifico mi cuenta?',
            answer: 'Para verificar tu cuenta, ve a Configuración > Perfil y sigue los pasos de verificación. Necesitarás proporcionar un documento de identidad válido.'
        },
        {
            question: '¿Cuánto tiempo tardan en aparecer mis puntos?',
            answer: 'Los puntos aparecen inmediatamente después de registrar tu actividad de reciclaje. Si no ves tus puntos después de 24 horas, contáctanos.'
        },
        {
            question: '¿Puedo transferir mis puntos a otro usuario?',
            answer: 'No, los EcoPuntos son personales y no transferibles. Esto ayuda a mantener la integridad del programa.'
        },
        {
            question: '¿Los premios tienen fecha de vencimiento?',
            answer: 'Sí, algunos premios tienen fecha de vencimiento. Revisa los términos de cada premio antes de canjearlo.'
        }
    ];

    return (
        <>
            {/* Modal Principal */}
            <Modal
                visible={visible && !showInfoModal}
                animationType="slide"
                transparent={true}
                onRequestClose={onClose}
            >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Centro de Ayuda</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Icon name="close" size={28} color="#32243B" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        {/* Help Topics */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Temas de Ayuda</Text>
                            {helpTopics.map((topic, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.topicCard}
                                    onPress={topic.action}
                                >
                                    <View style={styles.topicIconContainer}>
                                        <Icon name={topic.icon} size={24} color="#018f64" />
                                    </View>
                                    <View style={styles.topicContent}>
                                        <Text style={styles.topicTitle}>{topic.title}</Text>
                                        <Text style={styles.topicDescription}>{topic.description}</Text>
                                    </View>
                                    <Icon name="chevron-right" size={20} color="#9CA3AF" />
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* FAQs */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Preguntas Frecuentes</Text>
                            {faqs.map((faq, index) => (
                                <View key={index} style={styles.faqItem}>
                                    <TouchableOpacity
                                        style={styles.faqQuestion}
                                        onPress={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                                    >
                                        <Text style={styles.faqQuestionText}>{faq.question}</Text>
                                        <Icon 
                                            name={expandedFAQ === index ? 'chevron-up' : 'chevron-down'} 
                                            size={20} 
                                            color="#6B7280" 
                                        />
                                    </TouchableOpacity>
                                    {expandedFAQ === index && (
                                        <Text style={styles.faqAnswer}>{faq.answer}</Text>
                                    )}
                                </View>
                            ))}
                        </View>

                        {/* Contact Section */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>¿Necesitas más ayuda?</Text>
                            <TouchableOpacity
                                style={styles.contactCard}
                                onPress={() => Linking.openURL('mailto:soporte@nosplanet.pe')}
                            >
                                <Icon name="email" size={24} color="#018f64" />
                                <Text style={styles.contactText}>soporte@nosplanet.pe</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.contactCard}
                                onPress={() => Linking.openURL('https://wa.me/51999888777')}
                            >
                                <Icon name="whatsapp" size={24} color="#25D366" />
                                <Text style={styles.contactText}>WhatsApp: +51 999 888 777</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>

        {/* Mini Modal: ¿Cómo reciclar? */}
        <Modal
            visible={showInfoModal === 'recycle'}
            animationType="fade"
            transparent={true}
            onRequestClose={() => setShowInfoModal(null)}
        >
            <View style={styles.infoModalOverlay}>
                <View style={styles.infoModalContent}>
                    <View style={styles.infoIconContainer}>
                        <Icon name="recycle" size={60} color="#018f64" />
                    </View>

                    <Text style={styles.infoTitle}>¿Cómo Reciclar?</Text>

                    <ScrollView style={styles.infoScrollContent} showsVerticalScrollIndicator={false}>
                        <View style={styles.stepContainer}>
                            <View style={styles.stepNumber}>
                                <Text style={styles.stepNumberText}>1</Text>
                            </View>
                            <View style={styles.stepContent}>
                                <Text style={styles.stepTitle}>Separa tus residuos</Text>
                                <Text style={styles.stepDescription}>
                                    Clasifica los materiales reciclables: papel, cartón, plástico, vidrio y metal
                                </Text>
                            </View>
                        </View>

                        <View style={styles.stepContainer}>
                            <View style={styles.stepNumber}>
                                <Text style={styles.stepNumberText}>2</Text>
                            </View>
                            <View style={styles.stepContent}>
                                <Text style={styles.stepTitle}>Limpia los materiales</Text>
                                <Text style={styles.stepDescription}>
                                    Asegúrate de que los envases estén limpios y secos antes de reciclarlos
                                </Text>
                            </View>
                        </View>

                        <View style={styles.stepContainer}>
                            <View style={styles.stepNumber}>
                                <Text style={styles.stepNumberText}>3</Text>
                            </View>
                            <View style={styles.stepContent}>
                                <Text style={styles.stepTitle}>Solicita recolección</Text>
                                <Text style={styles.stepDescription}>
                                    Usa la app para solicitar que recojan tus materiales reciclables
                                </Text>
                            </View>
                        </View>

                        <View style={styles.stepContainer}>
                            <View style={styles.stepNumber}>
                                <Text style={styles.stepNumberText}>4</Text>
                            </View>
                            <View style={styles.stepContent}>
                                <Text style={styles.stepTitle}>Gana EcoPuntos</Text>
                                <Text style={styles.stepDescription}>
                                    Por cada kilo reciclado acumulas puntos que puedes canjear
                                </Text>
                            </View>
                        </View>
                    </ScrollView>

                    <TouchableOpacity
                        style={styles.infoCloseButton}
                        onPress={() => setShowInfoModal(null)}
                    >
                        <Text style={styles.infoCloseButtonText}>Entendido</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>

        {/* Mini Modal: ¿Cómo ganar puntos? */}
        <Modal
            visible={showInfoModal === 'points'}
            animationType="fade"
            transparent={true}
            onRequestClose={() => setShowInfoModal(null)}
        >
            <View style={styles.infoModalOverlay}>
                <View style={styles.infoModalContent}>
                    <View style={styles.infoIconContainer}>
                        <Icon name="star" size={60} color="#FAC96E" />
                    </View>

                    <Text style={styles.infoTitle}>¿Cómo Ganar Puntos?</Text>

                    <ScrollView style={styles.infoScrollContent} showsVerticalScrollIndicator={false}>
                        <View style={styles.pointCard}>
                            <Icon name="recycle-variant" size={32} color="#018f64" />
                            <View style={styles.pointCardContent}>
                                <Text style={styles.pointCardTitle}>Reciclando materiales</Text>
                                <Text style={styles.pointCardPoints}>50-200 puntos por kg</Text>
                                <Text style={styles.pointCardDescription}>
                                    Acumula puntos por cada kilogramo de material reciclado
                                </Text>
                            </View>
                        </View>

                        <View style={styles.pointCard}>
                            <Icon name="account-group" size={32} color="#018f64" />
                            <View style={styles.pointCardContent}>
                                <Text style={styles.pointCardTitle}>Invita amigos</Text>
                                <Text style={styles.pointCardPoints}>100 puntos por invitado</Text>
                                <Text style={styles.pointCardDescription}>
                                    Gana puntos cuando tus amigos se registren y realicen su primer reciclaje
                                </Text>
                            </View>
                        </View>

                        <View style={styles.pointCard}>
                            <Icon name="calendar-check" size={32} color="#018f64" />
                            <View style={styles.pointCardContent}>
                                <Text style={styles.pointCardTitle}>Logros semanales</Text>
                                <Text style={styles.pointCardPoints}>50-500 puntos</Text>
                                <Text style={styles.pointCardDescription}>
                                    Completa retos semanales y gana puntos extra
                                </Text>
                            </View>
                        </View>

                        <View style={styles.pointCard}>
                            <Icon name="leaf" size={32} color="#018f64" />
                            <View style={styles.pointCardContent}>
                                <Text style={styles.pointCardTitle}>Programas ambientales</Text>
                                <Text style={styles.pointCardPoints}>200-1000 puntos</Text>
                                <Text style={styles.pointCardDescription}>
                                    Participa en programas y eventos especiales
                                </Text>
                            </View>
                        </View>
                    </ScrollView>

                    <TouchableOpacity
                        style={styles.infoCloseButton}
                        onPress={() => setShowInfoModal(null)}
                    >
                        <Text style={styles.infoCloseButtonText}>Entendido</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>

        {/* Mini Modal: Canjear premios */}
        <Modal
            visible={showInfoModal === 'rewards'}
            animationType="fade"
            transparent={true}
            onRequestClose={() => setShowInfoModal(null)}
        >
            <View style={styles.infoModalOverlay}>
                <View style={styles.infoModalContent}>
                    <View style={styles.infoIconContainer}>
                        <Icon name="gift" size={60} color="#EF4444" />
                    </View>

                    <Text style={styles.infoTitle}>Canjear Premios</Text>

                    <ScrollView style={styles.infoScrollContent} showsVerticalScrollIndicator={false}>
                        <Text style={styles.infoDescription}>
                            Sigue estos pasos para canjear tus EcoPuntos por increíbles recompensas:
                        </Text>

                        <View style={styles.stepContainer}>
                            <View style={styles.stepNumber}>
                                <Text style={styles.stepNumberText}>1</Text>
                            </View>
                            <View style={styles.stepContent}>
                                <Text style={styles.stepTitle}>Ve a la sección Recompensas</Text>
                                <Text style={styles.stepDescription}>
                                    Explora el catálogo de premios disponibles
                                </Text>
                            </View>
                        </View>

                        <View style={styles.stepContainer}>
                            <View style={styles.stepNumber}>
                                <Text style={styles.stepNumberText}>2</Text>
                            </View>
                            <View style={styles.stepContent}>
                                <Text style={styles.stepTitle}>Elige tu premio</Text>
                                <Text style={styles.stepDescription}>
                                    Revisa los detalles y puntos necesarios
                                </Text>
                            </View>
                        </View>

                        <View style={styles.stepContainer}>
                            <View style={styles.stepNumber}>
                                <Text style={styles.stepNumberText}>3</Text>
                            </View>
                            <View style={styles.stepContent}>
                                <Text style={styles.stepTitle}>Confirma el canje</Text>
                                <Text style={styles.stepDescription}>
                                    Los puntos se descontarán de tu cuenta
                                </Text>
                            </View>
                        </View>

                        <View style={styles.stepContainer}>
                            <View style={styles.stepNumber}>
                                <Text style={styles.stepNumberText}>4</Text>
                            </View>
                            <View style={styles.stepContent}>
                                <Text style={styles.stepTitle}>Recibe tu premio</Text>
                                <Text style={styles.stepDescription}>
                                    Te contactaremos para coordinar la entrega o código
                                </Text>
                            </View>
                        </View>

                        <View style={styles.infoTipCard}>
                            <Icon name="information" size={24} color="#3B82F6" />
                            <Text style={styles.infoTipText}>
                                Verifica los términos de cada premio antes de canjearlo
                            </Text>
                        </View>
                    </ScrollView>

                    {/* Botón llamativo para ir a Inducción */}
                    <TouchableOpacity
                        style={styles.inductionButton}
                        onPress={() => {
                            setShowInfoModal(null);
                            onClose();
                            navigation.navigate('Induction');
                        }}
                    >
                        <Icon name="school" size={24} color="#FFF" />
                        <View style={styles.inductionButtonContent}>
                            <Text style={styles.inductionButtonTitle}>¿Quieres saber más?</Text>
                            <Text style={styles.inductionButtonSubtitle}>Completa la Inducción Interactiva</Text>
                        </View>
                        <Icon name="arrow-right" size={24} color="#FFF" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.infoCloseButton}
                        onPress={() => setShowInfoModal(null)}
                    >
                        <Text style={styles.infoCloseButtonText}>Cerrar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '90%',
        paddingBottom: 30,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    closeButton: {
        padding: 4,
    },
    section: {
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 12,
    },
    topicCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        padding: 16,
        borderRadius: 12,
        marginBottom: 10,
    },
    topicIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#E0F5EF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    topicContent: {
        flex: 1,
    },
    topicTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 4,
    },
    topicDescription: {
        fontSize: 13,
        color: '#6B7280',
    },
    faqItem: {
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        marginBottom: 10,
        overflow: 'hidden',
    },
    faqQuestion: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    faqQuestionText: {
        fontSize: 15,
        fontWeight: '500',
        color: '#1F2937',
        flex: 1,
        marginRight: 10,
    },
    faqAnswer: {
        fontSize: 14,
        color: '#6B7280',
        paddingHorizontal: 16,
        paddingBottom: 16,
        lineHeight: 20,
    },
    contactCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        padding: 16,
        borderRadius: 12,
        marginBottom: 10,
    },
    contactText: {
        fontSize: 15,
        color: '#1F2937',
        marginLeft: 12,
    },
    
    // Estilos para Mini Modales Informativos
    infoModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    infoModalContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 24,
        width: '100%',
        maxWidth: 400,
        maxHeight: '85%',
    },
    infoIconContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    infoTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1F2937',
        textAlign: 'center',
        marginBottom: 16,
    },
    infoScrollContent: {
        maxHeight: 400,
    },
    infoDescription: {
        fontSize: 15,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 22,
    },
    stepContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    stepNumber: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#018f64',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    stepNumberText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFF',
    },
    stepContent: {
        flex: 1,
    },
    stepTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 4,
    },
    stepDescription: {
        fontSize: 14,
        color: '#6B7280',
        lineHeight: 20,
    },
    pointCard: {
        flexDirection: 'row',
        backgroundColor: '#F0FDF4',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#018f64',
    },
    pointCardContent: {
        flex: 1,
        marginLeft: 12,
    },
    pointCardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 4,
    },
    pointCardPoints: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#018f64',
        marginBottom: 4,
    },
    pointCardDescription: {
        fontSize: 13,
        color: '#6B7280',
        lineHeight: 18,
    },
    infoTipCard: {
        flexDirection: 'row',
        backgroundColor: '#EFF6FF',
        padding: 12,
        borderRadius: 12,
        marginTop: 16,
        marginBottom: 20,
        alignItems: 'center',
    },
    infoTipText: {
        flex: 1,
        fontSize: 13,
        color: '#1E40AF',
        marginLeft: 12,
        lineHeight: 18,
    },
    inductionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#018f64',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        elevation: 3,
        shadowColor: '#018f64',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    inductionButtonContent: {
        flex: 1,
        marginHorizontal: 12,
    },
    inductionButtonTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 2,
    },
    inductionButtonSubtitle: {
        fontSize: 13,
        color: '#B7ECDC',
    },
    infoCloseButton: {
        backgroundColor: '#F3F4F6',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    infoCloseButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#6B7280',
    },
});
