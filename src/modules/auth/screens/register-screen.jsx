import React, { useState, useEffect } from 'react';
import {
    View, Image, StyleSheet, TouchableOpacity, Dimensions, KeyboardAvoidingView,
    Platform, TouchableWithoutFeedback, Keyboard, ScrollView, Alert
} from 'react-native';
import { Text, TextInput, Button, IconButton } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GoogleIcon } from '../../../shared/svgs/google';
import { handleGoogleLogin } from '../../../api/auth/google'; // Google lo dejamos igual por ahora
import { useAuthStore } from '../../../hooks/use-auth-store'; // ✅ IMPORTANTE


const { width, height } = Dimensions.get('window');

export const RegisterScreen = ({ navigation }) => {

    // 1. USAR EL HOOK (Extraemos lo necesario)
    // Extraemos startRegister, status y errorMessage
    const { startRegister, status, errorMessage } = useAuthStore();

    // Estado de carga derivado de Redux
    const isLoading = status === 'checking';

    const [role, setRole] = useState('citizen');
    const [googleLoading, setGoogleLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { control, handleSubmit, watch, formState: { errors } } = useForm({
        defaultValues: {
            fullName: '',
            email: '',
            documentNumber: '',
            phone: '',
            password: '',
            confirmPassword: ''
        }
    });

    // 2. EFECTO PARA ERRORES
    // Si el registro falla, mostramos la alerta automáticamente
    useEffect(() => {
        if (errorMessage) {
            // Si errorMessage es un Array (Lista), lo unimos con saltos de línea. Si es texto, lo dejamos igual.
            const msg = Array.isArray(errorMessage)
                ? errorMessage.join('\n')
                : typeof errorMessage === 'object' // Por si acaso devuelve un objeto raro
                    ? JSON.stringify(errorMessage)
                    : errorMessage;

            Alert.alert('Error de Registro', msg);
        }
    }, [errorMessage]);

    const validateEmail = (email) => {
        // 1. Regex estándar más robusto
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        // 2. Importante: Validamos sobre el texto sin espacios (trim)
        return emailRegex.test(email.trim()) || "Correo inválido";
    };

    const onSubmit = (data) => {
        // Validación de contraseñas
        if (data.password !== data.confirmPassword) {
            Alert.alert("Error", "Las contraseñas no coinciden");
            return;
        }

        // 3. LLAMADA AL HOOK (Sin try-catch, el hook lo maneja)
        startRegister({
            fullName: data.fullName,
            email: data.email,
            password: data.password,
            role: role === 'citizen' ? 'CITIZEN' : 'RECYCLER',
            authProvider: 'local',
            // Solo enviamos datos extra si es reciclador
            ...(role === 'recycler' && {
                phone: data.phone,
                documentNumber: data.documentNumber
            })
        });
    };

    const onGooglePress = async () => {
        if (googleLoading) return;
        setGoogleLoading(true);
        try {
            const token = await handleGoogleLogin();
            if (token) {
                // Si quieres manejar Google con Redux, podrías crear un startLoginWithToken(token) en tu hook
                // Por ahora, si navega solo, está bien, pero lo ideal es conectarlo al store.
                console.log("Token Google:", token);
            }
        } catch (error) {
            Alert.alert("Error", "Inténtalo de nuevo.");
        } finally {
            setGoogleLoading(false);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.mainContainer}>

                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <IconButton icon="arrow-left" iconColor="#000" size={24} />
                    <Text style={styles.backText}>Volver</Text>
                </TouchableOpacity>

                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                >
                    <ScrollView
                        style={{ flex: 1 }}
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                        bounces={false}
                    >
                        <View style={styles.illustrationContainer}>
                            <Image
                                source={require('../../../../assets/reciclaje.png')}
                                style={styles.illustration}
                                resizeMode="contain"
                            />
                        </View>

                        <View style={styles.formSection}>
                            <Text variant="headlineMedium" style={styles.title}>Crea tu cuenta</Text>
                            <Text style={styles.subtitle}>
                                {role === 'citizen'
                                    ? "Ayúdanos a limpiar un poco el planeta"
                                    : "Únete a la red y genera ingresos reciclando"}
                            </Text>

                            {/* SELECTOR DE ROL */}
                            <View style={styles.roleContainer}>
                                <TouchableOpacity
                                    style={[styles.roleButton, role === 'citizen' && styles.roleButtonActive]}
                                    onPress={() => setRole('citizen')}
                                >
                                    <MaterialCommunityIcons name="human-greeting" size={20} color={role === 'citizen' ? '#FFF' : '#31253B'} />
                                    <Text style={[styles.roleText, role === 'citizen' && styles.roleTextActive]}>Ciudadano</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.roleButton, role === 'recycler' && styles.roleButtonActive]}
                                    onPress={() => setRole('recycler')}
                                >
                                    <MaterialCommunityIcons name="truck-delivery" size={20} color={role === 'recycler' ? '#FFF' : '#31253B'} />
                                    <Text style={[styles.roleText, role === 'recycler' && styles.roleTextActive]}>Reciclador</Text>
                                </TouchableOpacity>
                            </View>

                            {/* INPUTS */}
                            <Controller
                                control={control} name="fullName" rules={{ required: true }}
                                render={({ field: { onChange, value } }) => (
                                    <TextInput
                                        mode="flat" placeholder="Nombres Completos:"
                                        placeholderTextColor="#384745" style={styles.input} value={value} onChangeText={onChange}
                                        underlineColor="transparent" activeUnderlineColor="transparent"
                                        left={<TextInput.Icon icon="account" color="#000000" />}
                                        disabled={isLoading}
                                    />
                                )}
                            />

                            {role === 'recycler' && (
                                <>
                                    <Controller
                                        control={control} name="documentNumber"
                                        rules={{ required: "Requerido", minLength: { value: 8, message: "Mínimo 8 dígitos" } }}
                                        render={({ field: { onChange, value } }) => (
                                            <TextInput
                                                mode="flat" placeholder="DNI / Documento:"
                                                placeholderTextColor="#384745" style={styles.input} value={value} onChangeText={onChange}
                                                keyboardType="numeric" underlineColor="transparent" activeUnderlineColor="transparent"
                                                left={<TextInput.Icon icon="card-account-details" color="#000000" />}
                                                disabled={isLoading}
                                            />
                                        )}
                                    />
                                    <Controller
                                        control={control} name="phone" rules={{ required: true }}
                                        render={({ field: { onChange, value } }) => (
                                            <TextInput
                                                mode="flat" placeholder="Número de celular:"
                                                placeholderTextColor="#384745" style={styles.input} value={value} onChangeText={onChange}
                                                keyboardType="phone-pad" underlineColor="transparent" activeUnderlineColor="transparent"
                                                left={<TextInput.Icon icon="phone" color="#000000" />}
                                                disabled={isLoading}
                                            />
                                        )}
                                    />
                                </>
                            )}

                            <Controller
                                control={control} name="email" rules={{ required: true, validate: (text) => validateEmail(text) }}
                                render={({ field: { onChange, value } }) => (
                                    <TextInput
                                        mode="flat" placeholder="Email:" placeholderTextColor="#384745" style={styles.input}
                                        value={value} onChangeText={(text) => onChange(text.trim())} underlineColor="transparent" activeUnderlineColor="transparent"
                                        left={<TextInput.Icon icon="email" color="#000000" />}
                                        disabled={isLoading}
                                        autoCapitalize="none"
                                    />
                                )}
                            />

                            <Controller
                                control={control} name="password" rules={{ required: true }}
                                render={({ field: { onChange, value } }) => (
                                    <TextInput
                                        mode="flat" placeholder="Contraseña:" placeholderTextColor="#384745"
                                        secureTextEntry={!showPassword}
                                        style={styles.input} value={value} onChangeText={onChange} underlineColor="transparent" activeUnderlineColor="transparent"
                                        left={<TextInput.Icon icon="lock" color="#000000" />}
                                        right={<TextInput.Icon icon={showPassword ? "eye-off" : "eye"} onPress={() => setShowPassword(!showPassword)} />}
                                        disabled={isLoading}
                                    />
                                )}
                            />

                            <Controller
                                control={control} name="confirmPassword"
                                rules={{ required: true }}
                                render={({ field: { onChange, value } }) => (
                                    <TextInput
                                        mode="flat" placeholder="Confirmar Contraseña:" placeholderTextColor="#384745" style={styles.input}
                                        value={value} onChangeText={onChange}
                                        secureTextEntry={!showConfirmPassword}
                                        underlineColor="transparent" activeUnderlineColor="transparent"
                                        left={<TextInput.Icon icon="lock-check" color="#000000" />}
                                        right={<TextInput.Icon icon={showConfirmPassword ? "eye-off" : "eye"} onPress={() => setShowConfirmPassword(!showConfirmPassword)} />}
                                        disabled={isLoading}
                                    />
                                )}
                            />

                            <View style={{ marginTop: 10, paddingBottom: 30 }}>
                                <Button
                                    mode="contained"
                                    onPress={handleSubmit(onSubmit)}
                                    style={styles.registerBtn}
                                    labelStyle={{ fontSize: 16 }}
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Registrando...' : (role === 'citizen' ? 'Registrarse' : 'Registrarme como Reciclador')}
                                </Button>

                                <Button
                                    mode="contained"
                                    icon={() => <GoogleIcon />}
                                    onPress={onGooglePress}
                                    loading={googleLoading}
                                    disabled={googleLoading || isLoading}
                                    style={styles.googleBtn}
                                    labelStyle={{ color: '#000000', fontSize: 16 }}
                                >
                                    Regístrate con Google
                                </Button>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: '#b1eedc' },
    backButton: { position: 'absolute', top: 50, left: 10, flexDirection: 'row', alignItems: 'center', zIndex: 10 },
    backText: { fontSize: 16, fontFamily: 'InclusiveSans-Regular', color: '#000', marginLeft: -10 },
    scrollContent: { flexGrow: 1, justifyContent: 'flex-end', paddingTop: 80 },
    illustrationContainer: { alignItems: 'center', marginBottom: -30, zIndex: 1 },
    illustration: { width: width * 1, height: height * 0.3, maxHeight: 280 },
    formSection: { backgroundColor: '#018f64', paddingHorizontal: 25, paddingTop: 20, paddingBottom: 20, width: '100%' },
    title: { color: '#000', fontSize: 24, fontFamily: 'InclusiveSans-Bold', marginBottom: 5 },
    subtitle: { color: '#000', fontSize: 14, marginBottom: 20, opacity: 0.8 },
    roleContainer: { flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: 12, padding: 4, marginBottom: 20 },
    roleButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: 10, gap: 8 },
    roleButtonActive: { backgroundColor: '#31253B', elevation: 5 },
    roleText: { color: '#31253B', fontWeight: 'bold', fontSize: 14 },
    roleTextActive: { color: '#FFF' },
    input: { backgroundColor: '#B7ECDD', borderRadius: 12, marginBottom: 12, height: 50, borderTopLeftRadius: 12, borderTopRightRadius: 12, overflow: 'hidden' },
    registerBtn: { backgroundColor: '#31253B', borderRadius: 12, paddingVertical: 6, marginBottom: 15 },
    googleBtn: { backgroundColor: '#00C7A1', borderRadius: 12, paddingVertical: 6 },
});