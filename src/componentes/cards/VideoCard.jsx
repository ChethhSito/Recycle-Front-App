import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

export const VideoCard = ({ 
    video, 
    onPress,
    isCompleted = false
}) => {
    const getCategoryColor = (category) => {
        const colors = {
            'Tutorial': '#00C6A0',
            'Reciclaje': '#018f64',
            'Eco-Tips': '#FFCB4D',
            'Premios': '#FF4081',
            'default': '#B7ECDC'
        };
        return colors[category] || colors.default;
    };

    return (
        <TouchableOpacity 
            style={styles.card} 
            onPress={onPress}
            activeOpacity={0.7}
        >
            {/* Franja Verde Lateral */}
            <View style={[styles.stripe, { backgroundColor: getCategoryColor(video.category) }]} />
            
            {/* Thumbnail Section */}
            <View style={styles.thumbnailContainer}>
                {video.thumbnail ? (
                    <Image 
                        source={{ uri: video.thumbnail }} 
                        style={styles.thumbnail}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={[styles.thumbnail, styles.thumbnailPlaceholder]}>
                        <Icon name="play-circle" size={40} color="#FFFFFF" />
                    </View>
                )}
                
                {/* Play Icon Overlay */}
                <View style={styles.playOverlay}>
                    {isCompleted ? (
                        <Icon name="check-circle" size={50} color="#4CAF50" />
                    ) : (
                        <Icon name="play-circle" size={50} color="rgba(255,255,255,0.9)" />
                    )}
                </View>
                
                {/* Duration Badge */}
                <View style={styles.durationBadge}>
                    <Icon name="clock-outline" size={12} color="#FFFFFF" />
                    <Text style={styles.durationText}>{video.duration}</Text>
                </View>
            </View>
            
            {/* Content Section */}
            <View style={styles.content}>
                <Text style={styles.title} numberOfLines={2}>
                    {video.title}
                </Text>
                
                <View style={styles.footer}>
                    <View style={[styles.categoryChip, { backgroundColor: getCategoryColor(video.category) }]}>
                        <Text style={styles.categoryText}>{video.category}</Text>
                    </View>
                    
                    {video.views && (
                        <View style={styles.viewsContainer}>
                            <Icon name="eye-outline" size={14} color="#666" />
                            <Text style={styles.viewsText}>{video.views}</Text>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        marginHorizontal: 20,
        marginVertical: 8,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    stripe: {
        width: 6,
        backgroundColor: '#018f64',
    },
    thumbnailContainer: {
        width: 120,
        height: 100,
        position: 'relative',
    },
    thumbnail: {
        width: '100%',
        height: '100%',
    },
    thumbnailPlaceholder: {
        backgroundColor: '#B7ECDC',
        alignItems: 'center',
        justifyContent: 'center',
    },
    playOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    durationBadge: {
        position: 'absolute',
        bottom: 8,
        right: 8,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        gap: 2,
    },
    durationText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: '600',
    },
    content: {
        flex: 1,
        padding: 12,
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#32243B',
        marginBottom: 8,
        lineHeight: 20,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    categoryChip: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    categoryText: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: '600',
    },
    viewsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    viewsText: {
        fontSize: 12,
        color: '#666',
    },
});
