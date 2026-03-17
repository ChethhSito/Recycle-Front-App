import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from '../../../hooks/use-translation';

export const RewardHeader = ({ userName, avatarUrl, userPoints, onMenuPress, theme }) => {
    const t = useTranslation();
    const { colors } = theme;
    const componentStyles = getStyles(theme);
    return (
        <View style={componentStyles.mainWrapper}>
            <LinearGradient
                colors={[colors.greenMain, colors.primary]} // 🎨 Degradado basado en el tema
                style={componentStyles.container}
            >
                <View style={componentStyles.topBar}>
                    <TouchableOpacity onPress={onMenuPress} style={componentStyles.menuButton}>
                        <Icon name="menu" size={26} color={colors.onPrimary} />
                    </TouchableOpacity>

                    <View style={componentStyles.headerInfo}>
                        {/* 🗣️ Saludo dinámico */}
                        <Text style={[componentStyles.greeting, { color: colors.onPrimary }]}>
                            {t.rewards.greeting.replace('{{name}}', userName)}
                        </Text>
                        <Text style={[componentStyles.headerTitle, { color: colors.onPrimary }]}>
                            {t.rewards.headerTitle}
                        </Text>
                    </View>

                    <View style={componentStyles.avatarWrapper}>
                        <Image source={{ uri: avatarUrl }} style={componentStyles.avatar} />
                    </View>
                </View>

                {/* TARJETA DE PUNTOS FLOTANTE */}
                <View style={[componentStyles.pointsCard, { backgroundColor: colors.elevation.level3 }]}>
                    <View style={componentStyles.pointsLeft}>
                        <View style={[componentStyles.walletIconCircle, { backgroundColor: colors.primaryContainer }]}>
                            <Icon name="wallet-outline" size={24} color={colors.primary} />
                        </View>
                        <View>
                            <Text style={[componentStyles.pointsLabel, { color: colors.onSurfaceVariant }]}>
                                {t.rewards.pointsLabel}
                            </Text>
                            <Text style={[componentStyles.pointsValue, { color: colors.onSurface }]}>
                                {userPoints} <Text style={componentStyles.pointsUnit}>{t.home.pointsUnit}</Text>
                            </Text>
                        </View>
                    </View>

                    <View style={[componentStyles.verticalDivider, { backgroundColor: colors.outlineVariant }]} />

                    <TouchableOpacity style={componentStyles.historyBtn}>
                        <Icon name="history" size={20} color={colors.onSurfaceVariant} />
                        <Text style={[componentStyles.historyText, { color: colors.onSurfaceVariant }]}>
                            {t.rewards.historyText}
                        </Text>
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        </View>
    );
};

const getStyles = (theme) => StyleSheet.create({
    mainWrapper: {
        backgroundColor: theme.colors.background,
        paddingBottom: 35,
    },
    container: {
        paddingTop: 50,
        paddingBottom: 50,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 35,
        borderBottomRightRadius: 35,
        elevation: 10,
    },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 15,
        marginTop: 15,
    },
    menuButton: {
        width: 42,
        height: 42,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerInfo: {
        flex: 1,
        marginLeft: 15,
    },
    greeting: {
        fontSize: 16,
        opacity: 0.9,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    avatarWrapper: {
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 15,
        padding: 2,
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 12,
    },
    pointsCard: {
        position: 'absolute',
        bottom: -35,
        left: 20,
        right: 20,
        borderRadius: 22,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 18,
        paddingHorizontal: 20,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
    },
    pointsLeft: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    walletIconCircle: {
        width: 46,
        height: 46,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pointsLabel: {
        fontSize: 12,
    },
    pointsValue: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    pointsUnit: {
        fontSize: 14,
    },
    verticalDivider: {
        width: 1,
        height: 30,
        marginHorizontal: 15,
    },
    historyBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
    },
    historyText: {
        fontSize: 11,
        fontWeight: '600',
    }
});