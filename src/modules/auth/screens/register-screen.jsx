import React, { useState } from 'react';
import {
    View, Image, StyleSheet, TouchableOpacity, Dimensions, KeyboardAvoidingView,
    Platform, TouchableWithoutFeedback, Keyboard, ScrollView
} from 'react-native';
import { Text, TextInput, Button, IconButton } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GoogleIcon } from '../../../shared/svgs/google';
import { handleGoogleLogin } from '../../../api/auth/google';

const { width, height } = Dimensions.get('window');

export const RegisterScreen = ({ navigation }) => {
    const [role, setRole] = useState('citizen');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [googleUser, setGoogleUser] = useState(null);
    const [googleError, setGoogleError] = useState(null);
    const [googleToken, setGoogleToken] = useState(null);

    const onGooglePress = async () => {
        // 1. Evitar que el usuario spamee el botón
        if (googleLoading) return;

        setGoogleLoading(true); // Bloqueamos el botón
        console.log("Iniciando proceso de Google..."); // Log para verificar que el botón responde

        try {
            const token = await handleGoogleLogin();

            if (token) {
                console.log("Login exitoso");
                // Guardar token y navegar...
                navigation.replace('Home');
            } else {
                console.log("Usuario canceló el login");
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Inténtalo de nuevo.");
        } finally {
            // 2. IMPORTANTE: Desbloquear el botón SIEMPRE, haya error o éxito
            setGoogleLoading(false);
        }
    };


    const { control, handleSubmit, watch, formState: { errors } } = useForm({
        defaultValues: {
            fullName: '',
            email: '',
            phone: '',
            password: '',
            confirmPassword: ''
        }
    });

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const onSubmit = (data) => {
        const registrationData = { ...data, role };
        console.log("Datos de registro:", registrationData);
        // Lógica de backend...
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            {/* Usamos un View normal como contenedor principal */}
            <View style={styles.mainContainer}>

                {/* Botón Volver Flotante (Fijo arriba) */}
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
                        {/* 1. ILUSTRACIÓN (Ahora dentro del scroll) */}
                        <View style={styles.illustrationContainer}>
                            <Image
                                source={require('../../../../assets/reciclaje.png')}
                                style={styles.illustration}
                                resizeMode="contain"
                            />
                        </View>

                        {/* 2. FORMULARIO */}
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

                            {/* Inputs */}
                            <Controller
                                control={control} name="fullName" rules={{ required: true }}
                                render={({ field: { onChange, value } }) => (
                                    <TextInput
                                        mode="flat" placeholder={role === 'citizen' ? "Nombres Completos:" : "Nombres Completos:"}
                                        placeholderTextColor="#384745" style={styles.input} value={value} onChangeText={onChange}
                                        underlineColor="transparent" activeUnderlineColor="transparent"
                                        left={<TextInput.Icon icon="account" color="#000000" />}
                                    />
                                )}
                            />

                            {role === 'recycler' && (
                                <Controller
                                    control={control} name="phone" rules={{ required: true }}
                                    render={({ field: { onChange, value } }) => (
                                        <TextInput
                                            mode="flat" placeholder="Numero de documento:" placeholderTextColor="#384745"
                                            style={styles.input} value={value} onChangeText={onChange} keyboardType="phone-pad"
                                            underlineColor="transparent" activeUnderlineColor="transparent"
                                            left={<TextInput.Icon icon="text-box" color="#000000" />}
                                        />
                                    )}
                                />
                            )}

                            <Controller
                                control={control} name="email" rules={{ required: true, validate: validateEmail }}
                                render={({ field: { onChange, value } }) => (
                                    <TextInput
                                        mode="flat" placeholder="Email:" placeholderTextColor="#384745" style={styles.input}
                                        value={value} onChangeText={onChange} underlineColor="transparent" activeUnderlineColor="transparent"
                                        left={<TextInput.Icon icon="email" color="#000000" />}
                                    />
                                )}
                            />

                            <Controller
                                control={control} name="password" rules={{ required: true }}
                                render={({ field: { onChange, value } }) => (
                                    <TextInput
                                        mode="flat" placeholder="Contraseña:" placeholderTextColor="#384745" secureTextEntry={!showPassword}
                                        style={styles.input} value={value} onChangeText={onChange} underlineColor="transparent" activeUnderlineColor="transparent"
                                        left={<TextInput.Icon icon="lock" color="#000000" />}
                                        right={<TextInput.Icon icon={showPassword ? "eye-off" : "eye"} color="#000000" onPress={() => setShowPassword(!showPassword)} />}
                                    />
                                )}
                            />

                            <Controller
                                control={control} name="confirmPassword"
                                rules={{ required: true, validate: (val) => watch('password') === val || "Las contraseñas no coinciden" }}
                                render={({ field: { onChange, value } }) => (
                                    <TextInput
                                        mode="flat" placeholder="Confirmar Contraseña:" placeholderTextColor="#384745" style={styles.input}
                                        value={value} onChangeText={onChange} secureTextEntry={!showConfirmPassword}
                                        underlineColor="transparent" activeUnderlineColor="transparent"
                                        left={<TextInput.Icon icon="lock-check" color="#000000" />}
                                        right={<TextInput.Icon icon={showConfirmPassword ? "eye-off" : "eye"} color="#000000" onPress={() => setShowConfirmPassword(!showConfirmPassword)} />}
                                    />
                                )}
                            />

                            {/* Botones */}
                            <View style={{ marginTop: 10, paddingBottom: 30 }}>
                                <Button mode="contained" onPress={handleSubmit(onSubmit)} style={styles.registerBtn} labelStyle={{ fontSize: 16 }}>
                                    {role === 'citizen' ? 'Registrarse' : 'Registrarme como Reciclador'}
                                </Button>
                                <Button mode="contained" icon={() => <GoogleIcon />} onPress={onGooglePress} loading={googleLoading} disabled={googleLoading} style={styles.googleBtn} labelStyle={{ color: '#000000', fontSize: 16 }}>
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
    mainContainer: {
        flex: 1,
        backgroundColor: '#b1eedc', // Fondo cielo
    },
    backButton: {
        position: 'absolute', top: 50, left: 10,
        flexDirection: 'row', alignItems: 'center', zIndex: 10,
    },
    backText: {
        fontSize: 16, fontFamily: 'InclusiveSans-Regular', color: '#000', marginLeft: -10,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'flex-end', // Empuja el contenido hacia abajo
        paddingTop: 80, // Espacio para el botón de volver
    },
    illustrationContainer: {
        alignItems: 'center',
        marginBottom: -30, // Superposición con el formulario
        zIndex: 1,
    },
    illustration: {
        width: width * 1,
        height: height * 0.3, // Altura proporcional
        maxHeight: 280,
    },
    formSection: {
        backgroundColor: '#018f64', // Fondo pasto

        paddingHorizontal: 25,
        paddingTop: 20,
        paddingBottom: 20,
        width: '100%',
    },
    title: { color: '#000', fontSize: 24, fontFamily: 'InclusiveSans-Bold', marginBottom: 5 },
    subtitle: { color: '#000', fontSize: 14, marginBottom: 20, opacity: 0.8 },

    // SELECTOR ROL (Igual que antes)
    roleContainer: { flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: 12, padding: 4, marginBottom: 20 },
    roleButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: 10, gap: 8 },
    roleButtonActive: { backgroundColor: '#31253B', elevation: 5 },
    roleText: { color: '#31253B', fontWeight: 'bold', fontSize: 14 },
    roleTextActive: { color: '#FFF' },

    input: { backgroundColor: '#B7ECDD', borderRadius: 12, marginBottom: 12, height: 50, borderTopLeftRadius: 12, borderTopRightRadius: 12, overflow: 'hidden' },
    registerBtn: { backgroundColor: '#31253B', borderRadius: 12, paddingVertical: 6, marginBottom: 15 },
    googleBtn: { backgroundColor: '#00C7A1', borderRadius: 12, paddingVertical: 6 },
});