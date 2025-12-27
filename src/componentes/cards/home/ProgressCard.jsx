import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, ProgressBar, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

export const ProgressCard = ({
    badgeIcon = 'seed',
    badgeTitle = 'Semilla de Cambio',
    rank = 'Nivel 1',
    progress = 0.3,
    currentPoints = 100,
    maxPoints = 600,
}) => {
    const theme = useTheme();
    const componentStyles = styles(theme);

    return (
        <Card style={componentStyles.progressCard}>
            <Card.Content>
                <View style={componentStyles.badgeContainer}>
                    <View style={componentStyles.circle}>
                        <Icon name={badgeIcon} size={40} color="#5D4037" />
                    </View>
                    <View style={componentStyles.badgeInfo}>
                        <Text style={componentStyles.badgeTitle}>{badgeTitle}</Text>
                        <Text style={componentStyles.badgeRank}>{rank}</Text>
                    </View>
                </View>
                <Text style={componentStyles.progressText}>
                    Siguiente nivel: Brote Verde
                </Text>
                <Text style={componentStyles.progressLabel}>TU PROGRESO ACTUAL</Text>
                <ProgressBar
                    progress={progress}
                    color="#018f64"
                    style={componentStyles.progressBar}
                />
                <View style={componentStyles.pointsContainer}>
                    <Text style={componentStyles.points}>{currentPoints}/{maxPoints} pts</Text>
                </View>
            </Card.Content>
        </Card>
    );
};

const styles = (theme) => StyleSheet.create({
    progressCard: {
        backgroundColor: '#F5E6D3',
        margin: 20,
        borderRadius: 20,
    },
    badgeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    circle: {
        width: 50,
        height: 50,
        borderRadius: 40,
        backgroundColor: '#ffffff99',
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeInfo: {
        marginLeft: 15,
    },
    badgeTitle: {
        color: '#000000ff',
        fontSize: 18,
    },
    badgeRank: {
        color: '#000000ff',
        fontSize: 14,
    },
    progressLabel: {
        color: '#018f64',
        fontSize: 14,
        marginTop: 5,
        marginBottom: 10,
        fontWeight: '600',
    },
    progressText: {
        color: '#000000ff',
        fontSize: 14,
        marginBottom: 5,
        marginTop: 10,
    },
    progressBar: {
        height: 8,
        borderRadius: 4,
        backgroundColor: '#666',
    },
    pointsContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 8,
    },
    points: {
        color: '#000000ff',
        fontSize: 14,
    },
});
