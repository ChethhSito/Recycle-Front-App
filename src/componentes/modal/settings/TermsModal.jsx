import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    Modal,
    TouchableOpacity,
    ScrollView,
    Linking,
} from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useTranslation } from '../../../hooks/use-translation';

export const TermsModal = ({ visible, onClose, theme }) => {
    const t = useTranslation();
    const { colors } = theme;
    const [activeTab, setActiveTab] = useState('terms');

    // Seleccionar qué secciones mostrar según el Tab activo
    const sections = activeTab === 'terms' ? t.terms.useSections : t.terms.privacySections;

    const handleEmailPress = () => {
        Linking.openURL(`mailto:soporte@nosplanet.pe?subject=${t.terms.contactSubject}`);
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
                    {/* Header */}
                    <View style={[styles.header, { borderBottomColor: colors.outlineVariant }]}>
                        <Text style={[styles.title, { color: colors.onSurface }]}>{t.terms.title}</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Icon name="close" size={28} color={colors.onSurface} />
                        </TouchableOpacity>
                    </View>

                    {/* Tabs */}
                    <View style={[styles.tabsContainer, { borderBottomColor: colors.outlineVariant }]}>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'terms' && { borderBottomColor: colors.primary }]}
                            onPress={() => setActiveTab('terms')}
                        >
                            <Text style={[styles.tabText, activeTab === 'terms' ? { color: colors.primary, fontWeight: '700' } : { color: colors.outline }]}>
                                {t.terms.tabs.use}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'privacy' && { borderBottomColor: colors.primary }]}
                            onPress={() => setActiveTab('privacy')}
                        >
                            <Text style={[styles.tabText, activeTab === 'privacy' ? { color: colors.primary, fontWeight: '700' } : { color: colors.outline }]}>
                                {t.terms.tabs.privacy}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Content */}
                    <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
                        <View style={styles.legalContent}>
                            <Text style={[styles.legalMainTitle, { color: colors.onSurface }]}>
                                {activeTab === 'terms' ? t.terms.tabs.use : t.terms.tabs.privacy}
                            </Text>
                            <Text style={[styles.legalDate, { color: colors.onSurfaceVariant }]}>
                                {t.terms.lastUpdate}
                            </Text>

                            {/* Mapeo dinámico de secciones */}
                            {sections.map((section, index) => (
                                <View key={index} style={styles.sectionWrapper}>
                                    <Text style={[styles.legalSectionTitle, { color: colors.primary }]}>
                                        {section.title}
                                    </Text>
                                    <Text style={[styles.legalText, { color: colors.onSurfaceVariant }]}>
                                        {section.text}
                                    </Text>
                                </View>
                            ))}

                            {/* Contacto al final */}
                            <TouchableOpacity
                                style={[styles.contactCard, { backgroundColor: colors.surfaceVariant }]}
                                onPress={handleEmailPress}
                            >
                                <Icon name="email" size={24} color={colors.primary} />
                                <Text style={[styles.contactText, { color: colors.onSurfaceVariant }]}>
                                    soporte@nosplanet.pe
                                </Text>
                                <Icon name="chevron-right" size={20} color={colors.outline} />
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' },
    modalContent: { borderTopLeftRadius: 28, borderTopRightRadius: 28, maxHeight: '88%', paddingBottom: 20 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 20, borderBottomWidth: 1 },
    title: { fontSize: 20, fontWeight: 'bold' },
    tabsContainer: { flexDirection: 'row', paddingHorizontal: 20, borderBottomWidth: 1 },
    tab: { flex: 1, paddingVertical: 15, alignItems: 'center', borderBottomWidth: 3, borderBottomColor: 'transparent' },
    tabText: { fontSize: 14 },
    scrollContent: { paddingHorizontal: 24 },
    legalContent: { paddingVertical: 20 },
    legalMainTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
    legalDate: { fontSize: 13, marginBottom: 20 },
    sectionWrapper: { marginBottom: 20 },
    legalSectionTitle: { fontSize: 15, fontWeight: '700', marginBottom: 8 },
    legalText: { fontSize: 14, lineHeight: 22 },
    contactCard: { flexDirection: 'row', alignItems: 'center', padding: 18, borderRadius: 16, marginTop: 10, marginBottom: 40 },
    contactText: { fontSize: 15, marginLeft: 12, flex: 1, fontWeight: '600' },
});