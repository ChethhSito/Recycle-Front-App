import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, ScrollView, Image, Alert, Animated, Easing, Dimensions } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { ImagePreview } from '../../shared/ImagePreview';

const { height } = Dimensions.get('window');

export const CreatePostModal = ({ visible, onClose, onSubmit }) => {
  const [showModal, setShowModal] = useState(visible);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Dudas');
  const [selectedImage, setSelectedImage] = useState(null);
  const slideAnim = React.useRef(new Animated.Value(height)).current;

  const categories = ['Todos', 'Dudas', 'Proyectos', 'Eventos', 'Trueque'];

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
      Alert.alert('Permiso denegado', 'Necesitamos permiso para acceder a tus fotos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleSubmit = () => {
    if (title.trim() && description.trim()) {
      onSubmit({
        title,
        description,
        fullDescription: description,
        category,
        image: selectedImage,
      });
      setTitle('');
      setDescription('');
      setCategory('Dudas');
      setSelectedImage(null);
      onClose();
    }
  };

  if (!showModal) return null;

  return (
    <Modal
      visible={showModal}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={onClose}
        />

        <Animated.View
          style={[
            styles.modalContent,
            { transform: [{ translateY: slideAnim }] }
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Crear Publicación</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color="#32243B" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Categories */}
            <View style={styles.section}>
              <Text style={styles.label}>Categoría</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.categoriesContainer}>
                  {categories.map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      onPress={() => setCategory(cat)}
                      style={[
                        styles.categoryButton,
                        category === cat && styles.categoryButtonActive
                      ]}
                    >
                      <Text style={[
                        styles.categoryText,
                        category === cat && styles.categoryTextActive
                      ]}>
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            {/* Title */}
            <View style={styles.section}>
              <Text style={styles.label}>Título</Text>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="¿Qué quieres compartir?"
                placeholderTextColor="rgba(50,36,59,0.5)"
                maxLength={100}
              />
            </View>

            {/* Description */}
            <View style={styles.section}>
              <Text style={styles.label}>Descripción</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Cuéntanos más detalles..."
                placeholderTextColor="rgba(50,36,59,0.5)"
                maxLength={500}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
              <Text style={styles.charCount}>{description.length}/500</Text>
            </View>

            {/* Image Selector */}
            <View style={styles.section}>
              <Text style={styles.label}>Imagen (opcional)</Text>
              {selectedImage ? (
                <ImagePreview
                  imageUri={selectedImage}
                  onRemove={() => setSelectedImage(null)}
                  size="large"
                />
              ) : (
                <TouchableOpacity style={styles.imageSelector} onPress={pickImage}>
                  <View style={styles.imagePlaceholder}>
                    <Icon name="image-plus" size={32} color="#00926F" />
                    <Text style={styles.imagePlaceholderText}>Agregar imagen</Text>
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
              <Text style={styles.submitButtonText}>Publicar</Text>
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 40,
    maxHeight: '90%',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#32243B',
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#32243B',
    marginBottom: 8,
  },
  categoriesContainer: {
    flexDirection: 'row',
    paddingBottom: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#B7ECDC',
    marginRight: 8,
  },
  categoryButtonActive: {
    backgroundColor: '#00926F',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#32243B',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  input: {
    backgroundColor: '#B7ECDC',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#32243B',
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  charCount: {
    fontSize: 12,
    color: 'rgba(50,36,59,0.5)',
    textAlign: 'right',
    marginTop: 4,
  },
  imageSelector: {
    marginTop: 8,
  },
  imagePlaceholder: {
    borderWidth: 2,
    borderColor: '#00926F',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  imagePlaceholderText: {
    color: '#00926F',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  submitButton: {
    backgroundColor: '#00926F',
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
