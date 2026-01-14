/**
 * API Email Services
 * Exportaciones centralizadas de servicios de email
 */

// Servicio de suspensión de cuenta
export { sendSuspensionEmail, checkResendConfig } from './suspension/suspension-email';

// Servicios de autenticación de dos factores
export { sendOTPEmail } from './two-factor/resendService';
export { 
    generateSecureOTP, 
    storeOTP, 
    verifyOTP, 
    clearOTP, 
    getStoredOTP 
} from './two-factor/otpManager';
