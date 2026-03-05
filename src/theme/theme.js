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

export const darkTheme = {
    ...MD3DarkTheme,
    fonts: configureFonts({ config: fontConfig }),
    colors: {
        ...MD3DarkTheme.colors,
        // 🚀 Ajuste Pro: Un verde esmeralda vibrante para que resalte en la oscuridad
        primary: '#00C7A1',
        // 🌲 Ajuste Pro: Fondo gris casi negro pero con tinte verde (no azul)
        background: '#0D1110',
        // 🧱 Ajuste Pro: Tarjetas en un tono ligeramente más claro para dar profundidad
        surface: '#1A1F1E',
        surfaceVariant: '#252B2A',
        primaryContainer: '#153A2D', // Verde bosque oscuro para botones secundarios
        onPrimaryContainer: '#B1EEDC', // Letras menta sobre el contenedor oscuro

        greenMain: '#018f64',     // Mantenemos tu identidad intacta
        accent: '#FAC96E',        // El amarillo ahora funciona como acento de "atención"
        text: '#E0E3E1',          // Blanco roto para no cansar la vista
        inputBackground: '#1A1F1E',
        placeholder: '#7A8582',
        outline: '#3F4947',       // Color para los bordes de los inputs
    },
};