import React, { useState, useCallback, useEffect } from 'react';
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
    const t = useTranslation();
    const theme = useTheme();
    const { colors, dark } = theme;
    const componentStyles = getStyles(theme);

    const { videos, loading, refetch, registerView } = useInduction();
    const { user } = useAuthStore();

    const [selectedCategory, setSelectedCategory] = useState('Todos');
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [completedVideos, setCompletedVideos] = useState(new Set(user?.completedInductions || []));
    const [likedVideos, setLikedVideos] = useState(new Set());

    const CATEGORIES = [
        { id: 'Todos', label: String(t.induction.categories.all || 'Todos') },
        { id: 'Tutorial', label: String(t.induction.categories.tutorial || 'Tutorial') },
        { id: 'Reciclaje', label: String(t.induction.categories.recycling || 'Reciclaje') },
        { id: 'Eco-Tips', label: String(t.induction.categories.tips || 'Tips') },
        { id: 'Premios', label: String(t.induction.categories.rewards || 'Premios') },
    ];

    useFocusEffect(
        useCallback(() => {
            refetch();
        }, [refetch])
    );

    useEffect(() => {
        console.log("=== DEBUG INDUCCIÓN ===");
        console.log("Total videos en store:", videos?.length);
        console.log("Categoría seleccionada:", selectedCategory);
        if (videos && videos.length > 0) {
            console.log("Primer video ej:", videos);
        }
    }, [videos, selectedCategory]);

    useEffect(() => {
        if (user?.completedInductions) {
            setCompletedVideos(new Set(user.completedInductions));
        }
    }, [user?.completedInductions]);

    const handleVideoPress = (video) => {
        setSelectedVideo(video);
        setModalVisible(true);
    };

    const handleVideoComplete = async (videoId) => {
        if (!completedVideos.has(videoId)) {
            try {
                // 1. Llamamos a la función que actualiza vistas y da puntos en el back
                await registerView(videoId);

                // 2. Actualizamos el check visual en la lista
                setCompletedVideos(prev => new Set(prev).add(videoId));

                // 3. Refrescamos el perfil del usuario para que vea sus nuevos puntos en el Home
                if (startRefreshingUser) await startRefreshingUser();

                console.log("¡Puntos reclamados y vistas actualizadas!");
            } catch (error) {
                console.error("Error al procesar finalización de video:", error);
            }
        }
    };

    const handleLike = (videoId) => {
        if (!likedVideos.has(videoId)) {
            setLikedVideos(prev => new Set(prev).add(videoId));
        }
    };

    const filteredVideos = (videos || []).filter(video => {
        if (selectedCategory === 'Todos') return true;
        const videoCatName = typeof video.category === 'object'
            ? video.category.name
            : video.category;
        return String(videoCatName) === selectedCategory;
    });

    return (
        <SafeAreaView style={componentStyles.safeArea} edges={['left', 'right', 'bottom']}>
            <StatusBar
                barStyle={dark ? "light-content" : "dark-content"}
                backgroundColor={dark ? colors.surface : colors.background}
            />
            <View style={componentStyles.container}>
                <CloudHeader
                    userName={user?.fullName || 'Usuario'}
                    userType={String(t.induction.subtitle || 'Inducción')}
                    avatarUrl={user?.avatar}
                    onMenuPress={onOpenDrawer}
                />

                <View style={componentStyles.filtersSection}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={componentStyles.filtersContainer}>
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
                                ]}>{cat.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {loading ? (
                    <View style={componentStyles.loadingContainer}>
                        <ActivityIndicator size="large" color={colors.primary} />
                        <Text style={[componentStyles.loadingText, { color: colors.onSurfaceVariant }]}>{String(t.induction.loading)}</Text>
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
                                <Text style={[componentStyles.emptyText, { color: colors.onSurfaceVariant }]}>{String(t.induction.empty)}</Text>
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
                        theme={theme}
                    />
                )}
            </View>
        </SafeAreaView>
    );
};

// 🎨 FUNCIÓN DE ESTILOS DINÁMICOS
const getStyles = (theme) => StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: theme.colors.background },
    container: { flex: 1, backgroundColor: theme.colors.background },
    filtersSection: { marginBottom: 12 },
    filtersContainer: { paddingHorizontal: 20, gap: 8 },
    filterChip: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: theme.colors.surface,
        marginRight: 8,
        borderWidth: 1,
        borderColor: theme.colors.outlineVariant,
    },
    filterChipActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
    filterText: { fontSize: 14, fontWeight: '600', color: theme.colors.onSurface },
    filterTextActive: { color: '#FFFFFF' },
    scrollView: { flex: 1 },
    scrollContent: { paddingBottom: 24 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { marginTop: 10, fontSize: 14 },
    emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
    emptyText: { fontSize: 16, textAlign: 'center' },
});