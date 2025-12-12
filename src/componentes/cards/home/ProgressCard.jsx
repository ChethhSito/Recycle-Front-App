import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, ProgressBar, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

export const ProgressCard = ({ 
    badgeIcon = 'seed',
    badgeTitle = 'Semilla de Cambio',
    rank = 'Rango 1',
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
                <Icon name={badgeIcon} size={40} color="#7CD1AA" />
                <View style={componentStyles.badgeInfo}>
                    <Text style={componentStyles.badgeTitle}>{badgeTitle}</Text>
                    <Text style={componentStyles.badgeRank}>{rank}</Text>
                </View>
            </View>
            <Text style={componentStyles.progressLabel}>TU PROGRESO ACTUAL</Text>
            <Text style={componentStyles.progressText}>
                Siguiente nivel: Brote Verde
            </Text>
            <ProgressBar 
                progress={progress} 
                color="#7CD1AA" 
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
        backgroundColor: '#31253B',
        margin: 20,
        borderRadius: 20,
    },
    badgeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    badgeInfo: {
        marginLeft: 15,
    },
    badgeTitle: {
        color: '#fff',
        fontSize: 16,
    },
    badgeRank: {
        color: '#fff',
        fontSize: 14,
    },
    progressLabel: {
        color: '#7CD1AA',
        fontSize: 11,
        marginTop: 15,
        marginBottom: 5,
        fontWeight: '600',
    },
    progressText: {
        color: '#fff',
        fontSize: 13,
        marginBottom: 10,
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
        color: '#fff',
        fontSize: 13,
    },
});
