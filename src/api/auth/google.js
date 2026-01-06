import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';

// Asegúrate de usar TU IP REAL
const BACKEND_URL = 'http://192.168.18.8.nip.io:3000/api/auth/google';

WebBrowser.maybeCompleteAuthSession();

export const handleGoogleLogin = async () => {
    try {
        // 1. PREPARAR EL NAVEGADOR (Mejora la velocidad y consistencia)
        await WebBrowser.warmUpAsync();

        const result = await WebBrowser.openAuthSessionAsync(
            BACKEND_URL,
            Linking.createURL('/login')
        );

        // 2. ENFRIAR EL NAVEGADOR (Crucial para que funcione la segunda vez)
        await WebBrowser.coolDownAsync();

        if (result.type === 'success' && result.url) {
            const { queryParams } = Linking.parse(result.url);
            return queryParams.token || null;
        }

        // Si el usuario lo cerró manualmente
        return null;

    } catch (error) {
        // Asegurarnos de enfriar el navegador incluso si falla
        await WebBrowser.coolDownAsync();
        console.error("Error en Google Login helper:", error);
        throw error;
    }
};