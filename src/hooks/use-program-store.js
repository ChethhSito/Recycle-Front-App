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


export const useProgramStore = () => {
    const { programs, isLoading, activeProgram, errorMessage } = useSelector(state => state.programs);
    const dispatch = useDispatch();


    const startLoadingPrograms = async () => {
        dispatch(onLoadingPrograms());

        try {
            // 👇 1. IMPRIME LA URL PARA VER SI ES LA CORRECTA
            console.log("📡 Intentando conectar a:", urlPrograms);

            const response = await axios.get(`${urlPrograms}`);

            // 👇 2. IMPRIME TODO LA RESPUESTA, NO SOLO DATA
            console.log("✅ Respuesta Status:", response.status);
            console.log("📦 Respuesta Data:", JSON.stringify(response.data, null, 2));

            dispatch(onSetPrograms(response.data));

        } catch (error) {
            console.log('❌ Error:', error.message);
            // Si es error de red, imprime detalles
            if (error.response) console.log('Server Error:', error.response.data);
            dispatch(onLoadError('Error al cargar los programas'));
        }
    };

    const startLoadingProgramByType = async (type) => {
        dispatch(onLoadingPrograms());

        try {
            // Petición al backend
            const { data } = await axios.get(`${urlPrograms}/${type}`);
            // Guardamos en Redux
            dispatch(onSetPrograms(data));
        } catch (error) {
            console.log('Error cargando programas', error);
            dispatch(onLoadError('Error al cargar los programas'));
        }
    };

    const startSavingProgram = async (program) => {
        dispatch(onLoadingPrograms());

        try {
            // Si tiene ID (_id), es ACTUALIZACIÓN
            if (program._id) {
                const { data } = await axios.patch(`${urlBase}/programs/${program._id}`, program);
                dispatch(onUpdateProgram(data));
                return;
            }

            // Si no tiene ID, es CREACIÓN
            const { data } = await axios.post(`${urlBase}/programs`, program);
            dispatch(onAddNewProgram(data));

        } catch (error) {
            console.log(error);
            dispatch(onLoadError(error.response?.data?.message || 'Error al guardar'));
        }
    };
    const startDeletingProgram = async (id) => {
        try {
            await axios.delete(`${urlBase}/programs/${id}`);
            dispatch(onDeleteProgram(id));
        } catch (error) {
            console.log(error);
            dispatch(onLoadError('Error al eliminar'));
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