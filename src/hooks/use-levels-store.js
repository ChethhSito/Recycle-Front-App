import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
// 1. Importamos las nuevas funciones de la API
import { getLevelsListApi, getMyLevelStatusApi } from "../api/levels/levels";
import {
    setLevels,
    setUserLevelStatus, // 🚨 Debes crear esta acción en tu slice
    setLoading,
    setError
} from "../store/levels/levelsSlice";

export const useLevels = () => {
    // 2. Extraemos el status del usuario del estado global
    const { levels, userLevelStatus, loading, error } = useSelector((state) => state.levels);
    const dispatch = useDispatch();

    // 3. Función para cargar la lista general (para colores y nombres)
    const fetchLevelsList = async () => {
        try {
            dispatch(setLoading(true));
            const data = await getLevelsListApi();
            dispatch(setLevels(data));
        } catch (error) {
            dispatch(setError(error.message));
        } finally {
            dispatch(setLoading(false));
        }
    };

    // 4. NUEVA: Función para cargar el progreso real del usuario
    const startLoadingUserStatus = async () => {
        console.log("Cargando status de nivel...");
        try {
            const token = await AsyncStorage.getItem('user_token');
            if (!token) return;

            const status = await getMyLevelStatusApi(token);

            dispatch(setUserLevelStatus(status)); // Guardamos el "objeto bonito"
            return status;
        } catch (error) {
            console.log("Error cargando status de nivel:", error);
        }
    };

    // Al montar el hook, cargamos la lista general de niveles
    useEffect(() => {
        fetchLevelsList();
    }, []);

    return {
        levels,
        userLevelStatus, // 🚨 Ahora exponemos el progreso real
        loading,
        error,
        startLoadingUserStatus // Para refrescar tras un recojo
    };
};