import { createSlice } from '@reduxjs/toolkit';

export const requestSlice = createSlice({
    name: 'request',
    initialState: {
        isLoading: false,
        requests: [], // Lista para RequestListScreen
        nearbyRequests: [],  // 👈 NUEVO: Solicitudes cercanas para el mapa
        errorMessage: null,
    },
    reducers: {
        onLoading: (state) => {
            state.isLoading = true;
        },
        onSetRequests: (state, { payload }) => {
            state.isLoading = false;
            state.requests = payload;
        },
        onSetNearbyRequests: (state, { payload }) => {
            state.isLoading = false;
            state.nearbyRequests = payload;
        },
        onAddNewRequest: (state, { payload }) => {
            state.requests.unshift(payload);
            state.isLoading = false;
        },
        onError: (state, { payload }) => { // He agregado payload para guardar el mensaje si quieres
            state.isLoading = false;
            state.errorMessage = payload;
        }
    }
});

export const { onLoading, onSetRequests, onSetNearbyRequests, onAddNewRequest, onError } = requestSlice.actions;