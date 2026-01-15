import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { sendMessageToGemini, getSuggestedQuestions } from '../../api/ai/gemini';

export const VirtualAssistantScreen = ({ onOpenDrawer, userAvatar, userName }) => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: '¡Hola! 👋 Soy tu asistente virtual de reciclaje.',
            isBot: true,
            timestamp: new Date(Date.now() - 60000)
        },
        {
            id: 2,
            text: 'Estoy aquí para resolver tus dudas sobre separación de residuos, puntos de acopio y tips ecológicos. 🌍',
            isBot: true,
            timestamp: new Date(Date.now() - 30000)
        },
        {
            id: 3,
            text: '¿En qué puedo ayudarte hoy?',
            isBot: true,
            timestamp: new Date()
        }
    ]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [suggestedQuestions] = useState(getSuggestedQuestions());
    const scrollViewRef = useRef(null);
    const iconRotation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(iconRotation, {
                toValue: 1,
                duration: 20000,
                useNativeDriver: true,
            })
        ).start();
    }, []);

    const rotation = iconRotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const handleSendMessage = async (text = inputText) => {
        if (!text.trim()) return;

        const userMessage = {
            id: Date.now(),
            text: text.trim(),
            isBot: false,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputText('');
        setIsLoading(true);

        setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);

        try {
            const botResponse = await sendMessageToGemini(text);

            const botMessage = {
                id: Date.now() + 1,
                text: botResponse,
                isBot: true,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, botMessage]);

            setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({ animated: true });
            }, 100);

        } catch (error) {
            const errorMessage = {
                id: Date.now() + 1,
                text: error.message || '❌ Lo siento, hubo un error al procesar tu mensaje. Intenta de nuevo.',
                isBot: true,
                isError: true,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuggestedQuestion = (question) => {
        handleSendMessage(question);
    };

    const renderMessage = (message) => {
        const isBot = message.isBot;
        const isError = message.isError;

        return (
            <View
                key={message.id}
                style={[
                    styles.messageContainer,
                    isBot ? styles.botMessageContainer : styles.userMessageContainer
                ]}
            >
                {isBot && (
                    <View style={styles.botAvatar}>
                        <Icon name="robot" size={20} color="#018f64" />
                    </View>
                )}
                <View
                    style={[
                        styles.messageBubble,
                        isBot ? styles.botBubble : styles.userBubble,
                        isError && styles.errorBubble
                    ]}
                >
                    <Text
                        style={[
                            styles.messageText,
                            isBot ? styles.botText : styles.userText,
                            isError && styles.errorText
                        ]}
                    >
                        {message.text}
                    </Text>
                    <Text style={styles.timestamp}>
                        {message.timestamp.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {/* 1. Header Fijo */}
            <LinearGradient
                colors={['#018f64', '#00C7A1', '#018f64']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.header}
            >
                <Animated.View style={[styles.decorativeIcon, styles.decorativeIcon1, { transform: [{ rotate: rotation }] }]}>
                    <Icon name="recycle" size={120} color="rgba(255, 255, 255, 0.1)" />
                </Animated.View>
                <Animated.View style={[styles.decorativeIcon, styles.decorativeIcon2, { transform: [{ rotate: rotation }] }]}>
                    <Icon name="leaf" size={80} color="rgba(255, 255, 255, 0.1)" />
                </Animated.View>

                <View style={styles.headerContent}>
                    <TouchableOpacity style={styles.menuButton} onPress={onOpenDrawer}>
                        <Icon name="menu" size={28} color="#FFFFFF" />
                    </TouchableOpacity>
                    <View style={styles.headerCenter}>
                        <Icon name="robot-happy" size={28} color="#FFFFFF" />
                        <View style={styles.headerTextContainer}>
                            <Text style={styles.headerTitle}>Asistente Virtual</Text>
                            <Text style={styles.headerSubtitle}>Estoy aquí para ayudarte</Text>
                        </View>
                    </View>
                    <View style={styles.menuButton} />
                </View>
            </LinearGradient>

            <KeyboardAvoidingView
                style={styles.chatContainer}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                
                {/* 2. Filtros FIJOS ARRIBA (Fuera del ScrollView de mensajes) */}
                <View style={styles.topFilterContainer}>
                    <Text style={styles.suggestedTitleMini}>Sugerencias rápidas:</Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.suggestedScroll}
                        contentContainerStyle={{ paddingHorizontal: 15 }}
                    >
                        {suggestedQuestions.map((question, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.chipButton}
                                onPress={() => handleSuggestedQuestion(question)}
                                disabled={isLoading}
                            >
                                <Text style={styles.chipText}>{question}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* 3. Lista de Mensajes (Scrollable) */}
                <ScrollView
                    ref={scrollViewRef}
                    style={styles.messagesScrollView}
                    contentContainerStyle={styles.messagesContent}
                    showsVerticalScrollIndicator={false}
                    onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
                >
                    {messages.map(renderMessage)}

                    {isLoading && (
                        <View style={[styles.messageContainer, styles.botMessageContainer]}>
                            <View style={styles.botAvatar}>
                                <Icon name="robot" size={20} color="#018f64" />
                            </View>
                            <View style={[styles.messageBubble, styles.botBubble, styles.typingBubble]}>
                                <View style={styles.typingIndicator}>
                                    <View style={styles.typingDot} />
                                    <View style={styles.typingDot} />
                                    <View style={styles.typingDot} />
                                </View>
                                <Text style={styles.typingText}>Escribiendo...</Text>
                            </View>
                        </View>
                    )}
                </ScrollView>

                {/* 4. Input (Fijo abajo) */}
                <View style={styles.inputContainer}>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Escribe tu pregunta..."
                            placeholderTextColor="#9CA3AF"
                            value={inputText}
                            onChangeText={setInputText}
                            multiline
                            maxLength={500}
                            editable={!isLoading}
                        />
                        <TouchableOpacity
                            style={[
                                styles.sendButton,
                                (!inputText.trim() || isLoading) && styles.sendButtonDisabled
                            ]}
                            onPress={() => handleSendMessage()}
                            disabled={!inputText.trim() || isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator size="small" color="#FFFFFF" />
                            ) : (
                                <Icon name="send" size={20} color="#FFFFFF" />
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    header: {
        paddingTop: Platform.OS === 'ios' ? 50 : 40,
        paddingBottom: 15,
        paddingHorizontal: 15,
        overflow: 'hidden',
        zIndex: 10, // Para asegurar que esté encima si es necesario
    },
    decorativeIcon: {
        position: 'absolute',
    },
    decorativeIcon1: {
        top: -20,
        right: -30,
    },
    decorativeIcon2: {
        bottom: -10,
        left: -20,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    menuButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerCenter: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    headerTextContainer: {
        alignItems: 'flex-start',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    headerSubtitle: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.9)',
        marginTop: 2,
    },
    chatContainer: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    // ESTILOS NUEVOS PARA FILTROS FIJOS SUPERIORES
    topFilterContainer: {
        backgroundColor: '#F5F5F5',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
        zIndex: 5,
    },
    suggestedTitleMini: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6B7280',
        marginBottom: 8,
        marginLeft: 15,
    },
    suggestedScroll: {
        flexDirection: 'row',
    },
    chipButton: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 20,
        marginRight: 8,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
    },
    chipText: {
        fontSize: 13,
        color: '#018f64',
        fontWeight: '500',
    },
    // Mensajes
    messagesScrollView: {
        flex: 1,
    },
    messagesContent: {
        padding: 15,
        paddingBottom: 20,
    },
    messageContainer: {
        flexDirection: 'row',
        marginBottom: 15,
        alignItems: 'flex-end',
    },
    botMessageContainer: {
        justifyContent: 'flex-start',
    },
    userMessageContainer: {
        justifyContent: 'flex-end',
    },
    botAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#E8F5F1',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    messageBubble: {
        maxWidth: '75%',
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 16,
    },
    botBubble: {
        backgroundColor: '#FFFFFF',
        borderBottomLeftRadius: 4,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    userBubble: {
        backgroundColor: '#018f64',
        borderBottomRightRadius: 4,
        alignSelf: 'flex-end',
    },
    errorBubble: {
        backgroundColor: '#FEE2E2',
    },
    messageText: {
        fontSize: 15,
        lineHeight: 20,
    },
    botText: {
        color: '#1F2937',
    },
    userText: {
        color: '#FFFFFF',
    },
    errorText: {
        color: '#DC2626',
    },
    timestamp: {
        fontSize: 10,
        color: '#9CA3AF',
        marginTop: 4,
        alignSelf: 'flex-end',
    },
    typingBubble: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    typingIndicator: {
        flexDirection: 'row',
        gap: 4,
        marginRight: 8,
    },
    typingDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#018f64',
    },
    typingText: {
        fontSize: 13,
        color: '#6B7280',
        fontStyle: 'italic',
    },
    inputContainer: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        backgroundColor: '#F3F4F6',
        borderRadius: 24,
        paddingHorizontal: 15,
        paddingVertical: 8,
    },
    textInput: {
        flex: 1,
        fontSize: 15,
        color: '#1F2937',
        maxHeight: 100,
        paddingVertical: 8,
    },
    sendButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#018f64',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
    sendButtonDisabled: {
        backgroundColor: '#9CA3AF',
    },
});