import React, { useState } from 'react';
import {
  View,
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
import { Text, useTheme, ActivityIndicator } from 'react-native-paper'; // 🚀 Paper para temas
import { ModernInput } from '../../componentes/cards/inputs/ModernInput';
import { User, Mail, Phone, Save } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuthStore } from '../../hooks/use-auth-store';

export const PersonalDataScreen = ({ navigation }) => {
  const theme = useTheme(); // 🎨 Obtenemos el tema dinámico
  const { colors, dark } = theme;
  const componentStyles = getStyles(theme);

  const { user } = useAuthStore();

  // 📝 Sincronización con los datos reales del store
  const [formData, setFormData] = useState({
    name: user.fullName || '',
    email: user.email || '',
    phone: user.phone || '',
    dni: user.dni || ''
  });

  const [avatarUri, setAvatarUri] = useState(user.avatarUrl || user.avatar);
  const [isEditing, setIsEditing] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Se necesita permiso para acceder a la galería');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    if (!formData.name || !formData.email) {
      Alert.alert('Error', 'Por favor completa los campos requeridos');
      return;
    }
    setShowSaveModal(true);
  };

  const confirmSave = () => {
    setShowSaveModal(false);
    // 🛠️ Aquí integrarías startUpdatingProfile de tu store
    setShowSuccessModal(true);
    setTimeout(() => {
      setShowSuccessModal(false);
      setIsEditing(false);
    }, 2000);
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <SafeAreaView style={componentStyles.container} edges={['left', 'right', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Header Dinámico */}
        <View style={[componentStyles.header, { backgroundColor: colors.greenMain }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="chevron-left" size={28} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={[styles.headerTitle, { color: '#FFF' }]}>Datos Personales</Text>
            <Text style={[styles.headerSubtitle, { color: 'rgba(255,255,255,0.8)' }]}>
              {isEditing ? 'Modo edición' : 'Ver información'}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setIsEditing(!isEditing)}
            style={[styles.headerEditButton, { backgroundColor: dark ? colors.surfaceVariant : 'rgba(255,255,255,0.2)' }]}
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
          {/* Avatar Section con Borde Dinámico */}
          <View style={styles.avatarSection}>
            <Image
              source={{ uri: avatarUri }}
              style={[styles.avatarCircle, { borderColor: colors.surface, backgroundColor: colors.surfaceVariant }]}
            />
            {isEditing && (
              <TouchableOpacity style={styles.changePhotoButton} onPress={pickImage}>
                <Text style={[styles.changePhotoText, { color: colors.primary }]}>Cambiar Foto</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Formulario Adaptable */}
          <View style={[componentStyles.formContainer, { backgroundColor: colors.surface }]}>
            <ModernInput
              label="Nombre Completo"
              value={formData.name}
              onChangeText={(value) => updateField('name', value)}
              placeholder="Ingresa tu nombre completo"
              icon={User}
              editable={isEditing}
              theme={theme} // 🚨 Pasamos el tema al componente hijo
            />

            <ModernInput
              label="Correo Electrónico"
              value={formData.email}
              onChangeText={(value) => updateField('email', value)}
              placeholder="tucorreo@email.com"
              keyboardType="email-address"
              icon={Mail}
              editable={isEditing}
              theme={theme}
            />

            <ModernInput
              label="Teléfono"
              value={formData.phone}
              onChangeText={(value) => updateField('phone', value)}
              placeholder="+51 999 999 999"
              keyboardType="phone-pad"
              icon={Phone}
              editable={isEditing}
              theme={theme}
            />

            <ModernInput
              label="DNI"
              value={formData.dni}
              placeholder="12345678"
              keyboardType="numeric"
              editable={false} // 💡 DNI bloqueado según tu lógica
              theme={theme}
            />

            <View style={[componentStyles.infoBox, { backgroundColor: dark ? colors.primaryContainer : '#E8F5F1', borderLeftColor: colors.primary }]}>
              <Text style={[styles.infoText, { color: colors.onSurfaceVariant }]}>
                💡 Tu DNI no puede ser modificado. Si necesitas cambiarlo, contacta con soporte.
              </Text>
            </View>
          </View>

          {isEditing && (
            <TouchableOpacity
              onPress={handleSave}
              style={styles.saveButtonWrapper}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={dark ? [colors.primary, colors.primary] : ['#00926F', '#00C7A1']}
                style={styles.saveButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Save color="#FFFFFF" size={20} />
                <Text style={styles.saveButtonText}>Guardar Cambios</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modales de Confirmación y Éxito Dinámicos */}
      <Modal transparent visible={showSaveModal} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={[styles.modalIcon, { backgroundColor: colors.primaryContainer }]}>
              <Icon name="help-circle" size={60} color={colors.primary} />
            </View>
            <Text style={[styles.modalTitle, { color: colors.onSurface }]}>¿Guardar cambios?</Text>
            <Text style={[styles.modalMessage, { color: colors.onSurfaceVariant }]}>
              ¿Estás seguro de que deseas guardar estos cambios en tu perfil?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.surfaceVariant }]}
                onPress={() => setShowSaveModal(false)}
              >
                <Text style={{ color: colors.onSurface }}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.primary }]}
                onPress={confirmSave}
              >
                <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal transparent visible={showSuccessModal} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={[styles.modalIcon, { backgroundColor: dark ? 'rgba(76, 175, 80, 0.2)' : '#E8F5E9' }]}>
              <Icon name="check-circle" size={60} color={dark ? '#81C784' : "#00926F"} />
            </View>
            <Text style={[styles.modalTitle, { color: colors.onSurface }]}>¡Éxito!</Text>
            <Text style={[styles.modalMessage, { color: colors.onSurfaceVariant }]}>
              Tus datos han sido actualizados correctamente
            </Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// 🎨 ARQUITECTURA DE ESTILOS BASADA EN EL TEMA
const getStyles = (theme) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: { paddingHorizontal: 20, paddingTop: 44, paddingBottom: 16, flexDirection: 'row', alignItems: 'center' },
  formContainer: { marginHorizontal: 0, borderRadius: 16, padding: 20, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
  infoBox: { borderRadius: 12, padding: 16, marginTop: 8, borderLeftWidth: 4 },
});

// Estilos estáticos
const styles = StyleSheet.create({
  keyboardView: { flex: 1 },
  backButton: { marginRight: 12 },
  headerInfo: { flex: 1 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  headerSubtitle: { fontSize: 14 },
  headerEditButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  editButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: 'bold' },
  scrollView: { flex: 1 },
  scrollContent: { padding: 20 },
  avatarSection: { alignItems: 'center', marginBottom: 32 },
  avatarCircle: { width: 100, height: 100, borderRadius: 50, borderWidth: 4, elevation: 4 },
  changePhotoButton: { marginTop: 12 },
  changePhotoText: { fontSize: 14, fontWeight: '600' },
  infoText: { fontSize: 13, lineHeight: 20 },
  saveButtonWrapper: { marginTop: 24, borderRadius: 14, overflow: 'hidden', elevation: 4 },
  saveButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, paddingHorizontal: 32, gap: 8 },
  saveButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.6)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { borderRadius: 20, padding: 24, width: '85%', maxWidth: 400, alignItems: 'center', elevation: 8 },
  modalIcon: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' },
  modalMessage: { fontSize: 15, textAlign: 'center', lineHeight: 22, marginBottom: 24 },
  modalButtons: { flexDirection: 'row', gap: 12, width: '100%' },
  modalButton: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
});

export default PersonalDataScreen;