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
import { useTheme } from 'react-native-paper'; // 🚀 Paper para temas
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { sendMessageToGemini, getSuggestedQuestions } from '../../api/ai/gemini';
import { useTranslation } from '../../hooks/use-translation';

// Tips ecológicos para compartir (similar a la versión web)
const ECO_TIPS = [
    "💡 ¿Sabías que? Una botella de plástico tarda 500 años en degradarse.",
    "🌿 ¡Reciclar 1 tonelada de papel salva 17 árboles!",
    "🧴 Recuerda lavar y aplastar tus botellas antes de reciclarlas.",
    "🔋 Las pilas nunca van a la basura común, ¡son tóxicas!",
    "🔄 La economía circular ayuda a reducir residuos.",
    "🌍 Pequeñas acciones generan grandes cambios."
];

export const VirtualAssistantScreen = ({ onOpenDrawer }) => {
    const theme = useTheme();
    const { colors, dark } = theme;
    const t = useTranslation();
    const styles = getStyles(theme);
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: t.ai.welcome,
            isBot: true,
            timestamp: new Date()
        }
    ]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [suggestedQuestions] = useState(getSuggestedQuestions(t.language));

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
        const userMessage = { id: Date.now(), text: text.trim(), isBot: false, timestamp: new Date() };
        setMessages(prev => [...prev, userMessage]);
        setInputText('');
        setIsLoading(true);

        try {
            const botResponse = await sendMessageToGemini(text);
            const botMessage = { id: Date.now() + 1, text: botResponse, isBot: true, timestamp: new Date() };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            const errorMessage = {
                id: Date.now() + 1,
                text: t.ai.error, // 🗣️ Error traducido
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

    const renderMessage = (message) => (
        <View key={message.id} style={[styles.messageContainer, message.isBot ? styles.botMessageContainer : styles.userMessageContainer]}>
            {message.isBot && (
                <View style={[styles.botAvatar, { backgroundColor: colors.primary }]}>
                    <Icon name="robot-happy" size={20} color="#FFFFFF" />
                </View>
            )}
            <View style={[styles.messageBubble, message.isBot ? styles.botBubble : styles.userBubble, message.isError && styles.errorBubble]}>
                <Text style={[styles.messageText, { color: message.isBot ? colors.onSurface : '#FFFFFF' }]}>
                    {message.text}
                </Text>
                <Text style={[styles.timestamp, { color: colors.onSurfaceVariant }]}>
                    {message.timestamp.toLocaleTimeString(t.language === 'es' ? 'es-PE' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
                </Text>
            </View>
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <LinearGradient colors={['#166534', '#15803d', '#16a34a']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.header}>
                <Animated.View style={[styles.decorativeIcon, { transform: [{ rotate: rotation }] }]}>
                    <Icon name="recycle" size={140} color="rgba(255, 255, 255, 0.08)" />
                </Animated.View>
                <View style={styles.headerContent}>
                    <TouchableOpacity style={styles.menuButton} onPress={onOpenDrawer}>
                        <Icon name="menu" size={28} color="#FFFFFF" />
                    </TouchableOpacity>
                    <View style={styles.headerCenter}>
                        <View style={styles.avatarBorder}><Icon name="robot" size={24} color="#15803d" /></View>
                        <View style={styles.headerTextContainer}>
                            <Text style={styles.headerTitle}>{t.ai.title}</Text>
                            <View style={styles.statusContainer}>

                                <Text style={styles.headerSubtitle}>{t.ai.subtitle}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.menuButton} />
                </View>
            </LinearGradient>

            <KeyboardAvoidingView style={styles.chatContainer} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <View style={styles.topFilterContainer}>
                    <Text style={[styles.suggestedTitleMini, { color: colors.onSurfaceVariant }]}>{t.ai.suggested}</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 15 }}>
                        {suggestedQuestions.map((q, i) => (
                            <TouchableOpacity key={i} style={[styles.chipButton, { backgroundColor: colors.surface, borderColor: colors.outlineVariant }]} onPress={() => handleSendMessage(q)}>
                                <Text style={[styles.chipText, { color: colors.primary }]}>{q}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                <ScrollView ref={scrollViewRef} style={styles.messagesScrollView} contentContainerStyle={styles.messagesContent} onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}>
                    {messages.map(renderMessage)}
                    {isLoading && (
                        <View style={[styles.messageContainer, styles.botMessageContainer]}>
                            <View style={[styles.botAvatar, { backgroundColor: colors.primary }]}><Icon name="robot-happy" size={20} color="#FFFFFF" /></View>
                            <View style={[styles.messageBubble, styles.botBubble, styles.typingBubble]}>
                                <Text style={[styles.typingText, { color: colors.onSurfaceVariant }]}>{t.ai.typing}</Text>
                            </View>
                        </View>
                    )}
                </ScrollView>

                <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderTopColor: colors.outlineVariant }]}>
                    <View style={[styles.inputWrapper, { backgroundColor: dark ? colors.elevation.level2 : '#F9FAFB', borderColor: colors.outline }]}>
                        <TextInput
                            style={[styles.textInput, { color: colors.onSurface }]}
                            placeholder={t.ai.placeholder}
                            placeholderTextColor={colors.onSurfaceVariant}
                            value={inputText}
                            onChangeText={setInputText}
                            multiline
                            editable={!isLoading}
                        />
                        <TouchableOpacity style={[styles.sendButton, { backgroundColor: colors.primary }, (!inputText.trim() || isLoading) && { backgroundColor: colors.surfaceVariant }]} onPress={() => handleSendMessage()} disabled={!inputText.trim() || isLoading}>
                            {isLoading ? <ActivityIndicator size="small" color="#FFFFFF" /> : <Icon name="send" size={20} color="#FFFFFF" />}
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
};

