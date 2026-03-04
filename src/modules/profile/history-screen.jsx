import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Award,
  Gift,
  Recycle,
  Droplet
} from 'lucide-react-native';
import { Text, useTheme } from 'react-native-paper'; // 🚀 Paper para temas
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { FilterDropdown } from '../../componentes/cards/profile/FilterDropdown';
import { HistoryDetailModal } from '../../componentes/modal/profile/HistoryDetailModal';

// --- COMPONENTE DE ÍTEM ADAPTATIVO ---
const HistoryItem = ({ title, date, points, category, onPress, theme }) => {
  const { colors, dark } = theme;
  const isPositive = points > 0;

  const getIcon = () => {
    switch (category) {
      case 'recycle': return <Recycle color={dark ? colors.primary : "#018f64"} size={20} />;
      case 'water': return <Droplet color="#2196F3" size={20} />;
      case 'achievement': return <Award color="#FAC96E" size={20} />;
      case 'redeem': return <Gift color={colors.error} size={20} />;
      default: return <Recycle color={colors.primary} size={20} />;
    }
  };

  return (
    <TouchableOpacity
      style={[styles.historyItem, { backgroundColor: colors.surface, borderColor: colors.outlineVariant }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[
        styles.iconCircle,
        { backgroundColor: isPositive ? (dark ? 'rgba(76, 175, 80, 0.15)' : '#E8F5E9') : (dark ? 'rgba(211, 47, 47, 0.15)' : '#FFEBEE') }
      ]}>
        {getIcon()}
      </View>

      <View style={styles.itemContent}>
        <Text style={[styles.itemTitle, { color: colors.onSurface }]}>{title}</Text>
        <View style={styles.itemFooter}>
          <Calendar color={colors.onSurfaceVariant} size={14} />
          <Text style={[styles.itemDate, { color: colors.onSurfaceVariant }]}>{date}</Text>
        </View>
      </View>

      <View style={styles.pointsContainer}>
        {isPositive ? (
          <TrendingUp color={dark ? '#81C784' : "#018f64"} size={18} />
        ) : (
          <TrendingDown color={colors.error} size={18} />
        )}
        <Text style={[
          styles.pointsText,
          { color: isPositive ? (dark ? '#81C784' : "#018f64") : colors.error }
        ]}>
          {isPositive ? '+' : ''}{points}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export const HistoryScreen = ({ navigation }) => {
  const theme = useTheme(); // 🎨 Obtenemos el tema dinámico
  const { colors, dark } = theme;
  const componentStyles = getStyles(theme);

  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // ... (Datos de ejemplo y lógica de filtrado se mantienen igual)

  return (
    <SafeAreaView style={componentStyles.container} edges={['left', 'right', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      {/* Header Dinámico */}
      <View style={[componentStyles.header, { backgroundColor: colors.primary }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="chevron-left" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={[styles.headerTitle, { color: '#FFF' }]}>Historial de Actividad</Text>
          <Text style={[styles.headerSubtitle, { color: 'rgba(255,255,255,0.8)' }]}>Tus movimientos eco</Text>
        </View>
        <TouchableOpacity onPress={() => setShowFilterMenu(!showFilterMenu)} style={styles.filterButton}>
          <Icon name="filter-variant" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <FilterDropdown
        visible={showFilterMenu}
        onClose={() => setShowFilterMenu(false)}
        options={filters}
        selectedValue={selectedFilter}
        onSelect={setSelectedFilter}
        title="FILTRAR POR"
        theme={theme}
      />

      {/* Tarjeta de Puntos Totales Adaptable */}
      <View style={componentStyles.totalPointsContainer}>
        <View style={[componentStyles.totalPointsCard, { backgroundColor: colors.surface, borderColor: colors.outlineVariant }]}>
          <View style={[componentStyles.semiCircleRight, { backgroundColor: dark ? colors.primaryContainer : '#B7ECDC' }]}>
            <Text style={[styles.semiCircleText, { color: colors.primary }]}>¡Juntos{'\n'}Salvamos el{'\n'}Planeta!</Text>
            <Icon name="earth" size={28} color={colors.primary} style={{ opacity: 0.5, marginTop: 4, top: 10, right: -15 }} />
          </View>

          <Icon name="leaf" size={32} color={colors.primary} />
          <View style={styles.totalPointsContent}>
            <Text style={[styles.totalPointsLabel, { color: colors.onSurfaceVariant }]}>Mis Puntos Eco</Text>
            <Text style={[styles.totalPointsValue, { color: colors.primary }]}>{totalPoints}</Text>
            <Text style={[styles.totalPointsSubtitle, { color: colors.onSurfaceVariant }]}>Puntos disponibles</Text>
          </View>
        </View>
      </View>

      {/* Resumen de doble columna Dinámico */}
      <View style={styles.summaryContainer}>
        <View style={[componentStyles.summaryCard, { backgroundColor: dark ? colors.surfaceVariant : '#E8F5F1' }]}>
          <View style={[styles.summaryIconContainer, { backgroundColor: dark ? 'rgba(76, 175, 80, 0.2)' : '#B7ECDC' }]}>
            <TrendingUp color={dark ? '#81C784' : "#00926F"} size={24} />
          </View>
          <Text style={[styles.summaryLabel, { color: colors.onSurfaceVariant }]}>Ganados</Text>
          <Text style={[styles.summaryValue, { color: dark ? '#81C784' : "#018f64" }]}>+{totalEarned}</Text>
        </View>

        <View style={[componentStyles.summaryCard, { backgroundColor: dark ? colors.surfaceVariant : '#FFEBEE' }]}>
          <View style={[styles.summaryIconContainer, { backgroundColor: dark ? 'rgba(211, 47, 47, 0.2)' : '#FFCDD2' }]}>
            <TrendingDown color={colors.error} size={24} />
          </View>
          <Text style={[styles.summaryLabel, { color: colors.onSurfaceVariant }]}>Canjeados</Text>
          <Text style={[styles.summaryValue, { color: colors.error }]}>-{totalRedeemed}</Text>
        </View>
      </View>

      <FlatList
        data={filteredData}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <HistoryItem {...item} theme={theme} onPress={() => handleItemPress(item)} />}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.onSurfaceVariant }]}>No hay movimientos para mostrar</Text>
          </View>
        )}
      />

      <HistoryDetailModal
        visible={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        item={selectedItem}
        theme={theme}
      />
    </SafeAreaView>
  );
};

// 🎨 ARQUITECTURA DE ESTILOS BASADA EN EL TEMA
const getStyles = (theme) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: { paddingHorizontal: 20, paddingTop: 44, paddingBottom: 16, flexDirection: 'row', alignItems: 'center' },
  totalPointsContainer: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  totalPointsCard: { borderRadius: 20, padding: 24, flexDirection: 'row', alignItems: 'center', elevation: 4, borderWidth: 1, position: 'relative', overflow: 'hidden' },
  semiCircleRight: { position: 'absolute', right: -100, top: '50%', width: 220, height: 220, borderRadius: 110, opacity: 0.3, transform: [{ translateY: -110 }], justifyContent: 'center', alignItems: 'flex-start', paddingLeft: 20 },
  summaryCard: { flex: 1, borderRadius: 16, padding: 20, alignItems: 'center', elevation: 2 },
});

