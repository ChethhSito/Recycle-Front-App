import React from 'react';
import { View, StyleSheet, Modal, ScrollView, TouchableOpacity, Image, Share, Alert } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { Text, useTheme } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';

export const EnvironmentalProgramModal = ({ visible, onClose, program }) => {
    const theme = useTheme();
    const { colors } = theme;
    const styles = getStyles(theme);

    if (!program) return null;

    const handleShare = async () => {
        try {
            const message = `🌱 ¡Únete al programa ambiental "${program.title}"!\n\n` +
                `📍 ${program.location}\n` +
                `👥 ${program.participants} participantes ya lo apoyan\n` +
                `⭐ Gana ${program.points} EcoPuntos participando\n\n` +
                `📱 Descarga Nos Planét y participa en este programa:\n` +
                `🔗 https://nosplanet.pe/app\n\n` +
                `💚 Organizado por: ${program.organization}\n` +
                `🌍 Juntos por un planeta más verde`;

            await Share.share({
                message: message,
                title: `Programa: ${program.title}`,
            });
        } catch (error) {
            Alert.alert('Error', 'No se pudo compartir el programa');
        }
    };

    const getOrgColor = () => {
        switch (program.organizationType) {
            case 'ONG': return '#FF6B6B';
            case 'NOS_PLANET': return '#018f64';
            case 'ESTADO': return '#4A90E2';
            default: return '#018f64';
        }
    };

    const activeColor = getOrgColor();

    return (
        <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    {/* Header con Imagen */}
                    <View style={styles.headerContainer}>
                        <Image source={program.image} style={styles.headerImage} />
                        <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.headerGradient}>
                            <View style={[styles.orgBadge, { backgroundColor: activeColor }]}>
                                <Text style={styles.orgBadgeText}>{program.organizationType}</Text>
                            </View>
                        </LinearGradient>
                        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <Icon name="close" size={28} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                        {/* Título */}
                        <View style={styles.titleSection}>
                            <Text style={[styles.title, { color: colors.onSurface }]}>{program.title}</Text>
                            <View style={styles.orgRow}>
                                <Icon name="domain" size={20} color={colors.onSurfaceVariant} />
                                <Text style={[styles.orgName, { color: colors.onSurfaceVariant }]}>{program.organization}</Text>
                            </View>
                        </View>

                        {/* Estadísticas */}
                        <View style={[styles.statsSection, { backgroundColor: colors.surfaceVariant }]}>
                            <StatBox icon="account-group" color={activeColor} value={program.participants} label="Participantes" theme={theme} styles={styles} />
                            <StatBox icon="map-marker" color={activeColor} value={program.location} label="Ubicación" theme={theme} styles={styles} />
                            <StatBox icon="star-circle" color="#FFA500" value={program.points} label="Ecopuntos" theme={theme} styles={styles} />
                        </View>

                        {/* 1. SOBRE EL PROGRAMA */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Icon name="information" size={22} color={activeColor} />
                                <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>Sobre el Programa</Text>
                            </View>
                            <Text style={[styles.description, { color: colors.onSurfaceVariant }]}>{program.description}</Text>
                        </View>

                        {/* 2. OBJETIVOS (Aparecerán cuando llenes el Array en Atlas) */}
                        {program.objectives && program.objectives.length > 0 && (
                            <View style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <Icon name="target" size={22} color={activeColor} />
                                    <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>Objetivos</Text>
                                </View>
                                {program.objectives.map((obj, i) => (
                                    <View key={i} style={styles.listItem}>
                                        <Icon name="check-circle" size={18} color={activeColor} />
                                        <Text style={[styles.listText, { color: colors.onSurfaceVariant }]}>{obj}</Text>
                                    </View>
                                ))}
                            </View>
                        )}

                        {/* 3. ACTIVIDADES (Aparecerán cuando llenes el Array en Atlas) */}
                        {program.activities && program.activities.length > 0 && (
                            <View style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <Icon name="clipboard-list" size={22} color={activeColor} />
                                    <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>Actividades</Text>
                                </View>
                                {program.activities.map((act, i) => (
                                    <View key={i} style={styles.listItem}>
                                        <View style={[styles.bullet, { backgroundColor: activeColor }]} />
                                        <Text style={[styles.listText, { color: colors.onSurfaceVariant }]}>{act}</Text>
                                    </View>
                                ))}
                            </View>
                        )}

                        {/* 4. CONTACTO (Estructura de iconos individuales) */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Icon name="phone" size={22} color={activeColor} />
                                <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>Contacto</Text>
                            </View>

                            {/* Verificamos si existe el objeto contact o el string contactInfo */}
                            {program.contact ? (
                                <View style={{ gap: 10, marginTop: 5 }}>
                                    {program.contact.email && (
                                        <View style={styles.contactRow}>
                                            <Icon name="email" size={20} color={colors.onSurfaceVariant} />
                                            <Text style={[styles.contactText, { color: colors.onSurfaceVariant }]}>{program.contact.email}</Text>
                                        </View>
                                    )}
                                    {program.contact.phone && (
                                        <View style={styles.contactRow}>
                                            <Icon name="phone" size={20} color={colors.onSurfaceVariant} />
                                            <Text style={[styles.contactText, { color: colors.onSurfaceVariant }]}>{program.contact.phone}</Text>
                                        </View>
                                    )}
                                </View>
                            ) : (
                                <Text style={{ color: colors.outline, fontStyle: 'italic' }}>Sin información de contacto</Text>
                            )}
                        </View>

                        <TouchableOpacity style={styles.participateButton} activeOpacity={0.8}>
                            <LinearGradient colors={[activeColor, activeColor + 'CC']} style={styles.participateGradient}>
                                <Icon name="hand-heart" size={22} color="#fff" />
                                <Text style={styles.participateText}>Quiero Participar</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <View style={styles.bottomPadding} />
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

// Componente Interno StatBox
const StatBox = ({ icon, color, value, label, theme, styles }) => (
    <View style={styles.statBox}>
        <Icon name={icon} size={28} color={color} />
        <Text style={[styles.statNumber, { color: theme.colors.onSurface }]}>{value}</Text>
        <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>{label}</Text>
    </View>
);

const getStyles = (theme) => StyleSheet.create({
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' },
    modalContent: {
        height: '92%', backgroundColor: theme.colors.surface,
        borderTopLeftRadius: 25, borderTopRightRadius: 25, overflow: 'hidden',
    },
    headerContainer: { height: 220, position: 'relative' },
    headerImage: { width: '100%', height: '100%', resizeMode: 'cover' },
    headerGradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 100, justifyContent: 'flex-end', padding: 16 },
    orgBadge: { alignSelf: 'flex-start', paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20 },
    orgBadgeText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
    closeButton: { position: 'absolute', top: 15, right: 15, backgroundColor: 'rgba(0, 0, 0, 0.5)', borderRadius: 20, padding: 6 },
    titleSection: { padding: 20 },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
    orgRow: { flexDirection: 'row', alignItems: 'center' },
    orgName: { fontSize: 15, marginLeft: 8 },
    statsSection: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 20, marginHorizontal: 20, borderRadius: 12, marginBottom: 10 },
    statBox: { alignItems: 'center', flex: 1 },
    statNumber: { fontSize: 16, fontWeight: 'bold', marginTop: 8 },
    statLabel: { fontSize: 12, marginTop: 4 },
    section: { padding: 20, paddingTop: 15 },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 8 },
    description: { fontSize: 15, lineHeight: 22 },
    listItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
    listText: { fontSize: 14, marginLeft: 8, flex: 1 },
    bullet: { width: 6, height: 6, borderRadius: 3, marginTop: 7, marginRight: 10 },
    contactRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    contactText: { fontSize: 14 },
    participateButton: { marginHorizontal: 20, marginTop: 10, borderRadius: 12, overflow: 'hidden' },
    participateGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16 },
    participateText: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginLeft: 8 },
    bottomPadding: { height: 30 },
});