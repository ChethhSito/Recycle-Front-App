import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Text, TextInput, Button, useTheme } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import Svg, { Path } from 'react-native-svg';
import { GoogleIcon } from '../../../shared/svgs/google';


const { width } = Dimensions.get('window');



export const LoginScreen = () => {
    const theme = useTheme();
    // Configuración del formulario
    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: { email: '', password: '' }
    });

    const onSubmit = (data) => console.log(data);

    return (
        <View style={[styles.container, { backgroundColor: '#B7ECDD' }]}>

            {/* 1. ILUSTRACIÓN SUPERIOR */}
            <View style={styles.header}>
                {/* Aquí iría tu imagen de los personajes reciclando */}
                <Image
                    alt='Recycle'
                    source={require('../../../../assets/reciclaje.jpg')}
                    style={styles.illustration}
                    resizeMode="contain"
                />
            </View>

            {/* 2. FORMULARIO */}
            <View style={styles.formContainer}>
                <Text variant="headlineMedium" style={styles.title}>Inicia Sesión</Text>

                {/* Input Email */}
                <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            mode="flat"
                            placeholder="Email:"
                            placeholderTextColor="#000000"
                            placeholderOpacity={0.7}
                            style={styles.input}
                            value={value}
                            onChangeText={onChange}
                            underlineColor="transparent"
                            activeUnderlineColor="transparent"
                            left={<TextInput.Icon icon="email" color="#000000" opacity={0.7} />}
                        />
                    )}
                />

                {/* Input Password */}
                <Controller
                    control={control}
                    name="password"
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            mode="flat"
                            placeholder="Contraseña:"
                            placeholderTextColor="#000000"
                            placeholderOpacity={0.7}
                            style={styles.input}
                            value={value}
                            onChangeText={onChange}
                            secureTextEntry
                            underlineColor="transparent"
                            activeUnderlineColor="transparent"
                            left={<TextInput.Icon icon="lock" color="#000000" opacity={0.7} />}
                            right={<TextInput.Icon icon="eye" color="#000000" opacity={0.7} />}
                        />
                    )}
                />

                <TouchableOpacity>
                    <Text style={styles.forgotPass}>¿Olvidaste tu contraseña?</Text>
                </TouchableOpacity>

                {/* Botón Iniciar Sesión (Oscuro) */}
                <Button
                    mode="contained"
                    onPress={handleSubmit(onSubmit)}
                    style={styles.loginBtn}
                    labelStyle={{ fontSize: 16 }}
                >
                    Iniciar Sesión
                </Button>

                {/* Botón Google (Verde claro) */}
                <Button
                    mode="contained"
                    icon={GoogleIcon}
                    onPress={() => console.log('Google Login')}
                    style={styles.googleBtn}
                    labelStyle={{ color: '#000000', fontSize: 16 }} // Texto oscuro
                >
                    Iniciar sesión con Google
                </Button>

                <View style={styles.registerContainer}>
                    <Text style={{ color: '#000000', fontSize: 16 }}>¿Aún no tienes Cuenta? </Text>
                    <TouchableOpacity>
                        <Text style={{ color: '#fff', fontSize: 16 }}>Regístrate</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        fontFamily: 'InclusiveSans-Regular',
        flex: 1,
        backgroundColor: '#B7ECDD', // Tu verde de fondo
    },
    header: {
        flex: 0.45, // Le damos un poco más de espacio al cielo (45%)
        justifyContent: 'flex-end', // Esto pega la imagen al "pasto" de abajo
        alignItems: 'center',
        paddingBottom: 0,
        marginBottom: -30, // Hacemos que la imagen pise un poco el verde (efecto 3D)
        zIndex: 1, // Asegura que la imagen esté por encima del borde verde
    },
    illustration: {
        // AL HACERLA MÁS PEQUEÑA, BAJARÁ VISUALMENTE
        width: width, // 85% del ancho (antes era 100%)
        height: width, // Mantenemos proporción cuadrada
        maxHeight: 330,
    },
    formContainer: {
        backgroundColor: '#00926F',
        flex: 0.55,
        // CAMBIO 4: El color VERDE OSCURO ahora va aquí (Pasto)
        paddingHorizontal: 35,
        // Añadimos padding superior porque quitamos el espacio del header
        paddingTop: 25,
        // CAMBIO 5: Bordes redondeados arriba para efecto "colina"

    },
    title: {
        color: '#000000',
        fontSize: 22,
        marginBottom: 20,
        textAlign: 'left',
    },
    input: {
        backgroundColor: '#B7ECDD', // Verde clarito input
        borderRadius: 12,         // Bordes muy redondos como el diseño
        marginBottom: 15,
        height: 55,
        borderTopLeftRadius: 12,  // Fix para Paper
        borderTopRightRadius: 12, // Fix para Paper
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
        backgroundColor: '#2D2338', // Color berenjena/oscuro
        borderRadius: 15,
        paddingVertical: 4,
        marginBottom: 15,
    },
    googleBtn: {
        fontFamily: 'InclusiveSans-Regular',
        backgroundColor: '#00C7A1', // Verde brillante
        borderRadius: 15,
        paddingVertical: 4,
        fontSize: 16,
    },
    registerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
        fontSize: 16,
    }
});