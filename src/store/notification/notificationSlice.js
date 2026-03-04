import { createSlice } from '@reduxjs/toolkit';

export const notificationSlice = createSlice({
    name: 'notification',
    initialState: {
        pendingNotification: null, // Guardará { screen: 'MyRequestDetail', id: '...' }
    },
    reducers: {
        setPendingNotification: (state, action) => {
            state.pendingNotification = action.payload;
        },
        clearPendingNotification: (state) => {
            state.pendingNotification = null;
        },
    },
});

export const { setPendingNotification, clearPendingNotification } = notificationSlice.actions;