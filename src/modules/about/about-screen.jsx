import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Linking, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Leaf, Heart, Users, Target, Globe, Mail, Sparkles, Award, ExternalLink } from 'lucide-react-native';
import { Text, useTheme } from 'react-native-paper'; // 🚀 Paper
import { CloudHeader } from '../../componentes/cards/home/CloudHeader';
import { ValueCard } from '../../componentes/cards/about/ValueCard';
import { TeamModal } from '../../componentes/modal/profile/TeamModal';
import { useTranslation } from '../../hooks/use-translation'; // 🗣️ Traducción

export const AboutScreen = ({ navigation, onOpenDrawer }) => {
  const t = useTranslation();
  const theme = useTheme();
  const { colors, dark } = theme;
  const componentStyles = getStyles(theme);
  const [teamModalVisible, setTeamModalVisible] = useState(false);

  const openURL = (url) => {
    Linking.openURL(url).catch((err) => console.error('Error:', err));
  };

  // 📋 Valores mapeados con traducción
  const valuesData = [
    { id: 1, icon: Heart, title: t.about.values.transparency.t, description: t.about.values.transparency.d, color: '#EF4444' },
    { id: 2, icon: Users, title: t.about.values.community.t, description: t.about.values.community.d, color: colors.primary },
    { id: 3, icon: Target, title: t.about.values.impact.t, description: t.about.values.impact.d, color: '#FFCB4D' },
    { id: 4, icon: Sparkles, title: t.about.values.innovation.t, description: t.about.values.innovation.d, color: '#3B82F6' },
  ];

  return (
    <SafeAreaView style={componentStyles.container} edges={['left', 'right', 'bottom']}>
      <StatusBar barStyle={dark ? "light-content" : "dark-content"} backgroundColor={colors.greenMain} />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <CloudHeader
          userName={t.about.header.title}
          userType={t.about.header.subtitle}
          avatarUrl="https://i.postimg.cc/CLjQN6LP/image.png"
          onMenuPress={onOpenDrawer}
        />

        {/* Misión */}
        <View style={styles.section}>
          <View style={[styles.missionCard, { backgroundColor: dark ? colors.primaryContainer : '#b1eedc' }]}>
            <View style={[styles.missionIconContainer, { backgroundColor: colors.surface }]}>
              <Leaf color={colors.primary} size={40} />
            </View>
            <Text style={[styles.missionTitle, { color: colors.onPrimaryContainer }]}>{t.about.mission.title}</Text>
            <Text style={[styles.missionText, { color: colors.onSurfaceVariant }]}>{t.about.mission.text}</Text>
            <View style={[styles.missionDivider, { backgroundColor: colors.primary }]} />
            <Text style={[styles.missionSubtext, { color: colors.onSurfaceVariant }]}>{t.about.mission.subtext}</Text>
          </View>
        </View>

        {/* Valores */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>{t.about.values.title}</Text>
          <View style={styles.valuesGrid}>
            {valuesData.map((value) => (
              <ValueCard key={value.id} {...value} theme={theme} />
            ))}
          </View>
        </View>

        {/* Historia */}
        <View style={[styles.historySection, { backgroundColor: dark ? colors.surfaceVariant : '#32243B' }]}>
          <View style={styles.historyContent}>
            <Award color="#FFCB4D" size={40} />
            <Text style={[styles.historyTitle, { color: '#FFF' }]}>{t.about.history.title}</Text>
            <Text style={[styles.historyText, { color: dark ? '#DDD' : '#E0E0E0' }]}>{t.about.history.text}</Text>
            <TouchableOpacity
              style={[styles.teamButton, { backgroundColor: colors.primary }]}
              onPress={() => setTeamModalVisible(true)}
            >
              <Users color="#FFF" size={20} />
              <Text style={[styles.teamButtonText, { color: '#FFF' }]}>{t.about.history.teamBtn}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Contacto */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>{t.about.contact.title}</Text>
          <View style={[styles.contactContainer, { backgroundColor: colors.surface }]}>
            <ContactItem
              icon={Globe} label={t.about.contact.website} value="www.nosplanet.org"
              onPress={() => openURL('https://nosplanet.org')} theme={theme}
            />
            <ContactItem
              icon={Mail} label={t.about.contact.email} value="gerencia@nosplanet.org"
              onPress={() => openURL('mailto:gerencia@nosplanet.org')} theme={theme}
              isLast
            />
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.onSurface }]}>Nos Planét App</Text>
          <Text style={[styles.footerVersion, { color: colors.onSurfaceVariant }]}>Version 1.0.0</Text>
          <Text style={[styles.footerCopyright, { color: colors.onSurfaceVariant }]}>{t.about.footer.copyright}</Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      <TeamModal visible={teamModalVisible} onClose={() => setTeamModalVisible(false)} theme={theme} />
    </SafeAreaView>
  );
};

// --- COMPONENTE AUXILIAR ---
const ContactItem = ({ icon: Icon, label, value, onPress, theme, isLast }) => (
  <TouchableOpacity style={[styles.contactItem, !isLast && { borderBottomColor: theme.colors.outlineVariant }]} onPress={onPress}>
    <View style={[styles.contactIconContainer, { backgroundColor: theme.colors.primaryContainer }]}>
      <Icon color={theme.colors.primary} size={22} />
    </View>
    <View style={styles.contactTextContainer}>
      <Text style={[styles.contactLabel, { color: theme.colors.onSurfaceVariant }]}>{label}</Text>
      <Text style={[styles.contactValue, { color: theme.colors.onSurface }]}>{value}</Text>
    </View>
    <ExternalLink color={theme.colors.outline} size={18} />
  </TouchableOpacity>
);

// 🎨 ESTILOS DINÁMICOS
const getStyles = (theme) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: { backgroundColor: theme.colors.greenMain },
});

// Estilos de Layout
const styles = StyleSheet.create({
  scrollView: { flex: 1 },
  section: { paddingHorizontal: 20, paddingTop: 24 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  missionCard: { borderRadius: 24, padding: 24, alignItems: 'center', elevation: 4, marginTop: -15 },
  missionIconContainer: { width: 70, height: 70, borderRadius: 35, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  missionTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  missionText: { fontSize: 15, lineHeight: 24, textAlign: 'center', marginBottom: 16 },
  missionDivider: { width: 60, height: 3, borderRadius: 2, marginVertical: 12 },
  missionSubtext: { fontSize: 14, lineHeight: 22, textAlign: 'center', fontStyle: 'italic' },
  valuesGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12 },
  historySection: { marginTop: 24, marginHorizontal: 20, borderRadius: 24, padding: 24, elevation: 4 },
  historyContent: { alignItems: 'center' },
  historyTitle: { fontSize: 22, fontWeight: 'bold', marginTop: 16, marginBottom: 12 },
  historyText: { fontSize: 15, lineHeight: 24, textAlign: 'center', marginBottom: 20 },
  teamButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 25, gap: 8 },
  teamButtonText: { fontSize: 16, fontWeight: '600' },
  contactContainer: { borderRadius: 20, padding: 12, elevation: 3 },
  contactItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 12, borderBottomWidth: 1 },
  contactIconContainer: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  contactTextContainer: { flex: 1 },
  contactLabel: { fontSize: 12, marginBottom: 2 },
  contactValue: { fontSize: 15, fontWeight: '500' },
  footer: { alignItems: 'center', paddingTop: 32, paddingBottom: 16 },
  footerText: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  footerVersion: { fontSize: 13, marginBottom: 8 },
  footerCopyright: { fontSize: 11, textAlign: 'center', paddingHorizontal: 20 },
});