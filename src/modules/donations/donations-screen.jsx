import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    Clipboard,
    Alert,
    Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import QRCode from 'react-native-qrcode-svg'; // <--- LIBRERÍA DE QR

const { width } = Dimensions.get('window');

// PALETA DE COLORES
const COLORS = {
    primary: '#31253B',
    greenMain: '#018f64',
    mintBg: '#b1eedc',
    white: '#FFFFFF',
    grey: '#9CA3AF',
    yapePurple: '#742284',
};

export const DonationScreen = () => {
    const navigation = useNavigation();
    const [copied, setCopied] = useState(false);

    // --- TUS DATOS ---
    const BENEFICIARY = "Juan David Huayta Ortega";
    const PHONE_NUMBER = "987 654 321"; // Tu número visible

    // IMPORTANTE: Escanea tu QR original para obtener el link real.
    // Por ahora pondré tu número, pero lo ideal es el link profundo de Yape.
    const QR_PAYLOAD = "0002010102113932d809945ad03c50dab5bbc62f328f9e5e5204561153036045802PE5906YAPERO6004Lima6304EE87";

    // Logo de Yape para el centro del QR (puedes usar un archivo local require('./yape.png'))
    const YAPE_LOGO = require("../../../assets/Logo.png");

    const handleCopy = () => {
        Clipboard.setString(PHONE_NUMBER);
        setCopied(true);
        Alert.alert("¡Copiado!", "Número copiado al portapapeles.");
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="arrow-left" size={24} color={COLORS.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Hacer una donación</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* Héroe */}
                <View style={styles.heroSection}>
                    <View style={styles.heroIconContainer}>
                        <Icon name="hand-heart-outline" size={40} color={COLORS.greenMain} />
                    </View>
                    <Text style={styles.heroTitle}>Apoya nuestra causa</Text>
                    <Text style={styles.heroSubtitle}>
                        Escanea el QR o copia el número para realizar tu aporte voluntario.
                    </Text>
                </View>

                {/* --- TARJETA QR (Minimalista y Limpia) --- */}
                <View style={styles.qrCard}>
                    {/* Badge Superior */}
                    <View style={styles.yapeHeader}>
                        <View style={styles.yapeBadge}>
                            <Icon name="qrcode-scan" size={14} color={COLORS.white} />
                            <Text style={styles.yapeBadgeText}>Yape</Text>
                        </View>
                        <Text style={styles.cardHelperText}>Sin comisiones</Text>
                    </View>

                    {/* EL GENERADOR DE QR */}
                    <View style={styles.qrContainer}>
                        <QRCode
                            value={QR_PAYLOAD}
                            size={180}
                            color="black"
                            backgroundColor="white"
                            // Logo incrustado
                            logo={YAPE_LOGO}
                            logoSize={45}
                            logoBackgroundColor='white'
                            logoBorderRadius={8}
                        />
                    </View>

                    <Text style={styles.beneficiaryName}>{BENEFICIARY}</Text>

                    <View style={styles.divider} />

                    {/* Sección de Copiar */}
                    <TouchableOpacity style={styles.copySection} onPress={handleCopy} activeOpacity={0.7}>
                        <View>
                            <Text style={styles.copyLabel}>Número de celular:</Text>
                            <Text style={styles.numberText}>{PHONE_NUMBER}</Text>
                        </View>
                        <View style={[styles.copyIconBtn, copied && styles.copyIconBtnSuccess]}>
                            <Icon
                                name={copied ? "check" : "content-copy"}
                                size={18}
                                color={copied ? COLORS.white : COLORS.yapePurple}
                            />
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Nota de Seguridad */}
                <View style={styles.trustNote}>
                    <Icon name="shield-check-outline" size={16} color={COLORS.greenMain} />
                    <Text style={styles.trustText}>Tu donación ayuda a mantener los servidores.</Text>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#b1eedc', // Fondo gris muy suave (casi blanco) para resaltar la tarjeta
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#b1eedc'
    },
    backButton: {
        padding: 8,
        borderRadius: 12,
        backgroundColor: '#b1eedc',
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    scrollContent: {
        padding: 24,
        alignItems: 'center',
    },
    // Hero
    heroSection: {
        alignItems: 'center',
        marginBottom: 25,
    },
    heroIconContainer: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: COLORS.mintBg,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    heroTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: 6,
    },
    heroSubtitle: {
        fontSize: 14,
        color: '#62686E',
        textAlign: 'center',
        lineHeight: 20,
        paddingHorizontal: 20,
    },
    // QR Card
    qrCard: {
        width: '100%',
        backgroundColor: COLORS.white,
        borderRadius: 24,
        padding: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 15,
        elevation: 3,
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
        backgroundColor: COLORS.yapePurple,
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        gap: 6,
    },
    yapeBadgeText: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: 12,
    },
    cardHelperText: {
        color: COLORS.grey,
        fontSize: 12,
        fontWeight: '500',
    },
    // Contenedor del QR
    qrContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    beneficiaryName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.primary,
        textAlign: 'center',
        marginBottom: 20,
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginBottom: 20,
    },
    // Copiar
    copySection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        borderRadius: 16,
        backgroundColor: '#FAF5FF', // Fondo lila muy sutil
        borderWidth: 1,
        borderColor: 'rgba(116, 34, 132, 0.1)',
    },
    copyLabel: {
        fontSize: 11,
        color: COLORS.grey,
        marginBottom: 2,
    },
    numberText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.yapePurple,
    },
    copyIconBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E9D8FD',
    },
    copyIconBtnSuccess: {
        backgroundColor: COLORS.greenMain,
        borderColor: COLORS.greenMain,
    },
    // Footer
    trustNote: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 30,
        gap: 6,
        opacity: 0.6,
    },
    trustText: {
        fontSize: 12,
        color: COLORS.grey,
    }
});