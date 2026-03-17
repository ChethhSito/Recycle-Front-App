import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { X, Code } from 'lucide-react-native';
import { useTranslation } from '../../../hooks/use-translation';

export const TeamModal = ({ visible, onClose }) => {
  const theme = useTheme();
  const { colors } = theme;
  const t = useTranslation();
  const styles = getStyles(theme);
  const teamMembers = [
    { id: 1, name: 'Lina Ruiz', role: t.team.roles.ceo, type: 'leader', avatar: 'https://i.postimg.cc/8zLNLbq6/image.png' },
    { id: 2, name: 'Anthony Gonzales', role: t.team.roles.ops, type: 'leader', avatar: 'https://i.postimg.cc/Y2VHVV7k/image.png' },
    { id: 3, name: 'Juan Huayta', role: t.team.roles.dev, type: 'developer', avatar: 'https://i.postimg.cc/8CBkgbHn/image.png' },
    { id: 4, name: 'Raul Quintana', role: t.team.roles.dev, type: 'developer', avatar: 'https://i.postimg.cc/zfnvXNJb/image.png' },
  ];

  return (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View style={[styles.modalContainer, { backgroundColor: colors.surface }]}>

          {/* Header */}
          <View style={[styles.modalHeader, { borderBottomColor: colors.outlineVariant }]}>
            <Text style={[styles.modalTitle, { color: colors.onSurface }]}>{t.team.title}</Text>
            <TouchableOpacity onPress={onClose} style={[styles.closeButton, { backgroundColor: colors.surfaceVariant }]}>
              <X color={colors.onSurfaceVariant} size={24} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {/* Sección Líderes */}
            <Text style={[styles.teamSectionTitle, { color: colors.primary }]}>{t.team.leadership}</Text>
            {teamMembers.filter(m => m.type === 'leader').map(member => (
              <View key={member.id} style={[styles.teamMemberCard, { backgroundColor: colors.elevation.level1 }]}>
                <Image source={{ uri: member.avatar }} style={styles.avatar} />
                <View style={styles.memberInfo}>
                  <Text style={[styles.memberName, { color: colors.onSurface }]}>{member.name}</Text>
                  <Text style={[styles.memberRole, { color: colors.onSurfaceVariant }]}>{member.role}</Text>
                </View>
              </View>
            ))}

            {/* Sección Desarrolladores */}
            <Text style={[styles.teamSectionTitle, { color: colors.primary, marginTop: 24 }]}>{t.team.devTeam}</Text>
            {teamMembers.filter(m => m.type === 'developer').map(member => (
              <View key={member.id} style={[styles.teamMemberCard, { backgroundColor: colors.elevation.level1 }]}>
                <View style={styles.avatarContainer}>
                  <Image source={{ uri: member.avatar }} style={styles.avatar} />
                  <View style={[styles.developerBadge, { backgroundColor: colors.secondary, borderColor: colors.surface }]}>
                    <Code color="#FFFFFF" size={12} />
                  </View>
                </View>
                <View style={styles.memberInfo}>
                  <Text style={[styles.memberName, { color: colors.onSurface }]}>{member.name}</Text>
                  <Text style={[styles.memberRole, { color: colors.secondary }]}>{member.role}</Text>
                </View>
              </View>
            ))}
            <View style={{ height: 20 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const getStyles = (theme) => StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Un poco más oscuro para resaltar el modal
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    borderRadius: 24,
    width: '100%',
    maxHeight: '85%',
    overflow: 'hidden',
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  closeButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    padding: 20,
  },
  teamSectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 16,
  },
  teamMemberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E0E0E0',
    marginRight: 16,
  },
  developerBadge: {
    position: 'absolute',
    bottom: -2,
    right: 14, // Ajustado por el margen del avatar
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 2,
  },
  memberRole: {
    fontSize: 14,
    fontWeight: '500',
  },
});