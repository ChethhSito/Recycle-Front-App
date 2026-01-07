import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
  Modal,
  Share
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CloudHeader } from '../../componentes/cards/home/CloudHeader';
import { MemberCard } from '../../componentes/cards/profile/MemberCard';
import {
  Recycle,
  Droplet,
  Trophy,
  User,
  History,
  UserPlus,
  Settings,
  LogOut,
  ChevronRight
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Componente Modal de Confirmación de Cierre de Sesión
const LogoutModal = ({ visible, onClose, onConfirm }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalIconContainer}>
            <LogOut color="#D32F2F" size={40} />
          </View>

          <Text style={styles.modalTitle}>Cerrar Sesión</Text>
          <Text style={styles.modalMessage}>
            ¿Estás seguro que deseas cerrar sesión?
          </Text>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, styles.confirmButton]}
              onPress={onConfirm}
              activeOpacity={0.8}
            >
              <Text style={styles.confirmButtonText}>Cerrar Sesión</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Componente para las estadísticas rápidas
const QuickStat = ({ icon: Icon, value, label, color }) => {
  return (
    <View style={styles.statCard}>
      <View style={[styles.statIconContainer, { backgroundColor: color + '20' }]}>
        <Icon color={color} size={28} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
};

// Componente para las opciones del menú
const MenuOption = ({
  icon: Icon,
  title,
  onPress,
  destructive = false,
  separator = false
}) => {
  return (
    <>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.menuItemLeft}>
          <View style={[
            styles.menuIconContainer,
            destructive && styles.menuIconDestructive
          ]}>
            <Icon
              color={destructive ? '#D32F2F' : '#00926F'}
              size={22}
            />
          </View>
          <Text style={[
            styles.menuItemText,
            destructive && styles.menuItemTextDestructive
          ]}>
            {title}
          </Text>
        </View>
        <ChevronRight color={destructive ? '#D32F2F' : '#999'} size={20} />
      </TouchableOpacity>
      {separator && <View style={styles.separator} />}
    </>
  );
};

export const ProfileScreen = ({ navigation, onOpenDrawer, userAvatar, userName, userPoints = 330 }) => {
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [userData] = useState({
    name: userName || "Usuario",
    userType: "Ciudadano Eco",
    level: "Semilla de Cambio 🌱",
    avatarUrl: userAvatar || "https://i.pravatar.cc/150?img=33",
    progress: 0.66,
    currentPoints: userPoints || 330,
    nextLevelPoints: 500,
    stats: {
      recycled: '45.2kg',
      water: '120L',
      achievements: 12
    }
  });

  const handleMenuPress = () => {
    if (onOpenDrawer) {
      onOpenDrawer();
    }
  };

  const handleLogout = () => {
    setLogoutModalVisible(true);
  };

  const confirmLogout = () => {
    setLogoutModalVisible(false);
    // Lógica de cierre de sesión
    console.log('Logout confirmado');
    // Navegar al Login y resetear la navegación
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const handleInviteFriends = async () => {
    try {
      const message = `🌱 ¡Únete a Nos Planet!

¿Quieres ganar puntos mientras ayudas al medio ambiente? Con Nos Planet puedes:

✅ Reciclar y ganar puntos eco
✅ Canjear premios sostenibles
✅ Ver tu impacto ambiental
✅ Unirte a una comunidad verde

📲 Descarga la app ahora:
https://nosplanet.org/app

¡Juntos por un planeta más limpio! 🌍♻️`;

      await Share.share({
        message: message,
        title: 'Nos Planet - Reciclaje Inteligente',
      });
    } catch (error) {
      console.error('Error al compartir:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#B7ECDC" />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header con nubes */}
        <CloudHeader
          userName={userData.name}
          userType={userData.userType}
          avatarUrl={userData.avatarUrl}
          onMenuPress={handleMenuPress}
        />

        {/* Tarjeta de Membresía / Eco-ID */}
        <MemberCard
          userName={userData.name}
          level={userData.level}
          avatarUrl={userData.avatarUrl}
          progress={userData.progress}
          currentPoints={userData.currentPoints}
          nextLevelPoints={userData.nextLevelPoints}
        />

        {/* Estadísticas Rápidas */}
        <View style={styles.statsContainer}>
          <QuickStat
            icon={Recycle}
            value={userData.stats.recycled}
            label="Reciclado"
            color="#018f64"
          />
          <QuickStat
            icon={Droplet}
            value={userData.stats.water}
            label="Agua Ahorrada"
            color="#00C6A0"
          />
          <QuickStat
            icon={Trophy}
            value={userData.stats.achievements}
            label="Logros"
            color="#FAC96E"
          />
        </View>

        {/* Menú de Opciones */}
        <View style={styles.menuContainer}>
          <MenuOption
            icon={User}
            title="Datos Personales"
            onPress={() => navigation.navigate('PersonalData', {
              userName: userData.name,
              userEmail: 'juan@ecolloy.pe',
              userAvatar: userData.avatarUrl
            })}
          />
          <View style={styles.sectionDivider} />
          <MenuOption
            icon={History}
            title="Historial de Actividad"
            onPress={() => {
              navigation.navigate('History');
            }}
          />

          {/* Separador de sección */}
          <View style={styles.sectionDivider} />

          <MenuOption
            icon={UserPlus}
            title="Invitar Amigos"
            onPress={handleInviteFriends}
          />
          <View style={styles.sectionDivider} />
          <MenuOption
            icon={Settings}
            title="Configuración"
            onPress={() => navigation.navigate('Settings')}
          />

          {/* Separador antes de cerrar sesión */}
          <View style={styles.logoutSeparator} />

          <MenuOption
            icon={LogOut}
            title="Cerrar Sesión"
            onPress={handleLogout}
            destructive={true}
          />
        </View>

        {/* Espaciado inferior */}
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Modal de Confirmación de Cierre de Sesión */}
      <LogoutModal
        visible={logoutModalVisible}
        onClose={() => setLogoutModalVisible(false)}
        onConfirm={confirmLogout}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#018f64',
  },
  scrollView: {
    flex: 1,
  },
  // Estadísticas
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginVertical: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#32243B',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#32243B',
    textAlign: 'center',
  },
  // Menú
  menuContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#B7ECDC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuIconDestructive: {
    backgroundColor: '#FFEBEE',
  },
  menuItemText: {
    fontSize: 16,
    color: '#32243B',
    fontWeight: '500',
  },
  menuItemTextDestructive: {
    color: '#D32F2F',
  },
  separator: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginHorizontal: 12,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',

    marginHorizontal: 12,
  },
  logoutSeparator: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginHorizontal: 12,
  },
  // Modal de Logout
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  modalIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FFEBEE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#32243B',
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
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
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
  },
  confirmButton: {
    backgroundColor: '#D32F2F',
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#32243B',
  },
  confirmButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default ProfileScreen;
