import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { urlBase, urlUser } from '../api/helper/url-auth';
import { onChecking, onLogin, onLogout, clearErrorMessage, onUpdateUser } from '../store/auth/authSlice';
import { Platform } from 'react-native';

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
            console.log('Data login:', data.access_token);
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
    const startRegister = async ({ fullName, email, password, role = 'CITIZEN', phone, documentNumber }) => {
        dispatch(onChecking());

        try {
            const { data } = await axios.post(`${urlBase}/register`, {
                fullName,
                email,
                password,
                role,
                phone,
                documentNumber, // Asegúrate de enviarlo si el form lo tiene
                authProvider: 'local' // 👈 ¡AGREGA ESTO AQUÍ!
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

    const startUpdateProfile = async ({ fullName, phone, imageAsset }) => {

        // 1. Obtenemos el token
        const token = await AsyncStorage.getItem('user_token');
        if (!token) return false;

        // Header común para las peticiones
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        try {
            let newAvatarUrl = user.avatarUrl; // Por defecto mantenemos la actual

            // A. ¿Hay foto nueva? SUBIRLA PRIMERO
            if (imageAsset) {
                const formData = new FormData();
                formData.append('file', {
                    uri: Platform.OS === 'ios' ? imageAsset.uri.replace('file://', '') : imageAsset.uri,
                    name: 'avatar.jpg',
                    type: 'image/jpeg',
                });

                // Petición POST para subir imagen (Content-Type especial)
                const { data: imageData } = await axios.post(`${urlUser}/avatar`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    }
                });

                // Asumimos que tu backend devuelve { avatarUrl: '...' }
                // Si tu backend devuelve { secure_url: '...' }, cámbialo aquí.
                newAvatarUrl = imageData.avatarUrl || imageData.secure_url;
            }

            // B. ACTUALIZAR DATOS DE TEXTO (PATCH)
            // Aunque no cambie la foto, actualizamos el nombre y celular
            await axios.patch(`${urlUser}/profile`, {
                fullName,
                phone
            }, config);

            // C. TODO SALIÓ BIEN: ACTUALIZAR REDUX Y STORAGE LOCAL
            const updatedUser = {
                ...user,
                fullName,
                phone,
                avatarUrl: newAvatarUrl
            };

            // 1. Redux (UI Instantánea)
            dispatch(onUpdateUser(updatedUser));

            // 2. Persistencia (Para cuando cierre la app)
            await AsyncStorage.setItem('user_data', JSON.stringify(updatedUser));

            return true; // Retornamos éxito

        } catch (error) {
            console.log('Error actualizando perfil:', error);
            // Aquí podrías despachar un mensaje de error si quieres
            return false; // Retornamos fallo
        }
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
        startUpdateProfile,
    }
}