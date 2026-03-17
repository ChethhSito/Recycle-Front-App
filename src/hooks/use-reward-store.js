import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; // 🔑 Importante
import { urlRewards } from '../api/helper/url-auth'; // Asegúrate de definir urlRewards si prefieres
import {
    onAddNewReward,
    onDeleteReward,
    onLoadError,
    onLoadingRewards,
    onSetRewards,
    onUpdateReward,
    onSetActiveReward
} from '../store/reward';

export const useRewardsStore = () => {

    const { rewards, isLoading, activeReward, errorMessage } = useSelector(state => state.rewards);
    const dispatch = useDispatch();
    const getAuthConfig = async () => {
        const token = await AsyncStorage.getItem('user_token');
        return {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };
    };
    // ==========================================
    // CARGAR PREMIOS (Con filtro opcional)
    // ==========================================
    const startLoadingRewards = async () => {
        dispatch(onLoadingRewards());
        try {
            const config = await getAuthConfig();
            const { data } = await axios.get(`${urlRewards}`, config);
            dispatch(onSetRewards(data));
        } catch (error) {
            console.log('Error cargando premios:', error.response?.data || error);
            dispatch(onLoadError('Error al cargar los premios'));
        }
    };

    const startLoadingRewardsByCategory = async (category) => {
        dispatch(onLoadingRewards());
        try {
            const config = await getAuthConfig();
            const { data } = await axios.get(`${urlRewards}?category=${category}`, config);
            dispatch(onSetRewards(data));
        } catch (error) {
            dispatch(onLoadError('Error al cargar los premios por categoría'));
        }
    };

    // ==========================================
    // CRUD DE PREMIOS (POST, PATCH, DELETE)
    // ==========================================
    const createReward = async (reward) => {
        dispatch(onLoadingRewards());
        try {
            const config = await getAuthConfig();
            // Nota: data es el 2do param, config el 3ro
            const { data } = await axios.post(`${urlRewards}`, reward, config);
            dispatch(onAddNewReward(data));
        } catch (error) {
            dispatch(onLoadError('Error al crear el premio'));
        }
    };

    const updateReward = async (reward) => {
        dispatch(onLoadingRewards());
        try {
            const config = await getAuthConfig();
            const { data } = await axios.patch(`${urlRewards}/${reward._id}`, reward, config);
            dispatch(onUpdateReward(data));
        } catch (error) {
            dispatch(onLoadError('Error al actualizar el premio'));
        }
    };

    const deleteReward = async (rewardId) => {
        dispatch(onLoadingRewards());
        try {
            const config = await getAuthConfig();
            await axios.delete(`${urlRewards}/${rewardId}`, config);
            dispatch(onDeleteReward(rewardId));
        } catch (error) {
            dispatch(onLoadError('Error al eliminar el premio'));
        }
    };

    const setActiveReward = (reward) => {
        dispatch(onSetActiveReward(reward));
    };
    return {
        // Propiedades
        rewards,
        isLoading,
        activeReward,
        errorMessage,

        // Métodos
        startLoadingRewards,
        startLoadingRewardsByCategory,
        createReward,
        updateReward,
        deleteReward,
        setActiveReward,
    };
};