import { useState, useEffect, useCallback } from 'react';
import { getPartners } from './index';

export const usePartners = () => {
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPartners = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getPartners();
            setPartners(data);
            setError(null);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPartners();
    }, [fetchPartners]);

    return { partners, loading, error, refetch: fetchPartners };
};
