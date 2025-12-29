import React from 'react';
import { View, Text, StyleSheet, Modal, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export const PartnerDetailModal = ({ visible, partner, onClose, onViewRewards }) => {
    if (!partner) return null;

    const partnerThemes = {
        yape: { colors: ['#6C3FB5', '#8B5FD8'], textColor: '#6C3FB5', lightBg: '#F3E5F5' },
        bcp: { colors: ['#002C77', '#004BA8'], textColor: '#002C77', lightBg: '#E3F2FD' },
        government: { colors: ['#D32F2F', '#F44336'], textColor: '#D32F2F', lightBg: '#FFEBEE' },
        ong: { colors: ['#0288D1', '#4FC3F7'], textColor: '#0288D1', lightBg: '#E1F5FE' },
        corporate: { colors: ['#00796B', '#00897B'], textColor: '#00796B', lightBg: '#E0F2F1' },
    };

    const theme = partnerThemes[partner.type] || partnerThemes.corporate;

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    {/* Header con gradiente mejorado */}
                    <LinearGradient
                        colors={theme.colors}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.gradientHeader}
                    >
                        {/* Elementos decorativos en el header */}
                        <View style={styles.decorCircle1} />
                        <View style={styles.decorCircle2} />
                        <View style={styles.decorCircle3} />

                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Icon name="close" size={24} color="#FFF" />
                        </TouchableOpacity>

                        <View style={styles.headerContent}>
                            {/* Icono principal mejorado */}
                            <View style={styles.mainIconContainer}>
                                <View style={styles.iconGlow}>
                                    <Icon name={partner.icon} size={72} color="#FFF" />
                                </View>
                            </View>
                            
                            {/* Nombre y tipo */}
                            <Text style={styles.partnerName}>{partner.name}</Text>
                            <View style={styles.typeBadgeContainer}>
                                <View style={styles.typeBadge}>
                                    <Icon name="medal" size={16} color="#FFD700" />
                                    <Text style={styles.typeText}>{partner.typeLabel}</Text>
                                </View>
                            </View>

                            {/* Stats rápidas en el header */}
                            <View style={styles.quickStats}>
                                <View style={styles.quickStatItem}>
                                    <Icon name="gift" size={20} color="#FFF" />
                                    <Text style={styles.quickStatValue}>{partner.rewardsCount}</Text>
                                    <Text style={styles.quickStatLabel}>Premios</Text>
                                </View>
                                <View style={styles.statDivider} />
                                <View style={styles.quickStatItem}>
                                    <Icon name="account-group" size={20} color="#FFF" />
                                    <Text style={styles.quickStatValue}>{partner.usersCount}</Text>
                                    <Text style={styles.quickStatLabel}>Canjes</Text>
                                </View>
                            </View>
                        </View>
                    </LinearGradient>

                    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                        {/* Descripción con diseño mejorado */}
                        <View style={[styles.descriptionCard, { backgroundColor: theme.lightBg }]}>
                            <View style={styles.cardIcon}>
                                <Icon name="information" size={28} color={theme.textColor} />
                            </View>
                            <Text style={styles.descriptionTitle}>Sobre {partner.name}</Text>
                            <Text style={styles.description}>{partner.fullDescription}</Text>
                        </View>

                        {/* Compromiso Ambiental con diseño destacado */}
                        <View style={styles.commitmentSection}>
                            <View style={styles.commitmentHeader}>
                                <LinearGradient
                                    colors={[theme.textColor, theme.colors[1]]}
                                    style={styles.commitmentIconBg}
                                >
                                    <Icon name="leaf" size={32} color="#FFF" />
                                </LinearGradient>
                                <View style={styles.commitmentTitleContainer}>
                                    <Text style={[styles.commitmentTitle, { color: theme.textColor }]}>
                                        Compromiso Ambiental
                                    </Text>
                                    <Text style={styles.commitmentSubtitle}>Su visión ecológica</Text>
                                </View>
                            </View>
                            <View style={styles.commitmentCard}>
                                <Icon name="format-quote-open" size={24} color={theme.textColor} style={styles.quoteIcon} />
                                <Text style={styles.commitment}>{partner.environmentalCommitment}</Text>
                                <Icon name="format-quote-close" size={24} color={theme.textColor} style={styles.quoteIconEnd} />
                            </View>
                        </View>

                        {/* Aportes con diseño de lista mejorado */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <View style={[styles.sectionIconContainer, { backgroundColor: theme.lightBg }]}>
                                    <Icon name="hand-heart" size={24} color={theme.textColor} />
                                </View>
                                <View>
                                    <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
                                        Su Aporte al Proyecto
                                    </Text>
                                    <Text style={styles.sectionSubtitle}>Contribuciones clave</Text>
                                </View>
                            </View>
                            
                            {partner.contributions.map((contribution, index) => (
                                <View key={index} style={[styles.contributionItem, { borderLeftColor: theme.textColor }]}>
                                    <View style={[styles.contributionNumber, { backgroundColor: theme.textColor }]}>
                                        <Text style={styles.contributionNumberText}>{index + 1}</Text>
                                    </View>
                                    <View style={styles.contributionContent}>
                                        <Icon name="check-circle" size={20} color={theme.textColor} />
                                        <Text style={styles.contributionText}>{contribution}</Text>
                                    </View>
                                </View>
                            ))}
                        </View>

                        {/* Impacto con cards mejoradas */}
                        <View style={styles.impactSection}>
                            <View style={styles.impactHeader}>
                                <Icon name="chart-line" size={28} color={theme.textColor} />
                                <Text style={[styles.impactTitle, { color: theme.textColor }]}>
                                    Impacto Generado
                                </Text>
                            </View>
                            <Text style={styles.impactSubtitle}>Resultados medibles de nuestra alianza</Text>
                            
                            <View style={styles.impactGrid}>
                                {partner.impact.map((item, index) => (
                                    <LinearGradient
                                        key={index}
                                        colors={[theme.lightBg, '#FFFFFF']}
                                        style={[styles.impactCard, { borderColor: theme.textColor }]}
                                    >
                                        <View style={[styles.impactIconContainer, { backgroundColor: theme.textColor }]}>
                                            <Icon name={item.icon} size={28} color="#FFF" />
                                        </View>
                                        <Text style={[styles.impactValue, { color: theme.textColor }]}>
                                            {item.value}
                                        </Text>
                                        <Text style={styles.impactLabel}>{item.label}</Text>
                                        <View style={[styles.impactBadge, { backgroundColor: theme.textColor }]}>
                                            <Icon name="trending-up" size={12} color="#FFF" />
                                        </View>
                                    </LinearGradient>
                                ))}
                            </View>
                        </View>

                        {/* Beneficios disponibles con llamado a la acción */}
                        <View style={[styles.rewardsSection, { backgroundColor: theme.lightBg }]}>
                            <View style={styles.rewardsHeader}>
                                <View style={[styles.rewardsIconBg, { backgroundColor: theme.textColor }]}>
                                    <Icon name="gift-open" size={32} color="#FFF" />
                                </View>
                                <View style={styles.rewardsTextContainer}>
                                    <Text style={[styles.rewardsTitle, { color: theme.textColor }]}>
                                        {partner.rewardsCount} Beneficios Disponibles
                                    </Text>
                                    <Text style={styles.rewardsDescription}>
                                        Canjea tus EcoPuntos por recompensas exclusivas
                                    </Text>
                                </View>
                            </View>
                            <TouchableOpacity
                                style={[styles.previewButton, { borderColor: theme.textColor }]}
                                onPress={() => {
                                    onClose();
                                    onViewRewards();
                                }}
                            >
                                <Text style={[styles.previewButtonText, { color: theme.textColor }]}>
                                    Ver todos los beneficios
                                </Text>
                                <Icon name="arrow-right" size={20} color={theme.textColor} />
                            </TouchableOpacity>
                        </View>

                        {/* Sección de agradecimiento */}
                        <View style={styles.thanksSection}>
                            <Icon name="heart" size={40} color="#FF6B6B" />
                            <Text style={styles.thanksText}>
                                Gracias a {partner.name} por su compromiso con el medio ambiente
                            </Text>
                        </View>

                        <View style={styles.bottomSpacing} />
                    </ScrollView>

                    {/* Footer con un solo botón principal */}
                    <View style={styles.footer}>
                        <TouchableOpacity
                            style={[styles.primaryButton, { backgroundColor: theme.textColor }]}
                            onPress={() => {
                                onClose();
                                onViewRewards();
                            }}
                        >
                            <Icon name="gift-open" size={22} color="#FFF" />
                            <Text style={styles.primaryButtonText}>Ver Beneficios Disponibles</Text>
                        </TouchableOpacity>
                    </View>
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
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        top: -40,
        right: -20,
    },
    decorCircle2: {
        position: 'absolute',
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        bottom: -20,
        left: 30,
    },
    decorCircle3: {
        position: 'absolute',
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255, 255, 255, 0.12)',
        top: 60,
        left: -10,
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    headerContent: {
        alignItems: 'center',
        zIndex: 1,
    },
    mainIconContainer: {
        marginBottom: 20,
    },
    iconGlow: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#FFF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 15,
        elevation: 8,
    },
    partnerName: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 12,
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    typeBadgeContainer: {
        marginBottom: 20,
    },
    typeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.35)',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.5)',
    },
    typeText: {
        fontSize: 15,
        color: '#FFF',
        fontWeight: '700',
        marginLeft: 6,
    },
    quickStats: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 20,
        paddingVertical: 12,
        paddingHorizontal: 24,
        marginTop: 8,
    },
    quickStatItem: {
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    quickStatValue: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFF',
        marginTop: 4,
    },
    quickStatLabel: {
        fontSize: 11,
        color: 'rgba(255, 255, 255, 0.9)',
        marginTop: 2,
    },
    statDivider: {
        width: 1,
        height: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 20,
    },
    descriptionCard: {
        marginTop: 20,
        padding: 20,
        borderRadius: 16,
        position: 'relative',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardIcon: {
        position: 'absolute',
        top: -20,
        left: 20,
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 4,
    },
    descriptionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#32243B',
        marginBottom: 12,
        marginTop: 16,
    },
    description: {
        fontSize: 15,
        color: '#555',
        lineHeight: 24,
    },
    commitmentSection: {
        marginTop: 28,
    },
    commitmentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    commitmentIconBg: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    commitmentTitleContainer: {
        flex: 1,
    },
    commitmentTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    commitmentSubtitle: {
        fontSize: 13,
        color: '#888',
        marginTop: 2,
    },
    commitmentCard: {
        backgroundColor: '#F8F9FA',
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
    commitment: {
        fontSize: 16,
        color: '#444',
        lineHeight: 26,
        fontStyle: 'italic',
        paddingHorizontal: 20,
        textAlign: 'center',
    },
    section: {
        marginTop: 28,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    sectionTitle: {
        fontSize: 19,
        fontWeight: 'bold',
    },
    sectionSubtitle: {
        fontSize: 13,
        color: '#888',
        marginTop: 2,
    },
    contributionItem: {
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderLeftWidth: 4,
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    contributionNumber: {
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    contributionNumberText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FFF',
    },
    contributionContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    contributionText: {
        fontSize: 15,
        color: '#444',
        marginLeft: 10,
        flex: 1,
        lineHeight: 22,
    },
    impactSection: {
        marginTop: 28,
        marginBottom: 24,
    },
    impactHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    impactTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    impactSubtitle: {
        fontSize: 14,
        color: '#888',
        marginBottom: 20,
        marginLeft: 4,
    },
    impactGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    impactCard: {
        width: '48%',
        borderRadius: 16,
        padding: 18,
        alignItems: 'center',
        marginBottom: 14,
        borderWidth: 2,
        position: 'relative',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
    },
    impactIconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    impactValue: {
        fontSize: 26,
        fontWeight: 'bold',
        marginTop: 4,
    },
    impactLabel: {
        fontSize: 13,
        color: '#666',
        marginTop: 6,
        textAlign: 'center',
        lineHeight: 18,
    },
    impactBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rewardsSection: {
        marginTop: 28,
        marginBottom: 24,
        padding: 20,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    rewardsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    rewardsIconBg: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    rewardsTextContainer: {
        flex: 1,
    },
    rewardsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    rewardsDescription: {
        fontSize: 13,
        color: '#666',
        marginTop: 4,
    },
    previewButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 2,
        borderRadius: 12,
        padding: 14,
    },
    previewButtonText: {
        fontSize: 15,
        fontWeight: '600',
    },
    thanksSection: {
        alignItems: 'center',
        paddingVertical: 24,
        paddingHorizontal: 30,
        marginTop: 20,
    },
    thanksText: {
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
    footer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#E8E8E8',
        backgroundColor: '#FAFAFA',
    },
    primaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 18,
        borderRadius: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
        elevation: 5,
    },
    primaryButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFF',
        marginLeft: 8,
    },
});
