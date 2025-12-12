import React from 'react';
import { StyleSheet, ImageBackground, View, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

export const ProgramCard = ({ image, title, badge, schedule, location, onPress }) => (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
        <ImageBackground 
            source={image} 
            style={styles.programCard}
            imageStyle={styles.cardImage}
        >
            {/* Badge superior */}
            {badge && (
                <View style={[styles.badge, badge.type === 'activity' && styles.badgeActivity]}>
                    <Icon name={badge.icon || 'calendar'} size={16} color="#fff" />
                    <Text style={styles.badgeText}>{badge.text}</Text>
                </View>
            )}

            {/* Overlay gradient */}
            <View style={styles.overlay}>
                <View style={styles.content}>
                    <Text style={styles.programTitle}>{title}</Text>
                    {schedule && (
                        <View style={styles.scheduleContainer}>
                            <Icon name="clock-outline" size={18} color="#fff" />
                            <Text style={styles.scheduleText}>{schedule}</Text>
                        </View>
                    )}
                    {location && (
                        <View style={styles.locationContainer}>
                            <Icon name="map-marker" size={18} color="#fff" />
                            <Text style={styles.locationText}>{location}</Text>
                        </View>
                    )}
                </View>
            </View>
        </ImageBackground>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    programCard: {
        width: 280,
        height: 350,
        marginRight: 15,
        borderRadius: 20,
        overflow: 'hidden',
    },
    cardImage: {
        borderRadius: 20,
    },
    badge: {
        position: 'absolute',
        top: 15,
        left: 15,
        backgroundColor: '#00926F',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
        gap: 5,
        zIndex: 2,
    },
    badgeActivity: {
        backgroundColor: '#EF4444',
    },
    badgeText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '600',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        justifyContent: 'flex-end',
    },
    content: {
        padding: 20,
        paddingBottom: 25,
    },
    programTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    scheduleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
        gap: 5,
    },
    scheduleText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    locationText: {
        color: '#fff',
        fontSize: 13,
    },
});
