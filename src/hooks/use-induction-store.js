import { useSelector, useDispatch } from "react-redux";
import { inductionApi } from "../api/induction/induction";
import { useEffect, useCallback } from "react";
import { setInduction, setLoading, setError } from "../store/induction/inductionSlice";

export const useInduction = () => {
    const { induction, isLoading, error } = useSelector((state) => state.induction);
    const dispatch = useDispatch();

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

    const registerView = async (id) => {
        try {
            // Lógica para registrar vista (podría ser otra acción o llamada directa)
            // Aquí asumimos que simplemente se llama a la API, sin afectar el store global necesariamente,
            // o quizás sí se quiera actualizar el contador localmente.
            // Como no tengo importado la API de view aquí, debería importarla.
            // Pero mejor, lo haré simple: llamar a la API importada.
            const { registerViewApi } = require('../api/induction/induction'); // Lazy import or move import top
            await registerViewApi(id);
            // Opcional: refetch para actualizar vistas
            // refetch(); 
        } catch (error) {
            console.log(error);
        }
    };

    return { videos: induction, loading: isLoading, error, refetch, registerView };
}
