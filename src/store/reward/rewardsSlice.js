import { createSlice } from '@reduxjs/toolkit';

export const rewardsSlice = createSlice({
    name: 'rewards',
    initialState: {
        rewards: [],        // Lista de premios
        activeReward: null, // Premio seleccionado para ver detalle
        isLoading: false,
        errorMessage: undefined,
    },
    reducers: {
        onLoadingRewards: (state) => {
            state.isLoading = true;
            state.errorMessage = undefined;
        },
        onSetRewards: (state, { payload }) => {
            state.isLoading = false;
            state.rewards = payload;
        },
        onSetActiveReward: (state, { payload }) => {
            state.activeReward = payload;
        },
        onAddNewReward: (state, { payload }) => {
            state.rewards.push(payload);
            state.activeReward = null;
        },
        onUpdateReward: (state, { payload }) => {
            state.rewards = state.rewards.map(reward => {
                if (reward._id === payload._id) {
                    return payload;
                }
                return reward;
            });
        },
        onDeleteReward: (state, { payload }) => {
            state.rewards = state.rewards.filter(reward => reward._id !== payload);
        },
        onLoadError: (state, { payload }) => {
            state.isLoading = false;
            state.errorMessage = payload;
        },
        onClearRewards: (state) => {
            state.rewards = [];
            state.activeReward = null;
        }
    }
});

export const {
    onLoadingRewards,
    onSetRewards,
    onSetActiveReward,
    onAddNewReward,
    onUpdateReward,
    onDeleteReward,
    onLoadError,
    onClearRewards
} = rewardsSlice.actions;