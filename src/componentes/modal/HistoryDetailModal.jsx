import React, { useEffect, useRef, useState } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
  Easing,
  Text,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { LoadingOverlay } from '../shared/LoadingOverlay';
import { ReceiptCard } from '../cards/ReceiptCard';

const { height, width } = Dimensions.get('window');

export const HistoryDetailModal = ({ visible, onClose, item }) => {
  const [showModal, setShowModal] = React.useState(visible);
  const [isCapturing, setIsCapturing] = useState(false);
  const slideAnim = React.useRef(new Animated.Value(height)).current;
  const viewShotRef = useRef();

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
        easing: Easing.in(Easing.ease),
      }).start(({ finished }) => {
        if (finished) {
          setShowModal(false);
        }
      });
    }
  }, [visible]);

  if (!item || !showModal) return null;

  const isPositive = item.points > 0;

  const handleShare = async () => {
    // Evitar múltiples ejecuciones simultáneas
    if (isCapturing) return;
    
    try {
      setIsCapturing(true);

      // Delay mínimo necesario
      await new Promise(resolve => setTimeout(resolve, 200));

      // Capturar la imagen
      const uri = await viewShotRef.current.capture();
      
      console.log('Imagen capturada:', uri);

      // Verificar si se puede compartir
      const canShare = await Sharing.isAvailableAsync();
      
      if (canShare) {
        await Sharing.shareAsync(uri, {
          mimeType: 'image/png',
          dialogTitle: `¡He ganado ${Math.abs(item.points)} puntos eco! 🌱`,
        });
        console.log('Compartido exitosamente');
      } else {
        Alert.alert('Error', 'La función de compartir no está disponible en este dispositivo.');
      }
      
      setIsCapturing(false);
    } catch (error) {
      setIsCapturing(false);
      console.error('Error al compartir:', error);
      Alert.alert('Error', 'No se pudo compartir. Intenta nuevamente.');
    }
  };

  return (
    <Modal visible={showModal} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <BlurView intensity={20} style={StyleSheet.absoluteFill} />
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          onPress={onClose}
          activeOpacity={1}
        />

        <Animated.View
          style={[styles.modalContent, { transform: [{ translateY: slideAnim }] }]}
        >
          {/* Close Button Outside */}
          {/* Close Button Outside */}
          <TouchableOpacity onPress={onClose} style={styles.closeButtonTop}>
            <Icon name="close-circle" size={32} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Receipt Container - Capturable */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            bounces={true}
            contentContainerStyle={{ paddingBottom: 10 }}
          >
            <ViewShot 
              ref={viewShotRef} 
              options={{ 
                format: 'png', 
                quality: 0.8,
                result: 'tmpfile',
              }}
            >
              <View style={styles.receiptContainer}>
                <ReceiptCard item={item} isPositive={isPositive} />
              </View>
            </ViewShot>
          </ScrollView>

          {/* Share Button - Fixed at bottom */}
          <View style={styles.shareButtonWrapper}>
            <TouchableOpacity 
              style={styles.shareButton} 
              onPress={handleShare}
              disabled={isCapturing}
            >
              <Icon name="share-variant" size={20} color="#FFFFFF" />
              <Text style={styles.shareButtonText}>Compartir</Text>
            </TouchableOpacity>
          </View>

          {/* Loading Overlay */}
          <LoadingOverlay 
            visible={isCapturing} 
            message="Preparando imagen..." 
          />
        </Animated.View>

      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  closeButtonTop: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 100,
  },
  modalContent: {
    backgroundColor: 'transparent',
    maxHeight: height * 0.85,
    width: width * 0.9,
    maxWidth: 400,
  },
  receiptContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
  },
  shareButtonWrapper: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: 'transparent',
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#00926F',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
