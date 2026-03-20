import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Animated, Dimensions, ScrollView, Alert, Share } from 'react-native';
import { Text, useTheme, IconButton } from 'react-native-paper'; // 🚀 Uso de Paper
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import YoutubePlayer from 'react-native-youtube-iframe';

const { height } = Dimensions.get('window');

export const VideoPlayerModal = ({ visible, video, onClose, onVideoComplete }) => {
    const theme = useTheme();
    const { colors } = theme;

    const [showModal, setShowModal] = useState(visible);
    const [playing, setPlaying] = useState(false);
    const [hasEarnedPoints, setHasEarnedPoints] = useState(false);
    const slideAnim = useRef(new Animated.Value(height)).current;

    useEffect(() => {
        if (visible) {
            setShowModal(true);
            setPlaying(true); // Auto-play al abrir
            setHasEarnedPoints(false);
            Animated.spring(slideAnim, {
                toValue: 0,
                useNativeDriver: true,
                tension: 50,
                friction: 10
            }).start();
        } else {
            setPlaying(false);
            Animated.timing(slideAnim, {
                toValue: height,
                duration: 300,
                useNativeDriver: true,
            }).start(() => setShowModal(false));
        }
    }, [visible]);

    // 🏆 Lógica de finalización para puntos y vistas
    const onStateChange = (state) => {
        if (state === 'ended' && !hasEarnedPoints) {
            setHasEarnedPoints(true);
            // IMPORTANTE: Usamos _id para tu backend de MongoDB
            if (video?._id) {
                onVideoComplete?.(video._id);
                Alert.alert("¡Felicidades!", "Has completado el video y ganado Eco-puntos.");
            }
        }
    };

    const handleShare = async () => {
        try {
            await Share.share({
                message: `🌿 ¡Mira este video educativo en Nos Planet!\n\n📹 "${video.title}"\n\n👉 ${video.videoUrl}`,
                title: video.title,
            });
        } catch (error) {
            Alert.alert('Error', 'No se pudo compartir el video');
        }
    };

    if (!showModal || !video) return null;

    const getYoutubeId = (url) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const youtubeId = getYoutubeId(video.videoUrl);

    // Blindaje de categoría (String vs Object)
    const categoryName = typeof video.category === 'object' ? video.category.name : video.category;

    return (
        <Modal visible={showModal} transparent animationType="none" onRequestClose={onClose}>
            <View style={styles.modalContainer}>
                <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose} />

                <Animated.View
                    style={[
                        styles.modalContent,
                        { backgroundColor: colors.surface, transform: [{ translateY: slideAnim }] }
                    ]}
                >
                    {/* Botón de cerrar flotante para mejor UX */}
                    <IconButton
                        icon="close"
                        size={24}
                        style={styles.closeBtn}
                        onPress={onClose}
                        iconColor={colors.onSurface}
                    />

                    <View style={styles.header}>
                        <Text style={[styles.headerTitle, { color: colors.onSurface }]}>Video Educativo</Text>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={styles.videoContainer}>
                            {youtubeId ? (
                                <View style={styles.playerWrapper}>
                                    <YoutubePlayer
                                        height={220}
                                        play={playing}
                                        videoId={youtubeId}
                                        onChangeState={onStateChange}
                                    />
                                </View>
                            ) : (
                                <View style={[styles.videoPlaceholder, { backgroundColor: colors.surfaceVariant }]}>
                                    <Icon name="youtube" size={80} color={colors.error} />
                                    <Text style={{ color: colors.onSurfaceVariant }}>Video no disponible</Text>
                                </View>
                            )}
                        </View>

                        <View style={styles.infoSection}>
                            <Text style={[styles.videoTitle, { color: colors.onSurface }]}>{String(video.title || '')}</Text>

                            <View style={styles.metaRow}>
                                <View style={styles.metaItem}>
                                    <Icon name="clock-outline" size={16} color={colors.onSurfaceVariant} />
                                    <Text style={{ color: colors.onSurfaceVariant }}>{String(video.duration || '0:00')}</Text>
                                </View>

                                {video.views !== undefined && (
                                    <View style={styles.metaItem}>
                                        <Icon name="eye-outline" size={16} color={colors.onSurfaceVariant} />
                                        <Text style={{ color: colors.onSurfaceVariant }}>{String(video.views)} vistas</Text>
                                    </View>
                                )}

                                <View style={[styles.categoryBadge, { backgroundColor: colors.primaryContainer }]}>
                                    <Text style={{ color: colors.onPrimaryContainer, fontSize: 11, fontWeight: 'bold' }}>
                                        {String(categoryName || 'General').toUpperCase()}
                                    </Text>
                                </View>
                            </View>

                            <View style={[styles.divider, { backgroundColor: colors.outlineVariant }]} />

                            <Text style={[styles.descriptionTitle, { color: colors.onSurface }]}>Acerca de este video</Text>
                            <Text style={[styles.descriptionText, { color: colors.onSurfaceVariant }]}>
                                {String(video.description || 'Aprende a cuidar el planeta con este video informativo.')}
                            </Text>
                        </View>

                        {/* Solo botón de compartir, eliminamos el de Like como pediste */}
                        <View style={styles.actionsSection}>
                            <TouchableOpacity
                                style={[styles.shareBtn, { backgroundColor: colors.primary }]}
                                onPress={handleShare}
                            >
                                <Icon name="share-variant" size={20} color={colors.onPrimary} />
                                <Text style={{ color: colors.onPrimary, fontWeight: 'bold', marginLeft: 8 }}>COMPARTIR VIDEO</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: { flex: 1, justifyContent: 'flex-end' },
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
    modalContent: {
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        paddingTop: 20,
        paddingBottom: 30,
        maxHeight: '90%',
        elevation: 10,
    },
    closeBtn: { position: 'absolute', top: 10, right: 10, zIndex: 10 },
    header: { paddingHorizontal: 24, marginBottom: 15, alignItems: 'center' },
    headerTitle: { fontSize: 16, fontWeight: 'bold', opacity: 0.6, letterSpacing: 1 },
    videoContainer: { marginBottom: 20 },
    playerWrapper: { overflow: 'hidden', borderRadius: 0 },
    videoPlaceholder: { width: '100%', height: 220, alignItems: 'center', justifyContent: 'center' },
    infoSection: { paddingHorizontal: 24 },
    videoTitle: { fontSize: 24, fontWeight: 'bold', lineHeight: 30, marginBottom: 10 },
    metaRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 15 },
    metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    categoryBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
    divider: { height: 1, width: '100%', marginVertical: 20 },
    descriptionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
    descriptionText: { fontSize: 15, lineHeight: 22 },
    actionsSection: { paddingHorizontal: 24, marginTop: 25 },
    shareBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 16,
        elevation: 2
    },
});