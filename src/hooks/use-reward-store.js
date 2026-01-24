import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
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

    // ==========================================
    // CARGAR PREMIOS (Con filtro opcional)
    // ==========================================
    const startLoadingRewards = async () => {
        dispatch(onLoadingRewards());
        try {
            const { data } = await axios.get(`${urlRewards}`);

            dispatch(onSetRewards(data));

        } catch (error) {
            console.log('Error cargando premios:', error);
            dispatch(onLoadError('Error al cargar los premios'));
        }
    };

    const startLoadingRewardsByCategory = async (category) => {
        dispatch(onLoadingRewards());
        try {
            const { data } = await axios.get(`${urlRewards}?category=${category}`);
            dispatch(onSetRewards(data));
        } catch (error) {
            console.log('Error cargando premios:', error);
            dispatch(onLoadError('Error al cargar los premios'));
        }
    };

    const createReward = async (reward) => {
        dispatch(onLoadingRewards());
        try {
            const { data } = await axios.post(`${urlRewards}`, reward);
            dispatch(onAddNewReward(data));
        } catch (error) {
            console.log('Error creando premio:', error);
            dispatch(onLoadError('Error al crear el premio'));
        }
    };

    const updateReward = async (reward) => {
        dispatch(onLoadingRewards());
        try {
            const { data } = await axios.patch(`${urlRewards}/${reward._id}`, reward);
            dispatch(onUpdateReward(data));
        } catch (error) {
            console.log('Error actualizando premio:', error);
            dispatch(onLoadError('Error al actualizar el premio'));
        }
    };

    const deleteReward = async (rewardId) => {
        dispatch(onLoadingRewards());
        try {
            await axios.delete(`${urlRewards}/${rewardId}`);
            dispatch(onDeleteReward(rewardId));
        } catch (error) {
            console.log('Error eliminando premio:', error);
            dispatch(onLoadError('Error al eliminar el premio'));
        }
    };

    // ==========================================
    // SELECCIONAR PREMIO ACTIVO
    // ==========================================
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