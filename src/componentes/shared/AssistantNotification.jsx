import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Modal,
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

const messages = [
    { text: '¡Hola! ¿Tienes dudas sobre reciclaje? 🌱', icon: 'robot-happy' },
    { text: '¡Bienvenido! Estoy aquí para ayudarte 👋', icon: 'chat' },
    { text: '¿Necesitas ayuda con algo? Pregúntame 💬', icon: 'help-circle' },
    { text: 'Aprende a reciclar mejor conmigo 📚', icon: 'book-open-variant' },
    { text: '¿Sabías que puedo ayudarte 24/7? ⏰', icon: 'clock-fast' },
];

export const AssistantNotification = ({ visible, onClose, onOpen }) => {
    const [currentMessage, setCurrentMessage] = useState(messages[0]);
    const slideAnim = useRef(new Animated.Value(-200)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            // Animación de entrada
            Animated.parallel([
                Animated.spring(slideAnim, {
                    toValue: 0,
                    useNativeDriver: true,
                    tension: 40,
                    friction: 8,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();

            // Auto-cerrar después de 5 segundos
            const timer = setTimeout(() => {
                handleClose();
            }, 5000);

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
    }, [visible]);

    const handleClose = () => {
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
        ]).start(() => {
            onClose();
        });
    };

    const handleOpen = () => {
        handleClose();
        setTimeout(() => {
            onOpen();
        }, 300);
    };

    if (!visible) return null;

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    transform: [{ translateY: slideAnim }],
                    opacity: opacityAnim,
                },
            ]}
        >
            <TouchableOpacity
                style={styles.notification}
                onPress={handleOpen}
                activeOpacity={0.9}
            >
                <View style={styles.iconContainer}>
                    <Icon name={currentMessage.icon} size={24} color="#018f64" />
                </View>
                
                <View style={styles.content}>
                    <Text style={styles.title}>Asistente Virtual</Text>
                    <Text style={styles.message}>{currentMessage.text}</Text>
                </View>

                <TouchableOpacity
                    style={styles.closeButton}
                    onPress={handleClose}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Icon name="close" size={20} color="#6B7280" />
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
        backgroundColor: '#FFFFFF',
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
        borderLeftColor: '#018f64',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#E8F5F1',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    content: {
        flex: 1,
    },
    title: {
        fontSize: 14,
        fontWeight: '700',
        color: '#018f64',
        marginBottom: 4,
    },
    message: {
        fontSize: 13,
        color: '#1F2937',
        lineHeight: 18,
    },
    closeButton: {
        padding: 4,
        marginLeft: 8,
    },
});
