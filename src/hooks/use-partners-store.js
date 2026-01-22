import { useSelector, useDispatch } from "react-redux";
import { partnersApi } from "../api/partners/partners";
import { useEffect, useCallback } from "react";
import { setPartners, setLoading, setError } from "../store/partners/partnersSlice";

export const usePartners = () => {
    const { partners, isLoading, error } = useSelector((state) => state.partners);
    const dispatch = useDispatch();

    const fetchPartners = useCallback(async () => {
        try {
            dispatch(setLoading(true));
            const data = await partnersApi();
            dispatch(setPartners(data));
        } catch (error) {
            dispatch(setError(error.message));
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    useEffect(() => {
        fetchPartners();
    }, [fetchPartners]);

    const refetch = useCallback(() => {
        fetchPartners();
    }, [fetchPartners]);

    return { partners, loading: isLoading, error, refetch };
}
