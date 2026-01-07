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

export const TwoFactorInfoScreen = () => {
    const navigation = useNavigation();

    const handleBack = () => {
        navigation.goBack();
    };

    const handleStartPress = () => {
        navigation.navigate('TwoFactorMethod');
    };

    return (
        <View style={styles.container}>
            {/* Simple Header */}
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton} 
                    onPress={handleBack}
                    activeOpacity={0.7}
                >
                    <Icon name="arrow-left" size={24} color="#1F2937" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Verificación en 2 pasos</Text>
            </View>

            <ScrollView 
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.stepContainer}>
                    <View style={styles.iconCircle}>
                        <Icon name="shield" size={64} color="#10B981" />
                    </View>
                    
                    <Text style={styles.title}>Protege tu cuenta</Text>
                    
                    <Text style={styles.description}>
                        La verificación en 2 pasos añade una capa extra de seguridad a tu cuenta. 
                        Cada vez que inicies sesión, necesitarás ingresar un código único además de tu contraseña.
                    </Text>

                    <View style={styles.benefitsList}>
                        <View style={styles.benefitItem}>
                            <Icon name="check-circle" size={24} color="#10B981" />
                            <Text style={styles.benefitText}>Protección contra accesos no autorizados</Text>
                        </View>
                        <View style={styles.benefitItem}>
                            <Icon name="check-circle" size={24} color="#10B981" />
                            <Text style={styles.benefitText}>Alertas de intentos de inicio de sesión</Text>
                        </View>
                        <View style={styles.benefitItem}>
                            <Icon name="check-circle" size={24} color="#10B981" />
                            <Text style={styles.benefitText}>Mayor tranquilidad para tus datos</Text>
                        </View>
                    </View>

                    <TouchableOpacity 
                        style={styles.primaryButton}
                        onPress={handleStartPress}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.primaryButtonText}>Empezar</Text>
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
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    backButton: {
        padding: 4,
        marginRight: 16,
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
    iconCircle: {
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
    benefitsList: {
        width: '100%',
        marginBottom: 40,
    },
    benefitItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        paddingHorizontal: 8,
    },
    benefitText: {
        fontSize: 15,
        color: '#374151',
        marginLeft: 12,
        flex: 1,
        lineHeight: 22,
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
