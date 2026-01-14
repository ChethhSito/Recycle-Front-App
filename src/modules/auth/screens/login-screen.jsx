import React, { useState } from 'react';
import {
    View,
    Image,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard
} from 'react-native';

import { Text, TextInput, Button, useTheme, HelperText, Snackbar } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { GoogleIcon } from '../../../shared/svgs/google';
import { handleGoogleLogin } from '../../../api/auth/google';
import { handleManualLogin } from '../../../api/auth/manual';
import { useDispatch } from 'react-redux';
import { login } from '../../../store/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
const { width, height } = Dimensions.get('window');

export const LoginScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const theme = useTheme();
    const [showPassword, setShowPassword] = useState(false);

    // Configuración del formulario
    const { control, handleSubmit, formState: { errors }, setValue } = useForm({
        defaultValues: { email: '', password: '' }
    });

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email) || "Correo inválido";
    };

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            console.log("Enviando login:", data.email);
            
            // Verificar si hay suspensión activa
            const suspensionData = await AsyncStorage.getItem('account_suspended');
            if (suspensionData) {
                const suspension = JSON.parse(suspensionData);
                
                // Calcular si aún está dentro de los 30 días
                const suspensionDate = new Date(suspension.suspensionDate);
                const deletionDate = new Date(suspensionDate);
                deletionDate.setDate(deletionDate.getDate() + 30);
                
                const today = new Date();
                
                if (today < deletionDate) {
                    // Cuenta aún está suspendida, navegar a RestorationScreen
                    console.log('Cuenta suspendida detectada, navegando a RestaurarCuenta');
                    navigation.replace('RestaurarCuenta');
                    setLoading(false);
                    return;
                } else {
                    // Ya pasaron los 30 días, eliminar datos
                    await AsyncStorage.removeItem('account_suspended');
                    Alert.alert(
                        'Cuenta Eliminada',
                        'Tu cuenta fue eliminada después de 30 días de suspensión.',
                        [{ text: 'Entendido' }]
                    );
                    setLoading(false);
                    return;
                }
            }
            
            const result = await handleManualLogin(data.email, data.password);
            console.log("Token recibido:", result.access_token);
            await AsyncStorage.setItem('user_token', result.access_token);
            dispatch(login({
                token: result.access_token,
                // user: result.user (si tu backend devuelve datos del usuario aquí)
            }));
        } catch (error) {
            Alert.alert("Error de Acceso", error.message);
        } finally {
            setLoading(false);
        }
    };

    const onGooglePress = async () => {
        if (googleLoading) return;

        setGoogleLoading(true);

        try {
            const token = await handleGoogleLogin();

            if (token) {
                console.log("Login exitoso");
                await AsyncStorage.setItem('user_token', token);
                dispatch(login(token));
            } else {
                console.log("Usuario canceló el login");
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Inténtalo de nuevo.");
        } finally {
            setGoogleLoading(false);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'android' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'android' ? 0 : 20}
            >
                {/* 1. ILUSTRACIÓN SUPERIOR */}
                <View style={styles.header}>
                    <Image
                        alt='Recycle'
                        source={require('../../../../assets/reciclaje.png')}
                        style={styles.illustration}
                        resizeMode="contain"
                    />
                </View>

                {/* 2. FORMULARIO */}
                <View style={styles.formContainer}>
                    <Text variant="headlineMedium" style={styles.title}>Inicia Sesión</Text>

                    <Controller
                        control={control}
                        name="email"
                        rules={{ validate: validateEmail }}
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                mode="flat"
                                placeholder="Email:"
                                placeholderTextColor="#000000"
                                style={styles.input}
                                value={value}
                                onChangeText={onChange}
                                underlineColor="transparent"
                                activeUnderlineColor="transparent"
                                left={<TextInput.Icon icon="email" color="#000000" />}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="password"
                        rules={{ required: true }}
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                mode="flat"
                                placeholder="Contraseña:"
                                placeholderTextColor="#000000"
                                style={styles.input}
                                value={value}
                                onChangeText={onChange}
                                secureTextEntry={!showPassword}
                                underlineColor="transparent"
                                activeUnderlineColor="transparent"
                                left={<TextInput.Icon icon="lock" color="#000000" />}
                                right={
                                    <TextInput.Icon
                                        icon={showPassword ? "eye-off" : "eye"}
                                        color="#000000"
                                        onPress={() => setShowPassword(!showPassword)}
                                        forceTextInputFocus={false}
                                    />
                                }
                            />
                        )}
                    />

                    <TouchableOpacity>
                        <Text style={styles.forgotPass} onPress={() => navigation.navigate('Recover')}>¿Olvidaste tu contraseña?</Text>
                    </TouchableOpacity>

                    <Button
                        mode="contained"
                        onPress={handleSubmit(onSubmit)}
                        style={styles.loginBtn}
                        labelStyle={{ fontSize: 16 }}
                        loading={loading}    // Muestra ruedita
                        disabled={loading}   // Evita doble click
                    >
                        {loading ? "Entrando..." : "Iniciar Sesión"}
                    </Button>
                    <Button
                        mode="contained"
                        icon={() => <GoogleIcon />}
                        loading={googleLoading}
                        disabled={googleLoading}
                        onPress={onGooglePress}
                        style={styles.googleBtn}
                        labelStyle={{ color: '#000000', fontSize: 16 }}
                    >
                        Iniciar sesión con Google
                    </Button>

                    <View style={styles.registerContainer}>
                        <Text style={{ color: '#000000', fontSize: 16 }}>¿Aún no tienes Cuenta? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                            <Text style={{ color: '#fff', fontSize: 16 }}>Regístrate</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        fontFamily: 'InclusiveSans-Regular',
        flex: 1,
        backgroundColor: '#b1eedc',
    },
    header: {
        height: height * 0.40,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 0,
        marginBottom: -30,
        zIndex: 1,
    },
    illustration: {
        width: width,
        height: '85%',
        maxHeight: 300,
    },
    formContainer: {
        backgroundColor: '#018f64',
        flex: 1,
        paddingHorizontal: 25,
        paddingTop: 25,
        minHeight: height,
        paddingBottom: 20,
    },
    title: {
        color: '#000000',
        fontSize: 22,
        marginBottom: 20,
        textAlign: 'left',
    },
    input: {
        backgroundColor: '#B7ECDD',
        borderRadius: 12,
        marginBottom: 15,
        height: 55,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        overflow: 'hidden',
    },
    forgotPass: {
        alignSelf: 'flex-end',
        color: '#000000',
        marginBottom: 20,
        fontSize: 16,
    },
    loginBtn: {
        fontFamily: 'InclusiveSans-Regular',
        backgroundColor: '#31253B',
        borderRadius: 12,
        paddingVertical: 4,
        marginBottom: 15,
    },
    devBtn: {
        marginTop: 10,
        borderRadius: 12,
        borderColor: '#00926F',
        borderWidth: 2,
        marginBottom: 15,
    },
    googleBtn: {
        fontFamily: 'InclusiveSans-Regular',
        backgroundColor: '#00C7A1',
        borderRadius: 12,
        paddingVertical: 4,
        fontSize: 16,
    },
    registerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },

});