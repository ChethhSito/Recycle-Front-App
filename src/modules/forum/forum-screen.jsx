import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { Text, useTheme } from 'react-native-paper'; // 🚀 Importación de Paper para temas

// Componentes
import { PostCard } from '../../componentes/cards/forum/PostCard';
import { ForumDetailView } from '../../componentes/views/ForumDetailView';
import { CreatePostModal } from '../../componentes/modal/forum/CreatePostModal';
import { DrawerMenu } from '../../componentes/navigation/DrawerMenu';
import { CloudHeader } from '../../componentes/cards/home';

// Hooks
import { useAuthStore } from '../../hooks/use-auth-store';
import { useForumStore } from '../../hooks/use-forum-store';

const getTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return `hace ${Math.floor(interval)} años`;
  interval = seconds / 2592000;
  if (interval > 1) return `hace ${Math.floor(interval)} meses`;
  interval = seconds / 86400;
  if (interval > 1) return `hace ${Math.floor(interval)} días`;
  interval = seconds / 3600;
  if (interval > 1) return `hace ${Math.floor(interval)} horas`;
  interval = seconds / 60;
  if (interval > 1) return `hace ${Math.floor(interval)} min`;
  return "hace un momento";
};

export const ForumScreen = ({ navigation }) => {
  const theme = useTheme(); // 🎨 Obtenemos el tema dinámico
  const { colors, dark } = theme;
  const componentStyles = getStyles(theme);

  const { user } = useAuthStore();
  const { posts, isLoading, startLoadingPosts, startSavingPost, startTogglingLike } = useForumStore();

  const [activeCategory, setActiveCategory] = useState('Todos');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      startLoadingPosts();
    }, [])
  );

  const handleLike = (postId) => {
    startTogglingLike(postId);
  };

  const categories = ['Todos', 'Dudas', 'Proyectos', 'General'];

  const filteredPosts = activeCategory === 'Todos'
    ? posts
    : posts.filter(post => post.category === activeCategory);

  const handleCreatePost = async (newPostData) => {
    const categoryToSend = newPostData.category || 'General';
    const success = await startSavingPost({
      title: newPostData.title,
      content: newPostData.description,
      category: categoryToSend,
    });
    if (success) {
      setShowCreateModal(false);
    }
  };

  if (selectedPost) {
    return (
      <ForumDetailView
        post={selectedPost}
        onBack={() => setSelectedPost(null)}
        theme={theme} // 🚨 Pasamos el tema a la vista de detalle
      />
    );
  }

  return (
    <SafeAreaView style={componentStyles.container} edges={['left', 'right', 'bottom']}>
      {/* Sincronización de la barra de estado */}
      <StatusBar
        barStyle={dark ? "light-content" : "dark-content"}
        backgroundColor={dark ? colors.surface : colors.background}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <CloudHeader
          userName={user?.fullName || 'Usuario'}
          userType="¡Bienvenido al Foro!"
          avatarUrl={user?.avatar} // 📸 Usamos avatarUrl consistente
          onMenuPress={() => setDrawerVisible(true)}
          theme={theme}
        />

        <View style={componentStyles.categoriesContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={componentStyles.categories}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                onPress={() => setActiveCategory(category)}
                style={[
                  componentStyles.categoryButton,
                  activeCategory === category && componentStyles.categoryButtonActive
                ]}
              >
                <Text style={[
                  componentStyles.categoryText,
                  { color: activeCategory === category ? '#FFF' : colors.onSurfaceVariant }
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={componentStyles.content}>
          {/* Banner Adaptable */}
          <View style={[componentStyles.banner, { backgroundColor: dark ? colors.primaryContainer : colors.primary }]}>
            <View style={componentStyles.bannerContent}>
              <View style={componentStyles.bannerHeader}>
                <Text style={[componentStyles.bannerTitle, { color: dark ? colors.onPrimaryContainer : '#FFF' }]}>
                  ¡Hola, {user?.fullName?.split(' ')[0]}!
                </Text>
                <Icon name="leaf" size={20} color={dark ? colors.onPrimaryContainer : '#FFF'} />
              </View>
              <Text style={[componentStyles.bannerDescription, { color: dark ? colors.onPrimaryContainer : '#FFF' }]}>
                Conéctate con tu comunidad y comparte ideas verdes.
              </Text>
            </View>
            <View style={[componentStyles.decorativeCircle, componentStyles.decorativeCircle1]} />
            <View style={[componentStyles.decorativeCircle, componentStyles.decorativeCircle2]} />
          </View>

          <View style={componentStyles.postsContainer}>
            {isLoading && posts.length === 0 ? (
              <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
            ) : (
              filteredPosts.map((post) => {
                const postAdapted = {
                  id: post._id,
                  author: post.author?.fullName,
                  authorInitials: post.author?.fullName ? post.author.fullName.substring(0, 2).toUpperCase() : 'US',
                  time: getTimeAgo(post.createdAt),
                  title: post.title,
                  description: post.content,
                  fullDescription: post.content,
                  likes: post.likes ? post.likes.length : 0,
                  comments: post.commentsCount || 0,
                  category: post.category,
                  image: null,
                  isPinned: false,
                  isAdmin: false
                };

                return (
                  <PostCard
                    key={post._id}
                    post={postAdapted}
                    onPress={() => setSelectedPost(postAdapted)}
                    onLikePress={() => handleLike(post._id)}
                    theme={theme} // 🚨 Inyectamos tema en la tarjeta del post
                  />
                );
              })
            )}

            {!isLoading && filteredPosts.length === 0 && (
              <Text style={{ textAlign: 'center', color: colors.onSurfaceVariant, marginTop: 20 }}>
                No hay publicaciones en esta categoría.
              </Text>
            )}
          </View>
        </View>
      </ScrollView>

      {/* FAB Dinámico */}
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
        theme={theme} // 🚨 Sincronización con el modal de creación
      />

      <DrawerMenu
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
      />
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