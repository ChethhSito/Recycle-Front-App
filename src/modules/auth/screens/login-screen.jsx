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

const { width, height } = Dimensions.get('window');

export const LoginScreen = ({ navigation, onLogin }) => {
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

    const onSubmit = (data) => {
        console.log(data);
        navigation.navigate('Home');
    };

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

    // Función de acceso rápido para desarrollo
    const quickLogin = () => {
        setValue('email', 'admin@gmail.com');
        setValue('password', '123456');
        setTimeout(() => {
            navigation.navigate('Home');
        }, 300);
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
                    >
                        Iniciar Sesión
                    </Button>

                    {/* Botón de Acceso Rápido para Desarrollo */}
                    <Button
                        mode="outlined"
                        onPress={quickLogin}
                        style={styles.devBtn}
                        labelStyle={{ color: '#00926F', fontSize: 14 }}
                    >
                        ⚡ Acceso Rápido (Dev)
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