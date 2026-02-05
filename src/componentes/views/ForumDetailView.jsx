import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, RefreshControl, ScrollView, Image, TextInput, StatusBar, KeyboardAvoidingView, Platform, Alert, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { ImagePreview } from '../shared/ImagePreview';
import { useForumStore } from '../../hooks/use-forum-store';
import { useAuthStore } from '../../hooks/use-auth-store';


const getTimeAgo = (date) => { /* ... código de timeAgo ... */ return "hace un momento" };

export const ForumDetailView = ({ post, onBack }) => {
  const [comment, setComment] = useState('');
  const [commentImage, setCommentImage] = useState(null);
  const slideAnim = React.useRef(new Animated.Value(300)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const [isSending, setIsSending] = useState(false); // Estado local para UI de carga al enviar
  const { activeComments, startLoadingComments, startSendingComment } = useForumStore();
  const { user } = useAuthStore();
  const [comments, setComments] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await startLoadingComments(post.id); // Espera a que carguen
    setRefreshing(false);
  };

  useEffect(() => {
    // Animación de entrada
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: 0, duration: 400, useNativeDriver: true, easing: Easing.out(Easing.cubic) }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();

    // Cargar datos del backend
    if (post?.id) {
      startLoadingComments(post.id);
    }
  }, [post]);

  const handleBack = () => {
    // ... (tu lógica de animación de salida se mantiene igual)
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: 300, duration: 250, useNativeDriver: true, easing: Easing.in(Easing.cubic) }),
      Animated.timing(fadeAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
    ]).start(({ finished }) => {
      if (finished) onBack();
    });
  };

  const pickImageForComment = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Necesitamos permiso para acceder a tus fotos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setCommentImage(result.assets[0].uri);
    }
  };

  const handleSendComment = async () => {
    if (!comment.trim()) return;

    setIsSending(true);
    // Nota: Por ahora tu backend solo soporta texto. La imagen la mandaremos como null o habría que actualizar el backend para subir fotos.
    const success = await startSendingComment(post.id, comment.trim());

    if (success) {
      setComment('');
      setCommentImage(null);
    }
    setIsSending(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar backgroundColor="#00926F" barStyle="light-content" />
      <Animated.View style={[styles.animatedContainer, { opacity: fadeAnim, transform: [{ translateX: slideAnim }] }]}>
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Icon name="chevron-left" size={28} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.headerInfo}>
              <Text style={styles.headerTitle}>{post?.author || 'Usuario'}</Text>
              <Text style={styles.headerSubtitle}>{post?.time}</Text>
            </View>
            <View style={styles.headerAvatar}>
              <Text style={styles.headerAvatarText}>{post?.authorInitials}</Text>
            </View>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false} refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
            {/* ... (Todo tu bloque de Title Section, Image y Content Box se queda IGUAL) ... */}
            <View style={styles.titleSection}>
              <Text style={styles.title}>{post?.title}</Text>
              <View style={styles.badges}>
                {post?.category && (
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryBadgeText}>{post.category.toUpperCase()}</Text>
                  </View>
                )}
                <View style={styles.likesBadge}>
                  <Icon name="heart" size={16} color="#F96755" />
                  <Text style={styles.likesBadgeText}>{post?.likes}</Text>
                </View>
              </View>
            </View>

            <View style={styles.contentBox}>
              <Text style={styles.contentText}>{post?.fullDescription || post?.description}</Text>
            </View>

            {/* 👇 LISTA DE COMENTARIOS REALES */}
            <View style={styles.commentsSection}>
              <View style={styles.commentsHeader}>
                <Text style={styles.commentsTitle}>Comentarios</Text>
                <Text style={styles.commentsCount}>{activeComments.length} total</Text>
              </View>

              {activeComments.length === 0 ? (
                <Text style={{ textAlign: 'center', color: '#666', marginTop: 20 }}>Sé el primero en comentar</Text>
              ) : (
                activeComments.map((item) => (
                  console.log("nombres ", item),
                  <View key={item._id} style={styles.commentCard}>
                    <View style={styles.commentAvatar}>
                      {/* Si el backend no devuelve iniciales, las calculamos */}
                      <Text style={styles.commentAvatarText}>
                        {item.author.fullName ? item.author.fullName.substring(0, 1).toUpperCase() : 'U'}
                      </Text>
                    </View>
                    <View style={styles.commentContent}>
                      <View style={styles.commentHeader}>
                        <Text style={styles.commentAuthor}>{item.author.fullName}</Text>
                        {/* Asumiendo que usas una función getTimeAgo o la fecha cruda */}
                        <Text style={styles.commentTime}>{item.createdAt ? item.createdAt.substring(0, 10) : ''}</Text>
                      </View>
                      <Text style={styles.commentText}>{item.content}</Text>
                    </View>
                  </View>
                ))
              )}
            </View>

            <View style={styles.bottomSpacer} />
          </ScrollView>

          {/* Input Area */}
          <View style={styles.inputWrapper}>
            {/* ... (Tu preview de imagen igual) ... */}

            <View style={styles.inputContainer}>
              {/* ... (Botón cámara igual) ... */}

              <TextInput
                style={styles.input}
                value={comment}
                onChangeText={setComment}
                placeholder="Escribe una respuesta"
                placeholderTextColor="rgba(50,36,59,0.4)"
                editable={!isSending} // Deshabilitar mientras envía
              />

              <TouchableOpacity
                onPress={handleSendComment}
                disabled={!comment.trim() || isSending}
                style={[
                  styles.sendButton,
                  (!comment.trim() || isSending) && styles.sendButtonDisabled
                ]}
              >
                {isSending ? (
                  <ActivityIndicator color="#FFF" size="small" />
                ) : (
                  <Icon name="send" size={20} color="#FFFFFF" />
                )}
              </TouchableOpacity>
            </View>
          </View>

        </KeyboardAvoidingView>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B7ECDC',
  },
  animatedContainer: {
    flex: 1,
  },
  header: {
    backgroundColor: '#00926F',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#00C49A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerAvatarText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  titleSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#32243B',
    marginBottom: 16,
    lineHeight: 32,
  },
  badges: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  categoryBadge: {
    backgroundColor: '#00C49A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  categoryBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  likesBadge: {
    backgroundColor: '#FFE5E5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  likesBadgeText: {
    color: '#F96755',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  resumeButton: {
    backgroundColor: '#9B51E0',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  resumeButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  imageContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 24,
    backgroundColor: '#F5F5F5',
  },
  contentBox: {
    marginHorizontal: 20,
    backgroundColor: '#00C49A',
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    overflow: 'hidden',
  },
  contentText: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 24,
    zIndex: 10,
  },
  decorativeCircle: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 999,
  },
  decorativeCircle1: {
    width: 96,
    height: 96,
    top: -48,
    right: -48,
  },
  decorativeCircle2: {
    width: 64,
    height: 64,
    bottom: -32,
    left: -32,
  },
  commentsSection: {
    paddingHorizontal: 20,
  },
  commentsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#32243B',
  },
  commentsCount: {
    fontSize: 14,
    color: 'rgba(50,36,59,0.6)',
  },
  commentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#00C49A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  commentAvatarText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#32243B',
    marginRight: 8,
  },
  commentTime: {
    fontSize: 12,
    color: 'rgba(50,36,59,0.5)',
  },
  commentText: {
    fontSize: 14,
    color: '#32243B',
    lineHeight: 20,
  },
  commentImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginTop: 8,
  },
  bottomSpacer: {
    height: 100,
  },
  inputWrapper: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  commentImagePreview: {
    padding: 12,
  },
  inputContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cameraButton: {
    padding: 8,
    marginRight: 12,
  },
  input: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#32243B',
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#00C49A',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  sendButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
});