import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Text, useTheme } from 'react-native-paper';
import { CloudHeader } from '../../componentes/cards/home/CloudHeader';
import { VideoCard } from '../../componentes/cards/VideoCard';
import { VideoPlayerModal } from '../../componentes/modal/shared/VideoPlayerModal';
import { useInduction } from '../../hooks/use-induction-store';
import { useAuthStore } from '../../hooks/use-auth-store';
import { useTranslation } from '../../hooks/use-translation'; // 🗣️ Hook de traducción

export const InductionScreen = ({ navigation, onOpenDrawer }) => {
    const t = useTranslation(); // 🗣️ Inicializar traducciones
    const theme = useTheme();
    const { colors, dark } = theme;
    const componentStyles = getStyles(theme);

    // 📋 Categorías dinámicas mapeadas al ID interno del store
    const CATEGORIES = [
        { id: 'Todos', label: t.induction.categories.all },
        { id: 'Tutorial', label: t.induction.categories.tutorial },
        { id: 'Reciclaje', label: t.induction.categories.recycling },
        { id: 'Eco-Tips', label: t.induction.categories.tips },
        { id: 'Premios', label: t.induction.categories.rewards },
    ];

    const [selectedCategory, setSelectedCategory] = useState('Todos');
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [completedVideos, setCompletedVideos] = useState(new Set());
    const [likedVideos, setLikedVideos] = useState(new Set());

    const { videos, loading, refetch, registerView } = useInduction();
    const { user } = useAuthStore();

    useFocusEffect(
        useCallback(() => {
            refetch();
        }, [refetch])
    );

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
        <SafeAreaView style={componentStyles.safeArea} edges={['left', 'right', 'bottom']}>
            <StatusBar
                barStyle={dark ? "light-content" : "dark-content"}
                backgroundColor={dark ? colors.surface : colors.background}
            />

            <View style={componentStyles.container}>
                <CloudHeader
                    userName={user.fullName}
                    userType={t.induction.subtitle}
                    avatarUrl={user.avatar}
                    onMenuPress={onOpenDrawer}
                />

                <View style={componentStyles.filtersSection}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={componentStyles.filtersContainer}
                    >
                        {CATEGORIES.map((cat) => (
                            <TouchableOpacity
                                key={cat.id}
                                style={[
                                    componentStyles.filterChip,
                                    selectedCategory === cat.id && componentStyles.filterChipActive
                                ]}
                                onPress={() => setSelectedCategory(cat.id)}
                            >
                                <Text style={[
                                    componentStyles.filterText,
                                    selectedCategory === cat.id && componentStyles.filterTextActive
                                ]}>
                                    {cat.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {loading ? (
                    <View style={componentStyles.loadingContainer}>
                        <ActivityIndicator size="large" color={colors.primary} />
                        <Text style={[componentStyles.loadingText, { color: colors.onSurfaceVariant }]}>
                            {t.induction.loading}
                        </Text>
                    </View>
                ) : (
                    <ScrollView
                        style={componentStyles.scrollView}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={componentStyles.scrollContent}
                    >
                        {filteredVideos.length > 0 ? (
                            filteredVideos.map((video) => (
                                <VideoCard
                                    key={video._id}
                                    video={video}
                                    onPress={() => handleVideoPress(video)}
                                    isCompleted={completedVideos.has(video._id)}
                                    theme={theme}
                                />
                            ))
                        ) : (
                            <View style={componentStyles.emptyState}>
                                <Text style={[componentStyles.emptyText, { color: colors.onSurfaceVariant }]}>
                                    {t.induction.empty}
                                </Text>
                            </View>
                        )}
                    </ScrollView>
                )}

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
                        theme={theme}
                    />
                )}
            </View>
        </SafeAreaView>
    );
};

// 🎨 FUNCIÓN DE ESTILOS DINÁMICOS
const getStyles = (theme) => StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
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
        backgroundColor: theme.colors.surface, // Cambia de Blanco a Gris oscuro
        marginRight: 8,
        borderWidth: 1,
        borderColor: theme.colors.outlineVariant,
    },
    filterChipActive: {
        backgroundColor: theme.colors.primary, // Verde Nos Planét
        borderColor: theme.colors.primary,
    },
    filterText: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.onSurface,
    },
    filterTextActive: {
        color: '#FFFFFF', // Texto siempre blanco sobre el fondo verde primario
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
        marginTop: 10,
        fontSize: 14,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 16,
        textAlign: 'center',
    },
});