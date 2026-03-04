import { MD3LightTheme, MD3DarkTheme, configureFonts } from 'react-native-paper';

// 1. Configuración de fuentes única para ambos temas
const fontConfig = {
    fontFamily: 'InclusiveSans-Regular',
    fontWeight: 'InclusiveSans-Bold',
};

// 2. Definición del Modo Claro (Tus colores actuales)
export const lightTheme = {
    ...MD3LightTheme,
    fonts: configureFonts({ config: fontConfig }),
    colors: {
        ...MD3LightTheme.colors,
        primaryContainer: '#E8F5F1', // 👈 Aquí defines ese verde menta suave para las cards
        onPrimaryContainer: '#018f64',
        primary: '#31253B',
        background: '#b1eedc',    // Tu color de fondo principal (Mint)
        surface: '#FFFFFF',
        accent: '#00C7A1',
        greenMain: '#018f64',     // Guardamos el verde fuerte como color personalizado
        text: '#31253B',          // Texto oscuro para fondo clarito
        inputBackground: '#FFFFFF',
        placeholder: '#5A7A70',
    },
};

// 3. Definición del Modo Oscuro
export const darkTheme = {
    ...MD3DarkTheme, // 🚨 Importante: Usamos la base oscura de Paper
    fonts: configureFonts({ config: fontConfig }),
    colors: {
        ...MD3DarkTheme.colors,
        primary: '#264f6e',       // Cambiamos el morado por un amarillo/oro que resalte
        background: '#051d30',    // El fondo b1eedc cambia a un gris casi negro
        primaryContainer: '#2D2D2D', // 👈 En modo oscuro, un gris carbón para los contenedores
        onPrimaryContainer: '#FAC96E',
        surface: '#1E1E1E',       // Las tarjetas serán un gris ligeramente más claro
        accent: '#00C7A1',
        greenMain: '#018f64',     // Mantenemos tu identidad verde
        text: '#F0F4F5',          // Texto claro para fondo oscuro
        inputBackground: '#2C2C2C',
        placeholder: '#A0A0A0',
    },
};