import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { CheckCircle } from 'lucide-react-native';

export const ReceiptCard = ({ item, isPositive }) => {
  const getCategoryName = () => {
    switch (item.category) {
      case 'recycle':
        return 'Reciclaje';
      case 'water':
        return 'Ahorro de Agua';
      case 'achievement':
        return 'Logro';
      case 'redeem':
        return 'Canje';
      default:
        return 'Actividad';
    }
  };

  const getRecyclerName = () => {
    const recyclers = ['Carlos Mendoza', 'Ana Gutiérrez', 'Pedro Ramírez', 'María López'];
    return recyclers[Math.floor(Math.random() * recyclers.length)];
  };

  const getLocationName = () => {
    const locations = [
      'Centro Eco - Plaza Norte',
      'Punto Verde - Av. Los Rosales',
      'EcoHub - Mall del Sur',
      'Reciclaje Central - Miraflores'
    ];
    return locations[Math.floor(Math.random() * locations.length)];
  };

  const getRecycleContent = () => {
    if (item.title.includes('plástico')) {
      return 'Botellas PET (15 unidades), Envases plásticos (8 unidades)';
    } else if (item.title.includes('papel')) {
      return 'Papel bond (2kg), Cartón (1.5kg), Revistas (500g)';
    } else if (item.title.includes('vidrio')) {
      return 'Botellas de vidrio (10 unidades), Frascos (5 unidades)';
    }
    return 'Material reciclable mixto';
  };

  return (
    <View style={styles.container}>
      {/* Header - Ticket Style */}
      <View style={styles.header}>
        <View style={styles.checkCircle}>
          <CheckCircle color="#FFFFFF" size={48} />
        </View>
        <Text style={styles.title}>
          {isPositive ? '¡Puntos Ganados!' : 'Canje Realizado'}
        </Text>
        <Text style={styles.subtitle}>Comprobante de Actividad</Text>
      </View>

      {/* Points Display */}
      <View style={styles.pointsSection}>
        <Text style={[styles.pointsHuge, isPositive ? styles.pointsPositive : styles.pointsNegative]}>
          {isPositive ? '+' : ''}{item.points}
        </Text>
        <Text style={styles.pointsUnit}>PUNTOS ECO</Text>
      </View>

      {/* Divider */}
      <View style={styles.dashedDivider}>
        <View style={styles.leftCircle} />
        <View style={styles.rightCircle} />
      </View>

      {/* Activity Details */}
      <View style={styles.detailsSection}>
        <Text style={styles.sectionTitle}>DETALLES DE LA ACTIVIDAD</Text>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Actividad</Text>
          <Text style={styles.detailValue}>{item.title}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Categoría</Text>
          <Text style={styles.detailValue}>{getCategoryName()}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Fecha y Hora</Text>
          <Text style={styles.detailValue}>{item.date} • 10:30 AM</Text>
        </View>

        {item.category === 'recycle' && (
          <>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Reciclador</Text>
              <Text style={styles.detailValue}>{getRecyclerName()}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Punto de Acopio</Text>
              <Text style={styles.detailValue}>{getLocationName()}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Contenido</Text>
              <Text style={styles.detailValueMultiline}>{getRecycleContent()}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Peso Total</Text>
              <Text style={styles.detailValue}>2.5 kg</Text>
            </View>
          </>
        )}

        {item.category === 'redeem' && (
          <>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Beneficio</Text>
              <Text style={styles.detailValue}>Cupón de descuento 15%</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Código</Text>
              <Text style={styles.detailValue}>ECO-{Math.floor(Math.random() * 10000)}</Text>
            </View>
          </>
        )}

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>ID de Registro</Text>
          <Text style={styles.detailValueSmall}>REG-{item.id}-{Math.floor(Math.random() * 100000)}</Text>
        </View>
      </View>

      {/* Environmental Impact */}
      {isPositive && (
        <View style={styles.impactSection}>
          <Text style={styles.sectionTitle}>TU IMPACTO AMBIENTAL</Text>
          <View style={styles.impactGrid}>
            <View style={styles.impactItem}>
              <Icon name="tree" size={28} color="#018f64" />
              <Text style={styles.impactValue}>0.5</Text>
              <Text style={styles.impactLabel}>Árboles</Text>
            </View>
            <View style={styles.impactItem}>
              <Icon name="water" size={28} color="#2196F3" />
              <Text style={styles.impactValue}>15L</Text>
              <Text style={styles.impactLabel}>Agua</Text>
            </View>
            <View style={styles.impactItem}>
              <Icon name="cloud-outline" size={28} color="#757575" />
              <Text style={styles.impactValue}>2kg</Text>
              <Text style={styles.impactLabel}>CO₂</Text>
            </View>
          </View>
        </View>
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <Icon name="leaf" size={24} color="#018f64" />
        <Text style={styles.footerText}>Nos Planet • Reciclaje Inteligente</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
  },
  // Header
  header: {
    backgroundColor: '#00926F',
    paddingTop: 32,
    paddingBottom: 24,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  checkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  // Points
  pointsSection: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 24,
    alignItems: 'center',
  },
  pointsHuge: {
    fontSize: 56,
    fontWeight: 'bold',
    letterSpacing: -2,
  },
  pointsPositive: {
    color: '#018f64',
  },
  pointsNegative: {
    color: '#D32F2F',
  },
  pointsUnit: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
    letterSpacing: 2,
    marginTop: 4,
  },
  // Divider
  dashedDivider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 8,
    position: 'relative',
  },
  leftCircle: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#B7ECDC',
    left: -12,
    top: -12,
  },
  rightCircle: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#B7ECDC',
    right: -12,
    top: -12,
  },
  // Details
  detailsSection: {
    padding: 24,
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#999',
    letterSpacing: 1,
    marginBottom: 16,
  },
  detailRow: {
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 13,
    color: '#999',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#32243B',
  },
  detailValueMultiline: {
    fontSize: 14,
    fontWeight: '500',
    color: '#32243B',
    lineHeight: 20,
  },
  detailValueSmall: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    fontFamily: 'monospace',
  },
  // Impact
  impactSection: {
    backgroundColor: '#F9F9F9',
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  impactGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  impactItem: {
    alignItems: 'center',
    gap: 8,
  },
  impactValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#32243B',
  },
  impactLabel: {
    fontSize: 12,
    color: '#666',
  },
  // Footer
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    borderTopStyle: 'dashed',
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
});
