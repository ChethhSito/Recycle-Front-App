import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Svg, Path } from 'react-native-svg';
import { Menu } from 'lucide-react-native';

const { width } = Dimensions.get('window');

// Altura de la parte rectangular del header
const HEADER_HEIGHT = 100;
// Altura adicional que ocupan las curvas de la nube
const CLOUD_HEIGHT = 50;

export const CloudHeader = ({ userName, userType, avatarUrl, onMenuPress }) => {
  return (
    <View style={styles.container}>
      {/* 1. Contenido del Header (Rectángulo Verde) */}
      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <View style={styles.userInfoContainer}>
            <TouchableOpacity onPress={onMenuPress}>
              <Menu color="#000" size={28} />
            </TouchableOpacity>
            <View style={styles.textContainer}>
              <Text style={styles.greeting}> {userName}</Text>
              <Text style={styles.userType}>{userType}</Text>
            </View>
          </View>

          <Image
            source={{ uri: avatarUrl }}
            style={styles.avatar}
          />
        </View>
      </View>

      {/* 2. Forma de Nube (SVG) */}
      {/* Este SVG se pega justo debajo del bloque verde para crear la transición */}
      <View style={styles.svgContainer}>
        <Svg
          width={width}
          height={CLOUD_HEIGHT}
          viewBox={`0 0 1440 320`}
          preserveAspectRatio="none"
        >
          <Path
            fill="#B7ECDD"
            d="M0,192L48,197.3C96,203,192,213,288,192C384,171,480,117,576,112C672,107,768,149,864,165.3C960,181,1056,171,1152,149.3C1248,128,1344,96,1392,80L1440,64L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          />
        </Svg>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    marginBottom: 10,
    paddingTop: 0,
    zIndex: 10,
  },
  contentContainer: {
    backgroundColor: '#B7ECDD',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    marginLeft: 25,
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  userType: {
    fontSize: 14,
    color: '#666',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: '#eee',
  },
  svgContainer: {
    marginTop: -1,
  },
});
