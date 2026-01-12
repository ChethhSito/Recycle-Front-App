import { createSlice } from '@reduxjs/toolkit';

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        status: 'checking', // 'checking', 'not-authenticated', 'authenticated'
        user: null,         // Aquí guardaremos los datos del usuario (uid, email, displayName)
        errorMessage: null,
    },
    reducers: {
        login: (state, { payload }) => {
            state.status = 'authenticated';
            state.user = payload;
            state.errorMessage = null;
        },
        logout: (state, { payload }) => {
            state.status = 'not-authenticated';
            state.user = null;
            state.errorMessage = payload?.errorMessage;
        },
        checkingCredentials: (state) => {
            state.status = 'checking';
        }
    }
});

// Exportamos las acciones para usarlas en los componentes
export const { login, logout, checkingCredentials } = authSlice.actions;