import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { urlBaseAuth } from "../helper/url-auth";

// Asegúrate de usar TU IP REAL
const BACKEND_URL = 'http://192.168.18.9.nip.io:3000/api/auth/google' || `${urlBaseAuth}/google`;

WebBrowser.maybeCompleteAuthSession();

export const handleGoogleLogin = async () => {
    try {
        // 🚩 LOG 1: Verificar la URL de redirección que genera Expo
        const expectedReturnUrl = Linking.createURL('/login');
        console.log("1. Mi App espera que el backend regrese a:", expectedReturnUrl);

        await WebBrowser.warmUpAsync();

        console.log("2. Abriendo navegador hacia:", BACKEND_URL);

        const result = await WebBrowser.openAuthSessionAsync(
            BACKEND_URL,
            expectedReturnUrl // 👈 Usamos la variable que acabamos de loguear
        );

        // 🚩 LOG 2: Este solo saldrá si el navegador se cierra y regresa datos
        console.log("3. El navegador regresó este resultado:", result);

        await WebBrowser.coolDownAsync();

        if (result.type === 'success' && result.url) {
            const { queryParams } = Linking.parse(result.url);
            return queryParams.token || null;
        }

        return null;
    } catch (error) {
        await WebBrowser.coolDownAsync();
        console.error("❌ Error en el flujo:", error);
        throw error;
    }
};