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

const { width, height } = Dimensions.get('window');

export const LoginScreen = ({ navigation, onLogin }) => {
    const theme = useTheme();
    const [showPassword, setShowPassword] = useState(false);
    const [showEmailError, setShowEmailError] = useState(false);
    
    // Configuración del formulario
    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: { email: '', password: '' }
    });

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const valid = emailRegex.test(email);
        setShowEmailError(!valid); // Si no es válido, muestra el error
        return valid || "Correo inválido";
    };

    const onSubmit = (data) => {
        console.log(data);
        // Validación con credenciales hardcodeadas
        if (data.email === 'admin@gmail.com' && data.password === '123456') {
            console.log('Login exitoso');
            if (onLogin) onLogin();
        } else {
            alert('Credenciales incorrectas. Use: admin@gmail.com / 123456');
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
                            <View>
                                <TextInput

                                    mode="flat"
                                    placeholder="Email:"
                                    placeholderTextColor="#000000"
                                    style={styles.input}
                                    value={value}
                                    onChangeText={(text) => {
                                        onChange(text);
                                        if (showEmailError) setShowEmailError(false); // Ocultar error al escribir
                                    }}
                                    underlineColor="transparent"
                                    activeUnderlineColor="transparent"
                                    left={<TextInput.Icon icon="email" color="#000000" />}
                                />

                            </View>
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
                        <Text style={styles.forgotPass}>¿Olvidaste tu contraseña?</Text>
                    </TouchableOpacity>

                    <Button
                        mode="contained"
                        onPress={handleSubmit(onSubmit)}
                        style={styles.loginBtn}
                        labelStyle={{ fontSize: 16 }}
                    >
                        Iniciar Sesión
                    </Button>

                    <Button
                        mode="contained"
                        icon={() => <GoogleIcon />}
                        onPress={() => console.log('Google Login')}
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
                <Snackbar

                    visible={showEmailError}
                    onDismiss={() => setShowEmailError(false)} // <--- IMPORTANTE: Cierra el snackbar
                    duration={3000} // <--- IMPORTANTE: Dura 3 segundos
                    style={{ backgroundColor: '#31253B', borderRadius: 12, marginBottom: height * 0.035 }}
                    action={{
                        label: 'OK',
                        onPress: () => setShowEmailError(false),
                    }}
                >
                    Por favor, ingresa un correo válido.
                </Snackbar>
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