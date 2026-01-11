import { urlBaseAuth } from "../helper/url-auth";
import { urlBase } from "../helper/url-auth";
import axios from 'axios';
// 1. LOGIN MANUAL
export const handleManualLogin = async (email, password) => {
    try {
        // Axios detecta automáticamente que es JSON
        const response = await axios.post(`${urlBase}/login`, {
            email,
            password
        });

        // Axios ya te da los datos limpios en .data
        return response.data;

    } catch (error) {
        console.error("Login Error:", error);

        // Axios guarda el error del backend en error.response
        if (error.response && error.response.data) {
            throw new Error(error.response.data.message || 'Error al iniciar sesión');
        } else {
            throw new Error('Error de conexión o servidor');
        }
    }
};

// 2. REGISTRO MANUAL
export const handleManualRegister = async (userData) => {
    try {
        const response = await axios.post(`${urlBase}/register`, userData);

        console.log("Data de registro:", response.data);
        return response.data;

    } catch (error) {
        console.error("Register Error:", error);

        if (error.response && error.response.data) {
            // Aquí capturamos mensajes como "El correo ya está registrado"
            throw new Error(error.response.data.message || 'Error en el registro');
        } else {
            throw new Error('Error de conexión o servidor');
        }
    }
};