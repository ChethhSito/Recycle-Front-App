import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator, RefreshControl, ScrollView, Image, TextInput, StatusBar, KeyboardAvoidingView, Platform, Alert, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { Text, useTheme } from 'react-native-paper'; // 🚀 Paper para temas
import * as ImagePicker from 'expo-image-picker';
import { useForumStore } from '../../hooks/use-forum-store';
import { useAuthStore } from '../../hooks/use-auth-store';
import { useTranslation } from '../../hooks/use-translation'; // 🗣️ Hook de traducción

export const ForumDetailView = ({ post, onBack }) => {
  const t = useTranslation();
  const theme = useTheme();
  const { colors, dark } = theme;
  const componentStyles = getStyles(theme);

  const [comment, setComment] = useState('');
  const [commentImage, setCommentImage] = useState(null);
  const slideAnim = React.useRef(new Animated.Value(300)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const [isSending, setIsSending] = useState(false);
  const { activeComments, startLoadingComments, startSendingComment } = useForumStore();
  const { user } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);

  // 🕒 Lógica de tiempo adaptada (puedes reutilizar la de ForumScreen si es global)
  const getTimeDisplay = (dateString) => {
    if (!dateString) return '';
    return dateString.substring(0, 10); // Simplificado para el ejemplo
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await startLoadingComments(post.id);
    setRefreshing(false);
  };

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: 0, duration: 400, useNativeDriver: true, easing: Easing.out(Easing.cubic) }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();

    if (post?.id) {
      startLoadingComments(post.id);
    }
  }, [post]);

  const handleBack = () => {
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
      Alert.alert(t.forumDetail.alerts.permissionTitle, t.forumDetail.alerts.permissionMsg);
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
    const success = await startSendingComment(post.id, comment.trim());
    if (success) {
      setComment('');
      setCommentImage(null);
    }
    setIsSending(false);
  };

  return (
    <SafeAreaView style={componentStyles.container} edges={['top']}>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
      <Animated.View style={[styles.animatedContainer, { opacity: fadeAnim, transform: [{ translateX: slideAnim }] }]}>
        <KeyboardAvoidingView style={componentStyles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

          {/* Header Sincronizado */}
          <View style={[styles.header, { backgroundColor: colors.greenMain }]}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Icon name="chevron-left" size={28} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.headerInfo}>
              <Text style={styles.headerTitle}>{post?.author || 'Usuario'}</Text>
              <Text style={styles.headerSubtitle}>{post?.time}</Text>
            </View>
            <View style={[styles.headerAvatar, { backgroundColor: colors.primaryContainer }]}>
              <Text style={[styles.headerAvatarText, { color: colors.onPrimaryContainer }]}>
                {post?.avatarUrl}
              </Text>
            </View>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false} refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
          }>

            <View style={styles.titleSection}>
              <Text style={[styles.title, { color: colors.onSurface }]}>{post?.title}</Text>
              <View style={styles.badges}>
                {post?.category && (
                  <View style={[styles.categoryBadge, { backgroundColor: colors.primary }]}>
                    <Text style={styles.categoryBadgeText}>{post.category.toUpperCase()}</Text>
                  </View>
                )}
                <View style={[styles.likesBadge, { backgroundColor: colors.errorContainer }]}>
                  <Icon name="heart" size={16} color={colors.error} />
                  <Text style={[styles.likesBadgeText, { color: colors.error }]}>{post?.likes}</Text>
                </View>
              </View>
            </View>

            <View style={[styles.contentBox, { backgroundColor: colors.primaryContainer }]}>
              <Text style={[styles.contentText, { color: colors.onPrimaryContainer }]}>
                {post?.fullDescription || post?.description}
              </Text>
            </View>

            {/* SECCIÓN DE COMENTARIOS TRADUCIDA */}
            <View style={styles.commentsSection}>
              <View style={styles.commentsHeader}>
                <Text style={[styles.commentsTitle, { color: colors.onSurface }]}>
                  {t.forumDetail.commentsTitle}
                </Text>
                <Text style={[styles.commentsCount, { color: colors.onSurfaceVariant }]}>
                  {activeComments.length} {t.forumDetail.total}
                </Text>
              </View>

              {activeComments.length === 0 ? (
                <Text style={{ textAlign: 'center', color: colors.onSurfaceVariant, marginTop: 20 }}>
                  {t.forumDetail.emptyState}
                </Text>
              ) : (
                activeComments.map((item) => (
                  <View key={item._id} style={[styles.commentCard, { backgroundColor: colors.surface, borderColor: colors.outlineVariant }]}>
                    <View style={[styles.commentAvatar, { backgroundColor: colors.primaryContainer }]}>
                      <Text style={[styles.commentAvatarText, { color: colors.onPrimaryContainer }]}>
                        {item.author.fullName ? item.author.fullName.substring(0, 1).toUpperCase() : 'U'}
                      </Text>
                    </View>
                    <View style={styles.commentContent}>
                      <View style={styles.commentHeader}>
                        <Text style={[styles.commentAuthor, { color: colors.onSurface }]}>{item.author.fullName}</Text>
                        <Text style={[styles.commentTime, { color: colors.onSurfaceVariant }]}>{getTimeDisplay(item.createdAt)}</Text>
                      </View>
                      <Text style={[styles.commentText, { color: colors.onSurfaceVariant }]}>{item.content}</Text>
                    </View>
                  </View>
                ))
              )}
            </View>

            <View style={styles.bottomSpacer} />
          </ScrollView>

          {/* Área de Input Adaptable */}
          <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderTopColor: colors.outlineVariant }]}>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, { backgroundColor: colors.surfaceVariant, color: colors.onSurface }]}
                value={comment}
                onChangeText={setComment}
                placeholder={t.forumDetail.placeholder}
                placeholderTextColor={colors.onSurfaceVariant}
                editable={!isSending}
              />

              <TouchableOpacity
                onPress={handleSendComment}
                disabled={!comment.trim() || isSending}
                style={[
                  styles.sendButton,
                  { backgroundColor: colors.primary },
                  (!comment.trim() || isSending) && { backgroundColor: colors.outline }
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
// 🎨 ESTILOS DINÁMICOS BASADOS EN EL TEMA
const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
});

