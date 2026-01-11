import React, { useState } from 'react';
import {
    View, Image, StyleSheet, TouchableOpacity, Dimensions,
    KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ScrollView, Alert
} from 'react-native';
import { Text, TextInput, Button, IconButton } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { handleSendCode } from '../../../api/auth/gmail'; // Solo importamos handleSendCode aquí

const { width, height } = Dimensions.get('window');

export const RecoverScreen = ({ navigation }) => {
    const [loading, setLoading] = useState(false);

    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: { email: '' }
    });

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || "Correo inválido";
    };

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            // 1. Enviar código
            await handleSendCode(data.email);

            // 2. Navegar a la pantalla de ResetPassword
            // IMPORTANTE: Le pasamos el email para no tener que escribirlo de nuevo
            navigation.navigate('ResetPassword', { email: data.email });

        } catch (error) {
            Alert.alert("Error", error.message || "No se pudo enviar el correo.");
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
                {/* HEADER */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <IconButton icon="arrow-left" iconColor="#000" size={24} />
                        <Text style={styles.backText}>Volver</Text>
                    </TouchableOpacity>
                    <Image source={require('../../../../assets/reciclaje.png')} style={styles.illustration} resizeMode="contain" />
                </View>

                {/* FORMULARIO */}
                <View style={styles.formContainer}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={styles.circular}>
                            <Image source={require('../../../../assets/candado.png')} style={styles.ilustration2} resizeMode="contain" />
                        </View>
                        <Text variant="headlineMedium" style={styles.title}>Recuperar tu cuenta</Text>
                        <Text style={styles.subtitle}>Ingresa tu correo para recibir el código.</Text>

                        <Controller
                            control={control}
                            name="email"
                            rules={{ required: true, validate: validateEmail }}
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
                                    left={<TextInput.Icon icon="email" color="#000" />}
                                    disabled={loading}
                                />
                            )}
                        />

                        <Button
                            mode="contained"
                            onPress={handleSubmit(onSubmit)}
                            style={styles.registerBtn}
                            labelStyle={{ fontSize: 16, color: '#000' }}
                            loading={loading}
                            disabled={loading}
                        >
                            {loading ? "Enviando..." : "Enviar Correo"}
                        </Button>

                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#b1eedc' },
    header: { height: height * 0.50, justifyContent: 'flex-end', alignItems: 'center', marginBottom: -height * 0.045, zIndex: 1 },
    backButton: { position: 'absolute', top: 50, left: 10, flexDirection: 'row', alignItems: 'center', zIndex: 10 },
    backText: { fontSize: 16, color: '#000', marginLeft: -10 },
    illustration: { width: width, height: '80%', maxHeight: 300 },
    formContainer: { backgroundColor: '#018f64', flex: 1, paddingHorizontal: 25, paddingTop: 35, paddingBottom: 25, minHeight: height * 0.7 },
    circular: { alignSelf: 'center', width: width * 0.22, height: width * 0.22, borderRadius: (width * 0.22) / 2, backgroundColor: '#b1eedc', justifyContent: 'center', alignItems: 'center', marginBottom: 15, marginTop: 15 },
    ilustration2: { width: width * 0.1, height: height * 0.1, maxHeight: 100 },
    title: { color: '#000', fontSize: 22, textAlign: 'center', marginBottom: 5 },
    subtitle: { color: '#000', fontSize: 16, textAlign: 'center', marginBottom: 20, paddingHorizontal: 25 },
    input: { backgroundColor: '#B7ECDD', borderRadius: 12, marginBottom: 12, height: 50, borderTopLeftRadius: 12, borderTopRightRadius: 12, overflow: 'hidden' },
    registerBtn: { backgroundColor: '#FAC96E', borderRadius: 12, paddingVertical: 4, marginTop: 10, marginBottom: 10 },
});