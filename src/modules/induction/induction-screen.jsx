import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CloudHeader } from '../../componentes/cards/home/CloudHeader';
import { VideoCard } from '../../componentes/cards/VideoCard';
import { VideoPlayerModal } from '../../componentes/modal/VideoPlayerModal';

// Datos de videos educativos con URLs reales de YouTube
const VIDEOS = [
    {
        id: '1',
        title: 'Reducir, Reutilizar y Reciclar',
        category: 'Tutorial',
        duration: '3:45',
        thumbnail: 'https://img.youtube.com/vi/cvakvfXj0KE/mqdefault.jpg',
        views: '1.2k',
        xpPoints: 10,
        completionXP: 15,
        videoUrl: 'https://www.youtube.com/watch?v=cvakvfXj0KE',
        description: 'Aprende las 3R del reciclaje: Reducir, Reutilizar y Reciclar para mejorar el mundo.',
    },
    {
        id: '2',
        title: 'Separación de Residuos',
        category: 'Tutorial',
        duration: '2:30',
        thumbnail: 'https://img.youtube.com/vi/uaI3PLmAJyM/mqdefault.jpg',
        views: '856',
        xpPoints: 10,
        completionXP: 15,
        videoUrl: 'https://www.youtube.com/watch?v=uaI3PLmAJyM',
        description: 'Guía práctica para separar correctamente los residuos en tu hogar.',
    },
    {
        id: '3',
        title: 'El ciclo del reciclaje',
        category: 'Reciclaje',
        duration: '4:15',
        thumbnail: 'https://img.youtube.com/vi/cvakvfXj0KE/mqdefault.jpg',
        views: '2.1k',
        xpPoints: 12,
        completionXP: 18,
        videoUrl: 'https://www.youtube.com/watch?v=cvakvfXj0KE',
        description: 'Descubre el proceso completo del reciclaje de materiales.',
    },
    {
        id: '4',
        title: 'Beneficios del reciclaje',
        category: 'Eco-Tips',
        duration: '3:00',
        thumbnail: 'https://img.youtube.com/vi/uaI3PLmAJyM/mqdefault.jpg',
        views: '945',
        xpPoints: 8,
        completionXP: 12,
        videoUrl: 'https://www.youtube.com/watch?v=uaI3PLmAJyM',
        description: 'Impacto positivo del reciclaje en el medio ambiente.',
    },
    {
        id: '5',
        title: 'Cómo canjear tus puntos',
        category: 'Premios',
        duration: '2:45',
        thumbnail: 'https://img.youtube.com/vi/cvakvfXj0KE/mqdefault.jpg',
        views: '1.5k',
        xpPoints: 15,
        completionXP: 25,
        videoUrl: 'https://www.youtube.com/watch?v=cvakvfXj0KE',
        description: 'Conoce el catálogo de premios y cómo reclamarlos con tus puntos XP.',
    },
    {
        id: '6',
        title: 'Compostaje en casa',
        category: 'Eco-Tips',
        duration: '5:20',
        thumbnail: 'https://img.youtube.com/vi/uaI3PLmAJyM/mqdefault.jpg',
        views: '678',
        xpPoints: 12,
        completionXP: 20,
        videoUrl: 'https://www.youtube.com/watch?v=uaI3PLmAJyM',
        description: 'Aprende a hacer compost con residuos orgánicos y reduce tu huella.',
    },
];

const CATEGORIES = ['Todos', 'Tutorial', 'Reciclaje', 'Eco-Tips', 'Premios'];

export const InductionScreen = ({ navigation, onOpenDrawer, userAvatar, userName }) => {
    const [selectedCategory, setSelectedCategory] = useState('Todos');
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [completedVideos, setCompletedVideos] = useState(new Set());
    const [likedVideos, setLikedVideos] = useState(new Set());

    // Filtrar videos por categoría
    const filteredVideos = selectedCategory === 'Todos'
        ? VIDEOS
        : VIDEOS.filter(video => video.category === selectedCategory);

    const handleVideoPress = (video) => {
        setSelectedVideo(video);
        setModalVisible(true);
    };

    const handleVideoComplete = (videoId) => {
        if (!completedVideos.has(videoId)) {
            setCompletedVideos(prev => new Set(prev).add(videoId));
            // Aquí se puede integrar con el sistema de puntos global si es necesario
        }
    };

    const handleLike = (videoId) => {
        if (!likedVideos.has(videoId)) {
            setLikedVideos(prev => new Set(prev).add(videoId));
        }
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
            <StatusBar barStyle="dark-content" backgroundColor="#B7ECDC" />
            <View style={styles.container}>
                {/* Header */}
                <CloudHeader
                    userName={userName || 'Usuario'}
                    userType="Aprende todo sobre el reciclaje"
                    avatarUrl={userAvatar || 'https://i.pravatar.cc/150?img=33'}
                    onMenuPress={onOpenDrawer}
                />

                {/* Filtros de Categoría */}
                <View style={styles.filtersSection}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.filtersContainer}
                    >
                        {CATEGORIES.map((category) => (
                            <TouchableOpacity
                                key={category}
                                style={[
                                    styles.filterChip,
                                    selectedCategory === category && styles.filterChipActive
                                ]}
                                onPress={() => setSelectedCategory(category)}
                            >
                                <Text style={[
                                    styles.filterText,
                                    selectedCategory === category && styles.filterTextActive
                                ]}>
                                    {category}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Lista de Videos */}
                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {filteredVideos.length > 0 ? (
                        filteredVideos.map((video) => (
                            <VideoCard
                                key={video.id}
                                video={video}
                                onPress={() => handleVideoPress(video)}
                                isCompleted={completedVideos.has(video.id)}
                            />
                        ))
                    ) : (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyText}>
                                No hay videos en esta categoría
                            </Text>
                        </View>
                    )}
                </ScrollView>

                {/* Video Player Modal */}
                {selectedVideo && (
                    <VideoPlayerModal
                        visible={modalVisible}
                        video={selectedVideo}
                        onClose={() => {
                            setModalVisible(false);
                            setSelectedVideo(null);
                        }}
                        onVideoComplete={handleVideoComplete}
                        onLike={handleLike}
                    />
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#B7ECDC',
    },
    container: {
        flex: 1,
        backgroundColor: '#018f64',
    },
    filtersSection: {

        marginBottom: 12,
    },
    filtersContainer: {
        paddingHorizontal: 20,
        gap: 8,
    },
    filterChip: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    filterChipActive: {
        backgroundColor: '#018f64',
        borderColor: '#018f64',
    },
    filterText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#32243B',
    },
    filterTextActive: {
        color: '#FFFFFF',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 24,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
});
