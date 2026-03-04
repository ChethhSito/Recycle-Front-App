import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    Clipboard,
    Alert,
    Dimensions,
    Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Text, useTheme, IconButton } from 'react-native-paper'; // 🚀 Paper para temas
import QRCode from 'react-native-qrcode-svg';

const { width } = Dimensions.get('window');

export const DonationScreen = () => {
    const navigation = useNavigation();
    const theme = useTheme(); // 🎨 Obtenemos el tema dinámico
    const { colors, dark } = theme;
    const componentStyles = getStyles(theme);

    const [copied, setCopied] = useState(false);

    // --- DATOS DEL BENEFICIARIO ---
    const BENEFICIARY = "Juan David Huayta Ortega"; //
    const PHONE_NUMBER = "987 654 321";

    const QR_PAYLOAD = "0002010102113932d809945ad03c50dab5bbc62f328f9e5e5204561153036045802PE5906YAPERO6004Lima6304EE87";
    const YAPE_LOGO = require("../../../assets/Logo.png");

    const handleCopy = () => {
        Clipboard.setString(PHONE_NUMBER);
        setCopied(true);
        Alert.alert("¡Copiado!", "Número copiado al portapapeles.");
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <SafeAreaView style={componentStyles.container}>
            {/* Sincronización de la barra de estado */}
            <StatusBar barStyle={dark ? "light-content" : "dark-content"} backgroundColor={colors.background} />

            {/* Header Dinámico */}
            <View style={componentStyles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={componentStyles.backButton}>
                    <Icon name="arrow-left" size={24} color={colors.onSurface} />
                </TouchableOpacity>
                <Text style={[componentStyles.headerTitle, { color: colors.onSurface }]}>Hacer una donación</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={componentStyles.scrollContent}>

                {/* Héroe Adaptable */}
                <View style={componentStyles.heroSection}>
                    <View style={[componentStyles.heroIconContainer, { backgroundColor: colors.primaryContainer }]}>
                        <Icon name="hand-heart-outline" size={40} color={colors.primary} />
                    </View>
                    <Text style={[componentStyles.heroTitle, { color: colors.onSurface }]}>Apoya nuestra causa</Text>
                    <Text style={[componentStyles.heroSubtitle, { color: colors.onSurfaceVariant }]}>
                        Escanea el QR o copia el número para realizar tu aporte voluntario.
                    </Text>
                </View>

                {/* --- TARJETA QR (Adaptable) --- */}
                <View style={[componentStyles.qrCard, { backgroundColor: colors.surface }]}>
                    <View style={componentStyles.yapeHeader}>
                        <View style={componentStyles.yapeBadge}>
                            <Icon name="qrcode-scan" size={14} color="#FFF" />
                            <Text style={componentStyles.yapeBadgeText}>Yape</Text>
                        </View>
                        <Text style={[componentStyles.cardHelperText, { color: colors.onSurfaceVariant }]}>Sin comisiones</Text>
                    </View>

                    {/* Contenedor del QR: Siempre blanco por fuera para garantizar escaneo */}
                    <View style={[componentStyles.qrContainer, { backgroundColor: '#FFF', padding: 15, borderRadius: 20 }]}>
                        <QRCode
                            value={QR_PAYLOAD}
                            size={180}
                            color="black"
                            backgroundColor="white"
                            logo={YAPE_LOGO}
                            logoSize={45}
                            logoBackgroundColor='white'
                            logoBorderRadius={8}
                        />
                    </View>

                    <Text style={[componentStyles.beneficiaryName, { color: colors.onSurface }]}>{BENEFICIARY}</Text>

                    <View style={[componentStyles.divider, { backgroundColor: colors.outlineVariant }]} />

                    {/* Sección de Copiado Dinámica */}
                    <TouchableOpacity
                        style={[componentStyles.copySection, { backgroundColor: colors.surfaceVariant }]}
                        onPress={handleCopy}
                        activeOpacity={0.7}
                    >
                        <View>
                            <Text style={[componentStyles.copyLabel, { color: colors.onSurfaceVariant }]}>Número de celular:</Text>
                            <Text style={[componentStyles.numberText, { color: dark ? colors.primary : '#742284' }]}>{PHONE_NUMBER}</Text>
                        </View>
                        <View style={[componentStyles.copyIconBtn, { backgroundColor: colors.surface, borderColor: colors.outlineVariant }, copied && componentStyles.copyIconBtnSuccess]}>
                            <Icon
                                name={copied ? "check" : "content-copy"}
                                size={18}
                                color={copied ? "#FFF" : (dark ? colors.primary : '#742284')}
                            />
                        </View>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={componentStyles.link}
                    onPress={() => Linking.openURL('https://nosplanet.org/')}
                >
                    <Text style={[componentStyles.linkText, { color: colors.primary, fontWeight: 'bold' }]}>Nos Planét SAC</Text>
                </TouchableOpacity>

                {/* Nota de Seguridad */}
                <View style={componentStyles.trustNote}>
                    <Icon name="shield-check-outline" size={16} color={colors.primary} />
                    <Text style={[componentStyles.trustText, { color: colors.onSurfaceVariant }]}>Tu donación ayuda a mantener los servidores.</Text>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

// 🎨 ESTILOS DINÁMICOS BASADOS EN EL TEMA
const getStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    backButton: {
        padding: 8,
        borderRadius: 12,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    scrollContent: {
        padding: 24,
        alignItems: 'center',
    },
    heroSection: {
        alignItems: 'center',
        marginBottom: 25,
    },
    heroIconContainer: {
        width: 70,
        height: 70,
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    heroTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 6,
    },
    heroSubtitle: {
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
        paddingHorizontal: 20,
    },
    qrCard: {
        width: '100%',
        borderRadius: 24,
        padding: 24,
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
    },
    yapeHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 25,
    },
    yapeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#742284', // Se mantiene el color de marca Yape
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        gap: 6,
    },
    yapeBadgeText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 12,
    },
    cardHelperText: {
        fontSize: 12,
        fontWeight: '500',
    },
    qrContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    beneficiaryName: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    divider: {
        height: 1,
        marginBottom: 20,
    },
    copySection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    copyLabel: {
        fontSize: 11,
        marginBottom: 2,
    },
    numberText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    copyIconBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
    },
    copyIconBtnSuccess: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    link: {
        paddingVertical: 15,
        paddingTop: 30,
    },
    trustNote: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        opacity: 0.8,
    },
    trustText: {
        fontSize: 12,
    }
});