const getStyles = (theme) => StyleSheet.create({
    container: { flex: 1 },
    header: { paddingTop: Platform.OS === 'ios' ? 50 : 40, paddingBottom: 20, paddingHorizontal: 15, borderBottomLeftRadius: 25, borderBottomRightRadius: 25, elevation: 8, zIndex: 10, overflow: 'hidden' },
    decorativeIcon: { position: 'absolute', top: -40, right: -40, opacity: 0.6 },
    headerContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    menuButton: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)' },
    headerCenter: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    avatarBorder: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#bbf7d0' },
    headerTitle: { fontSize: 18, fontWeight: '800', color: '#FFFFFF' },
    headerSubtitle: { fontSize: 12, color: '#dcfce7' },
    chatContainer: { flex: 1 },
    topFilterContainer: { paddingVertical: 12 },
    suggestedTitleMini: { fontSize: 11, fontWeight: '700', marginBottom: 8, marginLeft: 20, textTransform: 'uppercase' },
    chipButton: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 25, marginRight: 10, borderWeight: 1, elevation: 1 },
    chipText: { fontSize: 13, fontWeight: '600' },
    messagesScrollView: { flex: 1 },
    messagesContent: { paddingHorizontal: 15, paddingVertical: 10 },
    messageContainer: { flexDirection: 'row', marginBottom: 16, alignItems: 'flex-end' },
    botMessageContainer: { justifyContent: 'flex-start' },
    userMessageContainer: { justifyContent: 'flex-end' },
    botAvatar: { width: 34, height: 34, borderRadius: 17, justifyContent: 'center', alignItems: 'center', marginRight: 8 },
    messageBubble: { maxWidth: '80%', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 20 },
    botBubble: { backgroundColor: theme.colors.elevation.level2, borderBottomLeftRadius: 4 },
    userBubble: { backgroundColor: theme.colors.primary, borderBottomRightRadius: 4 },
    errorBubble: { backgroundColor: '#FEF2F2', borderWeight: 1, borderColor: '#FECACA' },
    messageText: { fontSize: 15, lineHeight: 22 },
    timestamp: { fontSize: 10, marginTop: 6, alignSelf: 'flex-end' },
    typingBubble: { flexDirection: 'row', alignItems: 'center' },
    typingText: { fontSize: 13, fontStyle: 'italic' },
    inputContainer: { paddingHorizontal: 15, paddingVertical: 12, borderTopWidth: 1, paddingBottom: Platform.OS === 'ios' ? 30 : 12 },
    inputWrapper: { flexDirection: 'row', alignItems: 'flex-end', borderRadius: 28, paddingHorizontal: 6, paddingVertical: 6, borderWeight: 1 },
    textInput: { flex: 1, fontSize: 15, maxHeight: 120, minHeight: 40, paddingHorizontal: 12, paddingVertical: 10 },
    sendButton: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginLeft: 6 },
});