import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Animated, Dimensions, ScrollView, Alert, Share } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import YoutubePlayer from 'react-native-youtube-iframe';

const { height } = Dimensions.get('window');

export const VideoPlayerModal = ({ visible, video, onClose, onVideoComplete, onLike }) => {
    const [showModal, setShowModal] = useState(visible);
    const [isLiked, setIsLiked] = useState(false);
    const [playing, setPlaying] = useState(false);
    const [hasEarnedPoints, setHasEarnedPoints] = useState(false);
    const slideAnim = React.useRef(new Animated.Value(height)).current;

    useEffect(() => {
        if (visible) {
            setShowModal(true);
            setPlaying(false);
            setHasEarnedPoints(false);
            slideAnim.setValue(height);
            Animated.spring(slideAnim, {
                toValue: 0,
                useNativeDriver: true,
                damping: 15,
                mass: 1.2,
                stiffness: 100,
                velocity: 8,
            }).start();
        } else {
            setPlaying(false);
            Animated.timing(slideAnim, {
                toValue: height,
                duration: 300,
                useNativeDriver: true,
            }).start(({ finished }) => {
                if (finished) {
                    setShowModal(false);
                }
            });
        }
    }, [visible]);

    const handleLike = () => {
        if (!isLiked) {
            setIsLiked(true);
            onLike?.(video.id);
        }
    };

    const onStateChange = (state) => {
        if (state === 'ended' && !hasEarnedPoints) {
            setHasEarnedPoints(true);
            onVideoComplete?.(video.id);
        }
    };

    const handleShare = async () => {
        try {
            const message = `🌿 ¡Te recomiendo este video educativo de Nos Planet!\n\n📹 "${video.title}"\n\n${video.description || 'Aprende más sobre reciclaje y cuidado del medio ambiente.'}\n\n👉 Míralo aquí: ${video.videoUrl}\n\n#NosPlanet #Reciclaje #MedioAmbiente`;
            
            const result = await Share.share({
                message: message,
                title: video.title,
            });

            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    console.log('Compartido con:', result.activityType);
                } else {
                    console.log('Video compartido exitosamente');
                }
            }
        } catch (error) {
            Alert.alert('Error', 'No se pudo compartir el video');
        }
    };

    if (!showModal || !video) return null;

    // Extraer ID de YouTube de la URL
    const getYoutubeId = (url) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const youtubeId = getYoutubeId(video.videoUrl);

    return (
        <Modal
            visible={showModal}
            transparent
            animationType="none"
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <TouchableOpacity
                    style={styles.overlay}
                    activeOpacity={1}
                    onPress={onClose}
                />

                <Animated.View
                    style={[
                        styles.modalContent,
                        { transform: [{ translateY: slideAnim }] }
                    ]}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Video Educativo</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Icon name="close" size={24} color="#32243B" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        {/* YouTube Player */}
                        <View style={styles.videoContainer}>
                            {youtubeId ? (
                                <YoutubePlayer
                                    height={220}
                                    play={playing}
                                    videoId={youtubeId}
                                    onChangeState={onStateChange}
                                />
                            ) : (
                                <View style={styles.videoPlaceholder}>
                                    <Icon name="youtube" size={80} color="#FF0000" />
                                    <Text style={styles.videoPlaceholderText}>
                                        Video no disponible
                                    </Text>
                                </View>
                            )}
                        </View>

                        {/* Video Info */}
                        <View style={styles.infoSection}>
                            <View style={styles.titleRow}>
                                <Text style={styles.videoTitle}>{video.title}</Text>
                            </View>

                            <View style={styles.metaRow}>
                                <View style={styles.metaItem}>
                                    <Icon name="clock-outline" size={16} color="#666" />
                                    <Text style={styles.metaText}>{video.duration}</Text>
                                </View>
                                
                                {video.views && (
                                    <View style={styles.metaItem}>
                                        <Icon name="eye-outline" size={16} color="#666" />
                                        <Text style={styles.metaText}>{video.views} vistas</Text>
                                    </View>
                                )}

                                <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(video.category) }]}>
                                    <Text style={styles.categoryText}>{video.category}</Text>
                                </View>
                            </View>
                        </View>

                        {/* Description */}
                        <View style={styles.descriptionSection}>
                            <Text style={styles.descriptionTitle}>Acerca de este video</Text>
                            <Text style={styles.descriptionText}>
                                {video.description || 'Este video te enseñará conceptos importantes sobre el reciclaje y cómo puedes contribuir al cuidado del medio ambiente desde tu hogar.'}
                            </Text>
                        </View>

                        {/* Action Buttons */}
                        <View style={styles.actionsSection}>
                            <TouchableOpacity 
                                style={styles.actionButton}
                                onPress={handleLike}
                            >
                                <Icon 
                                    name={isLiked ? "heart" : "heart-outline"} 
                                    size={24} 
                                    color={isLiked ? "#FF4081" : "#018f64"} 
                                />
                                <Text style={[styles.actionButtonText, isLiked && { color: "#FF4081" }]}>
                                    {isLiked ? 'Te Gusta' : 'Me Gusta'}
                                </Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
                                <Icon name="share-variant" size={24} color="#018f64" />
                                <Text style={styles.actionButtonText}>Compartir</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </Animated.View>
            </View>
        </Modal>
    );
};

const getCategoryColor = (category) => {
    const colors = {
        'Tutorial': '#00C6A0',
        'Reciclaje': '#018f64',
        'Eco-Tips': '#FFCB4D',
        'Premios': '#FF4081',
        'default': '#B7ECDC'
    };
    return colors[category] || colors.default;
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingTop: 24,
        paddingBottom: 40,
        maxHeight: '95%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#32243B',
    },
    videoContainer: {
        paddingHorizontal: 24,
        marginBottom: 20,
    },
    videoPlaceholder: {
        width: '100%',
        height: 220,
        backgroundColor: '#B7ECDC',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    videoPlaceholderText: {
        color: '#32243B',
        fontSize: 16,
        fontWeight: '600',
        marginTop: 8,
    },
    infoSection: {
        paddingHorizontal: 24,
        marginBottom: 20,
    },
    titleRow: {
        marginBottom: 12,
    },
    videoTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#32243B',
        lineHeight: 28,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 16,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    metaText: {
        fontSize: 14,
        color: '#666',
    },
    categoryBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    categoryText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '600',
    },
    descriptionSection: {
        paddingHorizontal: 24,
        marginBottom: 20,
    },
    descriptionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#32243B',
        marginBottom: 8,
    },
    descriptionText: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    actionsSection: {
        flexDirection: 'row',
        paddingHorizontal: 24,
        gap: 16,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#B7ECDC',
        paddingVertical: 12,
        borderRadius: 16,
        gap: 8,
    },
    actionButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#018f64',
    },
});
