import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native'; // 👈 IMPORTANTE

// Componentes
import { PostCard } from '../../componentes/cards/forum/PostCard';
import { ForumDetailView } from '../../componentes/views/ForumDetailView';
import { CreatePostModal } from '../../componentes/modal/forum/CreatePostModal';
import { DrawerMenu } from '../../componentes/navigation/DrawerMenu';
import { CloudHeader } from '../../componentes/cards/home';

// Hooks
import { useAuthStore } from '../../hooks/use-auth-store';
import { useForumStore } from '../../hooks/use-forum-store'; // 👈 TU NUEVO HOOK

// Helper para fechas (puedes moverlo a utils)
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
    // Llamamos al store para que hable con el backend
    startTogglingLike(postId);
  };

  const categories = ['Todos', 'Dudas', 'Proyectos', 'General']; // Asegúrate que coincidan con tu Enum del backend


  const filteredPosts = activeCategory === 'Todos'
    ? posts
    : posts.filter(post => post.category === activeCategory);


  const handleCreatePost = async (newPostData) => {

    // 1. Validar categorías si es necesario
    const categoryToSend = newPostData.category || 'General';

    // 2. Llamar al store (Redux/Zustand/Context)
    const success = await startSavingPost({
      title: newPostData.title,
      content: newPostData.description, // Mapeo clave
      category: categoryToSend,
      // image: newPostData.image // <--- OJO: Solo descomenta si tu backend ya sube imágenes
    });

    // 3. Cerrar el modal si todo salió bien
    if (success) {
      setShowCreateModal(false);
    }
  };


  if (selectedPost) {
    return (
      <ForumDetailView
        post={selectedPost}
        onBack={() => setSelectedPost(null)}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#B7ECDC" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <CloudHeader
          userName={user?.fullName || 'Usuario'}
          userType="¡Bienvenido al Foro!"
          avatarUrl={user?.avatar}
          onMenuPress={() => setDrawerVisible(true)}
        />

        {/* Filtros */}
        <View style={styles.categoriesContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categories}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                onPress={() => setActiveCategory(category)}
                style={[
                  styles.categoryButton,
                  activeCategory === category && styles.categoryButtonActive
                ]}
              >
                <Text style={[
                  styles.categoryText,
                  activeCategory === category && styles.categoryTextActive
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.content}>
          {/* Banner de Bienvenida Estático */}
          <View style={styles.banner}>
            <View style={styles.bannerContent}>
              <View style={styles.bannerHeader}>
                <Text style={styles.bannerTitle}>¡Hola, {user?.fullName?.split(' ')[0]}!</Text>
                <Icon name="leaf" size={20} color="#000" />
              </View>
              <Text style={styles.bannerDescription}>
                Conéctate con tu comunidad y comparte ideas verdes.
              </Text>
            </View>
            <View style={[styles.decorativeCircle, styles.decorativeCircle1]} />
            <View style={[styles.decorativeCircle, styles.decorativeCircle2]} />
          </View>

          {/* 👇 5. LISTA DE POSTS CON DATOS REALES */}
          <View style={styles.postsContainer}>
            {isLoading && posts.length === 0 ? (
              <ActivityIndicator size="large" color="#FFF" style={{ marginTop: 20 }} />
            ) : (
              filteredPosts.map((post) => {
                // ADAPTADOR: Convertimos datos de MongoDB a lo que espera tu UI
                const postAdapted = {
                  id: post._id, // MongoDB usa _id
                  // Seguridad por si author no viene populado
                  author: post.author?.fullName,
                  authorInitials: post.author?.fullName ? post.author.fullName.substring(0, 2).toUpperCase() : 'US',
                  time: getTimeAgo(post.createdAt),
                  title: post.title,
                  description: post.content, // UI usa description, DB usa content
                  fullDescription: post.content,
                  likes: post.likes ? post.likes.length : 0, // Array length
                  comments: post.commentsCount || 0,
                  category: post.category,
                  image: null, // Si tuvieras imágenes en posts, irían aquí
                  // Campos opcionales para evitar errores en UI
                  isPinned: false,
                  isAdmin: false
                };

                return (
                  <PostCard
                    key={post._id}
                    post={postAdapted}
                    onPress={() => setSelectedPost(postAdapted)}
                    onLikePress={() => handleLike(post._id)}
                  />
                );
              })
            )}

            {!isLoading && filteredPosts.length === 0 && (
              <Text style={{ textAlign: 'center', color: '#FFF', marginTop: 20 }}>
                No hay publicaciones en esta categoría.
              </Text>
            )}
          </View>
        </View>
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowCreateModal(true)}
        activeOpacity={0.8}
      >
        <Icon name="plus" size={28} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Create Post Modal */}
      <CreatePostModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreatePost} // <--- Pasamos la función del padre al hijo
      />

      {/* Drawer */}
      <DrawerMenu
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        userName={user?.fullName}
        userEmail={user?.email}
        userPoints={user?.points || 0} // Corregido para leer points directos si aplica
        avatarUrl={user?.avatar}
      />
    </SafeAreaView>
  );
};

// ... Tus estilos se mantienen IGUALES ...
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#b1eedc' },
  categoriesContainer: { paddingHorizontal: 20, paddingTop: 8, backgroundColor: '#b1eedc' },
  categories: { flexDirection: 'row' },
  categoryButton: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, backgroundColor: '#00C7A1', marginRight: 8 },
  categoryButtonActive: { backgroundColor: '#32243B' },
  categoryText: { color: '#000000', fontSize: 14, fontFamily: 'System' }, // Cambié font por System por si acaso
  categoryTextActive: { color: '#FFFFFF' },
  content: { paddingHorizontal: 20, paddingTop: 16, backgroundColor: '#b1eedc' },
  banner: { backgroundColor: '#00C7A1', borderRadius: 24, padding: 20, marginBottom: 16, overflow: 'hidden' },
  bannerContent: { zIndex: 10 },
  bannerHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  bannerTitle: { color: '#000000', fontSize: 20, fontWeight: 'bold', marginRight: 8 },
  bannerDescription: { color: '#000000', fontSize: 14, marginBottom: 16 },
  decorativeCircle: { position: 'absolute', backgroundColor: '#6939393f', borderRadius: 999 },
  decorativeCircle1: { width: 128, height: 128, top: -64, right: -64 },
  decorativeCircle2: { width: 96, height: 96, bottom: -48, right: -48 },
  postsContainer: { paddingBottom: 100 },
  fab: { position: 'absolute', bottom: 20, right: 20, width: 56, height: 56, borderRadius: 28, backgroundColor: '#00C7A1', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8 },
});