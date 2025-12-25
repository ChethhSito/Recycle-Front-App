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
import { X, Code } from 'lucide-react-native';

export const TeamModal = ({ visible, onClose }) => {
  const teamMembers = [
    {
      id: 1,
      name: 'Lina Ruiz',
      role: 'CEO & Fundadora',
      type: 'leader',
      avatar: 'https://i.postimg.cc/8zLNLbq6/image.png',
    },
    {
      id: 2,
      name: 'Anthony Gonzales',
      role: 'Director de Operaciones',
      type: 'leader',
      avatar: 'https://i.postimg.cc/Y2VHVV7k/image.png',
    },
    {
      id: 3,
      name: 'Juan Huayta',
      role: 'Desarrollador',
      type: 'developer',
      avatar: 'https://i.postimg.cc/8CBkgbHn/image.png',
    },
    {
      id: 4,
      name: 'Raul Quintana',
      role: 'Desarrollador',
      type: 'developer',
      avatar: 'https://i.postimg.cc/zfnvXNJb/image.png',
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalBackdrop}>
        <View style={styles.modalContainer}>
          {/* Header del Modal */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Nuestro Equipo</Text>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
              activeOpacity={0.7}
            >
              <X color="#32243B" size={24} />
            </TouchableOpacity>
          </View>

          {/* Lista de miembros */}
          <ScrollView
            style={styles.modalContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Sección Líderes */}
            <Text style={styles.teamSectionTitle}>Liderazgo</Text>
            {teamMembers
              .filter((member) => member.type === 'leader')
              .map((member) => (
                <View key={member.id} style={styles.teamMemberCard}>
                  <View style={styles.avatarContainer}>
                    <Image
                      source={{ uri: member.avatar }}
                      style={styles.avatar}
                    />
                  </View>
                  <View style={styles.memberInfo}>
                    <Text style={styles.memberName}>{member.name}</Text>
                    <Text style={styles.memberRole}>{member.role}</Text>
                  </View>
                </View>
              ))}

            {/* Sección Desarrolladores */}
            <Text style={[styles.teamSectionTitle, { marginTop: 24 }]}>
              Equipo de Desarrollo
            </Text>
            {teamMembers
              .filter((member) => member.type === 'developer')
              .map((member) => (
                <View key={member.id} style={styles.teamMemberCard}>
                  <View style={styles.avatarContainer}>
                    <Image
                      source={{ uri: member.avatar }}
                      style={styles.avatar}
                    />
                    {/* Icono de código para desarrolladores */}
                    <View style={styles.developerBadge}>
                      <Code color="#FFFFFF" size={12} />
                    </View>
                  </View>
                  <View style={styles.memberInfo}>
                    <Text style={styles.memberName}>{member.name}</Text>
                    <Text style={[styles.memberRole, styles.developerRole]}>
                      {member.role}
                    </Text>
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

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    width: '100%',
    maxHeight: '80%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#32243B',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    padding: 20,
  },
  teamSectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  teamMemberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E0E0E0',
  },
  developerBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#32243B',
    marginBottom: 2,
  },
  memberRole: {
    fontSize: 13,
    color: '#666',
  },
  developerRole: {
    color: '#3B82F6',
  },
});
