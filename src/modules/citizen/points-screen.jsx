import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, FlatList, Share, ActivityIndicator } from 'react-native';
import { Text, Button, ProgressBar, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useLevels } from '../../hooks/use-levels-store';
import { useAuthStore } from '../../hooks/use-auth-store';
import { useTranslation } from '../../hooks/use-translation'; // 🗣️ Hook de traducción

const { width } = Dimensions.get('window');

export const RankScreen = () => {
    const t = useTranslation();
    const navigation = useNavigation();
    const theme = useTheme();
    const { colors, dark } = theme;

    const { levels, loading, userLevelStatus, startLoadingUserStatus } = useLevels();
    const { user } = useAuthStore();
    const [activeIndex, setActiveIndex] = useState(0);

    const currentUserPoints = userLevelStatus?.points?.current || 0;
    const currentUserLevel = userLevelStatus?.currentLevel?.rank || 1;

    const onShare = async (item) => {
        const message = t.rank.shareMessage
            .replace('{{name}}', item.name)
            .replace('{{level}}', item.levelNumber)
            .replace('{{desc}}', item.description)
            .replace('{{current}}', currentUserPoints)
            .replace('{{max}}', item.maxPoints);

        try {
            await Share.share({ message, title: `Nos Planét - ${item.name}` });
        } catch (error) { console.log(error); }
    };

    const renderItem = ({ item }) => {
        const isLocked = item.levelNumber > currentUserLevel;
        const progress = item.maxPoints > 0 ? (currentUserPoints / item.maxPoints) : 0;

        // 🎨 LÓGICA DE INVERSIÓN SOLICITADA
        // En modo oscuro, el fondo es el color del icono y el contenido es claro.
        const slideBg = dark ? item.primaryColor : item.bgColor;
        const mainContentColor = dark ? '#FFFFFF' : item.primaryColor;
        const cardInnerBg = dark ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.6)';
        const subtextColor = dark ? 'rgba(255,255,255,0.7)' : '#555';

        return (
            <View style={[styles.slideContainer, { backgroundColor: slideBg }]}>
                {isLocked ? (
                    // === ESTADO BLOQUEADO ===
                    <View style={styles.mainContent}>
                        <View style={[styles.circleBackdrop, { backgroundColor: cardInnerBg }]}>
                            <MaterialCommunityIcons name="lock-outline" size={90} color={mainContentColor} style={{ opacity: 0.8 }} />
                        </View>

                        <View style={styles.textContainer}>
                            <Text variant="headlineMedium" style={[styles.title, { color: mainContentColor, opacity: 0.7 }]}>
                                {item.name}
                            </Text>
                            <Text style={[styles.desc, { color: subtextColor }]}>
                                {t.rank.levelLabel} {item.levelNumber} • {t.rank.notAvailable}
                            </Text>

                            <View style={[styles.lockedCard, { backgroundColor: cardInnerBg }]}>
                                <View style={styles.lockedHeader}>
                                    <MaterialCommunityIcons name="star-four-points" size={20} color={mainContentColor} />
                                    <Text style={[styles.lockedCardTitle, { color: mainContentColor }]}>{t.rank.requirement}</Text>
                                    <MaterialCommunityIcons name="star-four-points" size={20} color={mainContentColor} />
                                </View>

                                <Text style={[styles.targetPointsText, { color: mainContentColor }]}>
                                    {item.maxPoints} <Text style={{ fontSize: 16, fontWeight: 'normal' }}>XP</Text>
                                </Text>

                                <View style={[styles.divider, { backgroundColor: mainContentColor, opacity: 0.3 }]} />

                                <Text style={[styles.lockedCardDesc, { color: subtextColor }]}>
                                    {t.rank.lockedDesc}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.bottomSection}>
                            <Button
                                mode="text"
                                textColor={mainContentColor}
                                onPress={() => navigation.goBack()}
                            >
                                {t.rank.backBtn}
                            </Button>

                            <Button
                                mode="contained"
                                buttonColor={dark ? colors.surface : item.primaryColor}
                                textColor={dark ? item.primaryColor : '#FFF'}
                                icon="recycle"
                                onPress={() => navigation.navigate('Home')}
                                style={{ elevation: 4 }}
                            >
                                {t.rank.actionBtn}
                            </Button>
                        </View>
                    </View>
                ) : (
                    // === ESTADO DESBLOQUEADO ===
                    <View style={styles.mainContent}>
                        <View style={[styles.circleBackdrop, { backgroundColor: cardInnerBg }]}>
                            <MaterialCommunityIcons name={item.iconName} size={130} color={mainContentColor} />
                        </View>

                        <View style={styles.textContainer}>
                            <Text variant="displaySmall" style={[styles.title, { color: mainContentColor }]}>
                                {item.name}
                            </Text>
                            <Text style={[styles.desc, { color: dark ? '#FFF' : '#1d1d1d' }]}>
                                {item.description}
                            </Text>
                            <View style={[styles.divider, { backgroundColor: mainContentColor, opacity: 0.2 }]} />
                            <Text style={[styles.longDesc, { color: subtextColor }]}>
                                {item.longDescription}
                            </Text>
                        </View>

                        <View style={styles.bottomSection}>
                            <View style={styles.statsContainer}>
                                <View style={styles.statsRow}>
                                    <View style={[styles.badgePill, { backgroundColor: mainContentColor }]}>
                                        <Text style={[styles.badgeText, { color: dark ? item.primaryColor : '#FFF' }]}>
                                            {t.rank.levelLabel.toUpperCase()} {item.levelNumber}
                                        </Text>
                                    </View>
                                    <Text style={[styles.pointsText, { color: mainContentColor }]}>
                                        {currentUserPoints} / {item.maxPoints} XP
                                    </Text>
                                </View>
                                <ProgressBar
                                    progress={progress}
                                    color={mainContentColor}
                                    style={[styles.progressBar, { backgroundColor: dark ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.7)' }]}
                                />
                            </View>

                            <View style={styles.bottomButtonsAction}>
                                <Button
                                    mode="text"
                                    textColor={mainContentColor}
                                    onPress={() => navigation.goBack()}
                                >
                                    {t.rank.backBtn}
                                </Button>
                                <Button
                                    mode="contained"
                                    buttonColor={dark ? colors.surface : item.primaryColor}
                                    textColor={dark ? item.primaryColor : '#FFF'}
                                    icon="share-variant"
                                    onPress={() => onShare(item)}
                                >
                                    {t.rank.shareBtn}
                                </Button>
                            </View>
                        </View>
                    </View>
                )}
            </View>
        );
    };

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={{ marginTop: 10, color: colors.onSurface }}>{t.rank.loading}</Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <FlatList
                data={levels}
                renderItem={renderItem}
                keyExtractor={(item) => item._id}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={(ev) => {
                    const index = Math.round(ev.nativeEvent.contentOffset.x / width);
                    setActiveIndex(index);
                }}
            />

            {/* Paginación con colores adaptativos */}
            <View style={styles.paginationContainer}>
                {levels.map((item, i) => (
                    <View
                        key={item._id}
                        style={[
                            styles.dot,
                            {
                                backgroundColor: i === activeIndex
                                    ? (dark ? '#FFF' : '#333')
                                    : (dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.1)'),
                                width: i === activeIndex ? 20 : 8
                            }
                        ]}
                    />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    slideContainer: { width: width, height: '100%', alignItems: 'center', justifyContent: 'center' },
    mainContent: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 30, width: '100%' },
    circleBackdrop: { width: 180, height: 180, borderRadius: 90, justifyContent: 'center', alignItems: 'center', marginBottom: 25, elevation: 5 },
    textContainer: { width: '100%', alignItems: 'center' },
    title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 5 },
    desc: { fontSize: 18, fontWeight: '600', textAlign: 'center', marginBottom: 15 },
    divider: { width: 50, height: 4, borderRadius: 2, marginBottom: 15 },
    longDesc: { fontSize: 15, textAlign: 'center', lineHeight: 22 },
    lockedCard: { marginTop: 15, padding: 20, borderRadius: 20, width: '100%', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
    lockedHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 5, gap: 8 },
    lockedCardTitle: { fontSize: 13, fontWeight: 'bold', letterSpacing: 1 },
    targetPointsText: { fontSize: 40, fontWeight: 'bold', marginVertical: 5 },
    lockedCardDesc: { fontSize: 13, textAlign: 'center', lineHeight: 18 },
    bottomSection: { width: '100%', paddingHorizontal: 5, marginTop: 30 },
    statsContainer: { width: '100%', marginBottom: 20 },
    statsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    badgePill: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 10 },
    badgeText: { fontWeight: 'bold', fontSize: 11 },
    pointsText: { fontWeight: 'bold', fontSize: 13 },
    progressBar: { height: 10, borderRadius: 5 },
    bottomButtonsAction: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' },
    paginationContainer: { flexDirection: 'row', position: 'absolute', bottom: 30, alignSelf: 'center' },
    dot: { height: 8, borderRadius: 4, marginHorizontal: 4 },
});