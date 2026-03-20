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
        dispatch(onChecking());
        try {
            const { data } = await axios.post(`${urlBase}/login`, { email, password });

            await AsyncStorage.setItem('user_token', data.access_token);
            await AsyncStorage.setItem('user_data', JSON.stringify(data.user));

            dispatch(onLogin(data.user));
        } catch (error) {
            const msg = error.response?.data?.message || 'Error al iniciar sesión';
            dispatch(onLogout(msg));
            setTimeout(() => { dispatch(clearErrorMessage()); }, 4000);
        }
    };

    // ==========================================
    // 2. REGISTRO
    // ==========================================
    const startRegister = async ({ fullName, email, password, role = 'CITIZEN', phone, documentNumber }) => {
        dispatch(onChecking());
        try {
            const { data } = await axios.post(`${urlBase}/register`, {
                fullName, email, password, role, phone, documentNumber,
                authProvider: 'local'
            });

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
    // 3. VERIFICAR TOKEN / REFRESCAR DATOS (CheckAuth)
    // ==========================================
    const checkAuthToken = async () => {
        const token = await AsyncStorage.getItem('user_token');
        if (!token) return dispatch(onLogout());

        try {
            const { data } = await axios.get(`${urlBase}/check-status`, {
                headers: { 'Authorization': `Bearer ${token}` },
                timeout: 5000
            });

            await AsyncStorage.setItem('user_token', data.access_token);
            await AsyncStorage.setItem('user_data', JSON.stringify(data.user));

            dispatch(onLogin(data.user));
        } catch (error) {
            await AsyncStorage.clear();
            dispatch(onLogout());
        }
    };

    // ==========================================
    // 4. REFRESCAR PERFIL (NUEVO - Para puntos y niveles)
    // ==========================================
    const startRefreshingUser = async () => {
        const token = await AsyncStorage.getItem('user_token');
        if (!token) return;

        try {
            // Usamos la URL que ya tienes definida: urlUser
            const { data } = await axios.get(`${urlUser}/profile`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            // 1. Guardamos en el storage para persistencia
            await AsyncStorage.setItem('user_data', JSON.stringify(data));

            // 2. Actualizamos Redux (Asegúrate de usar onUpdateUser que es tu acción)
            dispatch(onUpdateUser(data));

            console.log("✅ Usuario refrescado con éxito");
        } catch (error) {
            console.error("❌ Error refrescando usuario desde el store:", error.response?.data || error.message);
        }
    };

    // ==========================================
    // 5. CERRAR SESIÓN (LOGOUT)
    // ==========================================
    const startLogout = async () => {
        await AsyncStorage.clear();
        dispatch(onLogout());
    };

    // ==========================================
    // 6. ACTUALIZAR PERFIL (EDITAR DATOS)
    // ==========================================
    const startUpdateProfile = async ({ fullName, phone, imageAsset }) => {
        const token = await AsyncStorage.getItem('user_token');
        if (!token) return false;

        const config = { headers: { Authorization: `Bearer ${token}` } };

        try {
            let newAvatarUrl = user.avatarUrl;

            if (imageAsset) {
                const formData = new FormData();
                formData.append('file', {
                    uri: Platform.OS === 'ios' ? imageAsset.uri.replace('file://', '') : imageAsset.uri,
                    name: 'avatar.jpg',
                    type: 'image/jpeg',
                });

                const { data: imageData } = await axios.post(`${urlUser}/avatar`, formData, {
                    headers: { ...config.headers, 'Content-Type': 'multipart/form-data' }
                });
                newAvatarUrl = imageData.avatarUrl || imageData.secure_url;
            }

            await axios.patch(`${urlUser}/profile`, { fullName, phone }, config);

            const updatedUser = { ...user, fullName, phone, avatarUrl: newAvatarUrl };

            dispatch(onUpdateUser(updatedUser));
            await AsyncStorage.setItem('user_data', JSON.stringify(updatedUser));

            return true;
        } catch (error) {
            return false;
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
        startRefreshingUser, // 👈 Exportado para usar en HomeScreen
    };
};