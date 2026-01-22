import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
  StatusBar,
  Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ModernInput } from '../../componentes/cards/inputs/ModernInput';
import { User, Mail, Phone, ArrowLeft, Save } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuthStore } from '../../hooks/use-auth-store';

export const PersonalDataScreen = ({ navigation, route }) => {
  const { user } = useAuthStore();
  const userName = user.fullName;
  const userEmail = user.email;
  const userAvatar = user.avatar;
  const userPhone = user.phone;
  const userDni = user.dni;

  const [formData, setFormData] = useState({
    name: userName,
    email: userEmail,
    phone: userPhone,
    dni: userDni
  });

  const [avatarUri, setAvatarUri] = useState(userAvatar);
  const [isEditing, setIsEditing] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const pickImage = async () => {
    // Pedir permisos
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Se necesita permiso para acceder a la galería de fotos');
      return;
    }

    // Abrir selector de imágenes
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    // Validación básica
    if (!formData.name || !formData.email) {
      Alert.alert('Error', 'Por favor completa todos los campos requeridos');
      return;
    }

    // Mostrar modal de confirmación
    setShowSaveModal(true);
  };

  const confirmSave = () => {
    // Cerrar modal de confirmación
    setShowSaveModal(false);

    // Aquí iría la lógica para guardar en el backend

    // Mostrar modal de éxito
    setShowSuccessModal(true);

    // Cerrar el modal de éxito y salir del modo edición después de 2 segundos
    setTimeout(() => {
      setShowSuccessModal(false);
      setIsEditing(false);
    }, 2000);
  };

  const updateField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor="#00926F" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="chevron-left" size={28} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>Datos Personales</Text>
            <Text style={styles.headerSubtitle}>{isEditing ? 'Modo edición' : 'Ver información'}</Text>
          </View>
          <TouchableOpacity
            onPress={() => setIsEditing(!isEditing)}
            style={styles.headerEditButton}
          >
            <Text style={styles.editButtonText}>
              {isEditing ? 'Cancelar' : 'Editar'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Avatar Section */}
          <View style={styles.avatarSection}>
            <Image
              source={{ uri: avatarUri }}
              style={styles.avatarCircle}
            />
            {isEditing && (
              <TouchableOpacity style={styles.changePhotoButton} onPress={pickImage}>
                <Text style={styles.changePhotoText}>Cambiar Foto</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Formulario */}
          <View style={styles.formContainer}>
            <ModernInput
              label="Nombre Completo"
              value={formData.name}
              onChangeText={(value) => updateField('name', value)}
              placeholder="Ingresa tu nombre completo"
              icon={User}
              editable={isEditing}
            />

            <ModernInput
              label="Correo Electrónico"
              value={formData.email}
              onChangeText={(value) => updateField('email', value)}
              placeholder="tucorreo@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              icon={Mail}
              editable={isEditing}
            />

            <ModernInput
              label="Teléfono"
              value={formData.phone}
              onChangeText={(value) => updateField('phone', value)}
              placeholder="+51 999 999 999"
              keyboardType="phone-pad"
              icon={Phone}
              editable={isEditing}
            />

            <ModernInput
              label="DNI"
              value={formData.dni}
              onChangeText={(value) => updateField('dni', value)}
              placeholder="12345678"
              keyboardType="numeric"
              editable={false}
            />

            {/* Información adicional */}
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                💡 Tu DNI no puede ser modificado. Si necesitas cambiarlo,
                contacta con soporte.
              </Text>
            </View>
          </View>

          {/* Botón de Guardar */}
          {isEditing && (
            <TouchableOpacity
              onPress={handleSave}
              style={styles.saveButtonWrapper}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#00926F', '#00C7A1']}
                style={styles.saveButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Save color="#FFFFFF" size={20} />
                <Text style={styles.saveButtonText}>Guardar Cambios</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}

          {/* Espaciado inferior */}
          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modal de Confirmación */}
      <Modal
        transparent
        visible={showSaveModal}
        animationType="fade"
        onRequestClose={() => setShowSaveModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIcon}>
              <Icon name="help-circle" size={60} color="#00926F" />
            </View>
            <Text style={styles.modalTitle}>¿Guardar cambios?</Text>
            <Text style={styles.modalMessage}>
              ¿Estás seguro de que deseas guardar estos cambios en tu perfil?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowSaveModal(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={confirmSave}
                activeOpacity={0.8}
              >
                <Text style={styles.confirmButtonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de Éxito */}
      <Modal
        transparent
        visible={showSuccessModal}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={[styles.modalIcon, { backgroundColor: '#E8F5E9' }]}>
              <Icon name="check-circle" size={60} color="#00926F" />
            </View>
            <Text style={styles.modalTitle}>¡Éxito!</Text>
            <Text style={styles.modalMessage}>
              Tus datos han sido actualizados correctamente
            </Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B7ECDC',
  },
  keyboardView: {
    flex: 1,
  },
  // Header
  header: {
    backgroundColor: '#00926F',
    paddingHorizontal: 20,
    paddingTop: 44,
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
  headerEditButton: {
    backgroundColor: '#00C49A',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  // Contenido
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  // Avatar
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#eee',
    borderWidth: 4,
    borderColor: '#FFFFFF',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  changePhotoButton: {
    marginTop: 12,
  },
  changePhotoText: {
    fontSize: 14,
    color: '#018f64',
    fontWeight: '600',
  },
  // Formulario
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  infoBox: {
    backgroundColor: '#B7ECDC',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#018f64',
  },
  infoText: {
    fontSize: 13,
    color: '#32243B',
    lineHeight: 20,
  },
  // Botón Guardar
  saveButtonWrapper: {
    marginTop: 24,
    borderRadius: 14,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    gap: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Modales
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '85%',
    maxWidth: 400,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modalIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#B7ECDC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#32243B',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
  },
  confirmButton: {
    backgroundColor: '#00926F',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 15,
    fontWeight: '600',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default PersonalDataScreen;
