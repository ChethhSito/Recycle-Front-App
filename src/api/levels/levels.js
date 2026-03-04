import axios from "axios";
import { urlLevels } from "../helper/url-auth";

// 1. Función para obtener la lista general (Lo que ya tenías)
export const getLevelsListApi = async () => {
    try {
        const { data } = await axios.get(urlLevels);
        return data;
    } catch (error) {
        throw error;
    }
};

// 2. NUEVA: Función para obtener el progreso real del usuario
export const getMyLevelStatusApi = async (token) => {
    try {
        const { data } = await axios.get(`${urlLevels}/status`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return data; // Retorna el "objeto bonito" del backend
    } catch (error) {
        throw error;
    }
};