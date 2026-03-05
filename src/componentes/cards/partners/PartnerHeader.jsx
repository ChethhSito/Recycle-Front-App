import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, useTheme } from 'react-native-paper';
import { useTranslation } from '../../../hooks/use-translation';
export const PartnerHeader = ({ avatarUrl, onMenuPress }) => {
    const t = useTranslation(); // 🗣️ Inicializar traducciones
    const theme = useTheme();
    const { colors, dark } = theme;
    const componentStyles = getStyles(theme);

    return (
        <View style={componentStyles.mainWrapper}>
            {/* Header con gradiente adaptativo */}
            <LinearGradient
                colors={dark ? [colors.surface, colors.greenMain] : [colors.greenMain, colors.greenMain]}
                style={componentStyles.container}
            >
                {/* Top Bar Sincronizada */}
                <View style={styles.topBar}>
                    <TouchableOpacity onPress={onMenuPress} style={styles.menuButton}>
                        <Icon name="menu" size={26} color="#FFF" />
                    </TouchableOpacity>

                    <View style={styles.headerInfo}>
                        <Text style={[styles.headerTitle, { color: '#FFF' }]}>
                            {t.partnerHeader.title}
                        </Text>
                    </View>

                    <View style={[styles.avatarWrapper, { borderColor: 'rgba(255, 255, 255, 0.3)' }]}>
                        <Image source={{ uri: avatarUrl }} style={styles.avatar} />
                    </View>
                </View>

                {/* Tarjeta de Estadísticas Flotante */}
                <View style={[
                    styles.statsCard,
                    { backgroundColor: dark ? colors.elevation.level3 : colors.primary }
                ]}>
                    <View style={styles.statBox}>
                        <View style={[styles.iconCircle, { backgroundColor: dark ? 'rgba(0, 199, 161, 0.15)' : '#E8F5F1' }]}>
                            <Icon name="handshake" size={22} color={colors.primary} />
                        </View>
                        <View>
                            <Text style={[styles.statValue, { color: '#FFF' }]}>12+</Text>
                            <Text style={[styles.statLabel, { color: 'rgba(255, 255, 255, 0.8)' }]}>
                                {t.partnerHeader.stats.partners}
                            </Text>
                        </View>
                    </View>

                    <View style={[styles.divider, { backgroundColor: colors.outlineVariant, opacity: 0.3 }]} />

                    <View style={styles.statBox}>
                        <View style={[styles.iconCircle, { backgroundColor: dark ? 'rgba(250, 201, 110, 0.15)' : '#FFF9C4' }]}>
                            <Icon name="gift" size={22} color={dark ? colors.accent : "#FBC02D"} />
                        </View>
                        <View>
                            <Text style={[styles.statValue, { color: '#FFF' }]}>45+</Text>
                            <Text style={[styles.statLabel, { color: 'rgba(255, 255, 255, 0.8)' }]}>
                                {t.partnerHeader.stats.rewards}
                            </Text>
                        </View>
                    </View>
                </View>
            </LinearGradient>
        </View>
    );
};

// 🎨 ARQUITECTURA DE ESTILOS DINÁMICOS
const getStyles = (theme) => StyleSheet.create({
    mainWrapper: {
        backgroundColor: theme.colors.background, // Sincronizado con el fondo global
        paddingBottom: 30,
    },
    container: {
        paddingTop: 50,
        paddingBottom: 40,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
    },
});

// Estilos de Layout estables
const styles = StyleSheet.create({
    topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, marginTop: 20 },
    menuButton: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    headerInfo: { flex: 1, marginLeft: 15 },
    headerTitle: { fontSize: 19, fontWeight: 'bold' },
    avatarWrapper: { borderWidth: 2, borderRadius: 20, padding: 2 },
    avatar: { width: 38, height: 38, borderRadius: 18 },
    statsCard: {
        position: 'absolute',
        bottom: -30,
        left: 20,
        right: 20,
        borderRadius: 20,
        flexDirection: 'row',
        paddingVertical: 15,
        paddingHorizontal: 10,
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
    },
    statBox: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
    iconCircle: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    statValue: { fontSize: 18, fontWeight: 'bold' },
    statLabel: { fontSize: 12 },
    divider: { width: 1, height: '100%' }
});