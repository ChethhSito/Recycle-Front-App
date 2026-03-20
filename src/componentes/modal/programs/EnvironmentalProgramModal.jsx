import React, { useState } from 'react';
import { View, StyleSheet, Modal, ScrollView, TouchableOpacity, Image, Share, Alert } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { Text, useTheme, ActivityIndicator } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useProgramStore } from '../../../hooks/use-program-store';
import { useAuthStore } from '../../../hooks/use-auth-store';


export const EnvironmentalProgramModal = ({ visible, onClose, program }) => {
    const theme = useTheme();
    const { colors } = theme;
    const styles = getStyles(theme);

    const { user } = useAuthStore();
    const { startJoiningProgram, startLeavingProgram } = useProgramStore();
    const [loading, setLoading] = useState(false);

    if (!program) return null;

    // 3. Lógica para saber si el usuario ya está en la lista de participantes
    // El backend devuelve un array de IDs o de Objetos en 'participants'
    const isParticipating = Array.isArray(program.participants)
        ? program.participants.some(p =>
            (typeof p === 'string' ? p === user?._id : p?._id === user?._id)
        )
        : false;

    const handleParticipate = async () => {
        setLoading(true);
        try {
            if (isParticipating) {
                // Si ya está, lo quitamos
                await startLeavingProgram(program._id);
                Alert.alert("Programa", "Has cancelado tu participación.");
            } else {
                // Si no está, lo unimos
                const res = await startJoiningProgram(program._id);
                if (res.ok) {
                    Alert.alert("¡Excelente!", "Te has unido al programa. Pronto recibirás más información.");
                }
            }
        } catch (error) {
            Alert.alert("Error", "No se pudo procesar tu solicitud.");
        } finally {
            setLoading(false);
        }
    };

    const handleShare = async () => {
        try {
            const message = `🌱 ¡Únete al programa ambiental "${program.title}"!\n\n` +
                `📍 ${program.location}\n` +
                `👥 ${program.participants?.length || 0} participantes ya lo apoyan\n` +
                `⭐ Gana ${program.points} EcoPuntos participando\n\n` +
                `📱 Organizado por: ${program.organization}`;

            await Share.share({ message, title: `Programa: ${program.title}` });
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
                        {/* Usamos imageUrl si viene del back */}
                        <Image source={program.image || { uri: program.imageUrl }} style={styles.headerImage} />
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
                        <View style={styles.titleSection}>
                            <Text style={[styles.title, { color: colors.onSurface }]}>{program.title}</Text>
                            <View style={styles.orgRow}>
                                <Icon name="domain" size={20} color={colors.onSurfaceVariant} />
                                <Text style={[styles.orgName, { color: colors.onSurfaceVariant }]}>{program.organization}</Text>
                            </View>
                        </View>

                        {/* Estadísticas - Usamos .length para los participantes */}
                        <View style={[styles.statsSection, { backgroundColor: colors.surfaceVariant }]}>
                            <StatBox
                                icon="account-group"
                                color={activeColor}
                                // Si es array, mostramos el length. Si es número (dato viejo), mostramos el número.
                                value={Array.isArray(program.participants) ? program.participants.length : (program.participants || 0)}
                                label="Participantes"
                                theme={theme}
                                styles={styles}
                            />
                            <StatBox icon="map-marker" color={activeColor} value={program.location} label="Ubicación" theme={theme} styles={styles} />
                            <StatBox icon="star-circle" color="#FFA500" value={program.points} label="Ecopuntos" theme={theme} styles={styles} />
                        </View>

                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Icon name="information" size={22} color={activeColor} />
                                <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>Sobre el Programa</Text>
                            </View>
                            <Text style={[styles.description, { color: colors.onSurfaceVariant }]}>{program.description}</Text>
                        </View>

                        {/* ... (Objetivos y Actividades se quedan igual) ... */}

                        {/* Botón de Participar Dinámico */}
                        <TouchableOpacity
                            style={styles.participateButton}
                            activeOpacity={0.8}
                            onPress={handleParticipate}
                            disabled={loading}
                        >
                            <LinearGradient
                                colors={isParticipating ? ['#666', '#999'] : [activeColor, activeColor + 'CC']}
                                style={styles.participateGradient}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <>
                                        <Icon name={isParticipating ? "account-check" : "hand-heart"} size={22} color="#fff" />
                                        <Text style={styles.participateText}>
                                            {isParticipating ? '¡Ya estás inscrito!' : 'Quiero Participar'}
                                        </Text>
                                    </>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>

                        {/* Botón secundario para salir si ya está inscrito */}
                        {isParticipating && !loading && (
                            <TouchableOpacity onPress={handleParticipate} style={{ marginTop: 10 }}>
                                <Text style={{ textAlign: 'center', color: colors.error, fontSize: 13 }}>Cancelar mi participación</Text>
                            </TouchableOpacity>
                        )}

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