// Estilos estáticos
const styles = StyleSheet.create({
  backButton: { marginRight: 12 },
  headerInfo: { flex: 1 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  headerSubtitle: { fontSize: 14 },
  filterButton: { padding: 8 },
  semiCircleText: { fontSize: 14, fontWeight: 'bold', textAlign: 'center', opacity: 0.8, lineHeight: 18, top: 15 },
  totalPointsContent: { flex: 1, marginLeft: 16 },
  totalPointsLabel: { fontSize: 13, fontWeight: '500', marginBottom: 2 },
  totalPointsValue: { fontSize: 34, fontWeight: 'bold' },
  totalPointsSubtitle: { fontSize: 11 },
  summaryContainer: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 12, gap: 12 },
  summaryIconContainer: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  summaryLabel: { fontSize: 13, marginBottom: 4 },
  summaryValue: { fontSize: 22, fontWeight: 'bold' },
  listContainer: { padding: 16 },
  historyItem: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, padding: 14, marginBottom: 10, elevation: 1, borderWidth: 0.5 },
  iconCircle: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  itemContent: { flex: 1 },
  itemTitle: { fontSize: 14, fontWeight: '600', marginBottom: 4 },
  itemFooter: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  itemDate: { fontSize: 12 },
  pointsContainer: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  pointsText: { fontSize: 15, fontWeight: 'bold' },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyText: { fontSize: 16 },
});

export default HistoryScreen;