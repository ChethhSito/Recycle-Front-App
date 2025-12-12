import React from 'react';
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
import { Text, TextInput, Button, useTheme } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import Svg, { Path } from 'react-native-svg';
import { GoogleIcon } from '../../../shared/svgs/google';



const { width, height } = Dimensions.get('window');
const os = Platform.OS;
console.log(os);


export const LoginScreen = () => {
    const theme = useTheme();
    // Configuración del formulario
    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: { email: '', password: '' }
    });

    const onSubmit = (data) => console.log(data);

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
                // CAMBIO 1: Quitamos el array y dejamos solo styles.container
                // El color de fondo lo manejamos en el estilo directo
                style={styles.container}
                behavior={Platform.OS === 'android' ? 'padding' : 'height'}
                // CAMBIO 2: Esto ayuda a ajustar el teclado
                keyboardVerticalOffset={Platform.OS === 'android' ? 0 : 20}
            >
                {/* 1. ILUSTRACIÓN SUPERIOR */}
                <View style={styles.header}>
                    <Image
                        alt='Recycle'
                        source={require('../../../../assets/reciclaje.png')} // Cambiado a .jpg según tu archivo real
                        style={styles.illustration}
                        resizeMode="contain"
                    />
                </View>

                {/* 2. FORMULARIO */}
                <View style={styles.formContainer}>
                    <Text variant="headlineMedium" style={styles.title}>Inicia Sesión</Text>

                    {/* Inputs... (igual que antes) */}
                    <Controller
                        control={control}
                        name="email"
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
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                mode="flat"
                                placeholder="Contraseña:"
                                placeholderTextColor="#000000"
                                style={styles.input}
                                value={value}
                                onChangeText={onChange}
                                secureTextEntry
                                underlineColor="transparent"
                                activeUnderlineColor="transparent"
                                left={<TextInput.Icon icon="lock" color="#000000" />}
                                right={<TextInput.Icon icon="eye" color="#000000" />}
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
                        icon={() => <GoogleIcon />} // Asegúrate de pasar el componente así si es SVG
                        onPress={() => console.log('Google Login')}
                        style={styles.googleBtn}
                        labelStyle={{ color: '#000000', fontSize: 16 }}
                    >
                        Iniciar sesión con Google
                    </Button>

                    <View style={styles.registerContainer}>
                        <Text style={{ color: '#000000', fontSize: 16 }}>¿Aún no tienes Cuenta? </Text>
                        <TouchableOpacity>
                            <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Regístrate</Text>
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
        backgroundColor: '#b1eedc', // Tu verde de fondo
    },
    header: {
        // En vez de flex fijo, le damos una altura basada en la pantalla pero flexible
        height: height * 0.40,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 0,
        marginBottom: -30, // El truco para que se monte
        zIndex: 1,
    },
    illustration: {
        width: width, // 90% del ancho
        height: '85%', // Ocupa el 85% del header, no más
        // maxHeight elimina el problema en pantallas muy largas
        maxHeight: 300,
    },
    formContainer: {
        backgroundColor: '#018f64',
        flex: 1, // "Toma todo el espacio que sobre" (importante para pantallas largas)
        paddingHorizontal: 30,
        paddingTop: 25,
        minHeight: height,
        paddingBottom: 20,
        // justifyContent: 'center', // Opcional: Si quieres centrar verticalmente el form
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