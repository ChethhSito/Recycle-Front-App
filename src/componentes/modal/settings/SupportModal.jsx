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
import { useTranslation } from '../../../hooks/use-translation';

export const SupportModal = ({ visible, onClose, theme }) => {
    const t = useTranslation();
    const navigation = useNavigation();
    const { colors, dark } = theme;

    const [expandedFAQ, setExpandedFAQ] = useState(null);
    const [showInfoModal, setShowInfoModal] = useState(null);

    // Definición dinámica de tópicos usando la traducción
    const helpTopics = [
        {
            icon: 'recycle',
            title: t.support.topics.recycle.title,
            description: t.support.topics.recycle.desc,
            action: () => setShowInfoModal('recycle')
        },
        {
            icon: 'star',
            title: t.support.topics.points.title,
            description: t.support.topics.points.desc,
            action: () => setShowInfoModal('points')
        },
        {
            icon: 'gift',
            title: t.support.topics.rewards.title,
            description: t.support.topics.rewards.desc,
            action: () => setShowInfoModal('rewards')
        },
        {
            icon: 'email',
            title: t.support.topics.contact.title,
            description: t.support.topics.contact.desc,
            action: () => {
                Linking.openURL(`mailto:soporte@nosplanet.pe?subject=${t.support.topics.contact.subject}`);
            }
        },
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
                    <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
                        {/* Header */}
                        <View style={[styles.header, { borderBottomColor: colors.outlineVariant }]}>
                            <Text style={[styles.title, { color: colors.onSurface }]}>{t.support.title}</Text>
                            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                <Icon name="close" size={28} color={colors.onSurface} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            {/* Temas de Ayuda */}
                            <View style={styles.section}>
                                <Text style={[styles.sectionTitle, { color: colors.primary }]}>{t.support.sections.topics}</Text>
                                {helpTopics.map((topic, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={[styles.topicCard, { backgroundColor: colors.surfaceVariant }]}
                                        onPress={topic.action}
                                    >
                                        <View style={[styles.topicIconContainer, { backgroundColor: colors.primaryContainer }]}>
                                            <Icon name={topic.icon} size={24} color={colors.primary} />
                                        </View>
                                        <View style={styles.topicContent}>
                                            <Text style={[styles.topicTitle, { color: colors.onSurfaceVariant }]}>{topic.title}</Text>
                                            <Text style={[styles.topicDescription, { color: colors.onSurfaceVariant, opacity: 0.7 }]}>{topic.description}</Text>
                                        </View>
                                        <Icon name="chevron-right" size={20} color={colors.outline} />
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {/* FAQs */}
                            <View style={styles.section}>
                                <Text style={[styles.sectionTitle, { color: colors.primary }]}>{t.support.sections.faqs}</Text>
                                {t.support.faqs.map((faq, index) => (
                                    <View key={index} style={[styles.faqItem, { backgroundColor: colors.surfaceVariant }]}>
                                        <TouchableOpacity
                                            style={styles.faqQuestion}
                                            onPress={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                                        >
                                            <Text style={[styles.faqQuestionText, { color: colors.onSurfaceVariant }]}>{faq.q}</Text>
                                            <Icon
                                                name={expandedFAQ === index ? 'chevron-up' : 'chevron-down'}
                                                size={20}
                                                color={colors.outline}
                                            />
                                        </TouchableOpacity>
                                        {expandedFAQ === index && (
                                            <Text style={[styles.faqAnswer, { color: colors.onSurfaceVariant, opacity: 0.8 }]}>{faq.a}</Text>
                                        )}
                                    </View>
                                ))}
                            </View>

                            {/* Contact Section */}
                            <View style={styles.section}>
                                <Text style={[styles.sectionTitle, { color: colors.primary }]}>{t.support.sections.moreHelp}</Text>
                                <TouchableOpacity
                                    style={[styles.contactCard, { backgroundColor: colors.surfaceVariant }]}
                                    onPress={() => Linking.openURL('mailto:soporte@nosplanet.pe')}
                                >
                                    <Icon name="email" size={24} color={colors.primary} />
                                    <Text style={[styles.contactText, { color: colors.onSurfaceVariant }]}>soporte@nosplanet.pe</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.contactCard, { backgroundColor: colors.surfaceVariant }]}
                                    onPress={() => Linking.openURL('https://wa.me/51999888777')}
                                >
                                    <Icon name="whatsapp" size={24} color="#25D366" />
                                    <Text style={[styles.contactText, { color: colors.onSurfaceVariant }]}>{t.support.contact.whatsapp}: +51 999 888 777</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
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
