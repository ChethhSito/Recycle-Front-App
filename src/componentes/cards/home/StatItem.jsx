import React from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';

export const StatItem = ({ image, label, value, overlayColor }) => {
    // Usamos overlayColor como el color de fondo de toda la tarjeta
    // Asegúrate de que en impactData el overlayColor no sea tan transparente
    // (ej: usa 'rgba(212, 231, 255, 1)' o colores sólidos hexadecimales)

    return (
        <View style={[styles.card, { backgroundColor: overlayColor }]}>

            {/* Contenedor para la imagen decorativa */}
            <View style={styles.imageContainer}>
                <Image
                    source={image}
                    style={styles.image}
                    // Usamos "cover" para que la imagen llene el contenedor redondeado
                    resizeMode="cover"
                />
            </View>

            {/* Contenido alineado a la izquierda */}
            <View style={styles.content}>
                <Text style={styles.label}>{label}</Text>
                <Text style={styles.value}>{value}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        width: '48%',
        height: 110, // Altura un poco menor para que se vea más compacto
        borderRadius: 20,
        marginBottom: 15,
        overflow: 'hidden', // Corta la imagen si se sale de la esquina del card
        elevation: 0, // Sin sombra para un look "flat" moderno, o usa 2 si prefieres
        padding: 15, // Padding interno para el texto
        justifyContent: 'space-between', // Separa contenido si hiciera falta
    },
    // Nuevo contenedor para la imagen
    imageContainer: {
        position: 'absolute',
        bottom: -15, // La bajamos un poco para que asome
        right: -15,  // La movemos a la derecha
        width: 100,   // Tamaño controlado
        height: 100,
        opacity: 0.8, // Un poco transparente para que se fusione bien
        transform: [{ rotate: '-10deg' }], // Rotación sutil
        borderRadius: 20, // Aquí aplicamos el redondeo
        overflow: 'hidden', // IMPORTANTE: Para que la imagen se recorte a los bordes redondeados
    },
    // Estilo para la imagen dentro del contenedor
    image: {
        width: '100%',
        height: '100%',
    },
    content: {
        zIndex: 1, // El texto siempre arriba
        justifyContent: 'center',
        height: '100%',
    },
    label: {
        fontSize: 14,
        color: '#444', // Gris oscuro
        fontWeight: '600',
        marginBottom: 5,
    },
    value: {
        fontSize: 18, // Número más grande
        fontWeight: 'bold',
        color: '#000',
    }
});