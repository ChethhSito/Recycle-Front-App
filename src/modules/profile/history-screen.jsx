import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  FlatList,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ArrowLeft, 
  Filter, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  Award,
  Gift,
  Recycle,
  Droplet
} from 'lucide-react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { FilterDropdown } from '../../componentes/cards/profile/FilterDropdown';
import { HistoryDetailModal } from '../../componentes/modal/HistoryDetailModal';

// Componente para cada ítem del historial
const HistoryItem = ({ type, title, date, points, category, onPress }) => {
  const isPositive = points > 0;
  
  const getIcon = () => {
    switch(category) {
      case 'recycle':
        return <Recycle color="#018f64" size={20} />;
      case 'water':
        return <Droplet color="#2196F3" size={20} />;
      case 'achievement':
        return <Award color="#FAC96E" size={20} />;
      case 'redeem':
        return <Gift color="#D32F2F" size={20} />;
      default:
        return <Recycle color="#018f64" size={20} />;
    }
  };

  return (
    <TouchableOpacity style={styles.historyItem} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.iconCircle, { backgroundColor: isPositive ? '#E8F5E9' : '#FFEBEE' }]}>
        {getIcon()}
      </View>
      
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>{title}</Text>
        <View style={styles.itemFooter}>
          <Calendar color="#666" size={14} />
          <Text style={styles.itemDate}>{date}</Text>
        </View>
      </View>

      <View style={styles.pointsContainer}>
        {isPositive ? (
          <TrendingUp color="#018f64" size={18} />
        ) : (
          <TrendingDown color="#D32F2F" size={18} />
        )}
        <Text style={[
          styles.pointsText,
          isPositive ? styles.pointsPositive : styles.pointsNegative
        ]}>
          {isPositive ? '+' : ''}{points}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export const HistoryScreen = ({ navigation }) => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Datos de ejemplo
  const historyData = [
    {
      id: '1',
      type: 'earned',
      title: 'Reciclaje de plástico',
      date: '15 Dic, 2024',
      points: 50,
      category: 'recycle'
    },
    {
      id: '2',
      type: 'earned',
      title: 'Ahorro de agua registrado',
      date: '14 Dic, 2024',
      points: 30,
      category: 'water'
    },
    {
      id: '3',
      type: 'redeemed',
      title: 'Canje: Cupón descuento',
      date: '12 Dic, 2024',
      points: -100,
      category: 'redeem'
    },
    {
      id: '4',
      type: 'earned',
      title: 'Logro desbloqueado: Eco Warrior',
      date: '10 Dic, 2024',
      points: 150,
      category: 'achievement'
    },
    {
      id: '5',
      type: 'earned',
      title: 'Reciclaje de papel',
      date: '8 Dic, 2024',
      points: 40,
      category: 'recycle'
    },
    {
      id: '6',
      type: 'redeemed',
      title: 'Canje: Producto ecológico',
      date: '5 Dic, 2024',
      points: -200,
      category: 'redeem'
    },
    {
      id: '7',
      type: 'earned',
      title: 'Reciclaje de vidrio',
      date: '3 Dic, 2024',
      points: 60,
      category: 'recycle'
    },
  ];

  const filters = [
    { id: 'all', label: 'Todos' },
    { id: 'today', label: 'Hoy' },
    { id: 'week', label: 'Últimos 7 días' },
    { id: 'twoWeeks', label: 'Últimos 15 días' },
    { id: 'earned', label: 'Ganados' },
    { id: 'redeemed', label: 'Canjes' },
  ];

  const filteredData = selectedFilter === 'all' 
    ? historyData 
    : selectedFilter === 'earned' || selectedFilter === 'redeemed'
    ? historyData.filter(item => 
        selectedFilter === 'earned' ? item.type === 'earned' : item.type === 'redeemed'
      )
    : historyData; // Para filtros de fecha, aquí irían las funciones de filtrado por fecha

  // Calcular totales
  const totalEarned = historyData
    .filter(item => item.points > 0)
    .reduce((sum, item) => sum + item.points, 0);
  
  const totalRedeemed = Math.abs(historyData
    .filter(item => item.points < 0)
    .reduce((sum, item) => sum + item.points, 0));

  // Calcular total de puntos disponibles
  const totalPoints = totalEarned - totalRedeemed;

  const handleItemPress = (item) => {
    setSelectedItem(item);
    setShowDetailModal(true);
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor="#00926F" />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="chevron-left" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Historial de Actividad</Text>
          <Text style={styles.headerSubtitle}>Tus movimientos eco</Text>
        </View>
        <TouchableOpacity 
          onPress={() => setShowFilterMenu(!showFilterMenu)}
          style={styles.filterButton}
        >
          <Icon name="filter-variant" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Dropdown de filtros */}
      <FilterDropdown
        visible={showFilterMenu}
        onClose={() => setShowFilterMenu(false)}
        options={filters}
        selectedValue={selectedFilter}
        onSelect={setSelectedFilter}
        title="FILTRAR POR"
      />

      {/* Total de Puntos Disponibles */}
      <View style={styles.totalPointsContainer}>
        <View style={styles.totalPointsCard}>
          {/* Semicírculo decorativo derecho */}
          <View style={styles.semiCircleRight}>
            <Text style={styles.semiCircleText}>¡Juntos{'\n'}Salvamos{'\n'}el Planeta!</Text>
            <Icon name="earth" size={28} color="#00926E" style={{ opacity: 0.7, marginTop: 4, top: 20, right: -25 }} />
          </View>
          
          <Icon name="leaf" size={32} color="#00926E" />
          <View style={styles.totalPointsContent}>
            <Text style={styles.totalPointsLabel}>Mis Puntos Eco</Text>
            <Text style={styles.totalPointsValue}>{totalPoints}</Text>
            <Text style={styles.totalPointsSubtitle}>Puntos disponibles</Text>
          </View>
        </View>
      </View>

      {/* Resumen de doble columna */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <View style={styles.summaryIconContainer}>
            <TrendingUp color="#00926F" size={24} />
          </View>
          <Text style={styles.summaryLabel}>Ganados</Text>
          <Text style={[styles.summaryValue, styles.summaryValuePositive]}>
            +{totalEarned}
          </Text>
        </View>

        <View style={styles.summaryCard}>
          <View style={[styles.summaryIconContainer, { backgroundColor: '#FFEBEE' }]}>
            <TrendingDown color="#D32F2F" size={24} />
          </View>
          <Text style={styles.summaryLabel}>Canjeados</Text>
          <Text style={[styles.summaryValue, styles.summaryValueNegative]}>
            -{totalRedeemed}
          </Text>
        </View>
      </View>

      {/* Lista de movimientos */}
      <FlatList
        data={filteredData}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <HistoryItem {...item} onPress={() => handleItemPress(item)} />}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay movimientos para mostrar</Text>
          </View>
        )}
      />

      {/* Modal de Detalle */}
      <HistoryDetailModal
        visible={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        item={selectedItem}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7BD0AD',
  },
  // Header
  header: {
    backgroundColor: '#00926F',
    paddingHorizontal: 20,
    paddingTop: 44,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  filterButton: {
    padding: 8,
  },
  // Total de Puntos
  totalPointsContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  totalPointsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#00926F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    borderWidth: 2,
    borderColor: '#B7ECDC',
    position: 'relative',
    overflow: 'hidden',
  },
  semiCircleRight: {
    position: 'absolute',
    right: -120,
    top: '50%',
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: '#B7ECDC',
    opacity: 0.4,
    transform: [{ translateY: -120 }],
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 20,
  },
  semiCircleText: {
    fontSize: 16,
    top: 20,
    fontWeight: 'bold',
    color: '#00926F',
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 20,
  },
  totalPointsContent: {
    flex: 1,
    marginLeft: 16,
  },
  totalPointsLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    marginBottom: 4,
  },
  totalPointsValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#00926F',
    marginBottom: 2,
  },
  totalPointsSubtitle: {
    fontSize: 12,
    color: '#999',
  },
  // Resumen
  summaryContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#d1f9edff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#B7ECDC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  summaryValuePositive: {
    color: '#018f64',
  },
  summaryValueNegative: {
    color: '#D32F2F',
  },
  // Lista
  listContainer: {
    padding: 16,
    paddingTop: 8,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d1f9edff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#32243B',
    marginBottom: 6,
  },
  itemFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  itemDate: {
    fontSize: 13,
    color: '#999',
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pointsText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  pointsPositive: {
    color: '#018f64',
  },
  pointsNegative: {
    color: '#D32F2F',
  },
  // Empty state
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});

export default HistoryScreen;
