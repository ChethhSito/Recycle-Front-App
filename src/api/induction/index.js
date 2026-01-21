import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.3:3000/api';

const inductionApi = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getInductionVideos = async () => {
    try {
        const response = await inductionApi.get('/induction');
        return response.data;
    } catch (error) {
        console.error('Error fetching induction videos:', error);
        throw error;
    }
};

export const incrementVideoView = async (id) => {
    try {
        const response = await inductionApi.patch(`/induction/${id}/view`);
        return response.data;
    } catch (error) {
        console.error('Error incrementing video view:', error);
        throw error;
    }
};
