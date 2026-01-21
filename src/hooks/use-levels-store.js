import { useSelector } from "react-redux";
import { levelsApi } from "../api/levels/levels";
import { useEffect } from "react";
import { setLevels, setLoading, setError } from "../store/levels/levelsSlice";
import { useDispatch } from "react-redux";

export const useLevels = () => {
    const { levels, loading, error } = useSelector((state) => state.levels);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchLevels = async () => {
            try {
                dispatch(setLoading(true));
                const data = await levelsApi();
                dispatch(setLevels(data));
            } catch (error) {
                dispatch(setError(error.message));
            } finally {
                dispatch(setLoading(false));
            }
        };
        fetchLevels();
    }, []);

    return { levels, loading, error };

}