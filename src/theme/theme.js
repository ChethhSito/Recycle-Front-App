import { MD3LightTheme, configureFonts } from 'react-native-paper';

const fontConfig = {
    fontFamily: 'InclusiveSans-Regular',
};

export const appTheme = {
    ...MD3LightTheme,
    fonts: configureFonts({ config: fontConfig }),
    colors: {
        ...MD3LightTheme.colors,
        primary: '#31253B',      // El color oscuro del botón "Iniciar Sesión"
        background: '#018f64',   // El verde principal del fondo
        surface: '#FFFFFF',
        accent: '#00C7A1',       // El verde brillante del botón de Google
        text: '#F0F4F5',         // Texto blanco sobre fondo verde
        inputBackground: '#b1eedc', // El verde clarito de los inputs
        placeholder: '#5A7A70',
    },
};

