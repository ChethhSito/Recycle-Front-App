import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Leaf,
  Heart,
  Users,
  Target,
  Globe,
  Mail,
  Sparkles,
  Award,
  ExternalLink
} from 'lucide-react-native';
import { CloudHeader } from '../../componentes/cards/home/CloudHeader';
import { ValueCard } from '../../componentes/cards/about/ValueCard';
import { TeamModal } from '../../componentes/modal/TeamModal';

// ============================================
// COMPONENTE PRINCIPAL: AboutScreen
// ============================================
export const AboutScreen = ({ navigation, onOpenDrawer, userAvatar }) => {
  const [teamModalVisible, setTeamModalVisible] = useState(false);

  const handleMenuPress = () => {
    if (onOpenDrawer) {
      onOpenDrawer();
    }
  };

  const openURL = (url) => {
    Linking.openURL(url).catch((err) =>
      console.error('Error al abrir URL:', err)
    );
  };

  const valuesData = [
    {
      id: 1,
      icon: Heart,
      title: 'Transparencia',
      description: 'Operamos con honestidad y claridad en cada acción',
      color: '#EF4444',
    },
    {
      id: 2,
      icon: Users,
      title: 'Comunidad',
      description: 'Construimos juntos un futuro sostenible',
      color: '#00926F',
    },
    {
      id: 3,
      icon: Target,
      title: 'Impacto Real',
      description: 'Medimos y maximizamos nuestro impacto ambiental',
      color: '#FFCB4D',
    },
    {
      id: 4,
      icon: Sparkles,
      title: 'Innovación',
      description: 'Desarrollamos soluciones creativas y tecnológicas',
      color: '#3B82F6',
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header con nubes */}
        <CloudHeader
          userName="Acerca de Nosotros"
          userType="Conoce más sobre Nos Planet"
          avatarUrl="https://i.postimg.cc/CLjQN6LP/image.png"
          onMenuPress={handleMenuPress}
        />

        {/* Sección: Misión */}
        <View style={styles.section}>
          <View style={styles.missionCard}>
            <View style={styles.missionIconContainer}>
              <Leaf color="#00926F" size={48} />
            </View>
            <Text style={styles.missionTitle}>Nuestra Misión</Text>
            <Text style={styles.missionText}>
              Transformar la gestión de residuos en una experiencia simple,
              accesible y gratificante para todos los ciudadanos, promoviendo
              una cultura de reciclaje y sostenibilidad en cada comunidad.
            </Text>
            <View style={styles.missionDivider} />
            <Text style={styles.missionSubtext}>
              Creemos que cada pequeña acción cuenta, y juntos podemos crear un
              impacto positivo significativo en nuestro planeta.
            </Text>
          </View>
        </View>

        {/* Sección: Valores */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nuestros Valores</Text>
          <View style={styles.valuesGrid}>
            {valuesData.map((value) => (
              <ValueCard
                key={value.id}
                icon={value.icon}
                title={value.title}
                description={value.description}
                color={value.color}
              />
            ))}
          </View>
        </View>

        {/* Sección: Historia */}
        <View style={styles.historySection}>
          <View style={styles.historyContent}>
            <Award color="#FFCB4D" size={40} />
            <Text style={styles.historyTitle}>Nuestra Historia</Text>
            <Text style={styles.historyText}>
              Fundada el 3 de noviembre de 2025, Nos Planet nació de la visión de
              emprendedores comprometidos con el medio ambiente y la tecnología.
              Somos una empresa nueva con sede en Lambayeque, dedicada a la
              consultoría de gestión ambiental y desarrollo de soluciones
              tecnológicas para promover la sostenibilidad y el reciclaje inteligente.
            </Text>
            <TouchableOpacity
              style={styles.teamButton}
              onPress={() => setTeamModalVisible(true)}
              activeOpacity={0.8}
            >
              <Users color="#32243B" size={20} />
              <Text style={styles.teamButtonText}>Conoce al Equipo</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Sección: Contacto */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contacto</Text>
          <View style={styles.contactContainer}>
            {/* Web */}
            <TouchableOpacity
              style={styles.contactItem}
              onPress={() => openURL('https://nosplanet.org')}
              activeOpacity={0.7}
            >
              <View style={styles.contactIconContainer}>
                <Globe color="#00926F" size={22} />
              </View>
              <View style={styles.contactTextContainer}>
                <Text style={styles.contactLabel}>Sitio Web</Text>
                <Text style={styles.contactValue}>www.nosplanet.org</Text>
              </View>
              <ExternalLink color="#999" size={18} />
            </TouchableOpacity>

            {/* Email */}
            <TouchableOpacity
              style={styles.contactItem}
              onPress={() => openURL('mailto:gerencia@nosplanet.org')}
              activeOpacity={0.7}
            >
              <View style={styles.contactIconContainer}>
                <Mail color="#00926F" size={22} />
              </View>
              <View style={styles.contactTextContainer}>
                <Text style={styles.contactLabel}>Email</Text>
                <Text style={styles.contactValue}>gerencia@nosplanet.org</Text>
              </View>
              <ExternalLink color="#999" size={18} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer - Versión */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Nos Planet App</Text>
          <Text style={styles.footerVersion}>Versión 1.0.0</Text>
          <Text style={styles.footerCopyright}>
            © 2025 Nos Planet SAC. Todos los derechos reservados.
          </Text>
        </View>

        {/* Espaciado inferior */}
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Modal del Equipo */}
      <TeamModal
        visible={teamModalVisible}
        onClose={() => setTeamModalVisible(false)}
      />
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7CD1AA',
  },
  scrollView: {
    flex: 1,
  },

  // ========== SECCIONES ==========
  section: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#32243B',
    marginBottom: 16,
  },

  // ========== MISIÓN ==========
  missionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  missionIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#B7ECDC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  missionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#32243B',
    marginBottom: 12,
    textAlign: 'center',
  },
  missionText: {
    fontSize: 15,
    color: '#666',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 16,
  },
  missionDivider: {
    width: 60,
    height: 3,
    backgroundColor: '#00926F',
    borderRadius: 2,
    marginVertical: 12,
  },
  missionSubtext: {
    fontSize: 14,
    color: '#999',
    lineHeight: 22,
    textAlign: 'center',
    fontStyle: 'italic',
  },

  // ========== VALORES ==========
  valuesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },

  // ========== HISTORIA ==========
  historySection: {
    marginTop: 24,
    marginHorizontal: 20,
    backgroundColor: '#32243B',
    borderRadius: 24,
    padding: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  historyContent: {
    alignItems: 'center',
  },
  historyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 12,
    textAlign: 'center',
  },
  historyText: {
    fontSize: 15,
    color: '#E0E0E0',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  teamButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFCB4D',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    gap: 8,
  },
  teamButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#32243B',
  },

  // ========== CONTACTO ==========
  contactContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  contactIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#B7ECDC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contactTextContainer: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 15,
    color: '#32243B',
    fontWeight: '500',
  },

  // ========== FOOTER ==========
  footer: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 16,
  },
  footerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#32243B',
    marginBottom: 4,
  },
  footerVersion: {
    fontSize: 13,
    color: '#f1f0f0ff',
    marginBottom: 8,
  },
  footerCopyright: {
    fontSize: 11,
    color: '#ffffffff',
    textAlign: 'center',
  },
});

export default AboutScreen;
