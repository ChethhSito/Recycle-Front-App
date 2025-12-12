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
                <Icon name={badgeIcon} size={40} color="#fff" />
                <View style={componentStyles.badgeInfo}>
                    <Text style={componentStyles.badgeTitle}>{badgeTitle}</Text>
                    <Text style={componentStyles.badgeRank}>{rank}</Text>
                </View>
            </View>
            <Text style={componentStyles.progressText}>
                recicla más para subir de rango
            </Text>
            <ProgressBar 
                progress={progress} 
                color="#4CAF50" 
                style={componentStyles.progressBar}
            />
            <Text style={componentStyles.points}>{currentPoints}/{maxPoints} pts</Text>
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
    progressText: {
        color: '#fff',
        fontSize: 12,
        marginVertical: 10,
    },
    progressBar: {
        height: 8,
        borderRadius: 4,
        backgroundColor: '#666',
    },
    points: {
        color: '#fff',
        textAlign: 'right',
        marginTop: 5,
    },
});
