import AsyncStorage from '@react-native-async-storage/async-storage';

const OTP_STORAGE_KEY = '@2fa_otp_data';

/**
 * Genera un código OTP de 4 dígitos seguro
 * Evita códigos débiles como 0000, 1111, 1234, etc.
 */
export const generateSecureOTP = () => {
    let otp;
    let isWeak = true;
    
    while (isWeak) {
        // Generar número aleatorio de 4 dígitos (1000-9999)
        otp = Math.floor(1000 + Math.random() * 9000).toString();
        
        // Verificar que no sea un código débil
        isWeak = isWeakOTP(otp);
    }
    
    return otp;
};

/**
 * Verifica si un OTP es débil (patrones comunes)
 */
const isWeakOTP = (otp) => {
    // Patrones débiles a evitar
    const weakPatterns = [
        /^0000$/, /^1111$/, /^2222$/, /^3333$/, /^4444$/,
        /^5555$/, /^6666$/, /^7777$/, /^8888$/, /^9999$/,
        /^1234$/, /^2345$/, /^3456$/, /^4567$/, /^5678$/,
        /^6789$/, /^7890$/, /^9876$/, /^8765$/, /^7654$/,
        /^6543$/, /^5432$/, /^4321$/, /^3210$/,
    ];
    
    return weakPatterns.some(pattern => pattern.test(otp));
};

/**
 * Guarda el OTP con timestamp de expiración (10 minutos)
 */
export const storeOTP = async (otp, method, destination) => {
    try {
        const expiresAt = Date.now() + (10 * 60 * 1000); // 10 minutos
        
        const otpData = {
            code: otp,
            method,
            destination,
            expiresAt,
            used: false,
            createdAt: Date.now()
        };
        
        await AsyncStorage.setItem(OTP_STORAGE_KEY, JSON.stringify(otpData));
        
        console.log('[OTP] Código guardado. Expira en 10 minutos.');
        return true;
    } catch (error) {
        console.error('[OTP] Error al guardar:', error);
        return false;
    }
};

/**
 * Verifica si el OTP ingresado es válido
 */
export const verifyOTP = async (enteredCode) => {
    try {
        const storedData = await AsyncStorage.getItem(OTP_STORAGE_KEY);
        
        if (!storedData) {
            return { valid: false, error: 'No hay código activo' };
        }
        
        const otpData = JSON.parse(storedData);
        
        // Verificar si ya fue usado
        if (otpData.used) {
            return { valid: false, error: 'Este código ya fue utilizado' };
        }
        
        // Verificar si expiró
        if (Date.now() > otpData.expiresAt) {
            await clearOTP();
            return { valid: false, error: 'El código ha expirado. Solicita uno nuevo.' };
        }
        
        // Verificar si el código coincide
        if (enteredCode !== otpData.code) {
            return { valid: false, error: 'Código incorrecto' };
        }
        
        // Marcar como usado
        otpData.used = true;
        await AsyncStorage.setItem(OTP_STORAGE_KEY, JSON.stringify(otpData));
        
        console.log('[OTP] ✅ Código verificado correctamente');
        return { valid: true };
        
    } catch (error) {
        console.error('[OTP] Error al verificar:', error);
        return { valid: false, error: 'Error al verificar el código' };
    }
};

/**
 * Obtiene el tiempo restante hasta la expiración
 */
export const getOTPTimeRemaining = async () => {
    try {
        const storedData = await AsyncStorage.getItem(OTP_STORAGE_KEY);
        
        if (!storedData) {
            return 0;
        }
        
        const otpData = JSON.parse(storedData);
        const remaining = Math.max(0, otpData.expiresAt - Date.now());
        
        return Math.floor(remaining / 1000); // En segundos
    } catch (error) {
        return 0;
    }
};

/**
 * Limpia el OTP almacenado
 */
export const clearOTP = async () => {
    try {
        await AsyncStorage.removeItem(OTP_STORAGE_KEY);
        console.log('[OTP] Código limpiado');
    } catch (error) {
        console.error('[OTP] Error al limpiar:', error);
    }
};

/**
 * Obtiene estadísticas del OTP actual
 */
export const getOTPStats = async () => {
    try {
        const storedData = await AsyncStorage.getItem(OTP_STORAGE_KEY);
        
        if (!storedData) {
            return null;
        }
        
        const otpData = JSON.parse(storedData);
        const timeRemaining = await getOTPTimeRemaining();
        const isExpired = Date.now() > otpData.expiresAt;
        
        return {
            exists: true,
            used: otpData.used,
            expired: isExpired,
            timeRemaining,
            method: otpData.method,
            destination: otpData.destination
        };
    } catch (error) {
        return null;
    }
};
