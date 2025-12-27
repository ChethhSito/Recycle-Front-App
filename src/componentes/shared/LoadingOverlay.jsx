import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

export const LoadingOverlay = ({ visible, message = 'Cargando...' }) => {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.box}>
        <ActivityIndicator size="large" color="#00926F" />
        <Text style={styles.text}>{message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  box: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    gap: 12,
  },
  text: {
    fontSize: 16,
    color: '#32243B',
    fontWeight: '600',
  },
});
