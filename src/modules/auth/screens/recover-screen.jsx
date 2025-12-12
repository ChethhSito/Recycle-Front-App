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
import { Text, TextInput, Button, IconButton, Icon } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';


const { width, height } = Dimensions.get('window');

export const RecoverScreen = ({ navigation }) => {
    const [showPassword, setShowPassword] = useState(false);
    const { control, handleSubmit, watch, formState: { errors } } = useForm({
        defaultValues: {
            email: '',
        }
    });
    const onSubmit = (data) => {
        console.log("Datos de recuperar:", data);
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
                <View style={styles.formContainer}>
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }} bounces={false}>
                        <View style={styles.circular}>
                            <Image
                                source={require('../../../../assets/candado.png')}
                                style={styles.ilustration2}
                                resizeMode="contain"
                            />
                        </View>

                        <Text variant="headlineMedium" style={styles.title}>Recuperar tu cuenta</Text>
                        <Text style={styles.subtitle}>Ingresa tu correo electrónico asociado y te enviaremos un enlace para restablecerla.</Text>
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
                        {/* Botón Registrarse */}
                        <Button
                            mode="contained"
                            onPress={handleSubmit(onSubmit)}
                            style={styles.registerBtn}
                            labelStyle={{ fontSize: 16, color: '#000000' }}
                            icon={({ size, color }) => (
                                <View style={{ transform: [{ rotate: '0deg' }] }}>
                                    <Icon source="email-fast" color={color} size={20} />
                                </View>
                            )}
                            contentStyle={{ flexDirection: 'row-reverse' }}
                        >
                            Enviar Correo
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
        height: height * 0.50, // Un poco más corto que el login para dar espacio a los campos
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
    ilustration2: {
        width: width * 0.1,
        height: height * 0.1,
        maxHeight: 100,
    },
    circular: {
        width: width * 0.22,
        height: width * 0.22, // CONSEJO: Usa la misma medida que el width para que sea un círculo perfecto, no un óvalo.
        borderRadius: (width * 0.22) / 2, // La mitad del ancho para que sea redondo perfecto

        backgroundColor: '#b1eedc',
        justifyContent: 'center', // Centra la imagen del candado verticalmente
        alignItems: 'center',     // Centra la imagen del candado horizontalmente

        // --- CORRECCIÓN DE POSICIÓN ---
        alignSelf: 'center',      // <--- ESTO centra el círculo en la pantalla automáticamente
        marginBottom: 15,         // <--- Espacio entre el candado y el título "Recuperar tu cuenta"
        marginTop: 15,
    },
    formContainer: {
        backgroundColor: '#018f64', // Pasto
        flex: 1,
        paddingHorizontal: 25,
        paddingTop: 35,
        paddingBottom: 25,
        minHeight: height * 0.7, // Asegura que cubra el fondo
    },
    title: {
        color: '#000000',
        fontSize: 22,
        fontFamily: 'InclusiveSans-Regular',
        marginBottom: 5,
        textAlign: 'center',
    },
    subtitle: {
        color: '#000000',
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
        paddingHorizontal: 25,
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
        backgroundColor: '#FAC96E',
        borderRadius: 12,
        paddingVertical: 4,
        marginTop: 10,
        marginBottom: 10,
        fontSize: 16,
    },

}); 