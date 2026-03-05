import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Modal, Share, Dimensions } from 'react-native';
import { Text, useTheme, Divider } from 'react-native-paper';
import { CloudHeader } from '../../componentes/cards/home/CloudHeader';
import { MemberCard } from '../../componentes/cards/profile/MemberCard';
import { Recycle, Droplet, Trophy, User, History, Settings, LogOut, ChevronRight, Share2 } from 'lucide-react-native';
import { useAuthStore } from '../../hooks/use-auth-store';
import { useTranslation } from '../../hooks/use-translation';
import { useLevels } from '../../hooks/use-levels-store';

const { width } = Dimensions.get('window');

export const ProfileScreen = ({ navigation, onOpenDrawer }) => {
  const t = useTranslation(); // 🗣️ Inicializamos traducciones
  const theme = useTheme();
  const { colors, dark } = theme;
  const componentStyles = getStyles(theme);
  const { userLevelStatus, startLoadingUserStatus } = useLevels();
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const { user } = useAuthStore();
  const currentUserPoints = userLevelStatus.points.current;
  const currentUserLevel = userLevelStatus.currentLevel.rank;
  const handleInviteFriends = async () => {
    try {
      await Share.share({ message: t.profile.share.message });
    } catch (error) { console.error(error); }
  };

  return (
    <View style={componentStyles.mainWrapper}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      <ScrollView style={componentStyles.scrollView} showsVerticalScrollIndicator={false}>

        {/* 1. HEADER */}
        <CloudHeader
          userName={user?.fullName}
          userType={t.profile.userType}
          avatarUrl={user?.avatarUrl || user?.avatar}
          onMenuPress={onOpenDrawer}
          theme={theme}
        />

        {/* 2. TARJETA DE MEMBRESÍA */}
        <MemberCard
          userName={user?.fullName}
          level={currentUserLevel}
          avatarUrl={user?.avatarUrl || user?.avatar}
          progress={user?.gamification?.progress || 0}
          currentPoints={currentUserPoints}
          nextLevelPoints={user?.gamification?.points?.max || 1000}
          theme={theme}
        />

        {/* 3. WIDGETS DE ESTADÍSTICAS */}
        <View style={componentStyles.statsGrid}>
          <QuickStat
            icon={Recycle}
            value={user?.recyclingStats?.total_kg || "0.0"}
            unit="kg"
            label={t.profile.stats.recycled}
            color={colors.primary}
            theme={theme}
          />
          <QuickStat
            icon={Droplet}
            value="120"
            unit="L"
            label={t.profile.stats.water}
            color="#00C6A0"
            theme={theme}
          />
          <QuickStat
            icon={Trophy}
            value="12"
            unit=""
            label={t.profile.stats.achievements}
            color="#FAC96E"
            theme={theme}
          />
        </View>

        {/* 4. MENÚ DE OPCIONES */}
        <View style={componentStyles.menuWrapper}>
          <Text style={[componentStyles.menuSectionTitle, { color: colors.onSurfaceVariant }]}>
            {t.profile.sections.security}
          </Text>
          <View style={[componentStyles.menuGroup, { backgroundColor: colors.surface }]}>
            <MenuOption
              icon={User}
              title={t.profile.menu.personalData}
              theme={theme}
              onPress={() => navigation.navigate('PersonalData')}
            />
            <Divider style={{ backgroundColor: colors.outlineVariant, marginLeft: 50 }} />
            <MenuOption
              icon={History}
              title={t.profile.menu.history}
              theme={theme}
              onPress={() => navigation.navigate('History')}
            />
          </View>

          <Text style={[componentStyles.menuSectionTitle, { color: colors.onSurfaceVariant }]}>
            {t.profile.sections.community}
          </Text>
          <View style={[componentStyles.menuGroup, { backgroundColor: colors.surface }]}>
            <MenuOption
              icon={Share2}
              title={t.profile.menu.invite}
              theme={theme}
              onPress={handleInviteFriends}
            />
            <Divider style={{ backgroundColor: colors.outlineVariant, marginLeft: 50 }} />
            <MenuOption
              icon={Settings}
              title={t.profile.menu.settings}
              theme={theme}
              onPress={() => navigation.navigate('Settings')}
            />
          </View>

          <TouchableOpacity
            style={[componentStyles.logoutBtn, { borderColor: colors.error }]}
            onPress={() => setLogoutModalVisible(true)}
          >
            <LogOut color={colors.error} size={20} />
            <Text style={[componentStyles.logoutText, { color: colors.error }]}>{t.profile.menu.logout}</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 50 }} />
      </ScrollView>

      {/* Modal de Logout Traducido */}
      <LogoutModal
        visible={logoutModalVisible}
        onClose={() => setLogoutModalVisible(false)}
        onConfirm={() => navigation.reset({ index: 0, routes: [{ name: 'Login' }] })}
        theme={theme}
        t={t}
      />
    </View>
  );
};

