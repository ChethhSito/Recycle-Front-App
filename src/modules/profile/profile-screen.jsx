import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  SafeAreaView,
  Alert
} from 'react-native';
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

export const ProfileScreen = ({ navigation, onOpenDrawer, userAvatar, userName, userPoints = 1250 }) => {
  const [userData] = useState({
    name: userName || "Usuario",
    userType: "Ciudadano Eco",
    level: "Bosque Verde 🌲",
    avatarUrl: userAvatar || "https://i.pravatar.cc/150?img=33",
    progress: 0.65,
    currentPoints: userPoints || 650,
    nextLevelPoints: 1000,
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
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Cerrar Sesión', 
          style: 'destructive',
          onPress: () => {
            // Lógica de cierre de sesión
            console.log('Logout');
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
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
            onPress={() => console.log('Invite friends')}
          />
          <View style={styles.sectionDivider} />
          <MenuOption
            icon={Settings}
            title="Configuración"
            onPress={() => console.log('Settings')}
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
});

export default ProfileScreen;
