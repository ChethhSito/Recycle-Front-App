import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Modal, Share, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CloudHeader } from '../../componentes/cards/home/CloudHeader';
import { MemberCard } from '../../componentes/cards/profile/MemberCard';
import Svg, { Path } from 'react-native-svg';
import { Recycle, Droplet, Trophy, User, History, UserPlus, Settings, LogOut, ChevronRight, Share2 } from 'lucide-react-native';
import { useAuthStore } from '../../hooks/use-auth-store';

const { width } = Dimensions.get('window');
const CLOUD_HEIGHT = 50;
// PALETA DE COLORES UNIFICADA
const COLORS = {
  primary: '#31253B',
  background: '#018f64',
  lightMint: '#b1eedc', // Tu color de inputs
  white: '#FFFFFF',
  danger: '#D32F2F',
  accentGreen: '#00C7A1'
};

export const ProfileScreen = ({ navigation, onOpenDrawer }) => {
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const { user } = useAuthStore();


  const handleInviteFriends = async () => {
    try {
      const message = `🌱 ¡Únete a Nos Planet! \nRecicla, gana puntos y canjea premios sostenibles. \nhttps://nosplanet.org/app`;
      await Share.share({ message });
    } catch (error) { console.error(error); }
  };

  return (
    <View style={styles.mainWrapper}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 1. HEADER CON FONDO VERDE OSCURO */}

        <CloudHeader
          userName={user?.fullName}
          userType="Ciudadano Eco"
          avatarUrl={user?.avatar}
          onMenuPress={onOpenDrawer}
        />

        <MemberCard
          userName={user?.fullName}
          level={user?.gamification?.currentLevel?.name}
          avatarUrl={user?.avatar}
          progress={user?.gamification?.progress}
          currentPoints={user?.points}
          nextLevelPoints={user?.gamification?.points?.max}
        />

        {/* 2. TARJETA DE MEMBRESÍA (Overlap) */}


        {/* 3. WIDGETS DE ESTADÍSTICAS (Diseño más limpio) */}
        <View style={styles.statsGrid}>
          <QuickStat icon={Recycle} value="45.2" unit="kg" label="Reciclado" color={COLORS.background} />
          <QuickStat icon={Droplet} value="120" unit="L" label="Agua" color="#00C6A0" />
          <QuickStat icon={Trophy} value="12" unit="" label="Logros" color="#FAC96E" />
        </View>

        {/* 4. MENÚ DE OPCIONES (Estilo Apple/Premium) */}
        <View style={styles.menuWrapper}>
          <Text style={styles.menuSectionTitle}>Cuenta y Seguridad</Text>
          <View style={styles.menuGroup}>
            <MenuOption
              icon={User}
              title="Datos Personales"
              onPress={() => navigation.navigate('PersonalData', { userName: user?.fullName, userEmail: user?.email })}
            />
            <View style={styles.innerDivider} />
            <MenuOption icon={History} title="Historial" onPress={() => navigation.navigate('History')} />
          </View>

          <Text style={styles.menuSectionTitle}>Comunidad</Text>
          <View style={styles.menuGroup}>
            <MenuOption icon={Share2} title="Invitar Amigos" onPress={handleInviteFriends} />
            <View style={styles.innerDivider} />
            <MenuOption icon={Settings} title="Configuración" onPress={() => navigation.navigate('Settings')} />
          </View>

          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={() => setLogoutModalVisible(true)}
          >
            <LogOut color={COLORS.danger} size={20} />
            <Text style={styles.logoutText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 50 }} />
      </ScrollView>

      <LogoutModal
        visible={logoutModalVisible}
        onClose={() => setLogoutModalVisible(false)}
        onConfirm={() => navigation.reset({ index: 0, routes: [{ name: 'Login' }] })}
      />
    </View>
  );
};

// COMPONENTES INTERNOS MEJORADOS
const QuickStat = ({ icon: Icon, value, unit, label, color }) => (
  <View style={styles.statBox}>
    <View style={[styles.statIconCircle, { backgroundColor: color + '15' }]}>
      <Icon color={color} size={22} />
    </View>
    <Text style={styles.statValueText}>{value}<Text style={styles.statUnit}> {unit}</Text></Text>
    <Text style={styles.statLabelText}>{label}</Text>
  </View>
);

