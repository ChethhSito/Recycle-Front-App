import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import LottieView from 'lottie-react-native';
import { useTheme } from 'react-native-paper';

export const SplashScreen = ({ onFinish }) => {
    const animation = useRef(null);
    const theme = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: '#0FA97F' }]}>
            <View style={styles.contentContainer}>
                <LottieView
                    autoPlay
                    ref={animation}
                    style={{
                        width: 250,
                        height: 250,
                        backgroundColor: 'transparent',
                    }}
                    // AQUÍ CARGAS TU ARCHIVO JSON DESCARGADO
                    // Si aún no tienes uno, comenta esta línea para que no de error
                    source={require('../../../../assets/animations/Recycle.json')}

                    // Configuración:
                    loop={false} // Que no se repita infinitamente
                    speed={1}    // Velocidad normal
                    onAnimationFinish={() => {
                        // Cuando termina la animación, ejecutamos la función que nos pasan
                        // para cambiar de pantalla
                        console.log('Animación terminada');
                        if (onFinish) onFinish();
                    }}
                />

                {/* Texto opcional debajo de la animación */}
                <Text style={styles.text}>Cargando...</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    contentContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        marginTop: 20,
        fontSize: 18,
        color: '#000000',
        fontFamily: 'InclusiveSans-Regular', // Usando tu fuente
        letterSpacing: 2,
    }
});