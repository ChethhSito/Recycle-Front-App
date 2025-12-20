import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image
} from 'react-native';
import { ModernInput } from '../../componentes/cards/inputs/ModernInput';
import { User, Mail, Phone, ArrowLeft, Save } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

export const PersonalDataScreen = ({ navigation, route }) => {
  const userName = route?.params?.userName || 'Usuario';
  const userEmail = route?.params?.userEmail || 'usuario@email.com';
  const userAvatar = route?.params?.userAvatar || 'https://i.pravatar.cc/150?img=33';
  
  const [formData, setFormData] = useState({
    name: userName,
    email: userEmail,
    phone: '+51 987 654 321',
    dni: '72345678'
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    // Validación básica
    if (!formData.name || !formData.email) {
      Alert.alert('Error', 'Por favor completa todos los campos requeridos');
      return;
    }

    // Aquí iría la lógica para guardar en el backend
    Alert.alert(
      'Éxito',
      'Tus datos han sido actualizados correctamente',
      [
        {
          text: 'OK',
          onPress: () => {
            setIsEditing(false);
            // Opcionalmente navegar hacia atrás
            // navigation.goBack();
          }
        }
      ]
    );
  };

  const updateField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
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
              source={{ uri: userAvatar }}
              style={styles.avatarCircle}
            />
            {isEditing && (
              <TouchableOpacity style={styles.changePhotoButton}>
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
});

export default PersonalDataScreen;
