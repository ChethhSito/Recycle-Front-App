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
    Image,
    Modal
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { sendMessageToGemini, getSuggestedQuestions } from '../../api/ai/gemini';

// Tips ecológicos para compartir (similar a la versión web)
const ECO_TIPS = [
    "💡 ¿Sabías que? Una botella de plástico tarda 500 años en degradarse.",
    "🌿 ¡Reciclar 1 tonelada de papel salva 17 árboles!",
    "🧴 Recuerda lavar y aplastar tus botellas antes de reciclarlas.",
    "🔋 Las pilas nunca van a la basura común, ¡son tóxicas!",
    "🔄 La economía circular ayuda a reducir residuos.",
    "🌍 Pequeñas acciones generan grandes cambios."
];

export const VirtualAssistantScreen = ({ onOpenDrawer, userAvatar, userName }) => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: '¡Hola! Soy Planet Bot 🌿. Estoy aquí para ayudarte a reciclar mejor. Selecciona una pregunta de arriba o escribe la tuya.',
            isBot: true,
            timestamp: new Date()
        }
    ]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [suggestedQuestions] = useState(getSuggestedQuestions());

    // Estado para "Tips" (opcional, para darle vida como en la web)
    const [currentTip, setCurrentTip] = useState(null);

    const scrollViewRef = useRef(null);
    const iconRotation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Animación de fondo suave
        Animated.loop(
            Animated.timing(iconRotation, {
                toValue: 1,
                duration: 20000,
                useNativeDriver: true,
            })
        ).start();

        // Mostrar un tip aleatorio al iniciar (opcional)
        // const randomTip = ECO_TIPS[Math.floor(Math.random() * ECO_TIPS.length)];
        // setCurrentTip(randomTip);
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
                text: error.message || '❌ Lo siento, Planet Bot tuvo un problema. Intenta de nuevo.',
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
                        {/* Usamos un Icono estilizado como avatar del bot */}
                        <Icon name="robot-happy" size={20} color="#FFFFFF" />
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
            {/* 1. Header Fijo EcoBot Style */}
            <LinearGradient
                colors={['#166534', '#15803d', '#16a34a']} // Green 800 -> 700 -> 600
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.header}
            >
                <Animated.View style={[styles.decorativeIcon, styles.decorativeIcon1, { transform: [{ rotate: rotation }] }]}>
                    <Icon name="recycle" size={140} color="rgba(255, 255, 255, 0.08)" />
                </Animated.View>

                <View style={styles.headerContent}>
                    <TouchableOpacity style={styles.menuButton} onPress={onOpenDrawer}>
                        <Icon name="menu" size={28} color="#FFFFFF" />
                    </TouchableOpacity>

                    <View style={styles.headerCenter}>
                        <View style={styles.avatarBorder}>
                            <Icon name="robot" size={24} color="#15803d" />
                        </View>
                        <View style={styles.headerTextContainer}>
                            <Text style={styles.headerTitle}>Planet Bot</Text>
                            <View style={styles.statusContainer}>
                                <Icon name="leaf" size={10} color="#bbf7d0" />
                                <Text style={styles.headerSubtitle}>Asistente Planetario</Text>
                            </View>
                        </View>
                    </View>

                    {/* Espaciador para centrar */}
                    <View style={styles.menuButton} />
                </View>
            </LinearGradient>

            <KeyboardAvoidingView
                style={styles.chatContainer}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >

                {/* 2. Filtros FIJOS ARRIBA */}
                <View style={styles.topFilterContainer}>
                    <Text style={styles.suggestedTitleMini}>Preguntas frecuentes:</Text>
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

                {/* 3. Lista de Mensajes */}
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
                                <Icon name="robot-happy" size={20} color="#FFFFFF" />
                            </View>
                            <View style={[styles.messageBubble, styles.botBubble, styles.typingBubble]}>
                                <View style={styles.typingIndicator}>
                                    <View style={styles.typingDot} />
                                    <View style={styles.typingDot} />
                                    <View style={styles.typingDot} />
                                </View>
                                <Text style={styles.typingText}>Planet Bot está escribiendo...</Text>
                            </View>
                        </View>
                    )}
                </ScrollView>

                {/* 4. Input */}
                <View style={styles.inputContainer}>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Escribe tu duda sobre reciclaje..."
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
        backgroundColor: '#F3F4F6', // Gray 100
    },
    header: {
        paddingTop: Platform.OS === 'ios' ? 50 : 40,
        paddingBottom: 20,
        paddingHorizontal: 15,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        elevation: 8,
        shadowColor: '#166534',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        zIndex: 10,
        overflow: 'hidden',
        position: 'relative'
    },
    decorativeIcon: {
        position: 'absolute',
    },
    decorativeIcon1: {
        top: -40,
        right: -40,
        opacity: 0.6
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
        backgroundColor: 'rgba(255,255,255,0.15)'
    },
    headerCenter: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatarBorder: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#bbf7d0', // Green 200
    },
    headerTextContainer: {
        alignItems: 'flex-start',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#FFFFFF',
        letterSpacing: 0.5,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4
    },
    headerSubtitle: {
        fontSize: 12,
        color: '#dcfce7', // Green 100
        fontWeight: '500',
    },
    chatContainer: {
        flex: 1,
    },
    // Filtros
    topFilterContainer: {
        paddingVertical: 12,
        zIndex: 5,
    },
    suggestedTitleMini: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6B7280',
        marginBottom: 8,
        marginLeft: 20,
        textTransform: 'uppercase',
        letterSpacing: 0.5
    },
    suggestedScroll: {
        flexDirection: 'row',
    },
    chipButton: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 25,
        marginRight: 10,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        borderWidth: 1,
        borderColor: '#E5E7EB'
    },
    chipText: {
        fontSize: 13,
        color: '#15803d', // Green 700
        fontWeight: '600',
    },
    // Mensajes
    messagesScrollView: {
        flex: 1,
    },
    messagesContent: {
        paddingHorizontal: 15,
        paddingTop: 10,
        paddingBottom: 20,
    },
    messageContainer: {
        flexDirection: 'row',
        marginBottom: 16,
        alignItems: 'flex-end',
    },
    botMessageContainer: {
        justifyContent: 'flex-start',
    },
    userMessageContainer: {
        justifyContent: 'flex-end',
    },
    botAvatar: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: '#15803d', // Green 700
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
        elevation: 2
    },
    messageBubble: {
        maxWidth: '80%',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    botBubble: {
        backgroundColor: '#FFFFFF',
        borderBottomLeftRadius: 4,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
    },
    userBubble: {
        backgroundColor: '#15803d', // Green 700
        borderBottomRightRadius: 4,
        elevation: 2,
        shadowColor: '#15803d',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    errorBubble: {
        backgroundColor: '#FEF2F2',
        borderWidth: 1,
        borderColor: '#FECACA'
    },
    messageText: {
        fontSize: 15,
        lineHeight: 22,
    },
    botText: {
        color: '#374151', // Gray 700
    },
    userText: {
        color: '#FFFFFF',
        fontWeight: '400'
    },
    errorText: {
        color: '#DC2626',
    },
    timestamp: {
        fontSize: 10,
        marginTop: 6,
        alignSelf: 'flex-end',
        opacity: 0.7
    },
    typingBubble: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14 // Un poco más alto para el indicador
    },
    typingIndicator: {
        flexDirection: 'row',
        gap: 5,
        marginRight: 8,
    },
    typingDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#15803d',
        opacity: 0.6
    },
    typingText: {
        fontSize: 13,
        color: '#6B7280',
        fontStyle: 'italic',
    },
    // Input
    inputContainer: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        paddingBottom: Platform.OS === 'ios' ? 30 : 12
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        backgroundColor: '#F9FAFB',
        borderRadius: 28,
        paddingHorizontal: 6,
        paddingVertical: 6,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    textInput: {
        flex: 1,
        fontSize: 15,
        color: '#1F2937',
        maxHeight: 120,
        minHeight: 40,
        paddingHorizontal: 12,
        paddingVertical: 10,
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#15803d',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 6,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    sendButtonDisabled: {
        backgroundColor: '#E5E7EB',
        elevation: 0
    },
});