// --- COMPONENTES INTERNOS MEJORADOS ---

const QuickStat = ({ icon: Icon, value, unit, label, color, theme }) => (
  <View style={[styles.statBox, { backgroundColor: theme.colors.surface }]}>
    <View style={[styles.statIconCircle, { backgroundColor: theme.dark ? 'rgba(255,255,255,0.05)' : color + '15' }]}>
      <Icon color={color} size={22} />
    </View>
    <Text style={[styles.statValueText, { color: theme.colors.onSurface }]}>
      {value}<Text style={[styles.statUnit, { color: theme.colors.onSurfaceVariant }]}> {unit}</Text>
    </Text>
    <Text style={[styles.statLabelText, { color: theme.colors.onSurfaceVariant }]}>{label}</Text>
  </View>
);

const MenuOption = ({ icon: Icon, title, onPress, theme }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={styles.menuItemLeft}>
      <View style={[styles.menuIconBg, { backgroundColor: theme.colors.surfaceVariant }]}>
        <Icon color={theme.colors.primary} size={20} />
      </View>
      <Text style={[styles.menuItemTitle, { color: theme.colors.onSurface }]}>{title}</Text>
    </View>
    <ChevronRight color={theme.colors.outline} size={18} />
  </TouchableOpacity>
);

const LogoutModal = ({ visible, onClose, onConfirm, theme, t }) => (
  <Modal animationType="fade" transparent visible={visible}>
    <View style={styles.modalOverlay}>
      <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
        <View style={[styles.modalAlertCircle, { backgroundColor: theme.dark ? 'rgba(211, 47, 47, 0.15)' : '#FFEBEE' }]}>
          <LogOut color={theme.colors.error} size={32} />
        </View>
        <Text style={[styles.modalTitle, { color: theme.colors.onSurface }]}>{t.profile.logoutModal.title}</Text>
        <Text style={[styles.modalMsg, { color: theme.colors.onSurfaceVariant }]}>
          {t.profile.logoutModal.message}
        </Text>
        <View style={styles.modalBtnsRow}>
          <TouchableOpacity style={styles.btnCancel} onPress={onClose}>
            <Text style={[styles.btnCancelText, { color: theme.colors.onSurfaceVariant }]}>{t.profile.logoutModal.cancel}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btnConfirm, { backgroundColor: theme.colors.error }]}
            onPress={onConfirm}
          >
            <Text style={styles.btnConfirmText}>{t.profile.logoutModal.confirm}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

// 🎨 ARQUITECTURA DE ESTILOS BASADA EN EL TEMA
const getStyles = (theme) => StyleSheet.create({
  mainWrapper: { flex: 1, backgroundColor: theme.colors.background },
  scrollView: { flex: 1 },
  statsGrid: { flexDirection: 'row', gap: 12, paddingHorizontal: 20, marginVertical: 15 },
  menuWrapper: { paddingHorizontal: 20 },
  menuSectionTitle: { fontSize: 13, fontWeight: 'bold', marginBottom: 10, marginLeft: 5, textTransform: 'uppercase' },
  menuGroup: { borderRadius: 24, padding: 8, marginBottom: 20, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 12, borderWidth: 1.5, borderRadius: 24, marginTop: 10 },
  logoutText: { fontWeight: 'bold', fontSize: 16 },
});

// Estilos estáticos de Layout
const styles = StyleSheet.create({
  statBox: { flex: 1, borderRadius: 24, padding: 16, alignItems: 'center', elevation: 4, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
  statIconCircle: { width: 44, height: 44, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  statValueText: { fontSize: 17, fontWeight: 'bold' },
  statUnit: { fontSize: 11 },
  statLabelText: { fontSize: 11, marginTop: 2, fontWeight: '600' },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, paddingHorizontal: 12 },
  menuItemLeft: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  menuIconBg: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  menuItemTitle: { fontSize: 15, fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.6)', justifyContent: 'center', alignItems: 'center', padding: 30 },
  modalContent: { borderRadius: 30, padding: 25, width: '100%', alignItems: 'center', elevation: 10 },
  modalAlertCircle: { width: 70, height: 70, borderRadius: 35, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  modalMsg: { textAlign: 'center', lineHeight: 22, marginBottom: 25 },
  modalBtnsRow: { flexDirection: 'row', gap: 12, width: '100%' },
  btnCancel: { flex: 1, paddingVertical: 14, alignItems: 'center' },
  btnCancelText: { fontWeight: 'bold' },
  btnConfirm: { flex: 2, paddingVertical: 14, borderRadius: 16, alignItems: 'center' },
  btnConfirmText: { color: '#FFF', fontWeight: 'bold' }
});

export default ProfileScreen;