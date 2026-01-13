// hooks/useCheckAuth.js (Para tu App)
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login, logout, checkingCredentials } from '../store/auth'; // Tus acciones

export const useCheckAuth = () => {
    const { status } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    console.log("📢 ESTADO REDUX:", status);


    useEffect(() => {
        const checkToken = async () => {
            dispatch(checkingCredentials()); // Pone estado en "Cargando..."

            // 1. Leer del disco
            const token = await AsyncStorage.getItem('user_token');

            if (!token) {
                return dispatch(logout()); // No hay token -> Login
            }

            try {
                // (Opcional) Validar token con tu backend aquí
                // const resp = await api.get('/auth/check-status'); 

                // 2. Si es válido, guardar en Redux
                dispatch(login({
                    token: token,
                    // user: resp.data.user 
                }));
            } catch (error) {
                // Si el token expiró
                await AsyncStorage.removeItem('user_token');
                dispatch(logout());
            }
        };

        checkToken();
    }, []);

    return status; // 'checking' | 'authenticated' | 'not-authenticated'
};