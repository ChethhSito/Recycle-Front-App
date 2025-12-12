import React from 'react';
import { StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';

export const ProgramCard = ({ image, title }) => (
    <Card style={styles.programCard}>
        <Card.Cover 
            source={image} 
            style={styles.cardCover}
        />
        <Card.Content style={styles.cardContent}>
            <Text style={styles.programTitle}>{title}</Text>
        </Card.Content>
    </Card>
);

const styles = StyleSheet.create({
    programCard: {
        width: 240,
        marginRight: 15,
        borderRadius: 20,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        backgroundColor: '#31253B',
    },
    cardCover: {
        height: 180,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    cardContent: {
        paddingVertical: 15,
        paddingHorizontal: 10,
    },
    programTitle: {
        fontSize: 14,
        textAlign: 'center',
        color: '#A8C2CB',
        fontWeight: '500',
    },
});
