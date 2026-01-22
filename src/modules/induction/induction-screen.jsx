import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { CloudHeader } from '../../componentes/cards/home/CloudHeader';
import { VideoCard } from '../../componentes/cards/VideoCard';
import { VideoPlayerModal } from '../../componentes/modal/shared/VideoPlayerModal';
import { useInduction } from '../../hooks/use-induction-store';

const CATEGORIES = ['Todos', 'Tutorial', 'Reciclaje', 'Eco-Tips', 'Premios'];

export const InductionScreen = ({ navigation, onOpenDrawer, userAvatar, userName }) => {
    const [selectedCategory, setSelectedCategory] = useState('Todos');
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [completedVideos, setCompletedVideos] = useState(new Set());
    const [likedVideos, setLikedVideos] = useState(new Set());

    // Custom Hook
    const { videos, loading, refetch, registerView } = useInduction();

    useFocusEffect(
        useCallback(() => {
            refetch();
        }, [refetch])
    );

    // Filtrar videos por categoría
    const filteredVideos = selectedCategory === 'Todos'
        ? videos
        : videos.filter(video => video.category === selectedCategory);

    const handleVideoPress = (video) => {
        setSelectedVideo(video);
        setModalVisible(true);
    };

    const handleVideoComplete = (videoId) => {
        if (!completedVideos.has(videoId)) {
            setCompletedVideos(prev => new Set(prev).add(videoId));
            registerView(videoId);
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
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#FFF" />
                        <Text style={styles.loadingText}>Cargando lecciones...</Text>
                    </View>
                ) : (
                    <ScrollView
                        style={styles.scrollView}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
                    >
                        {filteredVideos.length > 0 ? (
                            filteredVideos.map((video) => (
                                <VideoCard
                                    key={video._id}
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
                )}

                {/* Video Player Modal */}
                {selectedVideo && (
                    <VideoPlayerModal
                        visible={modalVisible}
                        video={selectedVideo}
                        onClose={() => {
                            setModalVisible(false);
                            setSelectedVideo(null);
                        }}
                        onVideoComplete={() => handleVideoComplete(selectedVideo._id)}
                        onLike={() => handleLike(selectedVideo._id)}
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: '#FFF',
        marginTop: 10,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 16,
        color: '#EEE',
        textAlign: 'center',
    },
});
