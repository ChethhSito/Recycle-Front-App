import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { Text, useTheme } from 'react-native-paper';

// Componentes e Hooks
import { PostCard } from '../../componentes/cards/forum/PostCard';
import { ForumDetailView } from '../../componentes/views/ForumDetailView';
import { CreatePostModal } from '../../componentes/modal/forum/CreatePostModal';
import { DrawerMenu } from '../../componentes/navigation/DrawerMenu';
import { CloudHeader } from '../../componentes/cards/home';
import { useAuthStore } from '../../hooks/use-auth-store';
import { useForumStore } from '../../hooks/use-forum-store';
import { useTranslation } from '../../hooks/use-translation'; // 🗣️ Hook

export const ForumScreen = ({ navigation }) => {
  const t = useTranslation();
  const theme = useTheme();
  const { colors, dark } = theme;
  const componentStyles = getStyles(theme);

  const { user } = useAuthStore();
  const { posts, isLoading, startLoadingPosts, startSavingPost, startTogglingLike } = useForumStore();

  const [activeCategory, setActiveCategory] = useState('Todos');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);


  // 🕒 Función de tiempo adaptada al idioma
  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    const timeT = t.forum.time;

    let interval = seconds / 31536000;
    if (interval > 1) return `${timeT.ago} ${Math.floor(interval)} ${timeT.years}`;
    interval = seconds / 2592000;
    if (interval > 1) return `${timeT.ago} ${Math.floor(interval)} ${timeT.months}`;
    interval = seconds / 86400;
    if (interval > 1) return `${timeT.ago} ${Math.floor(interval)} ${timeT.days}`;
    interval = seconds / 3600;
    if (interval > 1) return `${timeT.ago} ${Math.floor(interval)} ${timeT.hours}`;
    interval = seconds / 60;
    if (interval > 1) return `${timeT.ago} ${Math.floor(interval)} ${timeT.minutes}`;
    return timeT.now;
  };

  const categories = [
    { id: 'Todos', label: t.forum.categories.all },
    { id: 'Dudas', label: t.forum.categories.doubts },
    { id: 'Proyectos', label: t.forum.categories.projects },
    { id: 'General', label: t.forum.categories.general },
  ];

  useFocusEffect(
    useCallback(() => {
      startLoadingPosts();
    }, [])
  );

  const filteredPosts = activeCategory === 'Todos'
    ? posts
    : posts.filter(post => post.category === activeCategory);

  const handleCreatePost = async (newPostData) => {
    const categoryToSend = newPostData.category || 'General';
    const success = await startSavingPost({
      title: newPostData.title,
      description: newPostData.description,
      category: categoryToSend,
      image: newPostData.image, // 📸 ¡Esta es la pieza que faltaba!
    });
    if (success) setShowCreateModal(false);
  };

  if (selectedPost) {
    return (
      <ForumDetailView
        post={selectedPost}
        onBack={() => setSelectedPost(null)}
        theme={theme}
      />
    );
  }

  return (
    <SafeAreaView style={componentStyles.container} edges={['left', 'right', 'bottom']}>
      <StatusBar
        barStyle={dark ? "light-content" : "dark-content"}
        backgroundColor={dark ? colors.surface : colors.background}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <CloudHeader
          userName={user?.fullName || 'Usuario'}
          userType={t.forum.title}
          avatarUrl={user?.avatar}
          onMenuPress={() => setDrawerVisible(true)}
          theme={theme}
        />

        <View style={componentStyles.categoriesContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={componentStyles.categories}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setActiveCategory(cat.id)}
                style={[
                  componentStyles.categoryButton,
                  activeCategory === cat.id && componentStyles.categoryButtonActive
                ]}
              >
                <Text style={[
                  componentStyles.categoryText,
                  { color: activeCategory === cat.id ? '#FFF' : colors.onSurfaceVariant }
                ]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={componentStyles.content}>
          {/* Banner con saludo dinámico */}
          <View style={[componentStyles.banner, { backgroundColor: dark ? colors.primaryContainer : colors.primary }]}>
            <View style={componentStyles.bannerContent}>
              <View style={componentStyles.bannerHeader}>
                <Text style={[componentStyles.bannerTitle, { color: dark ? colors.onPrimaryContainer : '#FFF' }]}>
                  {t.forum.banner.welcome.replace('{{name}}', user?.fullName?.split(' ')[0] || '')}
                </Text>
                <Icon name="leaf" size={20} color={dark ? colors.onPrimaryContainer : '#FFF'} />
              </View>
              <Text style={[componentStyles.bannerDescription, { color: dark ? colors.onPrimaryContainer : '#FFF' }]}>
                {t.forum.banner.description}
              </Text>
            </View>
            <View style={componentStyles.decorativeCircle} />
          </View>

          <View style={componentStyles.postsContainer}>
            {isLoading && posts.length === 0 ? (
              <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
            ) : (
              filteredPosts.map((post) => {
                // 1. Verificamos si el usuario actual está en el array de likes
                const isLiked = post.likes?.includes(user?.uid || user?._id);

                const postAdapted = {
                  ...post,
                  id: post._id,
                  author: post.author?.fullName,
                  time: getTimeAgo(post.createdAt),
                  description: post.content,
                  likes: post.likes ? post.likes.length : 0,
                  isLiked: isLiked, // 🚀 Pasamos el estado del Like
                };

                return (
                  <PostCard
                    key={post._id}
                    post={postAdapted}
                    onPress={() => setSelectedPost(postAdapted)}
                    onLikePress={() => startTogglingLike(post._id)}
                    theme={theme}
                  />
                );
              })
            )}

            {!isLoading && filteredPosts.length === 0 && (
              <Text style={{ textAlign: 'center', color: colors.onSurfaceVariant, marginTop: 20 }}>
                {t.forum.empty}
              </Text>
            )}
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={[componentStyles.fab, { backgroundColor: colors.primary }]}
        onPress={() => setShowCreateModal(true)}
        activeOpacity={0.8}
      >
        <Icon name="plus" size={28} color="#FFFFFF" />
      </TouchableOpacity>

      <CreatePostModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreatePost}
        theme={theme}
      />

      <DrawerMenu visible={drawerVisible} onClose={() => setDrawerVisible(false)} />
    </SafeAreaView>
  );
};

// 🎨 ESTILOS DINÁMICOS BASADOS EN EL TEMA
const getStyles = (theme) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  categoriesContainer: { paddingHorizontal: 20, paddingTop: 8, backgroundColor: theme.colors.background },
  categories: { flexDirection: 'row' },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    marginRight: 8,
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant,
  },
  categoryButtonActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  categoryText: { fontSize: 14, fontWeight: '600' },
  content: { paddingHorizontal: 20, paddingTop: 16, backgroundColor: theme.colors.background },
  banner: { borderRadius: 24, padding: 20, marginBottom: 16, overflow: 'hidden', elevation: 4 },
  bannerContent: { zIndex: 10 },
  bannerHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  bannerTitle: { fontSize: 20, fontWeight: 'bold', marginRight: 8 },
  bannerDescription: { fontSize: 14, opacity: 0.9 },
  decorativeCircle: { position: 'absolute', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 999 },
  decorativeCircle1: { width: 128, height: 128, top: -64, right: -64 },
  decorativeCircle2: { width: 96, height: 96, bottom: -48, right: -48 },
  postsContainer: { paddingBottom: 100 },
  fab: { position: 'absolute', bottom: 20, right: 20, width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
});