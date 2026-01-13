import { urlBaseAuth } from "../helper/url-auth";
import { urlBase } from "../helper/url-auth";
import axios from 'axios';

export const handleSendCode = async (email) => {
    try {
        // Axios detecta automáticamente que es JSON.
        // No necesitas JSON.stringify ni headers manuales.
        const response = await axios.post(`${urlBase}/forgot-password`, {
            email: email
        });

        // Axios devuelve la respuesta ya parseada en .data
        return response.data;

    } catch (error) {
        console.error("Error en handleSendCode:", error);

        // Manejo de errores específico de Axios
        if (error.response && error.response.data) {
            // El backend respondió con un error (ej: 404 Usuario no encontrado)
            throw new Error(error.response.data.message || 'Error al enviar el correo');
        } else {
            // Error de conexión o red
            throw new Error('Error de conexión con el servidor');
        }
    }
}

// 2. RESTABLECER PASSWORD (Reset Password)
export const handleResetPassword = async (email, code, newPassword) => {
    try {
        const response = await axios.post(`${urlBase}/reset-password`, {
            email,
            code,
            newPassword
        });

        return response.data;

    } catch (error) {
        console.error("Error en handleResetPassword:", error);

        if (error.response && error.response.data) {
            throw new Error(error.response.data.message || 'Error al cambiar contraseña');
        } else {
            throw new Error('Error de conexión con el servidor');
        }
    }
};