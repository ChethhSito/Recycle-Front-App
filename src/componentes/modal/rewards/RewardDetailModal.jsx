import React, { useEffect } from 'react';
import { View, StyleSheet, Modal, ScrollView, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { Text, useTheme, Button } from 'react-native-paper';
import { useTranslation } from '../../../hooks/use-translation';

export const RewardDetailModal = ({ visible, reward, userPoints, onClose, onRedeem }) => {
    const theme = useTheme();
    const { colors } = theme;
    const styles = getStyles(theme);
    const t = useTranslation();

    if (!reward) return null;

    // 💡 Tip: Si el 403 persiste, esta lógica usará el placeholder local
    const imageSource = reward.imageUrl
        ? { uri: reward.imageUrl }
        : require('../../../../assets/header.png');

    const canRedeem = userPoints >= reward.points;
    const pointsNeeded = reward.points - userPoints;

    return (
        <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Icon name="close" size={28} color={colors.onSurface} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        {/* Imagen con manejador de error visual */}
                        <View style={styles.imageContainer}>
                            <Image
                                source={imageSource}
                                style={styles.image}
                                resizeMode="cover"
                                onError={(e) => console.log("❌ Error 403 detectado en:", reward.imageUrl)}
                            />
                            {!canRedeem && (
                                <View style={styles.lockedOverlay}>
                                    <Icon name="lock" size={48} color="#FFF" />
                                    <Text style={styles.lockedText}>Nivel Insuficiente</Text>
                                </View>
                            )}
                        </View>

                        <View style={styles.contentContainer}>
                            {/* Badge de Categoría */}
                            <View style={[styles.categoryBadge, { backgroundColor: colors.primaryContainer }]}>
                                <Icon name={reward.categoryIcon || 'tag'} size={14} color={colors.primary} />
                                <Text style={[styles.categoryText, { color: colors.primary }]}>{reward.category}</Text>
                            </View>

                            <Text style={[styles.title, { color: colors.onSurface }]}>{reward.title}</Text>

                            {/* Tarjeta de Puntos */}
                            <View style={[styles.pointsCard, { backgroundColor: colors.surfaceVariant }]}>
                                <View style={styles.pointsInfo}>
                                    <Icon name="leaf" size={24} color={colors.primary} />
                                    <View style={{ marginLeft: 12 }}>
                                        <Text style={[styles.pointsLabel, { color: colors.onSurfaceVariant }]}>Costo de canje</Text>
                                        <Text style={[styles.pointsValue, { color: colors.primary }]}>{reward.points} EcoPuntos</Text>
                                    </View>
                                </View>

                                <View style={[styles.statusBadge, { backgroundColor: canRedeem ? 'rgba(1, 143, 100, 0.1)' : 'rgba(239, 68, 68, 0.1)' }]}>
                                    <Icon
                                        name={canRedeem ? "check-circle" : "alert-circle"}
                                        size={18}
                                        color={canRedeem ? colors.primary : colors.error}
                                    />
                                    <Text style={{ color: canRedeem ? colors.primary : colors.error, marginLeft: 8, fontWeight: 'bold' }}>
                                        {canRedeem ? "¡Puedes canjearlo!" : `Te faltan ${pointsNeeded} pts`}
                                    </Text>
                                </View>
                            </View>

                            <Section
                                title="Descripción"
                                content={reward.description}
                                theme={theme}
                                styles={styles} // 🚀 ¡Esto es lo que faltaba!
                            />

                            <View style={styles.section}>
                                <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>Detalles</Text>

                                {/* 2. Corregimos la llamada al Stock */}
                                <DetailRow
                                    icon="package-variant"
                                    text={`Stock disponible: ${reward.stock}`}
                                    colors={colors}
                                    styles={styles} // 🚀 ¡Esto también!
                                />

                                {/* 3. Corregimos la fecha de expiración */}
                                {reward.expiryDate && (
                                    <DetailRow
                                        icon="calendar-clock"
                                        text={`Válido hasta: ${reward.expiryDate}`}
                                        colors={colors}
                                        styles={styles}
                                    />
                                )}
                            </View>

                            {/* 4. Corregimos los Términos y Condiciones */}
                            <Section
                                title="Términos y Condiciones"
                                content={reward.terms}
                                theme={theme}
                                styles={styles}
                                isTerms
                            />
                        </View>
                    </ScrollView>

                    {/* Footer con botón dinámico */}
                    <View style={[styles.footer, { borderTopColor: colors.outlineVariant }]}>
                        <TouchableOpacity
                            style={[
                                styles.redeemButton,
                                { backgroundColor: canRedeem ? colors.primary : colors.surfaceVariant }
                            ]}
                            onPress={onRedeem}
                            disabled={!canRedeem}
                        >
                            <Icon name={canRedeem ? "gift" : "lock"} size={20} color={canRedeem ? colors.onPrimary : colors.outline} />
                            <Text style={[styles.redeemButtonText, { color: canRedeem ? colors.onPrimary : colors.outline }]}>
                                {canRedeem ? "Canjear Recompensa" : "Puntos Insuficientes"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const Section = ({ title, content, theme, styles, isTerms }) => (
    <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>{title}</Text>
        <Text style={[isTerms ? styles.termsText : styles.description, { color: theme.colors.onSurfaceVariant }]}>{content}</Text>
    </View>
);

const DetailRow = ({ icon, text, colors, styles }) => (
    <View style={styles.detailRow}>
        <Icon name={icon} size={20} color={colors.onSurfaceVariant} />
        <Text style={[styles.detailText, { color: colors.onSurfaceVariant }]}>{text}</Text>
    </View>
);

const getStyles = (theme) => StyleSheet.create({
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' },
    modalContent: {
        backgroundColor: theme.colors.surface,
        borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '90%', overflow: 'hidden',
    },
    header: { flexDirection: 'row', justifyContent: 'flex-end', padding: 16 },
    imageContainer: { width: '100%', height: 250, backgroundColor: theme.colors.surfaceVariant, position: 'relative' },
    image: { width: '100%', height: '100%' },
    lockedOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 0, 0, 0.6)', justifyContent: 'center', alignItems: 'center' },
    lockedText: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginTop: 8 },
    contentContainer: { padding: 20 },
    categoryBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, alignSelf: 'flex-start', marginBottom: 12 },
    categoryText: { fontSize: 12, fontWeight: '600', marginLeft: 4 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
    pointsCard: { borderRadius: 12, padding: 16, marginBottom: 20 },
    pointsInfo: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    pointsLabel: { fontSize: 13, marginBottom: 4 },
    pointsValue: { fontSize: 20, fontWeight: 'bold' },
    statusBadge: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 8 },
    section: { marginBottom: 20 },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
    description: { fontSize: 15, lineHeight: 24 },
    detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    detailText: { fontSize: 14, marginLeft: 12, flex: 1 },
    termsText: { fontSize: 13, lineHeight: 20, opacity: 0.7 },
    footer: { padding: 20, borderTopWidth: 1 },
    redeemButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 12 },
    redeemButtonText: { fontSize: 16, fontWeight: 'bold', marginLeft: 8 },
});