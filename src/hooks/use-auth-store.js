import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { urlBase } from '../api/helper/url-auth';
import { onChecking, onLogin, onLogout, clearErrorMessage } from '../store/auth/authSlice';

export const useAuthStore = () => {

    const { status, user, errorMessage } = useSelector(state => state.auth);
    const dispatch = useDispatch();

    // ==========================================
    // 1. INICIAR SESIÓN (LOGIN)
    // ==========================================
    const startLogin = async ({ email, password }) => {
        // 1. Ponemos estado en "cargando"
        dispatch(onChecking());

        try {
            // 2. Petición HTTP
            const { data } = await axios.post(`${urlBase}/login`, { email, password });
            console.log('Data login:', data);
            // 3. Guardar en Disco
            await AsyncStorage.setItem('user_token', data.access_token);
            // Si quieres guardar datos básicos del user para uso offline:
            await AsyncStorage.setItem('user_data', JSON.stringify(data.user));

            // 4. Actualizar Redux
            dispatch(onLogin(data.user));

        } catch (error) {
            console.log('Error login:', error);
            // Manejo de error seguro
            const msg = error.response?.data?.message || 'Error al iniciar sesión';
            dispatch(onLogout(msg));

            // Limpiar mensaje de error después de un tiempo (opcional)
            setTimeout(() => {
                dispatch(clearErrorMessage());
            }, 4000);
        }
    };

    // ==========================================
    // 2. REGISTRO
    // ==========================================
    const startRegister = async ({ fullName, email, password, role = 'CITIZEN' }) => {
        dispatch(onChecking());

        try {
            const { data } = await axios.post(`${urlBase}/register`, {
                fullName, email, password, role
            });

            // Usualmente el registro loguea automáticamente. 
            // Si tu backend devuelve token al registrar:
            await AsyncStorage.setItem('user_token', data.access_token);
            await AsyncStorage.setItem('user_data', JSON.stringify(data.user));

            dispatch(onLogin(data.user));

        } catch (error) {
            const msg = error.response?.data?.message || 'Error en el registro';
            dispatch(onLogout(msg));
            setTimeout(() => { dispatch(clearErrorMessage()); }, 4000);
        }
    };

    // ==========================================
    // 3. VERIFICAR TOKEN (CheckAuth)
    // ==========================================
    const checkAuthToken = async () => {
        const token = await AsyncStorage.getItem('user_token');

        // Si no hay token, fuera.
        if (!token) return dispatch(onLogout());

        try {
            // Configuramos el header con el token que tenemos guardado
            const { data } = await axios.get(`${urlBase}/check-status`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            // Si el backend responde OK, actualizamos todo con la data FRESCA
            await AsyncStorage.setItem('user_token', data.access_token); // Token renovado
            await AsyncStorage.setItem('user_data', JSON.stringify(data.user)); // Datos frescos

            // Actualizamos Redux con los puntos y nivel nuevos (1500 XP, Nivel 3)
            dispatch(onLogin(data.user));

        } catch (error) {
            // Si el token expiró o el backend falla, limpiamos todo
            console.log("Token inválido o expirado");
            await AsyncStorage.clear();
            dispatch(onLogout());
        }
    };

    // ==========================================
    // 4. CERRAR SESIÓN (LOGOUT)
    // ==========================================
    const startLogout = async () => {
        await AsyncStorage.clear(); // Borra token, datos, todo.
        dispatch(onLogout());
    };

    return {
        // Propiedades
        status,
        user,
        errorMessage,

        // Métodos
        startLogin,
        startRegister,
        checkAuthToken,
        startLogout,
    }
}