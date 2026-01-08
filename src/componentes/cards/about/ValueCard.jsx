import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const ValueCard = ({ icon: Icon, title, description, color }) => {
  return (
    <View style={styles.valueCard}>
      <View style={[styles.valueIconContainer, { backgroundColor: color + '20' }]}>
        <Icon color={color} size={32} />
      </View>
      <Text style={styles.valueTitle}>{title}</Text>
      <Text style={styles.valueDescription}>{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  valueCard: {
    width: '48%',
    backgroundColor: '#b1eedc',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  valueIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  valueTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#32243B',
    marginBottom: 6,
    textAlign: 'center',
  },
  valueDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
    textAlign: 'center',
  },
});
