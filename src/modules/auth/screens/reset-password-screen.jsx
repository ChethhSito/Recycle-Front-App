import React, { useState } from 'react';
import {
    View, StyleSheet, TouchableOpacity, Dimensions,
    KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ScrollView, Alert
} from 'react-native';
import { Text, TextInput, Button, IconButton } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Importamos iconos
import { handleResetPassword } from '../../../api/auth/gmail';

const { width, height } = Dimensions.get('window');

export const ResetPasswordScreen = ({ navigation, route }) => {
    // Obtenemos el email pasado desde RecoverScreen
    const { email } = route.params || {};

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
            await handleResetPassword(email, data.code, data.newPassword);

            Alert.alert(
                "¡Éxito!",
                "Tu contraseña ha sido actualizada.",
                [{
                    text: "Iniciar Sesión",
                    onPress: () => navigation.reset({ index: 0, routes: [{ name: 'Login' }] })
                }]
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
                {/* Botón Volver */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <IconButton icon="arrow-left" iconColor="#000" size={24} />
                        <Text style={styles.backText}>Volver</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.formContainer}>
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>

                        {/* --- AQUÍ ESTÁ EL ICONO CON ESTILO CIRCULAR --- */}
                        <View style={styles.headerIcon}>
                            <View style={styles.iconCircle}>
                                {/* Usamos un candado con check para indicar "Restablecer" */}
                                <MaterialCommunityIcons name="lock-check-outline" color="#F59E0B" size={64} />
                            </View>
                        </View>

                        <Text variant="headlineMedium" style={styles.title}>Restablecer Contraseña</Text>
                        <Text style={styles.subtitle}>
                            Ingresa el código de 4 dígitos enviado a: {'\n'}
                            <Text style={{ fontWeight: 'bold', color: '#004D40' }}>{email}</Text>
                        </Text>

                        {/* INPUT CÓDIGO */}
                        <Controller
                            control={control}
                            name="code"
                            rules={{ required: true, minLength: 4 }}
                            render={({ field: { onChange, value } }) => (
                                <TextInput
                                    mode="flat"
                                    placeholder="Código:"
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
                                    secureTextEntry={!showConfirmPassword}
                                    onChangeText={onChange}
                                    underlineColor="transparent"
                                    activeUnderlineColor="transparent"
                                    left={<TextInput.Icon icon="lock-check" color="#000" />}
                                    right={<TextInput.Icon icon={showConfirmPassword ? "eye-off" : "eye"} onPress={() => setShowConfirmPassword(!showConfirmPassword)} />}
                                />
                            )}
                        />
                        {errors.confirmPassword && <Text style={{ color: '#D32F2F', textAlign: 'center', marginBottom: 10 }}>{errors.confirmPassword.message}</Text>}

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

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#b1eedc' },
    header: { height: 120, justifyContent: 'center' }, // Header más pequeño
    backButton: { position: 'absolute', top: 40, left: 10, flexDirection: 'row', alignItems: 'center', zIndex: 10 },
    backText: { fontSize: 16, color: '#000', marginLeft: -10 },

    formContainer: {
        backgroundColor: '#018f64',
        flex: 1,
        paddingHorizontal: 25,
        paddingTop: 20,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30
    },

    // --- ESTILOS DEL ICONO CIRCULAR (Copiados de RestorationScreen) ---
    headerIcon: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 30, // Margen inferior grande para empujar los inputs hacia abajo
    },
    iconCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(255, 255, 255, 0.15)', // Efecto cristal
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },

    title: { color: '#000', fontSize: 24, textAlign: 'center', marginBottom: 10, fontWeight: 'bold' },
    subtitle: { color: '#000', fontSize: 15, textAlign: 'center', marginBottom: 30, opacity: 0.9, lineHeight: 22 },

    input: { backgroundColor: '#B7ECDD', borderRadius: 12, marginBottom: 15, height: 55, borderTopLeftRadius: 12, borderTopRightRadius: 12, overflow: 'hidden' },
    registerBtn: { backgroundColor: '#FAC96E', borderRadius: 12, paddingVertical: 6, marginTop: 10, marginBottom: 20 },
});