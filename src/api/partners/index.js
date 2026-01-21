import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.3:3000/api';

const partnersApi = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getPartners = async () => {
    try {
        const response = await partnersApi.get('/partners');
        return response.data;
    } catch (error) {
        console.error('Error fetching partners:', error);
        throw error;
    }
};
