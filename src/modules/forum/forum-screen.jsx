import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, StatusBar, ImageBackground, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { PostCard } from '../../componentes/cards/forum/PostCard';
import { ForumDetailView } from '../../componentes/views/ForumDetailView';
import { CreatePostModal } from '../../componentes/modal/CreatePostModal';
import { DrawerMenu } from '../../componentes/navigation/DrawerMenu';
import {
  CloudHeader,
} from '../../componentes/cards/home';
const { width } = Dimensions.get('window');

export const ForumScreen = ({ navigation, onOpenDrawer, userAvatar, userName }) => {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: 'Administración',
      authorInitials: '⚡',
      time: 'Fijado • hace 10 min',
      title: 'Mantenimiento programado de la App',
      description: 'Estimados vecinos, esta noche realizaremos mejoras en el sistema de reportes.',
      fullDescription: 'Estimados vecinos, esta noche realizaremos mejoras en el sistema de reportes. El servicio podría estar intermitente entre las 23:00 y las 02:00 horas. Pedimos disculpas por las molestias.',
      likes: 85,
      comments: 0,
      isPinned: true,
      isAdmin: true,
      isAlert: true,
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop',
    },
    {
      id: 2,
      author: 'Edson Davila',
      authorInitials: 'ED',
      time: 'hace 2 horas',
      category: 'Proyectos',
      title: 'Propuesta: Huerto urbano en el parque central',
      description: 'Estamos juntando firmas para solicitar al ayuntamiento un espacio para huerto comunitario. Creemos que es vital para la educación ambiental...',
      fullDescription: 'Estamos juntando firmas para solicitar al ayuntamiento un espacio para huerto comunitario. Creemos que es vital para la educación ambiental de los niños y para fomentar el consumo local. ¡Únanse a la iniciativa!',
      likes: 85,
      comments: 2,
      isPinned: false,
      isAdmin: false,
      image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&auto=format&fit=crop',
    },
    {
      id: 3,
      author: 'María R.',
      authorInitials: 'M',
      time: 'hace 5 horas',
      category: 'Dudas',
      title: '¿Dónde reciclar baterías en el centro?',
      description: 'Hola vecina, ¿sabes dónde están las baterías amarillas para poder llevar pilas usadas? Las puntos limpios.',
      fullDescription: 'Hola vecinos, necesito saber dónde puedo llevar baterías usadas en el centro de la ciudad. He visto contenedores amarillos pero no sé si son los correctos. ¿Alguien me puede ayudar?',
      likes: 14,
      comments: 2,
      isPinned: false,
      isAdmin: false,
      image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop',
    },
    {
      id: 4,
      author: 'Raúl Quintana',
      authorInitials: 'RQ',
      time: 'hace 1 día',
      category: 'Dudas',
      title: '¿Alguien sabe cómo funciona el trueque?',
      description: 'Me gustaría cambiar algunos libros por plantas, pero no entiendo bien el sistema de puntos...',
      fullDescription: 'Me gustaría cambiar algunos libros por plantas, pero no entiendo bien el sistema de puntos. ¿Alguien me puede explicar cómo funciona? He acumulado varios puntos reciclando pero no sé cómo usarlos en el trueque.',
      likes: 8,
      comments: 5,
      isPinned: false,
      isAdmin: false,
      image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop',
    },
  ]);

  const categories = ['Todos', 'Dudas', 'Proyectos', 'Eventos', 'Trueque'];

  const filteredPosts = activeCategory === 'Todos'
    ? posts
    : posts.filter(post => post.category === activeCategory);

  const handleCreatePost = (newPost) => {
    const post = {
      id: posts.length + 1,
      author: 'Juan David',
      authorInitials: 'JD',
      time: 'Ahora',
      ...newPost,
      likes: 0,
      comments: 0,
      isPinned: false,
      isAdmin: false,
    };
    setPosts([post, ...posts]);
  };

  // Si hay un post seleccionado, mostrar la vista de detalle
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
        {/* Header con CloudHeader */}
        <CloudHeader
          userName={userName}
          userType="¡Bienvenido al Foro!"
          avatarUrl={userAvatar}
          onMenuPress={() => setDrawerVisible(true)}
        />

        {/* Categories Filter */}
        <View style={styles.categoriesContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categories}
          >
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

        {/* Welcome Banner */}
        <View style={styles.content}>
          <View style={styles.banner}>
            <View style={styles.bannerContent}>
              <View style={styles.bannerHeader}>
                <Text style={styles.bannerTitle}>¡Hola, Juan!</Text>
                <Icon name="leaf" size={20} color="#00000" />
              </View>
              <Text style={styles.bannerDescription}>
                Hay 12 nuevas propuestas en tu zona hoy.
              </Text>
              <TouchableOpacity style={styles.bannerButton}>
                <Text style={styles.bannerButtonText}>Ver Novedades</Text>
              </TouchableOpacity>
            </View>

            {/* Decorative circles */}
            <View style={[styles.decorativeCircle, styles.decorativeCircle1]} />
            <View style={[styles.decorativeCircle, styles.decorativeCircle2]} />
          </View>

          {/* Posts List */}
          <View style={styles.postsContainer}>
            {filteredPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onPress={() => setSelectedPost(post)}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Floating Action Button */}
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
        onSubmit={handleCreatePost}
      />

      {/* Drawer Menu */}
      <DrawerMenu
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        userName={userName || 'Juan David'}
        userEmail="jdavidhuay@gmail.com"
        userPoints="100"
        avatarUrl={userAvatar || 'https://i.pravatar.cc/150?img=33'}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#018f64',
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    backgroundColor: '#018f64',
  },
  categories: {
    flexDirection: 'row',
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#00C7A1',
    marginRight: 8,
  },
  categoryButtonActive: {
    backgroundColor: '#32243B',
  },
  categoryText: {
    color: '#0000',
    fontSize: 14,
    fontFamily: 'InclusiveSans-Regular',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    backgroundColor: '#018f64',
  },
  banner: {
    backgroundColor: '#00C7A1',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    overflow: 'hidden',
  },
  bannerContent: {
    zIndex: 10,
  },
  bannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  bannerTitle: {
    color: '#000000',
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 8,
  },
  bannerDescription: {
    color: '#000000',
    fontSize: 14,
    marginBottom: 16,
  },
  bannerButton: {
    backgroundColor: '#32243B',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  bannerButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'InclusiveSans-Regular',
  },
  decorativeCircle: {
    position: 'absolute',
    backgroundColor: '#6939393f',
    borderRadius: 999,
  },
  decorativeCircle1: {
    width: 128,
    height: 128,
    top: -64,
    right: -64,
  },
  decorativeCircle2: {
    width: 96,
    height: 96,
    bottom: -48,
    right: -48,
  },
  postsContainer: {
    paddingBottom: 100,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#00C7A1',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});