import React, { useState } from 'react';
import {
    View, StyleSheet, TouchableOpacity, Dimensions,
    KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ScrollView, Alert
} from 'react-native';
import { Text, TextInput, Button, IconButton } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { handleResetPassword } from '../../../api/auth/gmail'; // Importamos la función de reset

const { width, height } = Dimensions.get('window');

export const ResetPasswordScreen = ({ navigation, route }) => {
    // Recibimos el email de la pantalla anterior
    const { email } = route.params || {};

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { control, handleSubmit, formState: { errors }, watch } = useForm({
        defaultValues: {
            code: '',
            newPassword: '',
            confirmPassword: ''
        }
    });

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            // 1. Llamamos a la API para cambiar la contraseña
            await handleResetPassword(email, data.code, data.newPassword);

            // 2. Éxito
            Alert.alert(
                "¡Éxito!",
                "Tu contraseña ha sido actualizada.",
                [{ text: "Iniciar Sesión", onPress: () => navigation.navigate('Login') }] // O 'Auth' según tu navegación
            );

        } catch (error) {
            Alert.alert("Error", error.message || "Código incorrecto o expirado.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'android' ? 'padding' : 'height'}
            >
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <IconButton icon="arrow-left" iconColor="#000" size={24} />
                        <Text style={styles.backText}>Volver</Text>
                    </TouchableOpacity>
                    {/* Puedes poner otra imagen o texto aquí si quieres */}
                </View>

                <View style={styles.formContainer}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Text variant="headlineMedium" style={styles.title}>Restablecer Contraseña</Text>
                        <Text style={styles.subtitle}>
                            Hemos enviado un código a: {email}
                        </Text>

                        {/* INPUT CÓDIGO */}
                        <Controller
                            control={control}
                            name="code"
                            rules={{ required: true, minLength: 4 }}
                            render={({ field: { onChange, value } }) => (
                                <TextInput
                                    mode="flat"
                                    placeholder="Código de 4 dígitos:"
                                    placeholderTextColor="#384745"
                                    style={styles.input}
                                    value={value}
                                    keyboardType="numeric"
                                    maxLength={4}
                                    onChangeText={onChange}
                                    underlineColor="transparent"
                                    activeUnderlineColor="transparent"
                                    left={<TextInput.Icon icon="numeric" color="#000" />}
                                />
                            )}
                        />

                        {/* INPUT NUEVA CONTRASEÑA */}
                        <Controller
                            control={control}
                            name="newPassword"
                            rules={{ required: true, minLength: { value: 6, message: "Mínimo 6 caracteres" } }}
                            render={({ field: { onChange, value } }) => (
                                <TextInput
                                    mode="flat"
                                    placeholder="Nueva Contraseña:"
                                    placeholderTextColor="#384745"
                                    style={styles.input}
                                    value={value}
                                    secureTextEntry={!showPassword}
                                    onChangeText={onChange}
                                    underlineColor="transparent"
                                    activeUnderlineColor="transparent"
                                    left={<TextInput.Icon icon="lock" color="#000" />}
                                    right={<TextInput.Icon icon={showPassword ? "eye-off" : "eye"} onPress={() => setShowPassword(!showPassword)} />}
                                />
                            )}
                        />

                        {/* CONFIRMAR CONTRASEÑA */}
                        <Controller
                            control={control}
                            name="confirmPassword"
                            rules={{
                                required: true,
                                validate: val => val === watch('newPassword') || "Las contraseñas no coinciden"
                            }}
                            render={({ field: { onChange, value } }) => (
                                <TextInput
                                    mode="flat"
                                    placeholder="Confirmar Contraseña:"
                                    placeholderTextColor="#384745"
                                    style={styles.input}
                                    value={value}
                                    secureTextEntry={!showPassword}
                                    onChangeText={onChange}
                                    underlineColor="transparent"
                                    activeUnderlineColor="transparent"
                                    left={<TextInput.Icon icon="lock-check" color="#000" />}
                                />
                            )}
                        />
                        {errors.confirmPassword && <Text style={{ color: 'orange', textAlign: 'center' }}>{errors.confirmPassword.message}</Text>}

                        <Button
                            mode="contained"
                            onPress={handleSubmit(onSubmit)}
                            style={styles.registerBtn}
                            labelStyle={{ fontSize: 16, color: '#000' }}
                            loading={loading}
                            disabled={loading}
                        >
                            {loading ? "Actualizando..." : "Cambiar Contraseña"}
                        </Button>

                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
};

// Reutilizamos los mismos estilos para mantener la consistencia
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#b1eedc' },
    header: { height: height * 0.15, justifyContent: 'center' }, // Header más pequeño
    backButton: { position: 'absolute', top: 50, left: 10, flexDirection: 'row', alignItems: 'center', zIndex: 10 },
    backText: { fontSize: 16, color: '#000', marginLeft: -10 },
    formContainer: { backgroundColor: '#018f64', flex: 1, paddingHorizontal: 25, paddingTop: 35, borderTopLeftRadius: 30, borderTopRightRadius: 30 },
    title: { color: '#000', fontSize: 22, textAlign: 'center', marginBottom: 5 },
    subtitle: { color: '#000', fontSize: 14, textAlign: 'center', marginBottom: 20, opacity: 0.8 },
    input: { backgroundColor: '#B7ECDD', borderRadius: 12, marginBottom: 12, height: 50, borderTopLeftRadius: 12, borderTopRightRadius: 12, overflow: 'hidden' },
    registerBtn: { backgroundColor: '#FAC96E', borderRadius: 12, paddingVertical: 4, marginTop: 10, marginBottom: 10 },
});