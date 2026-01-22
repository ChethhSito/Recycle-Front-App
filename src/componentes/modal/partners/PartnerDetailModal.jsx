import React from 'react';
import { View, Text, StyleSheet, Modal, ScrollView, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export const PartnerDetailModal = ({ visible, partner, onClose, onViewRewards }) => {
    if (!partner) return null;

    // Helper para generar colores
    const lightenColor = (hex, percent) => {
        const num = parseInt(hex.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    };

    const mainColor = partner.mainColor || '#00796B';
    const lightColor = lightenColor(mainColor, 20);
    const veryLightColor = lightenColor(mainColor, 90); // Para fondos claros

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    {/* Header con gradiente */}
                    <LinearGradient
                        colors={[mainColor, lightColor]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.gradientHeader}
                    >
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Icon name="close" size={24} color="#FFF" />
                        </TouchableOpacity>

                        <View style={styles.headerContent}>
                            <View style={styles.headerRow}>
                                {/* Logo Imagen - Izquierda */}
                                <View style={styles.logoContainer}>
                                    <Image
                                        source={{ uri: partner.logo }}
                                        style={styles.logoImage}
                                        resizeMode="cover"
                                    />
                                </View>

                                {/* Nombre y tipo - Derecha */}
                                <View style={styles.headerTextContainer}>
                                    <Text style={styles.partnerName}>{partner.name}</Text>
                                    <View style={styles.typeBadgeContainer}>
                                        <View style={styles.typeBadge}>
                                            <Icon name="medal" size={16} color="#FFD700" />
                                            <Text style={styles.typeText}>{partner.typeLabel}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            {/* Stats rápidas (Debajo) */}
                            <View style={styles.quickStats}>
                                <View style={styles.quickStatItem}>
                                    <Icon name="gift" size={20} color="#FFF" />
                                    <Text style={styles.quickStatValue}>{partner.rewardsCount || 0}</Text>
                                    <Text style={styles.quickStatLabel}>Premios</Text>
                                </View>
                                <View style={styles.statDivider} />
                                <View style={styles.quickStatItem}>
                                    <Icon name="account-group" size={20} color="#FFF" />
                                    <Text style={styles.quickStatValue}>{partner.usersCount || 0}</Text>
                                    <Text style={styles.quickStatLabel}>Canjes</Text>
                                </View>
                            </View>
                        </View>
                    </LinearGradient>

                    <ScrollView
                        style={styles.scrollView}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 20 }}
                    >
                        {/* Descripción */}
                        <View style={[styles.descriptionCard, { backgroundColor: veryLightColor }]}>
                            <Text style={styles.descriptionTitle}>Sobre {partner.name}</Text>
                            <Text style={styles.description}>{partner.description}</Text>
                        </View>

                        {/* Compromiso Ambiental (Mantenido) */}
                        <View style={styles.commitmentSection}>
                            <View style={styles.commitmentHeader}>
                                <LinearGradient
                                    colors={[mainColor, lightColor]}
                                    style={styles.commitmentIconBg}
                                >
                                    <Icon name="leaf" size={32} color="#FFF" />
                                </LinearGradient>
                                <View style={styles.commitmentTitleContainer}>
                                    <Text style={[styles.commitmentTitle, { color: mainColor }]}>
                                        Compromiso Ambiental
                                    </Text>
                                    <Text style={styles.commitmentSubtitle}>Su visión ecológica</Text>
                                </View>
                            </View>
                            <View style={[styles.commitmentCard, { borderLeftColor: mainColor }]}>
                                <Icon name="format-quote-open" size={24} color={mainColor} style={styles.quoteIcon} />
                                <Text style={styles.commitment}>{partner.environmentalCommitment}</Text>
                                <Icon name="format-quote-close" size={24} color={mainColor} style={styles.quoteIconEnd} />
                            </View>
                        </View>

                        {/* Beneficios disponibles */}
                        <View style={[styles.rewardsSection, { backgroundColor: veryLightColor }]}>
                            <View style={styles.rewardsHeader}>
                                <View style={[styles.rewardsIconBg, { backgroundColor: mainColor }]}>
                                    <Icon name="gift-open" size={32} color="#FFF" />
                                </View>
                                <View style={styles.rewardsTextContainer}>
                                    <Text style={[styles.rewardsTitle, { color: mainColor }]}>
                                        {partner.rewardsCount || 0} Beneficios Disponibles
                                    </Text>
                                    <Text style={styles.rewardsDescription}>
                                        Canjea tus EcoPuntos por recompensas exclusivas
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </ScrollView>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <TouchableOpacity
                            style={[styles.primaryButton, { backgroundColor: mainColor }]}
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
        height: '90%', // Fixed height to ensure ScrollView works
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 10,
    },
    gradientHeader: {
        padding: 20,
        paddingTop: 40,
        // alignItems: 'center', // Removed to allow row layout
    },
    closeButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        zIndex: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
        borderRadius: 20,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerContent: {
        width: '100%',
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20, // Space for stats
        paddingRight: 40, // Avoid close button overlap
    },
    logoContainer: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: '#FFF',
        borderWidth: 3,
        borderColor: 'rgba(255,255,255,0.3)',
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16, // Space between logo and text
    },
    logoImage: {
        width: '100%',
        height: '100%',
    },
    headerTextContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start', // Left align text
    },
    partnerName: {
        fontSize: 24, // Slightly smaller to fit
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 6,
        textAlign: 'left',
    },
    typeBadgeContainer: {
        // marginBottom: 16, // Removed
    },
    typeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.4)',
    },
    typeText: {
        fontSize: 13,
        color: '#FFF',
        fontWeight: '700',
        marginLeft: 6,
    },
    quickStats: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 16,
        paddingVertical: 10,
        paddingHorizontal: 20,
        width: '100%',
        justifyContent: 'space-around',
    },
    quickStatItem: {
        alignItems: 'center',
    },
    quickStatValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFF',
    },
    quickStatLabel: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.9)',
    },
    statDivider: {
        width: 1,
        height: 30,
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 20,
    },
    descriptionCard: {
        marginTop: 24,
        padding: 20,
        borderRadius: 16,
    },
    descriptionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    description: {
        fontSize: 15,
        color: '#555',
        lineHeight: 24,
    },
    commitmentSection: {
        marginTop: 24,
    },
    commitmentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    commitmentIconBg: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    commitmentTitleContainer: {
        flex: 1,
    },
    commitmentTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    commitmentSubtitle: {
        fontSize: 13,
        color: '#888',
    },
    commitmentCard: {
        backgroundColor: '#FAFAFA',
        borderRadius: 14,
        padding: 20,
        borderLeftWidth: 4,
        marginTop: 8,
    },
    quoteIcon: {
        marginBottom: 8,
        opacity: 0.5,
    },
    quoteIconEnd: {
        alignSelf: 'flex-end',
        marginTop: 8,
        opacity: 0.5,
    },
    commitment: {
        fontSize: 15,
        color: '#444',
        lineHeight: 24,
        fontStyle: 'italic',
        textAlign: 'center',
    },
    rewardsSection: {
        marginTop: 24,
        marginBottom: 24,
        padding: 16,
        borderRadius: 16,
    },
    rewardsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rewardsIconBg: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    rewardsTextContainer: {
        flex: 1,
    },
    rewardsTitle: {
        fontSize: 17,
        fontWeight: 'bold',
    },
    rewardsDescription: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    footer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#EEE',
        backgroundColor: '#FFF',
    },
    primaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    primaryButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFF',
        marginLeft: 8,
    },
});
