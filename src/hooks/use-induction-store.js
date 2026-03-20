import { useSelector, useDispatch } from "react-redux";
import { inductionApi, registerViewApi } from "../api/induction/induction";
import { useEffect, useCallback } from "react";
import { setInduction, setLoading, setError } from "../store/induction/inductionSlice";

export const useInduction = () => {
    const { induction, isLoading, error } = useSelector((state) => state.induction);
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const fetchInduction = useCallback(async () => {
        try {
            dispatch(setLoading(true));
            const data = await inductionApi();
            dispatch(setInduction(data));
        } catch (error) {
            dispatch(setError(error.message));
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    useEffect(() => {
        fetchInduction();
    }, [fetchInduction]);

    const refetch = useCallback(() => {
        fetchInduction();
    }, [fetchInduction]);

    // 4. Función de registro de vista actualizada
    const registerView = async (id) => {
        try {
            // Validamos que el usuario exista antes de intentar sumar puntos
            if (!user?._id) {
                console.warn("No se puede registrar la vista: Usuario no identificado");
                return;
            }

            // Llamamos a la API enviando ID de inducción e ID de usuario
            await registerViewApi(id, user._id);

            // 5. IMPORTANTE: Refetch después de registrar la vista
            // Esto hará que el contador de 'views' se actualice en la pantalla del móvil
            refetch();

        } catch (error) {
            console.error("Error en registerView:", error);
        }
    };

    return {
        videos: induction,
        loading: isLoading,
        error,
        refetch,
        registerView
    };
};