const MenuOption = ({ icon: Icon, title, onPress }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={styles.menuItemLeft}>
      <View style={styles.menuIconBg}>
        <Icon color={COLORS.primary} size={20} />
      </View>
      <Text style={styles.menuItemTitle}>{title}</Text>
    </View>
    <ChevronRight color="#CCC" size={18} />
  </TouchableOpacity>
);

const LogoutModal = ({ visible, onClose, onConfirm }) => (
  <Modal animationType="fade" transparent visible={visible}>
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <View style={styles.modalAlertCircle}>
          <LogOut color={COLORS.danger} size={32} />
        </View>
        <Text style={styles.modalTitle}>¿Ya te vas?</Text>
        <Text style={styles.modalMsg}>Tu impacto ambiental es muy valioso. ¿Estás seguro de cerrar sesión?</Text>
        <View style={styles.modalBtnsRow}>
          <TouchableOpacity style={styles.btnCancel} onPress={onClose}><Text style={styles.btnCancelText}>Cancelar</Text></TouchableOpacity>
          <TouchableOpacity style={styles.btnConfirm} onPress={onConfirm}><Text style={styles.btnConfirmText}>Cerrar Sesión</Text></TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: '#b1eedc'
  },
  headerBackground: {
    backgroundColor: COLORS.background,
    // Ajustamos el padding para reducir el tamaño

  },
  scrollView: { flex: 1 },

  // Stats Grid - Reducimos el margen vertical para compactar más la pantalla
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    marginVertical: 15 // Reducido de 25 a 15
  },
  statBox: { flex: 1, backgroundColor: COLORS.white, borderRadius: 24, padding: 16, alignItems: 'center', elevation: 4, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
  statIconCircle: { width: 44, height: 44, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  statValueText: { fontSize: 17, fontWeight: 'bold', color: COLORS.primary },
  statUnit: { fontSize: 11, color: '#6B7280' },
  statLabelText: { fontSize: 11, color: '#9CA3AF', marginTop: 2, fontWeight: '600' },

  // Menu
  menuWrapper: { paddingHorizontal: 20 },
  menuSectionTitle: { fontSize: 13, fontWeight: 'bold', color: '#5A7A70', marginBottom: 10, marginLeft: 5, textTransform: 'uppercase' },
  menuGroup: { backgroundColor: COLORS.white, borderRadius: 24, padding: 8, marginBottom: 20, elevation: 2 },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, paddingHorizontal: 12 },
  menuItemLeft: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  menuIconBg: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' },
  menuItemTitle: { fontSize: 15, fontWeight: '600', color: COLORS.primary },
  innerDivider: { height: 1, backgroundColor: '#F9FAFB', marginLeft: 50 },

  // Logout
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 10, borderColor: COLORS.danger, borderWidth: 1, borderRadius: 24 },
  logoutText: { color: COLORS.danger, fontWeight: 'bold', fontSize: 16, },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(49, 37, 59, 0.6)', justifyContent: 'center', alignItems: 'center', padding: 30 },
  modalContent: { backgroundColor: '#FFF', borderRadius: 30, padding: 25, width: '100%', alignItems: 'center' },
  modalAlertCircle: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#FFEBEE', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', color: COLORS.primary, marginBottom: 10 },
  modalMsg: { textAlign: 'center', color: '#6B7280', lineHeight: 22, marginBottom: 25 },
  modalBtnsRow: { flexDirection: 'row', gap: 12 },
  btnCancel: { flex: 1, paddingVertical: 14, alignItems: 'center' },
  btnCancelText: { color: '#9CA3AF', fontWeight: 'bold' },
  btnConfirm: { flex: 2, backgroundColor: COLORS.danger, paddingVertical: 14, borderRadius: 16, alignItems: 'center' },
  btnConfirmText: { color: '#FFF', fontWeight: 'bold' }
});

export default ProfileScreen;