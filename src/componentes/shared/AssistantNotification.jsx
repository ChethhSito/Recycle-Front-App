import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Modal,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useTranslation } from '../../hooks/use-translation';

const messageIcons = ['robot-happy', 'chat', 'help-circle', 'book-open-variant', 'clock-fast'];
export const AssistantNotification = ({ visible, onClose, onOpen }) => {

    const theme = useTheme();
    const { colors } = theme;
    const t = useTranslation();

    const [currentMessage, setCurrentMessage] = useState({
        text: t.assistant.messages[0],
        icon: messageIcons[0]
    });
    const slideAnim = useRef(new Animated.Value(-200)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            const randomIndex = Math.floor(Math.random() * t.assistant.messages.length);
            setCurrentMessage({
                text: t.assistant.messages[randomIndex],
                icon: messageIcons[randomIndex]
            });

            Animated.parallel([
                Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, tension: 40, friction: 8 }),
                Animated.timing(opacityAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
            ]).start();

            const timer = setTimeout(() => handleClose(), 5000);
            return () => clearTimeout(timer);
        } else {
            // Animación de salida
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: -200,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [visible, t.language]);

    const handleClose = () => {
        Animated.parallel([
            Animated.timing(slideAnim, { toValue: -200, duration: 300, useNativeDriver: true }),
            Animated.timing(opacityAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
        ]).start(() => onClose());
    };

    const handleOpen = () => {
        handleClose();
        setTimeout(() => {
            onOpen();
        }, 300);
    };

    if (!visible) return null;

    return (
        <Animated.View style={[styles.container, { transform: [{ translateY: slideAnim }], opacity: opacityAnim }]}>
            <TouchableOpacity
                style={[styles.notification, { backgroundColor: colors.elevation.level3, borderLeftColor: colors.primary }]}
                onPress={() => { handleClose(); setTimeout(() => onOpen(), 300); }}
                activeOpacity={0.9}
            >
                <View style={[styles.iconContainer, { backgroundColor: colors.primaryContainer }]}>
                    <Icon name={currentMessage.icon} size={24} color={colors.primary} />
                </View>

                <View style={styles.content}>
                    <Text style={[styles.title, { color: colors.primary }]}>{t.assistant.title}</Text>
                    <Text style={[styles.message, { color: colors.onSurface }]}>{currentMessage.text}</Text>
                </View>

                <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
                    <Icon name="close" size={20} color={colors.onSurfaceVariant} />
                </TouchableOpacity>
            </TouchableOpacity>
        </Animated.View>
    );
};

export const getRandomMessage = () => {
    return messages[Math.floor(Math.random() * messages.length)];
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 60,
        left: 15,
        right: 15,
        zIndex: 1000,
    },
    notification: {
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        borderLeftWidth: 4,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    content: {
        flex: 1,
    },
    title: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    message: {
        fontSize: 13,
        lineHeight: 18,
    },
    closeButton: {
        padding: 4,
        marginLeft: 8,
    },
});