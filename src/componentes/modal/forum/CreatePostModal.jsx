import React, { useState, useEffect, useRef } from 'react';
import {
  View, StyleSheet, Modal, TouchableOpacity, TextInput,
  ScrollView, Alert, Animated, Easing, Dimensions
} from 'react-native';
import { Text, useTheme } from 'react-native-paper'; // Importar Text de Paper
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { ImagePreview } from '../../shared/ImagePreview';
import { useTranslation } from '../../../hooks/use-translation';

const { height } = Dimensions.get('window');

export const CreatePostModal = ({ visible, onClose, onSubmit }) => {

  const t = useTranslation(); // 🗣️ Hook de traducción
  const theme = useTheme();
  const { colors, dark } = theme;
  const styles = getStyles(theme);

  const [showModal, setShowModal] = useState(visible);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Dudas');
  const [selectedImage, setSelectedImage] = useState(null);
  const slideAnim = React.useRef(new Animated.Value(height)).current;

  const categories = [
    { id: 'Dudas', label: t.forum.categories.doubts },
    { id: 'Proyectos', label: t.forum.categories.projects },
    { id: 'General', label: t.forum.categories.general },
  ];

  useEffect(() => {
    if (visible) {
      setShowModal(true);
      slideAnim.setValue(height);
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        damping: 15,
        mass: 1.2,
        stiffness: 100,
        velocity: 8,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.in(Easing.ease)
      }).start(({ finished }) => {
        if (finished) {
          setShowModal(false);
        }
      });
    }
  }, [visible]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(t.forum.createPost.alerts.permissionTitle, t.forum.createPost.alerts.permissionMsg);
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) setSelectedImage(result.assets[0].uri);
  };

  const handleSubmit = () => {
    if (title.trim() && description.trim()) {
      onSubmit({ title, description, category, image: selectedImage });
      setTitle('');
      setDescription('');
      setCategory('Dudas');
      setSelectedImage(null);
      onClose();
    }
  };

  if (!showModal) return null;

  return (
    <Modal visible={showModal} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose} />

        <Animated.View style={[styles.modalContent, { transform: [{ translateY: slideAnim }] }]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{t.forum.createPost.title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color={colors.onSurface} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Categories */}
            <View style={styles.section}>
              <Text style={styles.label}>{t.forum.createPost.labels.category}</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.categoriesContainer}>
                  {categories.map((cat) => (
                    <TouchableOpacity
                      key={cat.id}
                      onPress={() => setCategory(cat.id)}
                      style={[
                        styles.categoryButton,
                        category === cat.id && styles.categoryButtonActive
                      ]}
                    >
                      <Text style={[
                        styles.categoryText,
                        category === cat.id && styles.categoryTextActive
                      ]}>
                        {cat.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            {/* Title */}
            <View style={styles.section}>
              <Text style={styles.label}>{t.forum.createPost.labels.title}</Text>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder={t.forum.createPost.placeholders.title}
                placeholderTextColor={dark ? "rgba(255,255,255,0.4)" : "rgba(50,36,59,0.4)"}
                textColor={colors.onSurface}
                maxLength={100}
              />
            </View>

            {/* Description */}
            <View style={styles.section}>
              <Text style={styles.label}>{t.forum.createPost.labels.description}</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder={t.forum.createPost.placeholders.description}
                placeholderTextColor={dark ? "rgba(255,255,255,0.4)" : "rgba(50,36,59,0.4)"}
                maxLength={500}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
              <Text style={styles.charCount}>{description.length}/500</Text>
            </View>

            {/* Image Selector */}
            <View style={styles.section}>
              <Text style={styles.label}>{t.forum.createPost.labels.image}</Text>
              {selectedImage ? (
                <ImagePreview imageUri={selectedImage} onRemove={() => setSelectedImage(null)} size="large" />
              ) : (
                <TouchableOpacity style={styles.imageSelector} onPress={pickImage}>
                  <View style={styles.imagePlaceholder}>
                    <Icon name="image-plus" size={32} color={colors.primary} />
                    <Text style={[styles.imagePlaceholderText, { color: colors.primary }]}>
                      {t.forum.createPost.labels.addImage}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={!title.trim() || !description.trim()}
              style={[
                styles.submitButton,
                (!title.trim() || !description.trim()) && styles.submitButtonDisabled
              ]}
            >
              <Text style={styles.submitButtonText}>{t.forum.createPost.buttons.submit}</Text>
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
};

const getStyles = (theme) => StyleSheet.create({
  modalContainer: { flex: 1, justifyContent: 'flex-end' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 40,
    maxHeight: '90%',
    elevation: 5,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: theme.colors.onSurface },
  section: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: theme.colors.onSurface, marginBottom: 8 },
  categoriesContainer: { flexDirection: 'row', paddingBottom: 8 },
  categoryButton: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
    backgroundColor: theme.dark ? theme.colors.surfaceVariant : '#B7ECDC',
    marginRight: 8
  },
  categoryButtonActive: { backgroundColor: theme.colors.primary },
  categoryText: { fontSize: 14, fontWeight: '600', color: theme.colors.onSurfaceVariant },
  categoryTextActive: { color: '#FFFFFF' },
  input: {
    backgroundColor: theme.dark ? theme.colors.surfaceVariant : '#B7ECDC',
    borderRadius: 16, paddingHorizontal: 16, paddingVertical: 12,
    fontSize: 16, color: theme.colors.onSurface,
  },
  textArea: { height: 100, paddingTop: 12 },
  charCount: { fontSize: 12, color: theme.colors.outline, textAlign: 'right', marginTop: 4 },
  imageSelector: { marginTop: 8 },
  imagePlaceholder: {
    borderWidth: 2, borderColor: theme.colors.primary, borderStyle: 'dashed',
    borderRadius: 12, padding: 24, alignItems: 'center'
  },
  imagePlaceholderText: { fontSize: 14, fontWeight: '600', marginTop: 8 },
  submitButton: { backgroundColor: theme.colors.primary, borderRadius: 24, paddingVertical: 16, alignItems: 'center', marginTop: 8 },
  submitButtonDisabled: { backgroundColor: theme.colors.surfaceDisabled },
  submitButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
});