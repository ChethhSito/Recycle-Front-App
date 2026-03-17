import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import {
    onAddNewProgram,
    onDeleteProgram,
    onLoadError,
    onLoadingPrograms,
    onSetPrograms,
    onUpdateProgram
} from "../store/programs";
import { urlPrograms } from "../api/helper/url-auth";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage'; // 🔑 Crucial para el token


export const useProgramStore = () => {
    const { programs, isLoading, activeProgram, errorMessage } = useSelector(state => state.programs);
    const dispatch = useDispatch();

    const getAuthConfig = async () => {
        const token = await AsyncStorage.getItem('user_token');
        console.log("toke auth:", token)
        return {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };
    };

    const startLoadingPrograms = async () => {
        dispatch(onLoadingPrograms());
        try {
            const config = await getAuthConfig(); // 🎫 Obtenemos credenciales
            console.log("📡 Conectando con token a:", urlPrograms);


            const { data } = await axios.get(urlPrograms, config);
            dispatch(onSetPrograms(data));

        } catch (error) {
            console.log('❌ Error 401/500 en Programs:', error.response?.data || error.message);
            dispatch(onLoadError('Error al cargar los programas'));
        }
    };

    const startLoadingProgramByType = async (type) => {
        dispatch(onLoadingPrograms());
        try {
            const config = await getAuthConfig();
            const { data } = await axios.get(`${urlPrograms}/${type}`, config);
            dispatch(onSetPrograms(data));
        } catch (error) {
            dispatch(onLoadError('Error al filtrar programas'));
        }
    };

    const startSavingProgram = async (program) => {
        dispatch(onLoadingPrograms());
        try {
            const config = await getAuthConfig();

            if (program._id) {
                // PATCH: data es 2do param, config el 3ro
                const { data } = await axios.patch(`${urlPrograms}/${program._id}`, program, config);
                dispatch(onUpdateProgram(data));
                return;
            }

            // POST: data es 2do param, config el 3ro
            const { data } = await axios.post(urlPrograms, program, config);
            dispatch(onAddNewProgram(data));

        } catch (error) {
            dispatch(onLoadError(error.response?.data?.message || 'Error al guardar'));
        }
    };

    const startDeletingProgram = async (id) => {
        try {
            const config = await getAuthConfig();
            await axios.delete(`${urlPrograms}/${id}`, config);
            dispatch(onDeleteProgram(id));
        } catch (error) {
            dispatch(onLoadError('Error al eliminar el programa'));
        }
    };
    return {
        // Propiedades
        programs,
        isLoading,
        activeProgram,
        errorMessage,

        // Métodos
        startLoadingPrograms,
        startLoadingProgramByType,
        startSavingProgram,
        startDeletingProgram,
    };
}