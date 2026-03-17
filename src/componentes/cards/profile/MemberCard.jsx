import React from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Award } from 'lucide-react-native';
import { ProgressBar, useTheme } from 'react-native-paper'
import { useTranslation } from '../../../hooks/use-translation';

const { width } = Dimensions.get('window');

export const MemberCard = ({
  userName,
  level,
  avatarUrl = "https://via.placeholder.com/80",
  progress = 0,
  currentPoints = 0,
  nextLevelPoints = 100
}) => {
  const theme = useTheme();
  const { colors } = theme;
  const t = useTranslation();

  // 🛡️ Valores por defecto traducidos
  const displayUser = userName || t.memberCard.defaultUser;
  const displayLevel = level || t.memberCard.defaultLevel;

  return (
    <LinearGradient
      // 🎨 Mantenemos el verde "Recycle", pero podrías usar colors.primary si lo prefieres
      colors={['#00926F', '#007A5C']}
      style={[styles.container, { shadowColor: colors.shadow }]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.content}>
        {/* Avatar y Info */}
        <View style={styles.topRow}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: avatarUrl }}
              style={[styles.avatar, { borderColor: '#FFCB4D' }]} // Oro para el rango
            />
          </View>

          <View style={styles.userInfo}>
            <Text style={styles.userName}>{displayUser}</Text>
            <View style={styles.levelChip}>
              <Text style={styles.levelText}>{displayLevel}</Text>
            </View>
          </View>

          {/* Trofeo */}
          <View style={styles.trophyContainer}>
            <Award color="#FFCB4D" size={36} fill="#FFCB4D" />
          </View>
        </View>

        {/* Barra de Progreso */}
        <View style={styles.progressSection}>
          <View style={styles.progressInfo}>
            <Text style={styles.progressLabel}>
              {t.memberCard.progressLabel} {/* 🗣️ Traducido */}
            </Text>
            <Text style={styles.progressPoints}>
              {currentPoints}/{nextLevelPoints} {t.memberCard.pointsUnit}
            </Text>
          </View>
          <ProgressBar
            progress={progress}
            color="#FFCB4D"
            style={styles.progressBar}
          />
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    marginHorizontal: 16,
    marginVertical: 5,
    overflow: 'hidden',
    elevation: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  content: {
    padding: 20,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#eee',
    borderWidth: 3,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF', // Siempre blanco sobre fondo verde
    marginBottom: 8,
  },
  levelChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  levelText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  trophyContainer: {
    padding: 8,
  },
  progressSection: {
    marginTop: 8,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    color: '#FFFFFF',
    fontSize: 13,
    opacity: 0.9,
  },
  progressPoints: {
    color: '#FFCB4D',
    fontSize: 14,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
});