// Estilos de Layout
const styles = StyleSheet.create({
  animatedContainer: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 16, flexDirection: 'row', alignItems: 'center' },
  backButton: { marginRight: 12 },
  headerInfo: { flex: 1 },
  headerTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
  headerSubtitle: { color: 'rgba(255,255,255,0.8)', fontSize: 14 },
  headerAvatar: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  headerAvatarText: { fontSize: 14, fontWeight: 'bold' },
  content: { flex: 1 },
  titleSection: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, lineHeight: 32 },
  badges: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  categoryBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, marginRight: 8 },
  categoryBadgeText: { color: '#FFFFFF', fontSize: 12, fontWeight: 'bold' },
  likesBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, flexDirection: 'row', alignItems: 'center', marginRight: 8 },
  likesBadgeText: { fontSize: 12, fontWeight: 'bold', marginLeft: 4 },
  contentBox: { marginHorizontal: 20, borderRadius: 24, padding: 24, marginBottom: 24, overflow: 'hidden' },
  contentText: { fontSize: 16, lineHeight: 24, zIndex: 10 },
  commentsSection: { paddingHorizontal: 20 },
  commentsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  commentsTitle: { fontSize: 18, fontWeight: 'bold' },
  commentsCount: { fontSize: 14 },
  commentCard: { borderRadius: 16, padding: 16, marginBottom: 12, flexDirection: 'row', elevation: 1, borderWidth: 1 },
  commentAvatar: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  commentAvatarText: { fontSize: 14, fontWeight: 'bold' },
  commentContent: { flex: 1 },
  commentHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  commentAuthor: { fontSize: 14, fontWeight: 'bold', marginRight: 8 },
  commentTime: { fontSize: 12 },
  commentText: { fontSize: 14, lineHeight: 20 },
  bottomSpacer: { height: 100 },
  inputWrapper: { borderTopWidth: 1 },
  inputContainer: { paddingHorizontal: 20, paddingVertical: 12, flexDirection: 'row', alignItems: 'center' },
  input: { flex: 1, borderRadius: 24, paddingHorizontal: 16, paddingVertical: 12, fontSize: 14 },
  sendButton: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginLeft: 12 },
});