import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

export const TwoFactorSuccessScreen = () => {
    const navigation = useNavigation();

    const handleBackToSettings = () => {
        // Navegar a Settings e indicar que se activó correctamente
        navigation.navigate('Settings', { twoFactorActivated: true });
    };

    return (
        <View style={styles.container}>
            {/* Simple Header sin botón atrás */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Verificación en 2 pasos</Text>
            </View>

            <ScrollView 
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.stepContainer}>
                    <View style={styles.successIconCircle}>
                        <Icon name="check-circle" size={80} color="#10B981" />
                    </View>

                    <Text style={styles.title}>¡Todo listo!</Text>
                    <Text style={styles.description}>
                        La verificación en 2 pasos ha sido activada correctamente. 
                        Tu cuenta ahora está más protegida.
                    </Text>

                    <View style={styles.successInfoBox}>
                        <Icon name="information" size={24} color="#3B82F6" />
                        <Text style={styles.successInfoText}>
                            A partir de ahora, cada vez que inicies sesión necesitarás ingresar 
                            un código de verificación.
                        </Text>
                    </View>

                    <TouchableOpacity 
                        style={styles.primaryButton}
                        onPress={handleBackToSettings}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.primaryButtonText}>Volver a Configuración</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        backgroundColor: '#FFFFFF',
        paddingTop: 50,
        paddingBottom: 16,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1F2937',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    stepContainer: {
        flex: 1,
        paddingHorizontal: 24,
        paddingVertical: 32,
        alignItems: 'center',
    },
    successIconCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#D1FAE5',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 32,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 12,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        color: '#6B7280',
        marginBottom: 32,
        textAlign: 'center',
        lineHeight: 24,
        paddingHorizontal: 8,
    },
    successInfoBox: {
        flexDirection: 'row',
        backgroundColor: '#EFF6FF',
        padding: 16,
        borderRadius: 12,
        marginBottom: 32,
        width: '100%',
        alignItems: 'flex-start',
    },
    successInfoText: {
        flex: 1,
        fontSize: 14,
        color: '#1E40AF',
        marginLeft: 12,
        lineHeight: 20,
    },
    primaryButton: {
        width: '100%',
        backgroundColor: '#018f64',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#018f64',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    primaryButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});
