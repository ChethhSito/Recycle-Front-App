import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

export const ImagePreview = ({ imageUri, onRemove, style, size = 'large' }) => {
  if (!imageUri) return null;

  const sizeStyles = size === 'large' ? styles.imageLarge : styles.imageSmall;

  return (
    <View style={[styles.container, style]}>
      <Image source={{ uri: imageUri }} style={sizeStyles} />
      <TouchableOpacity 
        style={styles.removeButton}
        onPress={onRemove}
        activeOpacity={0.7}
      >
        <Icon name="close-circle" size={size === 'large' ? 28 : 22} color="#F96755" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
  },
  imageLarge: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  imageSmall: {
    width: 80,
    height: 60,
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'white',
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
