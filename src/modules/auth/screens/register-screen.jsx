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
    Keyboard,
    ScrollView // <--- Importante para que quepan todos los campos
} from 'react-native';
import { Text, TextInput, Button, IconButton } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { GoogleIcon } from '../../../shared/svgs/google'; // Asegúrate de tener este componente o quítalo si da error

const { width, height } = Dimensions.get('window');

export const RegisterScreen = ({ navigation }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { control, handleSubmit, watch, formState: { errors } } = useForm({
        defaultValues: {
            fullName: '',
            email: '',
            password: '',
            confirmPassword: ''
        }
    });
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const onSubmit = (data) => {
        console.log("Datos de registro:", data);
        // Aquí iría la lógica de registro (Firebase/Backend)
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'android' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'android' ? -100 : 0}
            >
                {/* 1. HEADER CON BOTÓN VOLVER */}
                <View style={styles.header}>
                    {/* Botón flotante para volver */}
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <IconButton icon="arrow-left" iconColor="#000" size={24} />
                        <Text style={styles.backText}>Volver</Text>
                    </TouchableOpacity>

                    <Image
                        source={require('../../../../assets/reciclaje.png')} // Puedes usar otra imagen si tienes
                        style={styles.illustration}
                        resizeMode="contain"
                    />
                </View>

                {/* 2. FORMULARIO DE REGISTRO */}
                <View style={styles.formContainer}>
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }} bounces={false}>

                        <Text variant="headlineMedium" style={styles.title}>Crea tu cuenta</Text>
                        <Text style={styles.subtitle}>Ayúdanos a limpiar un poco el planeta</Text>

                        {/* Input Nombre */}
                        <Controller
                            control={control}
                            name="fullName"
                            rules={{ required: true }}
                            render={({ field: { onChange, value } }) => (
                                <TextInput
                                    mode="flat"
                                    placeholder="Nombres Completos:"
                                    placeholderTextColor="#384745"

                                    style={styles.input}
                                    value={value}
                                    onChangeText={onChange}
                                    underlineColor="transparent"
                                    activeUnderlineColor="transparent"
                                    left={<TextInput.Icon icon="account" color="#000000" />}
                                />
                            )}
                        />

                        {/* Input Email */}
                        <Controller
                            control={control}
                            name="email"
                            rules={{ required: true, validate: (val) => validateEmail(val) }}
                            render={({ field: { onChange, value } }) => (
                                <TextInput
                                    mode="flat"
                                    placeholder="Email:"
                                    placeholderTextColor="#384745"

                                    style={styles.input}
                                    value={value}
                                    onChangeText={onChange}
                                    underlineColor="transparent"
                                    activeUnderlineColor="transparent"
                                    left={<TextInput.Icon icon="email" color="#000000" />}
                                />
                            )}
                        />

                        {/* Input Password */}
                        <Controller
                            control={control}
                            name="password"
                            rules={{ required: true }}
                            render={({ field: { onChange, value } }) => (
                                <TextInput
                                    mode="flat"
                                    placeholder="Contraseña:"
                                    placeholderTextColor="#384745"
                                    secureTextEntry={!showPassword}
                                    style={styles.input}
                                    value={value}
                                    onChangeText={onChange}

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

                        {/* Input Confirm Password */}
                        <Controller
                            control={control}
                            name="confirmPassword"
                            rules={{
                                required: true,
                                validate: (val) => {
                                    if (watch('password') != val) {
                                        return "Las contraseñas no coinciden";
                                    }
                                }
                            }}
                            render={({ field: { onChange, value } }) => (
                                <TextInput
                                    mode="flat"
                                    placeholder="Confirmar Contraseña:"
                                    placeholderTextColor="#384745"
                                    style={styles.input}
                                    value={value}
                                    onChangeText={onChange}
                                    secureTextEntry={!showConfirmPassword}
                                    underlineColor="transparent"
                                    activeUnderlineColor="transparent"
                                    left={<TextInput.Icon icon="lock-check" color="#000000" />}
                                    right={
                                        <TextInput.Icon
                                            icon={showConfirmPassword ? "eye-off" : "eye"}
                                            color="#000000"
                                            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                            forceTextInputFocus={false}
                                        />
                                    }
                                />
                            )}
                        />

                        {/* Botón Registrarse */}
                        <Button
                            mode="contained"
                            onPress={handleSubmit(onSubmit)}
                            style={styles.registerBtn}
                            labelStyle={{ fontSize: 16 }}
                        >
                            Registrarse
                        </Button>

                        {/* Botón Google */}
                        <Button
                            mode="contained"
                            icon={() => <GoogleIcon />}
                            onPress={() => console.log('Google Register')}
                            style={styles.googleBtn}
                            labelStyle={{ color: '#000000', fontSize: 16 }}
                        >
                            Regístrate con Google
                        </Button>

                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        fontFamily: 'InclusiveSans-Regular',
        flex: 1,
        backgroundColor: '#b1eedc', // Cielo
    },
    header: {
        height: height * 0.43, // Un poco más corto que el login para dar espacio a los campos
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginBottom: -height * 0.045,
        zIndex: 1,
        position: 'relative',
    },
    backButton: {
        position: 'absolute',
        top: 50, // Ajustar según safe area
        left: 10,
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 10,
    },
    backText: {
        fontSize: 16,
        fontFamily: 'InclusiveSans-Regular',
        color: '#000',
        marginLeft: -10,
    },
    illustration: {
        width: width,
        height: '80%',
        maxHeight: 300,
    },
    formContainer: {
        backgroundColor: '#018f64', // Pasto
        flex: 1,
        paddingHorizontal: 25,
        paddingTop: 25,
        paddingBottom: 25,
        minHeight: height * 0.7, // Asegura que cubra el fondo
    },
    title: {
        color: '#000000',
        fontSize: 22,
        fontFamily: 'InclusiveSans-Regular',
        marginBottom: 5,
        textAlign: 'left',
    },
    subtitle: {
        color: '#000000',
        fontSize: 16,
        marginBottom: 20,
    },
    input: {
        backgroundColor: '#B7ECDD',
        borderRadius: 12,
        marginBottom: 12,
        height: 50,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        overflow: 'hidden',

    },

    registerBtn: {
        fontFamily: 'InclusiveSans-Regular',
        backgroundColor: '#31253B',
        borderRadius: 12,
        paddingVertical: 4,
        marginTop: 10,
        marginBottom: 10,
        fontSize: 16,
    },
    googleBtn: {
        fontFamily: 'InclusiveSans-Regular',
        backgroundColor: '#00C7A1',
        borderRadius: 12,
        paddingVertical: 4,
        fontSize: 16,
    },
});